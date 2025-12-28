# Architecture Decisions

## Why These Technologies?

### React Native + TypeScript
- Cross-platform mobile (iOS/Android) from single codebase
- TypeScript provides type safety and better AI code generation
- Large ecosystem for mobile UI components

### Ink (inkjs)
- Industry-standard narrative scripting (used by 80 Days, Heaven's Vault)
- Clean syntax for branching dialogue and stat checks
- Compiles to JSON for easy runtime integration
- Variables can sync bidirectionally with game engine

### Zustand over Redux
- Simpler API, less boilerplate
- Better TypeScript inference
- Sufficient for game state complexity

## Engine Architecture

See `.development-plan.md` for the full diagram. Key principle:

**Reusable Engine + Pluggable Story Packs**

The engine handles:
- UI rendering (text, choices, images)
- Soul Stats persistence
- Save/Load system
- Ink runtime bridge

Story packs are just `.ink` files + assets. Same engine runs all three games.

## File Organization

When adding new systems:
- Engine code → `src/engine/`
- UI components → `src/app/components/`
- Screens → `src/app/screens/`
- State stores → `src/app/store/`
- Story content → `src/stories/{game-name}/`
