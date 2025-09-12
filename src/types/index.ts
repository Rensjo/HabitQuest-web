export const FREQUENCIES = ["daily", "weekly", "monthly", "yearly"] as const;
export const DEFAULT_CATEGORIES = [
  "CAREER",
  "CREATIVE",
  "FINANCIAL",
  "PERSONAL DEVELOPMENT",
  "RELATIONSHIPS",
  "SPIRITUAL",
];

export type Frequency = typeof FREQUENCIES[number];

export type Habit = {
  id: string;
  title: string;
  description?: string;
  frequency: Frequency;
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

export type Reward = { 
  id: string; 
  name: string; 
  cost: number;
  description?: string;
  icon?: string;
  rarity?: 'common' | 'rare' | 'epic' | 'legendary';
};

export type Achievement = {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt?: string;
  progress: number;
  target: number;
  category: string;
};

export type UserStats = {
  totalHabitsCompleted: number;
  longestStreak: number;
  totalDaysActive: number;
  favoriteCategory: string;
  weeklyAverage: number;
  monthlyAverage: number;
};

export type AppSettings = {
  theme: 'light' | 'dark' | 'auto';
  gradientColors: string[];
  animations: boolean;
  soundEffects: boolean;
  notifications: boolean;
  language: string;
  startOfWeek: 0 | 1; // 0 = Sunday, 1 = Monday
};

export type Stored = {
  habits: Habit[];
  points: number;
  totalXP: number;
  goals: Record<string, { monthlyTargetXP: number }>;
  inventory: Array<{ name: string; cost: number; redeemedAt: string }> | any[];
  shop: Reward[];
  /** Custom (uppercase) categories the user added */
  categories?: string[];
};

export type StoredData = {
  habits: Habit[];
  points: number;
  totalXP: number;
  goals: Record<string, { monthlyTargetXP: number }>;
  inventory: any[];
  shop: Reward[];
  categories: string[];
  achievements: Achievement[];
  userStats: UserStats;
  settings: AppSettings;
  version: string;
};

export type ThemeColors = {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  surface: string;
  text: string;
  textSecondary: string;
  border: string;
  success: string;
  warning: string;
  error: string;
};

// Additional types for missing definitions
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
  totalCount: number;
  completedCount: number;
  completionRate: number;
  totalXP: number;
  xpEarned: number;
  habitsForDay: Array<Habit>;
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