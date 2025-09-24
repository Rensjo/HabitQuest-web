import { useState, useEffect } from 'react';
import { useAppStore } from '../store/appStore';
import { useTheme } from '../hooks/useTheme';
import { useHabitReminders } from '../hooks/useHabitReminders';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { Icon } from './ui/Icon';
import { Modal } from './ui/Modal';
import NotificationSettings from './notifications/NotificationSettings';

interface SettingsPageProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SettingsPage({ isOpen, onClose }: SettingsPageProps) {
  const { settings, updateSettings, exportData, importData, resetData } = useAppStore();
  const { theme, gradientColors, setGradientColors } = useTheme();
  const { updateConfig } = useHabitReminders();
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [customColors, setCustomColors] = useState(gradientColors.join(', '));
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

  const handleExport = () => {
    const data = exportData();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `habitquest-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = e.target?.result as string;
        if (importData(data)) {
          alert('Data imported successfully!');
          onClose();
        } else {
          alert('Failed to import data. Please check the file format.');
        }
      } catch (error) {
        alert('Error reading file.');
      }
    };
    reader.readAsText(file);
  };

  const handleGradientUpdate = () => {
    const colors = customColors.split(',').map((c: string) => c.trim()).filter((c: string) => c.startsWith('#'));
    if (colors.length >= 2) {
      setGradientColors(colors);
    }
  };

  const handleNotificationConfigChange = (config: any) => {
    const newConfig = { ...notificationConfig, ...config };
    setNotificationConfig(newConfig);
    updateConfig(config);
    
    // Sync with app store settings for backward compatibility
    if (config.enabled !== undefined) {
      updateSettings({ notifications: config.enabled });
    }
    if (config.soundEnabled !== undefined) {
      updateSettings({ soundEffects: config.soundEnabled });
    }
  };

  // Sync notification config with app store settings changes
  useEffect(() => {
    setNotificationConfig(prev => ({
      ...prev,
      enabled: settings.notifications || false,
      soundEnabled: settings.soundEffects || false
    }));
  }, [settings.notifications, settings.soundEffects]);

  const handleReset = () => {
    resetData();
    setShowResetConfirm(false);
    onClose();
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} title="Settings" size="lg">
        <div className="space-y-6">
          {/* Theme Settings */}
          <Card variant="outlined" padding="lg">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Icon name={theme === 'dark' ? 'moon' : 'sun'} />
              Theme & Appearance
            </h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <label className="font-medium">Theme Mode</label>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Choose your preferred theme
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant={settings.theme === 'light' ? 'primary' : 'outline'}
                    size="sm"
                    onClick={() => updateSettings({ theme: 'light' })}
                  >
                    Light
                  </Button>
                  <Button
                    variant={settings.theme === 'dark' ? 'primary' : 'outline'}
                    size="sm"
                    onClick={() => updateSettings({ theme: 'dark' })}
                  >
                    Dark
                  </Button>
                  <Button
                    variant={settings.theme === 'auto' ? 'primary' : 'outline'}
                    size="sm"
                    onClick={() => updateSettings({ theme: 'auto' })}
                  >
                    Auto
                  </Button>
                </div>
              </div>

              <div>
                <label className="font-medium">Background Gradient Colors</label>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  Enter hex colors separated by commas (e.g., #ff0000, #00ff00, #0000ff)
                </p>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={customColors}
                    onChange={(e) => setCustomColors(e.target.value)}
                    className="flex-1 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-sm"
                    placeholder="#0f172a, #1e293b, #334155"
                  />
                  <Button onClick={handleGradientUpdate} size="sm">
                    Apply
                  </Button>
                </div>
              </div>
            </div>
          </Card>

          {/* App Settings */}
          <Card variant="outlined" padding="lg">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Icon name="settings" />
              App Preferences
            </h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <label className="font-medium">Animations</label>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Enable smooth animations throughout the app
                  </p>
                </div>
                <Button
                  variant={settings.animations ? 'success' : 'outline'}
                  size="sm"
                  onClick={() => updateSettings({ animations: !settings.animations })}
                >
                  {settings.animations ? 'Enabled' : 'Disabled'}
                </Button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <label className="font-medium">Sound Effects</label>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Play sounds for achievements and completions
                  </p>
                </div>
                <Button
                  variant={settings.soundEffects ? 'success' : 'outline'}
                  size="sm"
                  onClick={() => updateSettings({ soundEffects: !settings.soundEffects })}
                >
                  {settings.soundEffects ? 'Enabled' : 'Disabled'}
                </Button>
              </div>



              <div className="flex items-center justify-between">
                <div>
                  <label className="font-medium">Start of Week</label>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Choose when your week starts
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant={settings.startOfWeek === 0 ? 'primary' : 'outline'}
                    size="sm"
                    onClick={() => updateSettings({ startOfWeek: 0 })}
                  >
                    Sunday
                  </Button>
                  <Button
                    variant={settings.startOfWeek === 1 ? 'primary' : 'outline'}
                    size="sm"
                    onClick={() => updateSettings({ startOfWeek: 1 })}
                  >
                    Monday
                  </Button>
                </div>
              </div>
            </div>
          </Card>

          {/* Notification Settings */}
          <Card variant="outlined" padding="lg">
            <NotificationSettings 
              config={notificationConfig}
              onConfigChange={handleNotificationConfigChange}
            />
          </Card>

          {/* Data Management */}
          <Card variant="outlined" padding="lg">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Icon name="briefcase" />
              Data Management
            </h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <label className="font-medium">Export Data</label>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Download your habits and progress data
                  </p>
                </div>
                <Button onClick={handleExport} icon="briefcase" variant="outline">
                  Export
                </Button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <label className="font-medium">Import Data</label>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Restore from a previous backup
                  </p>
                </div>
                <div>
                  <input
                    type="file"
                    accept=".json"
                    onChange={handleImport}
                    className="hidden"
                    id="import-file"
                  />
                  <Button
                    onClick={() => document.getElementById('import-file')?.click()}
                    icon="briefcase"
                    variant="outline"
                  >
                    Import
                  </Button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <label className="font-medium">Reset All Data</label>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Clear all habits, progress, and settings
                  </p>
                </div>
                <Button
                  onClick={() => setShowResetConfirm(true)}
                  icon="trash"
                  variant="danger"
                >
                  Reset
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </Modal>

      {/* Reset Confirmation Modal */}
      <Modal 
        isOpen={showResetConfirm} 
        onClose={() => setShowResetConfirm(false)}
        title="Confirm Reset"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-gray-600 dark:text-gray-400">
            Are you sure you want to reset all data? This action cannot be undone.
          </p>
          
          <div className="flex gap-3 justify-end">
            <Button
              variant="outline"
              onClick={() => setShowResetConfirm(false)}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={handleReset}
            >
              Reset All Data
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}
