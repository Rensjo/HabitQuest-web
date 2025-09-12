import React from 'react';
import { motion } from 'framer-motion';
import { FREQUENCIES } from '../../constants';
import { classNames } from '../../utils';
import { frequencyIcons, featureIcons } from '../../utils/icons';
import { useSoundEffectsOnly } from '../../hooks/useSoundEffects';
import type { Frequency } from '../../types';

interface FrequencyTabsProps {
  activeFreq: Frequency;
  onFrequencyChange: (freq: Frequency) => void;
  onAddHabit: () => void;
}

export const FrequencyTabs: React.FC<FrequencyTabsProps> = ({
  activeFreq,
  onFrequencyChange,
  onAddHabit
}) => {
  const { playButtonClick, playHover } = useSoundEffectsOnly();

  return (
    <motion.div 
      className="mt-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="mb-4">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 rounded-xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border border-blue-400/30 dark:border-blue-400/20">
            <featureIcons.clock className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          </div>
          <h2 className="text-xl font-bold text-neutral-900 dark:text-neutral-100">Habit Frequency Management</h2>
        </div>
        <p className="text-neutral-600 dark:text-neutral-400 text-sm">
          Organize your habits by frequency - daily practices, weekly goals, monthly targets, or yearly achievements
        </p>
      </div>
      
      <div className="flex flex-wrap items-center justify-between gap-4">
        {/* Frequency Tabs Container */}
        <motion.div 
          className="flex flex-wrap gap-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, staggerChildren: 0.1 }}
        >
          {FREQUENCIES.map((f) => {
            const frequencyConfig = {
              daily: { 
                icon: frequencyIcons.daily, 
                description: "Everyday habits for consistent growth",
                colors: "from-orange-400 to-red-500",
                hoverColors: "hover:from-orange-300 hover:to-red-400",
                shadowColor: "shadow-orange-500/25"
              },
              weekly: { 
                icon: frequencyIcons.weekly, 
                description: "Weekly routines and objectives",
                colors: "from-blue-400 to-indigo-500",
                hoverColors: "hover:from-blue-300 hover:to-indigo-400", 
                shadowColor: "shadow-blue-500/25"
              },
              monthly: { 
                icon: frequencyIcons.monthly, 
                description: "Monthly goals and milestones",
                colors: "from-purple-400 to-pink-500",
                hoverColors: "hover:from-purple-300 hover:to-pink-400",
                shadowColor: "shadow-purple-500/25"
              },
              yearly: { 
                icon: frequencyIcons.yearly, 
                description: "Annual targets and long-term vision",
                colors: "from-emerald-400 to-cyan-500",
                hoverColors: "hover:from-emerald-300 hover:to-cyan-400",
                shadowColor: "shadow-emerald-500/25"
              }
            };
            
            const config = frequencyConfig[f as keyof typeof frequencyConfig];
            
            return (
              <motion.button
                key={f}
                onClick={() => {
                  onFrequencyChange(f);
                  playButtonClick();
                }}
                className={classNames(
                  "px-6 py-3.5 rounded-3xl border text-sm capitalize font-semibold transition-all duration-100 relative overflow-hidden backdrop-blur-md",
                  activeFreq === f
                    ? `bg-gradient-to-r ${config.colors} text-white border-white/20 shadow-xl ${config.shadowColor} ring-2 ring-white/30`
                    : "bg-white/80 dark:bg-neutral-800/70 border-neutral-200/50 dark:border-neutral-600/50 text-neutral-700 dark:text-neutral-300 hover:bg-white/90 dark:hover:bg-neutral-700/80 hover:border-neutral-300/60 dark:hover:border-neutral-500/60"
                )}
                whileHover={{ 
                  scale: 1.05, 
                  y: -2,
                  boxShadow: activeFreq === f 
                    ? "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
                    : "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
                  transition: { duration: 0.1, ease: "easeOut" }
                }}
                onMouseEnter={() => playHover()}
                whileTap={{ scale: 0.95, y: 0 }}
                initial={{ opacity: 0, y: 20, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ 
                  duration: 0.5, 
                  type: "spring",
                  stiffness: 400,
                  damping: 17 
                }}
                title={config.description}
              >
                <div className="flex items-center gap-2">
                  <config.icon className="w-4 h-4" />
                  <span>{f}</span>
                  {activeFreq === f && (
                    <motion.div
                      className="w-2 h-2 bg-white rounded-full"
                      layoutId="activeFrequencyIndicator"
                      transition={{ type: "spring", stiffness: 400, damping: 17 }}
                    />
                  )}
                </div>
                
                {/* Enhanced sheen effect for active tab */}
                {activeFreq === f && (
                  <motion.div
                    className="pointer-events-none absolute inset-0 rounded-3xl bg-gradient-to-r from-transparent via-white/30 to-transparent"
                    initial={{ x: '-100%' }}
                    animate={{ x: '100%' }}
                    transition={{ 
                      duration: 2, 
                      repeat: Infinity, 
                      ease: 'linear',
                    }}
                  />
                )}
                
                {/* Glow effect for active tab */}
                {activeFreq === f && (
                  <motion.div
                    className="pointer-events-none absolute inset-0 rounded-3xl"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0, 0.5, 0] }}
                    transition={{ 
                      duration: 2, 
                      repeat: Infinity, 
                      ease: 'easeInOut' 
                    }}
                    style={{
                      background: `linear-gradient(45deg, transparent, rgba(255,255,255,0.2), transparent)`,
                      filter: 'blur(1px)'
                    }}
                  />
                )}

                {/* Floating Orbs for Active State */}
                {activeFreq === f && (
                  <>
                    <motion.div
                      className="absolute -top-2 -right-2 w-3 h-3 bg-white/40 rounded-full blur-sm"
                      animate={{ 
                        scale: [1, 1.2, 1], 
                        opacity: [0.4, 0.8, 0.4],
                        x: [0, 2, 0],
                        y: [0, -1, 0]
                      }}
                      transition={{ 
                        duration: 3, 
                        repeat: Infinity, 
                        ease: "easeInOut",
                      }}
                    />
                    <motion.div
                      className="absolute -bottom-1 -left-1 w-2 h-2 bg-white/30 rounded-full blur-sm"
                      animate={{ 
                        scale: [1, 1.3, 1], 
                        opacity: [0.3, 0.6, 0.3],
                        x: [0, -1, 0],
                        y: [0, 1, 0]
                      }}
                      transition={{ 
                        duration: 2.5, 
                        repeat: Infinity, 
                        ease: "easeInOut",
                      }}
                    />
                  </>
                )}

                {/* Hover Gradient Preview for Inactive State */}
                {activeFreq !== f && (
                  <motion.div
                    className="absolute inset-0 rounded-3xl opacity-0"
                    whileHover={{ opacity: 1 }}
                    transition={{ duration: 0.2 }}
                    style={{
                      background: `linear-gradient(135deg, ${config.colors.replace('from-', 'from-').replace(' to-', '/20 to-')}/20, transparent)`
                    }}
                  />
                )}
              </motion.button>
            );
          })}
        </motion.div>
        
        {/* Add Habit Button - Academic Quest Style */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="flex-shrink-0"
        >
          <motion.button
            onClick={() => {
              onAddHabit();
              playButtonClick();
            }}
            className="
              relative overflow-hidden rounded-3xl px-6 py-3
              bg-gradient-to-r from-purple-600 to-violet-600
              backdrop-blur-md
              border border-purple-300/30 dark:border-0 
              text-white font-semibold text-sm
              shadow-xl shadow-purple-500/30 dark:shadow-purple-500/25
              transition-all duration-100
            "
            whileHover={{ 
              scale: 1.05, 
              y: -2,
              boxShadow: "0 20px 25px -5px rgba(147, 51, 234, 0.4), 0 10px 10px -5px rgba(147, 51, 234, 0.2)",
              transition: { duration: 0.1, ease: "easeOut" }
            }}
            onMouseEnter={() => playHover()}
            whileTap={{ scale: 0.95, y: 0 }}
          >
            {/* Gradient Background Overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-violet-600 to-blue-600 opacity-95"></div>
            
            {/* Floating Gradient Orb */}
            <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-br from-pink-400/40 to-purple-400/40 dark:from-pink-400/30 dark:to-purple-400/30 rounded-full blur-lg"></div>
            
            {/* Content */}
            <div className="relative z-10 flex items-center gap-2">
              <featureIcons.sparkles className="w-4 h-4 drop-shadow-sm" />
              Add Habit
            </div>
          </motion.button>
        </motion.div>
      </div>
    </motion.div>
  );
};
