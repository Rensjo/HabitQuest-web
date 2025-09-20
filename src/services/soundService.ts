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
  private audioCache: Map<string, HTMLAudioElement> = new Map();
  private preloadingPromises: Map<string, Promise<void>> = new Map();
  private isPreloaded: boolean = false;

  constructor(config: SoundConfig) {
    this.config = config;
    this.initializeAudio();
    // Start preloading sounds immediately after construction
    this.preloadSounds();
  }

  private initializeAudio() {
    // Don't initialize AudioContext immediately - wait for user interaction
    // This will be called from playSound when needed
  }

  private getSoundPaths(): { [key: string]: string[] } {
    const baseUrl = window.location.origin;
    return {
      'button-click': [
        `${baseUrl}/sounds/button-click-sound.mp3`,
        '/sounds/button-click-sound.mp3',
        './sounds/button-click-sound.mp3'
      ],
      'hover': [
        `${baseUrl}/sounds/hover-button-sound.mp3`,
        '/sounds/hover-button-sound.mp3',
        './sounds/hover-button-sound.mp3'
      ],
      'level-up': [
        `${baseUrl}/sounds/level-up-sound.mp3`,
        '/sounds/level-up-sound.mp3',
        './sounds/level-up-sound.mp3'
      ],
      'task-complete': [
        `${baseUrl}/sounds/task-complete-sound.mp3`,
        '/sounds/task-complete-sound.mp3',
        './sounds/task-complete-sound.mp3'
      ],
      'coins': [
        `${baseUrl}/sounds/coins-sound.mp3`,
        '/sounds/coins-sound.mp3',
        './sounds/coins-sound.mp3'
      ],
    };
  }

  private async preloadSounds(): Promise<void> {
    if (typeof window === 'undefined') return;

    const soundPaths = this.getSoundPaths();
    const preloadPromises: Promise<void>[] = [];

    for (const [soundType, paths] of Object.entries(soundPaths)) {
      const preloadPromise = this.preloadSound(soundType, paths);
      this.preloadingPromises.set(soundType, preloadPromise);
      preloadPromises.push(preloadPromise);
    }

    try {
      await Promise.all(preloadPromises);
      this.isPreloaded = true;
      console.log('All sounds preloaded successfully');
    } catch (error) {
      console.warn('Some sounds failed to preload:', error);
    }
  }

  private async preloadSound(soundType: string, paths: string[]): Promise<void> {
    for (const path of paths) {
      try {
        const audio = new Audio();
        audio.preload = 'auto';
        audio.volume = this.config.soundEffectsVolume;

        // Create a promise that resolves when the audio is loaded
        const loadPromise = new Promise<void>((resolve, reject) => {
          const handleLoad = () => {
            audio.removeEventListener('canplaythrough', handleLoad);
            audio.removeEventListener('error', handleError);
            resolve();
          };

          const handleError = (e: Event) => {
            audio.removeEventListener('canplaythrough', handleLoad);
            audio.removeEventListener('error', handleError);
            reject(e);
          };

          audio.addEventListener('canplaythrough', handleLoad);
          audio.addEventListener('error', handleError);
        });

        audio.src = path;
        await loadPromise;
        
        // Successfully loaded, cache it and break the loop
        this.audioCache.set(soundType, audio);
        console.log(`Preloaded sound: ${soundType} from ${path}`);
        return;

      } catch (error) {
        console.warn(`Failed to preload ${soundType} from ${path}:`, error);
        continue; // Try next path
      }
    }
    
    // If we get here, all paths failed
    console.warn(`Failed to preload sound: ${soundType} from all paths`);
  }

  public updateConfig(newConfig: Partial<SoundConfig>) {
    this.config = { ...this.config, ...newConfig };
    
    // Update background music volume if it's playing
    if (this.backgroundMusicAudio) {
      this.backgroundMusicAudio.volume = this.config.backgroundMusicVolume;
    }
  }

  public async playSound(soundType: string) {
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

    // Try to use cached audio first
    let audio = this.audioCache.get(soundType);
    
    if (audio) {
      // Use cached audio
      audio.volume = this.config.soundEffectsVolume;
      this.playAudioElement(audio, soundType);
    } else {
      // Audio not cached yet, check if it's still preloading
      const preloadingPromise = this.preloadingPromises.get(soundType);
      
      if (preloadingPromise) {
        try {
          // Wait for preloading to complete
          await preloadingPromise;
          audio = this.audioCache.get(soundType);
          if (audio) {
            audio.volume = this.config.soundEffectsVolume;
            this.playAudioElement(audio, soundType);
            return;
          }
        } catch (error) {
          console.warn(`Preloading failed for ${soundType}, falling back to dynamic loading`);
        }
      }
      
      // Fallback to dynamic loading if preloading failed or sound not found
      const soundPaths = this.getSoundPaths();
      const audioPaths = soundPaths[soundType];
      if (!audioPaths) {
        console.warn(`No audio file mapped for sound type: ${soundType}`);
        return;
      }
      
      await this.tryLoadAudio(audioPaths, this.config.soundEffectsVolume, 0, soundType);
    }
  }

  private playAudioElement(audio: HTMLAudioElement, soundType: string): void {
    // Reset the audio to start from beginning
    audio.currentTime = 0;
    
    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise.catch((error) => {
        console.warn(`Cannot play cached audio: ${soundType}. Error:`, error);
        // Try to resume AudioContext and play again
        if (this.audioContext && this.audioContext.state === 'suspended') {
          this.audioContext.resume().then(() => {
            audio.play().catch(() => {
              console.warn(`Still cannot play cached audio: ${soundType} after resuming AudioContext`);
            });
          });
        }
      });
    }
  }

  private async tryLoadAudio(paths: string[], volume: number, index: number = 0, cacheKey?: string): Promise<void> {
    if (index >= paths.length) {
      console.warn(`Failed to load audio from all paths:`, paths);
      return;
    }

    const audioPath = paths[index];
    
    return new Promise<void>((resolve) => {
      try {
        const audio = new Audio();
        audio.volume = volume;
        audio.preload = 'metadata'; // Changed from 'auto' to be less aggressive
        
        // Handle audio loading errors gracefully
        audio.addEventListener('error', () => {
          console.warn(`Audio file not available: ${audioPath}, trying next path...`);
          this.tryLoadAudio(paths, volume, index + 1, cacheKey).then(resolve);
        });
        
        // Handle successful load
        audio.addEventListener('canplaythrough', () => {
          console.log(`Successfully loaded audio: ${audioPath}`);
          
          // Cache the audio if cacheKey is provided
          if (cacheKey) {
            this.audioCache.set(cacheKey, audio);
            console.log(`Cached audio for ${cacheKey}`);
          }
          
          // Try to play the audio
          const playPromise = audio.play();
          if (playPromise !== undefined) {
            playPromise.then(() => {
              resolve();
            }).catch((error) => {
              console.warn(`Cannot play audio from: ${audioPath}. Error:`, error);
              // Try to resume AudioContext and play again
              if (this.audioContext && this.audioContext.state === 'suspended') {
                this.audioContext.resume().then(() => {
                  audio.play().catch(() => {
                    console.warn(`Still cannot play audio from: ${audioPath} after resuming AudioContext`);
                    resolve();
                  });
                });
              } else {
                resolve();
              }
            });
          } else {
            resolve();
          }
        });
        
        // Set source after setting up event handlers
        audio.src = audioPath;
        
      } catch (error) {
        console.warn(`Error creating audio for: ${audioPath}`, error);
        this.tryLoadAudio(paths, volume, index + 1, cacheKey).then(resolve);
      }
    });
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
