# LawChai Dispatch Brief Template

## Objective

One sentence describing the observable user or business outcome.

## Queue classification

Choose exactly one:

- `routine implementation` — independent repository work; does not consume the global exception queue;
- `exception decision` — blocked, failed, ambiguous or materially risky work requiring Lawrence;
- `promotion review` — homepage, flagship, public-claim, archive or deep-maintenance decision.

The exception and promotion-review queue is capped at three. Routine implementation across separate repositories is not globally capped. Exactly one coding agent may edit a repository or branch at a time.

## Authorised scope

### Files or subsystem to modify

- 

### Must not change

- 

## Acceptance criteria

- [ ] Specific observable result
- [ ] Specific boundary or failure behaviour
- [ ] Existing relevant behaviour remains intact
- [ ] Unknown and contradicted information remain explicit
- [ ] Change remains bounded; a diff above approximately 250 meaningful source/test lines receives additional review attention but is not failed solely for size

## OUT-OF-SCOPE FINDINGS

Scope is an authorisation boundary. Do not modify files or behaviours outside the declared task scope.

If you identify an out-of-scope defect:
1. Record the file, behaviour and proposed fix in the PR description.
2. Do not modify it.
3. If it blocks the assigned acceptance criteria, stop and open a draft `[BLOCKED]` PR rather than expanding scope.

## MANDATORY TERMINAL STATE

Every dispatch must end in exactly one state:

1. Ready PR.
2. Draft PR titled `[BLOCKED] <task title>` containing the partial diff, commands run, exact blocker and remaining work.
3. Unchanged branch plus a written failure report.

No modified branch may exist without a PR.

## SEMANTIC CONTRACT CHANGES

- Public signatures changed:
- Return/sentinel values changed:
- Storage/schema formats changed:
- Error-handling behaviour changed:
- Consumers searched (explicit list):
- Out-of-scope defects found (report only):

## Automated verification

- Structured authorised-path check:
- Configured tests and non-zero execution count:
- Deterministic/boundary tests:
- Typecheck/lint/build:
- Persistence/migration/export checks, where relevant:
- Browser/accessibility checks for changed journeys:
- Synthetic-data and no-secrets confirmation:
- Unsupported-claim review:

## Evidence and review boundary

State whether the result is:

- agent-reported;
- independently reproduced by CI;
- independently reproduced in a browser;
- awaiting an exception or promotion decision.

Routine verified work does not wait for Lawrence before unrelated repositories proceed. Lawrence reviews promotion, material public claims, high-risk architecture or semantic exceptions, and archive/deep-maintenance decisions.

## Reference material

Reference material is not permission to merge or copy unrelated changes.