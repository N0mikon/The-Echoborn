# Ink Patterns for The Echoborn

## File Organization

```
src/stories/fantasy/
  ├── main.ink           # Entry point, includes all chapters
  ├── chapter1.ink       # Chapter content
  ├── chapter1_paths/    # Branching paths for chapter 1
  │   ├── path_a.ink
  │   ├── path_b.ink
  │   └── ...
  └── shared/            # Reusable knots (death scenes, etc.)
```

## Variable Conventions

```ink
// Stats (synced with engine)
VAR strength = 1
VAR intelligence = 1

// Relationship stats (per NPC)
VAR gareth_respect = 0
VAR kythara_trust = 0

// Flags (boolean markers)
VAR met_gareth = false
VAR knows_secret = false
```

## Tag Conventions

```ink
# BACKGROUND: location_name.jpg
# CHARACTER: character_name.png
# MUSIC: track_name.mp3
# SOUND: effect_name.wav
```

## Stat Check Pattern

```ink
=== stat_check_example ===
{
  - strength >= 10 && charisma >= 5:
    -> best_outcome
  - strength >= 10:
    -> strong_outcome
  - charisma >= 5:
    -> charming_outcome
  - else:
    -> failure_outcome
}
```

## Death Endpoint Pattern

When the player dies, divert to a death knot that the engine recognizes:

```ink
=== death ===
# DEATH
Your vision fades to black...
-> END
```

The engine detects the `# DEATH` tag and triggers the rebirth cycle.
