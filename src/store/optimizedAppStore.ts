/**
 * ================================================================================================
 * OPTIMIZED APP STORE WITH ZUSTAND
 * ================================================================================================
 * 
 * High-performance state management using Zustand for better Tauri performance
 * Splits state into focused stores to reduce re-renders
 * 
 * @version 1.0.0
 */

import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { Habit, Reward, Frequency } from '../types';

// ================================================================================================
// TYPES
// ================================================================================================

interface UIState {
  activeFreq: Frequency;
  selectedDate: Date;
  showDayInsights: boolean;
  showRewardShop: boolean;
  activeSettings: boolean;
  activeAnalytics: boolean;
  showAddHabit: boolean;
  showAddReward: boolean;
  showAddCategory: boolean;
}

interface NotificationState {
  showLevelUp: boolean;
  showPurchaseSuccess: boolean;
  showHabitComplete: boolean;
  lastCompletedHabit: string | null;
  notificationMessage: string;
}

interface AudioState {
  audioEnabled: boolean;
  backgroundMusicEnabled: boolean;
  soundEffectsVolume: number;
  backgroundMusicVolume: number;
}

interface HabitData {
  habits: Habit[];
  points: number;
  totalXP: number;
  goals: Record<string, { monthlyTargetXP: number }>;
  shop: Reward[];
  inventory: any[];
  categories: string[];
}

// ================================================================================================
// UI STORE
// ================================================================================================

export const useUIStore = create<UIState>()(
  subscribeWithSelector((set) => ({
    activeFreq: 'daily',
    selectedDate: new Date(),
    showDayInsights: false,
    showRewardShop: false,
    activeSettings: false,
    activeAnalytics: false,
    showAddHabit: false,
    showAddReward: false,
    showAddCategory: false,
    
    // Actions
    setActiveFreq: (freq: Frequency) => set({ activeFreq: freq }),
    setSelectedDate: (date: Date) => set({ selectedDate: date }),
    setShowDayInsights: (show: boolean) => set({ showDayInsights: show }),
    setShowRewardShop: (show: boolean) => set({ showRewardShop: show }),
    setActiveSettings: (active: boolean) => set({ activeSettings: active }),
    setActiveAnalytics: (active: boolean) => set({ activeAnalytics: active }),
    setShowAddHabit: (show: boolean) => set({ showAddHabit: show }),
    setShowAddReward: (show: boolean) => set({ showAddReward: show }),
    setShowAddCategory: (show: boolean) => set({ showAddCategory: show }),
  }))
);

// ================================================================================================
// NOTIFICATION STORE
// ================================================================================================

export const useNotificationStore = create<NotificationState>()(
  subscribeWithSelector((set) => ({
    showLevelUp: false,
    showPurchaseSuccess: false,
    showHabitComplete: false,
    lastCompletedHabit: null,
    notificationMessage: '',
    
    // Actions
    setShowLevelUp: (show: boolean) => set({ showLevelUp: show }),
    setShowPurchaseSuccess: (show: boolean) => set({ showPurchaseSuccess: show }),
    setShowHabitComplete: (show: boolean) => set({ showHabitComplete: show }),
    setLastCompletedHabit: (habitId: string | null) => set({ lastCompletedHabit: habitId }),
    setNotificationMessage: (message: string) => set({ notificationMessage: message }),
    
    // Helper to show notification
    showNotification: (type: 'levelUp' | 'purchaseSuccess' | 'habitComplete', habitId?: string, message?: string) => {
      set({
        [`show${type.charAt(0).toUpperCase() + type.slice(1)}`]: true,
        lastCompletedHabit: habitId || null,
        notificationMessage: message || ''
      });
      
      // Auto-hide after 3 seconds
      setTimeout(() => {
        set({
          [`show${type.charAt(0).toUpperCase() + type.slice(1)}`]: false,
          lastCompletedHabit: null,
          notificationMessage: ''
        });
      }, 3000);
    }
  }))
);

// ================================================================================================
// AUDIO STORE
// ================================================================================================

