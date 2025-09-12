// ---------------------------------------------------------------------
// Imports
// ---------------------------------------------------------------------
import React, { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Import extracted modules
import { 
  getPeriodKey, 
  startOfMonth, 
  endOfMonth
} from "./utils";
import { generateHabitKey } from "./utils/keyUtils";
import { featureIcons, categoryIcons } from "./utils/icons";
import type { Frequency, Habit } from "./types";
import { useSoundEffects } from './hooks/useSoundEffects';

// Import extracted components
import { AddHabitModal, AddRewardModal, AddCategoryModal } from "./components/modals";
import { useHabitManagement } from "./hooks/business";
import { useAppState } from "./hooks/useAppState";

// Import new enhanced components
import { DynamicContainer } from "./components/layout";
import { AppBackground } from "./components/layout/AppBackground";
import { ModalSystem } from "./components/modals/ModalSystem";

// Phase 1: Core UI Components
import { AppHeader } from "./components/header";
import { CalendarSection } from "./components/calendar";
import { FrequencyTabs } from "./components/frequency";
import { HabitListSection } from "./components/habits";

// Phase 2: Feature Components
import { DailyStatsOverview } from "./components/stats";
import { GoalTracker } from "./components/goals";
import { RewardsShop } from "./components/rewards";
import { NotificationSystem } from "./components/notifications";

// Phase 3: Modal Components
import { RewardShopModal, DayInsightsModal, AnalyticsModal, SettingsModal } from "./components/modals";

// TODO: Replace inline components with extracted ones:
// import { StatsPanel } from "./components/stats";
// import { CalendarView } from "./components/calendar"; 
// import { HabitList } from "./components/habits";
// import { SoundButton } from "./components/ui";

// ---------------------------------------------------------------------
// Component Logic Starts Here
// ---------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------
export default function HabitGoalTrackerV3() {
  // Use the extracted app state hook
  const {
    // Business data
    habits,
    points,
    totalXP,
    goals,
    shop,
    inventory,
    categories,
    level,
    overallStreak,

  // UI state
    activeFreq,
    selectedDate,
    showDayInsights,
    showRewardShop,
    activeSettings,
    activeAnalytics,
    
    // Notification state
    showLevelUp,
    showPurchaseSuccess,
    showHabitComplete,
    lastCompletedHabit,
    notificationMessage,
    
    // Audio state
    audioEnabled,
    backgroundMusicEnabled,
    soundEffectsVolume,
    backgroundMusicVolume,
    
    // Sound effects
    playButtonClick,
    playLevelUp,
    playTaskComplete,
    playCoins,
    playBackgroundMusic,
    stopBackgroundMusic,
    
    // Computed values
    periodKey,
    categoryXP,
    visibleHabits,
    habitStats,
    dayInsights,
    completedDaysSet,
    cells,
    
    // Actions
    setActiveFreq,
    setSelectedDate,
    setShowDayInsights,
    setShowRewardShop,
    setActiveSettings,
    setActiveAnalytics,
    setShowLevelUp,
    setShowPurchaseSuccess,
    setShowHabitComplete,
    setLastCompletedHabit,
    setNotificationMessage,
    setAudioEnabled,
    setBackgroundMusicEnabled,
    setSoundEffectsVolume,
    setBackgroundMusicVolume,
    setGoals,
    handleHabitComplete,
    handleRedeemReward,
    deleteHabit,
    deleteReward,
    getPeriodKeyWrapper,
    
    // Temporary implementations for modal state setters
    setShowAddHabit,
    setShowAddReward,
    setShowAddCategory
  } = useAppState();

  // -------------------------------------------------------------------
  // Render (header, calendar, tabs, and habit list)
  // -------------------------------------------------------------------
  return (
    <AppBackground>
        {/* Enhanced Header with Dynamic Layout */}
        <AppHeader
          totalXP={totalXP}
          level={level}
          habitStats={habitStats}
          overallStreak={overallStreak}
          points={points}
          activeSettings={activeSettings}
          activeAnalytics={activeAnalytics}
          onSettingsToggle={() => setActiveSettings(!activeSettings)}
          onAnalyticsToggle={() => setActiveAnalytics(!activeAnalytics)}
          onRewardShopClick={() => setShowRewardShop(true)}
        />
        {/* Calendar */}
        <CalendarSection
          selectedDate={selectedDate}
          completedDaysSet={completedDaysSet}
          periodKey={periodKey}
          onDateSelect={(date) => setSelectedDate(date)}
          onDayInsights={() => setShowDayInsights(true)}
          onPrevMonth={() => setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth() - 1, 1))}
          onNextMonth={() => setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 1))}
          onToday={() => setSelectedDate(new Date())}
        />

        {/* Enhanced Frequency Tabs */}
        <FrequencyTabs
          activeFreq={activeFreq}
          onFrequencyChange={(freq) => setActiveFreq(freq)}
          onAddHabit={() => setShowAddHabit(true)}
        />

        {/* Daily Stats Overview */}
        <DailyStatsOverview
          habitStats={habitStats}
          activeFreq={activeFreq}
        />

        {/* Enhanced Habit List */}
        <HabitListSection
          visibleHabits={visibleHabits}
          selectedDate={selectedDate}
          activeFreq={activeFreq}
          onHabitComplete={handleHabitComplete}
          onHabitDelete={deleteHabit}
          getPeriodKey={getPeriodKeyWrapper}
        />

        {/* Goal Tracker by Category - Moved below habit list */}
        <GoalTracker
          categories={categories}
          categoryXP={categoryXP}
          goals={goals}
          selectedDate={selectedDate}
          onAddCategory={() => setShowAddCategory(true)}
          onSetGoals={(newGoals) => setGoals(newGoals)}
        />
        
        {/* Rewards Shop Section */}
        <RewardsShop
          shop={shop}
          inventory={inventory}
          points={points}
          onOpenShop={() => setShowRewardShop(true)}
          onDeleteReward={deleteReward}
          onRedeemReward={handleRedeemReward}
        />

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

      {/* Modal System */}
      <ModalSystem
        showRewardShop={showRewardShop}
        showDayInsights={showDayInsights}
        activeAnalytics={activeAnalytics}
        activeSettings={activeSettings}
        onCloseRewardShop={() => setShowRewardShop(false)}
        onCloseDayInsights={() => setShowDayInsights(false)}
        onCloseAnalytics={() => setActiveAnalytics(false)}
        onCloseSettings={() => setActiveSettings(false)}
        shop={shop}
        inventory={inventory}
        points={points}
        onDeleteReward={deleteReward}
        onRedeemReward={handleRedeemReward}
        onAddReward={() => setShowAddReward(true)}
        selectedDate={selectedDate}
        dayInsights={dayInsights}
        onHabitComplete={handleHabitComplete}
        getPeriodKey={getPeriodKeyWrapper}
        habits={habits}
        categories={categories}
        habitStats={habitStats}
        totalXP={totalXP}
                  level={level}
        playButtonClick={playButtonClick}
      />
      {/* Add Modals */}
      <AnimatePresence>
        {showAddHabit && (
          <AddHabitModal
            onClose={() => setShowAddHabit(false)}
            onSave={(h: any) => {
              // addHabit(h); // TODO: Implement when addHabit is available
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
            onSave={(payload: any) => {
              // addReward(payload.name, payload.cost); // TODO: Implement when addReward is available
              setShowAddReward(false);
            }}
          />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {showAddCategory && (
          <AddCategoryModal
            onClose={() => setShowAddCategory(false)}
            onSave={({ name, target }: any) => {
              // addCategory(name, target); // TODO: Implement when addCategory is available
              setShowAddCategory(false);
            }}
          />
        )}
      </AnimatePresence>

        {/* Settings Panel */}
        <SettingsModal
          isOpen={activeSettings}
          onClose={() => setActiveSettings(false)}
          audioEnabled={audioEnabled}
          backgroundMusicEnabled={backgroundMusicEnabled}
          soundEffectsVolume={soundEffectsVolume}
          backgroundMusicVolume={backgroundMusicVolume}
          onAudioEnabledChange={setAudioEnabled}
          onBackgroundMusicEnabledChange={setBackgroundMusicEnabled}
          onSoundEffectsVolumeChange={setSoundEffectsVolume}
          onBackgroundMusicVolumeChange={setBackgroundMusicVolume}
          playButtonClick={playButtonClick}
        />

        {/* Notification System */}
        <NotificationSystem
          showLevelUp={showLevelUp}
          showPurchaseSuccess={showPurchaseSuccess}
          showHabitComplete={showHabitComplete}
          notificationMessage={notificationMessage}
          lastCompletedHabit={lastCompletedHabit || ''}
        />
    </AppBackground>
  );
}
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
                      onClick={() => setActiveAnalytics(false)}
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
          )}
        </AnimatePresence>

        {/* Settings Panel */}
        <SettingsModal
          isOpen={activeSettings}
          onClose={() => setActiveSettings(false)}
          audioEnabled={audioEnabled}
          setAudioEnabled={setAudioEnabled}
          soundEffectsVolume={soundEffectsVolume}
          setSoundEffectsVolume={setSoundEffectsVolume}
          backgroundMusicEnabled={backgroundMusicEnabled}
          setBackgroundMusicEnabled={setBackgroundMusicEnabled}
          backgroundMusicVolume={backgroundMusicVolume}
          setBackgroundMusicVolume={setBackgroundMusicVolume}
        />
          <AnimatePresence>
          {false && (
              <motion.div 
              className="fixed inset-0 flex items-center justify-center p-4 z-50"
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              onClick={(e) => {
                if (e.target === e.currentTarget) {
                  setActiveSettings(false);
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
                {/* Settings Header Background */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-cyan-500/5 to-indigo-500/10 dark:from-blue-500/15 dark:via-cyan-500/10 dark:to-indigo-500/15 rounded-3xl"></div>
                
                {/* Floating Gradient Orbs */}
                <div className="absolute -top-4 -left-4 w-24 h-24 bg-gradient-to-br from-blue-400/20 to-cyan-400/20 dark:from-blue-400/15 dark:to-cyan-400/15 rounded-full blur-2xl"></div>
                <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-gradient-to-br from-indigo-400/15 to-purple-400/15 dark:from-indigo-400/10 dark:to-purple-400/10 rounded-full blur-3xl"></div>
                <div className="absolute top-1/3 -right-8 w-20 h-20 bg-gradient-to-br from-cyan-400/10 to-blue-400/10 dark:from-cyan-400/5 dark:to-blue-400/5 rounded-full blur-xl"></div>

                <div className="relative z-10 p-8">
                  {/* Settings Header */}
                  <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                  <motion.div 
                        className="p-3 rounded-2xl bg-gradient-to-br from-blue-400/20 to-cyan-500/20 dark:from-blue-400/15 dark:to-cyan-500/15 border border-blue-200/30 dark:border-transparent"
                        whileHover={{ scale: 1.05, rotate: 5 }}
                        transition={{ duration: 0.2 }}
                      >
                        <featureIcons.settings className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                      </motion.div>
                    <div>
                        <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 via-cyan-600 to-indigo-600 dark:from-blue-400 dark:via-cyan-400 dark:to-indigo-400 bg-clip-text text-transparent">
                          Settings
                        </h2>
                        <p className="text-neutral-600 dark:text-neutral-400 text-sm mt-1">
                          Customize your HabitQuest experience
                        </p>
                      </div>
                      </div>
                    
                      <motion.button
                      onClick={() => setActiveSettings(false)}
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

                  {/* Settings Content */}
                  <div className="grid gap-6 max-h-[70vh] overflow-y-auto light-scrollbar dark:dark-scrollbar">
                    {/* Audio Settings */}
        <motion.div 
                      className="bg-white/60 dark:bg-neutral-800/60 backdrop-blur-sm rounded-2xl p-6 border border-neutral-200/50 dark:border-neutral-700/50"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-4 flex items-center gap-2">
                        <featureIcons.volume2 className="w-5 h-5 text-blue-500 dark:text-blue-400" />
                        Audio Settings
                      </h3>
                      <div className="space-y-4">
                        {/* Sound Effects */}
                        <div className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-neutral-50/50 to-neutral-100/50 dark:from-neutral-800/50 dark:to-neutral-700/50 border border-neutral-200/30 dark:border-neutral-600/30">
                          <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-green-500/10 dark:bg-green-500/20">
                              <featureIcons.volume2 className="w-4 h-4 text-green-600 dark:text-green-400" />
                            </div>
                            <div>
                              <div className="font-medium text-neutral-900 dark:text-neutral-100 text-sm">Sound Effects</div>
                              <div className="text-xs text-neutral-600 dark:text-neutral-400">Enable completion sounds and notifications</div>
                            </div>
                          </div>
                          <motion.button
                            onClick={() => {
                              setAudioEnabled(!audioEnabled);
                              playButtonClick();
                            }}
                            className={`
                              relative w-12 h-6 rounded-full
                              ${audioEnabled 
                                ? 'bg-gradient-to-r from-green-500 to-emerald-500 shadow-lg shadow-green-500/30' 
                                : 'bg-neutral-300 dark:bg-neutral-600'
                              }
                              transition-all duration-200
                            `}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <motion.div
                              className="absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-md"
                              initial={{ x: audioEnabled ? 24 : 2 }}
                              animate={{ x: audioEnabled ? 24 : 2 }}
                              transition={{ duration: 0.2 }}
                            />
                          </motion.button>
                        </div>

                        {/* Sound Effects Volume */}
                        <div className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-neutral-50/50 to-neutral-100/50 dark:from-neutral-800/50 dark:to-neutral-700/50 border border-neutral-200/30 dark:border-neutral-600/30">
                          <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-blue-500/10 dark:bg-blue-500/20">
                              <featureIcons.volume1 className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                            </div>
              <div>
                              <div className="font-medium text-neutral-900 dark:text-neutral-100 text-sm">Sound Effects Volume</div>
                              <div className="text-xs text-neutral-600 dark:text-neutral-400">Adjust the volume of sound effects</div>
                            </div>
                          </div>
                          <div className="w-32">
                            <input
                              type="range"
                              min="0"
                              max="1"
                              step="0.1"
                              value={soundEffectsVolume}
                              onChange={(e) => setSoundEffectsVolume(parseFloat(e.target.value))}
                              className="w-full h-2 bg-neutral-200 dark:bg-neutral-700 rounded-full appearance-none cursor-pointer slider"
                              style={{
                                background: `linear-gradient(to right, #3b82f6 0%, #06b6d4 ${soundEffectsVolume * 100}%, #e5e7eb ${soundEffectsVolume * 100}%, #e5e7eb 100%)`
                              }}
                            />
                          </div>
                        </div>

                        {/* Background Music */}
                        <div className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-neutral-50/50 to-neutral-100/50 dark:from-neutral-800/50 dark:to-neutral-700/50 border border-neutral-200/30 dark:border-neutral-600/30">
                          <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-purple-500/10 dark:bg-purple-500/20">
                              <featureIcons.music className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                            </div>
                            <div>
                              <div className="font-medium text-neutral-900 dark:text-neutral-100 text-sm">Background Music</div>
                              <div className="text-xs text-neutral-600 dark:text-neutral-400">Enable ambient background music</div>
                            </div>
              </div>
              <motion.button
                            onClick={() => {
                              setBackgroundMusicEnabled(!backgroundMusicEnabled);
                              playButtonClick();
                            }}
                            className={`
                              relative w-12 h-6 rounded-full
                              ${backgroundMusicEnabled 
                                ? 'bg-gradient-to-r from-purple-500 to-violet-500 shadow-lg shadow-purple-500/30' 
                                : 'bg-neutral-300 dark:bg-neutral-600'
                              }
                              transition-all duration-200
                            `}
                            whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                          >
                            <motion.div
                              className="absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-md"
                              initial={{ x: backgroundMusicEnabled ? 24 : 2 }}
                              animate={{ x: backgroundMusicEnabled ? 24 : 2 }}
                              transition={{ duration: 0.2 }}
                            />
              </motion.button>
                        </div>

                        {/* Background Music Volume */}
                        <div className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-neutral-50/50 to-neutral-100/50 dark:from-neutral-800/50 dark:to-neutral-700/50 border border-neutral-200/30 dark:border-neutral-600/30">
                          <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-purple-500/10 dark:bg-purple-500/20">
                              <featureIcons.volume1 className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                            </div>
                            <div>
                              <div className="font-medium text-neutral-900 dark:text-neutral-100 text-sm">Background Music Volume</div>
                              <div className="text-xs text-neutral-600 dark:text-neutral-400">Adjust the volume of background music</div>
                            </div>
                          </div>
                          <div className="w-32">
                            <input
                              type="range"
                              min="0"
                              max="1"
                              step="0.1"
                              value={backgroundMusicVolume}
                              onChange={(e) => setBackgroundMusicVolume(parseFloat(e.target.value))}
                              className="w-full h-2 bg-neutral-200 dark:bg-neutral-700 rounded-full appearance-none cursor-pointer slider"
                              style={{
                                background: `linear-gradient(to right, #a855f7 0%, #ec4899 ${backgroundMusicVolume * 100}%, #e5e7eb ${backgroundMusicVolume * 100}%, #e5e7eb 100%)`
                              }}
                            />
                          </div>
                        </div>
            </div>
          </motion.div>

                    {/* Appearance Settings */}
            <motion.div 
                      className="bg-white/60 dark:bg-neutral-800/60 backdrop-blur-sm rounded-2xl p-6 border border-neutral-200/50 dark:border-neutral-700/50"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: 0.1 }}
                    >
                      <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-4 flex items-center gap-2">
                        <featureIcons.palette className="w-5 h-5 text-purple-500 dark:text-purple-400" />
                        Appearance
                      </h3>
                      <div className="space-y-4">
                        {/* Theme Selection */}
                        <div className="p-4 rounded-xl bg-gradient-to-r from-neutral-50/50 to-neutral-100/50 dark:from-neutral-800/50 dark:to-neutral-700/50 border border-neutral-200/30 dark:border-neutral-600/30">
                          <div className="font-medium text-neutral-900 dark:text-neutral-100 text-sm mb-3">Theme</div>
                          <div className="grid grid-cols-3 gap-2">
                            {[
                              { key: 'light', label: 'Light', icon: featureIcons.sun },
                              { key: 'dark', label: 'Dark', icon: featureIcons.moon },
                              { key: 'system', label: 'System', icon: featureIcons.monitor }
                            ].map((theme) => (
                              <motion.button
                                key={theme.key}
                                className={`
                                  flex items-center justify-center gap-2 p-3 rounded-xl
                                  ${theme.key === 'system' 
                                    ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg shadow-blue-500/30' 
                                    : 'bg-white/60 dark:bg-neutral-700/60 text-neutral-700 dark:text-neutral-300 hover:bg-white/80 dark:hover:bg-neutral-600/80'
                                  }
                                  border border-neutral-200/30 dark:border-neutral-600/30
                                  transition-all duration-200
                                `}
                                whileHover={{ scale: 1.02, y: -1 }}
                      whileTap={{ scale: 0.98 }}
                    >
                                <theme.icon className="w-4 h-4" />
                                <span className="text-sm font-medium">{theme.label}</span>
                              </motion.button>
                            ))}
                    </div>
                    </div>

                        {/* Accent Color */}
                        <div className="p-4 rounded-xl bg-gradient-to-r from-neutral-50/50 to-neutral-100/50 dark:from-neutral-800/50 dark:to-neutral-700/50 border border-neutral-200/30 dark:border-neutral-600/30">
                          <div className="font-medium text-neutral-900 dark:text-neutral-100 text-sm mb-3">Accent Color</div>
                          <div className="grid grid-cols-6 gap-2">
                            {[
                              { color: 'blue', class: 'bg-blue-500' },
                              { color: 'emerald', class: 'bg-emerald-500' },
                              { color: 'purple', class: 'bg-purple-500' },
                              { color: 'amber', class: 'bg-amber-500' },
                              { color: 'rose', class: 'bg-rose-500' },
                              { color: 'cyan', class: 'bg-cyan-500' }
                            ].map((accent) => (
                              <motion.button
                                key={accent.color}
                                className={`
                                  w-8 h-8 rounded-full ${accent.class}
                                  ${accent.color === 'blue' ? 'ring-2 ring-blue-300 dark:ring-blue-400' : ''}
                                  shadow-lg transition-all duration-200
                                `}
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                              />
                            ))}
                    </div>
                  </div>
          </div>
        </motion.div>
        
                    {/* Notification Settings */}
        <motion.div 
                      className="bg-white/60 dark:bg-neutral-800/60 backdrop-blur-sm rounded-2xl p-6 border border-neutral-200/50 dark:border-neutral-700/50"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: 0.2 }}
                    >
                      <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-4 flex items-center gap-2">
                        <featureIcons.bell className="w-5 h-5 text-amber-500 dark:text-amber-400" />
                        Notifications
                      </h3>
                      <div className="space-y-4">
                        {/* Daily Reminders */}
                        <div className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-neutral-50/50 to-neutral-100/50 dark:from-neutral-800/50 dark:to-neutral-700/50 border border-neutral-200/30 dark:border-neutral-600/30">
                          <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-amber-500/10 dark:bg-amber-500/20">
                              <featureIcons.clock className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                            </div>
                            <div>
                              <div className="font-medium text-neutral-900 dark:text-neutral-100 text-sm">Daily Reminders</div>
                              <div className="text-xs text-neutral-600 dark:text-neutral-400">Get reminded to complete your habits</div>
                            </div>
                          </div>
                          <motion.button
                            className="
                              relative w-12 h-6 rounded-full
                              bg-gradient-to-r from-amber-500 to-orange-500
                              shadow-lg shadow-amber-500/30
                              transition-all duration-200
                            "
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <motion.div
                              className="absolute top-0.5 right-0.5 w-5 h-5 bg-white rounded-full shadow-md"
                              initial={{ x: 0 }}
                              animate={{ x: 0 }}
                              transition={{ duration: 0.2 }}
                            />
                          </motion.button>
                        </div>

                        {/* Streak Notifications */}
                        <div className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-neutral-50/50 to-neutral-100/50 dark:from-neutral-800/50 dark:to-neutral-700/50 border border-neutral-200/30 dark:border-neutral-600/30">
                          <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-orange-500/10 dark:bg-orange-500/20">
                              <featureIcons.flame className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                            </div>
            <div>
                              <div className="font-medium text-neutral-900 dark:text-neutral-100 text-sm">Streak Notifications</div>
                              <div className="text-xs text-neutral-600 dark:text-neutral-400">Celebrate your streak milestones</div>
                            </div>
            </div>
            <motion.button
                            className="
                              relative w-12 h-6 rounded-full
                              bg-gradient-to-r from-orange-500 to-red-500
                              shadow-lg shadow-orange-500/30
                              transition-all duration-200
                            "
                            whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
                          >
                            <motion.div
                              className="absolute top-0.5 right-0.5 w-5 h-5 bg-white rounded-full shadow-md"
                              initial={{ x: 0 }}
                              animate={{ x: 0 }}
                              transition={{ duration: 0.2 }}
                            />
            </motion.button>
                        </div>
                      </div>
          </motion.div>

                    {/* Data Management */}
          <motion.div 
                      className="bg-white/60 dark:bg-neutral-800/60 backdrop-blur-sm rounded-2xl p-6 border border-neutral-200/50 dark:border-neutral-700/50"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: 0.3 }}
                    >
                      <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-4 flex items-center gap-2">
                        <featureIcons.database className="w-5 h-5 text-indigo-500 dark:text-indigo-400" />
                        Data Management
                      </h3>
                      <div className="space-y-4">
                        {/* Export Data */}
                        <motion.button
                          className="w-full flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-green-500/10 to-emerald-500/10 dark:from-green-500/20 dark:to-emerald-500/20 border border-green-200/30 dark:border-green-600/30 hover:from-green-500/20 hover:to-emerald-500/20 dark:hover:from-green-500/30 dark:hover:to-emerald-500/30 transition-all duration-200"
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                          <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-green-500/10 dark:bg-green-500/20">
                              <featureIcons.download className="w-4 h-4 text-green-600 dark:text-green-400" />
                  </div>
                            <div className="text-left">
                              <div className="font-medium text-neutral-900 dark:text-neutral-100 text-sm">Export Data</div>
                              <div className="text-xs text-neutral-600 dark:text-neutral-400">Download your habits and progress data</div>
                            </div>
                          </div>
                          <featureIcons.chevronRight className="w-4 h-4 text-green-600 dark:text-green-400" />
                        </motion.button>

                        {/* Import Data */}
                  <motion.button
                          className="w-full flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-blue-500/10 to-cyan-500/10 dark:from-blue-500/20 dark:to-cyan-500/20 border border-blue-200/30 dark:border-blue-600/30 hover:from-blue-500/20 hover:to-cyan-500/20 dark:hover:from-blue-500/30 dark:hover:to-cyan-500/30 transition-all duration-200"
                          whileHover={{ scale: 1.02, y: -2 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-blue-500/10 dark:bg-blue-500/20">
                              <featureIcons.upload className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                </div>
                            <div className="text-left">
                              <div className="font-medium text-neutral-900 dark:text-neutral-100 text-sm">Import Data</div>
                              <div className="text-xs text-neutral-600 dark:text-neutral-400">Import habits and progress from backup</div>
                            </div>
                          </div>
                          <featureIcons.chevronRight className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                        </motion.button>

                        {/* Reset Data */}
                <motion.button
                          className="w-full flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-red-500/10 to-rose-500/10 dark:from-red-500/20 dark:to-rose-500/20 border border-red-200/30 dark:border-red-600/30 hover:from-red-500/20 hover:to-rose-500/20 dark:hover:from-red-500/30 dark:hover:to-rose-500/30 transition-all duration-200"
                          whileHover={{ scale: 1.02, y: -2 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-red-500/10 dark:bg-red-500/20">
                              <featureIcons.trash2 className="w-4 h-4 text-red-600 dark:text-red-400" />
                            </div>
                            <div className="text-left">
                              <div className="font-medium text-neutral-900 dark:text-neutral-100 text-sm">Reset All Data</div>
                              <div className="text-xs text-neutral-600 dark:text-neutral-400">Clear all habits, progress, and settings</div>
                            </div>
                          </div>
                          <featureIcons.chevronRight className="w-4 h-4 text-red-600 dark:text-red-400" />
                </motion.button>
                      </div>
              </motion.div>
                  </div>
                </div>
          </motion.div>
        </motion.div>
        )}
      </AnimatePresence>

        {/* Notification System */}
        <NotificationSystem
          showLevelUp={showLevelUp}
          showPurchaseSuccess={showPurchaseSuccess}
          showHabitComplete={showHabitComplete}
          notificationMessage={notificationMessage}
          lastCompletedHabit={lastCompletedHabit || ''}
        />
    </div>
  );
}
