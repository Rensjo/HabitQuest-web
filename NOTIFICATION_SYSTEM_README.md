# HabitQuest Notification System

## Overview

The HabitQuest notification system provides intelligent, cross-platform desktop notifications to help users maintain their habit streaks and stay engaged with the app. The system uses activity tracking, smart scheduling, and adaptive algorithms to send timely reminders that protect streaks without being intrusive.

## Key Features

### 🎯 **Smart Streak Protection**
- **Streak Warnings**: Automatic notifications when habit streaks are at risk
- **Configurable Thresholds**: Set minimum streak lengths for protection (default: 3 days)
- **Multiple Warning Times**: Customizable reminder times throughout the day

### 🤖 **Intelligent Timing**
- **Activity-Based Scheduling**: Learns from user behavior patterns
- **Adaptive Frequency**: Reduces notifications for highly active users
- **Optimal Timing**: Sends reminders when users are most likely to engage

### 🔔 **Cross-Platform Notifications**
- **Native Desktop Notifications**: Uses Tauri for Windows, macOS, and Linux
- **Web Notifications**: Fallback support for web environments
- **Sound Effects**: Optional audio feedback with notifications

### ⚙️ **Comprehensive Settings**
- **Fine-Grained Control**: Configure all aspects of notification behavior
- **Time Ranges**: Set active hours for receiving notifications
- **Daily Limits**: Control maximum notifications per day
- **Test Notifications**: Preview how notifications will appear

## Architecture

### Components

```
src/
├── services/
│   ├── notificationService.ts     # Core notification scheduling & delivery
│   ├── activityTracker.ts         # User activity monitoring & analysis
│   └── optimizedAudioService.ts   # Sound effect management
├── hooks/
│   └── useHabitReminders.ts       # React integration hook
├── components/
│   └── notifications/
│       ├── NotificationSettings.tsx # Settings UI component
│       └── NotificationSystem.tsx   # In-app notification display
└── src-tauri/
    └── src/
        └── lib.rs                  # Rust backend for native notifications
```

### Data Flow

```
App Component
    ↓
useHabitReminders Hook
    ↓
┌─ NotificationService ←→ Tauri Backend (Native Notifications)
└─ ActivityTracker ←→ localStorage (User Activity Data)
```

## Configuration

### Default Configuration

```typescript
const defaultConfig: HabitReminderConfig = {
  enabled: true,                    // Enable/disable all notifications
  streakReminders: true,            // Streak protection warnings
  randomReminders: true,            // Smart adaptive reminders
  reminderTimeRange: {              // Active notification hours
    start: 8,                       // 8 AM
    end: 22                         // 10 PM
  },
  maxRemindersPerDay: 2,           // Daily notification limit
  streakWarningThreshold: 3,        // Minimum streak days for warnings
  soundEnabled: false,              // Sound effects with notifications
  intelligentTiming: true,          // AI-powered timing optimization
  adaptiveFrequency: true,          // Activity-based frequency adjustment
  streakProtectionHours: [12, 18, 20] // Specific warning times (12PM, 6PM, 8PM)
}
```

### Settings UI

The `NotificationSettings` component provides a comprehensive interface for users to configure:

- **Toggle switches** for enabling/disabling features
- **Sliders** for numerical settings (limits, thresholds)
- **Time selectors** for setting active hours and warning times
- **Test button** to preview notification appearance
- **Information sections** explaining how features work

## Integration

### App-Level Integration

```typescript
// In App.tsx
import { useHabitReminders } from './hooks/useHabitReminders';

const habitReminders = useHabitReminders({
  habits: habits,
  onNotificationClick: (habitId) => {
    // Handle notification clicks
    scrollToHabit(habitId);
  }
});

// Enhanced habit completion handler
const handleHabitCompleteWithNotifications = useCallback((habitId: string, date: Date) => {
  handleHabitComplete(habitId, date);
  const habit = habits.find(h => h.id === habitId);
  if (habit) {
    habitReminders.recordHabitCompletion(habitId, habit.title);
  }
}, [handleHabitComplete, habits, habitReminders]);
```

### Settings Integration

```typescript
// In SettingsPage.tsx
import NotificationSettings from './notifications/NotificationSettings';

<NotificationSettings 
  config={notificationConfig}
  onConfigChange={handleNotificationConfigChange}
/>
```

## Technical Implementation

### NotificationService

**Core Features:**
- Notification scheduling with intelligent timing
- Cross-platform delivery (Tauri + Web fallback)
- Activity-based reminder optimization
- Streak protection algorithms

**Key Methods:**
- `scheduleNotification(options)` - Schedule timed notifications
- `sendNotification(options)` - Send immediate notifications
- `updateActivity()` - Record user activity
- `updateConfig(config)` - Update notification settings

### ActivityTracker

