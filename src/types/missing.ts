/**
 * ================================================================================================
 * MISSING TYPE DEFINITIONS
 * ================================================================================================
 * 
 * Temporary type definitions to fix build errors
 * 
 * @version 1.0.0
 */

// Missing types that are causing build errors
export type Goal = {
  id: string;
  title: string;
  description: string;
  targetXP: number;
  currentXP: number;
  category: string;
  deadline?: string;
  completed: boolean;
};

export type DayInsights = {
  date: string;
  totalHabits: number;
  completedHabits: number;
  totalXP: number;
  habitsForDay: Array<{
    id: string;
    title: string;
    completed: boolean;
    xp: number;
  }>;
  categoryBreakdown: Record<string, {
    total: number;
    completed: number;
    xp: number;
  }>;
};

export type InventoryItem = {
  id: string;
  name: string;
  cost: number;
  redeemedAt: string;
  description?: string;
  icon?: string;
  rarity?: 'common' | 'rare' | 'epic' | 'legendary';
};

// Extended Habit type with description
export type HabitWithDescription = {
  id: string;
  title: string;
  description?: string;
  frequency: 'daily' | 'weekly' | 'monthly' | 'yearly';
  category: string;
  xpOnComplete: number;
  streak: number;
  bestStreak: number;
  lastCompletedAt: string | null;
  completions: Record<string, string>;
  isRecurring: boolean;
  specificDate?: string | null;
  color?: string;
  icon?: string;
};
