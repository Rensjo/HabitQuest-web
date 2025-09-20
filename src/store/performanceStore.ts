/**
 * ================================================================================================
 * PERFORMANCE-OPTIMIZED STATE MANAGEMENT
 * ================================================================================================
 * 
 * Optimized Zustand stores with selectors to minimize re-renders
 * Split into focused stores for better performance
 * 
 * @version 1.0.0
 */

import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import type { Habit, Reward, AppSettings } from '../types';
import { getCurrentLevel } from '../utils';

// ================================================================================================
// UI STATE STORE (Lightweight, frequently changing)
// ================================================================================================

interface UIState {
  // Navigation
  activeFreq: 'daily' | 'weekly' | 'monthly';
  selectedDate: Date;
  
  // Modal states
  showDayInsights: boolean;
  showRewardShop: boolean;
  showAddHabit: boolean;
  showAddReward: boolean;
  showAddCategory: boolean;
  activeSettings: boolean;
  activeAnalytics: boolean;
  
  // Actions
  setActiveFreq: (freq: 'daily' | 'weekly' | 'monthly') => void;
  setSelectedDate: (date: Date) => void;
  setShowDayInsights: (show: boolean) => void;
  setShowRewardShop: (show: boolean) => void;
  setShowAddHabit: (show: boolean) => void;
  setShowAddReward: (show: boolean) => void;
  setShowAddCategory: (show: boolean) => void;
  setActiveSettings: (show: boolean) => void;
  setActiveAnalytics: (show: boolean) => void;
}

export const useUIStore = create<UIState>()(
  subscribeWithSelector(
    immer((set) => ({
      // Initial state
      activeFreq: 'daily',
      selectedDate: new Date(),
      showDayInsights: false,
      showRewardShop: false,
      showAddHabit: false,
      showAddReward: false,
      showAddCategory: false,
      activeSettings: false,
      activeAnalytics: false,
      
      // Actions
      setActiveFreq: (freq) => set((state) => {
        state.activeFreq = freq;
      }),
      setSelectedDate: (date) => set((state) => {
        state.selectedDate = date;
      }),
      setShowDayInsights: (show) => set((state) => {
        state.showDayInsights = show;
      }),
      setShowRewardShop: (show) => set((state) => {
        state.showRewardShop = show;
      }),
      setShowAddHabit: (show) => set((state) => {
        state.showAddHabit = show;
      }),
      setShowAddReward: (show) => set((state) => {
        state.showAddReward = show;
      }),
      setShowAddCategory: (show) => set((state) => {
        state.showAddCategory = show;
      }),
      setActiveSettings: (show) => set((state) => {
        state.activeSettings = show;
      }),
      setActiveAnalytics: (show) => set((state) => {
        state.activeAnalytics = show;
      }),
    }))
  )
);

// ================================================================================================
// HABIT DATA STORE (Heavy, infrequently changing)
// ================================================================================================

interface HabitDataState {
  // Core data
  habits: Habit[];
  points: number;
  totalXP: number;
  level: number;
  overallStreak: number;
  
  // Goals and rewards
  goals: Record<string, { monthlyTargetXP: number }>;
  shop: Reward[];
  inventory: any[];
  categories: string[];
  
  // Actions
  addHabit: (habit: Partial<Habit>) => void;
  updateHabit: (id: string, updates: Partial<Habit>) => void;
  deleteHabit: (id: string) => void;
  toggleHabitComplete: (habitId: string, date: Date) => void;
  addPoints: (amount: number) => void;
  addXP: (amount: number) => void;
  addReward: (reward: Omit<Reward, 'id'>) => void;
  deleteReward: (id: string) => void;
  redeemReward: (reward: Reward) => boolean;
  addToInventory: (item: any) => void;
  addCategory: (name: string, targetXP: number) => void;
  updateCategoryTarget: (category: string, target: number) => void;
}

