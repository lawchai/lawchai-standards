# LawChai Standards

Central, version-controlled delivery standards for the LawChai repository portfolio.

## Current responsibility

This repository owns reusable GitHub Actions workflows. Product repositories keep their own repository-specific:

- `AGENTS.md`
- `QUALITY_GATE.md`
- agent-task issue template
- small caller workflow

## Reusable React/TypeScript CI

Caller repositories use:

```yaml
name: ci

on:
  pull_request:

jobs:
  ci:
    uses: lawchai/lawchai-standards/.github/workflows/ci-react-ts.yml@main
```

The reusable workflow verifies:

- locked dependency installation with `npm ci`;
- a real build command;
- TypeScript verification through either `typecheck` or a build invoking `tsc`;
- tracked test files are not present without a test script;
- configured test scripts are not obvious no-op stubs;
- configured typecheck, lint and test commands;
- production build success;
- verification does not rewrite tracked files;
- resulting bundle size for accumulation tracking.

A green build does not imply automated test coverage when no test files exist. The workflow states that explicitly in its run summary.

## Change policy

Changes to central workflows should remain backward-compatible where practical and be tested first against the three pilot repositories:

1. `lawchai/pipeline-doctor`
2. `lawchai/cost-of-inaction`
3. `lawchai/talent-market-feasibility`

Do not add product-specific assumptions to reusable workflows.
