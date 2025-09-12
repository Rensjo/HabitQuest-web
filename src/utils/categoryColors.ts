/**
 * Category Color Management Utilities
 * Provides consistent color themes for categories and random color assignment
 */

// Predefined color themes for default categories
export const CATEGORY_COLOR_THEMES: Record<string, {
  primary: string;
  secondary: string;
  border: string;
  shadow: string;
  background: string;
  text: string;
  icon: string;
}> = {
  CAREER: {
    primary: 'from-blue-500 to-indigo-600',
    secondary: 'from-blue-400 to-indigo-500',
    border: 'border-blue-400/60 dark:border-blue-400/40',
    shadow: 'shadow-blue-500/20 dark:shadow-blue-500/10',
    background: 'from-blue-500/8 to-indigo-500/8 dark:from-blue-500/10 dark:to-indigo-500/10',
    text: 'text-blue-600 dark:text-blue-400',
    icon: 'text-blue-500 dark:text-blue-400'
  },
  CREATIVE: {
    primary: 'from-purple-500 to-pink-600',
    secondary: 'from-purple-400 to-pink-500',
    border: 'border-purple-400/60 dark:border-purple-400/40',
    shadow: 'shadow-purple-500/20 dark:shadow-purple-500/10',
    background: 'from-purple-500/8 to-pink-500/8 dark:from-purple-500/10 dark:to-pink-500/10',
    text: 'text-purple-600 dark:text-purple-400',
    icon: 'text-purple-500 dark:text-purple-400'
  },
  FINANCIAL: {
    primary: 'from-emerald-500 to-green-600',
    secondary: 'from-emerald-400 to-green-500',
    border: 'border-emerald-400/60 dark:border-emerald-400/40',
    shadow: 'shadow-emerald-500/20 dark:shadow-emerald-500/10',
    background: 'from-emerald-500/8 to-green-500/8 dark:from-emerald-500/10 dark:to-green-500/10',
    text: 'text-emerald-600 dark:text-emerald-400',
    icon: 'text-emerald-500 dark:text-emerald-400'
  },
  'PERSONAL DEVELOPMENT': {
    primary: 'from-amber-500 to-orange-600',
    secondary: 'from-amber-400 to-orange-500',
    border: 'border-amber-400/60 dark:border-amber-400/40',
    shadow: 'shadow-amber-500/20 dark:shadow-amber-500/10',
    background: 'from-amber-500/8 to-orange-500/8 dark:from-amber-500/10 dark:to-orange-500/10',
    text: 'text-amber-600 dark:text-amber-400',
    icon: 'text-amber-500 dark:text-amber-400'
  },
  RELATIONSHIPS: {
    primary: 'from-rose-500 to-red-600',
    secondary: 'from-rose-400 to-red-500',
    border: 'border-rose-400/60 dark:border-rose-400/40',
    shadow: 'shadow-rose-500/20 dark:shadow-rose-500/10',
    background: 'from-rose-500/8 to-red-500/8 dark:from-rose-500/10 dark:to-red-500/10',
    text: 'text-rose-600 dark:text-rose-400',
    icon: 'text-rose-500 dark:text-rose-400'
  },
  SPIRITUAL: {
    primary: 'from-cyan-500 to-blue-600',
    secondary: 'from-cyan-400 to-blue-500',
    border: 'border-cyan-400/60 dark:border-cyan-400/40',
    shadow: 'shadow-cyan-500/20 dark:shadow-cyan-500/10',
    background: 'from-cyan-500/8 to-blue-500/8 dark:from-cyan-500/10 dark:to-blue-500/10',
    text: 'text-cyan-600 dark:text-cyan-400',
    icon: 'text-cyan-500 dark:text-cyan-400'
  }
};

