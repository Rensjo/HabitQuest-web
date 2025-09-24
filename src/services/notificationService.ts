/**
 * ================================================================================================
 * HABITQUEST NOTIFICATION SERVICE
 * ================================================================================================
 * 
 * Cross-platform notification system for desktop reminders and streak protection
 * Supports both web notifications and Tauri desktop notifications
 * 
 * @version 1.0.0
 */

interface NotificationConfig {
  enabled: boolean;
  streakReminders: boolean;
  randomReminders: boolean;
  reminderTimeRange: {
    start: number; // Hour (0-23)
    end: number;   // Hour (0-23)
  };
  maxRemindersPerDay: number;
  streakProtectionHours: number[]; // Hours when streak protection reminders should fire
  soundEnabled: boolean;
  persistentReminders: boolean;
}

interface NotificationData {
  title: string;
  body: string;
  icon?: string;
  tag?: string;
  actions?: NotificationAction[];
  requireInteraction?: boolean;
  silent?: boolean;
}

interface NotificationAction {
  action: string;
  title: string;
  icon?: string;
}

interface ScheduledNotification {
  id: string;
  scheduledTime: Date;
  type: 'streak_protection' | 'daily_reminder' | 'habit_specific';
  habitId?: string;
  data: NotificationData;
}

// ================================================================================================
// NOTIFICATION SERVICE CLASS
// ================================================================================================

export class NotificationService {
  private config: NotificationConfig;
  private scheduledNotifications: Map<string, ScheduledNotification> = new Map();
  private lastAppActivity: Date = new Date();
  private notificationCount: number = 0;
  private isInitialized: boolean = false;

  constructor(config?: Partial<NotificationConfig>) {
    this.config = {
      enabled: true,
      streakReminders: true,
      randomReminders: true,
      reminderTimeRange: { start: 9, end: 21 }, // 9 AM to 9 PM
      maxRemindersPerDay: 3,
      streakProtectionHours: [12, 18, 20], // Noon, 6 PM, 8 PM
      soundEnabled: true,
      persistentReminders: false,
      ...config
    };

    this.initializeNotifications();
  }

  // ================================================================================================
  // INITIALIZATION
  // ================================================================================================

  private async initializeNotifications(): Promise<void> {
    if (this.isInitialized) return;

    try {
      // Check if we're in Tauri
      if (typeof window !== 'undefined' && (window as any).__TAURI__) {
        await this.initializeTauriNotifications();
        await this.initializeBackgroundService();
      } else {
        await this.initializeWebNotifications();
      }
      
      this.isInitialized = true;
      this.setupDailyScheduler();
      this.setupActivityTracker();
      
      console.log('NotificationService initialized successfully');
    } catch (error) {
      console.error('Failed to initialize notifications:', error);
    }
  }

  private async initializeBackgroundService(): Promise<void> {
    try {
      if (typeof window !== 'undefined' && (window as any).__TAURI__) {
        const { invoke } = await import('@tauri-apps/api/core');
        // Record that the app is now active
        await invoke('record_app_activity');
        console.log('Background notification service initialized');
      }
    } catch (error) {
      console.warn('Failed to initialize background service:', error);
    }
  }

  private async initializeTauriNotifications(): Promise<void> {
    try {
      // Try to use Tauri notification APIs if available
      const { invoke } = await import('@tauri-apps/api/core');
      
      // Check if notifications are available on this platform
      const isSupported = await invoke('tauri_notification_supported').catch(() => false);
      
      if (!isSupported) {
        console.log('Tauri notifications not supported, falling back to web notifications');
        await this.initializeWebNotifications();
        return;
      }
      
      // Request permission through Tauri
      const hasPermission = await invoke('tauri_request_notification_permission').catch(() => false);
      
      if (!hasPermission) {
        console.warn('Tauri notification permission not granted');
        this.config.enabled = false;
      }
    } catch (error) {
      console.log('Tauri notification plugin not available, using web notifications');
      await this.initializeWebNotifications();
    }
  }

  private async initializeWebNotifications(): Promise<void> {
    if (!('Notification' in window)) {
      console.warn('This browser does not support desktop notifications');
      this.config.enabled = false;
      return;
    }

    if (Notification.permission === 'default') {
      const permission = await Notification.requestPermission();
      if (permission !== 'granted') {
        console.warn('Notification permission denied');
        this.config.enabled = false;
      }
    } else if (Notification.permission === 'denied') {
      console.warn('Notification permission denied');
      this.config.enabled = false;
    }
  }

