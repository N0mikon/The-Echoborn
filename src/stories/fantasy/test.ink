// Core stats (synced with app)
VAR strength = 1
VAR intelligence = 1
VAR agility = 1
VAR stamina = 1
VAR charisma = 1
VAR luck = 1
VAR morality = 1

VAR player_name = "Unknown"

=== start ===
You awaken in darkness.

The air is cold and damp. You hear distant footsteps.

* [Call out for help] -> call_out
* [Stay silent and listen] -> stay_silent
* [Feel around in the darkness] -> feel_around

=== call_out ===
Your voice echoes through the chamber.
"Hello? Is anyone there?"

~ charisma = charisma + 1

No response. The footsteps have stopped.
Your charisma increased to {charisma}.

-> continue_story

=== stay_silent ===
You hold your breath.
The footsteps grow closer... then pass by.

~ agility = agility + 1

You remained perfectly still.
Your agility increased to {agility}.

-> continue_story

=== feel_around ===
Your hands find rough stone walls.
This seems to be some kind of tunnel.

~ intelligence = intelligence + 1

You've learned something about your surroundings.
Your intelligence increased to {intelligence}.

-> continue_story

=== continue_story ===
A faint light appears ahead.

* [Move toward the light cautiously] -> approach_light
* [Rush toward the light] -> rush_light
* [Turn back into the darkness] -> turn_back

=== approach_light ===
~ stamina = stamina + 1

You pace yourself carefully.
Your stamina increased to {stamina}.

-> light_reached

=== rush_light ===
~ strength = strength + 1

You sprint with all your might.
Your strength increased to {strength}.

-> light_reached

=== turn_back ===
~ morality = morality + 1

Something tells you the light is not to be trusted.
Your morality increased to {morality}.

-> darkness_path

=== light_reached ===
You reach the source of the light - a glowing crystal.

{intelligence >= 2:
    -> examine_crystal
- else:
    -> touch_crystal
}

=== examine_crystal ===
Your keen mind recognizes this as a Soul Crystal.
You carefully extract its power.

~ luck = luck + 2

Your luck increased significantly!

-> end_test

=== touch_crystal ===
You reach out and touch the crystal.
It pulses with warmth.

~ luck = luck + 1

Your luck increased to {luck}.

-> end_test

=== darkness_path ===
You venture deeper into the shadows.

{agility >= 2:
    You nimbly avoid the traps hidden in the floor.
- else:
    You stumble but catch yourself.
}

-> end_test

=== end_test ===
This concludes the test story.

Your final stats:
STR: {strength}, INT: {intelligence}, AGI: {agility}
STA: {stamina}, CHA: {charisma}, LCK: {luck}, MOR: {morality}

-> END
