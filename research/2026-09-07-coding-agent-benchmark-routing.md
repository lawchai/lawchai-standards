# Research Memory — Coding-agent benchmark routing (2026-09-07)

## Source
- Reddit r/codex: “Artificial Analysis coding benchmarks: Astra x Sol x Terra x Luna x Claude x Grok — Intelligence x Price x Time charts” (data checked by OP 2026-09-06).
- Primary corroboration: Artificial Analysis Coding Agent Index v1.4 methodology/page.

## Source-derived mechanics
1. Coding-agent comparisons must bind claims to **model + effort/settings + harness + benchmark suite + pricing basis + measurement date**. The Reddit post explicitly uses native CLIs and API-equivalent task cost; it warns that API cost cannot be converted directly into subscription quota consumption.
2. Artificial Analysis' current Coding Agent Index is an equal-weight composite of DeepSWE (113 tasks), Terminal-Bench v2.1 (89), and SWE-Atlas-QnA (124), with task-normalized pass@1 averaged over three attempts.
3. Composite scores hide task-shape differences. Repository Q&A, patch execution, and terminal workflows should be inspected separately when they resemble the actual work.
4. Cost, token use, and wall time are separate axes. Prompt caching/provider routing can materially change effective cost.
5. Harness effects are material enough that model-only rankings are unsafe; AA explicitly compares the same underlying model across harnesses.
6. Community charts are useful discovery/decision aids, not canonical truth. The source itself labels some Astra coding values approximate, and comments challenge benchmark freshness/interpretability.

## Reconciliation with LawChai
- **ALREADY_COVERED:** Governance already requires consequential agent-eval claims to bind model/version, harness/tools, environment/revision, budget and evaluator contract.
- **ADD/OPERATIONALIZE:** Provider routing should use task-shape evidence, not a universal “best model” ranking. Treat benchmark score, API-equivalent cost, subscription quota, latency, and observed LawChai closure rate as distinct variables.
- **KEEP UNKNOWN:** Benchmark-to-LawChai productivity transfer and API-cost-to-subscription-quota mapping remain UNKNOWN until directly measured.

## Safe adoption
For coding-agent allocation, record where material:
`task class -> model/version -> effort -> harness -> benchmark/evidence date -> cost basis -> verification contract -> observed closure result`.

Routing heuristic:
- cheap/reversible/mechanical work: lowest-cost configuration with adequate verified capability;
- repository reasoning / ambiguous implementation: escalate by task-fit evidence;
- high-coupling closure: prioritize verified correctness/reliability over headline benchmark efficiency;
- do not infer a subscription-quota Pareto frontier from API-priced benchmark charts.

## Evidence status
- Source graph deep-read: PASS (Reddit post + linked AA benchmark page inspected 2026-09-07).
- LawChai-specific comparative experiment: NOT_RUN.
- Causal superiority / ROI claim: NOT_SUPPORTED.

## Reconsideration triggers
Re-evaluate when benchmark suite/version changes, harness changes materially, provider pricing/quota policy changes, or LawChai accumulates enough task-level closure evidence to override public benchmark priors.
