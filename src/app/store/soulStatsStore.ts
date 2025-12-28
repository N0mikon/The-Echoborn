import { create } from 'zustand';
import { Stats, DEFAULT_STATS, StatName } from '../../types/stats';
import {
  calculateSoulStats,
  calculateStartingStats,
  loadSoulStats,
  saveSoulStats,
  getStatIncreases,
  storyRunner,
} from '../../engine';

export type GameScreen = 'game' | 'death' | 'soulStats';

interface DeathData {
  finalStats: Stats;
  previousSoulStats: Stats;
  newSoulStats: Stats;
  increases: Partial<Record<StatName, number>>;
  newStartingStats: Stats;
}

interface SoulStatsStore {
  // Persisted state
  soulStats: Stats;
  loopCount: number;

  // Session state
  currentScreen: GameScreen;
  isInitialized: boolean;
  deathData: DeathData | null;
  pendingStartingStats: Stats | null;

  // Actions
  initialize: () => Promise<void>;
  handleDeath: (finalStats: Stats) => Promise<void>;
  handleRebirth: () => void;
  setScreen: (screen: GameScreen) => void;
  applyPendingStats: () => boolean;
}

export const useSoulStatsStore = create<SoulStatsStore>((set, get) => ({
  // Initial state
  soulStats: { ...DEFAULT_STATS },
  loopCount: 1,
  currentScreen: 'game',
  isInitialized: false,
  deathData: null,
  pendingStartingStats: null,

  initialize: async () => {
    const { soulStats, loopCount } = await loadSoulStats();
    set({ soulStats, loopCount, isInitialized: true });
  },

  handleDeath: async (finalStats: Stats) => {
    const { soulStats, loopCount } = get();

    // Calculate new soul stats (max of current vs previous)
    const newSoulStats = calculateSoulStats(finalStats, soulStats);
    const increases = getStatIncreases(soulStats, newSoulStats);
    const newStartingStats = calculateStartingStats(newSoulStats);
    const newLoopCount = loopCount + 1;

    // Persist to storage
    await saveSoulStats({ soulStats: newSoulStats, loopCount: newLoopCount });

    // Store death data for UI display
    const deathData: DeathData = {
      finalStats,
      previousSoulStats: soulStats,
      newSoulStats,
      increases,
      newStartingStats,
    };

    set({
      soulStats: newSoulStats,
      loopCount: newLoopCount,
      deathData,
      currentScreen: 'death',
    });
  },

  handleRebirth: () => {
    const { deathData } = get();
    if (!deathData) return;

    // Store the starting stats to apply after story reload
    set({
      pendingStartingStats: deathData.newStartingStats,
      currentScreen: 'game',
      deathData: null,
    });

    // Reset game store will trigger story reload in GameScreen
    // The pending stats will be applied after the story loads
    const { useGameStore } = require('./gameStore');
    useGameStore.getState().resetGame();
  },

  setScreen: (screen: GameScreen) => {
    set({ currentScreen: screen });
  },

  applyPendingStats: () => {
    const { pendingStartingStats, loopCount } = get();
    if (!pendingStartingStats) return false;

    // Apply starting stats to the Ink story
    storyRunner.setStats(pendingStartingStats);

    // Also set loop_count variable in Ink if it exists
    try {
      storyRunner.setStat('loop_count' as keyof Stats, loopCount);
    } catch {
      // loop_count may not exist in Ink, that's okay
    }

    set({ pendingStartingStats: null });
    return true;
  },
}));
