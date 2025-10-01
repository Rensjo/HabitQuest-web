/**
 * ================================================================================================
 * LIGHTWEIGHT MEMORY MANAGEMENT HOOK
 * ================================================================================================
 * 
 * A non-intrusive memory management hook that provides:
 * - Basic memory monitoring (without breaking the UI)
 * - Proper app termination controls
 * - Optional tray minimize functionality
 * - Clean background process management
 * 
 * @version 1.0.0
 */

import { useEffect, useCallback } from 'react';
import { invoke } from '@tauri-apps/api/core';

interface MemoryManagementConfig {
  enableCleanup?: boolean;
  cleanupInterval?: number; // in minutes
  enableTrayMinimize?: boolean;
}

export function useMemoryManagement(config: MemoryManagementConfig = {}) {
  const {
    enableCleanup = true,
    cleanupInterval = 5, // 5 minutes
    enableTrayMinimize = false
  } = config;

  // Basic memory cleanup function (non-intrusive)
  const performLightCleanup = useCallback(() => {
    try {
      // Force garbage collection if available (development mode)
      if ((window as any).gc) {
        (window as any).gc();
      }
      
      // Clear any cached data periodically
      if ('caches' in window) {
        caches.keys().then(names => {
          names.forEach(name => caches.delete(name));
        });
      }
      
      console.log('Lightweight memory cleanup performed');
    } catch (error) {
      console.warn('Memory cleanup failed:', error);
    }
  }, []);

  // Exit app completely (no background processes)
  const exitAppCompletely = useCallback(async () => {
    try {
      await invoke('exit_app_completely');
    } catch (error) {
      console.error('Failed to exit app completely:', error);
      // Fallback to window close
      window.close();
    }
  }, []);

  // Minimize to tray (optional behavior)
  const minimizeToTray = useCallback(async () => {
    if (!enableTrayMinimize) {
      console.warn('Tray minimize is disabled');
      return;
    }
    
    try {
      await invoke('minimize_to_tray');
    } catch (error) {
      console.error('Failed to minimize to tray:', error);
    }
  }, [enableTrayMinimize]);

  // Set up periodic cleanup
  useEffect(() => {
    if (!enableCleanup) return;

    const interval = setInterval(() => {
      performLightCleanup();
    }, cleanupInterval * 60 * 1000); // Convert minutes to milliseconds

    return () => clearInterval(interval);
  }, [enableCleanup, cleanupInterval, performLightCleanup]);

  // Listen for app termination events
  useEffect(() => {
    const handleBeforeUnload = () => {
      console.log('App is shutting down, performing final cleanup');
      performLightCleanup();
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [performLightCleanup]);

  return {
    performLightCleanup,
    exitAppCompletely,
    minimizeToTray: enableTrayMinimize ? minimizeToTray : undefined,
  };
}