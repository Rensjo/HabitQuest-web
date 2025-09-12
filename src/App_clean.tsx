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
