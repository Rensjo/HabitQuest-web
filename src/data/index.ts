/**
 * ================================================================================================
 * HABITQUEST DATA PERSISTENCE
 * ================================================================================================
 * 
 * Data persistence layer and default seed data for HabitQuest
 * Handles localStorage operations and provides initial app state
 * 
 * @version 4.0.0
 */

import type { Habit, Reward, Stored } from '../types';
import { LS_KEY } from '../constants';

// ================================================================================================
// PERSISTENCE HELPERS (SSR-SAFE)
// ================================================================================================

/**
 * Safely read from localStorage; returns null on SSR or parse error
 */
export function loadData(): Stored | null {
  try {
    if (typeof window === "undefined") return null;
    const raw = window.localStorage.getItem(LS_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as Stored;
  } catch {
    return null;
  }
}

/**
 * Safely write to localStorage; no-op on SSR
 */
export function saveData(data: Stored): void {
  try {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(LS_KEY, JSON.stringify(data));
  } catch {
    // ignore quota / availability errors
  }
}

// ================================================================================================
// DEFAULT SEED DATA
// ================================================================================================

/**
 * Default habits to initialize the app with
 */
export const defaultHabits: Habit[] = [
  {
    id: crypto.randomUUID(),
    title: "25-min workout",
    frequency: "daily",
    category: "PERSONAL DEVELOPMENT",
    xpOnComplete: 10,
    streak: 0,
    bestStreak: 0,
    lastCompletedAt: null,
    completions: {},
    isRecurring: true,
  },
  {
    id: crypto.randomUUID(),
    title: "Deep work block",
    frequency: "daily",
    category: "CAREER",
    xpOnComplete: 15,
    streak: 0,
    bestStreak: 0,
    lastCompletedAt: null,
    completions: {},
    isRecurring: true,
  },
  {
    id: crypto.randomUUID(),
    title: "Budget review",
    frequency: "weekly",
    category: "FINANCIAL",
    xpOnComplete: 25,
    streak: 0,
    bestStreak: 0,
    lastCompletedAt: null,
    completions: {},
    isRecurring: true,
  },
  {
    id: crypto.randomUUID(),
    title: "Call a friend",
    frequency: "weekly",
    category: "RELATIONSHIPS",
    xpOnComplete: 15,
    streak: 0,
    bestStreak: 0,
    lastCompletedAt: null,
    completions: {},
    isRecurring: true,
  },
  {
    id: crypto.randomUUID(),
    title: "Read 10 pages",
    frequency: "daily",
    category: "PERSONAL DEVELOPMENT",
    xpOnComplete: 10,
    streak: 0,
    bestStreak: 0,
    lastCompletedAt: null,
    completions: {},
    isRecurring: true,
  },
  {
    id: crypto.randomUUID(),
    title: "Sketch for 20 mins",
    frequency: "weekly",
    category: "CREATIVE",
    xpOnComplete: 20,
    streak: 0,
    bestStreak: 0,
    lastCompletedAt: null,
    completions: {},
    isRecurring: true,
  },
  {
    id: crypto.randomUUID(),
    title: "Quiet reflection/Prayer",
    frequency: "daily",
    category: "SPIRITUAL",
    xpOnComplete: 10,
    streak: 0,
    bestStreak: 0,
    lastCompletedAt: null,
    completions: {},
    isRecurring: true,
  },
  {
    id: crypto.randomUUID(),
    title: "Portfolio update",
    frequency: "monthly",
    category: "CAREER",
    xpOnComplete: 50,
    streak: 0,
    bestStreak: 0,
    lastCompletedAt: null,
    completions: {},
    isRecurring: true,
  },
  {
    id: crypto.randomUUID(),
    title: "Annual vision review",
    frequency: "yearly",
    category: "PERSONAL DEVELOPMENT",
    xpOnComplete: 200,
    streak: 0,
    bestStreak: 0,
    lastCompletedAt: null,
    completions: {},
    isRecurring: true,
  },
];

/**
 * Default goal targets by category
 */
export const defaultGoalsByCategory: Record<string, { monthlyTargetXP: number }> = {
  CAREER: { monthlyTargetXP: 400 },
  CREATIVE: { monthlyTargetXP: 200 },
  FINANCIAL: { monthlyTargetXP: 250 },
  "PERSONAL DEVELOPMENT": { monthlyTargetXP: 350 },
  RELATIONSHIPS: { monthlyTargetXP: 200 },
  SPIRITUAL: { monthlyTargetXP: 250 },
};

/**
 * Default rewards catalog
 */
export const defaultRewards: Reward[] = [
  { id: "r1", name: "1-hour guilt-free anime", cost: 150 },
  { id: "r2", name: "Fancy coffee", cost: 120 },
  { id: "r3", name: "New brush set / pen", cost: 300 },
  { id: "r4", name: "Mini shopping spree", cost: 600 },
  { id: "r5", name: "Weekend adventure", cost: 1200 },
];
