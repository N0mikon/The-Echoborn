import { inkBridge, InkState, InkChoice } from './InkBridge';
import { Stats, STAT_NAMES, DEFAULT_STATS } from '../types/stats';

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

  // Read all stats from Ink variables
  getStats(): Stats {
    const stats = { ...DEFAULT_STATS };
    for (const name of STAT_NAMES) {
      const value = inkBridge.getVariable(name);
      if (typeof value === 'number') {
        stats[name] = value;
      }
    }
    return stats;
  }

  // Set a single stat in Ink (for rebirth in Phase 3)
  setStat(name: keyof Stats, value: number): void {
    inkBridge.setVariable(name, value);
  }

  // Set all stats in Ink (for rebirth in Phase 3)
  setStats(stats: Stats): void {
    for (const name of STAT_NAMES) {
      inkBridge.setVariable(name, stats[name]);
    }
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
