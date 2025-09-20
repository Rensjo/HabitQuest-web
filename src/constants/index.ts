/**
 * ================================================================================================
 * HABITQUEST CONSTANTS
 * ================================================================================================
 * 
 * Application-wide constants and configuration values
 * 
 * @version 4.0.0
 */

// ================================================================================================
// CORE CONSTANTS
// ================================================================================================

/** Frequencies supported for habits */
export const FREQUENCIES = ["daily", "weekly", "monthly", "yearly"] as const;

/** Default top‑level categories shown on first run */
export const DEFAULT_CATEGORIES = [
  "CAREER",
  "CREATIVE", 
  "FINANCIAL",
  "PERSONAL DEVELOPMENT",
  "RELATIONSHIPS",
  "SPIRITUAL",
] as const;

/** Protected category that cannot be deleted - for orphaned habits */
export const PROTECTED_FALLBACK_CATEGORY = "UNCATEGORIZED HABITS" as const;

/**
 * Weekday labels (Sun–Sat) used by the calendar header.
 * Keep in sync with Date.getDay() semantics where 0 === Sunday.
 */
export const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] as const;

/** LocalStorage key for persisted app state */
export const LS_KEY = "ghgt:data:v3";

// ================================================================================================
// UI CONSTANTS
// ================================================================================================

/** Animation duration settings */
export const ANIMATION_DURATION = {
  fast: 0.2,
  normal: 0.3,
  slow: 0.5,
  page: 0.8,
} as const;

/** Color palette for gradients and themes */
export const COLORS = {
  gradients: {
    primary: "from-blue-500 to-purple-600",
    secondary: "from-slate-800/60 to-slate-700",
    success: "from-emerald-500 to-cyan-600", 
    danger: "from-red-500 to-pink-600",
    warning: "from-yellow-500 to-orange-500",
  },
  backgrounds: {
    card: "bg-slate-900/60",
    cardHover: "bg-slate-800/60",
    overlay: "bg-black/60",
  }
} as const;

/** Breakpoint values for responsive design */
export const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
} as const;
