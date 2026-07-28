# LawChai Agent Instructions — Standards

## Human-only control boundary

This repository is the portfolio-wide trust root. Do not dispatch Jules or another coding agent against it. Changes require direct human authorisation and manual review. Consumer repositories must continue to pin reusable workflows by full commit SHA.

## Scope is an authorisation boundary

- Modify only files and behaviours explicitly authorised by the task.
- Report out-of-scope defects in the PR description; never fix them inline.
- If an out-of-scope change is required to meet the acceptance criteria, stop and open a draft PR titled `[BLOCKED] <task title>` with the partial diff, exact blocker, commands run and remaining work.

## Mandatory terminal state

Every authorised change ends in exactly one state:

1. Ready PR.
2. `[BLOCKED]` draft PR containing the partial diff, exact blocker, commands run and remaining work.
3. Unchanged branch plus a written failure report.

No modified branch may exist without a PR.

## Semantic-contract declaration

Every implementation PR body must state:

- Public signatures changed.
- Return or sentinel values changed.
- Storage or schema formats changed.
- Error-handling behaviour changed.
- Consumers searched, listed explicitly.
- Out-of-scope defects found, reported only and not fixed.

## Review boundary

Green CI and agent summaries are not sufficient evidence. Review the actual changed files, diff, test assertions and consumers of changed contracts before merging.