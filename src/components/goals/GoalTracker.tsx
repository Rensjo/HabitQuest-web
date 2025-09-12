import React from 'react';
import { motion } from 'framer-motion';
import { featureIcons } from '../../utils/icons';
import { useSoundEffectsOnly } from '../../hooks/useSoundEffects';
import type { Goal } from '../../types';

interface GoalTrackerProps {
  categories: string[];
  categoryXP: Record<string, number>;
  goals: Record<string, Goal>;
  selectedDate: Date;
  onAddCategory: () => void;
  onSetGoals: (goals: Record<string, Goal>) => void;
}

export const GoalTracker: React.FC<GoalTrackerProps> = ({
  categories,
  categoryXP,
  goals,
  selectedDate,
  onAddCategory,
  onSetGoals
}) => {
  const { playButtonClick, playHover } = useSoundEffectsOnly();

  return (
    <motion.div 
      className="mt-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div 
        className="mb-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-xl bg-gradient-to-br from-emerald-500/20 to-green-500/20 border border-emerald-400/30 dark:border-emerald-400/20">
                <featureIcons.target className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              </div>
              <h2 className="text-xl font-bold text-neutral-900 dark:text-neutral-100">
                Goal Tracker by Category
              </h2>
            </div>
            <p className="text-neutral-600 dark:text-neutral-400 text-sm mt-1">
              Track your XP progress across different life areas for {selectedDate.toLocaleString(undefined, { month: "long" })} - Two Column Layout
            </p>
          </div>
          <motion.button
            onClick={() => {
              onAddCategory();
              playButtonClick();
            }}
            className="
              relative overflow-hidden rounded-3xl px-5 py-2.5
              bg-gradient-to-r from-emerald-500 to-cyan-600
              backdrop-blur-md
              border border-emerald-300/30 dark:border-0 
              text-white font-semibold text-sm
              shadow-xl shadow-emerald-500/30 dark:shadow-emerald-500/25
              transition-all duration-100
            "
            whileHover={{ 
              scale: 1.05, 
              y: -2,
              boxShadow: "0 20px 25px -5px rgba(16, 185, 129, 0.4), 0 10px 10px -5px rgba(16, 185, 129, 0.2)",
              transition: { duration: 0.1, ease: "easeOut" }
            }}
            onMouseEnter={() => playHover()}
            whileTap={{ scale: 0.95, y: 0 }}
          >
            {/* Gradient Background Overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 via-cyan-500 to-teal-600 opacity-95"></div>
            
            {/* Floating Gradient Orb */}
            <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-br from-cyan-400/40 to-emerald-400/40 dark:from-cyan-400/30 dark:to-emerald-400/30 rounded-full blur-lg"></div>
            
            {/* Content */}
            <div className="relative z-10 flex items-center gap-2">
              <featureIcons.target className="w-4 h-4 drop-shadow-sm" />
              Add Category
            </div>
          </motion.button>
        </div>
      </motion.div>

      {/* Two column layout for categories */}
      <div className="max-w-none w-full">
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, staggerChildren: 0.1 }}
        >
          {categories.map((c, index) => {
            const earned = categoryXP[c] || 0;
            const target = goals[c]?.monthlyTargetXP || 200;
            const pct = Math.min(100, Math.round((earned / Math.max(1, target)) * 100));
            return (
              <div key={c}>
                <motion.div 
                  layout 
                  className="w-full max-w-full border border-neutral-300/50 dark:border-neutral-700/50 bg-neutral-100/60 dark:bg-neutral-900/60 backdrop-blur-sm rounded-2xl p-4 block"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 + index * 0.1 }}
                  whileHover={{ scale: 1.02, y: -2 }}
                  onMouseEnter={() => playHover()}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="font-semibold text-lg text-neutral-900 dark:text-neutral-100">{c}</div>
                    <div className="text-sm text-neutral-600 dark:text-neutral-300">{earned}/{target} XP ({pct}%)</div>
                  </div>
                  <div className="mt-2 h-3 rounded-full bg-neutral-300 dark:bg-neutral-800 overflow-hidden">
                    <motion.div 
                      layout 
                      className="h-full bg-gradient-to-r from-cyan-400 to-blue-500" 
                      animate={{ width: `${pct}%` }} 
                      transition={{ duration: 1, ease: "easeOut" }}
                    />
                  </div>
                  <div className="mt-3 flex items-center gap-2">
                    <label className="text-xs text-neutral-600 dark:text-neutral-400">Monthly target:</label>
                    <input
                      type="number"
                      className="w-28 rounded-md border border-neutral-300 dark:border-neutral-700 bg-neutral-200 dark:bg-neutral-800 px-2 py-1 text-sm text-neutral-900 dark:text-neutral-100"
                      value={goals[c]?.monthlyTargetXP}
                      onChange={(e) =>
                        onSetGoals({ ...goals, [c]: { monthlyTargetXP: Number(e.target.value || 0) } })
                      }
                    />
                    <span className="text-xs text-neutral-600 dark:text-neutral-400">XP</span>
                  </div>
                </motion.div>
              </div>
            );
          })}
        </motion.div>
      </div>
    </motion.div>
  );
};
