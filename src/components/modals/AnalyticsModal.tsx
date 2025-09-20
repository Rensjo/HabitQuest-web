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
  goals: Record<string, { monthlyTargetXP: number }>;
  inventory: Array<{ name: string; cost: number; redeemedAt: string }>;
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
  getPeriodKey,
  goals,
  inventory
}) => {
  const { playButtonClick, playHover } = useSoundEffectsOnly();

  // State for date navigation
  const [viewYear, setViewYear] = React.useState(new Date().getFullYear());
  const [viewMonth, setViewMonth] = React.useState(new Date().getMonth());
  const [activeTab, setActiveTab] = React.useState<'overview' | 'monthly' | 'weekly' | 'daily'>('overview');

  // Navigation functions
  const navigateMonth = (direction: 'prev' | 'next') => {
    if (direction === 'prev') {
      if (viewMonth === 0) {
        setViewMonth(11);
        setViewYear(viewYear - 1);
      } else {
        setViewMonth(viewMonth - 1);
      }
    } else {
      if (viewMonth === 11) {
        setViewMonth(0);
        setViewYear(viewYear + 1);
      } else {
        setViewMonth(viewMonth + 1);
      }
    }
  };

  const navigateYear = (direction: 'prev' | 'next') => {
    setViewYear(direction === 'prev' ? viewYear - 1 : viewYear + 1);
  };

  // Get analytics for any month/year
  const getMonthData = (year: number, month: number) => {
    const targetMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);
    
    let totalCompletions = 0;
    let totalXPEarned = 0;
    let totalPossibleCompletions = 0;
    const categoryPerformance: Record<string, { completed: number; total: number; xp: number; targetXP: number }> = {};
    const dailyData: Array<{ date: number; completions: number; xp: number; rate: number }> = [];

    categories.forEach(category => {
      categoryPerformance[category] = { 
        completed: 0, 
        total: 0, 
        xp: 0, 
        targetXP: goals[category]?.monthlyTargetXP || 0 
      };
    });

    // Calculate stats for each day of the month
    for (let day = 1; day <= lastDayOfMonth.getDate(); day++) {
      const checkDate = new Date(year, month, day);
      if (checkDate > new Date()) break; // Don't count future dates
      
      const dayHabits = habits.filter(h => habitVisibleOnDate(h, checkDate));
      let dayCompletions = 0;
      let dayXP = 0;
      
      dayHabits.forEach(habit => {
        const key = getPeriodKey(habit.frequency, checkDate);
        categoryPerformance[habit.category].total++;
        totalPossibleCompletions++;
        
        if (habit.completions[key]) {
          categoryPerformance[habit.category].completed++;
          categoryPerformance[habit.category].xp += habit.xpOnComplete || 0;
          totalCompletions++;
          totalXPEarned += habit.xpOnComplete || 0;
          dayCompletions++;
          dayXP += habit.xpOnComplete || 0;
        }
      });

      const dayRate = dayHabits.length > 0 ? (dayCompletions / dayHabits.length) * 100 : 0;
      dailyData.push({ date: day, completions: dayCompletions, xp: dayXP, rate: dayRate });
    }

    const overallCompletionRate = totalPossibleCompletions > 0 ? (totalCompletions / totalPossibleCompletions) * 100 : 0;

    return {
      totalCompletions,
      totalXPEarned,
      totalPossibleCompletions,
      overallCompletionRate,
      categoryPerformance,
      dailyData,
      monthName: targetMonth.toLocaleDateString('en', { month: 'long', year: 'numeric' }),
      year,
      month
    };
  };

  // Get yearly overview data
  const getYearlyData = (year: number) => {
    const yearlyStats = {
      totalXP: 0,
      totalCompletions: 0,
      monthlyData: [] as Array<{ month: number; xp: number; completions: number; rate: number }>,
      bestMonth: { month: -1, xp: 0, name: '' },
      categoryYearlyPerformance: {} as Record<string, { xp: number; completed: number; total: number }>
    };

    categories.forEach(category => {
      yearlyStats.categoryYearlyPerformance[category] = { xp: 0, completed: 0, total: 0 };
    });

    // Calculate each month of the year
    for (let month = 0; month < 12; month++) {
      const monthData = getMonthData(year, month);
      yearlyStats.totalXP += monthData.totalXPEarned;
      yearlyStats.totalCompletions += monthData.totalCompletions;
      
      const monthRate = monthData.overallCompletionRate;
      yearlyStats.monthlyData.push({
        month,
        xp: monthData.totalXPEarned,
        completions: monthData.totalCompletions,
        rate: monthRate
      });

      // Track best performing month
      if (monthData.totalXPEarned > yearlyStats.bestMonth.xp) {
        yearlyStats.bestMonth = {
          month,
          xp: monthData.totalXPEarned,
          name: new Date(year, month, 1).toLocaleDateString('en', { month: 'long' })
        };
      }

      // Aggregate category performance
      Object.entries(monthData.categoryPerformance).forEach(([category, data]) => {
        yearlyStats.categoryYearlyPerformance[category].xp += data.xp;
        yearlyStats.categoryYearlyPerformance[category].completed += data.completed;
        yearlyStats.categoryYearlyPerformance[category].total += data.total;
      });
    }

    return yearlyStats;
  };

  // Weekly Comparison
  const getWeeklyComparison = () => {
    const now = new Date();
    const currentWeekStart = new Date(now);
    currentWeekStart.setDate(now.getDate() - now.getDay());
    
    const previousWeekStart = new Date(currentWeekStart);
    previousWeekStart.setDate(currentWeekStart.getDate() - 7);

    const getWeekData = (startDate: Date) => {
      let completions = 0;
      let xpEarned = 0;
      
      for (let i = 0; i < 7; i++) {
        const checkDate = new Date(startDate);
        checkDate.setDate(startDate.getDate() + i);
        
        const dayHabits = habits.filter(h => habitVisibleOnDate(h, checkDate));
        dayHabits.forEach(habit => {
          const key = getPeriodKey(habit.frequency, checkDate);
          if (habit.completions[key]) {
            completions++;
            xpEarned += habit.xpOnComplete || 0;
          }
        });
      }
      
      return { completions, xpEarned };
    };

    const previousWeek = getWeekData(previousWeekStart);
    const currentWeek = getWeekData(currentWeekStart);

    return {
      previousWeek,
      currentWeek,
      improvement: {
        completions: currentWeek.completions - previousWeek.completions,
        xpEarned: currentWeek.xpEarned - previousWeek.xpEarned
      }
    };
  };

  // Reward Purchase Analytics
  const getRewardAnalytics = () => {
    const now = new Date();
    const previousMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const currentMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const previousMonthPurchases = inventory.filter(item => {
      const purchaseDate = new Date(item.redeemedAt);
      return purchaseDate >= previousMonth && purchaseDate < currentMonth;
    });

    const currentMonthPurchases = inventory.filter(item => {
      const purchaseDate = new Date(item.redeemedAt);
      return purchaseDate >= currentMonth;
    });

    const previousMonthSpending = previousMonthPurchases.reduce((sum, item) => sum + item.cost, 0);
    const currentMonthSpending = currentMonthPurchases.reduce((sum, item) => sum + item.cost, 0);

    return {
      previousMonth: {
        purchases: previousMonthPurchases.length,
        spending: previousMonthSpending,
        items: previousMonthPurchases
      },
      currentMonth: {
        purchases: currentMonthPurchases.length,
        spending: currentMonthSpending,
        items: currentMonthPurchases
      }
    };
  };

  // Calculate data based on current view
  const currentMonthData = getMonthData(new Date().getFullYear(), new Date().getMonth());
  const previousMonthData = getMonthData(
    new Date().getMonth() === 0 ? new Date().getFullYear() - 1 : new Date().getFullYear(),
    new Date().getMonth() === 0 ? 11 : new Date().getMonth() - 1
  );
  const viewingMonthData = getMonthData(viewYear, viewMonth);
  const yearlyData = getYearlyData(viewYear);
  const rewardAnalytics = getRewardAnalytics();
  const weeklyComparison = getWeeklyComparison();

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
            relative w-full max-w-7xl max-h-[95vh] overflow-hidden
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

          <div className="relative z-10 p-6">
            {/* Analytics Header with Navigation */}
            <div className="flex flex-col gap-6 mb-8">
              {/* Title and Close */}
              <div className="flex items-center justify-between">
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
                    <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
                      Comprehensive insights into your habit journey
                    </p>
                  </div>
                </div>
                
                <motion.button
                  onClick={() => {
                    onClose();
                    playButtonClick();
                  }}
                  className="p-2 rounded-xl bg-white/60 dark:bg-neutral-800/60 backdrop-blur-sm border border-neutral-200/50 dark:border-neutral-700/50 hover:bg-white/80 dark:hover:bg-neutral-800/80 transition-all duration-200"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <featureIcons.x className="w-5 h-5 text-neutral-600 dark:text-neutral-400" />
                </motion.button>
              </div>

              {/* Date Navigation */}
              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                <div className="flex items-center gap-4">
                  {/* Year Navigation */}
                  <div className="flex items-center gap-2 bg-white/60 dark:bg-neutral-800/60 backdrop-blur-sm rounded-2xl p-2 border border-neutral-200/50 dark:border-neutral-700/50">
                    <motion.button
                      onClick={() => navigateYear('prev')}
                      className="p-2 rounded-lg hover:bg-neutral-100/50 dark:hover:bg-neutral-700/50 transition-all duration-200"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onMouseEnter={() => playHover()}
                    >
                      <featureIcons.chevronLeft className="w-4 h-4 text-neutral-600 dark:text-neutral-400" />
                    </motion.button>
                    <span className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 min-w-[4rem] text-center">
                      {viewYear}
                    </span>
                    <motion.button
                      onClick={() => navigateYear('next')}
                      className="p-2 rounded-lg hover:bg-neutral-100/50 dark:hover:bg-neutral-700/50 transition-all duration-200"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onMouseEnter={() => playHover()}
                      disabled={viewYear >= new Date().getFullYear()}
                    >
                      <featureIcons.chevronRight className="w-4 h-4 text-neutral-600 dark:text-neutral-400" />
                    </motion.button>
                  </div>

                  {/* Month Navigation */}
                  <div className="flex items-center gap-2 bg-white/60 dark:bg-neutral-800/60 backdrop-blur-sm rounded-2xl p-2 border border-neutral-200/50 dark:border-neutral-700/50">
                    <motion.button
                      onClick={() => navigateMonth('prev')}
                      className="p-2 rounded-lg hover:bg-neutral-100/50 dark:hover:bg-neutral-700/50 transition-all duration-200"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onMouseEnter={() => playHover()}
                    >
                      <featureIcons.chevronLeft className="w-4 h-4 text-neutral-600 dark:text-neutral-400" />
                    </motion.button>
                    <span className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 min-w-[8rem] text-center">
                      {viewingMonthData.monthName}
                    </span>
                    <motion.button
                      onClick={() => navigateMonth('next')}
                      className="p-2 rounded-lg hover:bg-neutral-100/50 dark:hover:bg-neutral-700/50 transition-all duration-200"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onMouseEnter={() => playHover()}
                      disabled={viewYear >= new Date().getFullYear() && viewMonth >= new Date().getMonth()}
                    >
                      <featureIcons.chevronRight className="w-4 h-4 text-neutral-600 dark:text-neutral-400" />
                    </motion.button>
                  </div>
                </div>

                {/* View Tabs */}
                <div className="flex bg-white/60 dark:bg-neutral-800/60 backdrop-blur-sm rounded-2xl p-1 border border-neutral-200/50 dark:border-neutral-700/50">
                  {[
                    { id: 'overview', label: 'Overview', icon: featureIcons.pieChart },
                    { id: 'monthly', label: 'Monthly', icon: featureIcons.calendar },
                    { id: 'weekly', label: 'Weekly', icon: featureIcons.trending },
                    { id: 'daily', label: 'Daily', icon: featureIcons.clock }
                  ].map((tab) => (
                    <motion.button
                      key={tab.id}
                      onClick={() => {
                        setActiveTab(tab.id as any);
                        playButtonClick();
                      }}
                      className={`flex items-center gap-2 px-3 py-2 rounded-xl transition-all duration-200 ${
                        activeTab === tab.id
                          ? 'bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400'
                          : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100/50 dark:hover:bg-neutral-700/50'
                      }`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onMouseEnter={() => playHover()}
                    >
                      <tab.icon className="w-4 h-4" />
                      <span className="text-sm font-medium hidden sm:block">{tab.label}</span>
                    </motion.button>
                  ))}
                </div>
              </div>
            </div>

            {/* Analytics Content */}
            <div className="max-h-[75vh] overflow-y-auto pr-2 space-y-6 light-scrollbar dark:dark-scrollbar">
              
              {/* Overview Tab */}
              {activeTab === 'overview' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  {/* Yearly Stats */}
                  <motion.div
                    className="bg-white/60 dark:bg-neutral-800/60 backdrop-blur-sm rounded-2xl p-6 border border-neutral-200/50 dark:border-neutral-700/50"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-4 flex items-center gap-2">
                      <featureIcons.trophy className="w-5 h-5 text-amber-500 dark:text-amber-400" />
                      {viewYear} Year Overview
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div className="text-center p-4 rounded-xl bg-gradient-to-br from-emerald-500/10 to-green-500/10 dark:from-emerald-500/20 dark:to-green-500/20">
                        <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{yearlyData.totalCompletions}</div>
                        <div className="text-sm text-neutral-600 dark:text-neutral-400">Total Completions</div>
                      </div>
                      <div className="text-center p-4 rounded-xl bg-gradient-to-br from-purple-500/10 to-pink-500/10 dark:from-purple-500/20 dark:to-pink-500/20">
                        <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">{yearlyData.totalXP}</div>
                        <div className="text-sm text-neutral-600 dark:text-neutral-400">Total XP</div>
                      </div>
                      <div className="text-center p-4 rounded-xl bg-gradient-to-br from-amber-500/10 to-orange-500/10 dark:from-amber-500/20 dark:to-orange-500/20">
                        <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">{yearlyData.bestMonth.name}</div>
                        <div className="text-sm text-neutral-600 dark:text-neutral-400">Best Month</div>
                      </div>
                      <div className="text-center p-4 rounded-xl bg-gradient-to-br from-blue-500/10 to-cyan-500/10 dark:from-blue-500/20 dark:to-cyan-500/20">
                        <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                          {Math.round((yearlyData.totalCompletions / Math.max(1, yearlyData.monthlyData.reduce((sum, m) => sum + m.completions, 0)) || 1) * 100)}%
                        </div>
                        <div className="text-sm text-neutral-600 dark:text-neutral-400">Avg Completion Rate</div>
                      </div>
                    </div>

                    {/* Monthly Progress Chart */}
                    <div className="mt-6">
                      <h4 className="text-md font-medium text-neutral-800 dark:text-neutral-200 mb-3">Monthly Progress</h4>
                      <div className="flex items-end justify-between gap-2 h-32 bg-neutral-100/50 dark:bg-neutral-700/50 rounded-xl p-4">
                        {yearlyData.monthlyData.map((month, index) => {
                          const maxXP = Math.max(...yearlyData.monthlyData.map(m => m.xp));
                          const height = maxXP > 0 ? (month.xp / maxXP) * 100 : 0;
                          const isCurrentMonth = index === new Date().getMonth() && viewYear === new Date().getFullYear();
                          
                          return (
                            <motion.div
                              key={index}
                              className="flex-1 flex flex-col items-center gap-2"
                              initial={{ height: 0 }}
                              animate={{ height: 'auto' }}
                              transition={{ duration: 0.5, delay: index * 0.05 }}
                            >
                              <div className="text-xs text-neutral-600 dark:text-neutral-400">
                                {new Date(viewYear, index, 1).toLocaleDateString('en', { month: 'short' })}
                              </div>
                              <div className="w-full bg-neutral-200/50 dark:bg-neutral-600/50 rounded-lg flex items-end" style={{ height: '80px' }}>
                                <motion.div
                                  className={`w-full rounded-lg ${
                                    isCurrentMonth 
                                      ? 'bg-gradient-to-t from-emerald-500 to-emerald-400'
                                      : month.xp > 0
                                        ? 'bg-gradient-to-t from-blue-500 to-blue-400'
                                        : 'bg-gradient-to-t from-neutral-400 to-neutral-300'
                                  }`}
                                  initial={{ height: 0 }}
                                  animate={{ height: `${height}%` }}
                                  transition={{ duration: 0.8, delay: 0.3 + index * 0.05 }}
                                />
                              </div>
                              <div className="text-xs font-medium text-neutral-700 dark:text-neutral-300">
                                {month.xp}
                              </div>
                            </motion.div>
                          );
                        })}
                      </div>
                    </div>
                  </motion.div>

                  {/* Reward Analytics Summary */}
                  <motion.div
                    className="bg-white/60 dark:bg-neutral-800/60 backdrop-blur-sm rounded-2xl p-6 border border-neutral-200/50 dark:border-neutral-700/50"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.1 }}
                  >
                    <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-4 flex items-center gap-2">
                      <featureIcons.gift className="w-5 h-5 text-pink-500 dark:text-pink-400" />
                      Reward Shop Summary
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <h4 className="font-medium text-neutral-800 dark:text-neutral-200">Previous Month</h4>
                        <div className="grid grid-cols-2 gap-3">
                          <div className="p-3 rounded-xl bg-gradient-to-br from-pink-500/10 to-rose-500/10 dark:from-pink-500/20 dark:to-rose-500/20">
                            <div className="text-lg font-bold text-pink-600 dark:text-pink-400">{rewardAnalytics.previousMonth.purchases}</div>
                            <div className="text-xs text-neutral-600 dark:text-neutral-400">Items</div>
                          </div>
                          <div className="p-3 rounded-xl bg-gradient-to-br from-violet-500/10 to-purple-500/10 dark:from-violet-500/20 dark:to-purple-500/20">
                            <div className="text-lg font-bold text-violet-600 dark:text-violet-400">{rewardAnalytics.previousMonth.spending}</div>
                            <div className="text-xs text-neutral-600 dark:text-neutral-400">Points</div>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-4">
                        <h4 className="font-medium text-neutral-800 dark:text-neutral-200">This Month</h4>
                        <div className="grid grid-cols-2 gap-3">
                          <div className="p-3 rounded-xl bg-gradient-to-br from-cyan-500/10 to-blue-500/10 dark:from-cyan-500/20 dark:to-blue-500/20">
                            <div className="text-lg font-bold text-cyan-600 dark:text-cyan-400">{rewardAnalytics.currentMonth.purchases}</div>
                            <div className="text-xs text-neutral-600 dark:text-neutral-400">Items</div>
                          </div>
                          <div className="p-3 rounded-xl bg-gradient-to-br from-teal-500/10 to-emerald-500/10 dark:from-teal-500/20 dark:to-emerald-500/20">
                            <div className="text-lg font-bold text-teal-600 dark:text-teal-400">{rewardAnalytics.currentMonth.spending}</div>
                            <div className="text-xs text-neutral-600 dark:text-neutral-400">Points</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              )}

              {/* Monthly Tab */}
              {activeTab === 'monthly' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  {/* Monthly Overview Stats */}
                  <motion.div
                    className="bg-white/60 dark:bg-neutral-800/60 backdrop-blur-sm rounded-2xl p-6 border border-neutral-200/50 dark:border-neutral-700/50"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-4 flex items-center gap-2">
                      <featureIcons.calendar className="w-5 h-5 text-blue-500 dark:text-blue-400" />
                      {viewingMonthData.monthName} Performance
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                      <div className="text-center p-4 rounded-xl bg-gradient-to-br from-blue-500/10 to-indigo-500/10 dark:from-blue-500/20 dark:to-indigo-500/20">
                        <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{viewingMonthData.totalCompletions}</div>
                        <div className="text-sm text-neutral-600 dark:text-neutral-400">Completions</div>
                      </div>
                      <div className="text-center p-4 rounded-xl bg-gradient-to-br from-purple-500/10 to-pink-500/10 dark:from-purple-500/20 dark:to-pink-500/20">
                        <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">{viewingMonthData.totalXPEarned}</div>
                        <div className="text-sm text-neutral-600 dark:text-neutral-400">XP Earned</div>
                      </div>
                      <div className="text-center p-4 rounded-xl bg-gradient-to-br from-emerald-500/10 to-green-500/10 dark:from-emerald-500/20 dark:to-green-500/20">
                        <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{Math.round(viewingMonthData.overallCompletionRate)}%</div>
                        <div className="text-sm text-neutral-600 dark:text-neutral-400">Completion Rate</div>
                      </div>
                      <div className="text-center p-4 rounded-xl bg-gradient-to-br from-amber-500/10 to-orange-500/10 dark:from-amber-500/20 dark:to-orange-500/20">
                        <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">
                          {viewingMonthData.dailyData.length > 0 ? Math.round(viewingMonthData.dailyData.reduce((sum, day) => sum + day.xp, 0) / viewingMonthData.dailyData.length) : 0}
                        </div>
                        <div className="text-sm text-neutral-600 dark:text-neutral-400">Avg Daily XP</div>
                      </div>
                    </div>

                    {/* Daily Progress Chart */}
                    <div>
                      <h4 className="text-md font-medium text-neutral-800 dark:text-neutral-200 mb-3">Daily Progress This Month</h4>
                      <div className="flex items-end justify-start gap-1 h-24 bg-neutral-100/50 dark:bg-neutral-700/50 rounded-xl p-3 overflow-x-auto">
                        {viewingMonthData.dailyData.map((day) => {
                          const maxRate = Math.max(...viewingMonthData.dailyData.map(d => d.rate));
                          const height = maxRate > 0 ? (day.rate / maxRate) * 100 : 0;
                          
                          return (
                            <motion.div
                              key={day.date}
                              className="flex flex-col items-center gap-1 min-w-[20px]"
                              initial={{ height: 0 }}
                              animate={{ height: 'auto' }}
                              transition={{ duration: 0.3, delay: day.date * 0.02 }}
                            >
                              <div className="text-xs text-neutral-600 dark:text-neutral-400">{day.date}</div>
                              <div className="w-4 bg-neutral-200/50 dark:bg-neutral-600/50 rounded flex items-end" style={{ height: '40px' }}>
                                <motion.div
                                  className={`w-full rounded ${
                                    day.rate >= 80 ? 'bg-gradient-to-t from-emerald-500 to-emerald-400' :
                                    day.rate >= 60 ? 'bg-gradient-to-t from-blue-500 to-blue-400' :
                                    day.rate >= 40 ? 'bg-gradient-to-t from-amber-500 to-amber-400' :
                                    day.rate > 0 ? 'bg-gradient-to-t from-orange-500 to-orange-400' :
                                    'bg-gradient-to-t from-neutral-400 to-neutral-300'
                                  }`}
                                  initial={{ height: 0 }}
                                  animate={{ height: `${height}%` }}
                                  transition={{ duration: 0.5, delay: 0.2 + day.date * 0.02 }}
                                />
                              </div>
                            </motion.div>
                          );
                        })}
                      </div>
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
                      Category Performance - {viewingMonthData.monthName}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {categories.map((category, index) => {
                        const categoryData = viewingMonthData.categoryPerformance[category];
                        const completionRate = categoryData.total > 0 ? Math.round((categoryData.completed / categoryData.total) * 100) : 0;
                        const targetProgress = categoryData.targetXP > 0 ? Math.min((categoryData.xp / categoryData.targetXP) * 100, 100) : 0;
                        const targetMet = categoryData.xp >= categoryData.targetXP && categoryData.targetXP > 0;
                        
                        return (
                          <motion.div
                            key={category}
                            className={`p-4 rounded-xl border ${
                              targetMet 
                                ? 'bg-gradient-to-br from-emerald-500/10 to-green-500/10 dark:from-emerald-500/20 dark:to-green-500/20 border-emerald-200/50 dark:border-emerald-600/30'
                                : 'bg-gradient-to-br from-neutral-50/50 to-neutral-100/50 dark:from-neutral-800/50 dark:to-neutral-700/50 border-neutral-200/30 dark:border-neutral-600/30'
                            }`}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: 0.1 + index * 0.05 }}
                            whileHover={{ scale: 1.02, y: -2 }}
                            onMouseEnter={() => playHover()}
                          >
                            <div className="flex items-center justify-between mb-3">
                              <div className="flex items-center gap-2">
                                {categoryIcons[category] && (
                                  <div className={`p-1.5 rounded-lg ${
                                    targetMet 
                                      ? 'bg-emerald-500/10 dark:bg-emerald-500/20' 
                                      : 'bg-blue-500/10 dark:bg-blue-500/20'
                                  }`}>
                                    {React.createElement(categoryIcons[category], { 
                                      className: `w-4 h-4 ${
                                        targetMet 
                                          ? 'text-emerald-600 dark:text-emerald-400' 
                                          : 'text-blue-600 dark:text-blue-400'
                                      }` 
                                    })}
                                  </div>
                                )}
                                <span className="font-medium text-neutral-900 dark:text-neutral-100 text-sm">{category}</span>
                              </div>
                              {targetMet && (
                                <featureIcons.check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                              )}
                            </div>
                            
                            <div className="space-y-3">
                              {/* Completion Stats */}
                              <div>
                                <div className="flex justify-between text-xs text-neutral-600 dark:text-neutral-400 mb-1">
                                  <span>Completion Rate</span>
                                  <span>{completionRate}%</span>
                                </div>
                                <div className="w-full bg-neutral-200/50 dark:bg-neutral-700/50 rounded-full h-2">
                                  <motion.div
                                    className="h-2 rounded-full bg-gradient-to-r from-blue-500 to-blue-400"
                                    initial={{ width: 0 }}
                                    animate={{ width: `${completionRate}%` }}
                                    transition={{ duration: 0.8, delay: 0.2 + index * 0.1 }}
                                  />
                                </div>
                                <div className="text-xs text-neutral-600 dark:text-neutral-400 mt-1">
                                  {categoryData.completed}/{categoryData.total} habits completed
                                </div>
                              </div>
                              
                              {/* XP Progress */}
                              {categoryData.targetXP > 0 && (
                                <div>
                                  <div className="flex justify-between text-xs text-neutral-600 dark:text-neutral-400 mb-1">
                                    <span>XP Target</span>
                                    <span>{targetProgress.toFixed(0)}%</span>
                                  </div>
                                  <div className="w-full bg-neutral-200/50 dark:bg-neutral-700/50 rounded-full h-2">
                                    <motion.div
                                      className={`h-2 rounded-full ${
                                        targetMet 
                                          ? 'bg-gradient-to-r from-emerald-500 to-green-500' 
                                          : 'bg-gradient-to-r from-amber-500 to-orange-500'
                                      }`}
                                      initial={{ width: 0 }}
                                      animate={{ width: `${targetProgress}%` }}
                                      transition={{ duration: 0.8, delay: 0.3 + index * 0.1 }}
                                    />
                                  </div>
                                  <div className="text-xs text-neutral-600 dark:text-neutral-400 mt-1">
                                    {categoryData.xp}/{categoryData.targetXP} XP
                                  </div>
                                </div>
                              )}
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  </motion.div>
                </motion.div>
              )}

              {/* Weekly Tab */}
              {activeTab === 'weekly' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  {/* Weekly Overview */}
                  <motion.div
                    className="bg-white/60 dark:bg-neutral-800/60 backdrop-blur-sm rounded-2xl p-6 border border-neutral-200/50 dark:border-neutral-700/50"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-4 flex items-center gap-2">
                      <featureIcons.trending className="w-5 h-5 text-blue-500 dark:text-blue-400" />
                      Weekly Performance Comparison
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {/* Previous Week */}
                      <div className="text-center p-4 rounded-xl bg-gradient-to-br from-slate-500/10 to-gray-500/10 dark:from-slate-500/20 dark:to-gray-500/20">
                        <div className="text-sm font-medium text-neutral-600 dark:text-neutral-400 mb-2">Previous Week</div>
                        <div className="space-y-1">
                          <div className="text-xl font-bold text-slate-600 dark:text-slate-400">{weeklyComparison.previousWeek.completions}</div>
                          <div className="text-xs text-neutral-600 dark:text-neutral-400">Completions</div>
                          <div className="text-sm font-medium text-slate-600 dark:text-slate-400">{weeklyComparison.previousWeek.xpEarned} XP</div>
                        </div>
                      </div>

                      {/* Current Week */}
                      <div className="text-center p-4 rounded-xl bg-gradient-to-br from-emerald-500/10 to-green-500/10 dark:from-emerald-500/20 dark:to-green-500/20">
                        <div className="text-sm font-medium text-neutral-600 dark:text-neutral-400 mb-2">This Week</div>
                        <div className="space-y-1">
                          <div className="text-xl font-bold text-emerald-600 dark:text-emerald-400">{weeklyComparison.currentWeek.completions}</div>
                          <div className="text-xs text-neutral-600 dark:text-neutral-400">Completions</div>
                          <div className="text-sm font-medium text-emerald-600 dark:text-emerald-400">{weeklyComparison.currentWeek.xpEarned} XP</div>
                        </div>
                      </div>

                      {/* Improvement */}
                      <div className="text-center p-4 rounded-xl bg-gradient-to-br from-blue-500/10 to-indigo-500/10 dark:from-blue-500/20 dark:to-indigo-500/20">
                        <div className="text-sm font-medium text-neutral-600 dark:text-neutral-400 mb-2">Improvement</div>
                        <div className="space-y-1">
                          <div className={`text-xl font-bold flex items-center justify-center gap-1 ${
                            weeklyComparison.improvement.completions >= 0 
                              ? 'text-emerald-600 dark:text-emerald-400' 
                              : 'text-red-600 dark:text-red-400'
                          }`}>
                            {weeklyComparison.improvement.completions >= 0 ? (
                              <featureIcons.trendingUp className="w-4 h-4" />
                            ) : (
                              <featureIcons.trendingDown className="w-4 h-4" />
                            )}
                            {weeklyComparison.improvement.completions >= 0 ? '+' : ''}{weeklyComparison.improvement.completions}
                          </div>
                          <div className="text-xs text-neutral-600 dark:text-neutral-400">Completions</div>
                          <div className={`text-sm font-medium flex items-center justify-center gap-1 ${
                            weeklyComparison.improvement.xpEarned >= 0 
                              ? 'text-emerald-600 dark:text-emerald-400' 
                              : 'text-red-600 dark:text-red-400'
                          }`}>
                            {weeklyComparison.improvement.xpEarned >= 0 ? '+' : ''}{weeklyComparison.improvement.xpEarned} XP
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>

                  {/* Weekly Progress Chart */}
                  <motion.div
                    className="bg-white/60 dark:bg-neutral-800/60 backdrop-blur-sm rounded-2xl p-6 border border-neutral-200/50 dark:border-neutral-700/50"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.1 }}
                  >
                    <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-4 flex items-center gap-2">
                      <featureIcons.calendar className="w-5 h-5 text-blue-500 dark:text-blue-400" />
                      7-Day Progress
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
                            transition={{ duration: 0.3, delay: 0.1 + i * 0.05 }}
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
                                transition={{ duration: 0.5, delay: 0.2 + i * 0.1 }}
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
                </motion.div>
              )}

              {/* Daily Tab */}
              {activeTab === 'daily' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  {/* Today's Performance */}
                  <motion.div
                    className="bg-white/60 dark:bg-neutral-800/60 backdrop-blur-sm rounded-2xl p-6 border border-neutral-200/50 dark:border-neutral-700/50"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-4 flex items-center gap-2">
                      <featureIcons.clock className="w-5 h-5 text-orange-500 dark:text-orange-400" />
                      Today's Performance
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div className="text-center p-4 rounded-xl bg-gradient-to-br from-emerald-500/10 to-green-500/10 dark:from-emerald-500/20 dark:to-green-500/20">
                        <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{habitStats.completionRate}%</div>
                        <div className="text-sm text-neutral-600 dark:text-neutral-400">Completion Rate</div>
                      </div>
                      <div className="text-center p-4 rounded-xl bg-gradient-to-br from-purple-500/10 to-pink-500/10 dark:from-purple-500/20 dark:to-pink-500/20">
                        <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">{dayInsights.xpEarned}</div>
                        <div className="text-sm text-neutral-600 dark:text-neutral-400">XP Earned</div>
                      </div>
                      <div className="text-center p-4 rounded-xl bg-gradient-to-br from-amber-500/10 to-orange-500/10 dark:from-amber-500/20 dark:to-orange-500/20">
                        <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">{dayInsights.completedHabits}</div>
                        <div className="text-sm text-neutral-600 dark:text-neutral-400">Habits Done</div>
                      </div>
                      <div className="text-center p-4 rounded-xl bg-gradient-to-br from-blue-500/10 to-cyan-500/10 dark:from-blue-500/20 dark:to-cyan-500/20">
                        <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{habits.length}</div>
                        <div className="text-sm text-neutral-600 dark:text-neutral-400">Total Habits</div>
                      </div>
                    </div>
                  </motion.div>

                  {/* Habit Streak Analysis */}
                  <motion.div
                    className="bg-white/60 dark:bg-neutral-800/60 backdrop-blur-sm rounded-2xl p-6 border border-neutral-200/50 dark:border-neutral-700/50"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.1 }}
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
                          transition={{ duration: 0.3, delay: 0.1 + index * 0.05 }}
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
                </motion.div>
              )}

            </div>
          </div>
        </motion.div>
      </motion.div>
    </>
  );
};