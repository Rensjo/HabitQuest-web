// ---------------------------------------------------------------------
// Imports
// ---------------------------------------------------------------------
import { motion, AnimatePresence } from "framer-motion";

// Import extracted components
import { AddHabitModal, AddRewardModal, AddCategoryModal } from "./components/modals";
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
    showAddHabit,
    showAddReward,
    showAddCategory,
    
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
    deleteReward,
    getPeriodKeyWrapper,
    
    // Modal state setters
    setShowAddHabit,
    setShowAddReward,
    setShowAddCategory
  } = useAppState();

  // -------------------------------------------------------------------
  // Render (header, calendar, tabs, and habit list)
  // -------------------------------------------------------------------
  // Initialize audio on first user interaction
  const handleFirstClick = () => {
    initializeAudio();
  };

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

        {/* Enhanced What's New Section */}
        <motion.div
          className="mt-12 relative overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Background with gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-indigo-500/5 dark:from-blue-500/10 dark:via-purple-500/10 dark:to-indigo-500/10 rounded-3xl" />
          
          {/* Decorative elements */}
          <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-blue-400/10 to-purple-400/10 dark:from-blue-400/5 dark:to-purple-400/5 rounded-full blur-2xl" />
          <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-gradient-to-br from-indigo-400/10 to-cyan-400/10 dark:from-indigo-400/5 dark:to-cyan-400/5 rounded-full blur-3xl" />
          
          {/* Content */}
          <div className="relative z-10 bg-white/60 dark:bg-neutral-800/60 backdrop-blur-sm border border-neutral-200/50 dark:border-neutral-700/50 rounded-3xl p-8">
            {/* Header */}
            <motion.div 
              className="flex items-center gap-4 mb-6"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
            >
              <div className="p-3 rounded-2xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-blue-400/30 dark:border-blue-400/20">
                <featureIcons.sparkles className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 dark:from-blue-400 dark:via-purple-400 dark:to-indigo-400 bg-clip-text text-transparent">
                  What's New in v3.2.0
                </h2>
                <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
                  Exciting updates and improvements to enhance your habit tracking experience
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
              {[
                {
                  icon: "📅",
                  title: "Calendar Revamp",
                  description: "Sun–Sat headers for quick scanning, click any date to view & complete habits for that day, and period keys now follow your selected date so daily/monthly resets are crystal-clear."
                },
                {
                  icon: "🆕",
                  title: "Custom Categories",
                  description: "Add your own categories with personalized XP targets, instantly available in both the goal tracker and Add Habit modal."
                },
                {
                  icon: "📦",
                  title: "Enhanced Inventory",
                  description: "Your redeemed rewards are now displayed in a beautiful grid layout with improved visual design and better organization."
                },
                {
                  icon: "🔁",
                  title: "Smart Habit Types",
                  description: "Recurring habits repeat every period, while Specific habits only show on their set date/month/year for better flexibility."
                },
                {
                  icon: "✨",
                  title: "UI Polish",
                  description: "Motion-based progress bars, smoother calendar hover/tap micro-interactions, animated layout shifts, and subtle spacing refinements for a more balanced look."
                },
                {
                  icon: "🎵",
                  title: "Audio Experience",
                  description: "Enhanced sound system with better volume controls, improved toggle alignment, and persistent audio settings for a more immersive experience."
                }
              ].map((feature, idx) => (
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
            onClick={() => {
              playButtonClick();
              window.open('mailto:renkai.studios0@gmail.com?subject=HabitQuest Feedback&body=Hi! I have some feedback about HabitQuest:', '_blank');
            }}
            className="
              group relative overflow-hidden
              bg-gradient-to-br from-blue-500 to-purple-600
              hover:from-blue-600 hover:to-purple-700
              text-white font-semibold
              px-6 py-3 rounded-2xl
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
            <div className="absolute inset-0 rounded-2xl border-2 border-white/20 group-hover:border-white/40 transition-colors duration-300" />
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
            onSave={(_h: any) => {
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
            onSave={(_payload: any) => {
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
            onSave={(_data: any) => {
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
