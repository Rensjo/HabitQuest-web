import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { 
  StoredData, 
  Habit, 
  Reward, 
  AppSettings, 
  UserStats 
} from '../types';
import { DEFAULT_CATEGORIES } from '../types';

const defaultSettings: AppSettings = {
  theme: 'auto',
  gradientColors: ['#0f172a', '#1e293b', '#334155'],
  animations: true,
  soundEffects: true,
  notifications: true,
  language: 'en',
  startOfWeek: 0,
};

const defaultUserStats: UserStats = {
  totalHabitsCompleted: 0,
  longestStreak: 0,
  totalDaysActive: 0,
  favoriteCategory: 'PERSONAL DEVELOPMENT',
  weeklyAverage: 0,
  monthlyAverage: 0,
};

interface AppStore extends StoredData {
  // Actions
  addHabit: (habit: Partial<Habit>) => void;
  updateHabit: (id: string, updates: Partial<Habit>) => void;
  deleteHabit: (id: string) => void;
  toggleHabitComplete: (habitId: string, date: Date) => void;
  
  addReward: (reward: Omit<Reward, 'id'>) => void;
  deleteReward: (id: string) => void;
  redeemReward: (reward: Reward) => boolean;
  
  addCategory: (name: string, targetXP: number) => void;
  updateCategoryTarget: (category: string, target: number) => void;
  
  updateSettings: (settings: Partial<AppSettings>) => void;
  updateUserStats: (stats: Partial<UserStats>) => void;
  
  unlockAchievement: (id: string) => void;
  
  // Computed values
  getLevel: () => number;
  getLevelProgress: () => number;
  getCategoryXP: (month: Date) => Record<string, number>;
  
  // Storage
  exportData: () => string;
  importData: (data: string) => boolean;
  resetData: () => void;
}

export const useAppStore = create<AppStore>()(
  persist(
    (set, get) => ({
      // Initial state
      habits: [],
      points: 0,
      totalXP: 0,
      goals: {},
      inventory: [],
      shop: [],
      categories: DEFAULT_CATEGORIES,
      achievements: [],
      userStats: defaultUserStats,
      settings: defaultSettings,
      version: '3.3.0',
      
      // Actions
      addHabit: (habitData) => set((state) => {
        const newHabit: Habit = {
          id: crypto.randomUUID(),
          title: habitData.title || 'New Habit',
          frequency: habitData.frequency || 'daily',
          category: habitData.category || state.categories[0] || 'PERSONAL DEVELOPMENT',
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
        
        return {
          habits: [...state.habits, newHabit]
        };
      }),
      
      updateHabit: (id, updates) => set((state) => ({
        habits: state.habits.map(habit => 
          habit.id === id ? { ...habit, ...updates } : habit
        )
      })),
      
      deleteHabit: (id) => set((state) => ({
        habits: state.habits.filter(habit => habit.id !== id)
      })),
      
      toggleHabitComplete: (habitId, date) => set((state) => {
        // This will be implemented with the date utility functions
        return state; // Placeholder
      }),
      
      addReward: (rewardData) => set((state) => ({
        shop: [{
          id: crypto.randomUUID(),
          ...rewardData
        }, ...state.shop]
      })),
      
      deleteReward: (id) => set((state) => ({
        shop: state.shop.filter(reward => reward.id !== id)
      })),
      
      redeemReward: (reward) => {
        const state = get();
        if (state.points >= reward.cost) {
          set({
            points: state.points - reward.cost,
            inventory: [{
              ...reward,
              redeemedAt: new Date().toISOString()
            }, ...state.inventory]
          });
          return true;
        }
        return false;
      },
      
      addCategory: (name, targetXP) => set((state) => {
        const normalizedName = name.trim().toUpperCase();
        if (state.categories.includes(normalizedName)) return state;
        
        return {
          categories: [...state.categories, normalizedName],
          goals: {
            ...state.goals,
            [normalizedName]: { monthlyTargetXP: Math.max(0, targetXP) }
          }
        };
      }),
      
      updateCategoryTarget: (category, target) => set((state) => ({
        goals: {
          ...state.goals,
          [category]: { monthlyTargetXP: Math.max(0, target) }
        }
      })),
      
      updateSettings: (newSettings) => set((state) => ({
        settings: { ...state.settings, ...newSettings }
      })),
      
      updateUserStats: (newStats) => set((state) => ({
        userStats: { ...state.userStats, ...newStats }
      })),
      
      unlockAchievement: (id) => set((state) => ({
        achievements: state.achievements.map(achievement =>
          achievement.id === id 
            ? { ...achievement, unlockedAt: new Date().toISOString() }
            : achievement
        )
      })),
      
      // Computed values
      getLevel: () => {
        const { totalXP } = get();
        return Math.floor(Math.sqrt(totalXP) / 2) + 1;
      },
      
      getLevelProgress: () => {
        const { totalXP } = get();
        const level = get().getLevel();
        const currentLevelXP = Math.pow((level - 1) * 2, 2);
        const nextLevelXP = Math.pow(level * 2, 2);
        const span = nextLevelXP - currentLevelXP;
        return Math.min(100, Math.round(((totalXP - currentLevelXP) / span) * 100));
      },
      
      getCategoryXP: (month) => {
        // This will be implemented with proper date calculations
        return {};
      },
      
      // Storage utilities
      exportData: () => {
        const state = get();
        return JSON.stringify({
          habits: state.habits,
          points: state.points,
          totalXP: state.totalXP,
          goals: state.goals,
          inventory: state.inventory,
          shop: state.shop,
          categories: state.categories,
          achievements: state.achievements,
          userStats: state.userStats,
          settings: state.settings,
          version: state.version,
        });
      },
      
      importData: (data) => {
        try {
          const parsed = JSON.parse(data) as StoredData;
          set(parsed);
          return true;
        } catch {
          return false;
        }
      },
      
      resetData: () => set({
        habits: [],
        points: 0,
        totalXP: 0,
        goals: {},
        inventory: [],
        shop: [],
        categories: DEFAULT_CATEGORIES,
        achievements: [],
        userStats: defaultUserStats,
        settings: defaultSettings,
      }),
    }),
    {
      name: 'habitquest-storage',
      version: 1,
    }
  )
);
