import { useState, useEffect, useMemo } from 'react';
import { useSoundEffects } from './useSoundEffects';
import { useHabitManagement } from './business';
import { initializeTrayEventHandler } from '../services/trayEventHandler';
import type { Frequency, Habit, Reward } from '../types';
import { getPeriodKey, startOfMonth, endOfMonth } from '../utils';

export function useAppState() {
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
    overallStreak,
    setGoals,
    habitVisibleOnDate,
    toggleComplete,
    deleteHabit,
    addHabit,
    getCategoryXP,
    redeemReward,
    addReward,
    editReward,
    deleteReward,
    addCategory,
    deleteCategory,
    editHabit,
    saveAppData
  } = useHabitManagement();

  // UI state
  const [activeFreq, setActiveFreq] = useState<Frequency>("daily");
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [showDayInsights, setShowDayInsights] = useState(false);
  const [showRewardShop, setShowRewardShop] = useState(false);
  const [activeSettings, setActiveSettings] = useState(false);
  const [activeAnalytics, setActiveAnalytics] = useState(false);
  const [showAddHabit, setShowAddHabit] = useState(false);
  const [showAddReward, setShowAddReward] = useState(false);
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [showUncategorizedHabits, setShowUncategorizedHabits] = useState(false);
  const [showEditReward, setShowEditReward] = useState(false);
  const [showDeleteReward, setShowDeleteReward] = useState(false);
  const [selectedReward, setSelectedReward] = useState<Reward | null>(null);
  
  // Notification states
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [showPurchaseSuccess, setShowPurchaseSuccess] = useState(false);
  const [showHabitComplete, setShowHabitComplete] = useState(false);
  const [lastCompletedHabit, setLastCompletedHabit] = useState<string | null>(null);
  const [notificationMessage, setNotificationMessage] = useState("");

  // Audio states
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [backgroundMusicEnabled, setBackgroundMusicEnabled] = useState(false);
  const [soundEffectsVolume, setSoundEffectsVolume] = useState(0.15);
  const [backgroundMusicVolume, setBackgroundMusicVolume] = useState(0.5);
  
  // Initialize sound effects hook with stable config
  const soundConfig = useMemo(() => ({
    audioEnabled,
    backgroundMusicEnabled,
    soundEffectsVolume,
    backgroundMusicVolume
  }), [audioEnabled, backgroundMusicEnabled, soundEffectsVolume, backgroundMusicVolume]);

  const {
    playButtonClick,
    playHover,
    playLevelUp,
    playTaskComplete,
    playCoins,
    playBackgroundMusic,
    stopBackgroundMusic,
    initializeAudio,
    soundService
  } = useSoundEffects(soundConfig);

  // Initialize tray event handler with sound service
  useEffect(() => {
    if (soundService) {
      const trayHandler = initializeTrayEventHandler(soundService);
      
      // Configure tray behavior
      trayHandler.updateConfig({
        pauseAudioOnHide: true,
        pauseTimersOnHide: true,
        showTrayNotification: true
      });

      console.log('✅ Tray event handler initialized with sound service');
      
      // Cleanup on unmount
      return () => {
        trayHandler.destroy();
      };
    }
  }, [soundService]);

  // Wrapper function to fix type compatibility
  const getPeriodKeyWrapper = (frequency: string, date: Date) => getPeriodKey(frequency as Frequency, date);

  // Persist to localStorage whenever major state changes
  useEffect(() => {
    saveAppData();
  }, [habits, points, totalXP, goals, inventory, shop, categories, saveAppData]);

  // Level-up detection
  const [previousLevel, setPreviousLevel] = useState(level);
  useEffect(() => {
    if (level > previousLevel) {
      setShowLevelUp(true);
      setNotificationMessage(`Level ${level} reached!`);
      playLevelUp();
      setTimeout(() => setShowLevelUp(false), 4000);
    }
    setPreviousLevel(level);
  }, [level, previousLevel, playLevelUp]);

  // Enhanced habit completion with notifications
  const handleHabitComplete = (habitId: string, date: Date) => {
    const habit = habits.find(h => h.id === habitId);
    const pk = getPeriodKey(habit?.frequency || 'daily', date);
    const wasCompleted = habit?.completions?.[pk];
    
    toggleComplete(habitId, date);
    
    // Show notification only when completing (not uncompleting)
    if (!wasCompleted && habit) {
      setLastCompletedHabit(habit.title);
      setShowHabitComplete(true);
      playTaskComplete();
      setTimeout(() => setShowHabitComplete(false), 3000);
    }
  };

  // Enhanced reward redemption with notifications
  const handleRedeemReward = (reward: any) => {
    if (points >= reward.cost) {
      redeemReward(reward);
      setNotificationMessage(`Successfully purchased ${reward.name}!`);
      setShowPurchaseSuccess(true);
      playCoins();
      setTimeout(() => setShowPurchaseSuccess(false), 3000);
    }
  };

  // Handle background music toggle
  useEffect(() => {
    if (backgroundMusicEnabled) {
      playBackgroundMusic();
    } else {
      stopBackgroundMusic();
    }
  }, [backgroundMusicEnabled, playBackgroundMusic, stopBackgroundMusic]);

  // Period key depends on the selected date and active frequency
  const periodKey = useMemo(() => getPeriodKey(activeFreq, selectedDate), [activeFreq, selectedDate]);

  // Category XP for the currently selected month
  const categoryXP: Record<string, number> = useMemo(() => {
    return getCategoryXP(selectedDate);
  }, [selectedDate, getCategoryXP]);

  // Filter habits visible under the active tab & date
  const visibleHabits = habits.filter(
    (h) => h.frequency === activeFreq && habitVisibleOnDate(h, selectedDate)
  );

  // Calculate habit statistics for selected date
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

  // Day insights across all frequencies for selectedDate
  const dayInsights = useMemo(() => {
    const habitsForDay: Habit[] = habits.filter((h) => habitVisibleOnDate(h, selectedDate));
    const completedCount = habitsForDay.filter((h) => Boolean(h.completions[getPeriodKey(h.frequency, selectedDate)])).length;
    const totalCount = habitsForDay.length;
    const completionRate = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
    const xpEarned = habitsForDay.reduce((sum, h) => sum + (h.completions[getPeriodKey(h.frequency, selectedDate)] ? (h.xpOnComplete || 0) : 0), 0);
    return { habitsForDay, completedCount, totalCount, completionRate, xpEarned };
  }, [habits, selectedDate, habitVisibleOnDate]);

  // Calendar model for the selected month
  const monthStart = startOfMonth(selectedDate);
  const monthEnd = endOfMonth(selectedDate);
  const leadingBlanks = monthStart.getDay(); // 0..6
  const daysInMonth = monthEnd.getDate();
  const cells: Array<Date | null> = [];
  for (let i = 0; i < leadingBlanks; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++)
    cells.push(new Date(selectedDate.getFullYear(), selectedDate.getMonth(), d));
  while (cells.length % 7 !== 0) cells.push(null);

  // Precompute a quick lookup of days that have ANY completion
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

  return {
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
    playHover,
    playLevelUp,
    playTaskComplete,
    playCoins,
    playBackgroundMusic,
    stopBackgroundMusic,
    initializeAudio,
    
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
  };
}
