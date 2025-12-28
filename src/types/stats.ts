export const STAT_NAMES = [
  'strength',
  'intelligence',
  'agility',
  'stamina',
  'charisma',
  'luck',
  'morality',
] as const;

export type StatName = typeof STAT_NAMES[number];

export type Stats = Record<StatName, number>;

export const DEFAULT_STATS: Stats = {
  strength: 1,
  intelligence: 1,
  agility: 1,
  stamina: 1,
  charisma: 1,
  luck: 1,
  morality: 1,
};
