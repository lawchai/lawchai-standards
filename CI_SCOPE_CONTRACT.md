# Structured CI Scope Contract

Consumer pull-request workflows must pass `allowed_paths` to the reusable LawChai CI workflow.

```yaml
name: LawChai CI

on:
  pull_request:

jobs:
  ci:
    name: LawChai CI
    uses: lawchai/lawchai-standards/.github/workflows/ci-react-ts.yml@<FULL_COMMIT_SHA>
    with:
      allowed_paths: |
        src/App.tsx
        src/components/
        tests/app.test.ts
```

## Rules

- Every non-empty line is either an exact repository-relative file or a directory prefix ending in `/`.
- Absolute paths, parent traversal, backslashes, duplicates and wildcard syntax fail safely.
- Every changed path must match one declared entry.
- Lockfiles, configuration and documentation are not implicitly exempt from scope; declare them when authorised.
- A meaningful source/test diff above 250 changed lines produces a prominent warning and summary, but size alone does not fail CI.
- Existing install, zero-test posture, typecheck, lint, test, build, clean-tree and bundle reporting remain mandatory.

The caller must pin the reusable workflow by a reviewed full commit SHA. Branch and mutable tag references are prohibited.