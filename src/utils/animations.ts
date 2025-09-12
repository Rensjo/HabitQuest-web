/**
 * ================================================================================================
 * OPTIMIZED ANIMATION UTILITIES
 * ================================================================================================
 * 
 * High-performance animation configurations for Tauri desktop
 * 
 * @version 1.0.0
 */

import type { Variants } from 'framer-motion';

// ================================================================================================
// PERFORMANCE-OPTIMIZED ANIMATION VARIANTS
// ================================================================================================

/**
 * Fade in animation (GPU-accelerated)
 */
export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { duration: 0.3, ease: 'easeOut' }
  },
  exit: { 
    opacity: 0,
    transition: { duration: 0.2, ease: 'easeIn' }
  }
};

/**
 * Slide up animation (GPU-accelerated)
 */
export const slideUp: Variants = {
  hidden: { 
    opacity: 0, 
    y: 20,
    scale: 0.95
  },
  visible: { 
    opacity: 1, 
    y: 0,
    scale: 1,
    transition: { 
      duration: 0.4, 
      ease: 'easeOut',
      type: 'spring',
      stiffness: 300,
      damping: 30
    }
  },
  exit: { 
    opacity: 0, 
    y: -20,
    scale: 0.95,
    transition: { duration: 0.2, ease: 'easeIn' }
  }
};

/**
 * Scale animation (GPU-accelerated)
 */
export const scaleIn: Variants = {
  hidden: { 
    opacity: 0, 
    scale: 0.8
  },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: { 
      duration: 0.3, 
      ease: 'easeOut',
      type: 'spring',
      stiffness: 400,
      damping: 25
    }
  },
  exit: { 
    opacity: 0, 
    scale: 0.8,
    transition: { duration: 0.2, ease: 'easeIn' }
  }
};

/**
 * Stagger animation for lists
 */
export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1
    }
  }
};

export const staggerItem: Variants = {
  hidden: { 
    opacity: 0, 
    y: 20,
    scale: 0.95
  },
  visible: { 
    opacity: 1, 
    y: 0,
    scale: 1,
    transition: { 
      duration: 0.3, 
      ease: 'easeOut'
    }
  }
};

// ================================================================================================
// HOVER ANIMATIONS (OPTIMIZED)
// ================================================================================================

/**
 * Optimized hover animation
 */
export const hoverScale = {
  scale: 1.02,
  transition: { duration: 0.2, ease: 'easeOut' }
};

/**
 * Optimized tap animation
 */
export const tapScale = {
  scale: 0.98,
  transition: { duration: 0.1, ease: 'easeOut' }
};

/**
 * Optimized hover with shadow
 */
export const hoverWithShadow = {
  scale: 1.02,
  boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1), 0 4px 6px -1px rgba(0,0,0,0.05)',
  transition: { duration: 0.2, ease: 'easeOut' }
};

// ================================================================================================
// MODAL ANIMATIONS
// ================================================================================================

/**
 * Modal backdrop animation
 */
export const modalBackdrop: Variants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { duration: 0.2, ease: 'easeOut' }
  },
  exit: { 
    opacity: 0,
    transition: { duration: 0.2, ease: 'easeIn' }
  }
};

/**
 * Modal content animation
 */
export const modalContent: Variants = {
  hidden: { 
    opacity: 0, 
    scale: 0.9,
    y: 20
  },
  visible: { 
    opacity: 1, 
    scale: 1,
    y: 0,
    transition: { 
      duration: 0.3, 
      ease: 'easeOut',
      type: 'spring',
      stiffness: 300,
      damping: 30
    }
  },
  exit: { 
    opacity: 0, 
    scale: 0.9,
    y: 20,
    transition: { duration: 0.2, ease: 'easeIn' }
  }
};

// ================================================================================================
// PERFORMANCE UTILITIES
// ================================================================================================

/**
 * Check if device prefers reduced motion
 */
export const prefersReducedMotion = (): boolean => {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

/**
 * Get optimized transition based on device capabilities
 */
export const getOptimizedTransition = (baseTransition: any) => {
  if (prefersReducedMotion()) {
    return { duration: 0.1, ease: 'easeOut' };
  }
  return baseTransition;
};

/**
 * Create a reduced motion variant
 */
export const createReducedMotionVariant = (variants: Variants): Variants => {
  if (prefersReducedMotion()) {
    return {
      hidden: { opacity: 0 },
      visible: { opacity: 1 },
      exit: { opacity: 0 }
    };
  }
  return variants;
};

// ================================================================================================
// ANIMATION PRESETS
// ================================================================================================

/**
 * Card animation preset
 */
export const cardAnimation = {
  initial: { opacity: 0, y: 20, scale: 0.95 },
  animate: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, y: -20, scale: 0.95 },
  transition: { duration: 0.3, ease: 'easeOut' }
};

/**
 * Button animation preset
 */
export const buttonAnimation = {
  whileHover: hoverScale,
  whileTap: tapScale,
  transition: { duration: 0.2, ease: 'easeOut' }
};

/**
 * List item animation preset
 */
export const listItemAnimation = {
  initial: { opacity: 0, x: -20 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 20 },
  transition: { duration: 0.2, ease: 'easeOut' }
};

// ================================================================================================
// EXPORTS
// ================================================================================================

// All exports are already declared above, no need to re-export
