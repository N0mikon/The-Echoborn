import { InkBridge } from '../InkBridge';

// Use the compiled test story
import testStoryJson from '../../stories/compiled/test.json';

describe('InkBridge', () => {
  let bridge: InkBridge;

  beforeEach(() => {
    bridge = new InkBridge();
  });

  it('loads a story', async () => {
    await bridge.loadStory(testStoryJson);
    expect(() => bridge.continue()).not.toThrow();
  });

  it('returns text and choices', async () => {
    await bridge.loadStory(testStoryJson);
    const state = bridge.continue();

    expect(state.text).toContain('You awaken in darkness.');
    expect(state.choices.length).toBe(3);
    expect(state.choices[0].text).toBe('Call out for help');
  });

  it('handles choice selection', async () => {
    await bridge.loadStory(testStoryJson);
    bridge.continue();
    bridge.selectChoice(0);
    const state = bridge.continue();

    expect(state.text).toContain('Your voice echoes through the chamber.');
  });
});
