/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Returns today's date formatted as YYYY-MM-DD in the specified time zone.
 */
export function getLocalDateString(timeZone: string = Intl.DateTimeFormat().resolvedOptions().timeZone, dateObj: Date = new Date()): string {
  try {
    const formatter = new Intl.DateTimeFormat('en-CA', {
      timeZone,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
    return formatter.format(dateObj); // YYYY-MM-DD
  } catch {
    return dateObj.toISOString().slice(0, 10);
  }
}

/**
 * Parses YYYY-MM-DD into a localized Date object.
 */
export function parseLocalDate(dateStr: string): Date {
  const [year, month, day] = dateStr.split('-').map(Number);
  return new Date(year, month - 1, day, 12, 0, 0); // midday to avoid daylight saving issues
}

/**
 * Returns formatted date offset by N days.
 */
export function addDays(dateStr: string, days: number): string {
  const d = parseLocalDate(dateStr);
  d.setDate(d.getDate() + days);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Day of week: 0 = Sunday, 1 = Monday, ..., 6 = Saturday
 */
export function getDayOfWeek(dateStr: string): number {
  return parseLocalDate(dateStr).getDay();
}

/**
 * Returns Monday of the week for the given date.
 */
export function getMondayOfWeek(dateStr: string): string {
  const day = getDayOfWeek(dateStr);
  // If Sunday (0), Monday was 6 days ago. If Monday (1), 0 days ago.
  const diffToMonday = day === 0 ? -6 : 1 - day;
  return addDays(dateStr, diffToMonday);
}

/**
 * Returns the 7 dates (Mon through Sun) for the week containing dateStr.
 */
export function getWeekDates(dateStr: string): string[] {
  const monday = getMondayOfWeek(dateStr);
  const dates: string[] = [];
  for (let i = 0; i < 7; i++) {
    dates.push(addDays(monday, i));
  }
  return dates;
}

/**
 * Generates an identifier for a calendar week (e.g. "2026-W42") based on its Monday.
 */
export function getWeekKey(dateStr: string): string {
  const monday = getMondayOfWeek(dateStr);
  const d = parseLocalDate(monday);
  // ISO week number approximation
  const target = new Date(d.valueOf());
  const dayNr = (d.getDay() + 6) % 7;
  target.setDate(target.getDate() - dayNr + 3);
  const firstThursday = target.valueOf();
  target.setMonth(0, 1);
  if (target.getDay() !== 4) {
    target.setMonth(0, 1 + ((4 - target.getDay()) + 7) % 7);
  }
  const weekNum = 1 + Math.ceil((firstThursday - target.valueOf()) / 604800000);
  return `${d.getFullYear()}-W${String(weekNum).padStart(2, '0')}`;
}

/**
 * Compares two YYYY-MM-DD date strings.
 * returns negative if a < b, 0 if equal, positive if a > b
 */
export function compareDates(a: string, b: string): number {
  return a.localeCompare(b);
}

/**
 * Difference in days between two YYYY-MM-DD dates (b - a).
 */
export function diffDays(a: string, b: string): number {
  const da = parseLocalDate(a);
  const db = parseLocalDate(b);
  const diffTime = db.getTime() - da.getTime();
  return Math.round(diffTime / (1000 * 60 * 60 * 24));
}

/**
 * Returns short day name in given language.
 * index 0-6 (Sun-Sat) or Monday-start index
 */
export function getShortDayName(dayIndex: number, lang: 'en' | 'es'): string {
  const en = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const es = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
  return lang === 'es' ? es[dayIndex] : en[dayIndex];
}

/**
 * Checks if current local time is within user's quiet hours (e.g. 22:00 to 08:00)
 */
export function isWithinQuietHours(start: string, end: string, now: Date = new Date()): boolean {
  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  const [startH, startM] = start.split(':').map(Number);
  const [endH, endM] = end.split(':').map(Number);
  const startMinutes = startH * 60 + startM;
  const endMinutes = endH * 60 + endM;

  if (startMinutes > endMinutes) {
    // Overnights (e.g. 22:00 to 08:00)
    return currentMinutes >= startMinutes || currentMinutes < endMinutes;
  }
  return currentMinutes >= startMinutes && currentMinutes < endMinutes;
}
