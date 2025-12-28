import AsyncStorage from '@react-native-async-storage/async-storage';
import { Stats, STAT_NAMES, DEFAULT_STATS, StatName } from '../types/stats';

const STORAGE_KEYS = {
  SOUL_STATS: '@echoborn/soulStats',
  LOOP_COUNT: '@echoborn/loopCount',
} as const;

export interface SoulStatsData {
  soulStats: Stats;
  loopCount: number;
}

/**
 * Calculate new soul stats by taking max of current vs existing soul stats
 */
export function calculateSoulStats(currentStats: Stats, soulStats: Stats): Stats {
  const newSoulStats = { ...soulStats };
  for (const name of STAT_NAMES) {
    newSoulStats[name] = Math.max(soulStats[name], currentStats[name]);
  }
  return newSoulStats;
}

/**
 * Calculate starting stats for rebirth: 10% of soul stats, minimum 1
 */
export function calculateStartingStats(soulStats: Stats): Stats {
  const startingStats = { ...DEFAULT_STATS };
  for (const name of STAT_NAMES) {
    startingStats[name] = Math.max(1, Math.floor(soulStats[name] * 0.10));
  }
  return startingStats;
}

/**
 * Load persisted soul stats from AsyncStorage
 */
export async function loadSoulStats(): Promise<SoulStatsData> {
  try {
    const [soulStatsJson, loopCountStr] = await Promise.all([
      AsyncStorage.getItem(STORAGE_KEYS.SOUL_STATS),
      AsyncStorage.getItem(STORAGE_KEYS.LOOP_COUNT),
    ]);

    const soulStats: Stats = soulStatsJson
      ? JSON.parse(soulStatsJson)
      : { ...DEFAULT_STATS };

    const loopCount = loopCountStr ? parseInt(loopCountStr, 10) : 1;

    return { soulStats, loopCount };
  } catch (error) {
    console.error('Failed to load soul stats:', error);
    return { soulStats: { ...DEFAULT_STATS }, loopCount: 1 };
  }
}

/**
 * Save soul stats to AsyncStorage
 */
export async function saveSoulStats(data: SoulStatsData): Promise<void> {
  try {
    await Promise.all([
      AsyncStorage.setItem(STORAGE_KEYS.SOUL_STATS, JSON.stringify(data.soulStats)),
      AsyncStorage.setItem(STORAGE_KEYS.LOOP_COUNT, String(data.loopCount)),
    ]);
  } catch (error) {
    console.error('Failed to save soul stats:', error);
    throw error;
  }
}

/**
 * Check if any stats increased (for highlighting in UI)
 */
export function getStatIncreases(oldStats: Stats, newStats: Stats): Partial<Record<StatName, number>> {
  const increases: Partial<Record<StatName, number>> = {};
  for (const name of STAT_NAMES) {
    if (newStats[name] > oldStats[name]) {
      increases[name] = newStats[name] - oldStats[name];
    }
  }
  return increases;
}
