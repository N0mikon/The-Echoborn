# Soul Stats System

## Core Concept

Players retain 10% of their highest-ever stats across deaths, creating a roguelike progression loop.

## Stats

| Stat | Abbrev | Purpose |
|------|--------|---------|
| Strength | STR | Physical power, combat |
| Intelligence | INT | Magic, puzzles, knowledge checks |
| Agility | AGI | Speed, stealth, reflexes |
| Stamina | STA | Endurance, health, survival |
| Charisma | CHA | Persuasion, relationships |
| Luck | LCK | Random event outcomes |
| Morality | MOR | Alignment, faction reactions |

## Calculations

### On Death
```typescript
// Update soul stats (highest-ever values)
for (const stat of STATS) {
  soulStats[stat] = Math.max(soulStats[stat], currentStats[stat]);
}
```

### On Rebirth
```typescript
// New starting stats = 10% of soul stats (minimum 1)
for (const stat of STATS) {
  currentStats[stat] = Math.max(1, Math.floor(soulStats[stat] * 0.10));
}
age = 12;
// Reset all flags and relationships
```

## Ink Integration

Stats are exposed to Ink as external variables:
```ink
VAR strength = 1
VAR intelligence = 1
// etc.

// Stat checks in story
{strength >= 10:
  You easily lift the boulder.
- else:
  The boulder won't budge.
}
```

## Story Gating

Content unlocks based on stat thresholds. Players must die and grow stronger to access all paths.
