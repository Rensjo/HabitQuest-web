import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { featureIcons } from '../../utils/icons';
import { useSoundEffectsOnly } from '../../hooks/useSoundEffects';
import { useTheme } from '../../hooks/useTheme';
import { useAppStore } from '../../store/appStore';
import { calculateStorageHealth, formatBytes, getStorageHealthColor, getStorageHealthBgColor, cleanupCacheData, type StorageHealth } from '../../utils/storageHealth';
import NotificationSettings from '../notifications/NotificationSettings';
import { useHabitReminders } from '../../hooks/useHabitReminders';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  audioEnabled: boolean;
  backgroundMusicEnabled: boolean;
  soundEffectsVolume: number;
  backgroundMusicVolume: number;
  onAudioEnabledChange: (enabled: boolean) => void;
  onBackgroundMusicEnabledChange: (enabled: boolean) => void;
  onSoundEffectsVolumeChange: (volume: number) => void;
  onBackgroundMusicVolumeChange: (volume: number) => void;
}

export function SettingsModal({
  isOpen,
  onClose,
  audioEnabled,
  backgroundMusicEnabled,
  soundEffectsVolume,
  backgroundMusicVolume,
  onAudioEnabledChange,
  onBackgroundMusicEnabledChange,
  onSoundEffectsVolumeChange,
  onBackgroundMusicVolumeChange
}: SettingsModalProps) {
  const { playButtonClick: playClick } = useSoundEffectsOnly();
  const { theme, setTheme, gradientColors, setGradientColors } = useTheme();
  const { exportData, importData, resetData, settings, updateSettings } = useAppStore();
  const { updateConfig } = useHabitReminders();
  
  // Notification configuration state
  const [notificationConfig, setNotificationConfig] = useState({
    enabled: settings.notifications || false,
    streakReminders: true,
    randomReminders: true,
    reminderTimeRange: { start: 9, end: 21 },
    maxRemindersPerDay: 2,
    streakWarningThreshold: 3,
    soundEnabled: settings.soundEffects || false,
    intelligentTiming: true,
    adaptiveFrequency: true,
    streakProtectionHours: [12, 18, 20]
  });
  
  // Storage health state
  const [storageHealth, setStorageHealth] = useState<StorageHealth | null>(null);
  const [isRefreshingStorage, setIsRefreshingStorage] = useState(false);

  const handleClose = () => {
    playClick();
    onClose();
  };

  const handleNotificationConfigChange = (config: any) => {
    const newConfig = { ...notificationConfig, ...config };
    setNotificationConfig(newConfig);
    
    // Update app store settings
    if (config.enabled !== undefined) {
      updateSettings({ notifications: config.enabled });
    }
    if (config.soundEnabled !== undefined) {
      updateSettings({ soundEffects: config.soundEnabled });
    }
    
    // Update habit reminders
    updateConfig(config);
  };

  // Sync notification config with app store settings changes
  useEffect(() => {
    setNotificationConfig(prev => ({
      ...prev,
      enabled: settings.notifications || false,
      soundEnabled: settings.soundEffects || false,
    }));
  }, [settings.notifications, settings.soundEffects]);

  const handleAudioToggle = () => {
    playClick();
    onAudioEnabledChange(!audioEnabled);
  };

  const handleBackgroundMusicToggle = () => {
    playClick();
    onBackgroundMusicEnabledChange(!backgroundMusicEnabled);
  };

  const handleSoundEffectsVolumeChange = (volume: number) => {
    onSoundEffectsVolumeChange(volume);
  };

  const handleBackgroundMusicVolumeChange = (volume: number) => {
    onBackgroundMusicVolumeChange(volume);
  };

  // Data management state
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [importResult, setImportResult] = useState<any>(null);
  const [showImportOptions, setShowImportOptions] = useState(false);
  const [pendingImportData, setPendingImportData] = useState<string | null>(null);

  const handleExport = async () => {
    playClick();
    setIsExporting(true);
    
    try {
      // Add a small delay for UI feedback
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const data = exportData();
      const blob = new Blob([data], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      
      const timestamp = new Date().toISOString().split('T')[0];
      const timeString = new Date().toLocaleTimeString('en-US', { 
        hour12: false, 
        hour: '2-digit', 
        minute: '2-digit' 
      }).replace(':', '');
      
      a.download = `habitquest-backup-${timestamp}-${timeString}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      // Show success feedback
      alert('✅ Data exported successfully! Your backup file has been downloaded.');
    } catch (error) {
      alert('❌ Export failed. Please try again.');
      console.error('Export error:', error);
    } finally {
      setIsExporting(false);
    }
  };

  const handleImportFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    setIsImporting(true);
    
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = e.target?.result as string;
        
        // Validate the data first
        const parsed = JSON.parse(data);
        const validation = useAppStore.getState().validateImportData(parsed);
        
        if (!validation.isValid) {
          alert(`❌ Invalid backup file:\n${validation.errors.join('\n')}`);
          setIsImporting(false);
          return;
        }
        
        // Show import options for user to choose merge mode
        setPendingImportData(data);
        setShowImportOptions(true);
        setIsImporting(false);
        
      } catch (error) {
        alert('❌ Error reading backup file. Please ensure it\'s a valid HabitQuest backup.');
        setIsImporting(false);
        console.error('Import file read error:', error);
      }
    };
    reader.readAsText(file);
    
    // Reset the input value so the same file can be selected again
    event.target.value = '';
  };

  const handleImportConfirm = (mergeMode: 'replace' | 'merge') => {
    if (!pendingImportData) return;
    
    playClick();
    setIsImporting(true);
    
    try {
      const result = importData(pendingImportData, mergeMode);
      
      if (result.success) {
        const summary = result.summary;
        const mode = mergeMode === 'merge' ? 'merged with' : 'replaced';
        
        alert(
          `✅ Data ${mode} successfully!\n\n` +
          `📊 Summary:\n` +
          `• Habits: ${summary.habits}\n` +
          `• Points: ${summary.points}\n` +
          `• Categories: ${summary.categories}\n` +
          `• Rewards: ${summary.rewards}\n\n` +
          `Your progress has been restored!`
        );
        
        setImportResult(result);
        onClose();
      } else {
        alert(`❌ Import failed: ${result.error}\n\nPlease check your backup file and try again.`);
      }
    } catch (error) {
      alert('❌ An unexpected error occurred during import.');
      console.error('Import error:', error);
    } finally {
      setIsImporting(false);
      setShowImportOptions(false);
      setPendingImportData(null);
    }
  };

  const handleReset = () => {
    if (confirm('Are you sure you want to reset all data? This action cannot be undone.')) {
      playClick();
      resetData();
      onClose();
    }
  };

  // Storage health functions
  const refreshStorageHealth = async () => {
    setIsRefreshingStorage(true);
    try {
      const health = calculateStorageHealth();
      setStorageHealth(health);
    } catch (error) {
      console.error('Error calculating storage health:', error);
    } finally {
      setIsRefreshingStorage(false);
    }
  };

  const handleCleanupCache = async () => {
    playClick();
    try {
      const cleanedBytes = cleanupCacheData();
      await refreshStorageHealth();
      // You could show a toast notification here
      console.log(`Cleaned up ${formatBytes(cleanedBytes)} of cache data`);
    } catch (error) {
      console.error('Error cleaning cache:', error);
    }
  };

  // Load storage health on mount and when modal opens
  useEffect(() => {
    if (isOpen) {
      refreshStorageHealth();
    }
  }, [isOpen]);

  const handleThemeChange = (newTheme: 'light' | 'dark' | 'system') => {
    playClick();
    setTheme(newTheme);
  };

  const handleAccentColorChange = (color: string) => {
    playClick();
    // Convert color name to hex values for gradient
    const colorMap: Record<string, string[]> = {
      blue: ['#3b82f6', '#1d4ed8', '#1e40af'],
      emerald: ['#10b981', '#047857', '#065f46'],
      purple: ['#8b5cf6', '#7c3aed', '#6d28d9'],
      amber: ['#f59e0b', '#d97706', '#b45309'],
      rose: ['#f43f5e', '#e11d48', '#be123c'],
      cyan: ['#06b6d4', '#0891b2', '#0e7490'],
      black: ['#000000', '#1f2937', '#374151'],
      white: ['#ffffff', '#f3f4f6', '#e5e7eb']
    };
    
    if (colorMap[color]) {
      setGradientColors(colorMap[color]);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          className="fixed inset-0 flex items-center justify-center p-4 z-50"
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          exit={{ opacity: 0 }}
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              handleClose();
            }
          }}
        >
          <motion.div 
            className="
              relative w-full max-w-4xl max-h-[90vh] overflow-hidden
              bg-white/90 dark:bg-neutral-900/90
              backdrop-blur-xl
              rounded-3xl
              shadow-2xl shadow-black/20 dark:shadow-black/40
              border border-white/20 dark:border-neutral-700/30
            "
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.3, type: "spring", stiffness: 300, damping: 30 }}
          >
            {/* Settings Header Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-cyan-500/5 to-indigo-500/10 dark:from-blue-500/15 dark:via-cyan-500/10 dark:to-indigo-500/15 rounded-3xl"></div>
            
            {/* Floating Gradient Orbs */}
            <div className="absolute -top-4 -left-4 w-24 h-24 bg-gradient-to-br from-blue-400/20 to-cyan-400/20 dark:from-blue-400/15 dark:to-cyan-400/15 rounded-full blur-2xl"></div>
            <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-gradient-to-br from-indigo-400/15 to-purple-400/15 dark:from-indigo-400/10 dark:to-purple-400/10 rounded-full blur-3xl"></div>
            <div className="absolute top-1/3 -right-8 w-20 h-20 bg-gradient-to-br from-cyan-400/10 to-blue-400/10 dark:from-cyan-400/5 dark:to-blue-400/5 rounded-full blur-xl"></div>

            <div className="relative z-10 p-8">
              {/* Settings Header */}
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                  <motion.div 
                    className="p-3 rounded-2xl bg-gradient-to-br from-blue-400/20 to-cyan-500/20 dark:from-blue-400/15 dark:to-cyan-500/15 border border-blue-200/30 dark:border-transparent"
                    whileHover={{ scale: 1.05, rotate: 5 }}
                    transition={{ duration: 0.2 }}
                  >
                    <featureIcons.settings className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </motion.div>
                  <div>
                    <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 via-cyan-600 to-indigo-600 dark:from-blue-400 dark:via-cyan-400 dark:to-indigo-400 bg-clip-text text-transparent">
                      Settings
                    </h2>
                    <p className="text-neutral-600 dark:text-neutral-400 text-sm mt-1">
                      Customize your HabitQuest experience
                    </p>
                  </div>
                </div>
                
                <motion.button
                  onClick={handleClose}
                  className="
                    p-2 rounded-xl
                    bg-white/60 dark:bg-neutral-800/60
                    border border-neutral-300/50 dark:border-neutral-600/50
                    hover:bg-white/80 dark:hover:bg-neutral-700/80
                    hover:border-red-400/40 dark:hover:border-red-500/40
                    text-neutral-700 dark:text-neutral-300
                    transition-all duration-100
                    backdrop-blur-sm
                  "
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95, y: 0 }}
                >
                  <featureIcons.x className="w-4 h-4" />
                </motion.button>
              </div>

              {/* Settings Content */}
              <div className="grid gap-6 max-h-[70vh] overflow-y-auto light-scrollbar dark:dark-scrollbar">
                {/* Audio Settings */}
                <motion.div 
                  className="bg-white/60 dark:bg-neutral-800/60 backdrop-blur-sm rounded-2xl p-6 border border-neutral-200/50 dark:border-neutral-700/50"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-4 flex items-center gap-2">
                    <featureIcons.volume2 className="w-5 h-5 text-blue-500 dark:text-blue-400" />
                    Audio Settings
                  </h3>
                  <div className="space-y-4">
                    {/* Sound Effects */}
                    <div className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-neutral-50/50 to-neutral-100/50 dark:from-neutral-800/50 dark:to-neutral-700/50 border border-neutral-200/30 dark:border-neutral-600/30">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-green-500/10 dark:bg-green-500/20">
                          <featureIcons.volume2 className="w-4 h-4 text-green-600 dark:text-green-400" />
                        </div>
                        <div>
                          <div className="font-medium text-neutral-900 dark:text-neutral-100 text-sm">Sound Effects</div>
                          <div className="text-xs text-neutral-600 dark:text-neutral-400">Enable completion sounds and notifications</div>
                        </div>
                      </div>
                      <motion.button
                        onClick={handleAudioToggle}
                        className={`
                          relative w-12 h-6 rounded-full overflow-hidden
                          ${audioEnabled 
                            ? 'bg-gradient-to-r from-green-500 to-emerald-500 shadow-lg shadow-green-500/30' 
                            : 'bg-neutral-300 dark:bg-neutral-600'
                          }
                          transition-all duration-200
                        `}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <motion.div
                          className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-md ${
                            audioEnabled ? 'right-0.5' : 'left-0.5'
                          }`}
                          initial={{ x: 0 }}
                          animate={{ x: 0 }}
                          transition={{ duration: 0.2 }}
                        />
                      </motion.button>
                    </div>

                    {/* Sound Effects Volume */}
                    <div className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-neutral-50/50 to-neutral-100/50 dark:from-neutral-800/50 dark:to-neutral-700/50 border border-neutral-200/30 dark:border-neutral-600/30">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-blue-500/10 dark:bg-blue-500/20">
                          <featureIcons.volume1 className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                          <div className="font-medium text-neutral-900 dark:text-neutral-100 text-sm">Sound Effects Volume</div>
                          <div className="text-xs text-neutral-600 dark:text-neutral-400">Adjust the volume of sound effects</div>
                        </div>
                      </div>
                      <div className="w-40">
                        <input
                          type="range"
                          min="0"
                          max="1"
                          step="0.05"
                          value={soundEffectsVolume}
                          onChange={(e) => handleSoundEffectsVolumeChange(parseFloat(e.target.value))}
                          className="w-full h-3 bg-neutral-200 dark:bg-neutral-700 rounded-full appearance-none cursor-pointer slider"
                          style={{
                            background: `linear-gradient(to right, #3b82f6 0%, #06b6d4 ${soundEffectsVolume * 100}%, #e5e7eb ${soundEffectsVolume * 100}%, #e5e7eb 100%)`
                          }}
                        />
                      </div>
                    </div>

                    {/* Background Music */}
                    <div className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-neutral-50/50 to-neutral-100/50 dark:from-neutral-800/50 dark:to-neutral-700/50 border border-neutral-200/30 dark:border-neutral-600/30">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-purple-500/10 dark:bg-purple-500/20">
                          <featureIcons.music className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                        </div>
                        <div>
                          <div className="font-medium text-neutral-900 dark:text-neutral-100 text-sm">Background Music</div>
                          <div className="text-xs text-neutral-600 dark:text-neutral-400">Enable ambient background music</div>
                        </div>
                      </div>
                      <motion.button
                        onClick={handleBackgroundMusicToggle}
                        className={`
                          relative w-12 h-6 rounded-full overflow-hidden
                          ${backgroundMusicEnabled 
                            ? 'bg-gradient-to-r from-purple-500 to-violet-500 shadow-lg shadow-purple-500/30' 
                            : 'bg-neutral-300 dark:bg-neutral-600'
                          }
                          transition-all duration-200
                        `}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <motion.div
                          className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-md ${
                            backgroundMusicEnabled ? 'right-0.5' : 'left-0.5'
                          }`}
                          initial={{ x: 0 }}
                          animate={{ x: 0 }}
                          transition={{ duration: 0.2 }}
                        />
                      </motion.button>
                    </div>

                    {/* Background Music Volume */}
                    <div className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-neutral-50/50 to-neutral-100/50 dark:from-neutral-800/50 dark:to-neutral-700/50 border border-neutral-200/30 dark:border-neutral-600/30">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-purple-500/10 dark:bg-purple-500/20">
                          <featureIcons.volume1 className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                        </div>
                        <div>
                          <div className="font-medium text-neutral-900 dark:text-neutral-100 text-sm">Background Music Volume</div>
                          <div className="text-xs text-neutral-600 dark:text-neutral-400">Adjust the volume of background music</div>
                        </div>
                      </div>
                      <div className="w-40">
                        <input
                          type="range"
                          min="0"
                          max="1"
                          step="0.05"
                          value={backgroundMusicVolume}
                          onChange={(e) => handleBackgroundMusicVolumeChange(parseFloat(e.target.value))}
                          className="w-full h-3 bg-neutral-200 dark:bg-neutral-700 rounded-full appearance-none cursor-pointer slider"
                          style={{
                            background: `linear-gradient(to right, #a855f7 0%, #ec4899 ${backgroundMusicVolume * 100}%, #e5e7eb ${backgroundMusicVolume * 100}%, #e5e7eb 100%)`
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Appearance Settings */}
                <motion.div 
                  className="bg-white/60 dark:bg-neutral-800/60 backdrop-blur-sm rounded-2xl p-6 border border-neutral-200/50 dark:border-neutral-700/50"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                >
                  <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-4 flex items-center gap-2">
                    <featureIcons.palette className="w-5 h-5 text-purple-500 dark:text-purple-400" />
                    Appearance
                  </h3>
                  <div className="space-y-4">
                    {/* Theme Selection */}
                    <div className="p-4 rounded-xl bg-gradient-to-r from-neutral-50/50 to-neutral-100/50 dark:from-neutral-800/50 dark:to-neutral-700/50 border border-neutral-200/30 dark:border-neutral-600/30">
                      <div className="font-medium text-neutral-900 dark:text-neutral-100 text-sm mb-3">Theme</div>
                      <div className="grid grid-cols-3 gap-2">
                        {[
                          { key: 'light', label: 'Light', icon: featureIcons.sun },
                          { key: 'dark', label: 'Dark', icon: featureIcons.moon },
                          { key: 'system', label: 'System', icon: featureIcons.monitor }
                        ].map((themeOption) => (
                          <motion.button
                            key={themeOption.key}
                            onClick={() => handleThemeChange(themeOption.key as 'light' | 'dark' | 'system')}
                            className={`
                              flex items-center justify-center gap-2 p-3 rounded-xl
                              ${theme === themeOption.key 
                                ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg shadow-blue-500/30' 
                                : 'bg-white/60 dark:bg-neutral-700/60 text-neutral-700 dark:text-neutral-300 hover:bg-white/80 dark:hover:bg-neutral-600/80'
                              }
                              border border-neutral-200/30 dark:border-neutral-600/30
                              transition-all duration-200
                            `}
                            whileHover={{ scale: 1.02, y: -1 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <themeOption.icon className="w-4 h-4" />
                            <span className="text-sm font-medium">{themeOption.label}</span>
                          </motion.button>
                        ))}
                      </div>
                    </div>

                    {/* Accent Color */}
                    <div className="p-4 rounded-xl bg-gradient-to-r from-neutral-50/50 to-neutral-100/50 dark:from-neutral-800/50 dark:to-neutral-700/50 border border-neutral-200/30 dark:border-neutral-600/30">
                      <div className="font-medium text-neutral-900 dark:text-neutral-100 text-sm mb-3">Accent Color</div>
                      <div className="grid grid-cols-8 gap-2">
                        {[
                          { color: 'blue', class: 'bg-blue-500', hex: '#3b82f6' },
                          { color: 'emerald', class: 'bg-emerald-500', hex: '#10b981' },
                          { color: 'purple', class: 'bg-purple-500', hex: '#8b5cf6' },
                          { color: 'amber', class: 'bg-amber-500', hex: '#f59e0b' },
                          { color: 'rose', class: 'bg-rose-500', hex: '#f43f5e' },
                          { color: 'cyan', class: 'bg-cyan-500', hex: '#06b6d4' },
                          { color: 'black', class: 'bg-black border border-neutral-300 dark:border-neutral-600', hex: '#000000' },
                          { color: 'white', class: 'bg-white border border-neutral-300 dark:border-neutral-600', hex: '#ffffff' }
                        ].map((accent) => (
                          <motion.button
                            key={accent.color}
                            onClick={() => handleAccentColorChange(accent.color)}
                            className={`
                              w-8 h-8 rounded-full ${accent.class}
                              ${gradientColors && gradientColors[0] === accent.hex ? 'ring-2 ring-blue-400 dark:ring-blue-300 ring-offset-2 ring-offset-white dark:ring-offset-neutral-800' : ''}
                              shadow-lg transition-all duration-200 hover:shadow-xl
                              ${accent.color === 'black' ? 'shadow-neutral-400/30 dark:shadow-neutral-600/30' : ''}
                              ${accent.color === 'white' ? 'shadow-neutral-300/50 dark:shadow-neutral-500/50' : ''}
                            `}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
                
                {/* Notification Settings */}
                <motion.div 
                  className="bg-white/60 dark:bg-neutral-800/60 backdrop-blur-sm rounded-2xl p-6 border border-neutral-200/50 dark:border-neutral-700/50"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.2 }}
                >
                  <NotificationSettings 
                    config={notificationConfig}
                    onConfigChange={handleNotificationConfigChange}
                  />
                </motion.div>

                {/* Data Management */}
                <motion.div 
                  className="bg-white/60 dark:bg-neutral-800/60 backdrop-blur-sm rounded-2xl p-6 border border-neutral-200/50 dark:border-neutral-700/50"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.3 }}
                >
                  <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-4 flex items-center gap-2">
                    <featureIcons.database className="w-5 h-5 text-indigo-500 dark:text-indigo-400" />
                    Data Management
                  </h3>
                  <div className="space-y-4">
                    {/* Export Data */}
                    <motion.button
                      onClick={handleExport}
                      disabled={isExporting}
                      className="w-full flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-green-500/15 to-emerald-500/15 dark:from-green-500/30 dark:to-emerald-500/30 border border-green-300/60 dark:border-green-500/60 hover:from-green-500/25 hover:to-emerald-500/25 dark:hover:from-green-500/40 dark:hover:to-emerald-500/40 transition-all duration-200 backdrop-blur-sm shadow-lg shadow-green-500/10 dark:shadow-green-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
                      whileHover={!isExporting ? { scale: 1.02, y: -2 } : {}}
                      whileTap={!isExporting ? { scale: 0.98 } : {}}
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-green-500/15 dark:bg-green-500/30">
                          {isExporting ? (
                            <div className="w-4 h-4 border-2 border-green-600 border-t-transparent rounded-full animate-spin" />
                          ) : (
                            <featureIcons.download className="w-4 h-4 text-green-600 dark:text-green-300" />
                          )}
                        </div>
                        <div className="text-left">
                          <div className="font-medium text-neutral-900 dark:text-neutral-100 text-sm">
                            {isExporting ? 'Exporting...' : 'Export Data'}
                          </div>
                          <div className="text-xs text-neutral-600 dark:text-neutral-400">
                            {isExporting ? 'Preparing your backup file' : 'Download your habits and progress data'}
                          </div>
                        </div>
                      </div>
                      {!isExporting && <featureIcons.chevronRight className="w-4 h-4 text-green-600 dark:text-green-400" />}
                    </motion.button>

                    {/* Import Data */}
                    <div>
                      <input
                        type="file"
                        accept=".json"
                        onChange={handleImportFileSelect}
                        className="hidden"
                        id="import-file"
                      />
                      <motion.button
                        onClick={() => document.getElementById('import-file')?.click()}
                        disabled={isImporting}
                        className="w-full flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-blue-500/15 to-cyan-500/15 dark:from-blue-500/30 dark:to-cyan-500/30 border border-blue-300/60 dark:border-blue-500/60 hover:from-blue-500/25 hover:to-cyan-500/25 dark:hover:from-blue-500/40 dark:hover:to-cyan-500/40 transition-all duration-200 backdrop-blur-sm shadow-lg shadow-blue-500/10 dark:shadow-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
                        whileHover={!isImporting ? { scale: 1.02, y: -2 } : {}}
                        whileTap={!isImporting ? { scale: 0.98 } : {}}
                      >
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-blue-500/15 dark:bg-blue-500/30">
                          {isImporting ? (
                            <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                          ) : (
                            <featureIcons.upload className="w-4 h-4 text-blue-600 dark:text-blue-300" />
                          )}
                        </div>
                        <div className="text-left">
                          <div className="font-medium text-neutral-900 dark:text-neutral-100 text-sm">
                            {isImporting ? 'Processing...' : 'Import Data'}
                          </div>
                          <div className="text-xs text-neutral-600 dark:text-neutral-400">
                            {isImporting ? 'Reading backup file' : 'Import habits and progress from backup'}
                          </div>
                        </div>
                      </div>
                      {!isImporting && <featureIcons.chevronRight className="w-4 h-4 text-blue-600 dark:text-blue-400" />}
                      </motion.button>
                    </div>

                    {/* Reset Data */}
                    <motion.button
                      onClick={handleReset}
                      className="w-full flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-red-500/15 to-rose-500/15 dark:from-red-500/30 dark:to-rose-500/30 border border-red-300/60 dark:border-red-500/60 hover:from-red-500/25 hover:to-rose-500/25 dark:hover:from-red-500/40 dark:hover:to-rose-500/40 transition-all duration-200 backdrop-blur-sm shadow-lg shadow-red-500/10 dark:shadow-red-500/20"
                      whileHover={{ scale: 1.02, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-red-500/15 dark:bg-red-500/30">
                          <featureIcons.trash2 className="w-4 h-4 text-red-600 dark:text-red-300" />
                        </div>
                        <div className="text-left">
                          <div className="font-medium text-neutral-900 dark:text-neutral-100 text-sm">Reset All Data</div>
                          <div className="text-xs text-neutral-600 dark:text-neutral-400">Clear all habits, progress, and settings</div>
                        </div>
                      </div>
                      <featureIcons.chevronRight className="w-4 h-4 text-red-600 dark:text-red-400" />
                    </motion.button>
                  </div>
                </motion.div>

                {/* Storage Health Section */}
                <motion.div 
                  className="bg-white/60 dark:bg-neutral-800/60 backdrop-blur-sm rounded-2xl p-6 border border-neutral-200/50 dark:border-neutral-700/50"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.4 }}
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
                      <featureIcons.hardDrive className="w-5 h-5 text-indigo-500 dark:text-indigo-400" />
                      Storage Health
                    </h3>
                    <motion.button
                      onClick={refreshStorageHealth}
                      disabled={isRefreshingStorage}
                      className="p-2 rounded-lg bg-indigo-500/10 dark:bg-indigo-500/20 hover:bg-indigo-500/20 dark:hover:bg-indigo-500/30 transition-all duration-200 disabled:opacity-50"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <featureIcons.refreshCw className={`w-4 h-4 text-indigo-600 dark:text-indigo-400 ${isRefreshingStorage ? 'animate-spin' : ''}`} />
                    </motion.button>
                  </div>

                  {storageHealth ? (
                    <div className="space-y-4">
                      {/* Storage Status */}
                      <div className={`p-4 rounded-xl border ${getStorageHealthBgColor(storageHealth.healthStatus)}`}>
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium text-neutral-900 dark:text-neutral-100">
                            Storage Status
                          </span>
                          <span className={`text-sm font-semibold capitalize ${getStorageHealthColor(storageHealth.healthStatus)}`}>
                            {storageHealth.healthStatus}
                          </span>
                        </div>
                        <div className="w-full bg-neutral-200 dark:bg-neutral-700 rounded-full h-2 mb-2">
                          <div 
                            className={`h-2 rounded-full transition-all duration-500 ${
                              storageHealth.healthStatus === 'excellent' ? 'bg-green-500' :
                              storageHealth.healthStatus === 'good' ? 'bg-blue-500' :
                              storageHealth.healthStatus === 'warning' ? 'bg-yellow-500' : 'bg-red-500'
                            }`}
                            style={{ width: `${Math.min(storageHealth.usagePercentage, 100)}%` }}
                          />
                        </div>
                        <div className="text-sm text-neutral-600 dark:text-neutral-400">
                          {formatBytes(storageHealth.totalUsed)} used of {formatBytes(storageHealth.totalUsed + storageHealth.totalAvailable)} total
                        </div>
                      </div>

                      {/* Storage Breakdown */}
                      <div className="space-y-3">
                        <h4 className="font-medium text-neutral-900 dark:text-neutral-100 text-sm">Storage Breakdown</h4>
                        <div className="grid grid-cols-2 gap-3">
                          <div className="flex items-center justify-between p-3 rounded-lg bg-neutral-100/50 dark:bg-neutral-700/50">
                            <span className="text-sm text-neutral-700 dark:text-neutral-300">Habits</span>
                            <span className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                              {formatBytes(storageHealth.breakdown.habits)}
                            </span>
                          </div>
                          <div className="flex items-center justify-between p-3 rounded-lg bg-neutral-100/50 dark:bg-neutral-700/50">
                            <span className="text-sm text-neutral-700 dark:text-neutral-300">Categories</span>
                            <span className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                              {formatBytes(storageHealth.breakdown.categories)}
                            </span>
                          </div>
                          <div className="flex items-center justify-between p-3 rounded-lg bg-neutral-100/50 dark:bg-neutral-700/50">
                            <span className="text-sm text-neutral-700 dark:text-neutral-300">Progress</span>
                            <span className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                              {formatBytes(storageHealth.breakdown.progress)}
                            </span>
                          </div>
                          <div className="flex items-center justify-between p-3 rounded-lg bg-neutral-100/50 dark:bg-neutral-700/50">
                            <span className="text-sm text-neutral-700 dark:text-neutral-300">Settings</span>
                            <span className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                              {formatBytes(storageHealth.breakdown.settings)}
                            </span>
                          </div>
                          <div className="flex items-center justify-between p-3 rounded-lg bg-neutral-100/50 dark:bg-neutral-700/50">
                            <span className="text-sm text-neutral-700 dark:text-neutral-300">Cache</span>
                            <span className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                              {formatBytes(storageHealth.breakdown.cache)}
                            </span>
                          </div>
                          <div className="flex items-center justify-between p-3 rounded-lg bg-neutral-100/50 dark:bg-neutral-700/50">
                            <span className="text-sm text-neutral-700 dark:text-neutral-300">Other</span>
                            <span className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                              {formatBytes(storageHealth.breakdown.other)}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Recommendations */}
                      {storageHealth.recommendations.length > 0 && (
                        <div className="space-y-2">
                          <h4 className="font-medium text-neutral-900 dark:text-neutral-100 text-sm">Recommendations</h4>
                          <div className="space-y-1">
                            {storageHealth.recommendations.map((recommendation, index) => (
                              <div key={index} className="text-xs text-neutral-600 dark:text-neutral-400 flex items-start gap-2">
                                <featureIcons.info className="w-3 h-3 mt-0.5 flex-shrink-0" />
                                {recommendation}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Cache Cleanup Button */}
                      {storageHealth.breakdown.cache > 0 && (
                        <motion.button
                          onClick={handleCleanupCache}
                          className="w-full flex items-center justify-center gap-2 p-3 rounded-xl bg-gradient-to-r from-orange-500/15 to-amber-500/15 dark:from-orange-500/25 dark:to-amber-500/25 border border-orange-300/60 dark:border-orange-500/60 hover:from-orange-500/25 hover:to-amber-500/25 dark:hover:from-orange-500/35 dark:hover:to-amber-500/35 transition-all duration-200 backdrop-blur-sm shadow-lg shadow-orange-500/10 dark:shadow-orange-500/20"
                          whileHover={{ scale: 1.02, y: -2 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <featureIcons.trash2 className="w-4 h-4 text-orange-600 dark:text-orange-300" />
                          <span className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                            Clean Cache ({formatBytes(storageHealth.breakdown.cache)})
                          </span>
                        </motion.button>
                      )}

                      {/* Last Updated */}
                      <div className="text-xs text-neutral-500 dark:text-neutral-400 text-center">
                        Last updated: {storageHealth.lastUpdated.toLocaleTimeString()}
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center py-8">
                      <div className="text-center">
                        <featureIcons.loader2 className="w-6 h-6 text-neutral-400 animate-spin mx-auto mb-2" />
                        <p className="text-sm text-neutral-600 dark:text-neutral-400">Loading storage health...</p>
                      </div>
                    </div>
                  )}
                </motion.div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
      
      {/* Import Options Dialog */}
      {showImportOptions && (
        <motion.div 
          className="fixed inset-0 flex items-center justify-center p-4 z-[60]"
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          exit={{ opacity: 0 }}
        >
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowImportOptions(false)} />
          
          <motion.div 
            className="relative bg-white/95 dark:bg-neutral-900/95 backdrop-blur-xl rounded-2xl p-6 w-full max-w-md border border-neutral-200/50 dark:border-neutral-700/50 shadow-2xl"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
          >
            <div className="text-center mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-3">
                <featureIcons.database className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-1">Import Options</h3>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">Choose how to handle your existing data</p>
            </div>

            <div className="space-y-3 mb-6">
              <motion.button
                onClick={() => handleImportConfirm('replace')}
                disabled={isImporting}
                className="w-full p-4 rounded-xl bg-gradient-to-r from-red-500/10 to-rose-500/10 dark:from-red-500/20 dark:to-rose-500/20 border border-red-300/60 dark:border-red-500/60 hover:from-red-500/20 hover:to-rose-500/20 dark:hover:from-red-500/30 dark:hover:to-rose-500/30 transition-all duration-200 text-left disabled:opacity-50"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-red-500/15 dark:bg-red-500/25">
                    {isImporting ? (
                      <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <featureIcons.refreshCw className="w-4 h-4 text-red-600 dark:text-red-400" />
                    )}
                  </div>
                  <div>
                    <div className="font-medium text-neutral-900 dark:text-neutral-100 text-sm">Replace All Data</div>
                    <div className="text-xs text-neutral-600 dark:text-neutral-400">⚠️ This will completely replace your current progress</div>
                  </div>
                </div>
              </motion.button>

              <motion.button
                onClick={() => handleImportConfirm('merge')}
                disabled={isImporting}
                className="w-full p-4 rounded-xl bg-gradient-to-r from-green-500/10 to-emerald-500/10 dark:from-green-500/20 dark:to-emerald-500/20 border border-green-300/60 dark:border-green-500/60 hover:from-green-500/20 hover:to-emerald-500/20 dark:hover:from-green-500/30 dark:hover:to-emerald-500/30 transition-all duration-200 text-left disabled:opacity-50"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-green-500/15 dark:bg-green-500/25">
                    {isImporting ? (
                      <div className="w-4 h-4 border-2 border-green-600 border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <featureIcons.plus className="w-4 h-4 text-green-600 dark:text-green-400" />
                    )}
                  </div>
                  <div>
                    <div className="font-medium text-neutral-900 dark:text-neutral-100 text-sm">Merge Data</div>
                    <div className="text-xs text-neutral-600 dark:text-neutral-400">✅ Combines backup with your current progress safely</div>
                  </div>
                </div>
              </motion.button>
            </div>

            <motion.button
              onClick={() => setShowImportOptions(false)}
              disabled={isImporting}
              className="w-full p-3 rounded-xl bg-neutral-100/50 dark:bg-neutral-800/50 hover:bg-neutral-200/50 dark:hover:bg-neutral-700/50 border border-neutral-300/60 dark:border-neutral-600/60 transition-all duration-200 disabled:opacity-50"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">Cancel</span>
            </motion.button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}