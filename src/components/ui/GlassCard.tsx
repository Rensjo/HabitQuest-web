import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'elevated' | 'interactive' | 'glow';
  gradient?: string;
  glowColor?: string;
  onClick?: () => void;
  disabled?: boolean;
}

const variantStyles = {
  default: {
    background: 'bg-white/10 dark:bg-white/5',
    border: 'border-white/20 dark:border-white/10',
    blur: 'backdrop-blur-md',
    shadow: 'shadow-lg',
  },
  elevated: {
    background: 'bg-white/20 dark:bg-white/10',
    border: 'border-white/30 dark:border-white/20',
    blur: 'backdrop-blur-lg',
    shadow: 'shadow-xl',
  },
  interactive: {
    background: 'bg-white/15 dark:bg-white/8',
    border: 'border-white/25 dark:border-white/15',
    blur: 'backdrop-blur-md',
    shadow: 'shadow-lg hover:shadow-xl',
  },
  glow: {
    background: 'bg-white/10 dark:bg-white/5',
    border: 'border-white/20 dark:border-white/10',
    blur: 'backdrop-blur-lg',
    shadow: 'shadow-2xl',
  },
};

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  className = '',
  variant = 'default',
  gradient,
  glowColor,
  onClick,
  disabled = false,
}) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const variantStyle = variantStyles[variant];
  const isInteractive = onClick || variant === 'interactive';

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current || !isInteractive) return;
    
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setMousePosition({ x, y });
  };

  const cardProps = {
    ref: cardRef,
    className: `
      relative overflow-hidden rounded-2xl border
      ${variantStyle.background}
      ${variantStyle.border}
      ${variantStyle.blur}
      ${variantStyle.shadow}
      ${gradient ? '' : ''}
      ${isInteractive ? 'cursor-pointer' : ''}
      ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
      ${className}
    `,
    onMouseMove: handleMouseMove,
    onMouseEnter: () => setIsHovered(true),
    onMouseLeave: () => setIsHovered(false),
    onClick: disabled ? undefined : onClick,
  };

  const content = (
    <>
      {/* Background Gradient */}
      {gradient && (
        <div 
          className={`absolute inset-0 opacity-30 ${gradient}`}
        />
      )}
      
      {/* Glow Effect for glow variant */}
      {variant === 'glow' && glowColor && (
        <div 
          className="absolute inset-0 rounded-2xl"
          style={{
            background: `radial-gradient(ellipse at center, ${glowColor}20, transparent)`,
            filter: 'blur(20px)',
          }}
        />
      )}
      
      {/* Interactive Spotlight Effect */}
      {isInteractive && isHovered && (
        <motion.div
          className="absolute inset-0 rounded-2xl"
          style={{
            background: `radial-gradient(circle 200px at ${mousePosition.x}px ${mousePosition.y}px, rgba(255,255,255,0.1), transparent)`,
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        />
      )}
      
      {/* Shimmer Effect */}
      {(variant === 'elevated' || variant === 'glow') && (
        <motion.div
          className="absolute inset-0 rounded-2xl"
          style={{
            background: 'linear-gradient(110deg, transparent 40%, rgba(255,255,255,0.1) 50%, transparent 60%)',
            transform: 'translateX(-100%)',
          }}
          animate={{
            transform: isHovered ? 'translateX(100%)' : 'translateX(-100%)',
          }}
          transition={{
            duration: 1.5,
            ease: 'easeInOut',
            repeat: variant === 'glow' ? Infinity : 0,
            repeatDelay: 3,
          }}
        />
      )}
      
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </>
  );

  if (isInteractive) {
    return (
      <motion.div
        {...cardProps}
        whileHover={{ 
          scale: 1.02,
          y: -2,
        }}
        whileTap={{ scale: 0.98 }}
        transition={{
          type: "spring",
          stiffness: 400,
          damping: 17
        }}
      >
        {content}
      </motion.div>
    );
  }

  return (
    <div {...cardProps}>
      {content}
    </div>
  );
};