// Random color pool for user-added categories
export const RANDOM_COLOR_POOL = [
  { primary: 'from-violet-500 to-purple-600', secondary: 'from-violet-400 to-purple-500', border: 'border-violet-400/60 dark:border-violet-400/40', shadow: 'shadow-violet-500/20 dark:shadow-violet-500/10', background: 'from-violet-500/8 to-purple-500/8 dark:from-violet-500/10 dark:to-purple-500/10', text: 'text-violet-600 dark:text-violet-400', icon: 'text-violet-500 dark:text-violet-400' },
  { primary: 'from-teal-500 to-cyan-600', secondary: 'from-teal-400 to-cyan-500', border: 'border-teal-400/60 dark:border-teal-400/40', shadow: 'shadow-teal-500/20 dark:shadow-teal-500/10', background: 'from-teal-500/8 to-cyan-500/8 dark:from-teal-500/10 dark:to-cyan-500/10', text: 'text-teal-600 dark:text-teal-400', icon: 'text-teal-500 dark:text-teal-400' },
  { primary: 'from-lime-500 to-green-600', secondary: 'from-lime-400 to-green-500', border: 'border-lime-400/60 dark:border-lime-400/40', shadow: 'shadow-lime-500/20 dark:shadow-lime-500/10', background: 'from-lime-500/8 to-green-500/8 dark:from-lime-500/10 dark:to-green-500/10', text: 'text-lime-600 dark:text-lime-400', icon: 'text-lime-500 dark:text-lime-400' },
  { primary: 'from-pink-500 to-rose-600', secondary: 'from-pink-400 to-rose-500', border: 'border-pink-400/60 dark:border-pink-400/40', shadow: 'shadow-pink-500/20 dark:shadow-pink-500/10', background: 'from-pink-500/8 to-rose-500/8 dark:from-pink-500/10 dark:to-rose-500/10', text: 'text-pink-600 dark:text-pink-400', icon: 'text-pink-500 dark:text-pink-400' },
  { primary: 'from-indigo-500 to-blue-600', secondary: 'from-indigo-400 to-blue-500', border: 'border-indigo-400/60 dark:border-indigo-400/40', shadow: 'shadow-indigo-500/20 dark:shadow-indigo-500/10', background: 'from-indigo-500/8 to-blue-500/8 dark:from-indigo-500/10 dark:to-blue-500/10', text: 'text-indigo-600 dark:text-indigo-400', icon: 'text-indigo-500 dark:text-indigo-400' },
  { primary: 'from-yellow-500 to-amber-600', secondary: 'from-yellow-400 to-amber-500', border: 'border-yellow-400/60 dark:border-yellow-400/40', shadow: 'shadow-yellow-500/20 dark:shadow-yellow-500/10', background: 'from-yellow-500/8 to-amber-500/8 dark:from-yellow-500/10 dark:to-amber-500/10', text: 'text-yellow-600 dark:text-yellow-400', icon: 'text-yellow-500 dark:text-yellow-400' },
  { primary: 'from-slate-500 to-gray-600', secondary: 'from-slate-400 to-gray-500', border: 'border-slate-400/60 dark:border-slate-400/40', shadow: 'shadow-slate-500/20 dark:shadow-slate-500/10', background: 'from-slate-500/8 to-gray-500/8 dark:from-slate-500/10 dark:to-gray-500/10', text: 'text-slate-600 dark:text-slate-400', icon: 'text-slate-500 dark:text-slate-400' },
  { primary: 'from-orange-500 to-red-600', secondary: 'from-orange-400 to-red-500', border: 'border-orange-400/60 dark:border-orange-400/40', shadow: 'shadow-orange-500/20 dark:shadow-orange-500/10', background: 'from-orange-500/8 to-red-500/8 dark:from-orange-500/10 dark:to-orange-500/10', text: 'text-orange-600 dark:text-orange-400', icon: 'text-orange-500 dark:text-orange-400' }
];

// Store for user-added category colors to ensure consistency
const userCategoryColors = new Map<string, typeof RANDOM_COLOR_POOL[0]>();

/**
 * Get color theme for a category
 * @param categoryName - The name of the category
 * @returns Color theme object
 */
export function getCategoryColorTheme(categoryName: string) {
  // Check if it's a predefined category
  if (CATEGORY_COLOR_THEMES[categoryName]) {
    return CATEGORY_COLOR_THEMES[categoryName];
  }
  
  // Check if we already assigned a color to this user category
  if (userCategoryColors.has(categoryName)) {
    return userCategoryColors.get(categoryName)!;
  }
  
  // Assign a random color from the pool
  const randomIndex = Math.floor(Math.random() * RANDOM_COLOR_POOL.length);
  const selectedColor = RANDOM_COLOR_POOL[randomIndex];
  userCategoryColors.set(categoryName, selectedColor);
  
  return selectedColor;
}

/**
 * Get all assigned category colors (for debugging or management)
 */
export function getAllCategoryColors() {
  return {
    predefined: CATEGORY_COLOR_THEMES,
    userAssigned: Object.fromEntries(userCategoryColors)
  };
}

/**
 * Reset user category colors (useful for testing or reset functionality)
 */
export function resetUserCategoryColors() {
  userCategoryColors.clear();
}
