# LawChai Product Starter Baseline v1

Purpose: a pinned, reusable baseline for new LawChai product repositories. This is a **starter contract and adoption checklist**, not permission to copy unrelated implementation or centralise shared mutable authority.

## 1. Repository bootstrap

Every adopted product should establish, as applicable:

- `README.md` — purpose, primary journey, evidence boundary, run/build/test commands, deployment posture, and known limitations.
- `AGENTS.md` — repository-specific scope, mutation boundaries, verification commands, and terminal-state rules.
- `.github/lawchai-scope.yml` — structured `allowed_paths` for bounded implementation lanes where scope enforcement is useful.
- deterministic test entrypoint with a zero-test guard;
- production build/type/lint commands appropriate to the stack;
- `.gitignore` and dependency lockfile appropriate to the package manager;
- semantic-contract declaration for material public/storage/return/error changes.

Do not add infrastructure merely to make a prototype look production-like.

## 2. Minimum product journey

Before publication, implement and verify the smallest coherent journey:

`open -> understand purpose -> perform primary action -> receive concrete output -> save/resume where needed -> recover/reset where needed`

Also handle materially relevant loading, empty, error and success states. No dead placeholder controls.

## 3. Truth and evidence baseline

Use explicit states for:

- `KNOWN`
- `UNKNOWN`
- `SYNTHETIC`
- `OBSERVED`
- `DERIVED`
- `HYPOTHESIS`

Only use the states applicable to the product. Missing evidence must remain unknown rather than becoming zero, failure, or a fabricated claim.

Synthetic fixtures must be labelled. Deployment does not imply users, customers, adoption, revenue, production usage, or market traction.

## 4. Persistence baseline

If persistence is part of the product:

- version stored state;
- validate imports before mutation;
- fail closed on future/invalid schema;
- preserve existing data on failed writes where feasible;
- make reset scoped to the product's namespace/workspace;
- define export/import semantics;
- inspect stale/corrupt state and recovery behaviour;
- document migration requirements before changing schemas.

Do not replace durable persistence with in-memory state merely to simplify a generated prototype.

## 5. Security/privacy baseline

- no committed secrets or credentials;
- synthetic/local-only data by default for sensitive-domain prototypes;
- validate and bound untrusted input;
- render imported/user strings as inert data unless executable markup is explicitly required and safely isolated;
- avoid unnecessary third-party data transfer;
- document external APIs, credentials, quotas and retention where used;
- fail closed on unauthorised or ambiguous sensitive operations.

## 6. Browser/mobile baseline

For materially user-facing changes, verify proportionately:

- 320px and 390px widths;
- desktop;
- effective 200% reflow where relevant;
- keyboard/focus visibility;
- reduced motion;
- no unintended horizontal overflow;
- useful labels/semantic controls;
- touch targets approximately 44x44 CSS px where appropriate.

A manifest alone is not meaningful PWA verification.

## 7. Reusable feature modules

Prefer portable modules/contracts over a giant shared runtime. Candidates include:

- evidence/provenance records (`starter/src/lib/evidence.ts`);
- deterministic receipt/export helpers;
- local persistence + migration helpers (`starter/src/lib/storage.ts`);
- workflow state machines;
- browser verification harnesses;
- handoff/terminal-state schemas (`schemas/handoff-report.schema.json`);
- scope declarations (`.github/lawchai-scope.yml`);
- common UI tokens/accessibility helpers.

Each module must have an explicit owner, contract, version/pin strategy, deterministic tests, and replacement path. Do not create a shared dependency merely because two products have similar-looking code.

## 8. Adoption procedure

1. Pin the baseline revision using `node scripts/init-starter.mjs --standards-sha <40-char-sha>`.
2. Compare the target repository against the baseline (`starter/`).
3. Select only applicable modules/checks.
4. Record deviations and why they are necessary in `product-contract.json`.
5. Implement in an isolated mutation scope.
6. Run deterministic verification with `.github/actions/verification-factory`.
7. Run browser/accessibility checks when materially implicated.
8. Reconcile exact base/head, changed paths, reviews/threads and ownership.
9. Generate terminal handoff report using `scripts/generate-handoff.mjs`.
10. Terminalise as `READY_PR`, `[BLOCKED]`, or `UNCHANGED_FAILURE`.

Adoption does not imply merge, deployment, homepage promotion, flagship status, or production use.

## 9. Copy/adapt rules

When reusing an existing LawChai implementation:

- identify canonical source repository + exact source SHA;
- identify the mechanism being reused;
- copy/adapt only the bounded mechanism required by the target contract;
- preserve provenance of the adaptation;
- re-run target-repository tests and semantic-contract checks;
- do not silently fork security, persistence, deployment, or high-coupling authority.

For third-party code, separately apply the licence/provenance/security gate. This baseline does not grant reuse rights.

## 10. Verification factory interface

The non-zero evidence guard primitive (`scripts/nonzero-evidence-guard.mjs`) and verifier (`.github/actions/verification-factory`) accept:

```yaml
repository: owner/name
base_sha: <immutable sha>
head_sha: <immutable sha>
authorized_paths: []
required_commands: []
required_browser_journeys: []
semantic_contract_changed: false
persistence_changed: false
risk_class: low|medium|high
```

It emits:

```yaml
terminal_state: READY_PR|BLOCKED|UNCHANGED_FAILURE
executed_nonzero: true|false
checks: []
changed_paths: []
contract_changes: []
blockers: []
next_action: <one exact action>
verified_at: <timestamp>
```

This interface is implemented deterministically in `.github/actions/verification-factory/verification-factory.mjs`.

## 11. Promotion boundary

`created != published != deployed != discoverable != featured != flagship`.

The baseline is intended to make creation and publication cheaper and more consistent; promotion still requires stronger evidence under LawChai governance.

## 12. Expected benefit

The baseline reduces repeated bootstrap work, makes product quality more deterministic, and directly feeds the Verification Factory and Handoff Generator. It does not block cheap experiments or force unrelated products into one architecture.
