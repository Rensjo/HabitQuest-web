/**
 * Performance-Optimized Sound Service
 * Implements audio pooling, lazy loading, and memory management
 */

interface OptimizedSoundConfig {
  audioEnabled: boolean;
  backgroundMusicEnabled: boolean;
  soundEffectsVolume: number;
  backgroundMusicVolume: number;
  maxPoolSize: number;
  preloadSounds: boolean;
}

type SoundType = 'button-click' | 'hover' | 'level-up' | 'task-complete' | 'coins' | 'badge';

class OptimizedSoundService {
  private config: OptimizedSoundConfig;
  private audioPool: Map<SoundType, HTMLAudioElement[]> = new Map();
  private backgroundMusic: HTMLAudioElement | null = null;
  private isInitialized: boolean = false;
  private preloadPromises: Map<SoundType, Promise<void>> = new Map();
  private pausedByTray: boolean = false;

  constructor(config: OptimizedSoundConfig) {
    this.config = config;
    this.initializeOptimizedAudio();
  }

  private initializeOptimizedAudio() {
    // Don't initialize until user interaction for better performance
    if (this.isInitialized) return;
    
    try {
      // Create audio context only when needed
      if (this.config.preloadSounds) {
        this.preloadCriticalSounds();
      }
      this.isInitialized = true;
    } catch (error) {
      console.error('Failed to initialize optimized audio:', error);
    }
  }

  private getSoundPaths(): Record<SoundType, string> {
    const baseUrl = window.location.origin;
    return {
      'button-click': `${baseUrl}/sounds/button-click-sound.mp3`,
      'hover': `${baseUrl}/sounds/hover-button-sound.mp3`,
      'level-up': `${baseUrl}/sounds/level-up-sound.mp3`,
      'task-complete': `${baseUrl}/sounds/task-complete-sound.mp3`,
      'coins': `${baseUrl}/sounds/coins-sound.mp3`,
      'badge': `${baseUrl}/sounds/badge-sound.mp3`,
    };
  }

  private async preloadCriticalSounds() {
    // Only preload essential sounds to reduce memory usage
    const criticalSounds: SoundType[] = ['button-click', 'task-complete'];
    
    for (const soundType of criticalSounds) {
      this.preloadSound(soundType);
    }
  }

  private preloadSound(soundType: SoundType): Promise<void> {
    if (this.preloadPromises.has(soundType)) {
      return this.preloadPromises.get(soundType)!;
    }

    const promise = new Promise<void>((resolve, reject) => {
      const audio = new Audio();
      const soundPaths = this.getSoundPaths();
      
      audio.preload = 'metadata'; // Only load metadata, not full audio
      audio.volume = 0.01; // Very quiet for preload test
      
      const onCanPlay = () => {
        audio.removeEventListener('canplay', onCanPlay);
        audio.removeEventListener('error', onError);
        
        // Add to pool
        this.addToPool(soundType, audio);
        resolve();
      };
      
      const onError = () => {
        audio.removeEventListener('canplay', onCanPlay);
        audio.removeEventListener('error', onError);
        console.warn(`Failed to preload sound: ${soundType}`);
        reject();
      };
      
      audio.addEventListener('canplay', onCanPlay);
      audio.addEventListener('error', onError);
      audio.src = soundPaths[soundType];
    });

    this.preloadPromises.set(soundType, promise);
    return promise;
  }

  private addToPool(soundType: SoundType, audio: HTMLAudioElement) {
    if (!this.audioPool.has(soundType)) {
      this.audioPool.set(soundType, []);
    }
    
    const pool = this.audioPool.get(soundType)!;
    if (pool.length < this.config.maxPoolSize) {
      pool.push(audio);
    }
  }

  private getAudioFromPool(soundType: SoundType): HTMLAudioElement | null {
    const pool = this.audioPool.get(soundType);
    if (!pool || pool.length === 0) return null;
    
    // Find an audio element that's not currently playing
    for (const audio of pool) {
      if (audio.paused || audio.ended) {
        return audio;
      }
    }
    
    return null;
  }

  private async createOptimizedAudio(soundType: SoundType): Promise<HTMLAudioElement> {
    const audio = new Audio();
    const soundPaths = this.getSoundPaths();
    
    audio.preload = 'none'; // Don't preload unless needed
    audio.volume = this.config.soundEffectsVolume;
    audio.src = soundPaths[soundType];
    
    // Add to pool for reuse
    this.addToPool(soundType, audio);
    
    return audio;
  }

