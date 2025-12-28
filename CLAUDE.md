# The Echoborn

A narrative RPG visual novel with death-loop mechanics where players retain 10% of their highest stats across lives, progressively unlocking story content.

## Tech Stack

- **App**: React Native + TypeScript (cross-platform mobile)
- **Narrative**: Ink (inkjs) for branching stories with stat checks
- **State**: Zustand for game state and Soul Stats persistence
- **Storage**: AsyncStorage/SQLite for save data

## Project Status

### Implemented
- Project setup and planning docs

### Spec (Not Yet Implemented)
- React Native app (`src/app/`)
- Game engine (`src/engine/`)
- Ink story files (`src/stories/`)

## Key Documents

| Document | Purpose |
|----------|---------|
| `.development-plan.md` | Full architecture, implementation phases, tech decisions |

## Agent Documentation

Read these when working on related tasks:

| Document | When to read |
|----------|--------------|
| `agent_docs/ink-patterns.md` | Writing or modifying .ink story files |
| `agent_docs/soul-stats.md` | Working on stat calculations or death cycle |
| `agent_docs/architecture.md` | Making structural decisions or adding new systems |

## Commands (Available After Setup)

```bash
# Build Ink stories
npx inklecate src/stories/fantasy/*.ink -o src/stories/compiled/

# Run development
npm start

# Run tests
npm test
```

## Series Vision

Three games sharing the same engine and Soul Stats:
1. Fantasy Medieval (this game)
2. Horror
3. Cyberpunk
