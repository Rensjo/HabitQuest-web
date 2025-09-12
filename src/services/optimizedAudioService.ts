/**
 * ================================================================================================
 * OPTIMIZED AUDIO SERVICE
 * ================================================================================================
 * 
 * High-performance audio service optimized for Tauri desktop
 * 
 * @version 1.0.0
 */

export interface AudioConfig {
  audioEnabled: boolean;
  backgroundMusicEnabled: boolean;
  soundEffectsVolume: number;
  backgroundMusicVolume: number;
}

export interface AudioCache {
  [key: string]: HTMLAudioElement;
}

class OptimizedAudioService {
  private audioContext: AudioContext | null = null;
  private backgroundMusicAudio: HTMLAudioElement | null = null;
  private config: AudioConfig;
  private audioCache: AudioCache = {};
  private isInitialized = false;
  private preloadQueue: string[] = [];
  private isPreloading = false;

  constructor(config: AudioConfig) {
    this.config = config;
    this.initializeAudio();
  }

  /**
   * Initialize audio context (lazy initialization)
   */
  private async initializeAudio(): Promise<void> {
    if (this.isInitialized || typeof window === 'undefined') return;
    
    try {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      this.isInitialized = true;
      
      // Resume context if suspended
      if (this.audioContext.state === 'suspended') {
        await this.audioContext.resume();
      }
    } catch (error) {
      console.warn('Failed to initialize audio context:', error);
    }
  }

  /**
   * Update configuration
   */
  public updateConfig(newConfig: Partial<AudioConfig>): void {
    this.config = { ...this.config, ...newConfig };
    
    // Update background music volume if playing
    if (this.backgroundMusicAudio) {
      this.backgroundMusicAudio.volume = this.config.backgroundMusicVolume;
    }
  }

  /**
   * Preload audio files for better performance
   */
  public async preloadSounds(soundTypes: string[]): Promise<void> {
    if (this.isPreloading) return;
    
    this.isPreloading = true;
    this.preloadQueue = [...soundTypes];
    
    try {
      await this.initializeAudio();
      
      const preloadPromises = soundTypes.map(soundType => this.preloadSound(soundType));
      await Promise.allSettled(preloadPromises);
      
    } catch (error) {
      console.warn('Failed to preload sounds:', error);
    } finally {
      this.isPreloading = false;
      this.preloadQueue = [];
    }
  }

  /**
   * Preload a single sound
   */
  private async preloadSound(soundType: string): Promise<void> {
    if (this.audioCache[soundType]) return;
    
    const soundPath = this.getSoundPath(soundType);
    if (!soundPath) return;
    
    try {
      const audio = new Audio(soundPath);
      audio.preload = 'auto';
      audio.volume = this.config.soundEffectsVolume;
      
      // Wait for audio to be ready
      await new Promise((resolve, reject) => {
        audio.addEventListener('canplaythrough', resolve, { once: true });
        audio.addEventListener('error', reject, { once: true });
        audio.load();
      });
      
      this.audioCache[soundType] = audio;
    } catch (error) {
      console.warn(`Failed to preload sound ${soundType}:`, error);
    }
  }

  /**
   * Play sound effect
   */
  public async playSound(soundType: string): Promise<void> {
    if (!this.config.audioEnabled) return;
    
    try {
      await this.initializeAudio();
      
      // Resume context if suspended
      if (this.audioContext && this.audioContext.state === 'suspended') {
        await this.audioContext.resume();
      }
      
      // Get or create audio element
      let audio = this.audioCache[soundType];
      if (!audio) {
        const soundPath = this.getSoundPath(soundType);
        if (!soundPath) return;
        
        audio = new Audio(soundPath);
        audio.volume = this.config.soundEffectsVolume;
        this.audioCache[soundType] = audio;
      }
      
      // Clone audio for overlapping sounds
      const audioClone = audio.cloneNode() as HTMLAudioElement;
      audioClone.volume = this.config.soundEffectsVolume;
      
      // Play the sound
      const playPromise = audioClone.play();
      if (playPromise !== undefined) {
        playPromise.catch(error => {
          console.warn(`Failed to play sound ${soundType}:`, error);
        });
      }
      
    } catch (error) {
      console.warn(`Failed to play sound ${soundType}:`, error);
    }
  }

  /**
   * Play background music
   */
  public async playBackgroundMusic(): Promise<void> {
    if (!this.config.backgroundMusicEnabled || !this.config.audioEnabled) return;
    
    try {
      await this.initializeAudio();
      
      // Stop existing background music
      this.stopBackgroundMusic();
      
      const musicPath = '/sounds/background-music.mp3';
      this.backgroundMusicAudio = new Audio(musicPath);
      this.backgroundMusicAudio.volume = this.config.backgroundMusicVolume;
      this.backgroundMusicAudio.loop = true;
      
      const playPromise = this.backgroundMusicAudio.play();
      if (playPromise !== undefined) {
        await playPromise;
      }
      
    } catch (error) {
      console.warn('Failed to play background music:', error);
    }
  }

  /**
   * Stop background music
   */
  public stopBackgroundMusic(): void {
    if (this.backgroundMusicAudio) {
      this.backgroundMusicAudio.pause();
      this.backgroundMusicAudio.currentTime = 0;
      this.backgroundMusicAudio = null;
    }
  }

  /**
   * Get sound file path
   */
  private getSoundPath(soundType: string): string | null {
    const soundMap: { [key: string]: string } = {
      'button-click': '/sounds/button-click-sound.mp3',
      'hover': '/sounds/hover-button-sound.mp3',
      'level-up': '/sounds/level-up-sound.mp3',
      'task-complete': '/sounds/task-complete-sound.mp3',
      'coins': '/sounds/coins-sound.mp3',
      'background-music': '/sounds/background-music.mp3'
    };
    
    return soundMap[soundType] || null;
  }

  /**
   * Clear audio cache
   */
  public clearCache(): void {
    Object.values(this.audioCache).forEach(audio => {
      audio.pause();
      audio.src = '';
    });
    this.audioCache = {};
  }

  /**
   * Get audio context state
   */
  public getAudioContextState(): string | null {
    return this.audioContext?.state || null;
  }

  /**
   * Resume audio context
   */
  public async resumeAudioContext(): Promise<void> {
    if (this.audioContext && this.audioContext.state === 'suspended') {
      try {
        await this.audioContext.resume();
      } catch (error) {
        console.warn('Failed to resume audio context:', error);
      }
    }
  }
}

// ================================================================================================
// SINGLETON INSTANCE
// ================================================================================================

let audioServiceInstance: OptimizedAudioService | null = null;

export const getOptimizedAudioService = (config?: AudioConfig): OptimizedAudioService => {
  if (!audioServiceInstance && config) {
    audioServiceInstance = new OptimizedAudioService(config);
  } else if (audioServiceInstance && config) {
    audioServiceInstance.updateConfig(config);
  }
  return audioServiceInstance!;
};

// ================================================================================================
// EXPORTS
// ================================================================================================

export { OptimizedAudioService };
