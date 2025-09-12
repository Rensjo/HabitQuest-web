import React from 'react';
import { motion } from 'framer-motion';
import { featureIcons } from '../../utils/icons';
import { useSoundEffectsOnly } from '../../hooks/useSoundEffects';
import type { Frequency } from '../../types';

interface DailyStatsOverviewProps {
  habitStats: {
    completedToday: number;
    totalToday: number;
    completionRate: number;
    averageStreak: number;
  };
  activeFreq: Frequency;
}

export const DailyStatsOverview: React.FC<DailyStatsOverviewProps> = ({
  habitStats,
  activeFreq
}) => {

  return (
    <motion.div 
      className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-5"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, staggerChildren: 0.1 }}
      whileHover={{ scale: 1.005 }}
    >
      <motion.div 
        className="
          bg-neutral-100/80 dark:bg-neutral-900/80
          backdrop-blur-sm
          border border-emerald-400/60 dark:border-emerald-400/40
          rounded-2xl p-6 text-center
          shadow-xl shadow-emerald-500/20 dark:shadow-emerald-500/10
          relative overflow-hidden
          cursor-pointer group
        "
        initial={{ opacity: 0, y: 20, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.4, type: "spring", stiffness: 400, damping: 17 }}
        whileHover={{ 
          scale: 1.05, 
          y: -2,
          boxShadow: "0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)",
          transition: { duration: 0.2, ease: "easeOut" }
        }}
        whileTap={{ scale: 0.95, y: 0 }}
      >
        {/* Neutral Background with Glow */}
        <div className="absolute inset-0 bg-gradient-to-br from-neutral-100/20 to-neutral-200/20 dark:from-neutral-700/20 dark:to-neutral-800/20 rounded-2xl group-hover:shadow-emerald-500/20 group-hover:shadow-lg transition-all duration-300"></div>
        
        {/* Icon Container */}
        <div className="relative z-10 mb-4">
          <motion.div 
            className="inline-flex p-3 rounded-xl bg-neutral-100/40 dark:bg-neutral-700/40 border border-emerald-400/60 dark:border-emerald-400/50 shadow-lg shadow-emerald-500/30 dark:shadow-emerald-500/20"
            whileHover={{ rotate: [0, -10, 10, 0], scale: 1.1, transition: { duration: 0.3 } }}
          >
            <featureIcons.checkCircle className="w-6 h-6 text-emerald-500 dark:text-emerald-400 drop-shadow-lg" />
          </motion.div>
        </div>
        
        {/* Value */}
        <div className="relative z-10 text-3xl font-bold text-neutral-800 dark:text-neutral-200 mb-2">
          {habitStats.completedToday}
        </div>
        
        {/* Label */}
        <div className="relative z-10 text-sm font-medium text-neutral-700 dark:text-neutral-400">Completed Today</div>
      </motion.div>

      <motion.div 
        className="
          bg-neutral-100/80 dark:bg-neutral-900/80
          backdrop-blur-sm
          border border-blue-400/60 dark:border-blue-400/40
          rounded-2xl p-6 text-center
          shadow-xl shadow-blue-500/20 dark:shadow-blue-500/10
          relative overflow-hidden
          cursor-pointer group
        "
        initial={{ opacity: 0, y: 20, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.4, type: "spring", stiffness: 400, damping: 17 }}
        whileHover={{ 
          scale: 1.05, 
          y: -2,
          boxShadow: "0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)",
          transition: { duration: 0.2, ease: "easeOut" }
        }}
        whileTap={{ scale: 0.95, y: 0 }}
      >
        {/* Neutral Background with Glow */}
        <div className="absolute inset-0 bg-gradient-to-br from-neutral-100/20 to-neutral-200/20 dark:from-neutral-700/20 dark:to-neutral-800/20 rounded-2xl group-hover:shadow-blue-500/20 group-hover:shadow-lg transition-all duration-300"></div>
        
        {/* Icon Container */}
        <div className="relative z-10 mb-4">
          <motion.div 
            className="inline-flex p-3 rounded-xl bg-neutral-100/40 dark:bg-neutral-700/40 border border-blue-400/60 dark:border-blue-400/50 shadow-lg shadow-blue-500/30 dark:shadow-blue-500/20"
            whileHover={{ rotate: [0, -10, 10, 0], scale: 1.1, transition: { duration: 0.3 } }}
          >
            <featureIcons.calendar className="w-6 h-6 text-blue-500 dark:text-blue-400 drop-shadow-lg" />
          </motion.div>
        </div>
        
        {/* Value */}
        <div className="relative z-10 text-3xl font-bold text-neutral-800 dark:text-neutral-200 mb-2">
          {habitStats.totalToday}
        </div>
        
        {/* Label */}
        <div className="relative z-10 text-sm font-medium text-neutral-700 dark:text-neutral-400">
          Total {activeFreq.charAt(0).toUpperCase() + activeFreq.slice(1)}
        </div>
      </motion.div>

      <motion.div 
        className={`bg-neutral-100/80 dark:bg-neutral-900/80 backdrop-blur-sm rounded-2xl p-6 text-center relative overflow-hidden cursor-pointer group ${
          habitStats.completionRate >= 70 
            ? "border border-emerald-400/60 dark:border-emerald-400/40 shadow-xl shadow-emerald-500/20 dark:shadow-emerald-500/10"
            : habitStats.completionRate >= 40
            ? "border border-amber-400/60 dark:border-amber-400/40 shadow-xl shadow-amber-500/20 dark:shadow-amber-500/10"
            : "border border-red-400/60 dark:border-red-400/40 shadow-xl shadow-red-500/20 dark:shadow-red-500/10"
        }`}
        initial={{ opacity: 0, y: 20, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.4, type: "spring", stiffness: 400, damping: 17 }}
        whileHover={{ 
          scale: 1.05, 
          y: -2,
          boxShadow: "0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)",
          transition: { duration: 0.2, ease: "easeOut" }
        }}
        whileTap={{ scale: 0.95, y: 0 }}
      >
        {/* Neutral Background with Glow */}
        <div className="absolute inset-0 bg-gradient-to-br from-neutral-100/20 to-neutral-200/20 dark:from-neutral-700/20 dark:to-neutral-800/20 rounded-2xl group-hover:shadow-lg transition-all duration-300"></div>
        
        {/* Icon Container */}
        <div className="relative z-10 mb-4">
          <div className={`inline-flex p-3 rounded-xl bg-neutral-100/40 dark:bg-neutral-700/40 border shadow-lg ${
            habitStats.completionRate >= 70 
              ? "border-emerald-400/60 dark:border-emerald-400/50 shadow-emerald-500/30 dark:shadow-emerald-500/20"
              : habitStats.completionRate >= 40
              ? "border-amber-400/60 dark:border-amber-400/50 shadow-amber-500/30 dark:shadow-amber-500/20"
              : "border-red-400/60 dark:border-red-400/50 shadow-red-500/30 dark:shadow-red-500/20"
          }`}>
            <featureIcons.trending className={`w-6 h-6 drop-shadow-lg ${
              habitStats.completionRate >= 70 ? "text-emerald-500 dark:text-emerald-400"
              : habitStats.completionRate >= 40 ? "text-amber-500 dark:text-amber-400"
              : "text-red-500 dark:text-red-400"
            }`} />
          </div>
        </div>
        
        {/* Value */}
        <div className="relative z-10 text-3xl font-bold text-neutral-800 dark:text-neutral-200 mb-2">
          {habitStats.completionRate}%
        </div>
        
        {/* Label */}
        <div className="relative z-10 text-sm font-medium text-neutral-700 dark:text-neutral-400">Completion Rate</div>
      </motion.div>

      <motion.div 
        className="
          bg-neutral-100/80 dark:bg-neutral-900/80
          backdrop-blur-sm
          border border-orange-400/60 dark:border-orange-400/40
          rounded-2xl p-6 text-center
          shadow-xl shadow-orange-500/20 dark:shadow-orange-500/10
          relative overflow-hidden
          cursor-pointer group
        "
        initial={{ opacity: 0, y: 20, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.4, type: "spring", stiffness: 400, damping: 17 }}
        whileHover={{ 
          scale: 1.05, 
          y: -2,
          boxShadow: "0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)",
          transition: { duration: 0.2, ease: "easeOut" }
        }}
        whileTap={{ scale: 0.95, y: 0 }}
      >
        {/* Neutral Background with Glow */}
        <div className="absolute inset-0 bg-gradient-to-br from-neutral-100/20 to-neutral-200/20 dark:from-neutral-700/20 dark:to-neutral-800/20 rounded-2xl group-hover:shadow-orange-500/20 group-hover:shadow-lg transition-all duration-300"></div>
        
        {/* Icon Container */}
        <div className="relative z-10 mb-4">
          <motion.div 
            className="inline-flex p-3 rounded-xl bg-neutral-100/40 dark:bg-neutral-700/40 border border-orange-400/60 dark:border-orange-400/50 shadow-lg shadow-orange-500/30 dark:shadow-orange-500/20"
            whileHover={{ rotate: [0, -10, 10, 0], scale: 1.1, transition: { duration: 0.3 } }}
          >
            <featureIcons.flame className="w-6 h-6 text-orange-500 dark:text-orange-400 drop-shadow-lg" />
          </motion.div>
        </div>
        
        {/* Value */}
        <div className="relative z-10 text-3xl font-bold text-neutral-800 dark:text-neutral-200 mb-2">
          {habitStats.averageStreak}
        </div>
        
        {/* Label */}
        <div className="relative z-10 text-sm font-medium text-neutral-700 dark:text-neutral-400">Average Streak</div>
      </motion.div>
    </motion.div>
  );
};
