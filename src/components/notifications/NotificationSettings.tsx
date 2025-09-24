/**
 * ================================================================================================
 * NOTIFICATION SETTINGS COMPONENT
 * ================================================================================================
 * 
 * UI component for configuring habit reminder and notification preferences
 * Part of the Settings page for managing notification behavior
 * 
 * @version 1.0.0
 */

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Bell, Clock, Zap, Shield, Volume2, VolumeX, Settings, Info, AlertTriangle } from 'lucide-react';
import type { HabitReminderConfig } from '../../hooks/useHabitReminders';
import { NotificationPermissionManager, createPermissionInstructions } from '../../services/notificationPermissions';
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
  const [showPermissionHelp, setShowPermissionHelp] = useState(false);

  // Update local config when prop changes
  useEffect(() => {
    setLocalConfig(config);
  }, [config]);

  // Check notification permissions on mount
  useEffect(() => {
    checkPermissions();
  }, []);

  const checkPermissions = async () => {
    try {
      const status = await NotificationPermissionManager.checkAndRequestPermissions();
      setPermissionStatus(status);
      
      // If permissions aren't granted and notifications are enabled, show help
      if (!status.granted && localConfig.enabled) {
        setShowPermissionHelp(true);
      }
    } catch (error) {
      console.error('Failed to check notification permissions:', error);
    }
  };

  // ================================================================================================
  // HANDLERS
  // ================================================================================================

  const handleConfigChange = (key: keyof HabitReminderConfig, value: any) => {
    const newConfig = { ...localConfig, [key]: value };
    setLocalConfig(newConfig);
    onConfigChange({ [key]: value });
  };

  const handleTimeRangeChange = (type: 'start' | 'end', hour: number) => {
    const newRange = {
      ...localConfig.reminderTimeRange,
      [type]: hour,
    };
    handleConfigChange('reminderTimeRange', newRange);
  };

  const handleStreakHoursChange = (index: number, hour: number) => {
    const newHours = [...(localConfig.streakProtectionHours || [])];
    newHours[index] = hour;
    handleConfigChange('streakProtectionHours', newHours);
  };

  const testNotification = async () => {
    setIsTestingNotification(true);
    
    try {
      const success = await NotificationPermissionManager.testNotification();
      
      if (!success) {
        // Re-check permissions if test failed
        await checkPermissions();
        setShowPermissionHelp(true);
      }
    } catch (error) {
      console.error('Test notification failed:', error);
    }
    
    setTimeout(() => setIsTestingNotification(false), 2000);
  };

  const handleEnableNotifications = async () => {
    if (!localConfig.enabled) {
      // Check permissions before enabling
      await checkPermissions();
    }
    handleConfigChange('enabled', !localConfig.enabled);
  };

  // ================================================================================================
  // RENDER HELPERS
  // ================================================================================================

  const renderToggle = (
    key: keyof HabitReminderConfig, 
    label: string, 
    description: string, 
    icon: React.ReactNode
  ) => (
    <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10">
      <div className="flex items-start space-x-3">
        <div className="text-blue-400 mt-1">{icon}</div>
        <div>
          <h4 className="text-white font-medium">{label}</h4>
          <p className="text-gray-400 text-sm mt-1">{description}</p>
        </div>
      </div>
      <motion.button
        className={`relative w-12 h-6 rounded-full transition-colors duration-200 ${
          localConfig[key] ? 'bg-green-500' : 'bg-gray-600'
        }`}
        onClick={() => handleConfigChange(key, !localConfig[key])}
        whileTap={{ scale: 0.95 }}
      >
        <motion.div
          className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-md"
          animate={{
            left: localConfig[key] ? 26 : 2,
          }}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        />
      </motion.button>
    </div>
  );

  const renderSlider = (
    key: keyof HabitReminderConfig,
    label: string,
    min: number,
    max: number,
    step: number = 1,
    suffix: string = ''
  ) => (
    <div className="p-4 bg-white/5 rounded-lg border border-white/10">
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-white font-medium">{label}</h4>
        <span className="text-blue-400 font-mono">
          {String(localConfig[key])}{suffix}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={localConfig[key] as number}
        onChange={(e) => handleConfigChange(key, parseInt(e.target.value))}
        className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
      />
      <div className="flex justify-between text-xs text-gray-500 mt-1">
        <span>{min}{suffix}</span>
        <span>{max}{suffix}</span>
      </div>
    </div>
  );

  const renderTimeSelector = (label: string, value: number, onChange: (hour: number) => void) => (
    <div className="flex-1">
      <label className="block text-sm text-gray-400 mb-2">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(parseInt(e.target.value))}
        className="w-full p-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:border-blue-400 focus:outline-none"
      >
        {Array.from({ length: 24 }, (_, i) => (
          <option key={i} value={i}>
            {i.toString().padStart(2, '0')}:00
          </option>
        ))}
      </select>
    </div>
  );

  // ================================================================================================
  // RENDER
  // ================================================================================================

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <Bell className="w-5 h-5 text-blue-400" />
            Notification Settings
          </h3>
          <p className="text-gray-400 text-sm mt-1">
            Configure smart reminders to help maintain your habit streaks
          </p>
        </div>
        
        <motion.button
          onClick={testNotification}
          disabled={isTestingNotification}
          className={`px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 
                     text-white rounded-lg font-medium transition-colors duration-200
                     ${isTestingNotification ? 'cursor-not-allowed' : 'cursor-pointer'}`}
          whileTap={{ scale: 0.95 }}
        >
          {isTestingNotification ? 'Sending...' : 'Test Notification'}
        </motion.button>
      </div>

      {/* Main Settings */}
      <div className="space-y-4">
        {/* Enable Notifications with Permission Status */}
        <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10">
          <div className="flex items-start space-x-3">
            <div className="text-blue-400 mt-1">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-white font-medium">Enable Notifications</h4>
              <p className="text-gray-400 text-sm mt-1">
                Allow HabitQuest to send desktop notifications
              </p>
              {permissionStatus && !permissionStatus.granted && localConfig.enabled && (
                <div className="flex items-center gap-2 mt-2">
                  <AlertTriangle className="w-4 h-4 text-yellow-500" />
                  <span className="text-yellow-500 text-sm">
                    Notifications need OS permission
                  </span>
                </div>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            {permissionStatus && !permissionStatus.granted && localConfig.enabled && (
              <button
                onClick={() => setShowPermissionHelp(!showPermissionHelp)}
                className="px-3 py-1 bg-yellow-600 hover:bg-yellow-700 text-white text-sm rounded transition-colors"
              >
                Help
              </button>
            )}
            <motion.button
              className={`relative w-12 h-6 rounded-full transition-colors duration-200 ${
                localConfig.enabled ? 'bg-green-500' : 'bg-gray-600'
              }`}
              onClick={handleEnableNotifications}
              whileTap={{ scale: 0.95 }}
            >
              <motion.div
                className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-md"
                animate={{
                  left: localConfig.enabled ? 26 : 2,
                }}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              />
            </motion.button>
          </div>
        </div>

        {renderToggle(
          'streakReminders',
          'Streak Protection',
          'Get warned when your habit streaks are at risk',
          <Shield className="w-5 h-5" />
        )}

        {renderToggle(
          'randomReminders',
          'Smart Reminders',
          'Receive adaptive reminders based on your activity patterns',
          <Zap className="w-5 h-5" />
        )}

        {renderToggle(
          'soundEnabled',
          'Sound Effects',
          'Play sound when notifications are shown',
          localConfig.soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />
        )}

        {renderToggle(
          'intelligentTiming',
          'Intelligent Timing',
          'Use AI-powered timing based on your usage patterns',
          <Clock className="w-5 h-5" />
        )}

        {renderToggle(
          'adaptiveFrequency',
          'Adaptive Frequency',
          'Reduce notifications when you\'re already active',
          <Settings className="w-5 h-5" />
        )}
      </div>

      {/* Permission Help */}
      {showPermissionHelp && permissionStatus && !permissionStatus.granted && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg"
        >
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-yellow-400 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <h5 className="text-yellow-300 font-medium mb-2">Setup Required</h5>
              <div className="text-yellow-100/80 text-sm whitespace-pre-line">
                {createPermissionInstructions(permissionStatus)}
              </div>
              <div className="flex gap-2 mt-3">
                <button
                  onClick={checkPermissions}
                  className="px-3 py-1 bg-yellow-600 hover:bg-yellow-700 text-white text-sm rounded transition-colors"
                >
                  Check Again
                </button>
                <button
                  onClick={() => setShowPermissionHelp(false)}
                  className="px-3 py-1 bg-gray-600 hover:bg-gray-700 text-white text-sm rounded transition-colors"
                >
                  Dismiss
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Advanced Settings */}
      {localConfig.enabled && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="space-y-4"
        >
          <h4 className="text-lg font-semibold text-white flex items-center gap-2 mt-8">
            <Settings className="w-4 h-4 text-blue-400" />
            Advanced Settings
          </h4>

          {/* Daily Reminder Limits */}
          {renderSlider(
            'maxRemindersPerDay',
            'Max Reminders per Day',
            0,
            5,
            1,
            ' reminders'
          )}

          {/* Streak Warning Threshold */}
          {renderSlider(
            'streakWarningThreshold',
            'Streak Warning Threshold',
            1,
            30,
            1,
            ' days'
          )}

          {/* Reminder Time Range */}
          <div className="p-4 bg-white/5 rounded-lg border border-white/10">
            <h4 className="text-white font-medium mb-3">Active Hours</h4>
            <p className="text-gray-400 text-sm mb-4">
              Set the time range when you want to receive reminders
            </p>
            <div className="flex gap-4">
              {renderTimeSelector(
                'Start Time',
                localConfig.reminderTimeRange?.start || 9,
                (hour) => handleTimeRangeChange('start', hour)
              )}
              {renderTimeSelector(
                'End Time',
                localConfig.reminderTimeRange?.end || 21,
                (hour) => handleTimeRangeChange('end', hour)
              )}
            </div>
          </div>

          {/* Streak Protection Hours */}
          {localConfig.streakReminders && (
            <div className="p-4 bg-white/5 rounded-lg border border-white/10">
              <h4 className="text-white font-medium mb-3">Streak Protection Times</h4>
              <p className="text-gray-400 text-sm mb-4">
                Specific hours when streak warnings will be sent
              </p>
              <div className="grid grid-cols-3 gap-4">
                {(localConfig.streakProtectionHours || []).map((hour, index) => (
                  <div key={index}>
                    <label className="block text-xs text-gray-500 mb-1">
                      Warning {index + 1}
                    </label>
                    <select
                      value={hour}
                      onChange={(e) => handleStreakHoursChange(index, parseInt(e.target.value))}
                      className="w-full p-2 bg-gray-800 border border-gray-600 rounded text-white text-sm"
                    >
                      {Array.from({ length: 24 }, (_, i) => (
                        <option key={i} value={i}>
                          {i.toString().padStart(2, '0')}:00
                        </option>
                      ))}
                    </select>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Info Box */}
          <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
              <div>
                <h5 className="text-blue-300 font-medium mb-1">How Smart Notifications Work</h5>
                <p className="text-blue-100/80 text-sm leading-relaxed">
                  HabitQuest learns from your activity patterns to send notifications at optimal times. 
                  Streak protection warns you when habits are at risk, while adaptive reminders 
                  reduce frequency when you're already active. All notifications respect your 
                  configured active hours and daily limits.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Custom Styles */}
      <style>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #3b82f6;
          cursor: pointer;
          border: 2px solid #1e40af;
        }
        
        .slider::-moz-range-thumb {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #3b82f6;
          cursor: pointer;
          border: 2px solid #1e40af;
        }
      `}</style>
    </div>
  );
}

// ================================================================================================
// TYPES EXPORT
// ================================================================================================

export type { NotificationSettingsProps };