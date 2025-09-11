import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';

interface AnimatedStatsProps {
  title: string;
  value: number | string;
  previousValue?: number;
  icon?: LucideIcon;
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info';
  prefix?: string;
  suffix?: string;
  showTrend?: boolean;
  animated?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const variantStyles = {
  default: {
    gradient: 'from-slate-400 to-slate-600',
    glow: 'shadow-slate-500/25',
    icon: 'text-slate-400',
    trend: 'text-slate-500',
  },
  success: {
    gradient: 'from-emerald-400 to-green-600',
    glow: 'shadow-emerald-500/25',
    icon: 'text-emerald-400',
    trend: 'text-emerald-500',
  },
  warning: {
    gradient: 'from-amber-400 to-orange-600',
    glow: 'shadow-amber-500/25',
    icon: 'text-amber-400',
    trend: 'text-amber-500',
  },
  danger: {
    gradient: 'from-red-400 to-rose-600',
    glow: 'shadow-red-500/25',
    icon: 'text-red-400',
    trend: 'text-red-500',
  },
  info: {
    gradient: 'from-blue-400 to-cyan-600',
    glow: 'shadow-blue-500/25',
    icon: 'text-blue-400',
    trend: 'text-blue-500',
  },
};

const sizeStyles = {
  sm: {
    title: 'text-xs',
    value: 'text-lg',
    icon: 16,
    padding: 'p-3',
  },
  md: {
    title: 'text-sm',
    value: 'text-2xl',
    icon: 20,
    padding: 'p-4',
  },
  lg: {
    title: 'text-base',
    value: 'text-3xl',
    icon: 24,
    padding: 'p-6',
  },
};

export const AnimatedStats: React.FC<AnimatedStatsProps> = ({
  title,
  value,
  previousValue,
  icon: Icon,
  variant = 'default',
  prefix = '',
  suffix = '',
  showTrend = false,
  animated = true,
  size = 'md',
  className = '',
}) => {
  const [displayValue, setDisplayValue] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  const variantStyle = variantStyles[variant];
  const sizeStyle = sizeStyles[size];
  
  const numericValue = typeof value === 'number' ? value : parseFloat(value.toString()) || 0;
  const trend = previousValue ? numericValue - previousValue : 0;
  const trendPercentage = previousValue ? ((trend / previousValue) * 100).toFixed(1) : '0';

  useEffect(() => {
    setIsVisible(true);
    
    if (animated && typeof value === 'number') {
      const duration = 1000; // 1 second
      const steps = 60; // 60 FPS
      const increment = numericValue / steps;
      let current = 0;
      let step = 0;

      const timer = setInterval(() => {
        current += increment;
        step++;
        
        if (step >= steps || current >= numericValue) {
          setDisplayValue(numericValue);
          clearInterval(timer);
        } else {
          setDisplayValue(Math.floor(current));
        }
      }, duration / steps);

      return () => clearInterval(timer);
    } else {
      setDisplayValue(numericValue);
    }
  }, [value, animated, numericValue]);

  return (
    <motion.div
      className={`
        relative overflow-hidden rounded-2xl border border-white/20
        bg-white/10 dark:bg-white/5 backdrop-blur-md
        ${sizeStyle.padding}
        ${variantStyle.glow} shadow-lg
        ${className}
      `}
      initial={{ opacity: 0, y: 20, scale: 0.9 }}
      animate={{ 
        opacity: isVisible ? 1 : 0, 
        y: isVisible ? 0 : 20,
        scale: isVisible ? 1 : 0.9,
      }}
      transition={{
        type: "spring",
        stiffness: 400,
        damping: 17,
      }}
      whileHover={{ 
        scale: 1.02,
        y: -2,
      }}
    >
      {/* Background Glow */}
      <div 
        className={`absolute inset-0 bg-gradient-to-r ${variantStyle.gradient} opacity-5 rounded-2xl`}
      />
      
      {/* Animated Background Particles */}
      <div className="absolute inset-0 overflow-hidden rounded-2xl">
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className={`absolute w-1 h-1 bg-gradient-to-r ${variantStyle.gradient} rounded-full opacity-30`}
            style={{
              left: `${20 + i * 30}%`,
              top: `${20 + i * 20}%`,
            }}
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.3, 0.7, 0.3],
            }}
            transition={{
              duration: 2 + i * 0.5,
              repeat: Infinity,
            }}
          />
        ))}
      </div>
      
      {/* Content */}
      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-2">
          <h3 className={`font-medium text-neutral-600 dark:text-neutral-300 ${sizeStyle.title}`}>
            {title}
          </h3>
          {Icon && (
            <motion.div
              initial={{ rotate: 0 }}
              animate={{ rotate: isVisible ? 360 : 0 }}
              transition={{ duration: 1 }}
            >
              <Icon size={sizeStyle.icon} className={variantStyle.icon} />
            </motion.div>
          )}
        </div>
        
        {/* Value */}
        <div className="flex items-end gap-2">
          <motion.span 
            className={`font-bold bg-gradient-to-r ${variantStyle.gradient} bg-clip-text text-transparent ${sizeStyle.value}`}
            key={displayValue} // Re-animate when value changes
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            {prefix}{typeof value === 'number' ? displayValue.toLocaleString() : value}{suffix}
          </motion.span>
          
          {/* Trend Indicator */}
          {showTrend && previousValue && (
            <motion.div
              className={`flex items-center text-xs ${variantStyle.trend}`}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              <motion.span
                animate={{ 
                  rotate: trend > 0 ? 0 : 180,
                  color: trend > 0 ? '#10b981' : '#ef4444'
                }}
                transition={{ duration: 0.3 }}
              >
                ↗
              </motion.span>
              <span className={trend > 0 ? 'text-emerald-500' : 'text-red-500'}>
                {Math.abs(parseFloat(trendPercentage))}%
              </span>
            </motion.div>
          )}
        </div>
        
        {/* Progress Bar for percentage values */}
        {suffix === '%' && (
          <motion.div
            className="mt-3 h-2 bg-neutral-200/20 dark:bg-neutral-700/20 rounded-full overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              className={`h-full bg-gradient-to-r ${variantStyle.gradient} rounded-full`}
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(numericValue, 100)}%` }}
              transition={{ 
                duration: 1.5, 
                ease: "easeOut",
              }}
            />
          </motion.div>
        )}
      </div>
      
      {/* Shimmer Effect */}
      <motion.div
        className="absolute inset-0 rounded-2xl"
        style={{
          background: 'linear-gradient(110deg, transparent 40%, rgba(255,255,255,0.1) 50%, transparent 60%)',
          transform: 'translateX(-100%)',
        }}
        animate={{
          transform: 'translateX(100%)',
        }}
        transition={{
          duration: 2,
          ease: 'easeInOut',
          repeat: Infinity,
          repeatDelay: 3,
        }}
      />
    </motion.div>
  );
};
