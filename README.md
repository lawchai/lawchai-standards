# LawChai Standards

Central, version-controlled delivery standards for the LawChai repository portfolio.

## Human-only control repository

This repository is a portfolio-wide trust root and is maintained by the human owner only.

- Do not dispatch Jules or another coding agent against this repository.
- Do not label work here as agent-ready.
- Review every workflow change manually.
- Consumer repositories must reference reusable workflows by a full commit SHA.
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

## Project-wide context bootstrap

New LawChai chats are not blank projects. Before making implementation-state claims or requesting repeated inputs, the assistant should:

1. read the active project instructions and canonical handoff/context files;
2. search recent LawChai project conversations and File Library uploads for the named work;
3. inspect GitHub for current code, branches, PRs, CI and deployment state;
4. use GitHub as the source of truth for live implementation while using chats and uploaded files to recover intent, archives and prior evidence;
5. distinguish “not available in this runtime” from “never supplied”;
6. store durable repository-specific decisions in repository documentation, issues and PRs rather than relying only on conversational memory.

This reduces repeated questions and prevents a new chat from discarding earlier project work. It does not make chat summaries authoritative over current GitHub state.

## Current responsibility

This repository owns reusable GitHub Actions workflows and durable portfolio delivery contracts. Product repositories keep their own repository-specific:

- `AGENTS.md`
- `QUALITY_GATE.md`
- agent-task issue template
- small caller workflow

## Reusable React/TypeScript CI

Caller repositories use an immutable commit reference and a stable caller-job display name:

```yaml
name: LawChai CI

on:
  pull_request:

jobs:
  ci:
    name: LawChai CI
    uses: lawchai/lawchai-standards/.github/workflows/ci-react-ts.yml@<40-character-SHA> # v1.0.0
```

This produces the required check name `LawChai CI / verify`. Do not rename the caller job display name or the reusable `verify` job without updating repository rulesets in the same controlled change.

The reusable workflow currently verifies:

- the meaningful source and test diff is no more than 250 changed lines;
- documentation-only, configuration-only, dependency-metadata-only and generated-file-only changes are exempt from the source-diff limit;
- locked dependency installation with `npm ci`;
- a real build command;
- TypeScript verification through either `typecheck` or a build invoking `tsc`;
- tracked test files, including conventional `tests/` and `__tests__/` directories, are not present without a test script;
- configured test scripts are not obvious no-op stubs and do not permit successful zero-test runs;
- configured typecheck, lint and test commands;
- production build success;
- verification leaves no modified or untracked non-ignored files;
- resulting bundle size for accumulation tracking;
- obsolete runs are cancelled when a newer commit is pushed to the same pull request.

Issue #5 separately tracks the ordered CI correction: preserve zero-test enforcement, add structured `allowed_paths`, then convert the approximately-250-line control to a soft warning. Until that workflow change is reviewed and consumers are repinned to its full SHA, the description above remains the truthful current behaviour.

A green build does not imply automated test coverage when no test files exist. The workflow states that explicitly in its run summary. Test quality, issue-scope compliance and semantic-contract correctness remain review responsibilities.

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