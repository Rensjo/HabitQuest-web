import { forwardRef } from 'react';
import type { ButtonHTMLAttributes } from 'react';
import { motion } from 'framer-motion';
import { Icon } from './Icon';
import { useSoundEffectsOnly } from '../../hooks/useSoundEffects';

interface SoundButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'success' | 'gradient';
  size?: 'sm' | 'md' | 'lg';
  icon?: string;
  iconPosition?: 'left' | 'right';
  loading?: boolean;
  enableSounds?: boolean;
  gradientFrom?: string;
  gradientTo?: string;
  animate?: boolean;
}

export const SoundButton = forwardRef<HTMLButtonElement, SoundButtonProps>(
  ({ 
    variant = 'primary', 
    size = 'md', 
    icon, 
    iconPosition = 'left',
    loading = false,
    enableSounds = true,
    gradientFrom,
    gradientTo,
    animate = true,
    children, 
    className = '',
    disabled,
    onClick,
    ...props 
  }, ref) => {
    
    const { playButtonClick, playHover } = useSoundEffectsOnly();
    
    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (enableSounds) {
        playButtonClick();
      }
      onClick?.(e);
    };
    
    const handleMouseEnter = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (enableSounds && !disabled && !loading) {
        playHover();
      }
      props.onMouseEnter?.(e);
    };
    
    const baseClasses = `
      inline-flex items-center justify-center font-medium rounded-xl
      border transition-all duration-100 ease-in-out
      focus:outline-none focus:ring-2 focus:ring-offset-2
      disabled:opacity-50 disabled:cursor-not-allowed
      shadow-md hover:shadow-xl relative overflow-hidden
    `;
    
    const sizeClasses = {
      sm: 'px-3 py-1.5 text-sm gap-1.5',
      md: 'px-4 py-2 text-sm gap-2',
      lg: 'px-6 py-3 text-base gap-2.5',
    };
    
    const variantClasses = {
      primary: `
        text-white bg-gradient-to-r from-cyan-500 to-blue-600
        hover:from-cyan-400 hover:to-blue-500
        active:from-cyan-600 active:to-blue-700
        border-cyan-400 focus:ring-cyan-500
      `,
      secondary: `
        text-white bg-gradient-to-r from-purple-500 to-violet-600
        hover:from-purple-400 hover:to-violet-500
        active:from-purple-600 active:to-violet-700
        border-purple-400 focus:ring-purple-500
      `,
      outline: `
        bg-transparent text-neutral-800 dark:text-neutral-200
        border-neutral-300/70 dark:border-neutral-600/70
        hover:bg-neutral-100/60 dark:hover:bg-neutral-800/60
        focus:ring-neutral-500
      `,
      ghost: `
        bg-transparent border-transparent
        text-neutral-800 dark:text-neutral-200
        hover:bg-neutral-100/60 dark:hover:bg-neutral-800/60
        focus:ring-neutral-500
      `,
      danger: `
        text-white bg-gradient-to-r from-rose-500 to-red-600
        hover:from-rose-400 hover:to-red-500
        active:from-rose-600 active:to-red-700
        border-rose-400 focus:ring-rose-500
      `,
      success: `
        text-black bg-emerald-400 hover:bg-emerald-300 active:bg-emerald-500
        border-emerald-300 focus:ring-emerald-400
      `,
      gradient: `
        text-white border-0
        ${gradientFrom && gradientTo ? `bg-gradient-to-r ${gradientFrom} ${gradientTo}` : 'bg-gradient-to-r from-purple-500 to-violet-600'}
        hover:opacity-90 active:opacity-100
        focus:ring-purple-500
      `,
    };
    
    const classes = `${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${className}`;
    
    const iconSize = size === 'sm' ? 16 : size === 'lg' ? 20 : 18;

    const animationProps = animate ? {
      whileHover: { y: -2, scale: 1.05 },
      whileTap: { scale: 0.95 },
      transition: { duration: 0.1, ease: "easeOut" }
    } : {};

    return (
      <motion.button
        ref={ref}
        className={classes}
        disabled={disabled || loading}
        onClick={handleClick}
        onMouseEnter={handleMouseEnter}
        {...animationProps}
        {...props}
      >
        {loading && (
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            className="mr-2"
          >
            <Icon name="timer" size={iconSize} />
          </motion.div>
        )}
        
        {icon && iconPosition === 'left' && !loading && (
          <Icon name={icon} size={iconSize} />
        )}
        
        <span className="relative z-10">{children}</span>
        
        {icon && iconPosition === 'right' && !loading && (
          <Icon name={icon} size={iconSize} />
        )}
      </motion.button>
    );
  }
);

SoundButton.displayName = 'SoundButton';
