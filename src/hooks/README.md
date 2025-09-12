# useSoundEffects Hook

A custom React hook for managing sound effects and background music in HabitQuest.

## Basic Usage

```tsx
import { useSoundEffects } from './hooks/useSoundEffects';

function MyComponent() {
  const {
    playButtonClick,
    playHover,
    playLevelUp,
    playTaskComplete,
    playCoins,
    playBackgroundMusic,
    stopBackgroundMusic
  } = useSoundEffects({
    audioEnabled: true,
    backgroundMusicEnabled: false,
    soundEffectsVolume: 0.75,
    backgroundMusicVolume: 0.5
  });

  return (
    <button 
      onClick={playButtonClick}
      onMouseEnter={playHover}
    >
      Click me!
    </button>
  );
}
```

## Convenience Hooks

### Sound Effects Only
```tsx
import { useSoundEffectsOnly } from './hooks/useSoundEffects';

function MyComponent() {
  const { playButtonClick, playHover } = useSoundEffectsOnly(true, 0.8);
  
  return <button onClick={playButtonClick}>Click</button>;
}
```

### Background Music Only
```tsx
import { useBackgroundMusic } from './hooks/useSoundEffects';

function MyComponent() {
  const { playBackgroundMusic, stopBackgroundMusic } = useBackgroundMusic(true, 0.6);
  
  return (
    <div>
      <button onClick={playBackgroundMusic}>Play Music</button>
      <button onClick={stopBackgroundMusic}>Stop Music</button>
    </div>
  );
}
```

## Available Sound Effects

- `playButtonClick()` - Button click sound
- `playHover()` - Hover sound for interactive elements
- `playLevelUp()` - Level up notification sound
- `playTaskComplete()` - Task completion sound
- `playCoins()` - Coins/reward purchase sound
- `playSound(soundType)` - Generic sound player

## Background Music

- `playBackgroundMusic()` - Start background music
- `stopBackgroundMusic()` - Stop background music
- `toggleBackgroundMusic()` - Toggle background music on/off
- `toggleAudio()` - Toggle all audio on/off

## Configuration

The hook accepts a configuration object:

```tsx
interface UseSoundEffectsConfig {
  audioEnabled?: boolean;           // Master audio toggle
  backgroundMusicEnabled?: boolean; // Background music toggle
  soundEffectsVolume?: number;      // Volume for sound effects (0-1)
  backgroundMusicVolume?: number;   // Volume for background music (0-1)
}
```

## File Requirements

Sound files must be located in `public/sounds/`:
- `button-click-sound.mp3`
- `hover-button-sound.mp3`
- `level-up-sound.mp3`
- `task-complete-sound.mp3`
- `coins-sound.mp3`
- `wonderment-bgm.MP3`
