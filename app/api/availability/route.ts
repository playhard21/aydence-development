/**
 * GET /api/availability — Get available slots for a course and month.
 * Query params:
 *   - course: course slug (e.g., "a1-new")
 *   - month: "YYYY-MM" (e.g., "2026-06")
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../lib/db';
import { parseDaysOfWeek, getAvailableDatesForMonth } from '../../lib/courses';
import { getBulkAvailability } from '../../lib/availability';
import { getBusyIntervals, slotOverlapsBusy } from '../../lib/calendar';
import { TRIAL_SLUG, berlinEpoch, generateTrialSlots, hasEnoughNotice } from '../../lib/trial';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const courseSlug = searchParams.get('course');
  const monthStr = searchParams.get('month'); // "YYYY-MM"

  if (!courseSlug || !monthStr) {
    return NextResponse.json(
      { message: 'Missing required params: course, month' },
      { status: 400 }
    );
  }

  // Parse month
  const [yearStr, monthNumStr] = monthStr.split('-');
  const year = parseInt(yearStr, 10);
  const month = parseInt(monthNumStr, 10) - 1; // Convert to 0-indexed

  if (isNaN(year) || isNaN(month) || month < 0 || month > 11) {
    return NextResponse.json(
      { message: 'Invalid month format. Use YYYY-MM.' },
      { status: 400 }
    );
  }

  // Fetch course
  const course = await prisma.course.findUnique({ where: { slug: courseSlug } });
  if (!course) {
    return NextResponse.json(
      { message: 'Course not found.' },
      { status: 404 }
    );
  }

  // Get valid dates
  const daysOfWeek = parseDaysOfWeek(course.daysOfWeek);
  const availableDates = getAvailableDatesForMonth(year, month, course.startDate, daysOfWeek);

  // Free trial: per-slot availability (30-minute slots, 1 person per slot, German time)
  if (course.slug === TRIAL_SLUG) {
    const sorted = [...availableDates].sort();
    const busy = sorted.length
      ? await getBusyIntervals(
          new Date(berlinEpoch(sorted[0], '00:00')),
          new Date(berlinEpoch(sorted[sorted.length - 1], '23:59'))
        )
      : [];
    const bookings = sorted.length
      ? await prisma.booking.findMany({
          where: { courseId: course.id, bookingDate: { in: sorted }, status: { not: 'cancelled' } },
          select: { bookingDate: true, timeSlot: true },
        })
      : [];
    const taken = new Set(bookings.map((b) => `${b.bookingDate}|${b.timeSlot.split('-')[0]}`));
    const allSlots = generateTrialSlots();

    const slotsByDate: Record<string, string[]> = {};
    const trialAvailability = sorted.map((date) => {
      const free = allSlots
        .filter((s) => hasEnoughNotice(date, s.start))
        .filter((s) => !taken.has(`${date}|${s.start}`))
        .filter((s) => !slotOverlapsBusy(busy, date, s.start, s.end))
        .map((s) => s.start);
      slotsByDate[date] = free;
      return { date, total: allSlots.length, booked: allSlots.length - free.length, remaining: free.length, isFull: free.length === 0 };
    });

    return NextResponse.json({
      course: { slug: course.slug, name: course.name, startTime: course.startTime, endTime: course.endTime, capacity: course.capacity },
      availability: trialAvailability,
      slots: slotsByDate,
    });
  }

  // Get booking counts for all dates in one query
  const dbAvailability = await getBulkAvailability(course.id, availableDates, course.capacity);

  // Block dates where the owner's Google Calendar already has an event in the slot
  let availability = dbAvailability;
  if (availableDates.length > 0) {
    const sorted = [...availableDates].sort();
    const busy = await getBusyIntervals(
      new Date(berlinEpoch(sorted[0], '00:00')),
      new Date(berlinEpoch(sorted[sorted.length - 1], '23:59'))
    );
    if (busy.length > 0) {
      availability = dbAvailability.map((a) =>
        slotOverlapsBusy(busy, a.date, course.startTime, course.endTime)
          ? { ...a, remaining: 0, isFull: true }
          : a
      );
    }
  }

  return NextResponse.json({
    course: {
      slug: course.slug,
      name: course.name,
      startTime: course.startTime,
      endTime: course.endTime,
      capacity: course.capacity,
    },
    availability,
  });
}
