// Custom hook for managing sound effects in HabitQuest
import { useEffect, useRef } from 'react';
import { getSoundService, destroySoundService, type SoundConfig } from '../services/soundService';

export interface UseSoundEffectsConfig {
  audioEnabled?: boolean;
  backgroundMusicEnabled?: boolean;
  soundEffectsVolume?: number;
  backgroundMusicVolume?: number;
}

export const useSoundEffects = (config: UseSoundEffectsConfig = {}) => {
  const soundServiceRef = useRef<ReturnType<typeof getSoundService> | null>(null);
  const isInitialized = useRef(false);

  // Initialize sound service only once
  useEffect(() => {
    if (!isInitialized.current) {
      const defaultConfig: SoundConfig = {
        audioEnabled: true,
        backgroundMusicEnabled: false,
        soundEffectsVolume: 0.25,
        backgroundMusicVolume: 0.5,
        ...config
      };

      soundServiceRef.current = getSoundService(defaultConfig);
      isInitialized.current = true;
    }
    
    return () => {
      // Only destroy on component unmount, not on config changes
      if (isInitialized.current) {
        destroySoundService();
        isInitialized.current = false;
      }
    };
  }, []); // Empty dependency array - only run once

  // Update sound service config when props change (without recreating the service)
  useEffect(() => {
    if (soundServiceRef.current) {
      soundServiceRef.current.updateConfig(config);
    } else {
      // If service doesn't exist, create it with current config
      const defaultConfig: SoundConfig = {
        audioEnabled: true,
        backgroundMusicEnabled: false,
        soundEffectsVolume: 0.25,
        backgroundMusicVolume: 0.5,
        ...config
      };
      soundServiceRef.current = getSoundService(defaultConfig);
    }
  }, [config.audioEnabled, config.backgroundMusicEnabled, config.soundEffectsVolume, config.backgroundMusicVolume]);

  // Sound effect functions
  const playButtonClick = () => {
    soundServiceRef.current?.playSound('button-click');
  };

  const playHover = () => {
    soundServiceRef.current?.playSound('hover');
  };

  const playLevelUp = () => {
    soundServiceRef.current?.playSound('level-up');
  };

  const playTaskComplete = () => {
    soundServiceRef.current?.playSound('task-complete');
  };

  const playCoins = () => {
    soundServiceRef.current?.playSound('coins');
  };

  // Background music functions
  const playBackgroundMusic = () => {
    soundServiceRef.current?.playBackgroundMusic();
  };

  const stopBackgroundMusic = () => {
    soundServiceRef.current?.stopBackgroundMusic();
  };

  const toggleBackgroundMusic = () => {
    soundServiceRef.current?.toggleBackgroundMusic();
  };

  const toggleAudio = () => {
    soundServiceRef.current?.toggleAudio();
  };

  // Generic sound player
  const playSound = (soundType: string) => {
    soundServiceRef.current?.playSound(soundType);
  };

  // Initialize audio context on first user interaction
  const initializeAudio = async () => {
    if (soundServiceRef.current) {
      await soundServiceRef.current.initializeAudioContext();
    }
  };

  return {
    // Sound effects
    playButtonClick,
    playHover,
    playLevelUp,
    playTaskComplete,
    playCoins,
    playSound,
    
    // Background music
    playBackgroundMusic,
    stopBackgroundMusic,
    toggleBackgroundMusic,
    toggleAudio,
    
    // Audio initialization
    initializeAudio,
    
    // Direct access to sound service for advanced usage
    soundService: soundServiceRef.current
  };
};

// Convenience hook for just sound effects (no background music)
export const useSoundEffectsOnly = (audioEnabled: boolean = true, volume: number = 0.75) => {
  return useSoundEffects({
    audioEnabled,
    backgroundMusicEnabled: false,
    soundEffectsVolume: volume,
    backgroundMusicVolume: 0
  });
};

// Convenience hook for just background music
export const useBackgroundMusic = (enabled: boolean = false, volume: number = 0.5) => {
  return useSoundEffects({
    audioEnabled: true,
    backgroundMusicEnabled: enabled,
    soundEffectsVolume: 0,
    backgroundMusicVolume: volume
  });
};
