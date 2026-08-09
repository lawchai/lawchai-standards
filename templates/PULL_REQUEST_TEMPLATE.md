## Outcome

[What can the user now do, and what concrete output or evidence is produced?]

## Scope

```yaml
allowed_paths:
  - path/to/authorised/file
authorised_behaviours:
  - behaviour changed
excluded_behaviours:
  - behaviour intentionally unchanged
```

## Changed paths

- `[path]` — [reason]

## Semantic-contract declaration

| Contract surface | Changed? | Evidence or compatibility note |
|---|---:|---|
| Public signatures | No | |
| Return/sentinel values | No | |
| Storage/schema formats | No | |
| Error handling | No | |
| Persistence/reset | No | |
| Import/export | No | |
| Migration behaviour | No | |

Consumers searched:

- `[consumer/path or query]`

## Capability preservation

- Existing journeys preserved: [list]
- Intentional removals: none / [explicitly authorised removal and reason]
- Proven architecture preserved: yes / no — [explain]

## Verification

Exact head SHA: `[sha]`

| Check | Command or evidence | Result |
|---|---|---|
| Deterministic tests | `[command]` | [pass/fail; tests executed] |
| Type check | `[command]` | [result] |
| Lint | `[command]` | [result] |
| Build | `[command]` | [result] |
| Browser journey | [route/scenario] | [result] |

Zero-test guard: [passed / not applicable / missing]

## Accessibility

- [ ] Keyboard-only journey
- [ ] Visible focus
- [ ] Reduced motion
- [ ] 200% zoom
- [ ] 320px and 390px viewports
- [ ] No horizontal overflow
- [ ] 44×44 controls where applicable
- [ ] Truthful alt text and unique IDs
- [ ] Not applicable — [reason]

## Security, privacy, and data

- Secrets exposed: no / [blocker]
- Sensitive real data used: no / [authorisation]
- Synthetic-data disclosure: [present / not applicable]
- Input validation/CSP/rate limiting/retention/authentication effects: [details]
- Dependency changes: none / [details]

## Integrity

- Unsupported claims added: no / [details]
- Unknown-state handling preserved: yes / [details]
- Calculation assumptions exposed: [yes / not applicable / gap]

## Out-of-scope defects

- None found / [report only; no inline fix]

## Review state

- Unresolved review threads: [count]
- CI status: [status]
- Terminal state: Ready PR / `[BLOCKED]` draft PR
- Blocker and remaining work if blocked: [details]
