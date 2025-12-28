import { create } from 'zustand';
import { storyRunner, GameState, InkChoice } from '../../engine';
import { Stats, DEFAULT_STATS } from '../../types/stats';

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
    set({
      currentText: state.currentText,
      choices: state.choices,
      tags: state.tags,
      isEnded: state.isEnded,
      stats,
    });
  },

  resetGame: () => {
    set(initialState);
  },

  syncStats: (stats: Stats) => {
    set({ stats });
  },
}));
