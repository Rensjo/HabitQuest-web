/**
 * ================================================================================================
 * OPTIMIZED ANIMATION SYSTEM
 * ================================================================================================
 * 
 * Performance-optimized animations with GPU acceleration
 * Reduced motion support and optimized variants
 * 
 * @version 1.0.0
 */

import { Variants } from 'framer-motion';

// ================================================================================================
// PERFORMANCE CONFIGURATION
// ================================================================================================

// Check for reduced motion preference
export const prefersReducedMotion = () => {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

// Check for high refresh rate displays
export const hasHighRefreshRate = () => {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(min-resolution: 120dpi)').matches;
};

// ================================================================================================
// OPTIMIZED ANIMATION VARIANTS
// ================================================================================================

// Base animation configuration
const baseConfig = {
  duration: prefersReducedMotion() ? 0.1 : 0.3,
  ease: prefersReducedMotion() ? 'linear' : [0.4, 0, 0.2, 1],
};

// GPU-accelerated transforms
export const optimizedTransforms = {
  // Fade animations
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: baseConfig,
  },
  
  fadeOut: {
    initial: { opacity: 1 },
    animate: { opacity: 0 },
    exit: { opacity: 0 },
    transition: baseConfig,
  },
  
  // Slide animations (GPU accelerated)
  slideUp: {
    initial: { opacity: 0, y: 20, scale: 0.95 },
    animate: { opacity: 1, y: 0, scale: 1 },
    exit: { opacity: 0, y: -20, scale: 0.95 },
    transition: {
      ...baseConfig,
      scale: { duration: baseConfig.duration * 0.8 },
    },
  },
  
  slideDown: {
    initial: { opacity: 0, y: -20, scale: 0.95 },
    animate: { opacity: 1, y: 0, scale: 1 },
    exit: { opacity: 0, y: 20, scale: 0.95 },
    transition: {
      ...baseConfig,
      scale: { duration: baseConfig.duration * 0.8 },
    },
  },
  
  slideLeft: {
    initial: { opacity: 0, x: 20, scale: 0.95 },
    animate: { opacity: 1, x: 0, scale: 1 },
    exit: { opacity: 0, x: -20, scale: 0.95 },
    transition: {
      ...baseConfig,
      scale: { duration: baseConfig.duration * 0.8 },
    },
  },
  
  slideRight: {
    initial: { opacity: 0, x: -20, scale: 0.95 },
    animate: { opacity: 1, x: 0, scale: 1 },
    exit: { opacity: 0, x: 20, scale: 0.95 },
    transition: {
      ...baseConfig,
      scale: { duration: baseConfig.duration * 0.8 },
    },
  },
  
  // Scale animations
  scaleIn: {
    initial: { opacity: 0, scale: 0.8 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.8 },
    transition: baseConfig,
  },
  
  scaleOut: {
    initial: { opacity: 1, scale: 1 },
    animate: { opacity: 0, scale: 0.8 },
    exit: { opacity: 0, scale: 0.8 },
    transition: baseConfig,
  },
  
  // Rotation animations
  rotateIn: {
    initial: { opacity: 0, rotate: -180, scale: 0.8 },
    animate: { opacity: 1, rotate: 0, scale: 1 },
    exit: { opacity: 0, rotate: 180, scale: 0.8 },
    transition: {
      ...baseConfig,
      rotate: { duration: baseConfig.duration * 1.2 },
    },
  },
};

// ================================================================================================
// STAGGER ANIMATIONS
// ================================================================================================

export const staggerContainer: Variants = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: prefersReducedMotion() ? 0.05 : 0.1,
      delayChildren: prefersReducedMotion() ? 0.05 : 0.1,
    },
  },
  exit: {
    transition: {
      staggerChildren: 0.05,
      staggerDirection: -1,
    },
  },
};

export const staggerItem: Variants = {
  initial: { opacity: 0, y: 20 },
  animate: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: baseConfig.duration,
      ease: baseConfig.ease,
    },
  },
  exit: { 
    opacity: 0, 
    y: -20,
    transition: {
      duration: baseConfig.duration * 0.5,
      ease: 'easeIn',
    },
  },
};

// ================================================================================================
// CARD ANIMATIONS
// ================================================================================================

export const cardAnimation: Variants = {
  initial: { 
    opacity: 0, 
    y: 20, 
    scale: 0.95,
    boxShadow: '0 0 0 rgba(0,0,0,0)',
  },
  animate: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)',
    transition: {
      duration: baseConfig.duration,
      ease: baseConfig.ease,
      boxShadow: { duration: baseConfig.duration * 1.5 },
    },
  },
  exit: { 
    opacity: 0, 
    y: -20, 
    scale: 0.95,
    boxShadow: '0 0 0 rgba(0,0,0,0)',
    transition: {
      duration: baseConfig.duration * 0.5,
      ease: 'easeIn',
    },
  },
  hover: {
    scale: 1.02,
    y: -2,
    boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05)',
    transition: {
      duration: 0.2,
      ease: 'easeOut',
    },
  },
  tap: {
    scale: 0.98,
    y: 0,
    transition: {
      duration: 0.1,
      ease: 'easeIn',
    },
  },
};