  // ================================================================================================
  // ACTIVITY TRACKING
  // ================================================================================================

  private setupActivityTracker(): void {
    // Track when user is actively using the app
    const updateActivity = () => {
      this.lastAppActivity = new Date();
    };

    // Listen for various user interactions
    if (typeof window !== 'undefined') {
      ['mousedown', 'mousemove', 'keydown', 'scroll', 'touchstart'].forEach(event => {
        window.addEventListener(event, updateActivity, { passive: true });
      });

      // Track window focus/blur
      window.addEventListener('focus', () => {
        this.lastAppActivity = new Date();
        this.clearRecentNotifications();
      });
    }
  }

  public updateActivity(): void {
    this.lastAppActivity = new Date();
    
    // Also update backend activity tracking
    this.recordBackendActivity();
  }

  private async recordBackendActivity(): Promise<void> {
    try {
      if (typeof window !== 'undefined' && (window as any).__TAURI__) {
        const { invoke } = await import('@tauri-apps/api/core');
        await invoke('record_app_activity');
      }
    } catch (error) {
      console.warn('Failed to record backend activity:', error);
    }
  }

  public hasBeenInactiveFor(hours: number): boolean {
    const inactiveTime = Date.now() - this.lastAppActivity.getTime();
    return inactiveTime >= (hours * 60 * 60 * 1000);
  }

  // ================================================================================================
  // NOTIFICATION SCHEDULING
  // ================================================================================================

  private setupDailyScheduler(): void {
    // Schedule notifications for the day
    this.scheduleStreakProtectionNotifications();
    this.scheduleRandomReminders();

    // Reset daily notification count at midnight
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    
    const timeUntilMidnight = tomorrow.getTime() - now.getTime();
    
    setTimeout(() => {
      this.resetDailyNotifications();
      // Schedule for tomorrow
      this.setupDailyScheduler();
    }, timeUntilMidnight);
  }

  private scheduleStreakProtectionNotifications(): void {
    if (!this.config.streakReminders) return;

    const today = new Date();
    
    this.config.streakProtectionHours.forEach(hour => {
      const scheduledTime = new Date(today);
      scheduledTime.setHours(hour, Math.floor(Math.random() * 60), 0, 0);
      
      // Only schedule if time hasn't passed today
      if (scheduledTime > new Date()) {
        const notification: ScheduledNotification = {
          id: `streak_${hour}_${Date.now()}`,
          scheduledTime,
          type: 'streak_protection',
          data: {
            title: '🔥 Protect Your Streaks!',
            body: 'Don\'t let your amazing habit streaks break! Quick check-in?',
            icon: '/favicon.png',
            tag: 'streak_protection',
            requireInteraction: true,
            actions: [
              { action: 'open', title: 'Open HabitQuest', icon: '/favicon.png' },
              { action: 'dismiss', title: 'Remind me later' }
            ]
          }
        };
        
        this.scheduleNotification(notification);
      }
    });
  }

  private scheduleRandomReminders(): void {
    if (!this.config.randomReminders || this.notificationCount >= this.config.maxRemindersPerDay) {
      return;
    }

    const remainingReminders = this.config.maxRemindersPerDay - this.notificationCount;
    
    for (let i = 0; i < remainingReminders; i++) {
      const randomTime = this.generateRandomReminderTime();
      
      const notification: ScheduledNotification = {
        id: `random_${Date.now()}_${i}`,
        scheduledTime: randomTime,
        type: 'daily_reminder',
        data: {
          title: this.getRandomReminderTitle(),
          body: this.getRandomReminderBody(),
          icon: '/favicon.png',
          tag: 'daily_reminder',
          actions: [
            { action: 'open', title: 'Open HabitQuest' },
            { action: 'snooze', title: 'Remind me in 1 hour' }
          ]
        }
      };
      
      this.scheduleNotification(notification);
    }
  }

