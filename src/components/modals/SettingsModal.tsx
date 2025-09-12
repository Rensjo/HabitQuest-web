import { motion, AnimatePresence } from 'framer-motion';
import { featureIcons } from '../../utils/icons';
import { useSoundEffectsOnly } from '../../hooks/useSoundEffects';

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

  const handleClose = () => {
    playClick();
    onClose();
  };

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
                        ].map((theme) => (
                          <motion.button
                            key={theme.key}
                            className={`
                              flex items-center justify-center gap-2 p-3 rounded-xl
                              ${theme.key === 'system' 
                                ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg shadow-blue-500/30' 
                                : 'bg-white/60 dark:bg-neutral-700/60 text-neutral-700 dark:text-neutral-300 hover:bg-white/80 dark:hover:bg-neutral-600/80'
                              }
                              border border-neutral-200/30 dark:border-neutral-600/30
                              transition-all duration-200
                            `}
                            whileHover={{ scale: 1.02, y: -1 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <theme.icon className="w-4 h-4" />
                            <span className="text-sm font-medium">{theme.label}</span>
                          </motion.button>
                        ))}
                      </div>
                    </div>

                    {/* Accent Color */}
                    <div className="p-4 rounded-xl bg-gradient-to-r from-neutral-50/50 to-neutral-100/50 dark:from-neutral-800/50 dark:to-neutral-700/50 border border-neutral-200/30 dark:border-neutral-600/30">
                      <div className="font-medium text-neutral-900 dark:text-neutral-100 text-sm mb-3">Accent Color</div>
                      <div className="grid grid-cols-6 gap-2">
                        {[
                          { color: 'blue', class: 'bg-blue-500' },
                          { color: 'emerald', class: 'bg-emerald-500' },
                          { color: 'purple', class: 'bg-purple-500' },
                          { color: 'amber', class: 'bg-amber-500' },
                          { color: 'rose', class: 'bg-rose-500' },
                          { color: 'cyan', class: 'bg-cyan-500' }
                        ].map((accent) => (
                          <motion.button
                            key={accent.color}
                            className={`
                              w-8 h-8 rounded-full ${accent.class}
                              ${accent.color === 'blue' ? 'ring-2 ring-blue-300 dark:ring-blue-400' : ''}
                              shadow-lg transition-all duration-200
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
                  <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-4 flex items-center gap-2">
                    <featureIcons.bell className="w-5 h-5 text-amber-500 dark:text-amber-400" />
                    Notifications
                  </h3>
                  <div className="space-y-4">
                    {/* Daily Reminders */}
                    <div className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-neutral-50/50 to-neutral-100/50 dark:from-neutral-800/50 dark:to-neutral-700/50 border border-neutral-200/30 dark:border-neutral-600/30">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-amber-500/10 dark:bg-amber-500/20">
                          <featureIcons.clock className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                        </div>
                        <div>
                          <div className="font-medium text-neutral-900 dark:text-neutral-100 text-sm">Daily Reminders</div>
                          <div className="text-xs text-neutral-600 dark:text-neutral-400">Get reminded to complete your habits</div>
                        </div>
                      </div>
                      <motion.button
                        className="
                          relative w-12 h-6 rounded-full
                          bg-gradient-to-r from-amber-500 to-orange-500
                          shadow-lg shadow-amber-500/30
                          transition-all duration-200
                        "
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <motion.div
                          className="absolute top-0.5 right-0.5 w-5 h-5 bg-white rounded-full shadow-md"
                          initial={{ x: 0 }}
                          animate={{ x: 0 }}
                          transition={{ duration: 0.2 }}
                        />
                      </motion.button>
                    </div>

                    {/* Streak Notifications */}
                    <div className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-neutral-50/50 to-neutral-100/50 dark:from-neutral-800/50 dark:to-neutral-700/50 border border-neutral-200/30 dark:border-neutral-600/30">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-orange-500/10 dark:bg-orange-500/20">
                          <featureIcons.flame className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                        </div>
                        <div>
                          <div className="font-medium text-neutral-900 dark:text-neutral-100 text-sm">Streak Notifications</div>
                          <div className="text-xs text-neutral-600 dark:text-neutral-400">Celebrate your streak milestones</div>
                        </div>
                      </div>
                      <motion.button
                        className="
                          relative w-12 h-6 rounded-full
                          bg-gradient-to-r from-orange-500 to-red-500
                          shadow-lg shadow-orange-500/30
                          transition-all duration-200
                        "
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <motion.div
                          className="absolute top-0.5 right-0.5 w-5 h-5 bg-white rounded-full shadow-md"
                          initial={{ x: 0 }}
                          animate={{ x: 0 }}
                          transition={{ duration: 0.2 }}
                        />
                      </motion.button>
                    </div>
                  </div>
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
                      className="w-full flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-green-500/10 to-emerald-500/10 dark:from-green-500/20 dark:to-emerald-500/20 border border-green-200/30 dark:border-green-600/30 hover:from-green-500/20 hover:to-emerald-500/20 dark:hover:from-green-500/30 dark:hover:to-emerald-500/30 transition-all duration-200"
                      whileHover={{ scale: 1.02, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-green-500/10 dark:bg-green-500/20">
                          <featureIcons.download className="w-4 h-4 text-green-600 dark:text-green-400" />
                        </div>
                        <div className="text-left">
                          <div className="font-medium text-neutral-900 dark:text-neutral-100 text-sm">Export Data</div>
                          <div className="text-xs text-neutral-600 dark:text-neutral-400">Download your habits and progress data</div>
                        </div>
                      </div>
                      <featureIcons.chevronRight className="w-4 h-4 text-green-600 dark:text-green-400" />
                    </motion.button>

                    {/* Import Data */}
                    <motion.button
                      className="w-full flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-blue-500/10 to-cyan-500/10 dark:from-blue-500/20 dark:to-cyan-500/20 border border-blue-200/30 dark:border-blue-600/30 hover:from-blue-500/20 hover:to-cyan-500/20 dark:hover:from-blue-500/30 dark:hover:to-cyan-500/30 transition-all duration-200"
                      whileHover={{ scale: 1.02, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-blue-500/10 dark:bg-blue-500/20">
                          <featureIcons.upload className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div className="text-left">
                          <div className="font-medium text-neutral-900 dark:text-neutral-100 text-sm">Import Data</div>
                          <div className="text-xs text-neutral-600 dark:text-neutral-400">Import habits and progress from backup</div>
                        </div>
                      </div>
                      <featureIcons.chevronRight className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    </motion.button>

                    {/* Reset Data */}
                    <motion.button
                      className="w-full flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-red-500/10 to-rose-500/10 dark:from-red-500/20 dark:to-rose-500/20 border border-red-200/30 dark:border-red-600/30 hover:from-red-500/20 hover:to-rose-500/20 dark:hover:from-red-500/30 dark:hover:to-rose-500/30 transition-all duration-200"
                      whileHover={{ scale: 1.02, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-red-500/10 dark:bg-red-500/20">
                          <featureIcons.trash2 className="w-4 h-4 text-red-600 dark:text-red-400" />
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
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}