/**
 * ================================================================================================
 * ACTIVITY TRACKER SERVICE
 * ================================================================================================
 * 
 * Tracks user activity and app usage to determine when to send notifications
 * Integrates with notification service for smart reminder timing
 * 
 * @version 1.0.0
 */

interface ActivityData {
  lastAppOpen: string;
  lastHabitCompletion: string;
  totalSessions: number;
  dailySessions: Record<string, number>; // Date string -> session count
  weeklyActive: number;
  averageSessionLength: number; // in minutes
  habitCompletionTimes: Record<string, string[]>; // habitId -> completion times
  streakData: Record<string, {
    currentStreak: number;
    lastCompletionDate: string;
    streakRisk: boolean;
  }>;
}

interface SessionData {
  sessionId: string;
  startTime: Date;
  lastActivity: Date;
  endTime?: Date;
  habitCompletions: string[];
  interactionCount: number;
}

// ================================================================================================
// ACTIVITY TRACKER CLASS
// ================================================================================================

export class ActivityTracker {
  private activityData: ActivityData;
  private currentSession: SessionData | null = null;
  private inactivityTimer: NodeJS.Timeout | null = null;
  private readonly STORAGE_KEY = 'habitquest_activity_data';
  private readonly SESSION_TIMEOUT = 15 * 60 * 1000; // 15 minutes
  private readonly STREAK_RISK_HOURS = 20; // Hours until streak is at risk

  constructor() {
    this.activityData = this.loadActivityData();
    this.initializeSession();
    this.setupActivityListeners();
  }

  // ================================================================================================
  // INITIALIZATION
  // ================================================================================================

