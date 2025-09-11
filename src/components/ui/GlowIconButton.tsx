import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';

interface GlowIconButtonProps {
  icon: LucideIcon;
  label?: string;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  disabled?: boolean;
  glowIntensity?: 'low' | 'medium' | 'high';
}

const variantStyles = {
  primary: {
    gradient: 'from-blue-500 via-purple-500 to-cyan-500',
    glow: 'shadow-blue-500/50',
    hoverGlow: 'shadow-blue-500/80',
    spotlight: 'rgba(59, 130, 246, 0.4)',
  },
  secondary: {
    gradient: 'from-slate-400 via-slate-500 to-slate-600',
    glow: 'shadow-slate-500/50',
    hoverGlow: 'shadow-slate-500/80',
    spotlight: 'rgba(100, 116, 139, 0.4)',
  },
  success: {
    gradient: 'from-emerald-400 via-green-500 to-teal-500',
    glow: 'shadow-emerald-500/50',
    hoverGlow: 'shadow-emerald-500/80',
    spotlight: 'rgba(16, 185, 129, 0.4)',
  },
  warning: {
    gradient: 'from-amber-400 via-orange-500 to-red-500',
    glow: 'shadow-amber-500/50',
    hoverGlow: 'shadow-amber-500/80',
    spotlight: 'rgba(245, 158, 11, 0.4)',
  },
  danger: {
    gradient: 'from-red-400 via-pink-500 to-rose-500',
    glow: 'shadow-red-500/50',
    hoverGlow: 'shadow-red-500/80',
    spotlight: 'rgba(239, 68, 68, 0.4)',
  },
};

const sizeStyles = {
  sm: { size: 8, icon: 16, padding: 'p-2' },
  md: { size: 12, icon: 20, padding: 'p-3' },
  lg: { size: 16, icon: 24, padding: 'p-4' },
};

export const GlowIconButton: React.FC<GlowIconButtonProps> = ({
  icon: Icon,
  label,
  onClick,
  variant = 'primary',
  size = 'md',
  className = '',
  disabled = false,
  glowIntensity = 'medium',
}) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const variantStyle = variantStyles[variant];
  const sizeStyle = sizeStyles[size];

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!buttonRef.current) return;
    
    const rect = buttonRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setMousePosition({ x, y });
  };

  const glowScale = {
    low: 'shadow-lg',
    medium: 'shadow-xl',
    high: 'shadow-2xl',
  }[glowIntensity];

  return (
    <motion.button
      ref={buttonRef}
      onClick={onClick}
      disabled={disabled}
      className={`
        relative overflow-hidden rounded-2xl
        ${sizeStyle.padding}
        bg-gradient-to-r ${variantStyle.gradient}
        ${glowScale} ${isHovered ? variantStyle.hoverGlow : variantStyle.glow}
        border border-white/20
        backdrop-blur-md
        transition-all duration-300
        disabled:opacity-50 disabled:cursor-not-allowed
        group
        ${className}
      `}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ 
        scale: 1.05,
        rotate: [0, -1, 1, 0],
      }}
      whileTap={{ scale: 0.95 }}
      animate={{
        boxShadow: isHovered 
          ? `0 0 ${sizeStyle.size * 3}px ${variantStyle.spotlight}`
          : `0 0 ${sizeStyle.size}px ${variantStyle.spotlight}`,
      }}
      transition={{
        type: "spring",
        stiffness: 400,
        damping: 17
      }}
    >
      {/* Animated Border Glow */}
      <div 
        className="absolute inset-0 rounded-2xl opacity-75"
        style={{
          background: `conic-gradient(from 0deg, transparent, ${variantStyle.spotlight}, transparent)`,
          animation: 'spin 3s linear infinite',
        }}
      />
      
      {/* Inner Content Background */}
      <div className="absolute inset-[1px] rounded-2xl bg-gradient-to-br from-white/20 to-white/5 dark:from-black/20 dark:to-black/5" />
      
      {/* Mouse Spotlight Effect */}
      {isHovered && (
        <motion.div
          className="absolute inset-0 rounded-2xl"
          style={{
            background: `radial-gradient(circle 100px at ${mousePosition.x}px ${mousePosition.y}px, ${variantStyle.spotlight}, transparent)`,
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.3 }}
          exit={{ opacity: 0 }}
        />
      )}
      
      {/* Icon Content */}
      <div className="relative z-10 flex items-center justify-center">
        <Icon 
          size={sizeStyle.icon} 
          className="text-white drop-shadow-lg group-hover:scale-110 transition-transform duration-200" 
        />
      </div>
      
      {/* Tooltip */}
      {label && (
        <motion.div
          className="absolute -top-12 left-1/2 transform -translate-x-1/2 px-3 py-1 bg-black/80 text-white text-sm rounded-lg opacity-0 pointer-events-none whitespace-nowrap backdrop-blur-md"
          animate={{ 
            opacity: isHovered ? 1 : 0,
            y: isHovered ? 0 : 4
          }}
          transition={{ duration: 0.2 }}
        >
          {label}
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-black/80" />
        </motion.div>
      )}
      
      {/* Ripple Effect */}
      <motion.div
        className="absolute inset-0 rounded-2xl"
        initial={{ scale: 0, opacity: 0.5 }}
        animate={{ scale: isHovered ? 1.2 : 0, opacity: 0 }}
        transition={{ duration: 0.6 }}
        style={{
          background: `radial-gradient(circle, ${variantStyle.spotlight}, transparent)`,
        }}
      />
    </motion.button>
  );
};

// Add the spinning animation to the CSS
const style = document.createElement('style');
style.textContent = `
  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
`;
document.head.appendChild(style);
