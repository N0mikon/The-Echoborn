// Core stats - synced with React app
VAR strength = 1
VAR intelligence = 1
VAR agility = 1
VAR stamina = 1
VAR charisma = 1
VAR luck = 1
VAR morality = 1

// Loop tracking (synced from app on rebirth)
VAR loop_count = 1

=== start ===
You awaken in darkness.

{loop_count > 1:
    Something feels... familiar. You've been here before.
    Your soul carries the weight of {loop_count - 1} previous lives.
}

A faint light flickers in the distance.

* [Call out for help] -> call_out
* [Stay silent and listen] -> stay_silent
* [Feel around in the darkness] -> feel_around

=== call_out ===
Your voice echoes through the chamber.

~ charisma = charisma + 15

Your charisma increased to {charisma}.

A figure emerges from the shadows.

* [Approach confidently] -> approach_figure
* [Wait for them to come to you] -> wait_figure

=== stay_silent ===
You hold your breath and listen.

~ agility = agility + 15

Your agility increased to {agility}.

You hear footsteps approaching.

* [Hide in the shadows] -> hide_shadows
* [Prepare to flee] -> prepare_flee

=== feel_around ===
Your hands search the cold stone floor.

~ intelligence = intelligence + 15

Your intelligence increased to {intelligence}.

You find something carved into the floor.

* [Trace the pattern] -> trace_pattern
* [Search for more clues] -> search_clues

=== approach_figure ===
You step forward boldly.

~ strength = strength + 10

The figure reveals itself as a guardian spirit.

{charisma >= 20:
    -> guardian_impressed
- else:
    -> guardian_test
}

=== wait_figure ===
You stand your ground.

~ stamina = stamina + 10

The wait tests your patience, but you endure.

-> guardian_test

=== hide_shadows ===
You melt into the darkness.

~ agility = agility + 10

{agility >= 20:
    -> escape_unnoticed
- else:
    -> spotted_death
}

=== prepare_flee ===
You ready yourself to run.

~ stamina = stamina + 10

But the creature is faster.

-> chase_death

=== trace_pattern ===
The pattern glows as you trace it.

~ intelligence = intelligence + 10

{intelligence >= 20:
    -> unlock_secret
- else:
    -> pattern_trap_death
}

=== search_clues ===
You search further into the darkness.

~ luck = luck + 10

But you've ventured too far.

-> darkness_death

=== guardian_impressed ===
# LIFE2_CONTENT
"You carry yourself with remarkable presence," the guardian says.

~ charisma = charisma + 20
~ morality = morality + 10

"Few have earned my respect so quickly. Take this blessing."

Your charisma increased to {charisma}.
Your morality increased to {morality}.

-> life_continues

=== guardian_test ===
The guardian challenges you to prove your worth.

* [Accept the challenge] -> accept_challenge
* [Refuse and fight] -> fight_guardian_death

=== accept_challenge ===
~ strength = strength + 10
~ morality = morality + 5

You complete the trial with honor.

-> life_continues

=== escape_unnoticed ===
# LIFE2_CONTENT
You slip away like a phantom.

~ agility = agility + 20
~ luck = luck + 10

"None have ever escaped me before," a voice whispers. "Perhaps you are worthy."

Your agility increased to {agility}.
Your luck increased to {luck}.

-> life_continues

=== unlock_secret ===
# LIFE2_CONTENT
The ancient knowledge floods your mind.

~ intelligence = intelligence + 25
~ luck = luck + 15

Secrets of the old world reveal themselves to you.

Your intelligence increased to {intelligence}.
Your luck increased to {luck}.

-> life_continues

=== life_continues ===
Your journey continues...

This is the end of the test content.

Final Stats:
STR: {strength}, INT: {intelligence}, AGI: {agility}
STA: {stamina}, CHA: {charisma}, LCK: {luck}, MOR: {morality}

-> END

// === DEATH ENDINGS ===

=== spotted_death ===
# DEATH
The creature spots you before you can hide.

Its claws find you in the darkness.

Your vision fades to black...

-> END

=== chase_death ===
# DEATH
You run, but the creature is relentless.

It catches you before you reach safety.

Your vision fades to black...

-> END

=== pattern_trap_death ===
# DEATH
The pattern was a trap.

Ancient magic surges through you, too powerful for your mind to contain.

Your vision fades to black...

-> END

=== darkness_death ===
# DEATH
The darkness itself seems to swallow you.

You feel yourself fading, becoming nothing.

Your vision fades to black...

-> END

=== fight_guardian_death ===
# DEATH
The guardian is far more powerful than you imagined.

Your defiance is met with overwhelming force.

Your vision fades to black...

-> END