export const useAudioStore = create<AudioState>()(
  subscribeWithSelector(
    persist(
      (set) => ({
        audioEnabled: true,
        backgroundMusicEnabled: false,
        soundEffectsVolume: 0.15,
        backgroundMusicVolume: 0.5,
        
        // Actions
        setAudioEnabled: (enabled: boolean) => set({ audioEnabled: enabled }),
        setBackgroundMusicEnabled: (enabled: boolean) => set({ backgroundMusicEnabled: enabled }),
        setSoundEffectsVolume: (volume: number) => set({ soundEffectsVolume: volume }),
        setBackgroundMusicVolume: (volume: number) => set({ backgroundMusicVolume: volume }),
      }),
      {
        name: 'habitquest-audio-storage',
        storage: createJSONStorage(() => localStorage),
        partialize: (state) => ({
          audioEnabled: state.audioEnabled,
          backgroundMusicEnabled: state.backgroundMusicEnabled,
          soundEffectsVolume: state.soundEffectsVolume,
          backgroundMusicVolume: state.backgroundMusicVolume,
        }),
      }
    )
  )
);

// ================================================================================================
// HABIT DATA STORE (with persistence)
// ================================================================================================

export const useHabitDataStore = create<HabitData>()(
  subscribeWithSelector(
    persist(
      (set, get) => ({
        habits: [],
        points: 0,
        totalXP: 0,
        goals: {},
        shop: [],
        inventory: [],
        categories: [],
        
        // Actions
        setHabits: (habits: Habit[]) => set({ habits }),
        addHabit: (habit: Habit) => set((state) => ({ habits: [...state.habits, habit] })),
        updateHabit: (id: string, updates: Partial<Habit>) => set((state) => ({
          habits: state.habits.map(h => h.id === id ? { ...h, ...updates } : h)
        })),
        deleteHabit: (id: string) => set((state) => ({
          habits: state.habits.filter(h => h.id !== id)
        })),
        
        setPoints: (points: number) => set({ points }),
        addPoints: (amount: number) => set((state) => ({ points: state.points + amount })),
        
        setTotalXP: (totalXP: number) => set({ totalXP }),
        addXP: (amount: number) => set((state) => ({ totalXP: state.totalXP + amount })),
        
        setGoals: (goals: Record<string, { monthlyTargetXP: number }>) => set({ goals }),
        addCategory: (name: string, target: number) => set((state) => ({
          categories: [...state.categories, name],
          goals: { ...state.goals, [name]: { monthlyTargetXP: target } }
        })),
        
        setShop: (shop: Reward[]) => set({ shop }),
        addReward: (reward: Reward) => set((state) => ({ shop: [...state.shop, reward] })),
        deleteReward: (id: string) => set((state) => ({
          shop: state.shop.filter(r => r.id !== id)
        })),
        
        setInventory: (inventory: any[]) => set({ inventory }),
        addToInventory: (item: any) => set((state) => ({
          inventory: [...state.inventory, item]
        })),
      }),
      {
        name: 'habitquest-data-storage',
        storage: createJSONStorage(() => localStorage),
        partialize: (state) => ({
          habits: state.habits,
          points: state.points,
          totalXP: state.totalXP,
          goals: state.goals,
          shop: state.shop,
          inventory: state.inventory,
          categories: state.categories,
        }),
      }
    )
  )
);

// ================================================================================================
// COMPUTED VALUES STORE
// ================================================================================================

export const useComputedStore = create<{
  level: number;
  levelProgress: number;
  overallStreak: number;
  categoryXP: Record<string, number>;
  visibleHabits: Habit[];
  habitStats: any;
  dayInsights: any;
  completedDaysSet: Set<string>;
}>()(
  subscribeWithSelector((set, get) => {
    // This will be updated by the main store when data changes
    return {
      level: 1,
      levelProgress: 0,
      overallStreak: 0,
      categoryXP: {},
      visibleHabits: [],
      habitStats: {},
      dayInsights: {},
      completedDaysSet: new Set(),
    };
  })
);

// ================================================================================================
// SELECTORS (for performance)
// ================================================================================================

export const selectUI = (state: UIState) => ({
  activeFreq: state.activeFreq,
  selectedDate: state.selectedDate,
  showDayInsights: state.showDayInsights,
  showRewardShop: state.showRewardShop,
  activeSettings: state.activeSettings,
  activeAnalytics: state.activeAnalytics,
  showAddHabit: state.showAddHabit,
  showAddReward: state.showAddReward,
  showAddCategory: state.showAddCategory,
});

export const selectAudio = (state: AudioState) => ({
  audioEnabled: state.audioEnabled,
  backgroundMusicEnabled: state.backgroundMusicEnabled,
  soundEffectsVolume: state.soundEffectsVolume,
  backgroundMusicVolume: state.backgroundMusicVolume,
});

export const selectHabitData = (state: HabitData) => ({
  habits: state.habits,
  points: state.points,
  totalXP: state.totalXP,
  goals: state.goals,
  shop: state.shop,
  inventory: state.inventory,
  categories: state.categories,
});
