/**
 * ================================================================================================
 * OS NOTIFICATION PERMISSION MANAGER
 * ================================================================================================
 * 
 * Handles requesting and managing OS-level notification permissions
 * Provides user guidance for enabling notifications on different platforms
 * 
 * @version 1.0.0
 */

export interface NotificationPermissionStatus {
  granted: boolean;
  platform: string;
  needsManualSetup: boolean;
  instructions?: string[];
}

// ================================================================================================
// PERMISSION MANAGER CLASS
// ================================================================================================

export class NotificationPermissionManager {
  
  public static async checkAndRequestPermissions(): Promise<NotificationPermissionStatus> {
    const platform = await this.detectPlatform();
    
    // First try web notifications if available
    if ('Notification' in window) {
      const webPermission = await this.handleWebNotifications();
      if (webPermission.granted) {
        return {
          granted: true,
          platform,
          needsManualSetup: false
        };
      }
    }

    // Try Tauri native notifications
    if (typeof window !== 'undefined' && (window as any).__TAURI__) {
      const tauriPermission = await this.handleTauriNotifications();
      if (tauriPermission.granted) {
        return {
          granted: true,
          platform,
          needsManualSetup: false
        };
      }
    }

    // If both failed, return platform-specific instructions
    return this.getPlatformInstructions(platform);
  }

  private static async detectPlatform(): Promise<string> {
    // Use user agent detection for now
    const userAgent = navigator.userAgent.toLowerCase();
    if (userAgent.includes('win')) return 'windows';
    if (userAgent.includes('mac')) return 'macos';
    if (userAgent.includes('linux')) return 'linux';
    return 'unknown';
  }

  private static async handleWebNotifications(): Promise<{ granted: boolean }> {
    if (!('Notification' in window)) {
      return { granted: false };
    }

    if (Notification.permission === 'granted') {
      return { granted: true };
    }

    if (Notification.permission === 'denied') {
      return { granted: false };
    }

    try {
      const permission = await Notification.requestPermission();
      return { granted: permission === 'granted' };
    } catch (error) {
      console.error('Error requesting web notification permission:', error);
      return { granted: false };
    }
  }

  private static async handleTauriNotifications(): Promise<{ granted: boolean }> {
    try {
      if (typeof window !== 'undefined' && (window as any).__TAURI__) {
        const { invoke } = await import('@tauri-apps/api/core');
        
        const isSupported = await invoke('tauri_notification_supported').catch(() => false);
        if (!isSupported) {
          return { granted: false };
        }
        
        const hasPermission = await invoke('tauri_request_notification_permission').catch(() => false);
        return { granted: Boolean(hasPermission) };
      }
    } catch (error) {
      console.error('Error with Tauri notifications:', error);
    }
    
    return { granted: false };
  }

  private static getPlatformInstructions(platform: string): NotificationPermissionStatus {
    const instructions: { [key: string]: string[] } = {
      windows: [
        "1. Open Windows Settings (Win + I)",
        "2. Go to System → Notifications & actions",
        "3. Make sure 'Get notifications from apps and other senders' is ON",
        "4. Find 'HabitQuest' in the list and make sure it's enabled",
        "5. Restart HabitQuest for changes to take effect"
      ],
      macos: [
        "1. Open System Preferences → Notifications & Focus",
        "2. Find 'HabitQuest' in the application list",
        "3. Enable 'Allow Notifications'",
        "4. Choose your preferred notification style (Banners or Alerts)",
        "5. Restart HabitQuest for changes to take effect"
      ],
      linux: [
        "1. Notification settings vary by desktop environment:",
        "   • GNOME: Settings → Notifications",
        "   • KDE: System Settings → Notifications", 
        "   • Other: Check your desktop's notification settings",
        "2. Ensure desktop notifications are enabled",
        "3. Make sure HabitQuest has notification permissions",
        "4. Restart HabitQuest for changes to take effect"
      ]
    };

    return {
      granted: false,
      platform,
      needsManualSetup: true,
      instructions: instructions[platform] || instructions['linux']
    };
  }

  public static async testNotification(): Promise<boolean> {
    try {
      // Try web notification first
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('🎯 HabitQuest Test', {
          body: 'Notifications are working correctly!',
          icon: '/favicon.png',
          tag: 'test'
        });
        return true;
      }

      // Try Tauri notification via custom command
      if (typeof window !== 'undefined' && (window as any).__TAURI__) {
        const { invoke } = await import('@tauri-apps/api/core');
        await invoke('tauri_send_notification', {
          title: '🎯 HabitQuest Test',
          body: 'Notifications are working correctly!',
          icon: 'habitquest-icon'
        });
        return true;
      }

      return false;
    } catch (error) {
      console.error('Failed to send test notification:', error);
      return false;
    }
  }

  public static getNotificationStatus(): string {
    if ('Notification' in window) {
      switch (Notification.permission) {
        case 'granted':
          return 'enabled';
        case 'denied':
          return 'blocked';
        case 'default':
          return 'not-requested';
        default:
          return 'unknown';
      }
    }
    
    return 'not-supported';
  }
}

// ================================================================================================
// PERMISSION STATUS DISPLAY COMPONENT
// ================================================================================================

export interface PermissionStatusDisplayProps {
  status: NotificationPermissionStatus;
  onRetry: () => void;
  onDismiss?: () => void;
}

export function createPermissionInstructions(status: NotificationPermissionStatus): string {
  if (status.granted) {
    return "✅ Notifications are enabled and working!";
  }

  if (!status.needsManualSetup) {
    return "❌ Notifications are not available on this device.";
  }

  let instructions = `🔔 To enable notifications on ${status.platform.toUpperCase()}:\n\n`;
  
  if (status.instructions) {
    instructions += status.instructions.join('\n') + '\n\n';
  }
  
  instructions += "After following these steps, click 'Test Notification' to verify it's working.";
  
  return instructions;
}