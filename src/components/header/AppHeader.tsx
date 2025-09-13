import React from 'react';
import { motion } from 'framer-motion';
import { featureIcons } from '../../utils/icons';
import { GamificationStatus } from '../gamification';
import { ThemeToggle } from '../ui';
import { useSoundEffectsOnly } from '../../hooks/useSoundEffects';

interface AppHeaderProps {
  // Stats data
  totalXP: number;
  level: number;
  habitStats: {
    completedToday: number;
    totalToday: number;
    completionRate: number;
    averageStreak: number;
  };
  overallStreak: number;
  points: number;
  
  // UI state
  activeSettings: boolean;
  activeAnalytics: boolean;
  
  // Event handlers
  onSettingsToggle: () => void;
  onAnalyticsToggle: () => void;
  onRewardShopClick: () => void;
}

export const AppHeader: React.FC<AppHeaderProps> = ({
  totalXP,
  level,
  habitStats,
  overallStreak,
  points,
  activeSettings,
  activeAnalytics,
  onSettingsToggle,
  onAnalyticsToggle,
  onRewardShopClick
}) => {
  const { playButtonClick, playHover } = useSoundEffectsOnly();

  return (
    <motion.div 
      className="mb-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, staggerChildren: 0.1 }}
    >
      <div className="grid grid-cols-1 lg:grid-cols-10 gap-6">
        {/* Left Column - 70% on Large Screens, Full Width on Mobile - Title Section */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="lg:col-span-7"
        >
          {/* Title with Icon */}
          <div className="flex items-center gap-3 mb-6">
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              whileHover={{ rotate: 15, scale: 1.1 }}
            >
              <featureIcons.compass 
                size={48} 
                className="text-amber-500 dark:text-purple-400 drop-shadow-lg" 
              />
            </motion.div>
            <motion.h1 
              className="text-3xl md:text-7xl font-extrabold tracking-tight bg-gradient-to-r from-amber-500 via-orange-500 to-yellow-500 dark:from-purple-500 dark:via-violet-500 dark:to-indigo-500 bg-clip-text text-transparent drop-shadow-lg"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              HabitQuest
            </motion.h1>
          </div>

              <motion.p
                className="text-xs text-neutral-700 dark:text-neutral-500 uppercase tracking-wide font-medium mb-16"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                ____________Your Daily Habit-Tracking Tool For Consistency and Progress_______________________________________________________
              </motion.p>

              {/* Stats Grid - Below Title - All 4 in One Row */}
              <motion.div 
                className="grid grid-cols-2 md:grid-cols-4 gap-5 mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, staggerChildren: 0.1 }}
                whileHover={{ scale: 1.005 }}
              >
                <motion.div
                  initial={{ opacity: 0, y: 20, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.5, type: "spring", stiffness: 400, damping: 17 }}
                  whileHover={{ 
                    scale: 1.05, 
                    y: -2,
                    boxShadow: "0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)",
                    transition: { duration: 0.1, ease: "easeOut" }
                  }}
                  onMouseEnter={() => playHover()}
                  whileTap={{ scale: 0.95, y: 0 }}
                  className="
                    bg-neutral-100/80 dark:bg-neutral-900/80
                    backdrop-blur-sm
                    border border-cyan-400/60 dark:border-cyan-400/40
                    rounded-2xl p-5 text-center
                    shadow-xl shadow-cyan-500/20 dark:shadow-cyan-500/10
                    relative overflow-hidden
                    cursor-pointer group
                  "
                >
                  {/* Neutral Background with Glow */}
                  <div className="absolute inset-0 bg-gradient-to-br from-neutral-100/20 to-neutral-200/20 dark:from-neutral-700/20 dark:to-neutral-800/20 rounded-2xl group-hover:shadow-cyan-500/20 group-hover:shadow-lg transition-all duration-300"></div>
                  
                  {/* Icon Container */}
                  <div className="relative z-10 mb-3">
                    <motion.div 
                      className="inline-flex p-2 rounded-xl bg-neutral-100/40 dark:bg-neutral-700/40 border border-cyan-400/60 dark:border-cyan-400/50 shadow-lg shadow-cyan-500/30 dark:shadow-cyan-500/20"
                      whileHover={{ rotate: [0, -10, 10, 0], transition: { duration: 0.3 } }}
                    >
                      <featureIcons.calendar className="w-5 h-5 text-cyan-500 dark:text-cyan-400 drop-shadow-lg" />
                    </motion.div>
                  </div>
                  
                  {/* Value */}
                  <div className="relative z-10 text-xl font-bold text-neutral-800 dark:text-neutral-200 mb-1">
                    {`${habitStats.completedToday}/${habitStats.totalToday}`}
                  </div>
                  
                  {/* Label */}
                  <div className="relative z-10 text-xs font-medium text-neutral-700 dark:text-neutral-400">Selected Day</div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.5, type: "spring", stiffness: 400, damping: 17 }}
                  whileHover={{ 
                    scale: 1.05, 
                    y: -2,
                    boxShadow: "0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)",
                    transition: { duration: 0.1, ease: "easeOut" }
                  }}
                  onMouseEnter={() => playHover()}
                  whileTap={{ scale: 0.95, y: 0 }}
                  className={`bg-neutral-100/80 dark:bg-neutral-900/80 backdrop-blur-sm rounded-2xl p-5 text-center relative overflow-hidden cursor-pointer group ${
                    habitStats.completionRate >= 70 
                      ? "border border-emerald-400/60 dark:border-emerald-400/40 shadow-xl shadow-emerald-500/20 dark:shadow-emerald-500/10"
                      : habitStats.completionRate >= 40
                      ? "border border-amber-400/60 dark:border-amber-400/40 shadow-xl shadow-amber-500/20 dark:shadow-amber-500/10"
                      : "border border-red-400/60 dark:border-red-400/40 shadow-xl shadow-red-500/20 dark:shadow-red-500/10"
                  }`}
                >
                  {/* Neutral Background with Glow */}
                  <div className="absolute inset-0 bg-gradient-to-br from-neutral-100/20 to-neutral-200/20 dark:from-neutral-700/20 dark:to-neutral-800/20 rounded-2xl group-hover:shadow-lg transition-all duration-300"></div>
                  
                  {/* Icon Container */}
                  <div className="relative z-10 mb-3">
                    <motion.div 
                      className={`inline-flex p-2 rounded-xl bg-neutral-100/40 dark:bg-neutral-700/40 border shadow-lg ${
                        habitStats.completionRate >= 70 
                          ? "border-emerald-400/60 dark:border-emerald-400/50 shadow-emerald-500/30 dark:shadow-emerald-500/20"
                          : habitStats.completionRate >= 40
                          ? "border-amber-400/60 dark:border-amber-400/50 shadow-amber-500/30 dark:shadow-amber-500/20"
                          : "border-red-400/60 dark:border-red-400/50 shadow-red-500/30 dark:shadow-red-500/20"
                      }`}
                      whileHover={{ rotate: [0, -10, 10, 0], transition: { duration: 0.3 } }}
                    >
                      <featureIcons.trending className={`w-5 h-5 drop-shadow-lg ${
                        habitStats.completionRate >= 70 ? "text-emerald-500 dark:text-emerald-400"
                        : habitStats.completionRate >= 40 ? "text-amber-500 dark:text-amber-400"
                        : "text-red-500 dark:text-red-400"
                      }`} />
                    </motion.div>
                  </div>
                  
                  {/* Value */}
                  <div className="relative z-10 text-xl font-bold text-neutral-800 dark:text-neutral-200 mb-1">
                    {habitStats.completionRate}%
                  </div>
                  
                  {/* Label */}
                  <div className="relative z-10 text-xs font-medium text-neutral-700 dark:text-neutral-400">Completion Rate</div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.5, type: "spring", stiffness: 400, damping: 17 }}
                  whileHover={{ 
                    scale: 1.05, 
                    y: -2,
                    boxShadow: "0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)",
                    transition: { duration: 0.1, ease: "easeOut" }
                  }}
                  onMouseEnter={() => playHover()}
                  whileTap={{ scale: 0.95, y: 0 }}
                  className="
                    bg-neutral-100/80 dark:bg-neutral-900/80
                    backdrop-blur-sm
                    border border-purple-400/60 dark:border-purple-400/40
                    rounded-2xl p-5 text-center
                    shadow-xl shadow-purple-500/20 dark:shadow-purple-500/10
                    relative overflow-hidden
                    cursor-pointer group
                  "
                >
                  {/* Neutral Background with Glow */}
                  <div className="absolute inset-0 bg-gradient-to-br from-neutral-100/20 to-neutral-200/20 dark:from-neutral-700/20 dark:to-neutral-800/20 rounded-2xl group-hover:shadow-purple-500/20 group-hover:shadow-lg transition-all duration-300"></div>
                  
                  {/* Icon Container */}
                  <div className="relative z-10 mb-3">
                    <motion.div 
                      className="inline-flex p-2 rounded-xl bg-neutral-100/40 dark:bg-neutral-700/40 border border-purple-400/60 dark:border-purple-400/50 shadow-lg shadow-purple-500/30 dark:shadow-purple-500/20"
                      whileHover={{ rotate: [0, -10, 10, 0], transition: { duration: 0.3 } }}
                    >
                      <featureIcons.star className="w-5 h-5 text-purple-500 dark:text-purple-400 drop-shadow-lg" />
                    </motion.div>
                  </div>
                  
                  {/* Value */}
                  <div className="relative z-10 text-xl font-bold text-neutral-800 dark:text-neutral-200 mb-1">
                    {level}
                  </div>
                  
                  {/* Label */}
                  <div className="relative z-10 text-xs font-medium text-neutral-700 dark:text-neutral-400">Current Level</div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.5, type: "spring", stiffness: 400, damping: 17 }}
                  whileHover={{ 
                    scale: 1.05, 
                    y: -2,
                    boxShadow: "0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)",
                    transition: { duration: 0.1, ease: "easeOut" }
                  }}
                  onMouseEnter={() => playHover()}
                  whileTap={{ scale: 0.95, y: 0 }}
                  className="
                    bg-neutral-100/80 dark:bg-neutral-900/80
                    backdrop-blur-sm
                    border border-emerald-400/60 dark:border-emerald-400/40
                    rounded-2xl p-5 text-center
                    shadow-xl shadow-emerald-500/20 dark:shadow-emerald-500/10
                    relative overflow-hidden
                    cursor-pointer group
                  "
                >
                  {/* Neutral Background with Glow */}
                  <div className="absolute inset-0 bg-gradient-to-br from-neutral-100/20 to-neutral-200/20 dark:from-neutral-700/20 dark:to-neutral-800/20 rounded-2xl group-hover:shadow-emerald-500/20 group-hover:shadow-lg transition-all duration-300"></div>
                  
                  {/* Icon Container */}
                  <div className="relative z-10 mb-3">
                    <motion.div 
                      className="inline-flex p-2 rounded-xl bg-neutral-100/40 dark:bg-neutral-700/40 border border-emerald-400/60 dark:border-emerald-400/50 shadow-lg shadow-emerald-500/30 dark:shadow-emerald-500/20"
                      whileHover={{ rotate: [0, -10, 10, 0], transition: { duration: 0.3 } }}
                    >
                      <featureIcons.zap className="w-5 h-5 text-emerald-500 dark:text-emerald-400 drop-shadow-lg" />
                    </motion.div>
                  </div>
                  
                  {/* Value */}
                  <div className="relative z-10 text-xl font-bold text-neutral-800 dark:text-neutral-200 mb-1">
                    {totalXP.toLocaleString()}
                  </div>
                  
                  {/* Label */}
                  <div className="relative z-10 text-xs font-medium text-neutral-700 dark:text-neutral-400">Total XP</div>
                </motion.div>
              </motion.div>

              {/* Action Buttons */}
          <motion.div
            className="grid grid-cols-[auto_auto_1fr] items-center gap-3 mb-0"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, staggerChildren: 0.1 }}
          >
            {/* Left side spacer */}
            <span className="sr-only">Actions</span>

            <div className="ml-auto flex items-center gap-2">
              {/* Analytics + Settings grouped container */}
              <motion.div
                className="
                  flex items-center gap-1 rounded-2xl p-1.5
                  bg-white/80 dark:bg-neutral-900/70
                  border border-neutral-200/50 dark:border-neutral-700/40
                  backdrop-blur-md
                  shadow-lg shadow-black/5 dark:shadow-black/20
                  relative overflow-hidden
                "
                role="group"
                aria-label="Quick Actions"
                whileHover={{ scale: 1.02 }}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                {/* Gradient Background */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-emerald-500/5 dark:from-blue-500/8 dark:via-purple-500/8 dark:to-emerald-500/8 rounded-2xl"></div>
                
                {/* Floating Gradient Orbs */}
                <div className="absolute -top-1 -left-1 w-4 h-4 bg-gradient-to-br from-blue-400/20 to-cyan-400/20 rounded-full blur-sm"></div>
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-gradient-to-br from-emerald-400/20 to-green-400/20 rounded-full blur-sm"></div>
                
                {/* Settings Button */}
                <motion.button
                  type="button"
                  onClick={() => {
                    onSettingsToggle();
                    playButtonClick();
                  }}
                  title="Settings"
                  className={[
                    "relative flex items-center justify-center rounded-xl px-3 py-2.5 transition-all duration-100 overflow-hidden",
                    "focus-visible:outline-none",
                    "focus-visible:ring-2 focus-visible:ring-blue-500/50 dark:focus-visible:ring-blue-400/50",
                    "focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-neutral-900",
                    activeSettings
                      ? "bg-gradient-to-br from-blue-500 via-blue-600 to-cyan-600 text-white shadow-xl shadow-blue-500/40 border border-blue-400/30"
                      : "bg-white/60 dark:bg-neutral-800/60 text-neutral-600 dark:text-neutral-400 hover:bg-white/80 dark:hover:bg-neutral-700/80 opacity-80 hover:opacity-100 border border-neutral-300/40 dark:border-neutral-600/40 hover:border-blue-400/30"
                  ].join(" ")}
                  whileHover={{ 
                    scale: 1.05,
                    y: -2,
                    boxShadow: activeSettings 
                      ? "0 20px 25px -5px rgba(59, 130, 246, 0.4), 0 10px 10px -5px rgba(59, 130, 246, 0.2)"
                      : "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
                    transition: { duration: 0.1, ease: "easeOut" }
                  }}
                  onMouseEnter={() => playHover()}
                  whileTap={{ scale: 0.95, y: 0 }}
                  animate={activeSettings ? { 
                    rotate: [0, -8, 8, 0],
                    transition: { duration: 0.6 }
                  } : {}}
                >
                  {/* Enhanced background effects */}
                  {activeSettings && (
                    <>
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-br from-blue-400/30 via-cyan-400/20 to-blue-500/30 rounded-xl"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3 }}
                      />
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent rounded-xl"
                        initial={{ x: "-100%" }}
                        animate={{ x: "100%" }}
                        transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 2 }}
                      />
                    </>
                  )}
                  
                  {/* Inactive hover effect */}
                  {!activeSettings && (
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-xl opacity-0"
                      whileHover={{ opacity: 1 }}
                      transition={{ duration: 0.2 }}
                    />
                  )}
                  
                  <motion.div
                    animate={activeSettings ? { 
                      rotate: 180,
                      scale: [1, 1.1, 1]
                    } : { rotate: 0, scale: 1 }}
                    transition={{ 
                      duration: 0.4, 
                      type: "spring", 
                      stiffness: 200,
                      scale: { duration: 0.3 }
                    }}
                    className="relative z-10"
                  >
                    <featureIcons.settings className="h-4 w-4" />
                  </motion.div>
                </motion.button>

                {/* Analytics Button */}
                <motion.button
                  type="button"
                  onClick={() => {
                    onAnalyticsToggle();
                    playButtonClick();
                  }}
                  title="Analytics"
                  className={[
                    "relative flex items-center justify-center rounded-xl px-3 py-2.5 transition-all duration-100 overflow-hidden",
                    "focus-visible:outline-none",
                    "focus-visible:ring-2 focus-visible:ring-emerald-500/50 dark:focus-visible:ring-emerald-400/50",
                    "focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-neutral-900",
                    activeAnalytics
                      ? "bg-gradient-to-br from-emerald-500 via-emerald-600 to-green-600 text-white shadow-xl shadow-emerald-500/40 border border-emerald-400/30"
                      : "bg-white/60 dark:bg-neutral-800/60 text-neutral-600 dark:text-neutral-400 hover:bg-white/80 dark:hover:bg-neutral-700/80 opacity-80 hover:opacity-100 border border-neutral-300/40 dark:border-neutral-600/40 hover:border-emerald-400/30"
                  ].join(" ")}
                  whileHover={{ 
                    scale: 1.05,
                    y: -2,
                    boxShadow: activeAnalytics 
                      ? "0 20px 25px -5px rgba(16, 185, 129, 0.4), 0 10px 10px -5px rgba(16, 185, 129, 0.2)"
                      : "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
                    transition: { duration: 0.1, ease: "easeOut" }
                  }}
                  onMouseEnter={() => playHover()}
                  whileTap={{ scale: 0.95, y: 0 }}
                  animate={activeAnalytics ? { 
                    rotate: [0, -8, 8, 0],
                    transition: { duration: 0.6 }
                  } : {}}
                >
                  {/* Enhanced background effects */}
                  {activeAnalytics && (
                    <>
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-br from-emerald-400/30 via-green-400/20 to-emerald-500/30 rounded-xl"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3 }}
                      />
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent rounded-xl"
                        initial={{ x: "-100%" }}
                        animate={{ x: "100%" }}
                        transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 2.5 }}
                      />
                    </>
                  )}
                  
                  {/* Inactive hover effect */}
                  {!activeAnalytics && (
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-green-500/10 rounded-xl opacity-0"
                      whileHover={{ opacity: 1 }}
                      transition={{ duration: 0.2 }}
                    />
                  )}
                  
                  <motion.div
                    animate={activeAnalytics ? { 
                      y: [0, -3, 0, -3, 0],
                      scale: [1, 1.1, 1],
                      transition: { 
                        y: { duration: 0.8, repeat: Infinity, repeatDelay: 1.5 },
                        scale: { duration: 0.3 }
                      }
                    } : { y: 0, scale: 1 }}
                    className="relative z-10"
                  >
                    <featureIcons.barChart className="h-4 w-4" />
                  </motion.div>
                </motion.button>
              </motion.div>

              {/* Theme toggle stays as is */}
              <motion.div
                whileHover={{ scale: 1.05, y: -2 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <ThemeToggle />
              </motion.div>
            </div>
          </motion.div>
        </motion.div>

        {/* Right Column - 30% on Large Screens, Full Width on Mobile - Gamification Status */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="lg:col-span-3 flex flex-col items-center justify-center"
        >
          {/* Adventurer Status */}
          <div className="mb-16 w-full flex flex-col items-center justify-center">
            <GamificationStatus
              level={level}
              currentXP={totalXP}
              xpToNext={Math.max(0, level * 500 - totalXP)}
              levelProgress={Math.min(100, (totalXP / (level * 500)) * 100)}
              streakDays={overallStreak}
              points={points}
              onRewardShopClick={onRewardShopClick}
            />
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};
