// ---------------------------------------------------------------------
// Imports
// ---------------------------------------------------------------------
import React, { useMemo, useCallback, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Import extracted components
import { AddHabitModal, AddRewardModal, AddCategoryModal, UncategorizedHabitsModal } from "./components/modals";
import { EditRewardModal } from "./components/modals/EditRewardModal";
import { DeleteRewardModal } from "./components/modals/DeleteRewardModal";
import { PROTECTED_FALLBACK_CATEGORY } from "./constants";
import { SettingsModal } from "./components/modals/SettingsModal";
import { useAppState } from "./hooks/useAppState";
import { featureIcons } from "./utils/icons";

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
// Modal components are now handled by ModalSystem

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
function HabitGoalTrackerV3() {
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
    showAddHabit,
    showAddReward,
    showAddCategory,
    showUncategorizedHabits,
    showEditReward,
    showDeleteReward,
    selectedReward,
    
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
    initializeAudio,
    
    // Computed values
    periodKey,
    categoryXP,
    visibleHabits,
    habitStats,
    dayInsights,
    completedDaysSet,
    
    // Actions
    setActiveFreq,
    setSelectedDate,
    setShowDayInsights,
    setShowRewardShop,
    setActiveSettings,
    setActiveAnalytics,
    setAudioEnabled,
    setBackgroundMusicEnabled,
    setSoundEffectsVolume,
    setBackgroundMusicVolume,
    setGoals,
    handleHabitComplete,
    handleRedeemReward,
    deleteHabit,
    addHabit,
    addReward,
    editReward,
    deleteReward,
    addCategory,
    deleteCategory,
    editHabit,
    getPeriodKeyWrapper,
    
    // Modal state setters
    setShowAddHabit,
    setShowAddReward,
    setShowAddCategory,
    setShowUncategorizedHabits,
    setShowEditReward,
    setShowDeleteReward,
    setSelectedReward
  } = useAppState();

  // -------------------------------------------------------------------
  // Performance Optimizations
  // -------------------------------------------------------------------
  
  // Memoized event handlers to prevent unnecessary re-renders
  const handleFirstClick = useCallback(() => {
    initializeAudio();
  }, [initializeAudio]);

  const handleSettingsToggle = useCallback(() => {
    setActiveSettings(!activeSettings);
  }, [activeSettings, setActiveSettings]);

  const handleAnalyticsToggle = useCallback(() => {
    setActiveAnalytics(!activeAnalytics);
  }, [activeAnalytics, setActiveAnalytics]);

  const handleRewardShopClick = useCallback(() => {
    setShowRewardShop(true);
  }, [setShowRewardShop]);

  const handleDateSelect = useCallback((date: Date) => {
    setSelectedDate(date);
  }, [setSelectedDate]);

  const handleDayInsights = useCallback(() => {
    setShowDayInsights(true);
  }, [setShowDayInsights]);

  const handlePrevMonth = useCallback(() => {
    setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth() - 1, 1));
  }, [selectedDate, setSelectedDate]);

  const handleNextMonth = useCallback(() => {
    setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 1));
  }, [selectedDate, setSelectedDate]);

  const handleToday = useCallback(() => {
    setSelectedDate(new Date());
  }, [setSelectedDate]);

  const handleFrequencyChange = useCallback((freq: any) => {
    setActiveFreq(freq);
  }, [setActiveFreq]);

  const handleAddHabitClick = useCallback(() => {
    setShowAddHabit(true);
  }, [setShowAddHabit]);

  const handleAddCategoryClick = useCallback(() => {
    setShowAddCategory(true);
  }, [setShowAddCategory]);

  const handleDeleteCategory = useCallback((categoryName: string) => {
    deleteCategory(categoryName);
  }, [deleteCategory]);

  const handleSetGoals = useCallback((newGoals: any) => {
    setGoals(newGoals);
  }, [setGoals]);

  const handleOpenShop = useCallback(() => {
    setShowRewardShop(true);
  }, [setShowRewardShop]);

  const handleFeedbackClick = useCallback(() => {
    playButtonClick();
    window.open('mailto:renkai.studios0@gmail.com?subject=HabitQuest Feedback&body=Hi! I have some feedback about HabitQuest:', '_blank');
  }, [playButtonClick]);

  // Memoized modal close handlers
  const handleCloseRewardShop = useCallback(() => {
    setShowRewardShop(false);
  }, [setShowRewardShop]);

  const handleCloseDayInsights = useCallback(() => {
    setShowDayInsights(false);
  }, [setShowDayInsights]);

  const handleCloseAnalytics = useCallback(() => {
    setActiveAnalytics(false);
  }, [setActiveAnalytics]);

  const handleCloseSettings = useCallback(() => {
    setActiveSettings(false);
  }, [setActiveSettings]);

  const handleCloseAddHabit = useCallback(() => {
    setShowAddHabit(false);
  }, [setShowAddHabit]);

  const handleCloseAddReward = useCallback(() => {
    setShowAddReward(false);
  }, [setShowAddReward]);

  const handleCloseAddCategory = useCallback(() => {
    setShowAddCategory(false);
  }, [setShowAddCategory]);

  // Memoized habit save handlers
  const handleHabitSave = useCallback((h: any) => {
    addHabit(h);
    setShowAddHabit(false);
  }, [addHabit, setShowAddHabit]);

  const handleRewardSave = useCallback((payload: any) => {
    addReward(payload.name, payload.cost);
    setShowAddReward(false);
  }, [addReward, setShowAddReward]);

  const handleCategorySave = useCallback((data: { name: string; target: number }) => {
    addCategory(data.name, data.target);
    setShowAddCategory(false);
  }, [addCategory, setShowAddCategory]);

  // Reward edit/delete handlers
  const handleEditRewardClick = useCallback((rewardId: string) => {
    const reward = shop.find(r => r.id === rewardId);
    if (reward) {
      setSelectedReward(reward);
      setShowEditReward(true);
    }
  }, [shop, setSelectedReward, setShowEditReward]);

  const handleEditRewardSave = useCallback((updates: any) => {
    if (selectedReward) {
      editReward(selectedReward.id, updates);
      setShowEditReward(false);
      setSelectedReward(null);
    }
  }, [selectedReward, editReward, setShowEditReward, setSelectedReward]);

  const handleDeleteRewardClick = useCallback((rewardId: string) => {
    const reward = shop.find(r => r.id === rewardId);
    if (reward) {
      setSelectedReward(reward);
      setShowDeleteReward(true);
    }
  }, [shop, setSelectedReward, setShowDeleteReward]);

  const handleDeleteRewardConfirm = useCallback(() => {
    if (selectedReward) {
      deleteReward(selectedReward.id);
      setShowDeleteReward(false);
      setSelectedReward(null);
    }
  }, [selectedReward, deleteReward, setShowDeleteReward, setSelectedReward]);

  // Memoized features array to prevent recreation on every render
  const features = useMemo(() => [
    {
      icon: "📊",
      title: "Analytics Dashboard Overhaul",
      description: "Completely redesigned analytics with tabbed navigation, yearly overviews, monthly deep dives, weekly comparisons, and daily performance tracking with visual charts and progress indicators."
    },
    {
      icon: "🗓️",
      title: "Historical Data Navigation",
      description: "Navigate through any month and year to view historical analytics. Track your progress over time with comprehensive year/month selectors and trend analysis."
    },
    {
      icon: "📈",
      title: "Visual Progress Charts",
      description: "Beautiful animated charts showing monthly XP progression, daily completion rates, category performance with color-coded indicators, and achievement tracking with visual progress bars."
    },
    {
      icon: "🎯",
      title: "Advanced Target Tracking",
      description: "Monitor XP goal progress per category with visual indicators, completion percentages, and achievement badges. See exactly how close you are to meeting your monthly targets."
    },
    {
      icon: "🔥",
      title: "Comprehensive Streak Analysis",
      description: "Individual habit streak tracking with detailed breakdowns, weekly performance comparisons showing improvement trends, and daily habit completion statistics."
    },
    {
      icon: "🛒",
      title: "Reward Purchase Analytics",
      description: "Track your reward spending patterns with monthly purchase history, point expenditure analysis, and recent purchase summaries for better budget management."
    }
  ], []);

  // -------------------------------------------------------------------
  // Render (header, calendar, tabs, and habit list)
  // -------------------------------------------------------------------

  return (
    <AppBackground>
      <div onClick={handleFirstClick}>
        <DynamicContainer>
        {/* Enhanced Header with Dynamic Layout */}
        <AppHeader
          totalXP={totalXP}
          level={level}
          habitStats={habitStats}
          overallStreak={overallStreak}
          points={points}
          activeSettings={activeSettings}
          activeAnalytics={activeAnalytics}
          onSettingsToggle={handleSettingsToggle}
          onAnalyticsToggle={handleAnalyticsToggle}
          onRewardShopClick={handleRewardShopClick}
        />
        {/* Calendar */}
        <CalendarSection
          selectedDate={selectedDate}
          completedDaysSet={completedDaysSet}
          periodKey={periodKey}
          onDateSelect={handleDateSelect}
          onDayInsights={handleDayInsights}
          onPrevMonth={handlePrevMonth}
          onNextMonth={handleNextMonth}
          onToday={handleToday}
        />

        {/* Enhanced Frequency Tabs */}
        <FrequencyTabs
          activeFreq={activeFreq}
          onFrequencyChange={handleFrequencyChange}
          onAddHabit={handleAddHabitClick}
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
          categories={categories}
          onHabitComplete={handleHabitComplete}
          onHabitDelete={deleteHabit}
          onHabitEdit={editHabit}
          getPeriodKey={getPeriodKeyWrapper}
        />

        {/* Goal Tracker by Category - Moved below habit list */}
        <GoalTracker
          categories={categories}
          categoryXP={categoryXP}
          goals={goals}
          selectedDate={selectedDate}
          habits={habits}
          onAddCategory={handleAddCategoryClick}
          onDeleteCategory={handleDeleteCategory}
          onSetGoals={handleSetGoals}
          onShowUncategorizedHabits={() => setShowUncategorizedHabits(true)}
        />
        
        {/* Rewards Shop Section */}
        <RewardsShop
          shop={shop}
          inventory={inventory}
          points={points}
          onOpenShop={handleOpenShop}
          onEditReward={handleEditRewardClick}
          onDeleteReward={handleDeleteRewardClick}
          onRedeemReward={handleRedeemReward}
        />

        {/* Enhanced What's New Section */}
        <motion.div
          className="mt-12 relative overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Background with gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/4 via-purple-500/4 to-indigo-500/4 dark:from-blue-500/3 dark:via-purple-500/3 dark:to-indigo-500/3 rounded-3xl" />
          
          {/* Decorative elements */}
          <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-blue-400/5 to-purple-400/5 dark:from-blue-400/2 dark:to-purple-400/2 rounded-full blur-2xl" />
          <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-gradient-to-br from-indigo-400/5 to-cyan-400/5 dark:from-indigo-400/2 dark:to-cyan-400/2 rounded-full blur-3xl" />
          
          {/* Content */}
          <div className="relative z-10 bg-white/60 dark:bg-neutral-800/60 backdrop-blur-sm border border-neutral-200/50 dark:border-neutral-700/50 rounded-2xl p-6">
            {/* Header */}
            <motion.div 
              className="flex items-center gap-4 mb-6"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
            >
              <div className="p-3 rounded-2xl bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-400/20 dark:border-blue-400/10">
                <featureIcons.sparkles className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 dark:from-blue-300 dark:via-purple-300 dark:to-indigo-300 bg-clip-text text-transparent">
                  What's New in v4.1.2.0
                </h2>
                <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
                  Major analytics enhancement and comprehensive dashboard improvements
                </p>
              </div>
            </motion.div>

            {/* Features Grid */}
            <motion.div 
              className="grid gap-4 md:grid-cols-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
            >
              {features.map((feature, idx) => (
                <motion.div
                  key={idx}
                  className="
                    group relative overflow-hidden
                    bg-gradient-to-br from-white/80 to-neutral-50/80 dark:from-neutral-800/80 dark:to-neutral-900/80
                    border border-neutral-200/50 dark:border-neutral-700/50
                    rounded-2xl p-5
                    hover:shadow-lg hover:shadow-blue-500/5 dark:hover:shadow-blue-500/10
                    transition-all duration-300
                  "
                  initial={{ opacity: 0, scale: 0.9, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 + idx * 0.05 }}
                  whileHover={{ 
                    scale: 1.02, 
                    y: -2,
                    boxShadow: "0 10px 25px -5px rgba(59, 130, 246, 0.1), 0 4px 6px -1px rgba(59, 130, 246, 0.05)"
                  }}
                >
                  {/* Background Pattern */}
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  {/* Content */}
                  <div className="relative z-10">
                    <div className="flex items-start gap-3 mb-3">
                      <div className="text-2xl">{feature.icon}</div>
                      <h3 className="font-semibold text-neutral-900 dark:text-neutral-100 text-base">
                        {feature.title}
                      </h3>
                    </div>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>

                  {/* Hover Effect Border */}
                  <div className="absolute inset-0 rounded-2xl border-2 border-blue-400/0 group-hover:border-blue-400/20 transition-colors duration-300" />
                </motion.div>
              ))}
            </motion.div>

            {/* Footer */}
            <motion.div 
              className="mt-6 pt-4 border-t border-neutral-200/50 dark:border-neutral-700/50 text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.5 }}
            >
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                Thank you for using HabitQuest! Keep building those positive habits! 🚀
              </p>
            </motion.div>
          </div>
        </motion.div>

        {/* Feedback Button */}
        <motion.div
          className="mt-8 flex justify-end"
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
        >
          <motion.button
            onClick={handleFeedbackClick}
            className="
              group relative overflow-hidden
              bg-gradient-to-br from-blue-500 to-purple-600
              hover:from-blue-600 hover:to-purple-700
              text-white font-semibold
              px-6 py-3 rounded-3xl
              shadow-lg hover:shadow-xl
              transition-all duration-300
              flex items-center gap-3
            "
            whileHover={{ 
              scale: 1.05,
              boxShadow: "0 20px 25px -5px rgba(59, 130, 246, 0.3), 0 10px 10px -5px rgba(59, 130, 246, 0.1)"
            }}
            whileTap={{ scale: 0.95 }}
          >
            {/* Background Pattern */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            
            {/* Content */}
            <div className="relative z-10 flex items-center gap-3">
              <div className="p-1 rounded-lg bg-white/20">
                <featureIcons.plus className="w-4 h-4" />
              </div>
              <span className="text-sm font-medium">Send Feedback</span>
            </div>

            {/* Hover Effect Border */}
            <div className="absolute inset-0 rounded-3xl border-2 border-white/20 group-hover:border-white/40 transition-colors duration-300" />
          </motion.button>
        </motion.div>
        </DynamicContainer>
      </div>

      {/* Modal System */}
      <ModalSystem
        showRewardShop={showRewardShop}
        showDayInsights={showDayInsights}
        activeAnalytics={activeAnalytics}
        activeSettings={activeSettings}
        onCloseRewardShop={handleCloseRewardShop}
        onCloseDayInsights={handleCloseDayInsights}
        onCloseAnalytics={handleCloseAnalytics}
        onCloseSettings={handleCloseSettings}
        shop={shop}
        inventory={inventory}
        points={points}
        onEditReward={handleEditRewardClick}
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
        goals={goals}
        playButtonClick={playButtonClick}
      />
      
      {/* Add Modals */}
      <AnimatePresence>
        {showAddHabit && (
          <AddHabitModal
            onClose={handleCloseAddHabit}
            onSave={handleHabitSave}
            categories={categories}
          />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {showAddReward && (
          <AddRewardModal
            onClose={handleCloseAddReward}
            onSave={handleRewardSave}
          />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {showAddCategory && (
          <AddCategoryModal
            onClose={handleCloseAddCategory}
            onSave={handleCategorySave}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showUncategorizedHabits && (
          <UncategorizedHabitsModal
            habits={habits.filter(h => h.category === PROTECTED_FALLBACK_CATEGORY)}
            categories={categories}
            onClose={() => setShowUncategorizedHabits(false)}
            onEditHabit={(habit) => editHabit(habit.id, habit)}
            onMoveHabit={(habitId, categoryId) => editHabit(habitId, { category: categoryId })}
          />
        )}
      </AnimatePresence>

      {/* Settings Panel */}
      <SettingsModal
        isOpen={activeSettings}
        onClose={handleCloseSettings}
        audioEnabled={audioEnabled}
        backgroundMusicEnabled={backgroundMusicEnabled}
        soundEffectsVolume={soundEffectsVolume}
        backgroundMusicVolume={backgroundMusicVolume}
        onAudioEnabledChange={setAudioEnabled}
        onBackgroundMusicEnabledChange={setBackgroundMusicEnabled}
        onSoundEffectsVolumeChange={setSoundEffectsVolume}
        onBackgroundMusicVolumeChange={setBackgroundMusicVolume}
      />

      {/* Reward Modals */}
      {showEditReward && selectedReward && (
        <EditRewardModal
          reward={selectedReward}
          onClose={() => {
            setShowEditReward(false);
            setSelectedReward(null);
          }}
          onSave={(updates) => {
            editReward(selectedReward.id, updates);
            setShowEditReward(false);
            setSelectedReward(null);
          }}
        />
      )}

      {showDeleteReward && selectedReward && (
        <DeleteRewardModal
          reward={selectedReward}
          onClose={() => {
            setShowDeleteReward(false);
            setSelectedReward(null);
          }}
          onConfirm={() => {
            deleteReward(selectedReward.id);
            setShowDeleteReward(false);
            setSelectedReward(null);
          }}
        />
      )}

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

// Export memoized component for better performance
export default memo(HabitGoalTrackerV3);
