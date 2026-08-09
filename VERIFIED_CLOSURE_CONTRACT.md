# Verified Closure deployment identity contract

## Purpose

A deployment is not considered verified merely because a deploy command or workflow step succeeded. Verified Closure compares a live deployment identity document with the Git commit that the caller expected to publish.

This contract is deterministic. It contains no model call and never turns missing evidence into success.

## Shared action

Consumers call the composite action from this repository by an immutable 40-character commit SHA:

```yaml
- name: Verify production identity
  uses: lawchai/lawchai-standards/.github/actions/verify-deploy@<40-character-SHA>
  with:
    version_url: ${{ vars.PRODUCTION_VERSION_URL }}
    expected_sha: ${{ github.sha }}
```

Do not use a branch or movable tag as the security boundary.

## Live version document

`version_url` must be an HTTPS URL returning a small JSON document:

```json
{
  "sha": "0123456789abcdef0123456789abcdef01234567",
  "built_at": "2026-08-09T02:00:00Z"
}
```

The URL may be a Worker route such as `/version` or an immutable-build static document such as `/version.json`.

Rules:

- `sha` must identify the exact deployed Git commit and must equal `expected_sha` exactly.
- `built_at` must be a parseable timestamp supplied by the build/deploy process.
- The response must be JSON and no larger than 64 KiB.
- The verifier follows no redirects and accepts HTTPS only.
- Raw response bodies are not written to logs or receipts.

## Result semantics

The public `status` output is intentionally tri-state:

| Status | Meaning | Action result |
| --- | --- | --- |
| `pass` | A valid live version document exactly matched the expected commit. | success |
| `mismatch` | A valid live version document was observed, but its SHA remained different after the retry window. | failure |
| `unknown` | Identity could not be established because the endpoint was unreachable, returned HTTP failure, returned invalid evidence or the verifier was misconfigured. | failure |

`unknown` is not converted to `mismatch`, `false` or `pass`.

`terminal_state` provides the narrower reason: `verified`, `mismatch`, `unreachable`, `http_error`, `invalid_response` or `config_error`.

## Receipt schema

Every run emits a compact JSON receipt through the `receipt_json` output and a GitHub step summary:

```json
{
  "schema_version": 1,
  "status": "pass",
  "terminal_state": "verified",
  "version_url": "https://example.test/version",
  "expected_sha": "0123456789abcdef0123456789abcdef01234567",
  "observed_sha": "0123456789abcdef0123456789abcdef01234567",
  "built_at": "2026-08-09T02:00:00Z",
  "attempts_used": 1,
  "max_attempts": 5,
  "checked_at": "2026-08-09T02:01:00.000Z",
  "reason": "live deployment identity matched expected commit"
}
```

The receipt is evidence, not a deployment controller. The action never deploys, rolls back, merges, deletes branches, mutates production or reads deployment secrets.

## Retry policy

Defaults:

- attempts: 5;
- delay between attempts: 3 seconds;
- per-attempt timeout: 10 seconds.

A temporary mismatch may become `pass` if a later retry observes the expected SHA. The terminal result reflects the final evidence after the retry window unless an exact match is observed earlier.

## Rollout boundary

This repository is the portfolio-wide trust root. Review changes here manually.

Consumer integration must occur only when that repository has a clean write lane. A consumer should add the version document and call this action after its existing deploy step; do not combine Verified Closure rollout with unrelated product work.

The first rollout must prove both paths:

1. expected SHA → `pass`;
2. deliberately different SHA or fixture → `mismatch`.

Do not claim portfolio-wide deployment verification until consumers are individually pinned to an immutable commit containing this action.
