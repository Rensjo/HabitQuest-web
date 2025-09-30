/**
 * Tray Event Handler Service
 * Manages app behavior when hidden to system tray vs active window
 */

import { listen } from '@tauri-apps/api/event';

export interface TrayEventConfig {
  pauseAudioOnHide: boolean;
  pauseTimersOnHide: boolean;
  showTrayNotification: boolean;
}

export class TrayEventHandler {
  private config: TrayEventConfig;
  private isHiddenToTray: boolean = false;
  private soundService: any = null;
  private timers: number[] = [];
  private intervals: number[] = [];

  constructor(config: TrayEventConfig = {
    pauseAudioOnHide: true,
    pauseTimersOnHide: true,
    showTrayNotification: true
  }) {
    this.config = config;
    this.setupEventListeners();
  }

  public setSoundService(soundService: any) {
    this.soundService = soundService;
  }

  private async setupEventListeners() {
    try {
      // Listen for app hiding to tray
      await listen('app-hiding-to-tray', () => {
        console.log('🔽 App hiding to system tray - pausing activities');
        this.handleAppHidingToTray();
      });

      // Listen for app restored from tray
      await listen('app-restored-from-tray', () => {
        console.log('🔼 App restored from system tray - resuming activities');
        this.handleAppRestoredFromTray();
      });

      // Listen for window focus events
      await listen('app-window-focused', () => {
        console.log('👁️ App window focused - ensuring activities are active');
        this.handleWindowFocused();
      });

      await listen('app-window-unfocused', () => {
        console.log('👁️‍🗨️ App window unfocused - optionally reducing activity');
        this.handleWindowUnfocused();
      });

      console.log('✅ Tray event handlers setup complete');
    } catch (error) {
      console.error('❌ Failed to setup tray event listeners:', error);
    }
  }

  private handleAppHidingToTray() {
    this.isHiddenToTray = true;

    // Pause background music and sounds
    if (this.config.pauseAudioOnHide && this.soundService) {
      console.log('🔇 Pausing audio due to tray hide');
      this.soundService.stopBackgroundMusic();
      this.soundService.updateConfig({ 
        ...this.soundService.getConfig(),
        audioEnabled: false 
      });
    }

    // Clear any running timers/intervals that might be playing sounds
    if (this.config.pauseTimersOnHide) {
      console.log('⏸️ Pausing timers due to tray hide');
      this.pauseActiveTimers();
    }

    // Emit custom event for other components to react
    window.dispatchEvent(new CustomEvent('app-hidden-to-tray', {
      detail: { timestamp: Date.now() }
    }));

    // Show tray notification if enabled
    if (this.config.showTrayNotification) {
      this.showTrayHideNotification();
    }
  }

  private handleAppRestoredFromTray() {
    this.isHiddenToTray = false;

    // Resume audio if it was paused
    if (this.config.pauseAudioOnHide && this.soundService) {
      console.log('🔊 Resuming audio due to tray restore');
      this.soundService.updateConfig({ 
        ...this.soundService.getConfig(),
        audioEnabled: true 
      });
    }

    // Resume timers if they were paused
    if (this.config.pauseTimersOnHide) {
      console.log('▶️ Resuming timers due to tray restore');
      this.resumeActiveTimers();
    }

    // Emit custom event for other components to react
    window.dispatchEvent(new CustomEvent('app-restored-from-tray', {
      detail: { timestamp: Date.now() }
    }));
  }

  private handleWindowFocused() {
    // Ensure activities are fully active when window is focused
    if (!this.isHiddenToTray && this.soundService) {
      // Only enable audio if not hidden to tray
      this.soundService.updateConfig({ 
        ...this.soundService.getConfig(),
        audioEnabled: true 
      });
    }
  }

  private handleWindowUnfocused() {
    // Optionally reduce activity when window loses focus but isn't hidden
    // For now, we don't do anything special - just log
    console.log('Window unfocused but not hidden to tray');
  }

  private pauseActiveTimers() {
    // In a real implementation, you'd want to track and pause specific timers
    // For now, we'll dispatch an event that components can listen to
    window.dispatchEvent(new CustomEvent('pause-app-timers', {
      detail: { reason: 'hidden-to-tray' }
    }));
  }

  private resumeActiveTimers() {
    // Resume timers that were paused
    window.dispatchEvent(new CustomEvent('resume-app-timers', {
      detail: { reason: 'restored-from-tray' }
    }));
  }

  private showTrayHideNotification() {
    // Show a subtle notification that the app is now in the tray
    // This could be a toast or a temporary overlay
    window.dispatchEvent(new CustomEvent('show-tray-notification', {
      detail: { 
        message: 'HabitQuest is now running in the system tray',
        type: 'info',
        duration: 3000
      }
    }));
  }

  // Public methods for external components
  public isAppHiddenToTray(): boolean {
    return this.isHiddenToTray;
  }

  public updateConfig(newConfig: Partial<TrayEventConfig>) {
    this.config = { ...this.config, ...newConfig };
  }

  public getConfig(): TrayEventConfig {
    return { ...this.config };
  }

  // Method to register timers that should be paused when hidden
  public registerTimer(timer: number, type: 'timer' | 'interval' = 'timer') {
    if (type === 'timer') {
      this.timers.push(timer);
    } else {
      this.intervals.push(timer);
    }
  }

  // Clean up method
  public destroy() {
    // Clear any registered timers
    this.timers.forEach(timer => clearTimeout(timer));
    this.intervals.forEach(interval => clearInterval(interval));
    this.timers = [];
    this.intervals = [];
  }
}

// Create a singleton instance
let trayEventHandler: TrayEventHandler | null = null;

export function getTrayEventHandler(): TrayEventHandler {
  if (!trayEventHandler) {
    trayEventHandler = new TrayEventHandler();
  }
  return trayEventHandler;
}

export function initializeTrayEventHandler(soundService?: any): TrayEventHandler {
  const handler = getTrayEventHandler();
  if (soundService) {
    handler.setSoundService(soundService);
  }
  return handler;
}