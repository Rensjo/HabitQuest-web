/**
 * ================================================================================================
 * HABITQUEST BUSINESS LOGIC HOOKS
 * ================================================================================================
 * 
 * Custom hooks containing business logic for habit management
 * 
 * @version 4.0.0
 */

import { useState, useMemo } from "react";
import { 
  todayISO, 
  getPeriodKey, 
  inferDateFromKey, 
  sameDay,
  habitVisibleOnDate,
  getCurrentLevel,
  getLevelProgress,
  getXPToNextLevel
} from "../../utils";
import { 
  DEFAULT_CATEGORIES,
  PROTECTED_FALLBACK_CATEGORY
} from "../../constants";
import { 
  loadData, 
  saveData, 
  defaultHabits, 
  defaultGoalsByCategory, 
  defaultRewards 
} from "../../data";
import type { Frequency, Habit, Reward } from "../../types";

// ================================================================================================
// HABIT MANAGEMENT HOOK
// ================================================================================================

export function useHabitManagement() {
  // Load saved state (SSR‑safe)
  const saved = loadData();

  // State management
  const [habits, setHabits] = useState<Habit[]>(saved?.habits ?? defaultHabits);
  const [points, setPoints] = useState<number>(saved?.points ?? 0);
  const [totalXP, setTotalXP] = useState<number>(saved?.totalXP ?? 0);
  const [goals, setGoals] = useState<Record<string, { monthlyTargetXP: number }>>(
    saved?.goals ?? defaultGoalsByCategory
  );
  const [shop, setShop] = useState<Reward[]>(saved?.shop ?? defaultRewards);
  const [inventory, setInventory] = useState<any[]>(saved?.inventory ?? []);
  const [categories, setCategories] = useState<string[]>(() => {
    const baseCategories = saved?.categories ?? (saved?.goals ? Object.keys(saved.goals) : [...DEFAULT_CATEGORIES]);
    // Always ensure the protected fallback category exists
    return baseCategories.includes(PROTECTED_FALLBACK_CATEGORY) 
      ? baseCategories 
      : [...baseCategories, PROTECTED_FALLBACK_CATEGORY];
  });

  // Derived level metrics
  const level = useMemo(() => getCurrentLevel(totalXP), [totalXP]);
  const levelProgress = useMemo(() => getLevelProgress(totalXP), [totalXP]);
  const xpToNext = useMemo(() => getXPToNextLevel(totalXP), [totalXP]);

  // Calculate overall user streak (consecutive days with at least one habit completed)
  const overallStreak = useMemo(() => {
    const today = new Date();
    const completions: Set<string> = new Set();
    
    // Collect all completion dates
    habits.forEach(habit => {
      Object.values(habit.completions).forEach(timestamp => {
        const date = new Date(timestamp);
        const dateKey = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
        completions.add(dateKey);
      });
    });
    
    // Count consecutive days working backwards from today
    let streak = 0;
    let currentDate = new Date(today);
    
    while (true) {
      const dateKey = `${currentDate.getFullYear()}-${currentDate.getMonth()}-${currentDate.getDate()}`;
      
      if (completions.has(dateKey)) {
        streak++;
        currentDate.setDate(currentDate.getDate() - 1);
      } else {
        // If it's today and no completions yet, don't break the streak
        if (sameDay(currentDate, today)) {
          currentDate.setDate(currentDate.getDate() - 1);
          continue;
        }
        break;
      }
    }
    
    return streak;
  }, [habits]);

  // Visibility helper is now imported from utils

  // Toggle completion for the habit in the current period
  function toggleComplete(habitId: string, selectedDate: Date): void {
    setHabits((prev) => {
      const now = todayISO();
      const next = prev.map((h) => {
        if (h.id !== habitId) return h;
        const pk = getPeriodKey(h.frequency, selectedDate);
        const already = Boolean(h.completions[pk]);
        
        // Prevent XP farming by checking if completion already exists for this period
        if (already) {
          // Only allow undo if the completion was made today (prevent farming past completions)
          const completionDate = h.completions[pk];
          const completionDay = new Date(completionDate).toDateString();
          const today = new Date().toDateString();
          
          if (completionDay !== today) {
            // Don't allow undoing past completions to prevent XP farming
            return h;
          }
        }
        
        const newCompletions: Record<string, string> = { ...h.completions };
        let deltaXP = 0;
        let deltaPts = 0;
        let newStreak = h.streak || 0;

        if (already) {
          delete newCompletions[pk];
          deltaXP -= h.xpOnComplete;
          deltaPts -= Math.round(h.xpOnComplete * 2);
        } else {
          newCompletions[pk] = now;
          deltaXP += h.xpOnComplete;
          deltaPts += Math.round(h.xpOnComplete * 2);
          const lastKey = h.lastCompletedAt ? getPeriodKey(h.frequency, new Date(h.lastCompletedAt)) : null;
          if (lastKey && lastKey !== pk) {
            newStreak = (h.streak || 0) + 1;
          }
        }

        if (deltaXP) setTotalXP((x) => Math.max(0, x + deltaXP));
        if (deltaPts) setPoints((p) => Math.max(0, p + deltaPts));

        return {
          ...h,
          completions: newCompletions,
          lastCompletedAt: !already ? now : h.lastCompletedAt,
          streak: newStreak,
          bestStreak: Math.max(h.bestStreak || 0, newStreak || 0),
        };
      });
      return next;
    });
  }

  // CRUD: Habits
  function addHabit(h: Partial<Habit>): void {
    setHabits((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        title: h.title || "New Habit",
        frequency: (h.frequency as Frequency) || "daily",
        category: h.category || categories[0] || "PERSONAL DEVELOPMENT",
        xpOnComplete: Number(h.xpOnComplete) || 10,
        streak: 0,
        bestStreak: 0,
        lastCompletedAt: null,
        completions: {},
        isRecurring: h.isRecurring ?? true,
        specificDate: h.specificDate || null,
      },
    ]);
  }

  function deleteHabit(id: string): void {
    setHabits((prev) => prev.filter((h) => h.id !== id));
  }

  function editHabit(id: string, updates: Partial<Habit>): void {
    setHabits((prev) => prev.map((habit) => 
      habit.id === id ? { ...habit, ...updates } : habit
    ));
  }

  // Category XP calculation
  function getCategoryXP(selectedDate: Date): Record<string, number> {
    const currentYear = selectedDate.getFullYear();
    const currentMonth = selectedDate.getMonth();
    const out: Record<string, number> = {};
    categories.forEach((c) => (out[c] = 0));

    habits.forEach((h) => {
      Object.entries(h.completions || {}).forEach(([pk, tsOrBool]) => {
        let d: Date | null = null;
        if (typeof tsOrBool === "string") {
          const dt = new Date(tsOrBool);
          d = isNaN(dt.getTime()) ? null : dt;
        } else if (typeof tsOrBool === "boolean" && tsOrBool) {
          d = inferDateFromKey(pk, h.frequency);
        }
        if (!d) return;
        if (d.getFullYear() === currentYear && d.getMonth() === currentMonth) {
          out[h.category] = (out[h.category] || 0) + h.xpOnComplete;
        }
      });
    });

    return out;
  }

  // Rewards management
  function redeemReward(r: Reward): void {
    if (points < r.cost) {
      alert("Not enough points yet!");
      return;
    }
    setPoints((p) => p - r.cost);
    setInventory((inv) => [{ ...r, redeemedAt: new Date().toISOString() }, ...inv]);
  }

  function addReward(name: string, cost: number): void {
    setShop((s) => [{ id: crypto.randomUUID(), name, cost }, ...s]);
  }

  function deleteReward(id: string): void {
    setShop((s) => s.filter((r) => r.id !== id));
  }

  function editReward(id: string, updates: Partial<Reward>): void {
    setShop((prev) => prev.map((reward) => 
      reward.id === id ? { ...reward, ...updates } : reward
    ));
  }

  // Categories management
  function addCategory(name: string, target: number): void {
    const clean = name.trim();
    if (!clean) return;
    const norm = clean.toUpperCase();
    setCategories((prev) => (prev.includes(norm) ? prev : [...prev, norm]));
    setGoals((g) => ({ ...g, [norm]: { monthlyTargetXP: Math.max(0, Number(target || 0)) } }));
  }

  function deleteCategory(categoryName: string): void {
    const norm = categoryName.trim().toUpperCase();
    
    // Prevent deletion of the protected fallback category
    if (norm === PROTECTED_FALLBACK_CATEGORY) {
      console.warn(`Cannot delete protected category: ${PROTECTED_FALLBACK_CATEGORY}`);
      return;
    }
    
    // Remove category from categories list
    setCategories((prev) => prev.filter((c) => c !== norm));
    
    // Remove category goals
    setGoals((g) => {
      const { [norm]: removed, ...rest } = g;
      return rest;
    });
    
    // Move all habits from deleted category to the protected fallback category
    setHabits((prev) => prev.map((habit) => 
      habit.category === norm ? { ...habit, category: PROTECTED_FALLBACK_CATEGORY } : habit
    ));
    
    // Ensure the protected fallback category has a goal if habits are moved to it
    setGoals((g) => ({
      ...g,
      [PROTECTED_FALLBACK_CATEGORY]: g[PROTECTED_FALLBACK_CATEGORY] || { monthlyTargetXP: 100 }
    }));
  }

  // Persistence
  function saveAppData(): void {
    saveData({ habits, points, totalXP, goals, inventory, shop, categories });
  }

  return {
    // State
    habits,
    points,
    totalXP,
    goals,
    shop,
    inventory,
    categories,
    level,
    levelProgress,
    xpToNext,
    overallStreak,
    
    // State setters
    setHabits,
    setPoints,
    setTotalXP,
    setGoals,
    setShop,
    setInventory,
    setCategories,
    
    // Functions
    habitVisibleOnDate,
    toggleComplete,
    addHabit,
    deleteHabit,
    editHabit,
    getCategoryXP,
    redeemReward,
    addReward,
    editReward,
    deleteReward,
    addCategory,
    deleteCategory,
    saveAppData
  };
}
