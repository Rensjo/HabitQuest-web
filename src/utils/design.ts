import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Utility for merging Tailwind classes
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Dynamic container variants
export const containerVariants = {
  card: "bg-slate-900/60 backdrop-blur-sm border border-slate-800/60 rounded-2xl shadow-xl",
  cardHover: "bg-slate-900/60 backdrop-blur-sm border border-slate-800/60 rounded-2xl shadow-xl hover:bg-slate-800/70 hover:border-slate-700/60 transition-all duration-300",
  glassmorphism: "bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl shadow-2xl",
  neon: "bg-slate-900/80 border border-cyan-500/30 rounded-2xl shadow-lg shadow-cyan-500/10",
  gradient: "bg-gradient-to-br from-slate-900/60 via-slate-800/50 to-slate-900/70 backdrop-blur-sm border border-slate-700/50 rounded-2xl",
};

// Dynamic spacing system
export const spacing = {
  xs: "p-2",
  sm: "p-3", 
  md: "p-4",
  lg: "p-6",
  xl: "p-8",
  "2xl": "p-12",
};

// Dynamic text variants
export const textVariants = {
  heading: "font-bold tracking-tight",
  subheading: "font-semibold text-slate-300",
  body: "text-slate-400",
  accent: "bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent font-bold",
  success: "text-green-400 font-medium",
  warning: "text-yellow-400 font-medium",
  error: "text-red-400 font-medium",
};

// Animation variants for Framer Motion
export const animationVariants = {
  fadeIn: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 }
  },
  slideIn: {
    initial: { opacity: 0, x: -20 },
    animate: { opacity: 1, x: 0 },
    transition: { duration: 0.4 }
  },
  scaleIn: {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1 },
    transition: { duration: 0.3 }
  },
  stagger: {
    container: {
      animate: {
        transition: {
          staggerChildren: 0.1
        }
      }
    },
    item: {
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 }
    }
  }
};

// Button variants
export const buttonVariants = {
  primary: "bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-semibold rounded-lg px-4 py-2 transition-all duration-200 shadow-lg hover:shadow-xl",
  secondary: "bg-slate-700 hover:bg-slate-600 text-white font-medium rounded-lg px-4 py-2 transition-all duration-200",
  success: "bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-semibold rounded-lg px-4 py-2 transition-all duration-200",
  danger: "bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white font-semibold rounded-lg px-4 py-2 transition-all duration-200",
  ghost: "bg-transparent hover:bg-slate-800/50 text-slate-300 hover:text-white font-medium rounded-lg px-4 py-2 transition-all duration-200",
  outline: "border border-slate-600 hover:border-slate-500 bg-transparent hover:bg-slate-800/30 text-slate-300 hover:text-white font-medium rounded-lg px-4 py-2 transition-all duration-200",
};

// Progress bar variants
export const progressVariants = {
  default: "bg-gradient-to-r from-blue-500 to-cyan-500",
  success: "bg-gradient-to-r from-green-500 to-emerald-500",
  warning: "bg-gradient-to-r from-yellow-500 to-orange-500",
  danger: "bg-gradient-to-r from-red-500 to-pink-500",
  purple: "bg-gradient-to-r from-purple-500 to-violet-500",
};

// Grid system for responsive layouts
export const gridVariants = {
  auto: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4",
  "2col": "grid grid-cols-1 md:grid-cols-2 gap-4",
  "3col": "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4",
  "4col": "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4",
  responsive: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4",
};

// Shadow variants
export const shadowVariants = {
  soft: "shadow-lg",
  medium: "shadow-xl",
  hard: "shadow-2xl",
  glow: "shadow-2xl shadow-cyan-500/20",
  colored: "shadow-xl shadow-purple-500/20",
};