  private loadActivityData(): ActivityData {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        const data = JSON.parse(stored);
        return {
          lastAppOpen: new Date().toISOString(),
          lastHabitCompletion: data.lastHabitCompletion || '',
          totalSessions: data.totalSessions || 0,
          dailySessions: data.dailySessions || {},
          weeklyActive: data.weeklyActive || 0,
          averageSessionLength: data.averageSessionLength || 0,
          habitCompletionTimes: data.habitCompletionTimes || {},
          streakData: data.streakData || {},
        };
      }
    } catch (error) {
      console.warn('Failed to load activity data:', error);
    }

    return {
      lastAppOpen: new Date().toISOString(),
      lastHabitCompletion: '',
      totalSessions: 0,
      dailySessions: {},
      weeklyActive: 0,
      averageSessionLength: 0,
      habitCompletionTimes: {},
      streakData: {},
    };
  }

  private saveActivityData(): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.activityData));
    } catch (error) {
      console.warn('Failed to save activity data:', error);
    }
  }

  private initializeSession(): void {
    const now = new Date();
    this.currentSession = {
      sessionId: `session_${Date.now()}`,
      startTime: now,
      lastActivity: now,
      habitCompletions: [],
      interactionCount: 0,
    };

    // Update app open time
    this.activityData.lastAppOpen = now.toISOString();
    
    // Update daily session count
    const dateKey = this.getDateKey(now);
    this.activityData.dailySessions[dateKey] = (this.activityData.dailySessions[dateKey] || 0) + 1;
    
    this.activityData.totalSessions++;
    this.saveActivityData();

    console.log('New activity session started:', this.currentSession.sessionId);
  }

  private setupActivityListeners(): void {
    if (typeof window === 'undefined') return;

    // Track various user interactions
    const activityEvents = [
      'mousedown', 'mousemove', 'keydown', 'scroll', 
      'touchstart', 'click', 'focus', 'blur'
    ];

    activityEvents.forEach(event => {
      window.addEventListener(event, this.handleActivity.bind(this), { passive: true });
    });

    // Handle window focus/blur
    window.addEventListener('focus', this.handleWindowFocus.bind(this));
    window.addEventListener('blur', this.handleWindowBlur.bind(this));

    // Handle page unload
    window.addEventListener('beforeunload', this.handleSessionEnd.bind(this));
  }

  // ================================================================================================
  // ACTIVITY TRACKING
  // ================================================================================================

  private handleActivity(): void {
    if (!this.currentSession) return;

    this.currentSession.lastActivity = new Date();
    this.currentSession.interactionCount++;

    // Reset inactivity timer
    if (this.inactivityTimer) {
      clearTimeout(this.inactivityTimer);
    }

    // Set new inactivity timer
    this.inactivityTimer = setTimeout(() => {
      this.handleInactivity();
    }, this.SESSION_TIMEOUT);
  }

  private handleWindowFocus(): void {
    if (!this.currentSession) {
      this.initializeSession();
    } else {
      this.handleActivity();
    }
  }

  private handleWindowBlur(): void {
    // User switched to another app
    this.handleActivity(); // Update last activity
  }

  private handleInactivity(): void {
    console.log('User inactive, ending session');
    this.handleSessionEnd();
  }

  private handleSessionEnd(): void {
    if (!this.currentSession) return;

    const now = new Date();
    this.currentSession.endTime = now;

    // Calculate session length
    const sessionLength = (now.getTime() - this.currentSession.startTime.getTime()) / (1000 * 60); // minutes
    
    // Update average session length
    const totalLength = this.activityData.averageSessionLength * (this.activityData.totalSessions - 1) + sessionLength;
    this.activityData.averageSessionLength = totalLength / this.activityData.totalSessions;

    console.log(`Session ended: ${this.currentSession.sessionId}, duration: ${sessionLength.toFixed(1)} minutes`);
    
    this.saveActivityData();
    this.currentSession = null;

    if (this.inactivityTimer) {
      clearTimeout(this.inactivityTimer);
      this.inactivityTimer = null;
    }
  }

  // ================================================================================================
  // HABIT TRACKING
  // ================================================================================================

  public recordHabitCompletion(habitId: string, habitName: string): void {
    const now = new Date();
    const timestamp = now.toISOString();

    // Update last habit completion
    this.activityData.lastHabitCompletion = timestamp;

    // Record completion time for this habit
    if (!this.activityData.habitCompletionTimes[habitId]) {
      this.activityData.habitCompletionTimes[habitId] = [];
    }
    this.activityData.habitCompletionTimes[habitId].push(timestamp);

    // Update current session
    if (this.currentSession) {
      this.currentSession.habitCompletions.push(habitId);
    }

    // Update streak data
    this.updateStreakData(habitId, timestamp);

    this.saveActivityData();
    console.log(`Habit completion recorded: ${habitName} (${habitId})`);
  }

  private updateStreakData(habitId: string, completionTime: string): void {
    const today = this.getDateKey(new Date(completionTime));
    const streakData = this.activityData.streakData[habitId] || {
      currentStreak: 0,
      lastCompletionDate: '',
      streakRisk: false,
    };

    // Check if this is a consecutive day
    if (streakData.lastCompletionDate) {
      const lastDate = new Date(streakData.lastCompletionDate);
      const currentDate = new Date(completionTime);
      const daysDiff = this.getDaysDifference(lastDate, currentDate);

      if (daysDiff === 1) {
        // Consecutive day
        streakData.currentStreak++;
      } else if (daysDiff === 0) {
        // Same day, no streak change
        return;
      } else {
        // Streak broken
        streakData.currentStreak = 1;
      }
    } else {
      // First completion
      streakData.currentStreak = 1;
    }

    streakData.lastCompletionDate = today;
    streakData.streakRisk = false; // Reset risk since they just completed

    this.activityData.streakData[habitId] = streakData;
  }

  // ================================================================================================
  // STREAK ANALYSIS
  // ================================================================================================

  public getStreaksAtRisk(): Array<{
    habitId: string;
    streakCount: number;
    hoursRemaining: number;
  }> {
    const now = new Date();
    const riskyStreaks = [];

    for (const [habitId, streakData] of Object.entries(this.activityData.streakData)) {
      if (streakData.currentStreak > 0 && streakData.lastCompletionDate) {
        const lastCompletion = new Date(streakData.lastCompletionDate);
        const hoursSinceCompletion = (now.getTime() - lastCompletion.getTime()) / (1000 * 60 * 60);
        
        const hoursRemaining = 24 - hoursSinceCompletion;
        
        // Mark as at risk if less than specified hours remain
        if (hoursRemaining <= this.STREAK_RISK_HOURS && hoursRemaining > 0) {
          riskyStreaks.push({
            habitId,
            streakCount: streakData.currentStreak,
            hoursRemaining: Math.floor(hoursRemaining),
          });
        }
      }
    }

    return riskyStreaks;
  }

  public shouldSendStreakWarning(habitId: string): boolean {
    const streakData = this.activityData.streakData[habitId];
    if (!streakData || streakData.currentStreak === 0) return false;

    const now = new Date();
    const lastCompletion = new Date(streakData.lastCompletionDate);
    const hoursSinceCompletion = (now.getTime() - lastCompletion.getTime()) / (1000 * 60 * 60);
    
    // Send warning if more than 18 hours since last completion but less than 24
    return hoursSinceCompletion >= 18 && hoursSinceCompletion < 24;
  }

  // ================================================================================================
  // ACTIVITY ANALYSIS
  // ================================================================================================

  public hasBeenInactiveFor(hours: number): boolean {
    const lastActivity = new Date(this.activityData.lastAppOpen);
    const inactiveTime = Date.now() - lastActivity.getTime();
    return inactiveTime >= (hours * 60 * 60 * 1000);
  }

  public hasCompletedHabitsToday(): boolean {
    const today = this.getDateKey(new Date());
    
    for (const completionTimes of Object.values(this.activityData.habitCompletionTimes)) {
      for (const timestamp of completionTimes) {
        if (this.getDateKey(new Date(timestamp)) === today) {
          return true;
        }
      }
    }
    
    return false;
  }

  public getLastHabitCompletionHours(): number {
    if (!this.activityData.lastHabitCompletion) return Infinity;
    
    const lastCompletion = new Date(this.activityData.lastHabitCompletion);
    const hoursSince = (Date.now() - lastCompletion.getTime()) / (1000 * 60 * 60);
    
    return hoursSince;
  }

  public getWeeklyActivityScore(): number {
    const now = new Date();
    let activeDays = 0;
    
    // Check last 7 days
    for (let i = 0; i < 7; i++) {
      const checkDate = new Date(now);
      checkDate.setDate(checkDate.getDate() - i);
      const dateKey = this.getDateKey(checkDate);
      
      if (this.activityData.dailySessions[dateKey] > 0) {
        activeDays++;
      }
    }
    
    return (activeDays / 7) * 100; // Percentage
  }

  // ================================================================================================
  // OPTIMAL REMINDER TIMING
  // ================================================================================================

  public getOptimalReminderTimes(habitId?: string): number[] {
    // Analyze when user typically completes habits to suggest optimal reminder times
    const completionTimes: number[] = [];
    
    if (habitId && this.activityData.habitCompletionTimes[habitId]) {
      // Get completion times for specific habit
      this.activityData.habitCompletionTimes[habitId].forEach(timestamp => {
        const date = new Date(timestamp);
        const hour = date.getHours();
        completionTimes.push(hour);
      });
    } else {
      // Get all completion times
      Object.values(this.activityData.habitCompletionTimes).forEach(timestamps => {
        timestamps.forEach(timestamp => {
          const date = new Date(timestamp);
          const hour = date.getHours();
          completionTimes.push(hour);
        });
      });
    }
    
    if (completionTimes.length === 0) {
      // Default optimal times if no data
      return [9, 14, 19]; // 9 AM, 2 PM, 7 PM
    }
    
    // Find the most common hours
    const hourFrequency: Record<number, number> = {};
    completionTimes.forEach(hour => {
      hourFrequency[hour] = (hourFrequency[hour] || 0) + 1;
    });
    
    // Return top 3 most frequent hours
    return Object.entries(hourFrequency)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3)
      .map(([hour]) => parseInt(hour));
  }

  // ================================================================================================
  // UTILITY METHODS
  // ================================================================================================

  private getDateKey(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  private getDaysDifference(date1: Date, date2: Date): number {
    const day1 = this.getDateKey(date1);
    const day2 = this.getDateKey(date2);
    
    const d1 = new Date(day1);
    const d2 = new Date(day2);
    
    return Math.floor((d2.getTime() - d1.getTime()) / (1000 * 60 * 60 * 24));
  }

  // ================================================================================================
  // PUBLIC API
  // ================================================================================================

  public getActivityData(): ActivityData {
    return { ...this.activityData };
  }

  public getCurrentSession(): SessionData | null {
    return this.currentSession ? { ...this.currentSession } : null;
  }

  public getStats() {
    return {
      totalSessions: this.activityData.totalSessions,
      averageSessionLength: this.activityData.averageSessionLength,
      weeklyActivityScore: this.getWeeklyActivityScore(),
      lastHabitCompletionHours: this.getLastHabitCompletionHours(),
      hasCompletedHabitsToday: this.hasCompletedHabitsToday(),
      streaksAtRisk: this.getStreaksAtRisk(),
    };
  }

  public cleanup(): void {
    this.handleSessionEnd();
    
    if (this.inactivityTimer) {
      clearTimeout(this.inactivityTimer);
      this.inactivityTimer = null;
    }
  }
}

// ================================================================================================
// SINGLETON INSTANCE
// ================================================================================================

let activityTrackerInstance: ActivityTracker | null = null;

export const getActivityTracker = (): ActivityTracker => {
  if (!activityTrackerInstance) {
    activityTrackerInstance = new ActivityTracker();
  }
  return activityTrackerInstance;
};

export const destroyActivityTracker = () => {
  if (activityTrackerInstance) {
    activityTrackerInstance.cleanup();
    activityTrackerInstance = null;
  }
};

// ================================================================================================
// TYPES EXPORT
// ================================================================================================

export type { ActivityData, SessionData };