  private generateRandomReminderTime(): Date {
    const now = new Date();
    const start = this.config.reminderTimeRange.start;
    const end = this.config.reminderTimeRange.end;
    
    // Generate random time within the allowed range
    const randomHour = start + Math.floor(Math.random() * (end - start + 1));
    const randomMinute = Math.floor(Math.random() * 60);
    
    const scheduledTime = new Date(now);
    scheduledTime.setHours(randomHour, randomMinute, 0, 0);
    
    // If the time has already passed today, schedule for tomorrow
    if (scheduledTime <= now) {
      scheduledTime.setDate(scheduledTime.getDate() + 1);
    }
    
    return scheduledTime;
  }

  // ================================================================================================
  // NOTIFICATION CONTENT
  // ================================================================================================

  private getRandomReminderTitle(): string {
    const titles = [
      '🎯 Quest Update Time!',
      '⭐ Your habits are calling!',
      '🚀 Level up your day!',
      '💪 Consistency is key!',
      '🏆 Achievement unlocked?',
      '🌟 Small steps, big victories!',
      '🔥 Keep the momentum going!'
    ];
    return titles[Math.floor(Math.random() * titles.length)];
  }

  private getRandomReminderBody(): string {
    const bodies = [
      'How are your habits coming along today? Even small progress counts!',
      'A quick check-in can make all the difference. Your future self will thank you!',
      'Every habit completed is XP gained. Ready to level up?',
      'Consistency beats perfection. What can you tackle right now?',
      'Your habit streaks are waiting! Don\'t break the chain.',
      'Great things happen one habit at a time. What\'s your next move?',
      'Your daily quests await! Time to earn some XP points.'
    ];
    return bodies[Math.floor(Math.random() * bodies.length)];
  }

  // ================================================================================================
  // NOTIFICATION EXECUTION
  // ================================================================================================

  private scheduleNotification(notification: ScheduledNotification): void {
    this.scheduledNotifications.set(notification.id, notification);
    
    const delay = notification.scheduledTime.getTime() - Date.now();
    
    if (delay > 0) {
      setTimeout(() => {
        this.sendNotification(notification);
      }, delay);
    }
  }

  private async sendNotification(notification: ScheduledNotification): Promise<void> {
    if (!this.config.enabled) return;

    // Check if user has been inactive long enough to warrant a notification
    const shouldSendStreakProtection = notification.type === 'streak_protection' && this.hasBeenInactiveFor(4);
    const shouldSendDailyReminder = notification.type === 'daily_reminder' && this.hasBeenInactiveFor(2);
    
    if (!shouldSendStreakProtection && !shouldSendDailyReminder && notification.type !== 'habit_specific') {
      return; // User is active, no need to send notification
    }

    try {
      if (typeof window !== 'undefined' && (window as any).__TAURI__) {
        await this.sendTauriNotification(notification);
      } else {
        await this.sendWebNotification(notification);
      }
      
      this.notificationCount++;
      this.scheduledNotifications.delete(notification.id);
      
    } catch (error) {
      console.error('Failed to send notification:', error);
    }
  }

  private async sendTauriNotification(notification: ScheduledNotification): Promise<void> {
    try {
      const { invoke } = await import('@tauri-apps/api/core');
      
      await invoke('tauri_send_notification', {
        title: notification.data.title,
        body: notification.data.body,
        icon: notification.data.icon || '/favicon.png',
      });
    } catch (error) {
      console.warn('Tauri notification failed, falling back to web notification:', error);
      await this.sendWebNotification(notification);
    }
  }

  private async sendWebNotification(notification: ScheduledNotification): Promise<void> {
    if (Notification.permission !== 'granted') return;
    
    const webNotification = new Notification(notification.data.title, {
      body: notification.data.body,
      icon: notification.data.icon || '/favicon.png',
      tag: notification.data.tag,
      requireInteraction: notification.data.requireInteraction || false,
      silent: !this.config.soundEnabled,
    });

    // Handle notification clicks
    webNotification.onclick = () => {
      window.focus();
      webNotification.close();
    };

    // Auto-close after 8 seconds if not persistent
    if (!notification.data.requireInteraction) {
      setTimeout(() => webNotification.close(), 8000);
    }
  }

  // ================================================================================================
  // MANUAL NOTIFICATIONS
  // ================================================================================================

  public async sendStreakWarning(streakCount: number, habitName: string): Promise<void> {
    const notification: NotificationData = {
      title: `🔥 ${streakCount}-day streak at risk!`,
      body: `Your "${habitName}" streak is about to break. Complete it now to keep the chain going!`,
      icon: '/favicon.png',
      tag: 'streak_warning',
      requireInteraction: true,
    };

    await this.sendImmediateNotification(notification);
  }