export const useHabitDataStore = create<HabitDataState>()(
  subscribeWithSelector(
    immer((set, get) => ({
      // Initial state
      habits: [],
      points: 0,
      totalXP: 0,
      level: 1,
      overallStreak: 0,
      goals: {},
      shop: [],
      inventory: [],
      categories: ['PERSONAL DEVELOPMENT', 'HEALTH & FITNESS', 'LEARNING & EDUCATION'],
      
      // Actions
      addHabit: (habitData) => set((state) => {
        const newHabit: Habit = {
          id: crypto.randomUUID(),
          title: habitData.title || 'New Habit',
          frequency: habitData.frequency || 'daily',
          category: habitData.category || state.categories[0],
          xpOnComplete: habitData.xpOnComplete || 10,
          streak: 0,
          bestStreak: 0,
          lastCompletedAt: null,
          completions: {},
          isRecurring: habitData.isRecurring ?? true,
          specificDate: habitData.specificDate || null,
          color: habitData.color || '#10b981',
          icon: habitData.icon || 'target',
        };
        state.habits.push(newHabit);
      }),
      
      updateHabit: (id, updates) => set((state) => {
        const index = state.habits.findIndex(h => h.id === id);
        if (index !== -1) {
          Object.assign(state.habits[index], updates);
        }
      }),
      
      deleteHabit: (id) => set((state) => {
        state.habits = state.habits.filter(h => h.id !== id);
      }),
      
      toggleHabitComplete: (habitId, date) => set((state) => {
        const habit = state.habits.find(h => h.id === habitId);
        if (!habit) return;
        
        const pk = getPeriodKey(habit.frequency, date);
        const already = Boolean(habit.completions[pk]);
        
        if (already) {
          delete habit.completions[pk];
          state.points = Math.max(0, state.points - Math.round(habit.xpOnComplete * 2));
          state.totalXP = Math.max(0, state.totalXP - habit.xpOnComplete);
        } else {
          habit.completions[pk] = new Date().toISOString();
          state.points += Math.round(habit.xpOnComplete * 2);
          state.totalXP += habit.xpOnComplete;
          habit.lastCompletedAt = new Date().toISOString();
        }
        
        // Update level
        state.level = getCurrentLevel(state.totalXP);
      }),
      
      addPoints: (amount) => set((state) => {
        state.points = Math.max(0, state.points + amount);
      }),
      
      addXP: (amount) => set((state) => {
        state.totalXP = Math.max(0, state.totalXP + amount);
        state.level = getCurrentLevel(state.totalXP);
      }),
      
      addReward: (rewardData) => set((state) => {
        state.shop.push({
          id: crypto.randomUUID(),
          ...rewardData
        });
      }),
      
      deleteReward: (id) => set((state) => {
        state.shop = state.shop.filter(r => r.id !== id);
      }),
      
      redeemReward: (reward) => {
        const state = get();
        if (state.points >= reward.cost) {
          set((draft) => {
            draft.points -= reward.cost;
            draft.inventory.push({
              ...reward,
              redeemedAt: new Date().toISOString()
            });
          });
          return true;
        }
        return false;
      },
      
      addToInventory: (item) => set((state) => {
        state.inventory.push(item);
      }),
      
      addCategory: (name, targetXP) => set((state) => {
        state.categories.push(name);
        state.goals[name] = { monthlyTargetXP: targetXP };
      }),
      
      updateCategoryTarget: (category, target) => set((state) => {
        if (state.goals[category]) {
          state.goals[category].monthlyTargetXP = target;
        }
      }),
    }))
  )
);

// ================================================================================================
// AUDIO STATE STORE (Lightweight, infrequently changing)
// ================================================================================================

interface AudioState {
  audioEnabled: boolean;
  backgroundMusicEnabled: boolean;
  soundEffectsVolume: number;
  backgroundMusicVolume: number;
  
  setAudioEnabled: (enabled: boolean) => void;
  setBackgroundMusicEnabled: (enabled: boolean) => void;
  setSoundEffectsVolume: (volume: number) => void;
  setBackgroundMusicVolume: (volume: number) => void;
}

