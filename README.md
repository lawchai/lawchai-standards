# LawChai Standards

Central, version-controlled delivery standards for the LawChai repository portfolio.

## Human-only control repository

This repository is a portfolio-wide trust root and is maintained by the human owner only.

- Do not dispatch Jules or another coding agent against this repository.
- Do not label work here as agent-ready.
- Review every workflow change manually.
- Consumer repositories must reference reusable workflows by a full commit SHA.
- Version tags are for human navigation; they are not the security boundary.

## Current responsibility

This repository owns reusable GitHub Actions workflows. Product repositories keep their own repository-specific:

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

The reusable workflow verifies:

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

A green build does not imply automated test coverage when no test files exist. The workflow states that explicitly in its run summary. Test quality and issue-scope compliance remain human-review responsibilities.

## Change policy

Changes to central workflows should remain backward-compatible where practical and be tested first against the three pilot repositories:

1. `lawchai/pipeline-doctor`
2. `lawchai/cost-of-inaction`
3. `lawchai/talent-market-feasibility`

Do not add product-specific assumptions to reusable workflows.
