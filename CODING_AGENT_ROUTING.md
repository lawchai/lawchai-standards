# Coding-Agent Routing — LawChai operational prior

Status: experimental routing prior; public benchmark evidence + community operational evidence. Not a universal ranking.

## Default route

| Task shape | Default | Challenger / escalation | Why |
|---|---|---|---|
| Mechanical, explicit, reversible | Luna | Jules | Preserve expensive reasoning capacity. |
| General implementation | Sol Medium | Astra Low | Strong middle point for speed/capability; compare against Astra on bounded hard tasks. |
| Bounded complex implementation with tests | Astra Low | Sol Medium | Current external signal suggests high closure quality with lower repair overhead; LawChai validation still required. |
| Ambiguous repo reasoning | Sol High | Astra Low/Medium | Favor stronger reasoning only when ambiguity cannot be removed cheaply upstream. |
| High-coupling architecture/debugging | Astra Low/Medium | Sol High | Optimize for verified closure, not raw cost. |
| Parallel repo-bounded overflow | Jules | Luna/Sol depending task | Use spare bounded capacity without overlapping writers. |
| Final integration / release | strongest justified model + deterministic checks | — | CI/runtime/live evidence decides closure. |

## Explicit non-defaults
- **Terra:** challenger/fallback only until LawChai evidence identifies a task class where it beats Luna/Sol on closure efficiency.
- **Astra High/XHigh/Max:** not default. Escalate only when lower-effort runs fail, the task is consequential, or expected repair/iteration cost dominates quota/latency.
- **Multi-model orchestration:** not assumed beneficial. Add an orchestrator only when it reduces ambiguity, context pollution, or repair cost enough to justify its overhead.

## Escalation ladder
1. Improve the work packet: bounded scope, acceptance criteria, repo map, relevant files, verification command.
2. Run the cheapest adequate route.
3. If blocked by reasoning/ambiguity rather than tooling, escalate one model/effort step.
4. If blocked by harness/tool interface, repair the interface instead of repeatedly escalating intelligence.
5. For high-coupling closure, require actual verification on the relevant revision/environment.

## Experiment ledger
When a routing decision is material, capture:
`repo + SHA + task class + work packet ID + model + effort + harness + wall time + quota/cost basis + tokens + repairs + verification + terminal result`.

Promote routing changes only from repeated matched evidence across multiple tasks/repositories. One successful anecdote may create a challenger, not a global rule.

## Current hypotheses to test
H1. Astra Low reduces repairs/total closure time versus Sol Medium on bounded complex implementation.
H2. Luna dominates on well-specified mechanical slices when context remains bounded.
H3. Terra lacks a stable default niche given current Luna/Sol frontier.
H4. Orchestration overhead often fails to pay for itself when the implementer already receives a high-quality bounded work packet.

All four remain hypotheses until LawChai execution evidence supports them.
