import { Story } from 'inkjs';

export interface InkChoice {
  index: number;
  text: string;
}

export interface InkState {
  text: string[];
  choices: InkChoice[];
  tags: string[];
  canContinue: boolean;
  isEnded: boolean;
}

export class InkBridge {
  private story: Story | null = null;

  async loadStory(storyJson: object): Promise<void> {
    this.story = new Story(storyJson);
    // If story has a 'start' knot, automatically jump to it
    if (this.story.KnotContainerWithName('start')) {
      this.story.ChoosePathString('start');
    }
  }

  getVariable(name: string): unknown {
    if (!this.story) throw new Error('Story not loaded');
    return this.story.variablesState[name];
  }

  setVariable(name: string, value: unknown): void {
    if (!this.story) throw new Error('Story not loaded');
    this.story.variablesState[name] = value;
  }

  continue(): InkState {
    if (!this.story) throw new Error('Story not loaded');

    const text: string[] = [];
    const tags: string[] = [];

    while (this.story.canContinue) {
      const line = this.story.Continue();
      if (line) text.push(line.trim());

      const currentTags = this.story.currentTags;
      if (currentTags) tags.push(...currentTags);
    }

    const choices = this.story.currentChoices.map((choice, index) => ({
      index,
      text: choice.text,
    }));

    return {
      text,
      choices,
      tags,
      canContinue: this.story.canContinue,
      isEnded: choices.length === 0 && !this.story.canContinue,
    };
  }

  selectChoice(index: number): void {
    if (!this.story) throw new Error('Story not loaded');
    this.story.ChooseChoiceIndex(index);
  }

  getState(): string {
    if (!this.story) throw new Error('Story not loaded');
    return this.story.state.ToJson();
  }

  loadState(stateJson: string): void {
    if (!this.story) throw new Error('Story not loaded');
    this.story.state.LoadJson(stateJson);
  }
}

export const inkBridge = new InkBridge();
