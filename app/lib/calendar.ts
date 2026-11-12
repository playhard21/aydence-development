/**
 * Google Calendar API integration.
 * Creates events on the admin's calendar when bookings are confirmed.
 *
 * Setup Required:
 * 1. Create a Google Cloud project at https://console.cloud.google.com
 * 2. Enable the Google Calendar API
 * 3. Create a Service Account and download the JSON key file
 * 4. Share your calendar (tech@aydence.de) with the Service Account email
 * 5. Set GOOGLE_CALENDAR_CREDENTIALS env var to the base64-encoded JSON key
 * 6. Set GOOGLE_CALENDAR_ID env var to the calendar ID (usually tech@aydence.de)
 *
 * The system works without Calendar — bookings and emails function independently.
 */

import { berlinOffset, berlinEpoch, TRIAL_TIMEZONE } from './trial';

interface CalendarEventParams {
  title: string;
  date: string;       // "YYYY-MM-DD"
  startTime: string;  // "HH:mm" German time
  endTime: string;    // "HH:mm" German time
  description: string;
  attendeeEmail?: string;
}

/**
 * Check if Google Calendar credentials are configured.
 */
export function isCalendarConfigured(): boolean {
  return !!(process.env.GOOGLE_CALENDAR_CREDENTIALS && process.env.GOOGLE_CALENDAR_ID);
}

/**
 * Create a Google Calendar event.
 * Returns the event ID on success, null on failure.
 */
export async function createCalendarEvent(params: CalendarEventParams): Promise<string | null> {
  if (!isCalendarConfigured()) {
    console.log('[Calendar] Not configured — skipping event creation.');
    return null;
  }

  try {
    // Dynamic import to avoid loading googleapis when not needed
    const { google } = await import('googleapis');

    // Decode the base64-encoded service account credentials
    const credentialsJson = Buffer.from(
      process.env.GOOGLE_CALENDAR_CREDENTIALS!,
      'base64'
    ).toString('utf-8');
    const credentials = JSON.parse(credentialsJson);

    // Authenticate with Service Account
    const auth = new google.auth.JWT(
      credentials.client_email,
      undefined,
      credentials.private_key,
      ['https://www.googleapis.com/auth/calendar']
    );

    const calendar = google.calendar({ version: 'v3', auth });

    // Build German-time datetime strings in ISO format
    const offset = berlinOffset(params.date);
    const startDateTime = `${params.date}T${params.startTime}:00${offset}`;
    const endDateTime = `${params.date}T${params.endTime}:00${offset}`;

    const event: Record<string, unknown> = {
      summary: params.title,
      description: params.description,
      start: {
        dateTime: startDateTime,
        timeZone: TRIAL_TIMEZONE,
      },
      end: {
        dateTime: endDateTime,
        timeZone: TRIAL_TIMEZONE,
      },
    };

    // Mark our own events so availability checks can ignore them.
    // (No attendees: service accounts cannot invite people without
    // domain-wide delegation. The customer email goes in the description.)
    event.extendedProperties = { private: { source: 'aydence-booking' } };

    const response = await calendar.events.insert({
      calendarId: process.env.GOOGLE_CALENDAR_ID!,
      requestBody: event,
    });

    return response.data.id || null;
  } catch (err) {
    console.error('[Calendar] Failed to create event:', err);
    return null;
  }
}

export interface BusyInterval {
  start: number; // epoch ms
  end: number;   // epoch ms
}

/**
 * Read events the owner put on the calendar (excluding bookings made by this
 * site) and return them as busy intervals. Returns [] if not configured or on
 * failure, so availability falls back to the database only.
 */
export async function getBusyIntervals(timeMin: Date, timeMax: Date): Promise<BusyInterval[]> {
  if (!isCalendarConfigured()) return [];

  try {
    const { google } = await import('googleapis');
    const credentials = JSON.parse(
      Buffer.from(process.env.GOOGLE_CALENDAR_CREDENTIALS!, 'base64').toString('utf-8')
    );
    const auth = new google.auth.JWT(
      credentials.client_email,
      undefined,
      credentials.private_key,
      ['https://www.googleapis.com/auth/calendar']
    );
    const calendar = google.calendar({ version: 'v3', auth });

    const busy: BusyInterval[] = [];
    let pageToken: string | undefined;
    do {
      const res = await calendar.events.list({
        calendarId: process.env.GOOGLE_CALENDAR_ID!,
        timeMin: timeMin.toISOString(),
        timeMax: timeMax.toISOString(),
        singleEvents: true,
        showDeleted: false,
        maxResults: 250,
        pageToken,
      });
      for (const ev of res.data.items || []) {
        if (ev.status === 'cancelled' || ev.transparency === 'transparent') continue;
        if (ev.extendedProperties?.private?.source === 'aydence-booking') continue;
        // All-day events have `date`, timed events have `dateTime`
        const start = ev.start?.dateTime || ev.start?.date;
        const end = ev.end?.dateTime || ev.end?.date;
        if (!start || !end) continue;
        busy.push({ start: new Date(start).getTime(), end: new Date(end).getTime() });
      }
      pageToken = res.data.nextPageToken || undefined;
    } while (pageToken);

    return busy;
  } catch (err) {
    console.error('[Calendar] Failed to read busy times:', err);
    return [];
  }
}

/** True if the slot (date + German-time start/end) overlaps any busy interval. */
export function slotOverlapsBusy(
  busy: BusyInterval[],
  date: string,
  startTime: string,
  endTime: string
): boolean {
  const s = berlinEpoch(date, startTime);
  const e = berlinEpoch(date, endTime);
  return busy.some((b) => b.start < e && b.end > s);
}
