# LawChai Standards

Central, version-controlled delivery standards and reusable machinery for the LawChai repository portfolio.

## Human-only control repository

This repository is a portfolio-wide trust root and is maintained by the human owner only.

- Do not dispatch Jules or another coding agent against this repository.
- Do not label work here as agent-ready.
- Review every workflow change manually.
- Consumer repositories must reference reusable workflows and composite actions by a full commit SHA.
- Version tags are for human navigation; they are not the security boundary.

## Portfolio operating principle

> Create broadly and verify automatically. Lawrence reviews promotion decisions, not routine implementation details.

The operating model separates four states:

1. creation or experimentation;
2. automated verification and safe deployment;
3. promotion to homepage or flagship status;
4. deep maintenance.

A repository can proceed independently when its scope is bounded, one coding agent owns its branch, and automated verification is mandatory. Routine implementation PRs across separate repositories are not subject to a global WIP ceiling.

The global queue remains capped at three only for:

- blocked or failed work requiring Lawrence's decision;
- material security, privacy, data-integrity or semantic-contract exceptions;
- deployment or public-release decisions with irreversible risk;
- promotion candidates awaiting homepage or flagship selection.

## LawChai Reuse Factory

The Reuse Factory eliminates repeated scaffolding and operator relay work across LawChai web products through three native mechanisms:

### 1. Product Starter Baseline

A pinned, reusable web-product scaffold (`starter/`) with configurable product-contract metadata (`product-contract.json`), canonical local storage & evidence primitives (`src/lib/storage.ts`, `src/lib/evidence.ts`), accessibility standards, and deterministic test baseline.

Scaffold a new consumer project using:

```bash
node scripts/init-starter.mjs \
  --id my-app \
  --title "My LawChai App" \
  --purpose "Product purpose" \
  --standards-sha <40-character-SHA> \
  --output ../my-app
```

### 2. Verification Factory

Reusable CI actions and verification scripts (`.github/actions/verification-factory`, `scripts/nonzero-evidence-guard.mjs`) enforcing deterministic checks expected by LawChai:

- Non-zero verification evidence guard (`scripts/nonzero-evidence-guard.mjs`) mechanically tying test PASS/executed_nonzero to actual non-zero runner evidence;
- Per-PR structured scope check (`.github/lawchai-scope.yml`);
- Zero-test execution guard;
- TypeScript typecheck, lint, and production build;
- Mobile viewports (320px, 390px) and accessibility baseline checks;
- Exact-head schema v2 verification receipt generation.

Call the action in workflows:

```yaml
- name: Run LawChai Verification Factory
  uses: lawchai/lawchai-standards/.github/actions/verification-factory@<40-character-SHA>
  with:
    risk_class: 'low'
```

### 3. Schema-driven Handoff Generator

A schema-driven generator (`scripts/generate-handoff.mjs` & `schemas/handoff-report.schema.json`) for PR terminal reports that persists exact head, scope, changes, verification results, semantic contract declarations, blockers, unknowns, and next action.

Generate a report from structured JSON input:

```bash
node scripts/generate-handoff.mjs --input report.json --output PULL_REQUEST_REPORT.md
```

## Governance, Pinning, Upgrade & Escape-Hatch Rules

### Adoption Rules

1. New LawChai repositories should scaffold from the starter baseline via `scripts/init-starter.mjs`.
2. Existing repositories adopt standards by binding `.github/lawchai-scope.yml` and calling the pinned reusable workflows.
3. Every adoption must preserve existing product semantics and domain capabilities.

### Pinning Rules

1. Reusable workflows and composite actions MUST be referenced using a full 40-character Git commit SHA.
2. Branch names (`main`, `v1`), movable tags, or abbreviated commit hashes are prohibited as workflow references.
3. Pin references are immutable; changing the standards revision requires updating the 40-character commit SHA in the caller repository.

### Upgrade Rules

1. Upgrades to `lawchai-standards` reusable actions or workflows are explicit PR changes in consumer repositories.
2. An upgrade PR must update the full commit SHA reference and run the repository's verification checks to confirm compatibility.
3. Automated tools must not silently modify consumer SHA references without running the full test suite.

### Escape-Hatch Rules

1. If a consumer repository requires product-specific verification logic, custom build hooks, or additional checks beyond standard workflows:
   - Extend local repository scripts in `package.json` (e.g. custom `test` or `build` scripts).
   - Document any authorized exceptions in `product-contract.json` under `risk_class` or `claims`.
2. Do not fork or modify central standards workflows directly within a consumer repository.
3. If central standards are genuinely incompatible, open an exception issue or PR against `lawchai-standards` for human review.

## Current responsibility

This repository owns reusable GitHub Actions workflows, composite actions, and durable portfolio delivery contracts. Product repositories keep their own repository-specific:

- `AGENTS.md`
- `product-contract.json`
- `QUALITY_GATE.md`
- agent-task issue template
- small caller workflow
- per-PR `.github/lawchai-scope.yml`

## Reusable React/TypeScript CI

Caller repositories use an immutable commit reference and a stable caller-job display name:

```yaml
name: LawChai CI

on:
  pull_request:

jobs:
  ci:
    name: LawChai CI
    uses: lawchai/lawchai-standards/.github/workflows/ci-react-ts.yml@<40-character-SHA>
```

Every implementation PR adds or changes `.github/lawchai-scope.yml`:

```yaml
allowed_paths:
  - .github/lawchai-scope.yml
  - src/App.tsx
  - src/components/
  - tests/app.test.ts
```

The scope file must authorise itself and every changed path. CI fails when the file is inherited unchanged, missing, malformed or incomplete, preventing silent reuse of a previous task's authorisation.

This produces the required check name `LawChai CI / verify`. Do not rename the caller job display name or the reusable `verify` job without updating repository rulesets in the same controlled change.

## Review boundary

Lawrence reviews:

- homepage and flagship promotion;
- public claims and portfolio positioning;
- architecture changes affecting deployment, authentication, private persistence or cross-product integration;
- high-risk formulas, migrations and unresolved exceptions;
- archive, retirement and deep-maintenance decisions.

Routine bounded implementation that passes its repository gates does not block unrelated repositories from continuing.

## Change policy

Changes to central workflows should remain backward-compatible where practical and be tested first against the three pilot repositories:

1. `lawchai/pipeline-doctor`
2. `lawchai/cost-of-inaction`
3. `lawchai/talent-market-feasibility`

Do not add product-specific assumptions to reusable workflows.
