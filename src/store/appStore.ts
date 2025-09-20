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
import { getCurrentLevel, getLevelProgress, getXPToNextLevel } from '../utils';

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
  importData: (data: string, mergeMode?: 'replace' | 'merge') => { success: boolean; error?: string; details?: any; mode?: string; metadata?: any; summary?: any };
  validateImportData: (data: any) => { isValid: boolean; errors: string[]; warningCount?: number };
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
        return getCurrentLevel(totalXP);
      },
      
      getLevelProgress: () => {
        const { totalXP } = get();
        return getLevelProgress(totalXP);
      },
      
      getCategoryXP: (month) => {
        // This will be implemented with proper date calculations
        return {};
      },
      
      // Enhanced storage utilities for seamless device migration
      exportData: () => {
        const state = get();
        const exportedData = {
          // Core app data
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
          
          // Migration metadata
          _metadata: {
            exportVersion: '4.1.2.0',
            exportDate: new Date().toISOString(),
            exportSource: 'HabitQuest-Web',
            dataIntegrity: {
              totalHabits: state.habits.length,
              totalRewards: state.shop.length,
              totalCategories: state.categories?.length || 0,
              hasAchievements: (state.achievements?.length || 0) > 0,
              settingsIncluded: !!state.settings
            },
            // Add checksum for data validation
            checksum: btoa(JSON.stringify({
              habits: state.habits.length,
              points: state.points,
              totalXP: state.totalXP,
              timestamp: Date.now()
            }))
          }
        };
        
        return JSON.stringify(exportedData, null, 2);
      },
      
      importData: (data, mergeMode = 'replace') => {
        try {
          const parsed = JSON.parse(data);
          
          // Validate data structure and version compatibility
          const validation = get().validateImportData(parsed);
          if (!validation.isValid) {
            console.error('Import validation failed:', validation.errors);
            return { success: false, error: 'Invalid data format', details: validation.errors };
          }
          
          const currentState = get();
          
          if (mergeMode === 'merge') {
            // Merge data intelligently - combine without duplicating
            const mergedState = {
              // Merge habits by ID, prefer imported data for conflicts
              habits: [
                ...currentState.habits.filter(h => !parsed.habits?.find((ph: any) => ph.id === h.id)),
                ...(parsed.habits || [])
              ],
              
              // Add points and XP together
              points: currentState.points + (parsed.points || 0),
              totalXP: currentState.totalXP + (parsed.totalXP || 0),
              
              // Merge goals (combine category targets)
              goals: { ...currentState.goals, ...(parsed.goals || {}) },
              
              // Merge inventory without duplicates
              inventory: [
                ...currentState.inventory,
                ...(parsed.inventory || []).filter((item: any) => 
                  !currentState.inventory.find(existing => 
                    existing.name === item.name && existing.redeemedAt === item.redeemedAt
                  )
                )
              ],
              
              // Merge shop items by name
              shop: [
                ...currentState.shop.filter(s => !parsed.shop?.find((ps: any) => ps.name === s.name)),
                ...(parsed.shop || [])
              ],
              
              // Merge categories
              categories: [...new Set([
                ...(currentState.categories || []),
                ...(parsed.categories || [])
              ])],
              
              // Merge achievements by ID
              achievements: [
                ...currentState.achievements.filter(a => !parsed.achievements?.find((pa: any) => pa.id === a.id)),
                ...(parsed.achievements || [])
              ],
              
              // Use imported settings and stats (user likely wants the most recent)
              userStats: parsed.userStats || currentState.userStats,
              settings: parsed.settings || currentState.settings,
              version: parsed.version || currentState.version,
            };
            
            set(mergedState);
          } else {
            // Replace mode - use imported data directly
            const importedState = {
              habits: parsed.habits || [],
              points: parsed.points || 0,
              totalXP: parsed.totalXP || 0,
              goals: parsed.goals || {},
              inventory: parsed.inventory || [],
              shop: parsed.shop || [],
              categories: parsed.categories || DEFAULT_CATEGORIES,
              achievements: parsed.achievements || [],
              userStats: parsed.userStats || defaultUserStats,
              settings: parsed.settings || defaultSettings,
              version: parsed.version || '4.1.2.0',
            };
            
            set(importedState);
          }
          
          return { 
            success: true, 
            mode: mergeMode,
            metadata: parsed._metadata,
            summary: {
              habits: parsed.habits?.length || 0,
              points: parsed.points || 0,
              categories: parsed.categories?.length || 0,
              rewards: parsed.shop?.length || 0
            }
          };
        } catch (error) {
          console.error('Import error:', error);
          return { success: false, error: 'Failed to parse data', details: error };
        }
      },
      
      // Data validation helper
      validateImportData: (data: any) => {
        const errors: string[] = [];
        
        // Check if it's a valid object
        if (!data || typeof data !== 'object') {
          errors.push('Invalid data format - must be a valid JSON object');
          return { isValid: false, errors };
        }
        
        // Check for metadata and version compatibility
        if (data._metadata) {
          const metadata = data._metadata;
          if (metadata.exportVersion && metadata.exportVersion.split('.')[0] !== '4') {
            errors.push(`Version incompatibility - exported from v${metadata.exportVersion}, current is v4.x.x`);
          }
        }
        
        // Validate core data structures
        if (data.habits && !Array.isArray(data.habits)) {
          errors.push('Habits data must be an array');
        }
        
        if (data.shop && !Array.isArray(data.shop)) {
          errors.push('Shop data must be an array');
        }
        
        if (data.goals && typeof data.goals !== 'object') {
          errors.push('Goals data must be an object');
        }
        
        // Validate habits structure if present
        if (data.habits) {
          data.habits.forEach((habit: any, index: number) => {
            if (!habit.id || !habit.name) {
              errors.push(`Habit at index ${index} missing required fields (id, name)`);
            }
          });
        }
        
        return {
          isValid: errors.length === 0,
          errors,
          warningCount: errors.filter(e => e.includes('incompatibility')).length
        };
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
