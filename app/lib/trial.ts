/**
 * Free trial session: slot rules and German-time helpers.
 * Sessions run Mon-Fri 10:00-18:00 German time (CET/CEST), 1 person per slot.
 */

export const TRIAL_SLUG = 'free-trial';
export const TRIAL_TIMEZONE = 'Europe/Berlin';
export const TRIAL_SLOT_MINUTES = 30;
export const TRIAL_OPEN = '10:00';
export const TRIAL_CLOSE = '18:00';
/** A slot can only be booked if it starts at least this many hours from now. */
export const TRIAL_MIN_NOTICE_HOURS = 2;

export const INTEREST_OPTIONS = [
  'Free trial session',
  'Speaking Coaching (B1 Level)',
  'Personal Translation Assistance',
] as const;
export const LEVEL_OPTIONS = ['Not sure', 'A1', 'A2', 'B1', 'B2 or higher'] as const;
export const LOCATION_OPTIONS = ['Germany', 'India', 'Other'] as const;

function toMinutes(t: string): number {
  const [h, m] = t.split(':').map(Number);
  return h * 60 + m;
}
function fromMinutes(n: number): string {
  return `${String(Math.floor(n / 60)).padStart(2, '0')}:${String(n % 60).padStart(2, '0')}`;
}

export interface TrialSlot {
  start: string; // "HH:mm" German time
  end: string;
}

/** All slots of one day: 10:00-10:30, 10:30-11:00, ... 17:30-18:00. */
export function generateTrialSlots(): TrialSlot[] {
  const slots: TrialSlot[] = [];
  for (let m = toMinutes(TRIAL_OPEN); m + TRIAL_SLOT_MINUTES <= toMinutes(TRIAL_CLOSE); m += TRIAL_SLOT_MINUTES) {
    slots.push({ start: fromMinutes(m), end: fromMinutes(m + TRIAL_SLOT_MINUTES) });
  }
  return slots;
}

export function isTrialSlotStart(start: string): TrialSlot | undefined {
  return generateTrialSlots().find((s) => s.start === start);
}

/** UTC offset of Europe/Berlin on a date, e.g. "+01:00" or "+02:00". */
export function berlinOffset(date: string): string {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: TRIAL_TIMEZONE,
    timeZoneName: 'longOffset',
  }).formatToParts(new Date(`${date}T12:00:00Z`));
  const value = parts.find((p) => p.type === 'timeZoneName')?.value || 'GMT';
  const match = value.match(/GMT([+-]\d{2}:\d{2})/);
  return match ? match[1] : '+00:00';
}

/** Epoch ms of a German wall-clock date + time. */
export function berlinEpoch(date: string, time: string): number {
  return new Date(`${date}T${time}:00${berlinOffset(date)}`).getTime();
}

/** True if the slot starts early enough to still be booked. */
export function hasEnoughNotice(date: string, start: string): boolean {
  return berlinEpoch(date, start) >= Date.now() + TRIAL_MIN_NOTICE_HOURS * 3600 * 1000;
}