  public async playSound(soundType: SoundType): Promise<boolean> {
    if (!this.config.audioEnabled || this.pausedByTray) return false;
    
    try {
      let audio = this.getAudioFromPool(soundType);
      
      if (!audio) {
        // Try to preload if not available
        if (!this.preloadPromises.has(soundType)) {
          audio = await this.createOptimizedAudio(soundType);
        } else {
          await this.preloadSound(soundType);
          audio = this.getAudioFromPool(soundType);
        }
      }
      
      if (!audio) {
        console.warn(`Could not create audio for: ${soundType}`);
        return false;
      }
      
      // Reset audio to beginning and set volume
      audio.currentTime = 0;
      audio.volume = this.config.soundEffectsVolume;
      
      await audio.play();
      return true;
    } catch (error) {
      console.warn(`Failed to play sound ${soundType}:`, error);
      return false;
    }
  }

  public async playBackgroundMusic(): Promise<boolean> {
    if (!this.config.backgroundMusicEnabled || this.pausedByTray) return false;
    
    try {
      if (!this.backgroundMusic) {
        this.backgroundMusic = new Audio(`${window.location.origin}/sounds/wonderment-bgm.MP3`);
        this.backgroundMusic.loop = true;
        this.backgroundMusic.preload = 'none';
      }
      
      if (this.backgroundMusic.paused) {
        this.backgroundMusic.volume = this.config.backgroundMusicVolume;
        await this.backgroundMusic.play();
        return true;
      }
      
      return false;
    } catch (error) {
      console.warn('Failed to play background music:', error);
      return false;
    }
  }

  public stopBackgroundMusic(): void {
    if (this.backgroundMusic && !this.backgroundMusic.paused) {
      this.backgroundMusic.pause();
    }
  }

  public updateConfig(newConfig: Partial<OptimizedSoundConfig>): void {
    this.config = { ...this.config, ...newConfig };
    
    // Update volume for all pooled audio
    this.audioPool.forEach((pool) => {
      pool.forEach((audio) => {
        audio.volume = this.config.soundEffectsVolume;
      });
    });
    
    // Update background music volume
    if (this.backgroundMusic) {
      this.backgroundMusic.volume = this.config.backgroundMusicVolume;
    }
  }

  public pauseAll(): void {
    this.pausedByTray = true;
    this.stopBackgroundMusic();
    
    // Pause all pooled audio
    this.audioPool.forEach((pool) => {
      pool.forEach((audio) => {
        if (!audio.paused) {
          audio.pause();
        }
      });
    });
  }

  public resumeAll(): void {
    this.pausedByTray = false;
    
    if (this.config.backgroundMusicEnabled && this.backgroundMusic) {
      this.backgroundMusic.play().catch(() => {
        // Ignore autoplay restrictions
      });
    }
  }

  public cleanup(): void {
    // Clean up all audio resources
    this.stopBackgroundMusic();
    
    this.audioPool.forEach((pool) => {
      pool.forEach((audio) => {
        audio.pause();
        audio.src = '';
        audio.load();
      });
    });
    
    this.audioPool.clear();
    this.preloadPromises.clear();
    
    if (this.backgroundMusic) {
      this.backgroundMusic.pause();
      this.backgroundMusic.src = '';
      this.backgroundMusic = null;
    }
  }

  public getStatus() {
    return {
      initialized: this.isInitialized,
      poolSizes: Object.fromEntries(
        Array.from(this.audioPool.entries()).map(([key, pool]) => [key, pool.length])
      ),
      backgroundMusicPlaying: this.backgroundMusic && !this.backgroundMusic.paused,
      pausedByTray: this.pausedByTray,
      config: this.config,
    };
  }
}

// Singleton instance with optimized configuration
let optimizedSoundService: OptimizedSoundService | null = null;

export function getOptimizedSoundService(config?: Partial<OptimizedSoundConfig>): OptimizedSoundService {
  if (!optimizedSoundService) {
    const defaultConfig: OptimizedSoundConfig = {
      audioEnabled: true,
      backgroundMusicEnabled: false,
      soundEffectsVolume: 0.15,
      backgroundMusicVolume: 0.5,
      maxPoolSize: 3, // Limit memory usage
      preloadSounds: true,
      ...config,
    };
    
    optimizedSoundService = new OptimizedSoundService(defaultConfig);
  }
  
  return optimizedSoundService;
}

export function destroyOptimizedSoundService(): void {
  if (optimizedSoundService) {
    optimizedSoundService.cleanup();
    optimizedSoundService = null;
  }
}

// Hook for React components
export function useOptimizedSoundService(config?: Partial<OptimizedSoundConfig>) {
  const soundService = getOptimizedSoundService(config);
  
  return {
    playSound: (soundType: SoundType) => soundService.playSound(soundType),
    playBackgroundMusic: () => soundService.playBackgroundMusic(),
    stopBackgroundMusic: () => soundService.stopBackgroundMusic(),
    updateConfig: (newConfig: Partial<OptimizedSoundConfig>) => soundService.updateConfig(newConfig),
    pauseAll: () => soundService.pauseAll(),
    resumeAll: () => soundService.resumeAll(),
    getStatus: () => soundService.getStatus(),
  };
}

export type { OptimizedSoundConfig, SoundType };