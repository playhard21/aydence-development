/**
 * Course business logic and configuration.
 * Provides helpers for computing valid dates, checking course days, etc.
 */

export interface CourseConfig {
  slug: string;
  name: string;
  startDate: string;       // "YYYY-MM-DD"
  daysOfWeek: number[];    // 0=Sun, 1=Mon, ... 6=Sat
  startTime: string;       // "HH:mm" IST
  endTime: string;         // "HH:mm" IST
  capacity: number;
}

/**
 * Parse the daysOfWeek CSV string from the database into an array of numbers.
 */
export function parseDaysOfWeek(daysStr: string): number[] {
  return daysStr.split(',').map(Number);
}

/**
 * Check if a given date falls on a valid course day.
 */
export function isValidCourseDay(date: Date, daysOfWeek: number[]): boolean {
  const dayOfWeek = date.getDay(); // 0=Sun, 1=Mon, ... 6=Sat
  return daysOfWeek.includes(dayOfWeek);
}

/**
 * Get all available dates for a course within a given month.
 * Filters by:
 *   - Course days of week
 *   - Course start date (no dates before it)
 *   - 30-day booking window from today
 *   - No past dates
 */
export function getAvailableDatesForMonth(
  year: number,
  month: number, // 0-indexed (0=Jan, 11=Dec)
  courseStartDate: string,
  daysOfWeek: number[]
): string[] {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const courseStart = new Date(courseStartDate + 'T00:00:00');
  const maxDate = new Date(today);
  maxDate.setDate(maxDate.getDate() + 30);

  const dates: string[] = [];
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month, day);

    // Skip past dates
    if (date < today) continue;

    // Skip dates beyond 30-day window
    if (date > maxDate) continue;

    // Skip dates before course start
    if (date < courseStart) continue;

    // Skip non-course days
    if (!isValidCourseDay(date, daysOfWeek)) continue;

    // Format as YYYY-MM-DD
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    dates.push(`${yyyy}-${mm}-${dd}`);
  }

  return dates;
}

/**
 * Format a date string for display: "Friday, May 5, 2026"
 */
export function formatDateForDisplay(dateStr: string): string {
  const date = new Date(dateStr + 'T12:00:00'); // noon to avoid timezone issues
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

/**
 * Format time range for display: "10:00 - 10:30 AM German time"
 */
export function formatTimeForDisplay(startTime: string, endTime: string): string {
  const formatTime = (t: string) => {
    const [h, m] = t.split(':').map(Number);
    const period = h >= 12 ? 'PM' : 'AM';
    const h12 = h % 12 || 12;
    return `${h12}:${m.toString().padStart(2, '0')} ${period}`;
  };

  // Only show period on the last time
  const [startH] = startTime.split(':').map(Number);
  const [endH] = endTime.split(':').map(Number);
  const startPeriod = startH >= 12 ? 'PM' : 'AM';
  const endPeriod = endH >= 12 ? 'PM' : 'AM';

  const startFormatted = (() => {
    const h12 = startH % 12 || 12;
    const m = startTime.split(':')[1];
    if (startPeriod === endPeriod) {
      return `${h12}:${m}`;
    }
    return `${h12}:${m} ${startPeriod}`;
  })();

  const endFormatted = formatTime(endTime);

  return `${startFormatted} - ${endFormatted} (German time)`;
}

/**
 * Generate a Google Calendar event link for the customer.
 */
export function generateGoogleCalendarLink(params: {
  title: string;
  date: string;       // "YYYY-MM-DD"
  startTime: string;  // "HH:mm" IST
  endTime: string;    // "HH:mm" IST
  description: string;
}): string {
  const { title, date, startTime, endTime, description } = params;

  // Convert IST times to the format Google Calendar expects: YYYYMMDDTHHmmss
  const dateClean = date.replace(/-/g, '');
  const startClean = startTime.replace(':', '') + '00';
  const endClean = endTime.replace(':', '') + '00';

  const url = new URL('https://calendar.google.com/calendar/r/eventedit');
  url.searchParams.set('text', title);
  url.searchParams.set('dates', `${dateClean}T${startClean}/${dateClean}T${endClean}`);
  url.searchParams.set('ctz', 'Europe/Berlin');
  url.searchParams.set('details', description);

  return url.toString();
}
