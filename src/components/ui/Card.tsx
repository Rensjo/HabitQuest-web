import { forwardRef } from 'react';
import type { HTMLAttributes } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'outlined';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  hover?: boolean;
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ 
    variant = 'default',
    padding = 'md',
    hover = false,
    className = '',
    children,
    ...props 
  }, ref) => {
    
    const baseClasses = `
      rounded-2xl transition-all duration-200 ease-in-out
      bg-white dark:bg-slate-900/60 backdrop-blur-sm
    `;
    
    const variantClasses = {
      default: 'border border-slate-200 dark:border-slate-800',
      elevated: 'shadow-lg hover:shadow-xl border border-slate-200 dark:border-slate-800',
      outlined: 'border-2 border-slate-300 dark:border-slate-700',
    };
    
    const paddingClasses = {
      none: '',
      sm: 'p-3',
      md: 'p-4',
      lg: 'p-6',
    };
    
    const hoverClasses = hover ? 'hover:scale-[1.02] cursor-pointer' : '';
    
    const classes = `${baseClasses} ${variantClasses[variant]} ${paddingClasses[padding]} ${hoverClasses} ${className}`;

    return (
      <div ref={ref} className={classes} {...props}>
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';
