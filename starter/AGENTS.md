# LawChai Agent Instructions — Product Repository

## Scope boundary

Modify only files explicitly authorized in `.github/lawchai-scope.yml`. Out-of-scope defects must be reported only and not fixed inline.

## Mandatory terminal state

Every dispatch must end in exactly one state:
1. Ready PR
2. `[BLOCKED]` draft PR
3. Unchanged branch + written failure report

## Mandatory verification

Run `npm run typecheck`, `npm test`, and `npm run build` before submitting PRs.
Zero-test executions or missing scope declarations fail CI.
