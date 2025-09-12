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
          bg-white/85 dark:bg-neutral-900/75
          backdrop-blur-md
          border border-neutral-200/60 dark:border-neutral-700/40
          rounded-2xl p-6 text-center
          shadow-lg shadow-black/5 dark:shadow-black/20
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
        {/* Emerald Theme Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-green-500/10 dark:from-emerald-500/12 dark:to-green-500/12 rounded-2xl group-hover:from-emerald-500/20 group-hover:to-green-500/20 transition-colors duration-100"></div>
        
        {/* Icon Container */}
        <div className="relative z-10 mb-4">
          <motion.div 
            className="inline-flex p-3 rounded-xl bg-gradient-to-br from-emerald-400/25 to-green-500/25 dark:from-emerald-400/20 dark:to-green-500/20 border border-emerald-200/40 dark:border-transparent"
            whileHover={{ rotate: [0, -10, 10, 0], scale: 1.1, transition: { duration: 0.3 } }}
          >
            <featureIcons.checkCircle className="w-6 h-6 text-emerald-500 dark:text-emerald-400" />
          </motion.div>
        </div>
        
        {/* Value */}
        <div className="relative z-10 text-3xl font-bold bg-gradient-to-r from-emerald-600 to-green-700 dark:from-emerald-500 dark:to-green-600 bg-clip-text text-transparent mb-2">
          {habitStats.completedToday}
        </div>
        
        {/* Label */}
        <div className="relative z-10 text-sm font-medium text-neutral-700 dark:text-neutral-400">Completed Today</div>
      </motion.div>

      <motion.div 
        className="
          bg-white/85 dark:bg-neutral-900/75
          backdrop-blur-md
          border border-neutral-200/60 dark:border-neutral-700/40
          rounded-2xl p-6 text-center
          shadow-lg shadow-black/5 dark:shadow-black/20
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
        {/* Blue Theme Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 dark:from-blue-500/12 dark:to-cyan-500/12 rounded-2xl group-hover:from-blue-500/20 group-hover:to-cyan-500/20 transition-colors duration-100"></div>
        
        {/* Icon Container */}
        <div className="relative z-10 mb-4">
          <motion.div 
            className="inline-flex p-3 rounded-xl bg-gradient-to-br from-blue-400/25 to-cyan-500/25 dark:from-blue-400/20 dark:to-cyan-500/20 border border-blue-200/40 dark:border-transparent"
            whileHover={{ rotate: [0, -10, 10, 0], scale: 1.1, transition: { duration: 0.3 } }}
          >
            <featureIcons.calendar className="w-6 h-6 text-blue-500 dark:text-blue-400" />
          </motion.div>
        </div>
        
        {/* Value */}
        <div className="relative z-10 text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-700 dark:from-blue-500 dark:to-cyan-600 bg-clip-text text-transparent mb-2">
          {habitStats.totalToday}
        </div>
        
        {/* Label */}
        <div className="relative z-10 text-sm font-medium text-neutral-700 dark:text-neutral-400">
          Total {activeFreq.charAt(0).toUpperCase() + activeFreq.slice(1)}
        </div>
      </motion.div>

      <motion.div 
        className="
          bg-white/85 dark:bg-neutral-900/75
          backdrop-blur-md
          border border-neutral-200/60 dark:border-neutral-700/40
          rounded-2xl p-6 text-center
          shadow-lg shadow-black/5 dark:shadow-black/20
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
        {/* Dynamic Theme Background based on completion rate */}
        <div className={`absolute inset-0 rounded-2xl ${
          habitStats.completionRate >= 70 
            ? "bg-gradient-to-br from-emerald-500/10 to-green-500/10 dark:from-emerald-500/12 dark:to-green-500/12"
            : habitStats.completionRate >= 40
            ? "bg-gradient-to-br from-amber-500/10 to-orange-500/10 dark:from-amber-500/12 dark:to-orange-500/12"
            : "bg-gradient-to-br from-red-500/10 to-rose-500/10 dark:from-red-500/12 dark:to-rose-500/12"
        }`}></div>
        
        {/* Icon Container */}
        <div className="relative z-10 mb-4">
          <div className={`inline-flex p-3 rounded-xl border border-opacity-40 dark:border-transparent ${
            habitStats.completionRate >= 70 
              ? "bg-gradient-to-br from-emerald-400/25 to-green-500/25 dark:from-emerald-400/20 dark:to-green-500/20 border-emerald-200"
              : habitStats.completionRate >= 40
              ? "bg-gradient-to-br from-amber-400/25 to-orange-500/25 dark:from-amber-400/20 dark:to-orange-500/20 border-amber-200"
              : "bg-gradient-to-br from-red-400/25 to-rose-500/25 dark:from-red-400/20 dark:to-rose-500/20 border-red-200"
          }`}>
            <featureIcons.trending className={`w-6 h-6 ${
              habitStats.completionRate >= 70 ? "text-emerald-500 dark:text-emerald-400"
              : habitStats.completionRate >= 40 ? "text-amber-500 dark:text-amber-400"
              : "text-red-500 dark:text-red-400"
            }`} />
          </div>
        </div>
        
        {/* Value */}
        <div className={`relative z-10 text-3xl font-bold bg-gradient-to-r bg-clip-text text-transparent mb-2 ${
          habitStats.completionRate >= 70 
            ? "from-emerald-600 to-green-700 dark:from-emerald-500 dark:to-green-600"
            : habitStats.completionRate >= 40
            ? "from-amber-600 to-orange-700 dark:from-amber-500 dark:to-orange-600"
            : "from-red-600 to-rose-700 dark:from-red-500 dark:to-rose-600"
        }`}>
          {habitStats.completionRate}%
        </div>
        
        {/* Label */}
        <div className="relative z-10 text-sm font-medium text-neutral-700 dark:text-neutral-400">Completion Rate</div>
      </motion.div>

      <motion.div 
        className="
          bg-white/85 dark:bg-neutral-900/75
          backdrop-blur-md
          border border-neutral-200/60 dark:border-neutral-700/40
          rounded-2xl p-6 text-center
          shadow-lg shadow-black/5 dark:shadow-black/20
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
        {/* Orange Theme Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-red-500/10 dark:from-orange-500/12 dark:to-red-500/12 rounded-2xl group-hover:from-orange-500/20 group-hover:to-red-500/20 transition-colors duration-100"></div>
        
        {/* Icon Container */}
        <div className="relative z-10 mb-4">
          <motion.div 
            className="inline-flex p-3 rounded-xl bg-gradient-to-br from-orange-400/25 to-red-500/25 dark:from-orange-400/20 dark:to-red-500/20 border border-orange-200/40 dark:border-transparent"
            whileHover={{ rotate: [0, -10, 10, 0], scale: 1.1, transition: { duration: 0.3 } }}
          >
            <featureIcons.flame className="w-6 h-6 text-orange-500 dark:text-orange-400" />
          </motion.div>
        </div>
        
        {/* Value */}
        <div className="relative z-10 text-3xl font-bold bg-gradient-to-r from-orange-600 to-red-700 dark:from-orange-500 dark:to-red-600 bg-clip-text text-transparent mb-2">
          {habitStats.averageStreak}
        </div>
        
        {/* Label */}
        <div className="relative z-10 text-sm font-medium text-neutral-700 dark:text-neutral-400">Average Streak</div>
      </motion.div>
    </motion.div>
  );
};
