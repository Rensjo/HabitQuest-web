import React from 'react';
import { motion } from 'framer-motion';
import { featureIcons } from '../../utils/icons';
import { useSoundEffectsOnly } from '../../hooks/useSoundEffects';
import { generateHabitKey } from '../../utils/keyUtils';
import { habitVisibleOnDate } from '../../utils/habitUtils';
import { categoryIcons } from '../../utils/icons';
import type { Habit, DayInsights } from '../../types';

interface AnalyticsModalProps {
  isOpen: boolean;
  onClose: () => void;
  habits: Habit[];
  categories: string[];
  habitStats: {
    completionRate: number;
  };
  totalXP: number;
  level: number;
  dayInsights: DayInsights;
  selectedDate: Date;
  getPeriodKey: (frequency: string, date: Date) => string;
}

export const AnalyticsModal: React.FC<AnalyticsModalProps> = ({
  isOpen,
  onClose,
  habits,
  categories,
  habitStats,
  totalXP,
  level,
  dayInsights,
  selectedDate,
  getPeriodKey
}) => {
  const { playButtonClick, playHover } = useSoundEffectsOnly();

  if (!isOpen) return null;

  return (
    <>
      <motion.div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={() => {
          onClose();
          playButtonClick();
        }}
      />
      <motion.div
        className="fixed inset-0 flex items-center justify-center p-4 z-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={(e) => {
          if (e.target === e.currentTarget) {
            onClose();
            playButtonClick();
          }
        }}
      >
        <motion.div
          className="
            relative w-full max-w-6xl max-h-[90vh] overflow-hidden
            bg-white/90 dark:bg-neutral-900/90
            backdrop-blur-xl
            rounded-3xl
            shadow-2xl shadow-black/20 dark:shadow-black/40
            border border-white/20 dark:border-neutral-700/30
          "
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ duration: 0.3, type: "spring", stiffness: 300, damping: 30 }}
        >
          {/* Analytics Header Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-green-500/5 to-teal-500/10 dark:from-emerald-500/15 dark:via-green-500/10 dark:to-teal-500/15 rounded-3xl"></div>
          
          {/* Floating Gradient Orbs */}
          <div className="absolute -top-4 -left-4 w-24 h-24 bg-gradient-to-br from-emerald-400/20 to-green-400/20 dark:from-emerald-400/15 dark:to-green-400/15 rounded-full blur-2xl"></div>
          <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-gradient-to-br from-teal-400/15 to-cyan-400/15 dark:from-teal-400/10 dark:to-cyan-400/10 rounded-full blur-3xl"></div>
          <div className="absolute top-1/3 -right-8 w-20 h-20 bg-gradient-to-br from-green-400/10 to-emerald-400/10 dark:from-green-400/5 dark:to-emerald-400/5 rounded-full blur-xl"></div>

          <div className="relative z-10 p-8">
            {/* Analytics Header */}
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <motion.div
                  className="p-3 rounded-2xl bg-gradient-to-br from-emerald-400/20 to-green-500/20 dark:from-emerald-400/15 dark:to-green-500/15 border border-emerald-200/30 dark:border-transparent"
                  whileHover={{ scale: 1.05, rotate: 5 }}
                  transition={{ duration: 0.2 }}
                >
                  <featureIcons.barChart className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                </motion.div>
                <div>
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 dark:from-emerald-400 dark:via-green-400 dark:to-teal-400 bg-clip-text text-transparent">
                    Analytics Dashboard
                  </h2>
                  <p className="text-neutral-600 dark:text-neutral-400 text-sm mt-1">
                    Comprehensive insights into your habit journey and progress patterns
                  </p>
                </div>
              </div>
              
              <motion.button
                onClick={() => {
                  onClose();
                  playButtonClick();
                }}
                className="
                  p-2 rounded-xl
                  bg-white/60 dark:bg-neutral-800/60
                  border border-neutral-300/50 dark:border-neutral-600/50
                  hover:bg-white/80 dark:hover:bg-neutral-700/80
                  hover:border-red-400/40 dark:hover:border-red-500/40
                  text-neutral-700 dark:text-neutral-300
                  transition-all duration-100
                  backdrop-blur-sm
                "
                whileHover={{ scale: 1.05, y: -2 }}
                onMouseEnter={() => playHover()}
                whileTap={{ scale: 0.95, y: 0 }}
              >
                <featureIcons.x className="w-4 h-4" />
              </motion.button>
            </div>

            {/* Analytics Content */}
            <div className="grid gap-6 max-h-[70vh] overflow-y-auto light-scrollbar dark:dark-scrollbar">
              {/* Overview Stats */}
              <motion.div
                className="grid grid-cols-1 md:grid-cols-4 gap-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                {/* Total Habits */}
                <div className="bg-white/60 dark:bg-neutral-800/60 backdrop-blur-sm rounded-2xl p-4 border border-neutral-200/50 dark:border-neutral-700/50">
                  <div className="flex items-center justify-between mb-2">
                    <div className="p-2 rounded-lg bg-blue-500/10 dark:bg-blue-500/20">
                      <featureIcons.target className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">{habits.length}</span>
                  </div>
                  <div className="text-sm font-medium text-neutral-700 dark:text-neutral-300">Total Habits</div>
                </div>

                {/* Completion Rate */}
                <div className="bg-white/60 dark:bg-neutral-800/60 backdrop-blur-sm rounded-2xl p-4 border border-neutral-200/50 dark:border-neutral-700/50">
                  <div className="flex items-center justify-between mb-2">
                    <div className="p-2 rounded-lg bg-emerald-500/10 dark:bg-emerald-500/20">
                      <featureIcons.trending className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <span className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{habitStats.completionRate}%</span>
                  </div>
                  <div className="text-sm font-medium text-neutral-700 dark:text-neutral-300">Completion Rate</div>
                </div>

                {/* Total XP */}
                <div className="bg-white/60 dark:bg-neutral-800/60 backdrop-blur-sm rounded-2xl p-4 border border-neutral-200/50 dark:border-neutral-700/50">
                  <div className="flex items-center justify-between mb-2">
                    <div className="p-2 rounded-lg bg-purple-500/10 dark:bg-purple-500/20">
                      <featureIcons.star className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                    </div>
                    <span className="text-2xl font-bold text-purple-600 dark:text-purple-400">{totalXP}</span>
                  </div>
                  <div className="text-sm font-medium text-neutral-700 dark:text-neutral-300">Total XP</div>
                </div>

                {/* Current Level */}
                <div className="bg-white/60 dark:bg-neutral-800/60 backdrop-blur-sm rounded-2xl p-4 border border-neutral-200/50 dark:border-neutral-700/50">
                  <div className="flex items-center justify-between mb-2">
                    <div className="p-2 rounded-lg bg-amber-500/10 dark:bg-amber-500/20">
                      <featureIcons.trophy className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                    </div>
                    <span className="text-2xl font-bold text-amber-600 dark:text-amber-400">Level {level}</span>
                  </div>
                  <div className="text-sm font-medium text-neutral-700 dark:text-neutral-300">Current Level</div>
                </div>
              </motion.div>

              {/* Category Performance */}
              <motion.div
                className="bg-white/60 dark:bg-neutral-800/60 backdrop-blur-sm rounded-2xl p-6 border border-neutral-200/50 dark:border-neutral-700/50"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
              >
                <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-4 flex items-center gap-2">
                  <featureIcons.pieChart className="w-5 h-5 text-emerald-500 dark:text-emerald-400" />
                  Category Performance
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {categories.map((category, index) => {
                    const categoryHabits = habits.filter(h => h.category === category);
                    const completedHabits = categoryHabits.filter(h => {
                      const key = getPeriodKey(h.frequency, selectedDate);
                      return h.completions[key];
                    });
                    const completionRate = categoryHabits.length > 0 ? Math.round((completedHabits.length / categoryHabits.length) * 100) : 0;
                    const earnedXP = categoryHabits.reduce((sum, h) => {
                      const key = getPeriodKey(h.frequency, selectedDate);
                      return sum + (h.completions[key] ? (h.xpOnComplete || 0) : 0);
                    }, 0);
                    
                    return (
                      <motion.div
                        key={category}
                        className="p-4 rounded-xl bg-gradient-to-br from-neutral-50/50 to-neutral-100/50 dark:from-neutral-800/50 dark:to-neutral-700/50 border border-neutral-200/30 dark:border-neutral-600/30"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: 0.1 + index * 0.1 }}
                        whileHover={{ scale: 1.02, y: -2 }}
                        onMouseEnter={() => playHover()}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            {categoryIcons[category] && (
                              <div className="p-1.5 rounded-lg bg-emerald-500/10 dark:bg-emerald-500/20">
                                {React.createElement(categoryIcons[category], { className: "w-4 h-4 text-emerald-600 dark:text-emerald-400" })}
                              </div>
                            )}
                            <span className="font-medium text-neutral-900 dark:text-neutral-100 text-sm">{category}</span>
                          </div>
                          <span className="text-lg font-bold text-emerald-600 dark:text-emerald-400">{completionRate}%</span>
                        </div>
                        <div className="text-xs text-neutral-600 dark:text-neutral-400 mb-2">
                          {completedHabits.length}/{categoryHabits.length} habits completed
                        </div>
                        <div className="text-xs text-neutral-600 dark:text-neutral-400">
                          {earnedXP} XP earned today
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>

              {/* Habit Streak Analysis */}
              <motion.div
                className="bg-white/60 dark:bg-neutral-800/60 backdrop-blur-sm rounded-2xl p-6 border border-neutral-200/50 dark:border-neutral-700/50"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.2 }}
              >
                <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-4 flex items-center gap-2">
                  <featureIcons.flame className="w-5 h-5 text-orange-500 dark:text-orange-400" />
                  Streak Analysis
                </h3>
                <div className="space-y-3">
                  {habits.map((habit, index) => (
                    <motion.div
                      key={generateHabitKey(habit, index, 'analytics')}
                      className="flex items-center justify-between p-3 rounded-xl bg-gradient-to-r from-neutral-50/50 to-neutral-100/50 dark:from-neutral-800/50 dark:to-neutral-700/50 border border-neutral-200/30 dark:border-neutral-600/30"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: 0.2 + index * 0.05 }}
                      whileHover={{ scale: 1.01, x: 2 }}
                      onMouseEnter={() => playHover()}
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-orange-500/10 dark:bg-orange-500/20">
                          <featureIcons.flame className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                        </div>
                        <div>
                          <div className="font-medium text-neutral-900 dark:text-neutral-100 text-sm">{habit.title}</div>
                          <div className="text-xs text-neutral-600 dark:text-neutral-400">{habit.frequency}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-orange-600 dark:text-orange-400">{habit.streak || 0}</div>
                        <div className="text-xs text-neutral-600 dark:text-neutral-400">day streak</div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Weekly Progress Chart */}
              <motion.div
                className="bg-white/60 dark:bg-neutral-800/60 backdrop-blur-sm rounded-2xl p-6 border border-neutral-200/50 dark:border-neutral-700/50"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.3 }}
              >
                <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-4 flex items-center gap-2">
                  <featureIcons.calendar className="w-5 h-5 text-blue-500 dark:text-blue-400" />
                  Weekly Progress
                </h3>
                <div className="grid grid-cols-7 gap-2">
                  {Array.from({ length: 7 }, (_, i) => {
                    const date = new Date();
                    date.setDate(date.getDate() - (6 - i));
                    const dayHabits = habits.filter(h => habitVisibleOnDate(h, date));
                    const completedHabits = dayHabits.filter(h => {
                      const key = getPeriodKey(h.frequency, date);
                      return h.completions[key];
                    });
                    const dayCompletionRate = dayHabits.length > 0 ? Math.round((completedHabits.length / dayHabits.length) * 100) : 0;
                    
                    return (
                      <motion.div
                        key={i}
                        className="text-center"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: 0.3 + i * 0.05 }}
                      >
                        <div className="text-xs text-neutral-600 dark:text-neutral-400 mb-2">
                          {date.toLocaleDateString('en', { weekday: 'short' })}
                        </div>
                        <div className="w-full h-16 bg-gradient-to-t from-neutral-200/50 to-neutral-100/50 dark:from-neutral-700/50 dark:to-neutral-600/50 rounded-lg flex items-end justify-center p-1">
                          <motion.div
                            className={`w-full rounded ${
                              dayCompletionRate >= 70 ? 'bg-gradient-to-t from-emerald-500 to-emerald-400' :
                              dayCompletionRate >= 40 ? 'bg-gradient-to-t from-amber-500 to-amber-400' :
                              'bg-gradient-to-t from-red-500 to-red-400'
                            }`}
                            initial={{ height: 0 }}
                            animate={{ height: `${dayCompletionRate}%` }}
                            transition={{ duration: 0.5, delay: 0.5 + i * 0.1 }}
                          />
                        </div>
                        <div className="text-xs font-medium text-neutral-700 dark:text-neutral-300 mt-1">
                          {dayCompletionRate}%
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>

              {/* XP Earning Trends */}
              <motion.div
                className="bg-white/60 dark:bg-neutral-800/60 backdrop-blur-sm rounded-2xl p-6 border border-neutral-200/50 dark:border-neutral-700/50"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.4 }}
              >
                <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-4 flex items-center gap-2">
                  <featureIcons.zap className="w-5 h-5 text-yellow-500 dark:text-yellow-400" />
                  XP Earning Trends
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 rounded-xl bg-gradient-to-br from-yellow-500/10 to-orange-500/10 dark:from-yellow-500/20 dark:to-orange-500/20">
                    <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{dayInsights.xpEarned}</div>
                    <div className="text-sm text-neutral-600 dark:text-neutral-400">XP Today</div>
                  </div>
                  <div className="text-center p-4 rounded-xl bg-gradient-to-br from-purple-500/10 to-pink-500/10 dark:from-purple-500/20 dark:to-pink-500/20">
                    <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">{totalXP}</div>
                    <div className="text-sm text-neutral-600 dark:text-neutral-400">Total XP</div>
                  </div>
                  <div className="text-center p-4 rounded-xl bg-gradient-to-br from-cyan-500/10 to-blue-500/10 dark:from-cyan-500/20 dark:to-blue-500/20">
                    <div className="text-2xl font-bold text-cyan-600 dark:text-cyan-400">{Math.max(0, level * 500 - totalXP)}</div>
                    <div className="text-sm text-neutral-600 dark:text-neutral-400">XP to Next Level</div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </>
  );
};
