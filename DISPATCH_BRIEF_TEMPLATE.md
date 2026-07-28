# LawChai Dispatch Brief Template

## Objective

One sentence describing the observable user or business outcome.

## Authorised scope

### Files or subsystem to modify

- 

### Must not change

- 

## Acceptance criteria

- [ ] Specific observable result
- [ ] Specific boundary or failure behaviour
- [ ] Existing relevant behaviour remains intact
- [ ] Change remains approximately 250 source lines or is split

## OUT-OF-SCOPE FINDINGS

Scope is an authorisation boundary. Do not modify files or behaviours outside the declared task scope.

If you identify an out-of-scope defect:
1. Record the file, behaviour and proposed fix in the PR description.
2. Do not modify it.
3. If it blocks the assigned acceptance criteria, stop and open a draft `[BLOCKED]` PR rather than expanding scope.

## MANDATORY TERMINAL STATE

If you modify any files but cannot complete the task, open a draft PR titled `[BLOCKED] <task title>` containing the current diff, commands run, exact blocker and remaining work. Do not leave an unreported branch.

If you make no code changes, leave the branch unchanged and provide a written failure report.

## SEMANTIC CONTRACT CHANGES

- Public signatures changed:
- Return/sentinel values changed:
- Storage/schema formats changed:
- Error-handling behaviour changed:
- Consumers searched (explicit list):
- Out-of-scope defects found (report only):

## Test plan

- Deterministic/boundary tests:
- Build/typecheck/lint:
- Browser/accessibility check, only when relevant:

## Reference material

Reference material is not permission to merge or copy unrelated changes.