import AsyncStorage from '@react-native-async-storage/async-storage';
import { storyRunner } from './StoryRunner';

const STORAGE_KEYS = {
  SAVED_GAME: '@echoborn/savedGame',
} as const;

export interface SavedGame {
  storyId: string;
  inkState: string;
  savedAt: number;
}

/**
 * Check if a saved game exists
 */
export async function hasSavedGame(): Promise<boolean> {
  try {
    const saved = await AsyncStorage.getItem(STORAGE_KEYS.SAVED_GAME);
    return saved !== null;
  } catch (error) {
    console.error('Failed to check saved game:', error);
    return false;
  }
}

/**
 * Save current game state (fire-and-forget safe)
 */
export async function saveGame(storyId: string): Promise<void> {
  try {
    const inkState = storyRunner.serializeState();
    const savedGame: SavedGame = {
      storyId,
      inkState,
      savedAt: Date.now(),
    };
    await AsyncStorage.setItem(STORAGE_KEYS.SAVED_GAME, JSON.stringify(savedGame));
  } catch (error) {
    console.error('Failed to save game:', error);
    // Don't throw - fire-and-forget pattern
  }
}

/**
 * Load saved game state, returns null if none exists or on error
 */
export async function loadSavedGame(): Promise<SavedGame | null> {
  try {
    const saved = await AsyncStorage.getItem(STORAGE_KEYS.SAVED_GAME);
    if (!saved) return null;
    return JSON.parse(saved) as SavedGame;
  } catch (error) {
    console.error('Failed to load saved game:', error);
    return null;
  }
}

/**
 * Clear saved game (on death or manual reset)
 */
export async function clearSavedGame(): Promise<void> {
  try {
    await AsyncStorage.removeItem(STORAGE_KEYS.SAVED_GAME);
  } catch (error) {
    console.error('Failed to clear saved game:', error);
    // Don't throw - best effort
  }
}

/**
 * DEV ONLY: Clear all game data (save + soul stats)
 */
export async function clearAllData(): Promise<void> {
  try {
    await AsyncStorage.multiRemove([
      STORAGE_KEYS.SAVED_GAME,
      '@echoborn/soulStats',
      '@echoborn/loopCount',
    ]);
    console.log('All game data cleared');
  } catch (error) {
    console.error('Failed to clear all data:', error);
  }
}
