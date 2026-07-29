# Structured CI Scope Contract

Consumer repositories pin the reusable workflow once. Every implementation pull request must add or modify `.github/lawchai-scope.yml` on its own branch.

## Caller workflow

```yaml
name: LawChai CI

on:
  pull_request:

jobs:
  ci:
    name: LawChai CI
    uses: lawchai/lawchai-standards/.github/workflows/ci-react-ts.yml@<FULL_COMMIT_SHA>
```

## Per-PR metadata

```yaml
allowed_paths:
  - .github/lawchai-scope.yml
  - src/App.tsx
  - src/components/
  - tests/app.test.ts
```

## Rules

- `.github/lawchai-scope.yml` must be added or changed in every pull request. Inherited metadata fails so a previous task's authorisation cannot be reused silently.
- The file must contain exactly one top-level `allowed_paths:` list.
- Each item is an unquoted exact repository-relative file or a directory prefix ending in `/`.
- The metadata file must authorise itself.
- Absolute paths, parent traversal, backslashes, duplicates, wildcard syntax, tabs, quoted entries and additional YAML keys fail safely.
- Every changed path must match one declared entry.
- Lockfiles, configuration and documentation are not implicitly exempt from scope; declare them when authorised.
- A meaningful source/test diff above 250 changed lines produces a prominent warning and summary, but size alone does not fail CI.
- Existing install, zero-test posture, typecheck, lint, test, build, clean-tree and bundle reporting remain mandatory.

After a PR merges, the retained metadata documents that completed task only. The next PR must replace it in its own diff.

The caller must pin the reusable workflow by a reviewed full commit SHA. Branch and mutable tag references are prohibited.