// ================================================================================================
// BUTTON ANIMATIONS
// ================================================================================================

export const buttonAnimation: Variants = {
  initial: { scale: 1 },
  hover: {
    scale: 1.05,
    transition: {
      duration: 0.2,
      ease: 'easeOut',
    },
  },
  tap: {
    scale: 0.95,
    transition: {
      duration: 0.1,
      ease: 'easeIn',
    },
  },
  disabled: {
    scale: 1,
    opacity: 0.5,
  },
};

// ================================================================================================
// MODAL ANIMATIONS
// ================================================================================================

export const modalAnimation: Variants = {
  initial: { 
    opacity: 0, 
    scale: 0.9,
    y: 20,
  },
  animate: { 
    opacity: 1, 
    scale: 1,
    y: 0,
    transition: {
      duration: baseConfig.duration,
      ease: baseConfig.ease,
      scale: { duration: baseConfig.duration * 0.8 },
    },
  },
  exit: { 
    opacity: 0, 
    scale: 0.9,
    y: 20,
    transition: {
      duration: baseConfig.duration * 0.5,
      ease: 'easeIn',
    },
  },
};

export const modalBackdropAnimation: Variants = {
  initial: { opacity: 0 },
  animate: { 
    opacity: 1,
    transition: {
      duration: baseConfig.duration * 0.5,
      ease: 'easeOut',
    },
  },
  exit: { 
    opacity: 0,
    transition: {
      duration: baseConfig.duration * 0.3,
      ease: 'easeIn',
    },
  },
};

// ================================================================================================
// LIST ANIMATIONS
// ================================================================================================

export const listAnimation: Variants = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: {
      staggerChildren: prefersReducedMotion() ? 0.02 : 0.05,
      delayChildren: 0.1,
    },
  },
  exit: {
    opacity: 0,
    transition: {
      staggerChildren: 0.02,
      staggerDirection: -1,
    },
  },
};

export const listItemAnimation: Variants = {
  initial: { 
    opacity: 0, 
    x: -20,
    scale: 0.95,
  },
  animate: { 
    opacity: 1, 
    x: 0,
    scale: 1,
    transition: {
      duration: baseConfig.duration,
      ease: baseConfig.ease,
    },
  },
  exit: { 
    opacity: 0, 
    x: 20,
    scale: 0.95,
    transition: {
      duration: baseConfig.duration * 0.5,
      ease: 'easeIn',
    },
  },
};

// ================================================================================================
// LOADING ANIMATIONS
// ================================================================================================

export const loadingSpinnerAnimation: Variants = {
  animate: {
    rotate: 360,
    transition: {
      duration: 1,
      ease: 'linear',
      repeat: Infinity,
    },
  },
};

export const loadingPulseAnimation: Variants = {
  animate: {
    scale: [1, 1.1, 1],
    opacity: [0.5, 1, 0.5],
    transition: {
      duration: 1.5,
      ease: 'easeInOut',
      repeat: Infinity,
    },
  },
};

// ================================================================================================
// PERFORMANCE OPTIMIZATIONS
// ================================================================================================

// Optimize animations for performance
export const optimizeAnimation = (variants: Variants): Variants => {
  if (prefersReducedMotion()) {
    // Reduce motion for accessibility
    return {
      ...variants,
      animate: {
        ...variants.animate,
        transition: {
          ...variants.animate?.transition,
          duration: 0.1,
          ease: 'linear',
        },
      },
    };
  }
  
  if (hasHighRefreshRate()) {
    // Optimize for high refresh rate displays
    return {
      ...variants,
      animate: {
        ...variants.animate,
        transition: {
          ...variants.animate?.transition,
          duration: (variants.animate?.transition?.duration || 0.3) * 0.8,
        },
      },
    };
  }
  
  return variants;
};

// ================================================================================================
// ANIMATION UTILITIES
// ================================================================================================

// Create optimized animation variants
export const createOptimizedVariants = (baseVariants: Variants): Variants => {
  return optimizeAnimation(baseVariants);
};

// Get animation based on user preferences
export const getAdaptiveAnimation = (fullAnimation: Variants, reducedAnimation: Variants): Variants => {
  return prefersReducedMotion() ? reducedAnimation : fullAnimation;
};

// ================================================================================================
// EXPORT ALL ANIMATIONS
// ================================================================================================

export const animations = {
  // Basic animations
  ...optimizedTransforms,
  
  // Stagger animations
  staggerContainer,
  staggerItem,
  
  // Component animations
  cardAnimation,
  buttonAnimation,
  modalAnimation,
  modalBackdropAnimation,
  listAnimation,
  listItemAnimation,
  
  // Loading animations
  loadingSpinnerAnimation,
  loadingPulseAnimation,
  
  // Utilities
  optimizeAnimation,
  createOptimizedVariants,
  getAdaptiveAnimation,
  prefersReducedMotion,
  hasHighRefreshRate,
};
