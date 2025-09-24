/**
 * ================================================================================================
 * HABIT REMINDER SYSTEM HOOK
 * ================================================================================================
 * 
 * Integrates notification service and activity tracker for intelligent reminders
 * Provides a unified interface for habit tracking with smart notifications
 * 
 * @version 1.0.0
 */

import { useEffect, useRef, useCallback } from 'react';
import { getNotificationService, type NotificationConfig } from '../services/notificationService';
import { getActivityTracker } from '../services/activityTracker';
import type { Habit } from '../types';

interface HabitReminderConfig extends Partial<NotificationConfig> {
  // Additional configuration specific to habit reminders
  streakWarningThreshold?: number; // Days - only warn for streaks >= this number
  intelligentTiming?: boolean; // Use AI-like timing based on user patterns
  adaptiveFrequency?: boolean; // Reduce notifications for highly active users
}

interface UseHabitRemindersOptions {
  config?: HabitReminderConfig;
  habits?: Habit[];
  onNotificationClick?: (habitId?: string) => void;
}

// ================================================================================================
// HABIT REMINDERS HOOK
// ================================================================================================

export function useHabitReminders({
  config = {} as Partial<HabitReminderConfig>,
  habits = [],
  onNotificationClick,
}: UseHabitRemindersOptions = {}) {
  
  const notificationService = useRef(getNotificationService());
  const activityTracker = useRef(getActivityTracker());
  const reminderIntervals = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());
  const isInitialized = useRef(false);

  const defaultConfig: HabitReminderConfig = {
    enabled: true,
    streakReminders: true,
    randomReminders: true,
    reminderTimeRange: { start: 8, end: 22 },
    maxRemindersPerDay: 2,
    streakProtectionHours: [10, 16, 20], // 10 AM, 4 PM, 8 PM
    soundEnabled: true,
    persistentReminders: false,
    streakWarningThreshold: 3,
    intelligentTiming: true,
    adaptiveFrequency: true,
    ...config,
  };

  // ================================================================================================
  // INITIALIZATION
  // ================================================================================================

  useEffect(() => {
    if (!isInitialized.current) {
      // Initialize services with config
      notificationService.current.updateConfig(defaultConfig);
      
      // Set up periodic streak checking
      setupStreakProtection();
      
      // Set up intelligent reminders
      if (defaultConfig.intelligentTiming) {
        setupIntelligentReminders();
      }
      
      isInitialized.current = true;
    }

    return () => {
      // Cleanup intervals
      reminderIntervals.current.forEach(interval => clearInterval(interval));
      reminderIntervals.current.clear();
    };
  }, []);

  // Update configuration when it changes
  useEffect(() => {
    notificationService.current.updateConfig(defaultConfig);
  }, [config]);

  // ================================================================================================
  // STREAK PROTECTION
  // ================================================================================================

  const setupStreakProtection = useCallback(() => {
    if (!defaultConfig.streakReminders) return;

    // Check for at-risk streaks every hour
    const streakCheckInterval = setInterval(() => {
      checkStreaksAtRisk();
    }, 60 * 60 * 1000); // 1 hour

    reminderIntervals.current.set('streak_check', streakCheckInterval);
  }, [habits]);

  const checkStreaksAtRisk = useCallback(() => {
    const riskyStreaks = activityTracker.current.getStreaksAtRisk();
    
    riskyStreaks.forEach(({ habitId, streakCount, hoursRemaining }) => {
      const habit = habits.find(h => h.id === habitId);
      
      if (habit && streakCount >= defaultConfig.streakWarningThreshold) {
        // Only send warning if we haven't sent one recently
        if (activityTracker.current.shouldSendStreakWarning(habitId)) {
          sendStreakWarning(habit, streakCount, hoursRemaining);
        }
      }
    });
  }, [habits]);

  const sendStreakWarning = useCallback(async (habit: Habit, streakCount: number, hoursRemaining: number) => {
    const urgencyLevel = hoursRemaining <= 4 ? 'URGENT' : hoursRemaining <= 8 ? 'HIGH' : 'MEDIUM';
    
    let title: string;
    let body: string;
    
    switch (urgencyLevel) {
      case 'URGENT':
        title = `🚨 ${streakCount}-day streak expiring soon!`;
        body = `Only ${hoursRemaining}h left to complete "${habit.title}" and keep your amazing streak alive!`;
        break;
      case 'HIGH':
        title = `⏰ ${streakCount}-day streak needs attention`;
        body = `You have ${hoursRemaining}h to complete "${habit.title}" and maintain your streak!`;
        break;
      default:
        title = `🔥 Protect your ${streakCount}-day streak`;
        body = `"${habit.title}" needs completion today to keep your streak going!`;
    }

    await notificationService.current.sendStreakWarning(streakCount, habit.title);
    
    // Track that we sent this warning
    console.log(`Streak warning sent for ${habit.title}: ${streakCount} days, ${hoursRemaining}h remaining`);
  }, []);

  // ================================================================================================
  // INTELLIGENT REMINDERS
  // ================================================================================================

  const setupIntelligentReminders = useCallback(() => {
    if (!defaultConfig.intelligentTiming) return;

    // Set up daily reminder scheduling
    const dailyReminderInterval = setInterval(() => {
      scheduleIntelligentReminders();
    }, 24 * 60 * 60 * 1000); // Daily

    // Schedule for today
    scheduleIntelligentReminders();

    reminderIntervals.current.set('intelligent_reminders', dailyReminderInterval);
  }, [habits]);

  const scheduleIntelligentReminders = useCallback(() => {
    // Don't send reminders if user has been very active
    if (defaultConfig.adaptiveFrequency) {
      const weeklyScore = activityTracker.current.getWeeklyActivityScore();
      if (weeklyScore > 80) {
        console.log('User highly active, reducing notification frequency');
        return;
      }
    }

    // Check if user has completed habits today
    const hasCompletedToday = activityTracker.current.hasCompletedHabitsToday();
    const lastHabitHours = activityTracker.current.getLastHabitCompletionHours();

    // Send different types of reminders based on activity
    if (!hasCompletedToday && lastHabitHours > 6) {
      scheduleMotivationalReminder();
    } else if (hasCompletedToday && lastHabitHours > 4) {
      scheduleEncouragementReminder();
    }
  }, [habits]);

  const scheduleMotivationalReminder = useCallback(() => {
    // Get optimal times based on user's historical patterns
    const optimalTimes = activityTracker.current.getOptimalReminderTimes();
    const currentHour = new Date().getHours();
    
    // Find the next optimal time
    const nextOptimalTime = optimalTimes.find(hour => hour > currentHour) || optimalTimes[0];
    
    if (nextOptimalTime) {
      const now = new Date();
      const reminderTime = new Date(now);
      reminderTime.setHours(nextOptimalTime, Math.floor(Math.random() * 60), 0, 0);
      
      // If time has passed, schedule for tomorrow
      if (reminderTime <= now) {
        reminderTime.setDate(reminderTime.getDate() + 1);
      }
      
      const delay = reminderTime.getTime() - now.getTime();
      
      const reminderTimeout = setTimeout(async () => {
        await sendMotivationalReminder();
      }, delay);
      
      reminderIntervals.current.set(`motivational_${Date.now()}`, reminderTimeout);
    }
  }, []);

  const sendMotivationalReminder = useCallback(async () => {
    const messages = [
      {
        title: '🌟 Ready to build something amazing?',
        body: 'Your habit journey continues! Small steps lead to big changes.',
      },
      {
        title: '💪 Your future self is counting on you',
        body: 'Every habit completed brings you closer to your goals!',
      },
      {
        title: '🚀 Progress beats perfection',
        body: 'Even a small habit completion today makes a difference!',
      },
      {
        title: '🎯 Consistency is your superpower',
        body: 'Show up for yourself today, just like you did yesterday!',
      },
    ];
    
    const message = messages[Math.floor(Math.random() * messages.length)];
    
    await notificationService.current.sendHabitReminder(
      'your habits',
      'personal development'
    );
  }, []);

  const scheduleEncouragementReminder = useCallback(() => {
    // User has been active, send encouragement
    const encouragementTimeout = setTimeout(async () => {
      await sendEncouragementReminder();
    }, 2 * 60 * 60 * 1000); // 2 hours from now
    
    reminderIntervals.current.set(`encouragement_${Date.now()}`, encouragementTimeout);
  }, []);

  const sendEncouragementReminder = useCallback(async () => {
    const stats = activityTracker.current.getStats();
    
    if (stats.hasCompletedHabitsToday) {
      await notificationService.current.sendHabitReminder(
        'Keep up the great work!',
        'You\'re on fire today! 🔥'
      );
    }
  }, []);

  // ================================================================================================
  // HABIT COMPLETION TRACKING
  // ================================================================================================

  const recordHabitCompletion = useCallback(async (habitId: string, habitName: string) => {
    // Track the completion
    activityTracker.current.recordHabitCompletion(habitId, habitName);
    
    // Update activity
    notificationService.current.updateActivity();

    // Also record in backend for persistent tracking
    try {
      if (typeof window !== 'undefined' && (window as any).__TAURI__) {
        const { invoke } = await import('@tauri-apps/api/core');
        await invoke('record_habit_completion_backend', { habitId });
      }
    } catch (error) {
      console.warn('Failed to record habit completion in backend:', error);
    }
    
    // Cancel any pending reminders for this habit
    const pendingReminders = Array.from(reminderIntervals.current.entries())
      .filter(([key]) => key.includes(habitId));
    
    pendingReminders.forEach(([key, timeout]) => {
      clearTimeout(timeout);
      reminderIntervals.current.delete(key);
    });
    
    console.log(`Habit completion recorded and reminders updated: ${habitName}`);
  }, []);

  // ================================================================================================
  // MANUAL REMINDER CONTROLS
  // ================================================================================================

  const sendImmediateReminder = useCallback(async (habitId?: string) => {
    if (habitId) {
      const habit = habits.find(h => h.id === habitId);
      if (habit) {
        await notificationService.current.sendHabitReminder(habit.title, habit.category);
      }
    } else {
      await sendMotivationalReminder();
    }
  }, [habits]);

  const snoozeReminders = useCallback((minutes: number = 60) => {
    // Clear all pending reminders
    reminderIntervals.current.forEach(timeout => clearTimeout(timeout));
    reminderIntervals.current.clear();
    
    // Reschedule in specified minutes
    const snoozeTimeout = setTimeout(() => {
      setupIntelligentReminders();
    }, minutes * 60 * 1000);
    
    reminderIntervals.current.set('snooze', snoozeTimeout);
    
    console.log(`Reminders snoozed for ${minutes} minutes`);
  }, []);

  const pauseReminders = useCallback(() => {
    reminderIntervals.current.forEach(timeout => clearTimeout(timeout));
    reminderIntervals.current.clear();
    
    notificationService.current.updateConfig({ enabled: false });
    
    console.log('All reminders paused');
  }, []);

  const resumeReminders = useCallback(() => {
    notificationService.current.updateConfig({ enabled: true });
    
    setupStreakProtection();
    setupIntelligentReminders();
    
    console.log('Reminders resumed');
  }, []);

  // ================================================================================================
  // STATUS AND STATS
  // ================================================================================================

  const getNotificationStats = useCallback(() => {
    const activityStats = activityTracker.current.getStats();
    const isSupported = notificationService.current.isNotificationSupported();
    
    return {
      ...activityStats,
      notificationSupported: isSupported,
      notificationEnabled: defaultConfig.enabled,
      pendingReminders: reminderIntervals.current.size,
      config: defaultConfig,
    };
  }, []);

  // ================================================================================================
  // RETURN API
  // ================================================================================================

  return {
    // Core functions
    recordHabitCompletion,
    sendImmediateReminder,
    
    // Reminder controls
    snoozeReminders,
    pauseReminders,
    resumeReminders,
    
    // Status and configuration
    getStats: getNotificationStats,
    updateConfig: (newConfig: Partial<HabitReminderConfig>) => {
      Object.assign(defaultConfig, newConfig);
      notificationService.current.updateConfig(newConfig);
    },
    
    // Activity tracking
    updateActivity: () => notificationService.current.updateActivity(),
    isInactive: (hours: number) => activityTracker.current.hasBeenInactiveFor(hours),
    
    // Streak information
    getStreaksAtRisk: () => activityTracker.current.getStreaksAtRisk(),
  };
}

// ================================================================================================
// TYPES EXPORT
// ================================================================================================

export type { HabitReminderConfig, UseHabitRemindersOptions };