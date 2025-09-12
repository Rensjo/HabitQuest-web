import React from 'react';
import { motion } from 'framer-motion';
import { featureIcons } from '../../utils/icons';
import { useSoundEffectsOnly } from '../../hooks/useSoundEffects';
import { getCategoryColorTheme } from '../../utils/categoryColors';
interface GoalTrackerProps {
  categories: string[];
  categoryXP: Record<string, number>;
  goals: Record<string, { monthlyTargetXP: number }>;
  selectedDate: Date;
  onAddCategory: () => void;
  onSetGoals: (goals: Record<string, { monthlyTargetXP: number }>) => void;
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

      {/* Responsive grid layout for categories */}
      <div className="w-full">
        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 md:gap-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, staggerChildren: 0.1 }}
        >
          {categories.map((c, index) => {
            const earned = categoryXP[c] || 0;
            const target = goals[c]?.monthlyTargetXP || 200;
            const pct = Math.min(100, Math.round((earned / Math.max(1, target)) * 100));
            const colorTheme = getCategoryColorTheme(c);
            
            return (
              <motion.div 
                key={c}
                layout 
                className={`
                  w-full border ${colorTheme.border} 
                  bg-neutral-100/80 dark:bg-neutral-900/80 
                  backdrop-blur-sm rounded-2xl p-4 
                  shadow-xl ${colorTheme.shadow}
                  relative overflow-hidden cursor-pointer group
                `}
                initial={{ opacity: 0, y: 20, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.4 + index * 0.1 }}
                whileHover={{ 
                  scale: 1.02, 
                  y: -2,
                  boxShadow: `0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)`,
                  transition: { duration: 0.2, ease: "easeOut" }
                }}
                onMouseEnter={() => playHover()}
                whileTap={{ scale: 0.98 }}
              >
                {/* Neutral Background with Glow */}
                <div className="absolute inset-0 bg-gradient-to-br from-neutral-100/20 to-neutral-200/20 dark:from-neutral-700/20 dark:to-neutral-800/20 rounded-2xl group-hover:shadow-lg transition-all duration-300"></div>
                
                {/* Category Header */}
                <div className="relative z-10 flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className={`p-2 rounded-xl bg-neutral-100/40 dark:bg-neutral-700/40 border ${colorTheme.border.replace('/60', '/60').replace('/40', '/50')} shadow-lg ${colorTheme.shadow.replace('/20', '/30').replace('/10', '/20')}`}>
                      <featureIcons.target className={`w-4 h-4 ${colorTheme.icon} drop-shadow-lg`} />
                    </div>
                    <div className="font-semibold text-sm sm:text-base text-neutral-900 dark:text-neutral-100 truncate">{c}</div>
                  </div>
                  <div className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-300 font-medium">{pct}%</div>
                </div>
                
                {/* XP Progress */}
                <div className="relative z-10 mb-3">
                  <div className="flex justify-between items-center text-xs text-neutral-600 dark:text-neutral-400 mb-2">
                    <span className="font-medium">{earned} XP</span>
                    <span className="text-neutral-500 dark:text-neutral-500">/{target} XP</span>
                  </div>
                  <div className="h-2.5 rounded-full bg-neutral-300 dark:bg-neutral-800 overflow-hidden">
                    <motion.div 
                      layout 
                      className={`h-full bg-gradient-to-r ${colorTheme.primary} shadow-lg`}
                      animate={{ width: `${pct}%` }} 
                      transition={{ duration: 1, ease: "easeOut" }}
                    />
                  </div>
                </div>
                
                {/* Target Input */}
                <div className="relative z-10 mb-3">
                  <div className="flex items-center gap-2">
                    <label className="text-xs text-neutral-600 dark:text-neutral-400">Target:</label>
                    <input
                      type="number"
                      className={`w-20 sm:w-24 rounded-md border ${colorTheme.border.replace('/60', '/40').replace('/40', '/30')} bg-neutral-100/60 dark:bg-neutral-800/60 px-2 py-1 text-xs text-neutral-900 dark:text-neutral-100 focus:ring-2 focus:ring-opacity-50 focus:outline-none`}
                      style={{ 
                        '--tw-ring-color': colorTheme.primary.includes('blue') ? '#3b82f6' : 
                                          colorTheme.primary.includes('purple') ? '#8b5cf6' :
                                          colorTheme.primary.includes('emerald') ? '#10b981' :
                                          colorTheme.primary.includes('amber') ? '#f59e0b' :
                                          colorTheme.primary.includes('rose') ? '#f43f5e' :
                                          colorTheme.primary.includes('cyan') ? '#06b6d4' : '#6b7280'
                      } as React.CSSProperties}
                      value={goals[c]?.monthlyTargetXP}
                      onChange={(e) =>
                        onSetGoals({ ...goals, [c]: { monthlyTargetXP: Number(e.target.value || 0) } })
                      }
                    />
                    <span className="text-xs text-neutral-600 dark:text-neutral-400">XP</span>
                  </div>
                </div>
                
                {/* Progress Indicator */}
                <div className="relative z-10 flex items-center justify-between">
                  <div className="text-xs text-neutral-500 dark:text-neutral-400">
                    {pct >= 100 ? '🎉 Complete!' : pct >= 75 ? '🔥 Almost there!' : pct >= 50 ? '💪 Halfway!' : '🚀 Keep going!'}
                  </div>
                  <div className={`w-2 h-2 rounded-full ${pct >= 100 ? 'bg-emerald-500' : pct >= 75 ? 'bg-amber-500' : pct >= 50 ? 'bg-blue-500' : 'bg-neutral-400'} shadow-sm`}></div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </motion.div>
  );
};
