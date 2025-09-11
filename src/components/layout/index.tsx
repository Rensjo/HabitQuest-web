import React from 'react';
import { motion } from 'framer-motion';
import { cn, containerVariants, spacing, shadowVariants, animationVariants } from '../../utils/design';

interface DynamicCardProps {
  children: React.ReactNode;
  variant?: keyof typeof containerVariants;
  size?: keyof typeof spacing;
  shadow?: keyof typeof shadowVariants;
  className?: string;
  onClick?: () => void;
  animated?: boolean;
  hoverable?: boolean;
  glass?: boolean;
}

export const DynamicCard: React.FC<DynamicCardProps> = ({
  children,
  variant = 'card',
  size = 'md',
  shadow = 'soft',
  className,
  onClick,
  animated = true,
  hoverable = false,
  glass = false,
}) => {
  const baseClasses = cn(
    containerVariants[variant],
    spacing[size],
    shadowVariants[shadow],
    {
      'cursor-pointer': onClick || hoverable,
      'hover:scale-[1.02] transition-transform duration-200': hoverable,
      'bg-white/5 backdrop-blur-lg border-white/10': glass,
    },
    className
  );

  if (animated) {
    return (
      <motion.div
        className={baseClasses}
        onClick={onClick}
        {...animationVariants.fadeIn}
        whileHover={hoverable ? { scale: 1.02 } : {}}
        whileTap={onClick ? { scale: 0.98 } : {}}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <div className={baseClasses} onClick={onClick}>
      {children}
    </div>
  );
};

interface DynamicContainerProps {
  children: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl' | '7xl' | 'full';
  padding?: keyof typeof spacing;
  centered?: boolean;
  className?: string;
}

export const DynamicContainer: React.FC<DynamicContainerProps> = ({
  children,
  maxWidth = '7xl',
  padding = 'md',
  centered = true,
  className,
}) => {
  const maxWidthClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    '3xl': 'max-w-3xl',
    '4xl': 'max-w-4xl',
    '5xl': 'max-w-5xl',
    '6xl': 'max-w-6xl',
    '7xl': 'max-w-7xl',
    full: 'max-w-full',
  };

  return (
    <div
      className={cn(
        'w-full',
        maxWidthClasses[maxWidth],
        spacing[padding],
        {
          'mx-auto': centered,
        },
        className
      )}
    >
      {children}
    </div>
  );
};

interface FlexProps {
  children: React.ReactNode;
  direction?: 'row' | 'col' | 'row-reverse' | 'col-reverse';
  justify?: 'start' | 'end' | 'center' | 'between' | 'around' | 'evenly';
  align?: 'start' | 'end' | 'center' | 'baseline' | 'stretch';
  wrap?: boolean;
  gap?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  className?: string;
}

export const Flex: React.FC<FlexProps> = ({
  children,
  direction = 'row',
  justify = 'start',
  align = 'start',
  wrap = false,
  gap = 'md',
  className,
}) => {
  const directionClasses = {
    row: 'flex-row',
    col: 'flex-col',
    'row-reverse': 'flex-row-reverse',
    'col-reverse': 'flex-col-reverse',
  };

  const justifyClasses = {
    start: 'justify-start',
    end: 'justify-end',
    center: 'justify-center',
    between: 'justify-between',
    around: 'justify-around',
    evenly: 'justify-evenly',
  };

  const alignClasses = {
    start: 'items-start',
    end: 'items-end',
    center: 'items-center',
    baseline: 'items-baseline',
    stretch: 'items-stretch',
  };

  const gapClasses = {
    none: 'gap-0',
    xs: 'gap-1',
    sm: 'gap-2',
    md: 'gap-4',
    lg: 'gap-6',
    xl: 'gap-8',
    '2xl': 'gap-12',
  };

  return (
    <div
      className={cn(
        'flex',
        directionClasses[direction],
        justifyClasses[justify],
        alignClasses[align],
        gapClasses[gap],
        {
          'flex-wrap': wrap,
        },
        className
      )}
    >
      {children}
    </div>
  );
};

interface GridProps {
  children: React.ReactNode;
  cols?: 1 | 2 | 3 | 4 | 5 | 6 | 'auto' | 'responsive';
  gap?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  className?: string;
}

export const Grid: React.FC<GridProps> = ({
  children,
  cols = 'auto',
  gap = 'md',
  className,
}) => {
  const colClasses = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
    5: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5',
    6: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6',
    auto: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
    responsive: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4',
  };

  const gapClasses = {
    none: 'gap-0',
    xs: 'gap-1',
    sm: 'gap-2',
    md: 'gap-4',
    lg: 'gap-6',
    xl: 'gap-8',
    '2xl': 'gap-12',
  };

  return (
    <div
      className={cn(
        'grid',
        colClasses[cols],
        gapClasses[gap],
        className
      )}
    >
      {children}
    </div>
  );
};
