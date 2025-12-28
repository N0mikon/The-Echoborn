import {
  calculateSoulStats,
  calculateStartingStats,
  getStatIncreases,
} from '../SoulStats';
import { Stats, DEFAULT_STATS } from '../../types/stats';

describe('SoulStats', () => {
  describe('calculateSoulStats', () => {
    it('returns max of each stat pair', () => {
      const currentStats: Stats = {
        strength: 5,
        intelligence: 10,
        agility: 3,
        stamina: 8,
        charisma: 2,
        luck: 15,
        morality: 7,
      };

      const soulStats: Stats = {
        strength: 3,
        intelligence: 12,
        agility: 5,
        stamina: 6,
        charisma: 4,
        luck: 10,
        morality: 7,
      };

      const result = calculateSoulStats(currentStats, soulStats);

      expect(result.strength).toBe(5);     // current > soul
      expect(result.intelligence).toBe(12); // soul > current
      expect(result.agility).toBe(5);       // soul > current
      expect(result.stamina).toBe(8);       // current > soul
      expect(result.charisma).toBe(4);      // soul > current
      expect(result.luck).toBe(15);         // current > soul
      expect(result.morality).toBe(7);      // equal
    });

    it('handles default stats correctly', () => {
      const currentStats: Stats = { ...DEFAULT_STATS };
      const soulStats: Stats = { ...DEFAULT_STATS };

      const result = calculateSoulStats(currentStats, soulStats);

      expect(result).toEqual(DEFAULT_STATS);
    });
  });

  describe('calculateStartingStats', () => {
    it('returns 10% of soul stats with minimum 1', () => {
      const soulStats: Stats = {
        strength: 50,
        intelligence: 100,
        agility: 25,
        stamina: 10,
        charisma: 5,
        luck: 9,
        morality: 1,
      };

      const result = calculateStartingStats(soulStats);

      expect(result.strength).toBe(5);      // 50 * 0.1 = 5
      expect(result.intelligence).toBe(10); // 100 * 0.1 = 10
      expect(result.agility).toBe(2);       // 25 * 0.1 = 2.5 -> 2
      expect(result.stamina).toBe(1);       // 10 * 0.1 = 1
      expect(result.charisma).toBe(1);      // 5 * 0.1 = 0.5 -> min 1
      expect(result.luck).toBe(1);          // 9 * 0.1 = 0.9 -> min 1
      expect(result.morality).toBe(1);      // 1 * 0.1 = 0.1 -> min 1
    });

    it('never returns less than 1', () => {
      const soulStats: Stats = {
        strength: 1,
        intelligence: 1,
        agility: 1,
        stamina: 1,
        charisma: 1,
        luck: 1,
        morality: 1,
      };

      const result = calculateStartingStats(soulStats);

      // All should be at least 1
      expect(result.strength).toBeGreaterThanOrEqual(1);
      expect(result.intelligence).toBeGreaterThanOrEqual(1);
      expect(result.agility).toBeGreaterThanOrEqual(1);
      expect(result.stamina).toBeGreaterThanOrEqual(1);
      expect(result.charisma).toBeGreaterThanOrEqual(1);
      expect(result.luck).toBeGreaterThanOrEqual(1);
      expect(result.morality).toBeGreaterThanOrEqual(1);
    });
  });

  describe('getStatIncreases', () => {
    it('correctly identifies which stats increased', () => {
      const oldStats: Stats = {
        strength: 5,
        intelligence: 10,
        agility: 3,
        stamina: 8,
        charisma: 2,
        luck: 15,
        morality: 7,
      };

      const newStats: Stats = {
        strength: 8,      // +3
        intelligence: 10, // no change
        agility: 5,       // +2
        stamina: 8,       // no change
        charisma: 2,      // no change
        luck: 20,         // +5
        morality: 7,      // no change
      };

      const increases = getStatIncreases(oldStats, newStats);

      expect(increases.strength).toBe(3);
      expect(increases.intelligence).toBeUndefined();
      expect(increases.agility).toBe(2);
      expect(increases.stamina).toBeUndefined();
      expect(increases.charisma).toBeUndefined();
      expect(increases.luck).toBe(5);
      expect(increases.morality).toBeUndefined();
    });

    it('returns empty object when no stats increased', () => {
      const stats: Stats = { ...DEFAULT_STATS };
      const increases = getStatIncreases(stats, stats);

      expect(Object.keys(increases)).toHaveLength(0);
    });

    it('does not flag decreases', () => {
      const oldStats: Stats = {
        ...DEFAULT_STATS,
        strength: 10,
      };

      const newStats: Stats = {
        ...DEFAULT_STATS,
        strength: 5,
      };

      const increases = getStatIncreases(oldStats, newStats);

      expect(increases.strength).toBeUndefined();
    });
  });
});
