/**
 * POST /api/bookings — Submit a new booking.
 * GET  /api/bookings — List all bookings (admin only).
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../lib/db';
import { validateBookingInput } from '../../lib/validation';
import { checkDuplicateBooking } from '../../lib/availability';
import { generateBookingId } from '../../lib/booking-id';
import { checkRateLimit } from '../../lib/rate-limit';
import { sendCustomerConfirmation, sendAdminNotification } from '../../lib/email';
import { createCalendarEvent, getBusyIntervals, slotOverlapsBusy } from '../../lib/calendar';
import { parseDaysOfWeek, isValidCourseDay } from '../../lib/courses';
import { isTrialSlotStart, hasEnoughNotice, berlinEpoch } from '../../lib/trial';
import {
  logBookingCreated,
  logBookingFailed,
  logEmailSent,
  logEmailFailed,
  logCalendarSynced,
  logCalendarFailed,
} from '../../lib/logger';

export async function POST(req: NextRequest) {
  try {
    // 1. Rate limit check
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
    const rateCheck = checkRateLimit(ip);
    if (!rateCheck.allowed) {
      await logBookingFailed('Rate limited', { ip });
      return NextResponse.json(
        { message: 'Too many booking attempts. Please try again later.', retryAfterMs: rateCheck.retryAfterMs },
        { status: 429 }
      );
    }

    // 2. Parse and validate input
    const body = await req.json();
    const validation = validateBookingInput(body);

    if (!validation.valid) {
      await logBookingFailed('Validation error', { errors: validation.errors });
      return NextResponse.json(
        { message: 'Validation failed', errors: validation.errors },
        { status: 400 }
      );
    }

    const { courseSlug, date, time, name, email, phone, interest, level, location, notes: message } = validation.sanitized;
    const notes = [`Interested in: ${interest}`, `German level: ${level}`, `Lives in: ${location}`, message ? `Message: ${message}` : '']
      .filter(Boolean)
      .join('\n');

    // 3. Fetch the course from DB
    const course = await prisma.course.findUnique({ where: { slug: courseSlug } });
    if (!course || !course.isActive) {
      return NextResponse.json(
        { message: 'Selected course is not available.' },
        { status: 400 }
      );
    }

    // 4. Verify the date is a valid course day
    const dateObj = new Date(date + 'T12:00:00');
    const daysOfWeek = parseDaysOfWeek(course.daysOfWeek);
    if (!isValidCourseDay(dateObj, daysOfWeek)) {
      return NextResponse.json(
        { message: 'This date is not a valid day for the selected course.' },
        { status: 400 }
      );
    }

    // 5. Check if date is before course start
    const courseStartDate = new Date(course.startDate + 'T00:00:00');
    if (dateObj < courseStartDate) {
      return NextResponse.json(
        { message: `This course starts on ${course.startDate}. Please select a date on or after that.` },
        { status: 400 }
      );
    }

    // 6. The 30-minute slot (German time) must still be free, 1 person per slot
    const slot = isTrialSlotStart(time)!;
    if (!hasEnoughNotice(date, slot.start)) {
      return NextResponse.json({ message: 'This time is too soon. Please choose a later slot.' }, { status: 400 });
    }
    const timeSlot = `${slot.start}-${slot.end}`;
    const taken = await prisma.booking.count({
      where: { courseId: course.id, bookingDate: date, timeSlot, status: { not: 'cancelled' } },
    });
    if (taken >= course.capacity) {
      return NextResponse.json({ message: 'This slot is no longer available. Please choose another time.' }, { status: 409 });
    }

    // 6b. Reject if the owner's Google Calendar is busy during this slot
    const busy = await getBusyIntervals(
      new Date(berlinEpoch(date, '00:00')),
      new Date(berlinEpoch(date, '23:59'))
    );
    if (slotOverlapsBusy(busy, date, slot.start, slot.end)) {
      return NextResponse.json(
        { message: 'This slot is no longer available.' },
        { status: 409 }
      );
    }

    // 7. Check for duplicate booking (warn but allow if forceDuplicate is set)
    const duplicate = await checkDuplicateBooking(email, course.id);
    if (duplicate && !body.forceDuplicate) {
      return NextResponse.json(
        {
          message: `You already have a booking for this course on ${duplicate.bookingDate}. Submit again with forceDuplicate: true to proceed.`,
          isDuplicate: true,
          existingBooking: {
            bookingId: duplicate.bookingId,
            date: duplicate.bookingDate,
          },
        },
        { status: 409 }
      );
    }

    // 8. Generate booking ID
    const bookingId = await generateBookingId(date);

    // 9. Create the booking
    const booking = await prisma.booking.create({
      data: {
        bookingId,
        customerName: name,
        customerEmail: email,
        customerPhone: phone || null,
        courseId: course.id,
        bookingDate: date,
        timeSlot,
        notes: notes || null,
        status: 'pending', // Shoba confirms the appointment by email
      },
    });

    await logBookingCreated(bookingId, { customerEmail: email, courseSlug, date });

    // 10. Send emails (non-blocking — don't fail the booking if email fails)
    const emailData = {
      bookingId,
      customerName: name,
      customerEmail: email,
      customerPhone: phone,
      courseName: course.name,
      bookingDate: date,
      startTime: slot.start,
      endTime: slot.end,
      notes,
      createdAt: booking.createdAt,
    };

    // Fire emails in parallel
    const [customerEmailResult, adminEmailResult] = await Promise.allSettled([
      sendCustomerConfirmation(emailData),
      sendAdminNotification(emailData),
    ]);

    // Log email results
    if (customerEmailResult.status === 'fulfilled' && customerEmailResult.value.success) {
      await logEmailSent(bookingId, email, 'customer');
    } else {
      const error = customerEmailResult.status === 'fulfilled'
        ? customerEmailResult.value.error || 'Unknown'
        : customerEmailResult.reason?.message || 'Unknown';
      await logEmailFailed(bookingId, email, 'customer', error);
    }

    if (adminEmailResult.status === 'fulfilled' && adminEmailResult.value.success) {
      await logEmailSent(bookingId, process.env.ADMIN_EMAIL || 'info@aydence.de', 'admin');
    } else {
      const error = adminEmailResult.status === 'fulfilled'
        ? adminEmailResult.value.error || 'Unknown'
        : adminEmailResult.reason?.message || 'Unknown';
      await logEmailFailed(bookingId, process.env.ADMIN_EMAIL || 'info@aydence.de', 'admin', error);
    }

    // 11. Sync to Google Calendar (non-blocking)
    try {
      const eventId = await createCalendarEvent({
        title: `${course.name} - ${name}`,
        date,
        startTime: slot.start,
        endTime: slot.end,
        description: `Email: ${email}\nPhone: ${phone || 'Not provided'}\nNotes: ${notes || 'None'}\nBooking ID: ${bookingId}`,
        attendeeEmail: email,
      });

      if (eventId) {
        await prisma.booking.update({
          where: { id: booking.id },
          data: { calendarEventId: eventId },
        });
        await logCalendarSynced(bookingId, eventId);
      }
    } catch (calErr) {
      const errMsg = calErr instanceof Error ? calErr.message : 'Unknown';
      await logCalendarFailed(bookingId, errMsg);
    }

    // 12. Return success
    return NextResponse.json({
      success: true,
      message: 'Thank you! I will confirm your appointment by email shortly.',
      booking: {
        bookingId,
        courseName: course.name,
        date,
        timeSlot,
        customerEmail: email,
      },
    });
  } catch (error: unknown) {
    console.error('Booking Error:', error);
    const message = error instanceof Error ? error.message : 'Internal Server Error';
    return NextResponse.json(
      { message },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  // Simple admin auth via query param or header
  const authHeader = req.headers.get('authorization');
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminPassword || authHeader !== `Bearer ${adminPassword}`) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const bookings = await prisma.booking.findMany({
    include: { course: true },
    orderBy: { createdAt: 'desc' },
  });

  return NextResponse.json({ bookings });
}