  public async sendHabitReminder(habitName: string, category: string): Promise<void> {
    const notification: NotificationData = {
      title: `📝 Time for "${habitName}"`,
      body: `Keep building your ${category.toLowerCase()} habits! You've got this!`,
      icon: '/favicon.png',
      tag: 'habit_reminder',
    };

    await this.sendImmediateNotification(notification);
  }

  public async sendLevelUpNotification(newLevel: number): Promise<void> {
    const notification: NotificationData = {
      title: `🎉 Level Up! You're now Level ${newLevel}!`,
      body: 'Your dedication is paying off! Keep up the amazing work!',
      icon: '/favicon.png',
      tag: 'level_up',
      requireInteraction: true,
    };

    await this.sendImmediateNotification(notification);
  }

  private async sendImmediateNotification(data: NotificationData): Promise<void> {
    const notification: ScheduledNotification = {
      id: `immediate_${Date.now()}`,
      scheduledTime: new Date(),
      type: 'habit_specific',
      data
    };

    await this.sendNotification(notification);
  }

  // ================================================================================================
  // UTILITY METHODS
  // ================================================================================================

  private clearRecentNotifications(): void {
    // Clear any pending notifications when user becomes active
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then(registration => {
        registration.getNotifications().then(notifications => {
          notifications.forEach(notification => {
            if (notification.tag?.includes('reminder') || notification.tag?.includes('streak')) {
              notification.close();
            }
          });
        });
      });
    }
  }

  private resetDailyNotifications(): void {
    this.notificationCount = 0;
    this.scheduledNotifications.clear();
  }

  // ================================================================================================
  // CONFIGURATION
  // ================================================================================================

  public updateConfig(newConfig: Partial<NotificationConfig>): void {
    this.config = { ...this.config, ...newConfig };
    
    if (!this.config.enabled) {
      this.scheduledNotifications.clear();
    }
    
    // Sync configuration with backend
    this.syncConfigWithBackend();
  }

  private async syncConfigWithBackend(): Promise<void> {
    try {
      if (typeof window !== 'undefined' && (window as any).__TAURI__) {
        const { invoke } = await import('@tauri-apps/api/core');
        
        // Convert our config to the backend format
        const backendConfig = {
          enabled: this.config.enabled,
          streak_reminders: this.config.streakReminders,
          random_reminders: this.config.randomReminders,
          reminder_start_hour: this.config.reminderTimeRange?.start || 9,
          reminder_end_hour: this.config.reminderTimeRange?.end || 21,
          max_reminders_per_day: this.config.maxRemindersPerDay || 3,
          streak_warning_threshold: 3, // Default threshold
          sound_enabled: this.config.soundEnabled || false,
          intelligent_timing: true,
          adaptive_frequency: true,
          streak_protection_hours: this.config.streakProtectionHours || [12, 18, 20]
        };
        
        await invoke('update_notification_config', { config: backendConfig });
        console.log('Configuration synced with backend');
      }
    } catch (error) {
      console.warn('Failed to sync config with backend:', error);
    }
  }

  public getConfig(): NotificationConfig {
    return { ...this.config };
  }

  public isNotificationSupported(): boolean {
    return this.isInitialized && this.config.enabled;
  }

  // ================================================================================================
  // CLEANUP
  // ================================================================================================

  public cleanup(): void {
    this.scheduledNotifications.clear();
    this.isInitialized = false;
  }
}

// ================================================================================================
// SINGLETON INSTANCE
// ================================================================================================

let notificationServiceInstance: NotificationService | null = null;

export const getNotificationService = (config?: Partial<NotificationConfig>): NotificationService => {
  if (!notificationServiceInstance) {
    notificationServiceInstance = new NotificationService(config);
  } else if (config) {
    notificationServiceInstance.updateConfig(config);
  }
  return notificationServiceInstance;
};

export const destroyNotificationService = () => {
  if (notificationServiceInstance) {
    notificationServiceInstance.cleanup();
    notificationServiceInstance = null;
  }
};

// ================================================================================================
// TYPES EXPORT
// ================================================================================================

export type { NotificationConfig, NotificationData, ScheduledNotification };