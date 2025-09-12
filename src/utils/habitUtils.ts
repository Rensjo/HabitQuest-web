/**
 * ================================================================================================
 * HABIT UTILITY FUNCTIONS
 * ================================================================================================
 * 
 * Utility functions for habit-related operations
 * 
 * @version 1.0.0
 */

import { getPeriodKey, sameDay } from './dateUtils';
import type { Habit } from '../types';

/**
 * Determines if a habit should be visible on a given date
 * @param h - The habit to check
 * @param d - The date to check visibility for
 * @returns true if the habit should be visible on the given date
 */
export function habitVisibleOnDate(h: Habit, d: Date): boolean {
  if (h.isRecurring) return true;
  if (!h.specificDate) return true;
  const sd = new Date(h.specificDate);
  if (h.frequency === "daily") return sameDay(sd, d);
  if (h.frequency === "weekly") return getPeriodKey("weekly", sd) === getPeriodKey("weekly", d);
  if (h.frequency === "monthly")
    return sd.getFullYear() === d.getFullYear() && sd.getMonth() === d.getMonth();
  if (h.frequency === "yearly") return sd.getFullYear() === d.getFullYear();
  return true;
}
