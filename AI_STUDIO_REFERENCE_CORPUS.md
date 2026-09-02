# AI Studio / Generated-App Reference Corpus

Status: **durable reference registry; not an adoption list**

## Purpose

LawChai has a large generated-app corpus across GitHub and prior File Library uploads. Future product work should retrieve this corpus before generating another variant so useful mechanics, interaction patterns, tests, persistence ideas and design directions are reused rather than rediscovered.

The governing rule is preservation + selective adoption:

- raw generated artifacts remain reference evidence;
- generated architecture/claims are not automatically authoritative;
- useful mechanics may be adapted into canonical products after reconciliation;
- unsupported claims, fake telemetry, simulated backends, unsafe persistence/security and incompatible deployment architecture are not inherited merely because the UI is strong;
- GitHub is mutable implementation truth.

## Retrieval order

For any substantial product generation or redesign:

1. identify the target job/mechanic;
2. search this registry + GitHub for related LawChai implementations;
3. recover relevant File Library artifacts/older variants when GitHub does not contain the design;
4. inspect the strongest 2–5 candidate implementations;
5. explicitly record `reuse | adapt | reject | unresolved`;
6. implement only the useful non-duplicative mechanisms;
7. preserve lineage in the target PR/handoff.

Do not copy an entire generated repo merely because it is visually strong.

## Current recovered corpus

Live GitHub fingerprinting found **74 repositories** with one or more common AI Studio fingerprints. This is a candidate set, not proof of origin. Named `*-ai-studio` repositories and repos with explicit AI Studio metadata/handoffs carry stronger provenance.

Confirmed/recovered historical families include:

- DeltaLedger — `lawchai/lawchai-labs-delta-ledger`
- Security Radar — `lawchai/lawchai-labs-security-radar`
- PrivateDrop AI Studio — `lawchai/lawchai-labs-private-drop-ai-studio`
- ProofLayer Bento — `lawchai/lawchai-labs-prooflayer`
- ProofLayer Immersive — `lawchai/lawchai-prooflayer-immersive`
- Creator Exchange AI Studio — `lawchai/creator-exchange-ai-studio` and `lawchai/lawchai-creator-exchange-ai-studio`
- Klanko preservation corpus — Instant Profile, Nearby, AI Identity Passport, Profile/Referral Loop and Maps under `lawchai/klanko/experiments/`

Recovered File Library-only references include the LawChai Audio Learning Lab generations, with the latest surfaced variant `lawchai-audio-learning-lab (8).zip` containing evidence/provenance, local persistence, import/export, script-context and audio-planning mechanics. These remain File Library references until reconciled to a live repository.

The full machine-readable candidate set is in `AI_STUDIO_REFERENCE_REGISTRY.json`.

## Priority-#2 path exploration reference set

`lawchai/path-uncover` is now the canonical implemented product and `lawchai/fog-of-war-exploration` is a verified companion/reference lane. Path Uncover main `44a908aa5b6c37abd5404c08fa3c9cadb2cb33a2` composes the sibling GPX/geospatial reveal mechanism while preserving its own movement modes, local-state quarantine and privacy-safe sharing. The companion main `c2989f9f7209b80ee31c92434a098f845e95aedf` remains useful as a focused mechanic/reference implementation.

Reference intentionally:

### `lawchai/Recursive-Zoom-Conquest`
Reuse:
- MapLibre;
- H3/hierarchical geospatial indexing;
- recursive geographic drill-down.

Do not inherit:
- faction war;
- combat;
- simulated activity presented as real.

### `lawchai/Singapore-Territory`
Reuse:
- local persistence boundary;
- map/territory state patterns;
- offline awareness.

Do not inherit:
- energy/combat loops;
- synthetic rival-incursion telemetry.

### `lawchai/SG-Conquest`
Reuse mobile map/state interaction patterns where helpful; reject battle/hero mechanics.

### `lawchai/SingaWorld-Singapore-3D-Living-Prototype`
Use only as spatial navigation/interaction reference. Do not drag the unrelated virtual economy/world simulation into Path Uncover.

### Klanko Maps + sharing variants
Use map composition, privacy-ring, share-card and lightweight referral mechanics only when they strengthen the path-exploration journey. Do not import Klanko trust/identity claims.

## Path Uncover product composition rule

The core is:

`move in the real world -> permanently reveal map/path -> see unexplored nearby opportunities -> choose next route -> accumulate geographic progress -> create a privacy-safe share artifact`

Initial supported activity language should remain broad: **walk / run / cycle / hike**. Mode-specific scoring may arrive later; the exploration primitive is shared.

The first value must not depend on signup.

## Current composition evidence

- canonical Path Uncover main: `44a908aa5b6c37abd5404c08fa3c9cadb2cb33a2`
- canonical integrated verification run: `33639802260` — deterministic + 390px browser jobs executed successfully
- GPX/geospatial source lineage: `lawchai/fog-of-war-exploration` PR #3, main `c2989f9f7209b80ee31c92434a098f845e95aedf`
- sibling verification run: `33638643354` — SUCCESS
- current canonical state: GPX import, derived-cell reveal/frontier, cumulative local map, walk/run/cycle/hike metadata, synthetic fallback, aggregate-only share/export
- deployment/live verification: not recorded here; registry must not infer them from integration

## Registry maintenance

Refresh on material new AI Studio/GitHub imports. Add provenance and adoption state when known. Never upgrade a fingerprinted candidate to confirmed provenance without evidence.

This corpus is a discovery/reuse layer, not a second source of implementation truth.
