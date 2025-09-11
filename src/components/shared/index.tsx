/**
 * ================================================================================================
 * HABITQUEST SHARED COMPONENTS
 * ================================================================================================
 * 
 * Reusable UI components used throughout the HabitQuest application
 * 
 * @version 4.0.0
 */

import React from "react";
import { motion } from "framer-motion";

// ================================================================================================
// ENHANCED BUTTON COMPONENT
// ================================================================================================

export function EnhancedButton({ 
  children, 
  variant = "primary", 
  size = "md", 
  icon, 
  loading = false,
  className = "",
  ...props 
}: {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "success" | "danger";
  size?: "sm" | "md" | "lg";
  icon?: string;
  loading?: boolean;
  className?: string;
  [key: string]: any;
}) {
  const variants = {
    primary: "bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg shadow-blue-500/25",
    secondary: "bg-slate-800/60 hover:bg-slate-700 text-slate-300 border border-slate-700 hover:border-slate-600",
    success: "bg-gradient-to-r from-emerald-500 to-cyan-600 hover:from-emerald-600 hover:to-cyan-700 text-white shadow-lg shadow-emerald-500/25",
    danger: "bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white shadow-lg shadow-red-500/25",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2.5 text-sm",
    lg: "px-6 py-3 text-base",
  };

  return (
    <motion.button
      className={`
        ${variants[variant]} ${sizes[size]} 
        rounded-xl font-medium transition-all duration-200 
        disabled:opacity-50 disabled:cursor-not-allowed
        flex items-center gap-2 relative overflow-hidden
        ${className}
      `}
      whileHover={{ scale: 1.02, y: -1 }}
      whileTap={{ scale: 0.98 }}
      disabled={loading}
      {...props}
    >
      {loading && (
        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
      )}
      {icon && !loading && <span>{icon}</span>}
      {children}
    </motion.button>
  );
}

// ================================================================================================
// ENHANCED STAT CARD COMPONENT
// ================================================================================================

/**
 * Enhanced StatCard with animations and improved styling
 */
export function StatCard({ 
  label, 
  value, 
  sub, 
  children,
  icon,
  gradient = "from-blue-500/20 to-purple-500/20"
}: { 
  label: string; 
  value: React.ReactNode; 
  sub?: string; 
  children?: React.ReactNode;
  icon?: string;
  gradient?: string;
}) {
  return (
    <motion.div 
      className="relative border border-slate-800/50 bg-slate-900/60 backdrop-blur-sm rounded-2xl p-4 w-full overflow-hidden group cursor-pointer"
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Gradient overlay */}
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
      
      {/* Content */}
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-2">
          <div className="text-xs text-slate-400 uppercase tracking-wider font-medium">{label}</div>
          {icon && (
            <div className="text-lg opacity-70 group-hover:scale-110 transition-transform duration-300">
              {icon}
            </div>
          )}
        </div>
        <div className="text-2xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
          {value}
        </div>
        {sub && <div className="text-xs text-slate-400 mt-1">{sub}</div>}
        {children && <div className="mt-3">{children}</div>}
      </div>
      
      {/* Glow effect */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl" />
    </motion.div>
  );
}
