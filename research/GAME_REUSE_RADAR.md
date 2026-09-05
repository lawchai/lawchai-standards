# Game Reuse Radar

Purpose: durable, licence-aware reuse map for LawChai game/product work.

Rule: public/reverse-engineered source is **not automatically reusable**. Prefer clean, explicitly licensed code. Keep proprietary assets/branding/maps/audio separate. Leaks are excluded.

## Integration classes

- `TRANSPLANT_OK` — permissive code may be copied/adapted with required notices.
- `WHOLE_ENGINE_OR_ISOLATED` — copyleft code is useful, but direct source mixing may impose distribution/source obligations; prefer clean-room mechanic extraction, process isolation, or deliberate whole-engine adoption.
- `REFERENCE_ONLY` — source/mechanics useful for study, but licensing/provenance/asset constraints make direct reuse non-default.
- `REJECT` — leaked/proprietary material without reuse permission.

## High-ROI sources

| Project | What it is | Licence / boundary | Best reusable systems | LawChai fit | Class |
|---|---|---|---|---|---|
| [OpenLoco](https://github.com/OpenLoco/OpenLoco) | Completed C++ reimplementation of Chris Sawyer's Locomotion | MIT code; original game assets still required for the original game | simulation ticks, transport graphs, routing, schedules, economy, save compatibility, multiplayer work, map/world tools | Path Uncover world/route graph ideas; simulation games; persistent-world systems | TRANSPLANT_OK |
| [ReHLDS](https://github.com/rehlds/rehlds) | Reverse-engineered Half-Life Dedicated Server | MIT since 2025 transition; provenance still review before copying | authoritative server loop, networking, entity lifecycle, server plugins, lag/security hardening | browser/Godot multiplayer games; authoritative simulation services | TRANSPLANT_OK_AFTER_PROVENANCE_REVIEW |
| [ReGameDLL_CS](https://github.com/rehlds/ReGameDLL_CS) / [FWGS/regamedll](https://github.com/FWGS/regamedll) | Reverse-engineered CS 1.6/CZero game DLL | verify exact current upstream licence/provenance at adoption time | rounds, teams, spawn state, weapon/game rules, economy, plugin API | tactical multiplayer games; generic round/economy state machines | REFERENCE_UNTIL_AUDITED |
| [CorsixTH](https://github.com/CorsixTH/CorsixTH) | Theme Hospital engine reimplementation | current project materials state MIT; original game data still needed for original content | event simulation, staff/agent state, room placement, Lua game logic, save/autosave, map editor, adviser/history UX | management/simulation games; placement/edit workflows | TRANSPLANT_OK_AFTER_FILE_CHECK |
| [Cube 2: Sauerbraten](https://github.com/lsalzman/sauerbraten) | open FPS engine/game | engine code is Zlib; media have separate licences | octree world editing, FPS movement, networking, in-game map editing, bots | fast 3D prototypes, multiplayer spatial games, level editors | TRANSPLANT_OK_CODE_ONLY |
| [Godot FPS Multiplayer Template](https://github.com/TheDahoom/FPS-Multiplayer-Template) | reusable multiplayer FPS template | MIT claim; verify bundled assets individually | controller, menus, multiplayer session flow, weapon baseline | fastest Godot multiplayer game starting point | TRANSPLANT_OK_AFTER_ASSET_CHECK |
| [godot-fps-template](https://github.com/MilkAndBanana01/godot-fps-template) | FPS systems template | CC0 repository claim | movement, interaction, settings, reusable FPS primitives | single/multiplayer prototypes | TRANSPLANT_OK |
| [jordi04/godot_multiplayer_template](https://github.com/jordi04/godot_multiplayer_template) | Godot multiplayer foundation | MIT | Steam P2P/direct-IP abstractions, lobby/session structure | social/multiplayer LawChai games | TRANSPLANT_OK |
| [OpenTTD](https://github.com/OpenTTD/OpenTTD) | Transport Tycoon Deluxe reimplementation/extension | GPL-2.0; mixed third-party components | pathfinding, orders, economy, world simulation, save/load, UI, scripting/mods | path/world simulation and management-game mechanic reference | WHOLE_ENGINE_OR_ISOLATED |
| [OpenRCT2](https://github.com/OpenRCT2/OpenRCT2) | RollerCoaster Tycoon 2 reimplementation | GPL-3.0-or-later | construction tools, guest AI, queues, path networks, simulation speed, save compatibility, multiplayer | world builders, placement UX, simulation games | WHOLE_ENGINE_OR_ISOLATED |
| [OpenMW](https://github.com/OpenMW/openmw) | Morrowind engine replacement | GPLv3; original assets required to play Morrowind | open-world streaming, object/state systems, scripting, save/load, editor, AI/navigation | RPG/world products, persistent object state, tooling | WHOLE_ENGINE_OR_ISOLATED |
| [openage](https://github.com/SFTtech/openage) | Genie/Age of Empires engine clone | GPL-family; original game assets required for original games | RTS entity/economy systems, data conversion, terrain/world engine | RTS/simulation mechanics; content pipelines | WHOLE_ENGINE_OR_ISOLATED |
| [VCMI](https://github.com/vcmi/vcmi) | Heroes III engine recreation | GPL-2.0+ code; CC-BY-SA assets | turn state, campaigns, map editor, Lua scripting, serialization, configurable UI/mod formats | tactics/card/turn-based games; mod/plugin architecture | WHOLE_ENGINE_OR_ISOLATED |
| [OpenXcom](https://github.com/OpenXcom/OpenXcom) | X-COM engine clone | GPL | tactical state machine, inventory, turn sequencing, campaign/battle persistence, mod rulesets | Signal Duel / tactical and learning-game state systems | WHOLE_ENGINE_OR_ISOLATED |
| [Warzone 2100](https://github.com/Warzone2100/warzone2100) | commercially released game source, community maintained | GPL-2.0+ with additional licence files | RTS AI, JS scripting, maps/campaign, multiplayer, research/tech trees | strategy games, autonomous-agent battles, progression systems | WHOLE_ENGINE_OR_ISOLATED |
| [ET: Legacy](https://github.com/etlegacy/etlegacy) | modern Enemy Territory engine/game continuation | GPLv3+ plus additional original-source terms | team objective flow, dedicated servers, networking, FPS HUD/input | multiplayer objective-game reference | WHOLE_ENGINE_OR_ISOLATED |
| [The Force Engine](https://github.com/TheForceEngine/TheForceEngine) | clean-room/reverse-engineered Jedi Engine replacement | GPL-2.0 | sector worlds, retro renderer, AI/weapons, level tooling, scripting/mod support | retro 3D game experiments, editor mechanics | WHOLE_ENGINE_OR_ISOLATED |
| [OpenTomb](https://github.com/opentomb/OpenTomb) | clean reimplementation of Tomb Raider 1–5 engine; archived 2025 | LGPLv3; mixed dependencies/resources | character controller, sectors/rooms, animation, Lua, physics integration | traversal/exploration mechanics reference | WHOLE_ENGINE_OR_ISOLATED |
| [GemRB](https://github.com/gemrb/gemrb) | Infinity Engine reimplementation | GPL-2.0 | party/RPG state, scripting, data formats, dialogue/UI, save systems | RPG/story/agent-party systems | WHOLE_ENGINE_OR_ISOLATED |
| [EasyRPG Player](https://github.com/EasyRPG/Player) | RPG Maker 2000/2003 interpreter | GPLv3 | event interpreter, map transitions, save state, portable renderer/input | lightweight RPG/learning-game scripting model | WHOLE_ENGINE_OR_ISOLATED |
| [Julius / Augustus](https://github.com/bvschaik/julius) | Caesar III reimplementation and extended fork family | AGPL-3.0 | city simulation, walkers, service coverage, placement, economy, save compatibility | city/world/simulation mechanics; map-overlay ideas | REFERENCE_OR_WHOLE_ENGINE |
| [DevilutionX](https://github.com/diasurgical/DevilutionX) | Diablo source-port/reimplementation lineage | current upstream licence must be checked carefully; original assets required | dungeon generation, inventory, combat loops, multiplayer/save systems | dungeon/RPG mechanics reference | REFERENCE_ONLY_PENDING_LICENSE_CHECK |
| [Sonic Mania Decompilation](https://github.com/RSDKModding/Sonic-Mania-Decompilation) | decompilation/reimplementation | custom non-commercial licence; external assets required | platformer movement, scene/state architecture, replay/timing ideas | mechanic study only | REFERENCE_ONLY |

## LawChai subsystem extraction map

### Path Uncover
Do **not** turn it into an FPS/RTS. Relevant extraction targets:
- OpenLoco/OpenTTD: graph/world simulation, route-order abstractions, persistent world evolution.
- OpenRCT2: spatial construction/path connectivity, reversible placement UX, simulation-speed/state inspection.
- VCMI/OpenXcom: deterministic map-state serialization and replayable turn/state receipts.
- OpenMW: streaming/persistent-world object concepts.
- Generic game engines: seeded challenge/replay contracts, map editors, state snapshots.

Potential product applications:
- deterministic exploration-event replay;
- richer connected-frontier graph;
- user-created quest/mission packs;
- time-machine simulation over discovered territory;
- offline world-state snapshots;
- eventual community challenge/race instances without exposing precise location data.

### PULSEFRONT / RELAYBORN / future 3D games
Prefer permissive foundations first:
1. Godot MIT/CC0 templates;
2. Cube 2 Zlib code where the subsystem fits;
3. audited ReHLDS/ReGameDLL concepts for authoritative networking/round state;
4. only then consider GPL-family whole-engine adoption.

Standard multiplayer contract:
`authoritative state -> deterministic rules -> thin clients -> interpolation/prediction -> 2+ client smoke -> bot/demo mode -> replay/capture -> live latency/performance checks`.

### Signal Duel / Stance Tell / tactical games
High-value mechanic references:
- OpenXcom: deterministic turn/action state;
- VCMI: bonus/rules/mod schema;
- Warzone 2100: scripted AI and research/progression;
- GemRB: dialogue/state/event architecture.

Prefer independent implementation of mechanics unless licence-compatible whole-engine/library use is intentional.

### Relicbound / RPG-world products
High-value references:
- OpenMW: world/object persistence + editor;
- GemRB: party/dialogue/script systems;
- EasyRPG: event interpreter;
- Devilution lineage: dungeon/inventory/combat mechanic reference subject to licence/provenance.

## Reuse workflow

For every candidate subsystem:

1. identify exact consumer and mechanic;
2. confirm repository + exact revision;
3. inspect root licence **and file-level/asset exceptions**;
4. classify `TRANSPLANT | WRAP | PROCESS_ISOLATE | WHOLE_ENGINE | CLEAN_ROOM_MECHANIC | REJECT`;
5. ensure branding/maps/audio/models/data are owned, generated, CC0, permissively licensed, or otherwise authorised;
6. vendor/fork only the minimum useful surface;
7. record upstream SHA + notices;
8. add deterministic tests against the LawChai contract;
9. compare against current implementation before replacing anything;
10. preserve an exit path so the upstream can be swapped.

## Explicit rejects / caution

- leaked Valve/CS:GO/other commercial source: **REJECT** for copying or ingestion;
- source-visible but non-open licences: do not treat as OSS;
- reverse-engineered code with unresolved provenance disputes: **NEEDS_REVIEW**;
- original commercial assets bundled with an open engine: never assume engine licence covers assets;
- GPL/AGPL code copied into a differently licensed distributed product without deliberate compliance: **DO NOT DO THIS**;
- stale/archived engines: use only when the unique mechanism outweighs maintenance risk.

## Discovery expansion

Future `/os` game research should search by subsystem, not only game title:
- networking/rollback/prediction;
- AI/bots/navigation;
- ECS/entity lifecycle;
- world streaming;
- map/level editors;
- save/load/replay;
- quest/event scripting;
- procedural generation;
- economy/tech trees;
- tactical turns;
- pathfinding/graphs;
- animation/state machines;
- mod/plugin architectures;
- deterministic testing/headless simulation;
- browser/WASM ports;
- mobile controls;
- accessibility;
- asset conversion/import pipelines.

This radar is a starting index, not blanket legal approval. Licence/provenance must be rechecked at adoption time.
