import React from 'react';
import { motion } from 'framer-motion';
import { cn, buttonVariants, progressVariants } from '../../utils/design';
import { actionIcons, statusIcons, iconSizes } from '../../utils/icons';
import type { LucideIcon } from 'lucide-react';

// Re-export ThemeToggle
export { ThemeToggle } from './ThemeToggle';

// Re-export new enhanced components
export { GlowIconButton } from './GlowIconButton';
export { GlassCard } from './GlassCard';
export { AnimatedStats } from './AnimatedStats';

interface EnhancedButtonProps {
  children: React.ReactNode;
  variant?: keyof typeof buttonVariants;
  size?: 'sm' | 'md' | 'lg';
  icon?: keyof typeof actionIcons | LucideIcon;
  iconPosition?: 'left' | 'right';
  disabled?: boolean;
  loading?: boolean;
  onClick?: () => void;
  className?: string;
  fullWidth?: boolean;
}

export const EnhancedButton: React.FC<EnhancedButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  icon,
  iconPosition = 'left',
  disabled = false,
  loading = false,
  onClick,
  className,
  fullWidth = false,
}) => {
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  const IconComponent = typeof icon === 'string' ? actionIcons[icon] : icon;

  return (
    <motion.button
      className={cn(
        buttonVariants[variant],
        sizeClasses[size],
        {
          'w-full': fullWidth,
          'opacity-50 cursor-not-allowed': disabled || loading,
        },
        className
      )}
      onClick={onClick}
      disabled={disabled || loading}
      whileHover={!disabled && !loading ? { scale: 1.02 } : {}}
      whileTap={!disabled && !loading ? { scale: 0.98 } : {}}
      transition={{ duration: 0.2 }}
    >
      <div className="flex items-center justify-center gap-2">
        {IconComponent && iconPosition === 'left' && (
          <IconComponent size={iconSizes[size === 'sm' ? 'sm' : size === 'lg' ? 'lg' : 'md']} />
        )}
        {loading ? (
          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
        ) : (
          children
        )}
        {IconComponent && iconPosition === 'right' && !loading && (
          <IconComponent size={iconSizes[size === 'sm' ? 'sm' : size === 'lg' ? 'lg' : 'md']} />
        )}
      </div>
    </motion.button>
  );
};

interface ProgressBarProps {
  value: number;
  max?: number;
  variant?: keyof typeof progressVariants;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  animated?: boolean;
  className?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  max = 100,
  variant = 'default',
  size = 'md',
  showLabel = true,
  animated = true,
  className,
}) => {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));
  
  const sizeClasses = {
    sm: 'h-2',
    md: 'h-3',
    lg: 'h-4',
  };

  return (
    <div className={cn('w-full', className)}>
      {showLabel && (
        <div className="flex justify-between items-center mb-1">
          <span className="text-sm text-neutral-600 dark:text-neutral-400">{value}/{max}</span>
          <span className="text-sm text-neutral-600 dark:text-neutral-400">{Math.round(percentage)}%</span>
        </div>
      )}
      <div className={cn('bg-neutral-300 dark:bg-neutral-800 rounded-full overflow-hidden', sizeClasses[size])}>
        {animated ? (
          <motion.div
            className={cn('h-full rounded-full', progressVariants[variant])}
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
          />
        ) : (
          <div
            className={cn('h-full rounded-full', progressVariants[variant])}
            style={{ width: `${percentage}%` }}
          />
        )}
      </div>
    </div>
  );
};

interface StatCardProps {
  title: string;
  value: string | number;
  icon?: keyof typeof statusIcons | LucideIcon;
  change?: {
    value: number;
    type: 'increase' | 'decrease';
  };
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info';
  className?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon,
  change,
  variant = 'default',
  className,
}) => {
  const IconComponent = typeof icon === 'string' ? statusIcons[icon] : icon;
  
  const variantColors = {
    default: 'text-neutral-600 dark:text-neutral-300',
    success: 'text-green-400',
    warning: 'text-yellow-400',
    danger: 'text-red-400',
    info: 'text-cyan-400',
  };

  return (
    <motion.div
      className={cn(
        'bg-neutral-100/60 dark:bg-neutral-900/60 backdrop-blur-sm border border-neutral-300/50 dark:border-neutral-700/50 rounded-xl p-4',
        className
      )}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-1">{title}</p>
          <p className={cn('text-2xl font-bold', variantColors[variant])}>
            {value}
          </p>
          {change && (
            <div className="flex items-center mt-1">
              <span
                className={cn(
                  'text-xs font-medium',
                  change.type === 'increase' ? 'text-green-400' : 'text-red-400'
                )}
              >
                {change.type === 'increase' ? '+' : '-'}{Math.abs(change.value)}%
              </span>
            </div>
          )}
        </div>
        {IconComponent && (
          <div className={cn('p-2 rounded-lg bg-neutral-200/50 dark:bg-neutral-800/50', variantColors[variant])}>
            <IconComponent size={iconSizes.lg} />
          </div>
        )}
      </div>
    </motion.div>
  );
};

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'info';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  size = 'md',
  className,
}) => {
  const variantClasses = {
    default: 'bg-neutral-600 dark:bg-neutral-700 text-neutral-100 dark:text-neutral-200',
    primary: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    success: 'bg-green-500/20 text-green-400 border-green-500/30',
    warning: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    danger: 'bg-red-500/20 text-red-400 border-red-500/30',
    info: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
  };

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-sm',
    lg: 'px-3 py-1.5 text-base',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full font-medium border',
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
    >
      {children}
    </span>
  );
};
