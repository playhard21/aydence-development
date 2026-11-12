/**
 * Input validation and sanitization for booking submissions.
 */

import { TRIAL_SLUG, INTEREST_OPTIONS, LEVEL_OPTIONS, LOCATION_OPTIONS, isTrialSlotStart } from './trial';

export interface BookingInput {
  courseSlug: string;
  date: string;
  name: string;
  email: string;
  time: string;
  phone?: string;
  notes?: string;
  interest: string;
  level: string;
  location: string;
}

export interface ValidationResult {
  valid: boolean;
  errors: Record<string, string>;
  sanitized: BookingInput;
}

/**
 * Strip HTML tags and trim whitespace from a string.
 */
function sanitize(input: string): string {
  return input
    .replace(/<[^>]*>/g, '') // Remove HTML tags
    .replace(/&[^;]+;/g, '') // Remove HTML entities
    .trim();
}

/**
 * Validate email format.
 */
function isValidEmail(email: string): boolean {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

/**
 * Validate date format (YYYY-MM-DD) and ensure it's a future date.
 */
function isValidFutureDate(dateStr: string): boolean {
  const re = /^\d{4}-\d{2}-\d{2}$/;
  if (!re.test(dateStr)) return false;

  const date = new Date(dateStr + 'T00:00:00');
  if (isNaN(date.getTime())) return false;

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return date >= today;
}

/**
 * Validate all booking input fields.
 */
export function validateBookingInput(data: Record<string, unknown>): ValidationResult {
  const errors: Record<string, string> = {};

  // Course
  const courseSlug = typeof data.courseSlug === 'string' ? sanitize(data.courseSlug) : '';
  if (!courseSlug) {
    errors.courseSlug = 'Please select a course.';
  } else if (courseSlug !== TRIAL_SLUG) {
    errors.courseSlug = 'Invalid course selection.';
  }

  // Date
  const date = typeof data.date === 'string' ? sanitize(data.date) : '';
  if (!date) {
    errors.date = 'Please select a date.';
  } else if (!isValidFutureDate(date)) {
    errors.date = 'Please select a valid future date.';
  }

  // Time slot (start of a 30-minute slot, German time)
  const time = typeof data.time === 'string' ? sanitize(data.time) : '';
  if (!time) {
    errors.time = 'Please select a time.';
  } else if (!isTrialSlotStart(time)) {
    errors.time = 'Please select a valid time.';
  }

  // Name
  const name = typeof data.name === 'string' ? sanitize(data.name) : '';
  if (!name) {
    errors.name = 'Full name is required.';
  } else if (name.length < 2) {
    errors.name = 'Name must be at least 2 characters.';
  } else if (name.length > 100) {
    errors.name = 'Name must be less than 100 characters.';
  }

  // Email
  const email = typeof data.email === 'string' ? sanitize(data.email).toLowerCase() : '';
  if (!email) {
    errors.email = 'Email address is required.';
  } else if (!isValidEmail(email)) {
    errors.email = 'Please enter a valid email address.';
  }

  // Dropdowns
  const interest = typeof data.interest === 'string' ? sanitize(data.interest) : '';
  if (!(INTEREST_OPTIONS as readonly string[]).includes(interest)) errors.interest = 'Please choose what you are interested in.';
  const level = typeof data.level === 'string' ? sanitize(data.level) : '';
  if (!(LEVEL_OPTIONS as readonly string[]).includes(level)) errors.level = 'Please choose your current German level.';
  const location = typeof data.location === 'string' ? sanitize(data.location) : '';
  if (!(LOCATION_OPTIONS as readonly string[]).includes(location)) errors.location = 'Please tell us where you live.';

  // Privacy consent
  if (data.consent !== true) errors.consent = 'Please agree to the privacy policy.';

  // Phone (optional)
  const phone = typeof data.phone === 'string' ? sanitize(data.phone) : '';

  // Notes (optional)
  const notes = typeof data.notes === 'string' ? sanitize(data.notes) : '';

  return {
    valid: Object.keys(errors).length === 0,
    errors,
    sanitized: {
      courseSlug,
      date,
      time,
      name,
      email,
      phone: phone || undefined,
      notes: notes || undefined,
      interest,
      level,
      location,
    },
  };
}
