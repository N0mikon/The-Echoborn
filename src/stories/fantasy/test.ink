VAR player_name = "Unknown"
VAR strength = 1

=== start ===
You awaken in darkness.

The air is cold and damp. You hear distant footsteps.

* [Call out for help] -> call_out
* [Stay silent and listen] -> stay_silent
* [Feel around in the darkness] -> feel_around

=== call_out ===
Your voice echoes through the chamber.
"Hello? Is anyone there?"

No response. The footsteps have stopped.

-> continue_story

=== stay_silent ===
You hold your breath.
The footsteps grow closer... then pass by.

-> continue_story

=== feel_around ===
Your hands find rough stone walls.
This seems to be some kind of tunnel.

-> continue_story

=== continue_story ===
You decide to move forward.

* [Continue cautiously] -> end_test
* [Rush ahead] -> end_test

=== end_test ===
This concludes the test story.
Your strength is {strength}.
-> END
