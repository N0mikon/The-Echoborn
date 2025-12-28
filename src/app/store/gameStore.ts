import { create } from 'zustand';
import { storyRunner, GameState, InkChoice } from '../../engine';

interface GameStore {
  // State
  isLoading: boolean;
  isPlaying: boolean;
  currentText: string[];
  choices: InkChoice[];
  tags: string[];
  isEnded: boolean;

  // Actions
  loadStory: (storyJson: object) => Promise<void>;
  selectChoice: (index: number) => void;
  resetGame: () => void;
}

const initialState = {
  isLoading: false,
  isPlaying: false,
  currentText: [],
  choices: [],
  tags: [],
  isEnded: false,
};

export const useGameStore = create<GameStore>((set) => ({
  ...initialState,

  loadStory: async (storyJson: object) => {
    set({ isLoading: true });

    try {
      const state: GameState = await storyRunner.loadStory(storyJson);
      set({
        isLoading: false,
        isPlaying: true,
        currentText: state.currentText,
        choices: state.choices,
        tags: state.tags,
        isEnded: state.isEnded,
      });
    } catch (error) {
      console.error('Failed to load story:', error);
      set({ isLoading: false });
    }
  },

  selectChoice: (index: number) => {
    const state: GameState = storyRunner.selectChoice(index);
    set({
      currentText: state.currentText,
      choices: state.choices,
      tags: state.tags,
      isEnded: state.isEnded,
    });
  },

  resetGame: () => {
    set(initialState);
  },
}));
