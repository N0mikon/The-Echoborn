import { create } from 'zustand';
import { storyRunner, GameState, InkChoice, saveGame } from '../../engine';
import { Stats, DEFAULT_STATS } from '../../types/stats';
import { useSoulStatsStore } from './soulStatsStore';

interface GameStore {
  // Existing state
  isLoading: boolean;
  isPlaying: boolean;
  currentText: string[];
  choices: InkChoice[];
  tags: string[];
  isEnded: boolean;

  // Stats state
  stats: Stats;

  // Existing actions
  loadStory: (storyJson: object) => Promise<void>;
  selectChoice: (index: number) => void;
  resetGame: () => void;

  // Stats action
  syncStats: (stats: Stats) => void;

  // Save/restore action
  restoreFromSave: (storyJson: object, inkState: string) => Promise<void>;
}

const initialState = {
  isLoading: false,
  isPlaying: false,
  currentText: [],
  choices: [],
  tags: [],
  isEnded: false,
  stats: DEFAULT_STATS,
};

export const useGameStore = create<GameStore>((set) => ({
  ...initialState,

  loadStory: async (storyJson: object) => {
    set({ isLoading: true });

    try {
      const state: GameState = await storyRunner.loadStory(storyJson);
      const stats = storyRunner.getStats();
      set({
        isLoading: false,
        isPlaying: true,
        currentText: state.currentText,
        choices: state.choices,
        tags: state.tags,
        isEnded: state.isEnded,
        stats,
      });
    } catch (error) {
      console.error('Failed to load story:', error);
      set({ isLoading: false });
    }
  },

  selectChoice: (index: number) => {
    const state: GameState = storyRunner.selectChoice(index);
    const stats = storyRunner.getStats();

    // Check for death tag
    if (state.tags.includes('DEATH')) {
      useSoulStatsStore.getState().handleDeath(stats);
      // Don't update game state - death screen will take over
      return;
    }

    set({
      currentText: state.currentText,
      choices: state.choices,
      tags: state.tags,
      isEnded: state.isEnded,
      stats,
    });

    // Auto-save after successful choice (fire-and-forget)
    saveGame('fantasy-test');
  },

  resetGame: () => {
    set(initialState);
  },

  syncStats: (stats: Stats) => {
    set({ stats });
  },

  restoreFromSave: async (storyJson: object, inkState: string) => {
    set({ isLoading: true });

    try {
      // Load story structure first
      await storyRunner.loadStory(storyJson);

      // Restore saved state
      const state = storyRunner.deserializeState(inkState);
      const stats = storyRunner.getStats();

      set({
        isLoading: false,
        isPlaying: true,
        currentText: state.currentText,
        choices: state.choices,
        tags: state.tags,
        isEnded: state.isEnded,
        stats,
      });
    } catch (error) {
      console.error('Failed to restore from save:', error);
      // Fall back to fresh start
      set({ isLoading: false });
    }
  },
}));
