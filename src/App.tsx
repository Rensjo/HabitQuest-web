// ---------------------------------------------------------------------
// Imports
// ---------------------------------------------------------------------
import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Import extracted modules
import { 
  FREQUENCIES, 
  WEEKDAYS
} from "./constants";
import { 
  classNames, 
  getPeriodKey, 
  startOfMonth, 
  endOfMonth, 
  sameDay
} from "./utils";
import { featureIcons, frequencyIcons } from "./utils/icons";
import type { Frequency, Habit } from "./types";

// Import extracted components
import { AddHabitModal, AddRewardModal, AddCategoryModal } from "./components/modals";
import { useHabitManagement } from "./hooks/business";

// Import new enhanced components
import { DynamicContainer } from "./components/layout";
import { 
  ThemeToggle
} from "./components/ui";
import { GamificationStatus } from "./components/gamification";

// ---------------------------------------------------------------------
// Component Logic Starts Here
// ---------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------
export default function HabitGoalTrackerV3() {
  // Use extracted business logic hook
  const {
    habits,
    points,
    totalXP,
    goals,
    shop,
    inventory,
    categories,
    level,
    levelProgress,
    overallStreak,
    setGoals,
    habitVisibleOnDate,
    toggleComplete,
    addHabit,
    deleteHabit,
    getCategoryXP,
    redeemReward,
    addReward,
    deleteReward,
    addCategory,
    saveAppData
  } = useHabitManagement();

  // UI state
  const [activeFreq, setActiveFreq] = useState<Frequency>("daily");
  const [showAddHabit, setShowAddHabit] = useState(false);
  const [showAddReward, setShowAddReward] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [showDayInsights, setShowDayInsights] = useState(false);
  const [showRewardShop, setShowRewardShop] = useState(false);
  const [activeSettings, setActiveSettings] = useState(false);
  const [activeAnalytics, setActiveAnalytics] = useState(false);

  // Persist to localStorage whenever major state changes
  useEffect(() => {
    saveAppData();
  }, [habits, points, totalXP, goals, inventory, shop, categories, saveAppData]);

  // Period key depends on the selected date and active frequency
  const periodKey = useMemo(() => getPeriodKey(activeFreq, selectedDate), [activeFreq, selectedDate]);

  // Category XP for the currently selected month
  const categoryXP: Record<string, number> = useMemo(() => {
    return getCategoryXP(selectedDate);
  }, [selectedDate, getCategoryXP]);

  // Calendar model for the selected month ------------------------------
  const monthStart = startOfMonth(selectedDate);
  const monthEnd = endOfMonth(selectedDate);
  const leadingBlanks = monthStart.getDay(); // 0..6
  const daysInMonth = monthEnd.getDate();
  const cells: Array<Date | null> = [];
  for (let i = 0; i < leadingBlanks; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++)
    cells.push(new Date(selectedDate.getFullYear(), selectedDate.getMonth(), d));
  while (cells.length % 7 !== 0) cells.push(null);

  // Precompute a quick lookup of days that have ANY completion ----------
  const completedDaysSet = useMemo(() => {
    const set = new Set<string>();
    habits.forEach((h) => {
      Object.entries(h.completions).forEach(([_, ts]) => {
        const dt = new Date(ts);
        if (dt.getMonth() === selectedDate.getMonth() && dt.getFullYear() === selectedDate.getFullYear()) {
          set.add(`${dt.getFullYear()}-${dt.getMonth()}-${dt.getDate()}`);
        }
      });
    });
    return set;
  }, [habits, selectedDate]);

  // Filter habits visible under the active tab & date ------------------
  const visibleHabits = habits.filter(
    (h) => h.frequency === activeFreq && habitVisibleOnDate(h, selectedDate)
  );

  // Calculate habit statistics for selected date ------------------
  const habitStats = useMemo(() => {
    const keyForSelected = getPeriodKey(activeFreq, selectedDate);
    const completedOnSelected = visibleHabits.filter(h => h.completions[keyForSelected]).length;
    const totalOnSelected = visibleHabits.length;
    const completionRate = totalOnSelected > 0 ? Math.round((completedOnSelected / totalOnSelected) * 100) : 0;
    
    const totalStreak = visibleHabits.reduce((sum, h) => sum + (h.streak || 0), 0);
    const averageStreak = totalOnSelected > 0 ? Math.round(totalStreak / totalOnSelected) : 0;
    
    return {
      completedToday: completedOnSelected,
      totalToday: totalOnSelected,
      completionRate,
      averageStreak,
      totalStreak
    };
  }, [visibleHabits, activeFreq, selectedDate]);

  // Day insights across all frequencies for selectedDate ------------
  const dayInsights = useMemo(() => {
    const habitsForDay: Habit[] = habits.filter((h) => habitVisibleOnDate(h, selectedDate));
    const completedCount = habitsForDay.filter((h) => Boolean(h.completions[getPeriodKey(h.frequency, selectedDate)])).length;
    const totalCount = habitsForDay.length;
    const completionRate = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
    const xpEarned = habitsForDay.reduce((sum, h) => sum + (h.completions[getPeriodKey(h.frequency, selectedDate)] ? (h.xpOnComplete || 0) : 0), 0);
    return { habitsForDay, completedCount, totalCount, completionRate, xpEarned };
  }, [habits, selectedDate, habitVisibleOnDate]);

  // -------------------------------------------------------------------
  // Render (header, calendar, tabs, and habit list)
  // -------------------------------------------------------------------
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-neutral-50 via-neutral-100 to-neutral-200 dark:from-neutral-900 dark:via-neutral-950 dark:to-black text-neutral-900 dark:text-neutral-100 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-30 dark:opacity-20">
        <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-blue-400/20 to-purple-600/20 rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute top-1/3 right-0 w-80 h-80 bg-gradient-to-br from-emerald-400/20 to-cyan-600/20 rounded-full blur-3xl transform translate-x-1/2"></div>
        <div className="absolute bottom-0 left-1/3 w-72 h-72 bg-gradient-to-br from-amber-400/20 to-orange-600/20 rounded-full blur-3xl transform translate-y-1/2"></div>
      </div>
      
      {/* Grid Pattern Overlay - visible in both themes */}
      <div className="absolute inset-0">
        <div className="w-full h-full opacity-[0.15] dark:opacity-[0.4]" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(100,116,139,0.6) 1px, transparent 1px)`,
          backgroundSize: '24px 24px'
        }}></div>
        <div className="w-full h-full opacity-[0.08] dark:opacity-[0.2]" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(148,163,184,0.4) 1px, transparent 1px)`,
          backgroundSize: '18px 18px'
        }}></div>
      </div>

      <DynamicContainer maxWidth="7xl" padding="lg" className="relative z-10">
        {/* Enhanced Header with Dynamic Layout */}
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
                    className="text-blue-500" 
                  />
                </motion.div>
                <motion.h1 
                  className="text-3xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500 bg-clip-text text-transparent"
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                >
                  HabitQuest
                </motion.h1>
              </div>

                <motion.p
                  className="text-xs text-neutral-700 dark:text-neutral-500 uppercase tracking-wide font-medium mb-8"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  >
                    Intelligent Tracking for Optimized Daily Routines
                </motion.p>

              {/* Stats Grid - Below Title - All 4 in One Row */}
              <motion.div 
                className="grid grid-cols-2 md:grid-cols-4 gap-5 mb-0"
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
                  whileTap={{ scale: 0.95, y: 0 }}
                  className="
                    bg-white/80 dark:bg-neutral-900/70
                    backdrop-blur-md
                    border border-neutral-200/60 dark:border-neutral-700/40
                    rounded-2xl p-5 text-center
                    shadow-lg shadow-black/5 dark:shadow-black/20
                    relative overflow-hidden
                    cursor-pointer group
                  "
                >
                  {/* Cyan Theme Background */}
                  <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/8 to-blue-500/8 dark:from-cyan-500/10 dark:to-blue-500/10 rounded-2xl group-hover:from-cyan-500/15 group-hover:to-blue-500/15 transition-colors duration-100"></div>
                  
                  {/* Icon Container */}
                  <div className="relative z-10 mb-3">
                    <motion.div 
                      className="inline-flex p-2 rounded-xl bg-gradient-to-br from-cyan-400/20 to-blue-500/20 dark:from-cyan-400/15 dark:to-blue-500/15 border border-cyan-200/30 dark:border-transparent"
                      whileHover={{ rotate: [0, -10, 10, 0], transition: { duration: 0.3 } }}
                    >
                      <featureIcons.calendar className="w-5 h-5 text-cyan-500 dark:text-cyan-400" />
                </motion.div>
                  </div>
                  
                  {/* Value */}
                  <div className="relative z-10 text-xl font-bold bg-gradient-to-r from-cyan-600 to-blue-700 dark:from-cyan-500 dark:to-blue-600 bg-clip-text text-transparent mb-1">
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
                  whileTap={{ scale: 0.95, y: 0 }}
                  className="
                    bg-white/80 dark:bg-neutral-900/70
                    backdrop-blur-md
                    border border-neutral-200/60 dark:border-neutral-700/40
                    rounded-2xl p-5 text-center
                    shadow-lg shadow-black/5 dark:shadow-black/20
                    relative overflow-hidden
                    cursor-pointer group
                  "
                >
                  {/* Dynamic Theme Background based on completion rate */}
                  <div className={`absolute inset-0 rounded-2xl transition-colors duration-100 ${
                    habitStats.completionRate >= 70 
                      ? "bg-gradient-to-br from-emerald-500/8 to-green-500/8 dark:from-emerald-500/10 dark:to-green-500/10 group-hover:from-emerald-500/15 group-hover:to-green-500/15"
                      : habitStats.completionRate >= 40
                      ? "bg-gradient-to-br from-amber-500/8 to-orange-500/8 dark:from-amber-500/10 dark:to-orange-500/10 group-hover:from-amber-500/15 group-hover:to-orange-500/15"
                      : "bg-gradient-to-br from-red-500/8 to-rose-500/8 dark:from-red-500/10 dark:to-rose-500/10 group-hover:from-red-500/15 group-hover:to-rose-500/15"
                  }`}></div>
                  
                  {/* Icon Container */}
                  <div className="relative z-10 mb-3">
                    <motion.div 
                      className={`inline-flex p-2 rounded-xl border border-opacity-30 dark:border-transparent ${
                        habitStats.completionRate >= 70 
                          ? "bg-gradient-to-br from-emerald-400/20 to-green-500/20 dark:from-emerald-400/15 dark:to-green-500/15 border-emerald-200"
                          : habitStats.completionRate >= 40
                          ? "bg-gradient-to-br from-amber-400/20 to-orange-500/20 dark:from-amber-400/15 dark:to-orange-500/15 border-amber-200"
                          : "bg-gradient-to-br from-red-400/20 to-rose-500/20 dark:from-red-400/15 dark:to-rose-500/15 border-red-200"
                      }`}
                      whileHover={{ rotate: [0, -10, 10, 0], transition: { duration: 0.3 } }}
                    >
                      <featureIcons.trending className={`w-5 h-5 ${
                        habitStats.completionRate >= 70 ? "text-emerald-500 dark:text-emerald-400"
                        : habitStats.completionRate >= 40 ? "text-amber-500 dark:text-amber-400"
                        : "text-red-500 dark:text-red-400"
                      }`} />
                </motion.div>
                  </div>
                  
                  {/* Value */}
                  <div className={`relative z-10 text-xl font-bold bg-gradient-to-r bg-clip-text text-transparent mb-1 ${
                    habitStats.completionRate >= 70 
                      ? "from-emerald-600 to-green-700 dark:from-emerald-500 dark:to-green-600"
                      : habitStats.completionRate >= 40
                      ? "from-amber-600 to-orange-700 dark:from-amber-500 dark:to-orange-600"
                      : "from-red-600 to-rose-700 dark:from-red-500 dark:to-rose-600"
                  }`}>
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
                  whileTap={{ scale: 0.95, y: 0 }}
                  className="
                    bg-white/80 dark:bg-neutral-900/70
                    backdrop-blur-md
                    border border-neutral-200/60 dark:border-neutral-700/40
                    rounded-2xl p-5 text-center
                    shadow-lg shadow-black/5 dark:shadow-black/20
                    relative overflow-hidden
                    cursor-pointer group
                  "
                >
                  {/* Purple Theme Background */}
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500/8 to-violet-500/8 dark:from-purple-500/10 dark:to-violet-500/10 rounded-2xl group-hover:from-purple-500/15 group-hover:to-violet-500/15 transition-colors duration-100"></div>
                  
                  {/* Icon Container */}
                  <div className="relative z-10 mb-3">
                    <motion.div 
                      className="inline-flex p-2 rounded-xl bg-gradient-to-br from-purple-400/20 to-violet-500/20 dark:from-purple-400/15 dark:to-violet-500/15 border border-purple-200/30 dark:border-transparent"
                      whileHover={{ rotate: [0, -10, 10, 0], transition: { duration: 0.3 } }}
                    >
                      <featureIcons.star className="w-5 h-5 text-purple-500 dark:text-purple-400" />
                </motion.div>
                  </div>
                  
                  {/* Value */}
                  <div className="relative z-10 text-xl font-bold bg-gradient-to-r from-purple-600 to-violet-700 dark:from-purple-500 dark:to-violet-600 bg-clip-text text-transparent mb-1">
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
                  whileTap={{ scale: 0.95, y: 0 }}
                  className="
                    bg-white/80 dark:bg-neutral-900/70
                    backdrop-blur-md
                    border border-neutral-200/60 dark:border-neutral-700/40
                    rounded-2xl p-5 text-center
                    shadow-lg shadow-black/5 dark:shadow-black/20
                    relative overflow-hidden
                    cursor-pointer group
                  "
                >
                  {/* Green Theme Background */}
                  <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/8 to-green-500/8 dark:from-emerald-500/10 dark:to-green-500/10 rounded-2xl group-hover:from-emerald-500/15 group-hover:to-green-500/15 transition-colors duration-100"></div>
                  
                  {/* Icon Container */}
                  <div className="relative z-10 mb-3">
                    <motion.div 
                      className="inline-flex p-2 rounded-xl bg-gradient-to-br from-emerald-400/20 to-green-500/20 dark:from-emerald-400/15 dark:to-green-500/15 border border-emerald-200/30 dark:border-transparent"
                      whileHover={{ rotate: [0, -10, 10, 0], transition: { duration: 0.3 } }}
                    >
                      <featureIcons.zap className="w-5 h-5 text-emerald-500 dark:text-emerald-400" />
                    </motion.div>
                  </div>
                  
                  {/* Value */}
                  <div className="relative z-10 text-xl font-bold bg-gradient-to-r from-emerald-600 to-green-700 dark:from-emerald-500 dark:to-green-600 bg-clip-text text-transparent mb-1">
                    {totalXP.toLocaleString()}
                  </div>
                  
                  {/* Label */}
                  <div className="relative z-10 text-xs font-medium text-neutral-700 dark:text-neutral-400">Total XP</div>
                </motion.div>
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
              <div className="mb-0 w-full flex flex-col items-center justify-center">
                <GamificationStatus
                  level={level}
                  currentXP={totalXP}
                  xpToNext={Math.max(0, level * 500 - totalXP)}
                  levelProgress={levelProgress}
                  streakDays={overallStreak}
                  onRewardShopClick={() => setShowRewardShop(true)}
                />
              </div>
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
                      <motion.button
                        type="button"
                        onClick={() => setActiveSettings(!activeSettings)}
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
                        <featureIcons.target className="h-4 w-4" />
                        </motion.div>
                      </motion.button>

                      <motion.button
                        type="button"
                        onClick={() => setActiveAnalytics(!activeAnalytics)}
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
          </div>

        </motion.div>
        {/* Calendar */}
        <motion.div 
          className="mt-2 border border-neutral-300/50 dark:border-neutral-700/50 bg-neutral-100/60 dark:bg-neutral-900/50 backdrop-blur-sm rounded-2xl p-4"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          whileHover={{ scale: 1.005 }}
          >
          <div className="flex items-center justify-between">
            <motion.div 
              className="font-semibold text-neutral-900 dark:text-neutral-100"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              {selectedDate.toLocaleString(undefined, { month: "long", year: "numeric" })}
            </motion.div>
            <motion.div 
              className="flex gap-2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, staggerChildren: 0.1 }}
            >
              <motion.button
                className="hidden md:inline-flex items-center gap-2 px-3 py-1 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-neutral-100/70 dark:bg-neutral-800/70 hover:bg-neutral-200/70 dark:hover:bg-neutral-700/70 text-neutral-700 dark:text-neutral-300 transition-colors"
                onClick={() => setShowDayInsights(true)}
                whileHover={{ scale: 1.05, y: -1 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.38 }}
                title="View Day Insights"
              >
                <featureIcons.barChart className="w-4 h-4" />
                {selectedDate.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
              </motion.button>
              <motion.button
                className="
                  relative px-4 py-2 rounded-xl border overflow-hidden
                  bg-white/70 dark:bg-neutral-800/70 
                  border-neutral-300/50 dark:border-neutral-600/50
                  hover:bg-white/90 dark:hover:bg-neutral-700/90 
                  hover:border-blue-400/40 dark:hover:border-blue-500/40
                  text-neutral-700 dark:text-neutral-300 
                  transition-all duration-100
                  backdrop-blur-sm
                  shadow-md shadow-black/5 dark:shadow-black/15
                "
                onClick={() => setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth() - 1, 1))}
                whileHover={{ 
                  scale: 1.08, 
                  y: -3,
                  boxShadow: "0 15px 30px rgba(0, 0, 0, 0.1), 0 5px 15px rgba(0, 0, 0, 0.05)",
                  transition: { duration: 0.1 }
                }}
                whileTap={{ scale: 0.92 }}
                initial={{ opacity: 0, y: 10, x: -10 }}
                animate={{ opacity: 1, y: 0, x: 0 }}
                transition={{ duration: 0.3, type: "spring", stiffness: 300 }}
              >
                {/* Background gradient on hover */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-xl opacity-0"
                  whileHover={{ opacity: 1 }}
                  transition={{ duration: 0.2 }}
                />
                
                {/* Animated arrow */}
                <motion.div 
                  className="relative z-10 flex items-center gap-1"
                  whileHover={{ x: -2 }}
                  transition={{ duration: 0.2 }}
                >
                  <motion.span
                    whileHover={{ x: -1, scale: 1.1 }}
                    transition={{ duration: 0.2 }}
                  >
                    ‹
                  </motion.span>
                  <span className="font-medium">Prev</span>
                </motion.div>
                
                {/* Subtle glow effect */}
                <motion.div
                  className="absolute -inset-1 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-xl blur-sm opacity-0"
                  whileHover={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                />
              </motion.button>
              <motion.button
                className="
                  relative px-4 py-2 rounded-xl border overflow-hidden
                  bg-gradient-to-br from-emerald-500/90 to-green-600/90 
                  border-emerald-400/40 dark:border-emerald-500/40
                  text-white font-semibold
                  transition-all duration-100
                  backdrop-blur-sm
                  shadow-lg shadow-emerald-500/30 dark:shadow-emerald-500/25
                "
                onClick={() => setSelectedDate(new Date())}
                whileHover={{ 
                  scale: 1.08, 
                  y: -3,
                  boxShadow: "0 20px 35px rgba(16, 185, 129, 0.4), 0 10px 15px rgba(16, 185, 129, 0.2)",
                  transition: { duration: 0.1 }
                }}
                whileTap={{ scale: 0.92 }}
                initial={{ opacity: 0, y: 10, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.3, type: "spring", stiffness: 300 }}
              >
                {/* Enhanced gradient background */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-br from-emerald-400/40 via-green-400/30 to-emerald-500/40 rounded-xl"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                />
                
                {/* Shimmer effect */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent rounded-xl"
                  initial={{ x: "-100%" }}
                  animate={{ x: "100%" }}
                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                />
                
                {/* Animated content */}
                <motion.div 
                  className="relative z-10 flex items-center gap-1"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.2 }}
                >
                  <motion.div
                    animate={{ 
                      scale: [1, 1.1, 1],
                      rotate: [0, 5, -5, 0]
                    }}
                    transition={{ 
                      duration: 2, 
                      repeat: Infinity, 
                      repeatDelay: 1 
                    }}
                  >
                    <featureIcons.sun className="w-4 h-4" />
                  </motion.div>
                  <span>Today</span>
                </motion.div>
                
                {/* Pulsing glow */}
                <motion.div
                  className="absolute -inset-1 bg-gradient-to-r from-emerald-400/40 to-green-400/40 rounded-xl blur-sm"
                  animate={{ 
                    opacity: [0.3, 0.6, 0.3],
                    scale: [1, 1.05, 1]
                  }}
                  transition={{ 
                    duration: 2, 
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
              </motion.button>
              <motion.button
                className="
                  relative px-4 py-2 rounded-xl border overflow-hidden
                  bg-white/70 dark:bg-neutral-800/70 
                  border-neutral-300/50 dark:border-neutral-600/50
                  hover:bg-white/90 dark:hover:bg-neutral-700/90 
                  hover:border-purple-400/40 dark:hover:border-purple-500/40
                  text-neutral-700 dark:text-neutral-300 
                  transition-all duration-100
                  backdrop-blur-sm
                  shadow-md shadow-black/5 dark:shadow-black/15
                "
                onClick={() => setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 1))}
                whileHover={{ 
                  scale: 1.08, 
                  y: -3,
                  boxShadow: "0 15px 30px rgba(0, 0, 0, 0.1), 0 5px 15px rgba(0, 0, 0, 0.05)",
                  transition: { duration: 0.1 }
                }}
                whileTap={{ scale: 0.92 }}
                initial={{ opacity: 0, y: 10, x: 10 }}
                animate={{ opacity: 1, y: 0, x: 0 }}
                transition={{ duration: 0.3, type: "spring", stiffness: 300 }}
              >
                {/* Background gradient on hover */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-indigo-500/10 rounded-xl opacity-0"
                  whileHover={{ opacity: 1 }}
                  transition={{ duration: 0.2 }}
                />
                
                {/* Animated arrow */}
                <motion.div 
                  className="relative z-10 flex items-center gap-1"
                  whileHover={{ x: 2 }}
                  transition={{ duration: 0.2 }}
                >
                  <span className="font-medium">Next</span>
                  <motion.span
                    whileHover={{ x: 1, scale: 1.1 }}
                    transition={{ duration: 0.2 }}
                  >
                    ›
                  </motion.span>
                </motion.div>
                
                {/* Subtle glow effect */}
                <motion.div
                  className="absolute -inset-1 bg-gradient-to-r from-purple-500/20 to-indigo-500/20 rounded-xl blur-sm opacity-0"
                  whileHover={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                />
              </motion.button>
            </motion.div>
          </div>

          <div className="mt-3 grid grid-cols-7 text-xs text-neutral-500 dark:text-neutral-400">
            {WEEKDAYS.map((w) => (
              <div key={w} className="p-2 text-center">{w}</div>
            ))}
          </div>

          <motion.div layout className="grid grid-cols-7 gap-2">
            {cells.map((date, idx) => {
              const isToday = date && sameDay(date, new Date());
              const isSelected = date && sameDay(date, selectedDate);
              const key = date ? `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}` : `b-${idx}`;
              const hasDone = date ? completedDaysSet.has(key) : false;
              return (
                <motion.button
                  key={key}
                  layout
                  className={classNames(
                    "h-20 rounded-xl border flex flex-col items-center justify-center transition-all",
                    date ? "border-neutral-300/50 dark:border-neutral-700/50 bg-neutral-100/40 dark:bg-neutral-900/60 hover:bg-neutral-200/60 dark:hover:bg-neutral-900/80 text-neutral-900 dark:text-neutral-100" : "border-transparent",
                    "disabled:bg-transparent disabled:border-transparent disabled:opacity-40 disabled:shadow-none disabled:cursor-default",
                    isSelected && "ring-2 ring-cyan-400",
                    isToday && "outline outline-1 outline-emerald-400"
                  )}
                  disabled={!date}
                  onClick={() => {
                    if (!date) return;
                    setSelectedDate(date);
                    setShowDayInsights(true);
                  }}
                  whileHover={date ? { scale: 1.02 } : undefined}
                  whileTap={date ? { scale: 0.98 } : undefined}
                >
                  {date ? (
                    <>
                      <div className="text-sm font-medium">{date.getDate()}</div>
                      <div className="text-[10px] text-neutral-500 dark:text-neutral-400">{WEEKDAYS[date.getDay()]}</div>
                      {hasDone && <div className="mt-1 h-1.5 w-1.5 rounded-full bg-emerald-400" />}
                    </>
                  ) : (
                    <span />
                  )}
                </motion.button>
              );
            })}
          </motion.div>

          <motion.div 
            className="mt-3 text-xs text-neutral-600 dark:text-neutral-400"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            Viewing period key: <span className="text-neutral-800 dark:text-neutral-200">{periodKey}</span>
          </motion.div>
        </motion.div>

        {/* Enhanced Frequency Tabs */}
        <motion.div 
          className="mt-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="mb-4">
            <h2 className="text-xl font-bold text-neutral-900 dark:text-neutral-100 mb-2">Habit Frequency Management</h2>
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
                  onClick={() => setActiveFreq(f)}
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
                onClick={() => setShowAddHabit(true)}
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

        {/* Daily Stats Overview */}
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

        {/* Enhanced Habit List */}
        <motion.div 
          className="mt-4 grid gap-3 md:grid-cols-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <AnimatePresence>
            {visibleHabits.length === 0 && (
              <motion.div 
                layout 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                className="col-span-full text-slate-400 text-center py-8"
              >
                No habits for this date/frequency. Add one to get started!
              </motion.div>
            )}
            {visibleHabits.map((h) => {
              const pk = getPeriodKey(h.frequency, selectedDate);
              const done = Boolean(h.completions?.[pk]);
              return (
                <motion.div 
                  key={h.id} 
                  layout 
                  initial={{ opacity: 0, y: 8 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  exit={{ opacity: 0, x: -100 }}
                  whileHover={{ scale: 1.01, y: -2 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                >
                  <motion.div 
                    className="flex items-center justify-between border border-neutral-300/50 dark:border-neutral-700/50 bg-neutral-100/60 dark:bg-neutral-900/60 backdrop-blur-sm rounded-2xl p-4"
                    whileHover={{ 
                      borderColor: "rgba(96, 165, 250, 0.4)",
                      boxShadow: "0 8px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)"
                    }}
                  >
                    <div>
                      <div className="font-semibold flex items-center gap-2 text-neutral-900 dark:text-neutral-100">
                        {h.title}
                        <span
                          className={
                            classNames(
                              "text-[10px] px-2 py-0.5 rounded-full border",
                              h.isRecurring ? "border-emerald-400 text-emerald-600 dark:text-emerald-300" : "border-cyan-400 text-cyan-600 dark:text-cyan-300"
                            )
                          }
                        >
                          {h.isRecurring ? "Recurring" : "Specific"}
                        </span>
                      </div>
                      <div className="text-xs text-neutral-600 dark:text-neutral-400 mt-1">
                        {h.category} • {h.frequency} • {h.xpOnComplete} XP
                        {h.specificDate && !h.isRecurring && (
                          <span className="ml-2 text-neutral-700 dark:text-neutral-300">on {new Date(h.specificDate).toLocaleDateString()}</span>
                        )}
                        {h.bestStreak ? (
                          <span className="ml-2 text-amber-600 dark:text-amber-300">Best streak: {h.bestStreak}</span>
                        ) : null}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <motion.button
                        onClick={() => toggleComplete(h.id, selectedDate)}
                        className={classNames(
                          "px-3 py-2 rounded-xl text-sm border transition-all",
                          done
                            ? "bg-emerald-400 text-black border-emerald-300"
                            : "bg-neutral-200/80 dark:bg-neutral-800 border-neutral-300 dark:border-neutral-700 hover:bg-neutral-300 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300"
                        )}
                        title={done ? "Undo completion" : "Mark complete"}
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                      >
                        {done ? "Completed" : "Complete"}
                      </motion.button>
                      <motion.button
                        onClick={() => deleteHabit(h.id)}
                        className="px-3 py-2 rounded-xl text-sm border bg-red-100/80 dark:bg-red-500/20 border-red-300 dark:border-red-500/40 hover:bg-red-200 dark:hover:bg-red-500/30 text-red-700 dark:text-red-300 transition-colors"
                        title="Delete habit"
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                      >
                        Delete
                      </motion.button>
                    </div>
                  </motion.div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>

        {/* Goal Tracker by Category - Moved below habit list */}
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
                <h2 className="text-xl font-bold text-neutral-900 dark:text-neutral-100">
                  Goal Tracker by Category
                </h2>
                <p className="text-neutral-600 dark:text-neutral-400 text-sm mt-1">
                  Track your XP progress across different life areas for {selectedDate.toLocaleString(undefined, { month: "long" })} - Two Column Layout
                </p>
              </div>
              <motion.button
                onClick={() => setShowAddCategory(true)}
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
                          setGoals((g) => ({ ...g, [c]: { monthlyTargetXP: Number(e.target.value || 0) } }))
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

        {/* Rewards Shop Section */}
        <motion.div 
          className="mt-10"
          data-section="rewards-shop"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          >
          <motion.div 
            className="flex items-center justify-between"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div>
              <h2 className="text-xl font-bold text-neutral-900 dark:text-neutral-100">Rewards Shop</h2>
              <p className="text-neutral-600 dark:text-neutral-400 text-sm mt-1">Spend your points on real-life perks. You earn ~2 pts per XP.</p>
            </div>
            <motion.button
              onClick={() => setShowRewardShop(true)}
              className="
                relative overflow-hidden rounded-3xl px-5 py-2.5
                bg-gradient-to-r from-amber-500 to-orange-600
                backdrop-blur-md
                border border-amber-300/30 dark:border-0 
                text-white font-semibold text-sm
                shadow-xl shadow-amber-500/30 dark:shadow-amber-500/25
                transition-all duration-100
              "
              whileHover={{ 
                scale: 1.05, 
                y: -2,
                boxShadow: "0 20px 25px -5px rgba(245, 158, 11, 0.4), 0 10px 10px -5px rgba(245, 158, 11, 0.2)",
                transition: { duration: 0.2, ease: "easeOut" }
              }}
              whileTap={{ scale: 0.95, y: 0 }}
              >
              {/* Gradient Background Overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 opacity-95"></div>
              
              {/* Floating Gradient Orb */}
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-br from-yellow-400/40 to-amber-400/40 dark:from-yellow-400/30 dark:to-amber-400/30 rounded-full blur-lg"></div>
              
              {/* Content */}
              <div className="relative z-10 flex items-center gap-2">
                <featureIcons.gift className="w-4 h-4 drop-shadow-sm" />
                Open Shop
              </div>
            </motion.button>
          </motion.div>

          <motion.div 
            layout 
            className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, staggerChildren: 0.1 }}
          >
            {shop.map((r, index) => (
              <motion.div
                key={r.id}
                layout
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 + index * 0.1 }}
                className="border border-neutral-300/50 dark:border-neutral-700/50 bg-neutral-100/60 dark:bg-neutral-900/60 backdrop-blur-sm rounded-2xl p-4 flex flex-col gap-2"
                whileHover={{ scale: 1.05, y: -2, transition: { duration: 0.1, ease: "easeOut" } }}
                whileTap={{ scale: 0.95, y: 0 }}
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="font-semibold">{r.name}</div>
                    <div className="text-amber-600 dark:text-amber-400 text-sm font-medium">Cost: {r.cost} pts</div>
                  </div>
                  <motion.button
                    onClick={() => deleteReward(r.id)}
                    className="px-2 py-1 rounded-md text-xs border bg-red-500/20 border-red-500/40 hover:bg-red-500/30"
                    title="Delete reward"
                    whileHover={{ scale: 1.05, y: -1, transition: { duration: 0.1, ease: "easeOut" } }}
                    whileTap={{ scale: 0.95, y: 0 }}
                  >
                    Delete
                  </motion.button>
                </div>
                <motion.button
                  onClick={() => redeemReward(r)}
                  className="mt-2 px-3 py-2 rounded-xl text-sm border bg-emerald-400 text-black border-emerald-300 hover:opacity-90 disabled:opacity-50"
                  disabled={points < r.cost}
                  whileHover={points >= r.cost ? { scale: 1.05, y: -2, transition: { duration: 0.1, ease: "easeOut" } } : {}}
                  whileTap={points >= r.cost ? { scale: 0.95, y: 0 } : {}}
                >
                  {points < r.cost ? "Not enough points" : "Redeem"}
                </motion.button>
              </motion.div>
            ))}
          </motion.div>

          {/* Inventory (collapsible) */}
          {inventory.length > 0 && (
            <motion.details 
              className="mt-6 group"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <motion.summary 
                className="flex items-center justify-between cursor-pointer select-none border border-slate-800 bg-slate-900/60 rounded-xl px-4 py-3"
                whileHover={{ scale: 1.01, backgroundColor: "rgba(15, 23, 42, 0.8)" }}
                whileTap={{ scale: 0.99 }}
              >
                <span className="font-semibold">Your Inventory</span>
                <span className="text-slate-400 text-sm">{inventory.length} item{inventory.length > 1 ? "s" : ""}</span>
              </motion.summary>
              <motion.ul 
                className="mt-3 grid gap-2 md:grid-cols-2 light-scrollbar dark:dark-scrollbar"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                transition={{ duration: 0.3 }}
              >
                {inventory.map((it, idx) => (
                  <motion.li 
                    key={idx} 
                    className="border border-slate-800 bg-slate-900/60 rounded-xl p-3 text-sm"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                    whileHover={{ scale: 1.02, x: 2 }}
                  >
                    {it.name}{" "}
                    <span className="text-slate-400">(redeemed {new Date(it.redeemedAt).toLocaleString()})</span>
                  </motion.li>
                ))}
              </motion.ul>
            </motion.details>
          )}
        </motion.div>

                {/* Tips */}
                <motion.div 
          className="mt-12 border border-slate-800 bg-slate-900/50 rounded-2xl p-5 text-sm text-slate-300"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <b>What's new in v3.2.0:</b>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li>📅 Calendar revamp — Sun–Sat headers for quick scanning, click any date to view & complete habits for that day, and period keys now follow your selected date so daily/monthly resets are crystal-clear.</li>
            <li>🆕 Custom Categories — Add your own categories with personalized XP targets, instantly available in both the goal tracker and Add Habit modal.</li>
            <li>📦 Inventory dropdown — Your redeemed rewards are now tucked neatly into a collapsible list for a cleaner dashboard.</li>
            <li>🔁 Recurring vs Specific habits — Recurring habits repeat every period, while Specific habits only show on their set date/month/year.</li>
            <li>✨ UI polish — Motion-based progress bars, smoother calendar hover/tap micro-interactions, animated layout shifts, and subtle spacing refinements for a more balanced look.</li>
          </ul>
        </motion.div>
      </DynamicContainer>

      {/* Modals */}
      <AnimatePresence>
        {showRewardShop && (
          <motion.div 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowRewardShop(false)}
          />
        )}
        {showRewardShop && (
          <motion.div
            className="fixed inset-0 flex items-center justify-center p-4 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                setShowRewardShop(false);
              }
            }}
          >
            <motion.div
              className="
                relative w-full max-w-4xl max-h-[90vh] overflow-hidden
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
              {/* Shop Header Background */}
              <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 via-orange-500/5 to-red-500/10 dark:from-amber-500/15 dark:via-orange-500/10 dark:to-red-500/15 rounded-3xl"></div>
              
              {/* Floating Gradient Orbs */}
              <div className="absolute -top-4 -left-4 w-24 h-24 bg-gradient-to-br from-amber-400/20 to-orange-400/20 dark:from-amber-400/15 dark:to-orange-400/15 rounded-full blur-2xl"></div>
              <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-gradient-to-br from-orange-400/15 to-red-400/15 dark:from-orange-400/10 dark:to-red-400/10 rounded-full blur-3xl"></div>
              <div className="absolute top-1/3 -right-8 w-20 h-20 bg-gradient-to-br from-yellow-400/10 to-amber-400/10 dark:from-yellow-400/5 dark:to-amber-400/5 rounded-full blur-xl"></div>

              <div className="relative z-10 p-8">
                {/* Shop Header */}
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-4">
                    <motion.div
                      className="p-3 rounded-2xl bg-gradient-to-br from-amber-400/20 to-orange-500/20 dark:from-amber-400/15 dark:to-orange-500/15 border border-amber-200/30 dark:border-transparent"
                      whileHover={{ scale: 1.05, rotate: 5 }}
                      transition={{ duration: 0.2 }}
                    >
                      <featureIcons.gift className="w-6 h-6 text-amber-600 dark:text-amber-400" />
                    </motion.div>
            <div>
                      <h2 className="text-2xl font-bold bg-gradient-to-r from-amber-600 via-orange-600 to-red-600 dark:from-amber-400 dark:via-orange-400 dark:to-red-400 bg-clip-text text-transparent">
                        Rewards Shop
                      </h2>
                      <p className="text-neutral-600 dark:text-neutral-400 text-sm mt-1">
                        Spend your {points} points on real-life perks. You earn ~2 pts per XP.
                      </p>
            </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
            <motion.button
              onClick={() => setShowAddReward(true)}
                      className="
                        relative overflow-hidden rounded-2xl px-4 py-2.5
                        bg-gradient-to-r from-amber-500 to-orange-600
                        backdrop-blur-md
                        border border-amber-300/30 dark:border-0 
                        text-white font-semibold text-sm
                        shadow-lg shadow-amber-500/30 dark:shadow-amber-500/25
                        hover:shadow-xl hover:shadow-amber-500/40
                        transition-all duration-100
                      "
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.95, y: 0 }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-amber-400/20 to-orange-400/20 rounded-2xl"></div>
                      <div className="relative z-10 flex items-center gap-2">
                        <featureIcons.plus className="w-4 h-4" />
                        Add Reward
                      </div>
            </motion.button>
                    
                    <motion.button
                      onClick={() => setShowRewardShop(false)}
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
                      whileTap={{ scale: 0.95, y: 0 }}
                    >
                      <featureIcons.x className="w-4 h-4" />
                    </motion.button>
                  </div>
                </div>

                {/* Rewards Grid */}
                <div className="relative">
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 max-h-96 overflow-y-auto light-scrollbar dark:dark-scrollbar" id="rewards-grid">
                    {shop.length > 0 ? (
                      shop.map((r, index) => (
                        <motion.div
                          key={r.id}
                          layout
                          initial={{ opacity: 0, y: 20, scale: 0.9 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          transition={{ duration: 0.3 + index * 0.1 }}
                          className="
                            border border-neutral-300/50 dark:border-neutral-700/50 
                            bg-white/60 dark:bg-neutral-800/60 
                            backdrop-blur-sm rounded-2xl p-4 flex flex-col gap-3
                            hover:bg-white/80 dark:hover:bg-neutral-700/80
                            transition-all duration-100
                          "
                          whileHover={{ scale: 1.02, y: -2 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1">
                              <div className="font-semibold text-neutral-900 dark:text-neutral-100">{r.name}</div>
                              <div className="text-amber-600 dark:text-amber-400 text-sm font-medium">Cost: {r.cost} pts</div>
                            </div>
                            <motion.button
                              onClick={() => deleteReward(r.id)}
                              className="
                                px-2 py-1 rounded-lg text-xs border 
                                bg-red-500/20 border-red-500/40 
                                hover:bg-red-500/30 text-red-600 dark:text-red-400
                                transition-all duration-100
                              "
                              whileHover={{ scale: 1.05, y: -1 }}
                              whileTap={{ scale: 0.95, y: 0 }}
                              title="Delete reward"
                            >
                              Delete
                            </motion.button>
                          </div>
                          
                          <motion.button
                            onClick={() => redeemReward(r)}
                            className="
                              px-3 py-2 rounded-xl text-sm font-medium border 
                              bg-emerald-400 text-black border-emerald-300 
                              hover:opacity-90 disabled:opacity-50
                              disabled:bg-neutral-300 disabled:text-neutral-500
                              transition-all duration-100
                            "
                            disabled={points < r.cost}
                            whileHover={points >= r.cost ? { scale: 1.05, y: -2 } : {}}
                            whileTap={points >= r.cost ? { scale: 0.95, y: 0 } : {}}
                          >
                            {points < r.cost ? "Not enough points" : "Redeem"}
                          </motion.button>
                        </motion.div>
                      ))
                    ) : (
                      <div className="col-span-full text-center py-12">
                        <motion.div
                          className="inline-flex p-4 rounded-2xl bg-gradient-to-br from-amber-400/10 to-orange-500/10 dark:from-amber-400/5 dark:to-orange-500/5 mb-4"
                          animate={{ scale: [1, 1.05, 1] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        >
                          <featureIcons.gift className="w-8 h-8 text-amber-500 dark:text-amber-400" />
                        </motion.div>
                        <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-2">No Rewards Yet</h3>
                        <p className="text-neutral-600 dark:text-neutral-400 text-sm mb-4">
                          Create your first reward to start motivating yourself!
                        </p>
                        <motion.button
                          onClick={() => setShowAddReward(true)}
                          className="
                            px-4 py-2 rounded-xl text-sm font-medium
                            bg-gradient-to-r from-amber-500 to-orange-600
                            text-white shadow-lg shadow-amber-500/30
                            hover:shadow-xl hover:shadow-amber-500/40
                            transition-all duration-100
                          "
                          whileHover={{ scale: 1.05, y: -2 }}
                          whileTap={{ scale: 0.95, y: 0 }}
                        >
                          Add Your First Reward
                        </motion.button>
                      </div>
                    )}
                  </div>
                  
                  {/* Scroll to Top Button */}
                  {shop.length > 6 && (
                    <motion.button
                      onClick={() => {
                        const grid = document.getElementById('rewards-grid');
                        if (grid) {
                          grid.scrollTo({ top: 0, behavior: 'smooth' });
                        }
                      }}
                      className="
                        absolute bottom-4 right-4 p-2 rounded-full
                        bg-amber-500/90 hover:bg-amber-600/90
                        text-white shadow-lg
                        transition-all duration-100
                        backdrop-blur-sm
                      "
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.5 }}
                    >
                      <featureIcons.chevronUp className="w-4 h-4" />
                    </motion.button>
                  )}
                </div>

                {/* Inventory Section */}
          {inventory.length > 0 && (
                  <motion.div
                    className="mt-8 pt-6 border-t border-neutral-200/50 dark:border-neutral-700/50"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-4 flex items-center gap-2">
                      <featureIcons.trophy className="w-5 h-5 text-amber-500 dark:text-amber-400" />
                      Your Inventory ({inventory.length})
                    </h3>
                    <div className="grid gap-2 max-h-32 overflow-y-auto light-scrollbar dark:dark-scrollbar">
                {inventory.map((it, idx) => (
                        <motion.div
                    key={idx} 
                          className="
                            border border-amber-200/50 dark:border-amber-800/50 
                            bg-amber-50/50 dark:bg-amber-900/20 
                            rounded-xl p-3 text-sm
                            hover:bg-amber-100/50 dark:hover:bg-amber-900/30
                            transition-all duration-100
                          "
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3 }}
                    whileHover={{ scale: 1.02, x: 2 }}
                  >
                          <div className="font-medium text-amber-800 dark:text-amber-200">{it.name}</div>
                          <div className="text-amber-600 dark:text-amber-400 text-xs">
                            Redeemed {new Date(it.redeemedAt).toLocaleString()}
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </div>
        </motion.div>
          </motion.div>
        )}
        {showDayInsights && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowDayInsights(false)}
            />
            <motion.div 
              className="fixed inset-0 flex items-center justify-center p-4 z-50"
              onClick={() => setShowDayInsights(false)}
            >
              <motion.div
                className="
                  w-full max-w-2xl rounded-3xl p-8 
                  bg-white/95 dark:bg-neutral-900/60
                  backdrop-blur-md
                  border border-neutral-200/50 dark:border-0
                  shadow-xl
                  relative overflow-hidden
                "
                initial={{ opacity: 0, scale: 0.9, y: 50 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 50 }}
                transition={{ duration: 0.4, type: "spring", stiffness: 300, damping: 25 }}
                onClick={(e) => e.stopPropagation()}
                style={{
                  background: `linear-gradient(135deg, 
                    rgba(255, 255, 255, 0.95) 0%, 
                    rgba(248, 250, 252, 0.9) 50%, 
                    rgba(241, 245, 249, 0.85) 100%)`,
                  ...(document.documentElement.classList.contains('dark') && {
                    background: `linear-gradient(135deg, 
                      rgba(15, 23, 42, 0.6) 0%, 
                      rgba(30, 41, 59, 0.65) 50%, 
                      rgba(51, 65, 85, 0.7) 100%)`
                  })
                }}
              >
              {/* Academic Quest Gradient Background */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/8 via-purple-500/6 to-cyan-500/8 dark:from-blue-500/12 dark:via-purple-500/10 dark:to-cyan-500/12 rounded-3xl opacity-60"></div>
              
              {/* Floating Gradient Orbs */}
        <motion.div 
                className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-blue-400/30 to-purple-400/30 dark:from-blue-400/20 dark:to-purple-400/20 rounded-full blur-2xl"
                animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              />
              <motion.div 
                className="absolute -bottom-4 -left-4 w-20 h-20 bg-gradient-to-br from-cyan-400/30 to-emerald-400/30 dark:from-cyan-400/20 dark:to-emerald-400/20 rounded-full blur-2xl"
                animate={{ scale: [1, 1.15, 1], opacity: [0.3, 0.6, 0.3] }}
                transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
              />
              <motion.div 
                className="absolute top-1/3 -right-8 w-16 h-16 bg-gradient-to-br from-purple-400/25 to-indigo-400/25 dark:from-purple-400/15 dark:to-indigo-400/15 rounded-full blur-xl"
                animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.4, 0.2] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              />

              <div className="relative z-10">
                {/* Enhanced Header */}
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center gap-4">
                    {/* Animated Icon Container */}
                    <motion.div
                      className="flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500/20 to-purple-600/20 dark:from-blue-500/15 dark:to-purple-600/15 border border-blue-200/30 dark:border-transparent backdrop-blur-sm"
                      initial={{ scale: 0.8, rotate: -10 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ duration: 0.5, type: "spring", stiffness: 300 }}
                    >
                      <motion.div
                        animate={{ rotate: [0, 5, -5, 0] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        <featureIcons.barChart className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                      </motion.div>
                    </motion.div>
                    
                    <div>
                      <motion.h3 
                        className="text-2xl font-bold bg-gradient-to-r from-blue-700 to-purple-700 dark:from-blue-600 dark:to-purple-600 bg-clip-text text-transparent"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5 }}
                      >
                        Day Insights
                      </motion.h3>
                      <motion.div 
                        className="text-sm text-neutral-700 dark:text-neutral-400"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5 }}
                      >
                        {selectedDate.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
                      </motion.div>
                    </div>
                  </div>
                  
                  {/* Enhanced Close Button */}
                  <motion.button
                    className="
                      relative px-4 py-2 rounded-xl border overflow-hidden
                      bg-white/60 dark:bg-neutral-800/60 
                      border-neutral-300/50 dark:border-neutral-600/50
                      hover:bg-white/80 dark:hover:bg-neutral-700/80 
                      hover:border-red-400/40 dark:hover:border-red-500/40
                      text-neutral-700 dark:text-neutral-300 
                      transition-all duration-100
                      backdrop-blur-sm
                    "
                    onClick={() => setShowDayInsights(false)}
                    whileHover={{ 
                      scale: 1.05, 
                      y: -2,
                      boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)"
                    }}
                    whileTap={{ scale: 0.95 }}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    {/* Background gradient on hover */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-red-500/10 to-rose-500/10 rounded-xl opacity-0"
                      whileHover={{ opacity: 1 }}
                      transition={{ duration: 0.2 }}
                    />
                    <span className="relative z-10 font-medium">Close</span>
                  </motion.button>
                </div>

                {/* Enhanced Stats Cards */}
                <motion.div 
                  className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2, staggerChildren: 0.1 }}
                >
                  <motion.div 
                    className="
                      bg-white/70 dark:bg-neutral-800/70 
                      backdrop-blur-sm
                      border border-neutral-200/50 dark:border-neutral-700/40
                      rounded-2xl p-4 text-center
                      shadow-md shadow-black/5 dark:shadow-black/15
                      relative overflow-hidden
                    "
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3}}
                    whileHover={{ scale: 1.05, y: -2 }}
                  >
                    {/* Emerald Theme Background */}
                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/8 to-green-500/8 dark:from-emerald-500/10 dark:to-green-500/10 rounded-2xl"></div>
                    
                    {/* Icon */}
                    <div className="relative z-10 mb-2">
                      <div className="inline-flex p-2 rounded-xl bg-gradient-to-br from-emerald-400/20 to-green-500/20 dark:from-emerald-400/15 dark:to-green-500/15">
                        <featureIcons.checkCircle className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />
                      </div>
                    </div>
                    
                    <div className="relative z-10 text-2xl font-bold bg-gradient-to-r from-emerald-600 to-green-700 dark:from-emerald-500 dark:to-green-600 bg-clip-text text-transparent mb-1">
                      {dayInsights.completedCount}
                    </div>
                    <div className="relative z-10 text-xs font-medium text-neutral-700 dark:text-neutral-400">Completed</div>
        </motion.div>

                  <motion.div 
                    className="
                      bg-white/70 dark:bg-neutral-800/70 
                      backdrop-blur-sm
                      border border-neutral-200/50 dark:border-neutral-700/40
                      rounded-2xl p-4 text-center
                      shadow-md shadow-black/5 dark:shadow-black/15
                      relative overflow-hidden
                    "
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3}}
                    whileHover={{ scale: 1.05, y: -2 }}
                  >
                    {/* Blue Theme Background */}
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/8 to-cyan-500/8 dark:from-blue-500/10 dark:to-cyan-500/10 rounded-2xl"></div>
                    
                    {/* Icon */}
                    <div className="relative z-10 mb-2">
                      <div className="inline-flex p-2 rounded-xl bg-gradient-to-br from-blue-400/20 to-cyan-500/20 dark:from-blue-400/15 dark:to-cyan-500/15">
                        <featureIcons.calendar className="w-4 h-4 text-blue-500 dark:text-blue-400" />
                      </div>
                    </div>
                    
                    <div className="relative z-10 text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-700 dark:from-blue-500 dark:to-cyan-600 bg-clip-text text-transparent mb-1">
                      {dayInsights.totalCount}
                    </div>
                    <div className="relative z-10 text-xs font-medium text-neutral-700 dark:text-neutral-400">Total Tasks</div>
                  </motion.div>

                  <motion.div 
                    className="
                      bg-white/70 dark:bg-neutral-800/70 
                      backdrop-blur-sm
                      border border-neutral-200/50 dark:border-neutral-700/40
                      rounded-2xl p-4 text-center
                      shadow-md shadow-black/5 dark:shadow-black/15
                      relative overflow-hidden
                    "
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                    whileHover={{ scale: 1.05, y: -2 }}
                  >
                    {/* Purple Theme Background */}
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-500/8 to-violet-500/8 dark:from-purple-500/10 dark:to-violet-500/10 rounded-2xl"></div>
                    
                    {/* Icon */}
                    <div className="relative z-10 mb-2">
                      <div className="inline-flex p-2 rounded-xl bg-gradient-to-br from-purple-400/20 to-violet-500/20 dark:from-purple-400/15 dark:to-violet-500/15">
                        <featureIcons.trending className="w-4 h-4 text-purple-500 dark:text-purple-400" />
                      </div>
                    </div>
                    
                    <div className="relative z-10 text-2xl font-bold bg-gradient-to-r from-purple-600 to-violet-700 dark:from-purple-500 dark:to-violet-600 bg-clip-text text-transparent mb-1">
                      {dayInsights.completionRate}%
                    </div>
                    <div className="relative z-10 text-xs font-medium text-neutral-700 dark:text-neutral-400">Completion Rate</div>
                  </motion.div>

                  <motion.div 
                    className="
                      bg-white/70 dark:bg-neutral-800/70 
                      backdrop-blur-sm
                      border border-neutral-200/50 dark:border-neutral-700/40
                      rounded-2xl p-4 text-center
                      shadow-md shadow-black/5 dark:shadow-black/15
                      relative overflow-hidden
                    "
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                    whileHover={{ scale: 1.05, y: -2 }}
                  >
                    {/* Amber Theme Background */}
                    <div className="absolute inset-0 bg-gradient-to-br from-amber-500/8 to-orange-500/8 dark:from-amber-500/10 dark:to-orange-500/10 rounded-2xl"></div>
                    
                    {/* Icon */}
                    <div className="relative z-10 mb-2">
                      <div className="inline-flex p-2 rounded-xl bg-gradient-to-br from-amber-400/20 to-orange-500/20 dark:from-amber-400/15 dark:to-orange-500/15">
                        <featureIcons.zap className="w-4 h-4 text-amber-500 dark:text-amber-400" />
                      </div>
                    </div>
                    
                    <div className="relative z-10 text-2xl font-bold bg-gradient-to-r from-amber-600 to-orange-700 dark:from-amber-500 dark:to-orange-600 bg-clip-text text-transparent mb-1">
                      {dayInsights.xpEarned}
                    </div>
                    <div className="relative z-10 text-xs font-medium text-neutral-700 dark:text-neutral-400">XP Earned</div>
                  </motion.div>
                </motion.div>

                {/* Enhanced Habit List */}
                <motion.div 
                  className="space-y-3 max-h-[50vh] overflow-y-auto pr-2 light-scrollbar dark:dark-scrollbar"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  {dayInsights.habitsForDay.length === 0 ? (
                    <motion.div 
                      className="
                        text-center py-8
                        bg-white/60 dark:bg-neutral-800/60 
                        backdrop-blur-sm
                        border border-neutral-200/50 dark:border-neutral-700/40
                        rounded-2xl
                      "
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="text-neutral-500 dark:text-neutral-400 text-sm">No habits scheduled for this day.</div>
                    </motion.div>
                  ) : (
                    dayInsights.habitsForDay.map((h, index) => {
                      const pk = getPeriodKey(h.frequency, selectedDate);
                      const done = Boolean(h.completions?.[pk]);
                      return (
                        <motion.div 
                          key={h.id} 
                          className="
                            flex items-center justify-between 
                            bg-white/70 dark:bg-neutral-800/70 
                            backdrop-blur-sm
                            border border-neutral-200/50 dark:border-neutral-700/40
                            rounded-2xl p-4
                            shadow-sm shadow-black/5 dark:shadow-black/10
                            relative overflow-hidden
                          "
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3 + index * 0.1 }}
                          whileHover={{ scale: 1.02, y: -1 }}
                        >
                          {/* Subtle background gradient */}
                          <div className="absolute inset-0 bg-gradient-to-r from-neutral-500/5 to-transparent dark:from-neutral-400/5 dark:to-transparent rounded-2xl"></div>
                          
                          <div className="relative z-10">
                            <div className="font-semibold text-neutral-900 dark:text-neutral-100 mb-1">{h.title}</div>
                            <div className="text-xs text-neutral-600 dark:text-neutral-400 flex items-center gap-2">
                              <span className="px-2 py-1 bg-neutral-200/60 dark:bg-neutral-700/60 rounded-lg">{h.category}</span>
                              <span>•</span>
                              <span className="capitalize">{h.frequency}</span>
                              <span>•</span>
                              <span className="text-amber-600 dark:text-amber-400 font-medium">{h.xpOnComplete} XP</span>
                            </div>
                          </div>
                          
                          <motion.button
                            onClick={() => toggleComplete(h.id, selectedDate)}
                            className={classNames(
                              "relative px-4 py-2 rounded-xl text-sm font-medium border transition-all duration-100 overflow-hidden",
                              done
                                ? "bg-gradient-to-r from-emerald-500 to-green-600 text-white border-emerald-400/50 shadow-lg shadow-emerald-500/30"
                                : "bg-white/60 dark:bg-neutral-700/60 border-neutral-300/50 dark:border-neutral-600/50 hover:bg-white/80 dark:hover:bg-neutral-600/80 text-neutral-700 dark:text-neutral-300 hover:border-emerald-400/40"
                            )}
                            title={done ? "Undo completion" : "Mark complete"}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            {/* Button gradient effect */}
                            {!done && (
                              <motion.div
                                className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-green-500/10 rounded-xl opacity-0"
                                whileHover={{ opacity: 1 }}
                                transition={{ duration: 0.2 }}
                              />
                            )}
                            <span className="relative z-10">
                              {done ? "Completed" : "Complete"}
                            </span>
                          </motion.button>
                        </motion.div>
                      );
                    })
                  )}
                </motion.div>
              </div>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {showAddHabit && (
          <AddHabitModal
            onClose={() => setShowAddHabit(false)}
            onSave={(h) => {
              addHabit(h);
              setShowAddHabit(false);
            }}
            categories={categories}
          />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {showAddReward && (
          <AddRewardModal
            onClose={() => setShowAddReward(false)}
            onSave={(payload) => {
              addReward(payload.name, payload.cost);
              setShowAddReward(false);
            }}
          />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {showAddCategory && (
          <AddCategoryModal
            onClose={() => setShowAddCategory(false)}
            onSave={({ name, target }) => {
              addCategory(name, target);
              setShowAddCategory(false);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
