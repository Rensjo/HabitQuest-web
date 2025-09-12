/**
 * ================================================================================================
 * HABITQUEST UTILITIES
 * ================================================================================================
 * 
 * Utility functions for date handling, calculations, and formatting
 * 
 * @version 4.0.0
 */

import type { Frequency } from '../types';

// ================================================================================================
// STYLING UTILITIES
// ================================================================================================

/**
 * Combines conditional class strings - tiny helper for className management
 */
export function classNames(...arr: Array<string | false | null | undefined>): string {
  return arr.filter(Boolean).join(" ");
}

// ================================================================================================
// DATE UTILITIES
// ================================================================================================

/**
 * Get current time in ISO format
 */
export function todayISO(): string {
  return new Date().toISOString();
}

/**
 * Compute a period key used to index completions by frequency.
 * - daily   → YYYY-MM-DD
 * - weekly  → YYYY-Www (ISO week number)
 * - monthly → YYYY-MM
 * - yearly  → YYYY
 */
export function getPeriodKey(freq: Frequency, d: Date = new Date()): string {
  const date = new Date(d);
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  if (freq === "daily") return `${y}-${m}-${day}`;
  if (freq === "monthly") return `${y}-${m}`;
  if (freq === "yearly") return `${y}`;

  // Weekly: compute ISO week (Mon‑start). We normalize via UTC to avoid DST drift.
  const tmp = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = tmp.getUTCDay() || 7; // Sun === 0 → 7
  tmp.setUTCDate(tmp.getUTCDate() + 4 - dayNum); // Thursday of this week
  const yearStart = new Date(Date.UTC(tmp.getUTCFullYear(), 0, 1));
  const weekNo = Math.ceil(((tmp.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
  return `${tmp.getUTCFullYear()}-W${String(weekNo).padStart(2, "0")}`;
}

/**
 * Attempt to infer a representative Date from a period key
 */
export function inferDateFromKey(pk: string, freq: Frequency): Date | null {
  try {
    if (freq === "daily") {
      const [y, m, d] = pk.split("-");
      return new Date(Number(y), Number(m) - 1, Number(d));
    }
    if (freq === "monthly") {
      const [y, m] = pk.split("-");
      return new Date(Number(y), Number(m) - 1, 1);
    }
    if (freq === "yearly") {
      return new Date(Number(pk), 0, 1);
    }
    if (freq === "weekly") {
      const [y, wStr] = pk.split("-W");
      const w = Number(wStr);
      const simple = new Date(Date.UTC(Number(y), 0, 1 + (w - 1) * 7));
      const dayOfWeek = simple.getUTCDay();
      const ISOweekStart = new Date(simple);
      ISOweekStart.setUTCDate(simple.getUTCDate() - ((dayOfWeek + 6) % 7));
      return ISOweekStart;
    }
  } catch {
    return null;
  }
  return null;
}

// ================================================================================================
// CALENDAR UTILITIES
// ================================================================================================

/**
 * Get the first day of the month
 */
export function startOfMonth(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), 1);
}

/**
 * Get the last day of the month
 */
export function endOfMonth(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth() + 1, 0);
}

/**
 * Check if two dates are the same day (ignoring time)
 */
export function sameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

// ================================================================================================
// GAMIFICATION UTILITIES
// ================================================================================================

/**
 * Calculate level from total XP using square root formula
 */
export function getCurrentLevel(totalXP: number): number {
  return Math.floor(Math.sqrt(totalXP / 100)) + 1;
}

/**
 * Calculate progress percentage towards next level
 */
export function getLevelProgress(totalXP: number): number {
  const currentLevel = getCurrentLevel(totalXP);
  const currentLevelXP = Math.pow(currentLevel - 1, 2) * 100;
  const nextLevelXP = Math.pow(currentLevel, 2) * 100;
  return Math.round(((totalXP - currentLevelXP) / (nextLevelXP - currentLevelXP)) * 100);
}

/**
 * Calculate XP needed for next level
 */
export function getXPToNextLevel(totalXP: number): number {
  const currentLevel = getCurrentLevel(totalXP);
  const nextLevelXP = Math.pow(currentLevel, 2) * 100;
  return nextLevelXP - totalXP;
}

// ================================================================================================
// HABIT UTILITIES
// ================================================================================================

// Re-export habit utilities
export * from './habitUtils';