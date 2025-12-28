import { inkBridge, InkState, InkChoice } from './InkBridge';

export interface GameState {
  currentText: string[];
  choices: InkChoice[];
  tags: string[];
  isEnded: boolean;
}

export class StoryRunner {
  private currentState: GameState = {
    currentText: [],
    choices: [],
    tags: [],
    isEnded: false,
  };

  async loadStory(storyJson: object): Promise<GameState> {
    await inkBridge.loadStory(storyJson);
    return this.advanceStory();
  }

  advanceStory(): GameState {
    const inkState: InkState = inkBridge.continue();

    this.currentState = {
      currentText: inkState.text,
      choices: inkState.choices,
      tags: inkState.tags,
      isEnded: inkState.isEnded,
    };

    return this.currentState;
  }

  selectChoice(index: number): GameState {
    inkBridge.selectChoice(index);
    return this.advanceStory();
  }

  getState(): GameState {
    return this.currentState;
  }

  // For save/load (future phase)
  serializeState(): string {
    return inkBridge.getState();
  }

  deserializeState(stateJson: string): GameState {
    inkBridge.loadState(stateJson);
    return this.advanceStory();
  }
}

export const storyRunner = new StoryRunner();