export const useAudioStore = create<AudioState>()(
  subscribeWithSelector(
    immer((set) => ({
      // Initial state
      audioEnabled: true,
      backgroundMusicEnabled: false,
      soundEffectsVolume: 0.7,
      backgroundMusicVolume: 0.5,
      
      // Actions
      setAudioEnabled: (enabled) => set((state) => {
        state.audioEnabled = enabled;
      }),
      setBackgroundMusicEnabled: (enabled) => set((state) => {
        state.backgroundMusicEnabled = enabled;
      }),
      setSoundEffectsVolume: (volume) => set((state) => {
        state.soundEffectsVolume = Math.max(0, Math.min(1, volume));
      }),
      setBackgroundMusicVolume: (volume) => set((state) => {
        state.backgroundMusicVolume = Math.max(0, Math.min(1, volume));
      }),
    }))
  )
);

// ================================================================================================
// NOTIFICATION STATE STORE (Lightweight, frequently changing)
// ================================================================================================

interface NotificationState {
  showLevelUp: boolean;
  showPurchaseSuccess: boolean;
  showHabitComplete: boolean;
  lastCompletedHabit: string | null;
  notificationMessage: string | null;
  
  setShowLevelUp: (show: boolean) => void;
  setShowPurchaseSuccess: (show: boolean) => void;
  setShowHabitComplete: (show: boolean) => void;
  setLastCompletedHabit: (habit: string | null) => void;
  setNotificationMessage: (message: string | null) => void;
}

export const useNotificationStore = create<NotificationState>()(
  subscribeWithSelector(
    immer((set) => ({
      // Initial state
      showLevelUp: false,
      showPurchaseSuccess: false,
      showHabitComplete: false,
      lastCompletedHabit: null,
      notificationMessage: null,
      
      // Actions
      setShowLevelUp: (show) => set((state) => {
        state.showLevelUp = show;
      }),
      setShowPurchaseSuccess: (show) => set((state) => {
        state.showPurchaseSuccess = show;
      }),
      setShowHabitComplete: (show) => set((state) => {
        state.showHabitComplete = show;
      }),
      setLastCompletedHabit: (habit) => set((state) => {
        state.lastCompletedHabit = habit;
      }),
      setNotificationMessage: (message) => set((state) => {
        state.notificationMessage = message;
      }),
    }))
  )
);

// ================================================================================================
// PERFORMANCE SELECTORS
// ================================================================================================

// UI selectors
export const selectUI = (state: UIState) => ({
  activeFreq: state.activeFreq,
  selectedDate: state.selectedDate,
  showDayInsights: state.showDayInsights,
  showRewardShop: state.showRewardShop,
  showAddHabit: state.showAddHabit,
  showAddReward: state.showAddReward,
  showAddCategory: state.showAddCategory,
  activeSettings: state.activeSettings,
  activeAnalytics: state.activeAnalytics,
});

// Habit data selectors
export const selectHabitData = (state: HabitDataState) => ({
  habits: state.habits,
  points: state.points,
  totalXP: state.totalXP,
  level: state.level,
  overallStreak: state.overallStreak,
  goals: state.goals,
  shop: state.shop,
  inventory: state.inventory,
  categories: state.categories,
});

// Audio selectors
export const selectAudio = (state: AudioState) => ({
  audioEnabled: state.audioEnabled,
  backgroundMusicEnabled: state.backgroundMusicEnabled,
  soundEffectsVolume: state.soundEffectsVolume,
  backgroundMusicVolume: state.backgroundMusicVolume,
});

// Notification selectors
export const selectNotifications = (state: NotificationState) => ({
  showLevelUp: state.showLevelUp,
  showPurchaseSuccess: state.showPurchaseSuccess,
  showHabitComplete: state.showHabitComplete,
  lastCompletedHabit: state.lastCompletedHabit,
  notificationMessage: state.notificationMessage,
});

// ================================================================================================
// UTILITY FUNCTIONS
// ================================================================================================

function getPeriodKey(frequency: string, date: Date): string {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = d.getMonth();
  const day = d.getDate();
  
  switch (frequency) {
    case 'daily':
      return `${year}-${month}-${day}`;
    case 'weekly':
      const weekStart = new Date(d);
      weekStart.setDate(day - d.getDay());
      return `${weekStart.getFullYear()}-${weekStart.getMonth()}-${weekStart.getDate()}`;
    case 'monthly':
      return `${year}-${month}`;
    default:
      return `${year}-${month}-${day}`;
  }
}
