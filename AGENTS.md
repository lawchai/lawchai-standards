# LawChai Agent Instructions — Standards

## Human-only control boundary

This repository is the portfolio-wide trust root. Do not dispatch Jules or another coding agent against it. Changes require direct human authorisation and manual review. Consumer repositories must continue to pin reusable workflows by full commit SHA.

## Operating principle

Create broadly and verify automatically. Lawrence reviews promotion decisions, unresolved exceptions and material irreversible risks, not routine bounded implementation details.

Deployment, verification, promotion and deep maintenance are separate states. A deployed experiment is not automatically verified, featured or maintained.

## Mandatory context bootstrap

A new LawChai chat or task must not be treated as a blank project. Before answering implementation-state questions, declaring an input missing or starting repository work:

1. Read the current LawChai project instructions and canonical handoff/context documents.
2. Search recent LawChai project conversations and the File Library for the named repository, prior decisions, uploaded archives, generated patches and verification reports.
3. Inspect GitHub for the current default branch, open PRs, issues, CI, deployment configuration and recent merged work.
4. Use chat history and file-search results for discovery, but treat GitHub as the source of truth for live code and repository state.
5. Do not ask the user to repeat information already recoverable from the project or claim that source was never supplied until the project history and File Library have been searched.
6. Move durable repository-specific decisions into `README.md`, `AGENTS.md`, issues or PRs so future chats do not depend only on conversational memory.

If project-history retrieval is unavailable or incomplete, state that limitation precisely. Distinguish “not found in the active runtime” from “never supplied.”

## Parallel implementation lane

- Separate repositories may have implementation work running concurrently.
- Exactly one coding agent may edit a repository or branch at a time.
- A repository with an active implementation PR, blocked branch or unresolved failed task may not receive a second coding agent until that repository reaches a terminal state.
- Problems in one repository do not block unrelated repositories.
- Routine implementation PRs that satisfy their automated gates do not count toward a global WIP ceiling merely because they await mechanical completion or AI review.

## Exception and promotion-review queue

The global queue is capped at three items, but it contains only:

- blocked or failed work requiring Lawrence's decision;
- ambiguous security, privacy, data-integrity or semantic-contract exceptions;
- deployment or public-release decisions with material irreversible risk;
- promotion candidates awaiting homepage or flagship selection.

Do not use this queue as a cap on independent routine implementation across separate repositories.

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

## Mandatory automated verification

Every implementation dispatch must run the repository-defined checks applicable to the changed contract. Where relevant, this includes:

- structured authorised-path validation;
- non-zero configured test execution;
- typecheck, lint and build;
- deterministic tests for changed calculations, transitions, persistence, migrations and exports;
- browser and accessibility checks for changed user journeys;
- synthetic-data and no-secrets confirmation;
- unsupported-claim review.

A line-count threshold is a review signal, not a substitute for scope control or correctness evidence.

## Semantic-contract declaration

Every implementation PR body must state:

- Public signatures changed.
- Return or sentinel values changed.
- Storage or schema formats changed.
- Error-handling behaviour changed.
- Consumers searched, listed explicitly.
- Out-of-scope defects found, reported only and not fixed.

## Lawrence review boundary

Lawrence reviews:

- flagship and homepage promotion;
- public claims and portfolio positioning;
- architecture changes affecting deployment, authentication, private persistence or cross-product integration;
- unresolved exceptions and high-risk migrations or formulas;
- decisions to deeply maintain, archive or retire a project.

Lawrence is not required to manually review routine bounded implementation details before unrelated repositories continue.

Green CI and agent summaries are not sufficient evidence for promotion, high-risk changes or exception resolution. Review the actual changed files, diff, test assertions and consumers of changed contracts before those decisions.