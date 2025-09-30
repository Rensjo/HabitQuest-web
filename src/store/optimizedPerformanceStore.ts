/**
 * Performance-Optimized State Management
 * Implements granular state updates and memoization
 */

import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import { persist, createJSONStorage } from 'zustand/middleware';
import { debounce } from 'lodash-es';

// Types
import type { Habit, Reward, Frequency } from '../types';

// Optimized state interfaces
interface UIState {
  activeFreq: Frequency;
  selectedDate: Date;
  modals: {
    showDayInsights: boolean;
    showRewardShop: boolean;
    activeSettings: boolean;
    activeAnalytics: boolean;
    showAddHabit: boolean;
    showAddReward: boolean;
  };
  theme: string;
  reducedMotion: boolean;
}

interface AppDataState {
  habits: Habit[];
  points: number;
  totalXP: number;
  goals: any[];
  shop: Reward[];
  inventory: any[];
  categories: any[];
  level: number;
  overallStreak: number;
}

interface AudioState {
  audioEnabled: boolean;
  backgroundMusicEnabled: boolean;
  soundEffectsVolume: number;
  backgroundMusicVolume: number;
  isPlaying: boolean;
}

interface PerformanceState {
  renderCount: number;
  lastRenderTime: number;
  memoryUsage: number;
  isOptimized: boolean;
}

// Create UI Store (frequent updates)
export const useUIStore = create<UIState & {
  setActiveFreq: (freq: Frequency) => void;
  setSelectedDate: (date: Date) => void;
  toggleModal: (modal: keyof UIState['modals']) => void;
  setTheme: (theme: string) => void;
  toggleReducedMotion: () => void;
}>()(
  subscribeWithSelector(
    immer((set) => ({
      // Initial state
      activeFreq: 'daily',
      selectedDate: new Date(),
      modals: {
        showDayInsights: false,
        showRewardShop: false,
        activeSettings: false,
        activeAnalytics: false,
        showAddHabit: false,
        showAddReward: false,
      },
      theme: 'dark',
      reducedMotion: false,

      // Actions
      setActiveFreq: (freq) => set((state) => {
        state.activeFreq = freq;
      }),
      
      setSelectedDate: (date) => set((state) => {
        state.selectedDate = date;
      }),
      
      toggleModal: (modal) => set((state) => {
        state.modals[modal] = !state.modals[modal];
      }),
      
      setTheme: (theme) => set((state) => {
        state.theme = theme;
      }),
      
      toggleReducedMotion: () => set((state) => {
        state.reducedMotion = !state.reducedMotion;
      }),
    }))
  )
);

// Create App Data Store (less frequent updates, persisted)
export const useAppDataStore = create<AppDataState & {
  addHabit: (habit: Habit) => void;
  deleteHabit: (id: string) => void;
  toggleHabitComplete: (id: string, date: Date) => void;
  updatePoints: (points: number) => void;
  addReward: (reward: Reward) => void;
  deleteReward: (id: string) => void;
}>()(
  persist(
    subscribeWithSelector(
      immer((set, get) => ({
        // Initial state
        habits: [],
        points: 0,
        totalXP: 0,
        goals: [],
        shop: [],
        inventory: [],
        categories: [],
        level: 1,
        overallStreak: 0,

        // Actions
        addHabit: (habit) => set((state) => {
          state.habits.push(habit);
        }),
        
        deleteHabit: (id) => set((state) => {
          state.habits = state.habits.filter(h => h.id !== id);
        }),
        
        toggleHabitComplete: (id, date) => set((state) => {
          const habit = state.habits.find(h => h.id === id);
          if (habit) {
            // Optimized completion logic
            const dateKey = date.toISOString().split('T')[0];
            if (!habit.completedDates) habit.completedDates = [];
            
            const isCompleted = habit.completedDates.includes(dateKey);
            if (isCompleted) {
              habit.completedDates = habit.completedDates.filter(d => d !== dateKey);
              state.points = Math.max(0, state.points - habit.points);
            } else {
              habit.completedDates.push(dateKey);
              state.points += habit.points;
              state.totalXP += habit.points;
            }
          }
        }),
        
        updatePoints: (points) => set((state) => {
          state.points = points;
        }),
        
        addReward: (reward) => set((state) => {
          state.shop.push(reward);
        }),
        
        deleteReward: (id) => set((state) => {
          state.shop = state.shop.filter(r => r.id !== id);
        }),
      }))
    ),
    {
      name: 'habitquest-app-data',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        habits: state.habits,
        points: state.points,
        totalXP: state.totalXP,
        goals: state.goals,
        shop: state.shop,
        inventory: state.inventory,
        categories: state.categories,
        level: state.level,
        overallStreak: state.overallStreak,
      }),
    }
  )
);

