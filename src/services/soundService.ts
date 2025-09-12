// Sound Service for HabitQuest
// Manages all audio effects and background music

export interface SoundConfig {
  audioEnabled: boolean;
  backgroundMusicEnabled: boolean;
  soundEffectsVolume: number;
  backgroundMusicVolume: number;
}

export class SoundService {
  private audioContext: AudioContext | null = null;
  private backgroundMusicAudio: HTMLAudioElement | null = null;
  private config: SoundConfig;

  constructor(config: SoundConfig) {
    this.config = config;
    this.initializeAudio();
  }

  private initializeAudio() {
    // Don't initialize AudioContext immediately - wait for user interaction
    // This will be called from playSound when needed
  }

  public updateConfig(newConfig: Partial<SoundConfig>) {
    this.config = { ...this.config, ...newConfig };
    
    // Update background music volume if it's playing
    if (this.backgroundMusicAudio) {
      this.backgroundMusicAudio.volume = this.config.backgroundMusicVolume;
    }
  }

  public playSound(soundType: string) {
    if (!this.config.audioEnabled) return;

    // Initialize AudioContext only when needed and after user interaction
    if (!this.audioContext && typeof window !== 'undefined') {
      try {
        this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      } catch (error) {
        console.warn('Could not create AudioContext:', error);
        return;
      }
    }

    // Resume AudioContext if suspended
    if (this.audioContext && this.audioContext.state === 'suspended') {
      this.audioContext.resume().catch(() => {
        console.warn('Could not resume AudioContext');
      });
    }

    const soundMap: { [key: string]: string } = {
      'button-click': '/sounds/button-click-sound.mp3',
      'hover': '/sounds/hover-button-sound.mp3',
      'level-up': '/sounds/level-up-sound.mp3',
      'task-complete': '/sounds/task-complete-sound.mp3',
      'coins': '/sounds/coins-sound.mp3',
    };

    const audioPath = soundMap[soundType];
    if (!audioPath) {
      console.warn(`No audio file mapped for sound type: ${soundType}`);
      return;
    }

    try {
      const audio = new Audio(audioPath);
      audio.volume = this.config.soundEffectsVolume;
      audio.preload = 'auto';
      
      // Handle audio loading errors gracefully
      audio.addEventListener('error', (e) => {
        console.warn(`Audio file not available: ${audioPath}. Error:`, e);
      });
      
      // Try to play the audio
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.catch((error) => {
          console.warn(`Cannot play sound: ${soundType}. Error:`, error);
          // Try to resume AudioContext and play again
          if (this.audioContext && this.audioContext.state === 'suspended') {
            this.audioContext.resume().then(() => {
              audio.play().catch(() => {
                console.warn(`Still cannot play sound: ${soundType} after resuming AudioContext`);
              });
            });
          }
        });
      }
    } catch (error) {
      console.warn(`Error creating audio for: ${soundType}`, error);
    }
  }

  public playBackgroundMusic() {
    if (!this.config.backgroundMusicEnabled || !this.config.audioEnabled) return;

    // If music is already playing, just update volume and continue
    if (this.backgroundMusicAudio && !this.backgroundMusicAudio.paused) {
      this.backgroundMusicAudio.volume = this.config.backgroundMusicVolume;
      return;
    }

    // Stop existing music if playing
    this.stopBackgroundMusic();

    try {
      const audio = new Audio('/sounds/wonderment-bgm.MP3');
      audio.volume = this.config.backgroundMusicVolume;
      audio.loop = true; // Changed to true to prevent resets
      
      // Handle audio loading errors gracefully
      audio.addEventListener('error', () => {
        console.warn('Background music file not available: /sounds/wonderment-bgm.MP3. Make sure sound files are in the public/sounds directory.');
      });
      
      audio.play().catch(() => {
        console.warn('Cannot play background music. Audio files should be in public/sounds directory.');
      });
      
      this.backgroundMusicAudio = audio;
    } catch (error) {
      console.warn('Error creating background music audio', error);
    }
  }

  public stopBackgroundMusic() {
    if (this.backgroundMusicAudio) {
      this.backgroundMusicAudio.pause();
      this.backgroundMusicAudio.currentTime = 0;
      this.backgroundMusicAudio = null;
    }
  }

  public toggleBackgroundMusic() {
    this.config.backgroundMusicEnabled = !this.config.backgroundMusicEnabled;
    
    if (this.config.backgroundMusicEnabled) {
      this.playBackgroundMusic();
    } else {
      this.stopBackgroundMusic();
    }
  }

  public toggleAudio() {
    this.config.audioEnabled = !this.config.audioEnabled;
    
    if (!this.config.audioEnabled) {
      this.stopBackgroundMusic();
    } else if (this.config.backgroundMusicEnabled) {
      this.playBackgroundMusic();
    }
  }

  public async initializeAudioContext() {
    if (!this.audioContext && typeof window !== 'undefined') {
      try {
        this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      } catch (error) {
        console.warn('Could not create AudioContext:', error);
        return;
      }
    }
    if (this.audioContext && this.audioContext.state === 'suspended') {
      try {
        await this.audioContext.resume();
        console.log('AudioContext resumed successfully');
      } catch (error) {
        console.warn('Could not resume AudioContext:', error);
      }
    }
  }

  public cleanup() {
    this.stopBackgroundMusic();
    if (this.audioContext) {
      this.audioContext.close();
      this.audioContext = null;
    }
  }
}

// Create a singleton instance
let soundServiceInstance: SoundService | null = null;

export const getSoundService = (config?: SoundConfig): SoundService => {
  if (!soundServiceInstance && config) {
    soundServiceInstance = new SoundService(config);
  } else if (soundServiceInstance && config) {
    // Update existing service with new config
    soundServiceInstance.updateConfig(config);
  }
  return soundServiceInstance!;
};

export const destroySoundService = () => {
  if (soundServiceInstance) {
    soundServiceInstance.cleanup();
    soundServiceInstance = null;
  }
};
