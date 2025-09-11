/**
 * ================================================================================================
 * HABITQUEST THEME SYSTEM
 * ================================================================================================
 * 
 * Theme configuration for light/dark mode support with neutral color palette
 * 
 * @version 4.0.0
 */

export const theme = {
  // Background gradients
  backgrounds: {
    primary: "bg-gradient-to-br from-neutral-50 via-neutral-100 to-neutral-200 dark:from-neutral-900 dark:via-neutral-950 dark:to-black",
    secondary: "bg-gradient-to-r from-neutral-100 to-neutral-200 dark:from-neutral-800 dark:to-neutral-900",
    card: "bg-neutral-50/80 dark:bg-neutral-900/60 backdrop-blur-sm",
    cardHover: "hover:bg-neutral-100/90 dark:hover:bg-neutral-800/70",
    glass: "bg-white/10 dark:bg-white/5 backdrop-blur-lg",
  },

  // Border colors
  borders: {
    primary: "border-neutral-200 dark:border-neutral-700/60",
    secondary: "border-neutral-300 dark:border-neutral-600/60",
    accent: "border-neutral-400 dark:border-neutral-500/60",
  },

  // Text colors
  text: {
    primary: "text-neutral-900 dark:text-neutral-100",
    secondary: "text-neutral-700 dark:text-neutral-300", 
    muted: "text-neutral-500 dark:text-neutral-400",
    inverse: "text-neutral-100 dark:text-neutral-900",
  },

  // Button variants with neutral base
  buttons: {
    primary: "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg shadow-blue-500/25",
    secondary: "bg-neutral-200 hover:bg-neutral-300 dark:bg-neutral-700 dark:hover:bg-neutral-600 text-neutral-900 dark:text-neutral-100",
    success: "bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white shadow-lg shadow-emerald-500/25",
    warning: "bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white shadow-lg shadow-amber-500/25",
    danger: "bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white shadow-lg shadow-red-500/25",
    ghost: "hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300",
  },

  // Shadow variants
  shadows: {
    sm: "shadow-sm shadow-neutral-500/10 dark:shadow-black/20",
    md: "shadow-md shadow-neutral-500/15 dark:shadow-black/30",
    lg: "shadow-lg shadow-neutral-500/20 dark:shadow-black/40",
    xl: "shadow-xl shadow-neutral-500/25 dark:shadow-black/50",
  },

  // Animation presets
  animations: {
    fadeIn: {
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
      transition: { duration: 0.5 }
    },
    scaleIn: {
      initial: { opacity: 0, scale: 0.95 },
      animate: { opacity: 1, scale: 1 },
      transition: { duration: 0.3 }
    },
    slideIn: {
      initial: { opacity: 0, x: -20 },
      animate: { opacity: 1, x: 0 },
      transition: { duration: 0.4 }
    },
    bounce: {
      whileHover: { scale: 1.02 },
      whileTap: { scale: 0.98 },
      transition: { type: "spring", stiffness: 400, damping: 17 }
    }
  }
};

// Utility function to combine theme classes
export function getThemeClasses(variant: keyof typeof theme.backgrounds | keyof typeof theme.buttons, type: 'background' | 'button' = 'background') {
  if (type === 'button') {
    return theme.buttons[variant as keyof typeof theme.buttons];
  }
  return theme.backgrounds[variant as keyof typeof theme.backgrounds];
}
