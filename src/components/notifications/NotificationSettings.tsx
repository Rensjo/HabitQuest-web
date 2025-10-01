/**
 * ================================================================================================
 * SIMPLIFIED NOTIFICATION SETTINGS COMPONENT
 * ================================================================================================
 * 
 * Streamlined notification settings for habit reminders
 * Focuses on key features: streak protection, evening reminders, startup notifications
 * 
 * @version 2.1.0
 */

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Shield, Clock, Monitor, Play, Info } from 'lucide-react';
import { invoke } from '@tauri-apps/api/core';
import type { HabitReminderConfig } from '../../hooks/useHabitReminders';
import { NotificationPermissionManager } from '../../services/notificationPermissions';
import type { NotificationPermissionStatus } from '../../services/notificationPermissions';

interface NotificationSettingsProps {
  config: HabitReminderConfig;
  onConfigChange: (config: Partial<HabitReminderConfig>) => void;
  className?: string;
}

// ================================================================================================
// COMPONENT
// ================================================================================================

export default function NotificationSettings({ 
  config, 
  onConfigChange, 
  className = '' 
}: NotificationSettingsProps) {
  
  const [localConfig, setLocalConfig] = useState<HabitReminderConfig>(config);
  const [isTestingNotification, setIsTestingNotification] = useState(false);
  const [permissionStatus, setPermissionStatus] = useState<NotificationPermissionStatus | null>(null);
  const [backgroundServiceStatus, setBackgroundServiceStatus] = useState<'unknown' | 'running' | 'stopped'>('unknown');

  // Update local config when prop changes
  useEffect(() => {
    setLocalConfig(config);
  }, [config]);

  // Check notification permissions and background service on mount
  useEffect(() => {
    checkPermissions();
    checkBackgroundService();
  }, []);

  const checkPermissions = async () => {
    try {
      const manager = new NotificationPermissionManager();
      const status = await manager.checkPermission();
      setPermissionStatus(status);
    } catch (error) {
      console.error('Failed to check notification permissions:', error);
    }
  };

  const checkBackgroundService = async () => {
    try {
      const isRunning = await invoke('is_background_service_running');
      setBackgroundServiceStatus(isRunning ? 'running' : 'stopped');
    } catch (error) {
      console.error('Failed to check background service:', error);
      setBackgroundServiceStatus('unknown');
    }
  };

  const handleConfigChange = useCallback((updates: Partial<HabitReminderConfig>) => {
    const newConfig = { ...localConfig, ...updates };
    setLocalConfig(newConfig);
    onConfigChange(updates);
  }, [localConfig, onConfigChange]);

  const handleSendTestNotification = async () => {
    setIsTestingNotification(true);
    try {
      await invoke('init_notifications_and_send_test');
      
      // Check permissions again after test
      setTimeout(() => {
        checkPermissions();
        setIsTestingNotification(false);
      }, 2000);
    } catch (error) {
      console.error('Failed to send test notification:', error);
      setIsTestingNotification(false);
    }
  };

  return (
    <div className={`space-y-6 ${className}`}>
      
      {/* Header */}
      <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
            <Bell className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
              Smart Habit Reminders
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Stay consistent with intelligent notifications
            </p>
          </div>
        </div>
      </div>

      {/* Main Settings */}
      <div className="space-y-4">
        
        {/* Enable Notifications Toggle */}
        <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-start space-x-3">
            <div className="text-blue-500 mt-1">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-gray-900 dark:text-white font-medium">Enable Smart Reminders</h4>
              <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                Get timely reminders to maintain your habit streaks
              </p>
              {permissionStatus && !permissionStatus.granted && localConfig.enabled && (
                <div className="mt-2 p-2 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded">
                  <span className="text-yellow-700 dark:text-yellow-300 text-sm">
                    ⚠️ Notifications are disabled in system settings. Please enable them for HabitQuest.
                  </span>
                </div>
              )}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={localConfig.enabled}
                onChange={(e) => handleConfigChange({ enabled: e.target.checked })}
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </div>

        {/* Streak Protection Settings */}
        {localConfig.enabled && (
          <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3 mb-4">
              <Shield className="w-5 h-5 text-green-500" />
              <h4 className="text-gray-900 dark:text-white font-medium">Streak Protection</h4>
            </div>
            
            <div className="space-y-4">
              {/* Streak Protection Hours */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Send reminder after hours of inactivity
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="range"
                    min="1"
                    max="24"
                    value={localConfig.streakProtectionHours?.[0] || 20}
                    onChange={(e) => handleConfigChange({ 
                      streakProtectionHours: [parseInt(e.target.value)] 
                    })}
                    className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                  />
                  <span className="text-blue-600 dark:text-blue-400 font-mono text-sm min-w-[3rem]">
                    {localConfig.streakProtectionHours?.[0] || 20}h
                  </span>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Default: 20 hours (protects daily streaks)
                </p>
              </div>

              {/* Evening Reminder */}
              <div className="flex items-center justify-between">
                <div>
                  <h5 className="text-gray-900 dark:text-white font-medium">Evening Reminder</h5>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    Daily reminder between 9-11 PM
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={localConfig.eveningReminder !== false}
                    onChange={(e) => handleConfigChange({ eveningReminder: e.target.checked })}
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                </label>
              </div>

              {/* Startup Reminder */}
              <div className="flex items-center justify-between">
                <div>
                  <h5 className="text-gray-900 dark:text-white font-medium">Startup Reminder</h5>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    Reminder 5 minutes after device startup
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={localConfig.startupReminder !== false}
                    onChange={(e) => handleConfigChange({ startupReminder: e.target.checked })}
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>
          </div>
        )}

        {/* Background Service Status */}
        {localConfig.enabled && (
          <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Monitor className="w-5 h-5 text-blue-500" />
                <div>
                  <h4 className="text-gray-900 dark:text-white font-medium">Background Service</h4>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    {localConfig.enabled 
                      ? "Enables notifications when app is closed"
                      : "Disabled - Enable notifications to activate background service"
                    }
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${
                  backgroundServiceStatus === 'running' 
                    ? 'bg-green-500' 
                    : backgroundServiceStatus === 'stopped' 
                    ? 'bg-red-500' 
                    : 'bg-yellow-500'
                }`}></div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300 capitalize">
                  {backgroundServiceStatus}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Test Notification Button */}
        {localConfig.enabled && (
          <div className="flex justify-center">
            <button
              onClick={handleSendTestNotification}
              disabled={isTestingNotification}
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg font-medium transition-colors"
            >
              {isTestingNotification ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Sending...
                </>
              ) : (
                <>
                  <Play className="w-4 h-4" />
                  Test Notification
                </>
              )}
            </button>
          </div>
        )}

        {/* Quick Setup Helper */}
        {localConfig.enabled && permissionStatus && !permissionStatus.granted && (
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
              <div className="flex-1">
                <h4 className="text-blue-900 dark:text-blue-100 font-medium mb-2">Enable Notifications</h4>
                <p className="text-blue-800 dark:text-blue-200 text-sm mb-3">
                  To receive habit reminders, please enable notifications in your system settings:
                </p>
                <div className="space-y-2 text-sm text-blue-800 dark:text-blue-200">
                  <p>• Press <kbd className="bg-blue-200 dark:bg-blue-800 text-blue-900 dark:text-blue-100 px-2 py-1 rounded text-xs">Win + I</kbd> → System → Notifications</p>
                  <p>• Find "HabitQuest" and turn ON notifications</p>
                  <p>• Make sure "Show notification banners" is enabled</p>
                </div>
                <button
                  onClick={handleSendTestNotification}
                  className="mt-3 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
                >
                  Test After Setup
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}