Real Dungeoneer
===============

A roguelike dungeon crawler


Overview
--------

###Basic structure
The code uses a variation of Nicholas Zakas' Core-Sandbox-Module pattern. In this application, we use the following 
terminology:

####GameCore
The **GameCore** is the lowest-level part of the application, and has nothing to do with the details of the game itself.
Rather, it serves as an abstraction layer for the very building blocks of the application. It is analogous to Nicholas 
Zakas' **Core.** The GameCore is responsible for the following:
* Loading Modules and data
* Instantiating, building, and loading Entities
* Registering Entities with Scenes
* Loading Scenes
* Switching from one Scene to another
* Saving the game
* Loading saved games
* Communicating system events to Scenes

###Entity
The individual components of a game are **Entities**. Entities are basically objects that have the ability to react to
Actions and create Actions in turn. This method of communication allows loose-coupling between Entities, as Entities don't
really care about other Entities. They just care about the messages that are sent back and forth. This also allows for 
Entities to be added to a scene at any time and "tune in" to the messages (Actions) that are sent back and forth. Entities
can exist in multiple contexts -- that is, they can be registered to multiple Scenes; however, their communication is
usually restricted only to one Scene at a time. Entities are analogous to Zakas' **Modules**.

####Scene
**Scenes** represent a single game context. You can picture them as "screens". Indeed, a scene will typically have a renderer
registered to it to represent the Scene to the user in a meaninful way. Menus, splash screens, level views, and high score 
lists are all examples of Scenes. A Scene will have several Entites registered to it, and the Scene will manage the
communication between entities that are registered with it. In fact, none of the Entities will be directly referencing
another Entity; they must subscribe to Actions and broadcast actions. In this way, it's the job of the Entity to react to
other Actions. Sometimes they will produce Actions themselves. There are three ways for a Scene to broadcast messages to
Entities: hooks, triggers and Actions. Scenes are analogous to Zakas' **Sandboxes**.

#####Hooks
Hooks are defined in the game's configration. For every system event that occurs, the hooks are broadcast in order, no matter
what. Hooks can't be added or removed. Imagine them as the basic steps of a game turn: Turn starts, player perfoms an action,
monsters perform their actions, turn ends. For more simple scenes, only two hooks are used: start and finish. The hook cycle
is kicked off by a system event, such as a keypress, and runs all the way through.

#####Triggers
Triggers are like hooks but they are added at runtime. They serve as a way to schedule events in order -- like hooks.
Triggers are registered to hooks and will always be emitted in order after the hook is emitted. When a system event occurs,
the event is translated into a trigger, which is inserted at the beginning of the first hook. After the hook loop is done,
all triggers are removed.

#####Actions
Acions are the main channel of communication. Like triggers, they are inserted at runtime. Entities emit Actions in response
to communitcation from the Scene. Actions are "sticky"; they persist from hook cycle to hook cycle and are not removed unless
they are explicitly removed from the scene, or their duration is set to a finite nummber of turns. Actions have the added
benefit of being passed with associated data, whereas hooks and triggers are only identified by their respective names.

------------------------------------------------

More to follow...