// Create Audio Store (medium frequency updates)
export const useAudioStore = create<AudioState & {
  setAudioEnabled: (enabled: boolean) => void;
  setBackgroundMusicEnabled: (enabled: boolean) => void;
  setSoundEffectsVolume: (volume: number) => void;
  setBackgroundMusicVolume: (volume: number) => void;
  setIsPlaying: (playing: boolean) => void;
}>()(
  persist(
    subscribeWithSelector(
      immer((set) => ({
        // Initial state
        audioEnabled: true,
        backgroundMusicEnabled: false,
        soundEffectsVolume: 0.15,
        backgroundMusicVolume: 0.5,
        isPlaying: false,

        // Actions
        setAudioEnabled: (enabled) => set((state) => {
          state.audioEnabled = enabled;
        }),
        
        setBackgroundMusicEnabled: (enabled) => set((state) => {
          state.backgroundMusicEnabled = enabled;
        }),
        
        setSoundEffectsVolume: (volume) => set((state) => {
          state.soundEffectsVolume = volume;
        }),
        
        setBackgroundMusicVolume: (volume) => set((state) => {
          state.backgroundMusicVolume = volume;
        }),
        
        setIsPlaying: (playing) => set((state) => {
          state.isPlaying = playing;
        }),
      }))
    ),
    {
      name: 'habitquest-audio-settings',
      storage: createJSONStorage(() => localStorage),
    }
  )
);

// Create Performance Store (development/monitoring)
export const usePerformanceStore = create<PerformanceState & {
  incrementRenderCount: () => void;
  updateRenderTime: (time: number) => void;
  updateMemoryUsage: (usage: number) => void;
  toggleOptimization: () => void;
}>()(
  subscribeWithSelector(
    immer((set) => ({
      // Initial state
      renderCount: 0,
      lastRenderTime: 0,
      memoryUsage: 0,
      isOptimized: true,

      // Actions
      incrementRenderCount: () => set((state) => {
        state.renderCount += 1;
      }),
      
      updateRenderTime: (time) => set((state) => {
        state.lastRenderTime = time;
      }),
      
      updateMemoryUsage: (usage) => set((state) => {
        state.memoryUsage = usage;
      }),
      
      toggleOptimization: () => set((state) => {
        state.isOptimized = !state.isOptimized;
      }),
    }))
  )
);

// Optimized selectors to prevent unnecessary re-renders
export const useUISelectors = {
  activeFreq: () => useUIStore((state) => state.activeFreq),
  selectedDate: () => useUIStore((state) => state.selectedDate),
  modals: () => useUIStore((state) => state.modals),
  theme: () => useUIStore((state) => state.theme),
  reducedMotion: () => useUIStore((state) => state.reducedMotion),
};

export const useAppDataSelectors = {
  habits: () => useAppDataStore((state) => state.habits),
  points: () => useAppDataStore((state) => state.points),
  totalXP: () => useAppDataStore((state) => state.totalXP),
  level: () => useAppDataStore((state) => state.level),
  shop: () => useAppDataStore((state) => state.shop),
};

export const useAudioSelectors = {
  audioEnabled: () => useAudioStore((state) => state.audioEnabled),
  backgroundMusicEnabled: () => useAudioStore((state) => state.backgroundMusicEnabled),
  soundEffectsVolume: () => useAudioStore((state) => state.soundEffectsVolume),
  backgroundMusicVolume: () => useAudioStore((state) => state.backgroundMusicVolume),
  isPlaying: () => useAudioStore((state) => state.isPlaying),
};

// Debounced persistence helpers
export const debouncedPersistence = {
  saveHabits: debounce((habits: Habit[]) => {
    useAppDataStore.setState({ habits });
  }, 1000),
  
  savePoints: debounce((points: number) => {
    useAppDataStore.setState({ points });
  }, 500),
  
  saveAudioSettings: debounce((settings: Partial<AudioState>) => {
    useAudioStore.setState(settings);
  }, 300),
};

// Performance monitoring helpers
export const performanceHelpers = {
  trackRender: () => {
    if (process.env.NODE_ENV === 'development') {
      usePerformanceStore.getState().incrementRenderCount();
    }
  },
  
  measureRenderTime: (startTime: number) => {
    if (process.env.NODE_ENV === 'development') {
      const renderTime = performance.now() - startTime;
      usePerformanceStore.getState().updateRenderTime(renderTime);
    }
  },
  
  trackMemoryUsage: () => {
    if (process.env.NODE_ENV === 'development' && 'memory' in performance) {
      const memory = (performance as any).memory;
      usePerformanceStore.getState().updateMemoryUsage(memory.usedJSHeapSize);
    }
  },
};