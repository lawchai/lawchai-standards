# LawChai Portfolio Reuse & Automation Catalog

Status: evidence-backed first pass; implementation candidates require current-revision reconciliation before adoption.

## Why this exists

LawChai has accumulated many independently generated repositories. Repeated implementation patterns should be converted into reusable templates, actions, libraries, generators, or documented cloning sources where that reduces build/verification/operator cost without creating a shared mutable-authority collision.

The goal is not to collapse distinct products into one repository. The goal is to stop regenerating the same scaffolding and workflows.

## Evidence observed in GitHub

The current repository search already shows repeated patterns across unrelated repositories:

- `src/lib/storage.ts` appears in `briefops`, `security-evidence-workbench`, `Mateo-Remix-Studio`, `LawChai-Maybe`, `Viral-Genome-Lab`, and `Recall---Personal-Memory-Resurfacing-Engine`.
- `src/storage.ts` appears in `pov-orchestrator`, `mobility-due-diligence`, and `deal-structure-validator`.
- `src/App.tsx` is repeated across many React/TypeScript projects, including `lawchai-labs-private-drop-ai-studio`, `2-17-A.M.`, `District-Deck-Forge`, `Viral-Control-Lab`, and `Variant-Foundry`.
- `HIRING_MANAGER_WALKTHROUGH.md` is repeated across `briefops`, `Candidate-Evidence-Mapper`, `studio-match-finder`, `studio-paths`, `open-mat-member-layer`, and `Contract-Continuity-Engine`.
- `WorkflowComposer.tsx` appears in both `lawchai-labs-prooflayer` and `lawchai-prooflayer-immersive`.
- Audio/device utility patterns also recur, including `src/utils/audio.ts`, `src/utils/sound.ts`, and `src/utils/deviceDetector.ts`.
- Existing governance already identifies reusable workflow templates, evidence-linked GitHub handoffs, GitHub as the durable handoff bus, bounded backlog conversion, and reusable research/mechanics as recurring LawChai patterns.

These are pattern signals, not proof that every copy is semantically interchangeable. The catalog deliberately separates candidates from approved shared dependencies.

## Highest-ROI reuse targets

### 1. Product starter template

Create one maintained LawChai starter/template for the common React/TypeScript product shape:

- Vite/TypeScript baseline where appropriate;
- standard scripts and deterministic test runner;
- accessibility baseline;
- local persistence boundary;
- error/loading/empty states;
- reset/import/export hooks where relevant;
- PWA/accessibility checks where applicable;
- standard README, privacy, synthetic-data and limitation language;
- semantic-contract declaration section for PRs;
- standard CI scope/zero-test guard;
- GitHub handoff/terminal-state metadata conventions.

New products should clone this rather than regenerate the same infrastructure.

### 2. Evidence/persistence primitives

Treat repeated storage and evidence semantics as candidates for a small, versioned library or copy-safe module set. Start with local-only primitives and adapters; do not centralise product databases or create a shared mutable runtime merely to reduce duplication.

Candidate primitives:

- versioned local storage envelope;
- schema/version migration helpers;
- safe reset/import/export;
- stale-state detection;
- deterministic evidence/excerpt records;
- synthetic-data markers;
- audit/event receipt shape.

### 3. Standard workflow UX primitives

Repeated workflow components should become reusable components or copyable reference modules when contracts are stable:

- step/state machine shell;
- workflow composer;
- decision/result panel;
- evidence drawer;
- contradiction/unknown state;
- progress/history surface;
- mobile-safe table alternative;
- keyboard/focus/reduced-motion primitives.

### 4. Verification factory

Make verification reusable rather than rewritten per repository:

- standard unit-test setup;
- zero-test execution guard;
- browser smoke journey;
- 320px/390px/desktop checks;
- semantic-contract checklist;
- secret/sensitive-data checks;
- exact-head release evidence;
- deployment/live verification receipt.

Where existing `lawchai-standards` CI primitives already solve a requirement, consume them rather than cloning another implementation.

### 5. Handoff/continuity factory

The repeated walkthrough/handoff material indicates a strong candidate for a generated, schema-driven handoff template. Generate the repository-specific values rather than manually recreating prose.

Minimum fields:

- repository / PR / branch;
- base/head SHA;
- scope;
- objective;
- changed paths;
- verification commands/results;
- semantic-contract changes;
- blockers/unknowns;
- rejected/superseded alternatives;
- exact next action;
- terminal state;
- timestamp/provider/session where exposed.

### 6. Clone/sync decision automation

For every new repository or generated variant, automatically classify repeated implementation as:

`INTEGRATE | ADAPT_WRAP | FORK_LAWFULLY | CONTRIBUTE_UPSTREAM | BUILD_INDEPENDENTLY | RESEARCH_ONLY | REJECT | NEEDS_REVIEW`

Require license/provenance, maintenance, security, privacy, API/terms, lock-in and persistence compatibility checks before third-party reuse. For LawChai-owned code, verify canonical ownership and revision identity before copying.

## Proposed automation loop

`scan portfolio -> fingerprint files/dependencies/patterns -> cluster semantic duplicates -> compare canonical implementations -> select best maintained source -> generate clone/template/adaptation plan -> create bounded PR -> run standard verification -> record lineage -> publish reusable pattern`

The scanner should detect at least:

- repeated filenames/paths;
- repeated package/dependency sets;
- repeated workflow/config files;
- repeated test harnesses;
- repeated persistence/evidence utilities;
- repeated documentation artifacts;
- repeated UI primitives.

It must not auto-merge code merely because two files are textually similar. Semantic coupling, ownership, persistence, deployment authority and contract compatibility remain gates.

## What should NOT be cloned blindly

- product-specific business logic;
- authoritative databases/migrations;
- authentication/permissions;
- secrets/deployment authority;
- proprietary or third-party code without verified reuse rights;
- generated copies that would become competing sources of truth;
- merely cosmetic reskins;
- code whose semantics differ despite similar filenames.

## First implementation order

1. starter/template baseline;
2. verification factory;
3. handoff generator;
4. persistence/evidence primitives;
5. workflow UX primitives;
6. portfolio duplicate scanner;
7. automated clone/adaptation suggestions.

This ordering is intentional: it reduces future regeneration cost while simultaneously increasing verification and continuity throughput.

## Success criterion

A new LawChai repository should increasingly be created as:

`select archetype -> clone pinned baseline -> configure product-specific contract -> implement distinct mechanism -> inherit verification/handoff -> verify -> integrate -> deploy`

rather than:

`generate another app -> manually reconstruct tests/docs/storage/UX/CI -> rediscover old LawChai patterns -> repeat`.