**Core Features:**
- Session tracking and user behavior analysis
- Streak risk assessment
- Optimal timing calculation
- Activity pattern learning

**Key Methods:**
- `recordActivity()` - Log user activity
- `hasBeenInactiveFor(hours)` - Check inactivity periods
- `getStreaksAtRisk()` - Identify at-risk streaks
- `getOptimalReminderTime()` - Calculate best reminder timing

### useHabitReminders Hook

**Provides:**
- Unified interface for all notification features
- React lifecycle integration
- Habit completion tracking
- Configuration management

**Returns:**
- `recordHabitCompletion()` - Record when habits are completed
- `sendImmediateReminder()` - Send on-demand reminders
- `updateConfig()` - Update notification settings
- `getStats()` - Get notification statistics

## Notification Types

### 1. Streak Protection Warnings
```
🔥 Streak Alert - Daily Exercise
Your 7-day streak is at risk! Complete your habit to keep it alive.
```

### 2. Smart Reminders
```
🎯 Habit Reminder - Reading
It's been a while since you've checked in. Ready to make progress?
```

### 3. Encouragement Notifications
```
⭐ You're doing great!
Keep up the momentum with your habits today!
```

### 4. Achievement Celebrations
```
🏆 New Milestone!
You've completed Meditation for 30 days straight!
```

## Browser Permissions

The system automatically handles notification permissions:

1. **First Visit**: Requests permission when notifications are enabled
2. **Permission Denied**: Falls back to in-app notifications only
3. **Permission Granted**: Uses native browser/OS notifications

## Tauri Integration

### Backend Commands

```rust
// src-tauri/src/lib.rs

#[tauri::command]
fn tauri_notification_supported() -> bool {
    // Check if native notifications are available
}

#[tauri::command]
async fn tauri_request_notification_permission() -> bool {
    // Request notification permissions
}

#[tauri::command]
async fn tauri_send_notification(title: String, body: String, icon: Option<String>) -> Result<(), String> {
    // Send native desktop notification
}
```

### Configuration

Native notifications require appropriate permissions in `tauri.conf.json`:

```json
{
  "permissions": [
    "core:default",
    "notification:default"
  ]
}
```

## Usage Examples

### Basic Setup

```typescript
// Initialize with default settings
const { recordHabitCompletion, updateConfig } = useHabitReminders();

// Record habit completion
recordHabitCompletion("habit-123", "Daily Exercise");

// Update settings
updateConfig({
  maxRemindersPerDay: 3,
  reminderTimeRange: { start: 9, end: 20 }
});
```

### Advanced Configuration

```typescript
// Setup with custom configuration
const { getStats, getStreaksAtRisk } = useHabitReminders({
  config: {
    enabled: true,
    intelligentTiming: true,
    adaptiveFrequency: true,
    streakWarningThreshold: 7,
    maxRemindersPerDay: 1
  },
  habits: userHabits,
  onNotificationClick: handleNotificationClick
});

// Monitor notification effectiveness
const stats = getStats();
console.log(`Notifications sent today: ${stats.sentToday}`);

// Check which streaks need protection
const riskyStreaks = getStreaksAtRisk();
riskyStreaks.forEach(streak => {
  console.log(`${streak.habitName}: ${streak.daysSinceCompletion} days inactive`);
});
```

## Testing

### Manual Testing

1. **Enable Notifications**: Go to Settings → Notification Settings
2. **Test Notification**: Click "Test Notification" button
3. **Complete Habits**: Mark habits as complete to trigger activity tracking
4. **Wait for Reminders**: Set short time ranges to see reminders quickly

### Development Testing

```typescript
// Force send a reminder
habitReminders.sendImmediateReminder("habit-123");

// Check activity status
const isInactive = habitReminders.isInactive(24); // 24 hours
console.log("User inactive for 24h:", isInactive);

// Get notification statistics
const stats = habitReminders.getStats();
console.log("Notification stats:", stats);
```

## Performance Considerations

- **Efficient Scheduling**: Uses single intervals instead of multiple timers
- **Smart Caching**: Activity data cached in localStorage for persistence
- **Adaptive Algorithms**: Learns user patterns to minimize unnecessary notifications
- **Resource Management**: Proper cleanup of intervals and event listeners

## Privacy & Data

- **Local Storage Only**: All activity data stored locally in browser localStorage
- **No External Tracking**: No data sent to external services
- **User Control**: Complete control over notification frequency and timing
- **Transparent Operation**: All notification logic is open and auditable

## Future Enhancements

- **Machine Learning**: Advanced pattern recognition for optimal timing
- **Habit Categories**: Category-specific notification strategies  
- **Social Features**: Team/friend notifications and challenges
- **Mobile Integration**: Push notifications for mobile versions
- **Analytics Dashboard**: Detailed notification effectiveness metrics