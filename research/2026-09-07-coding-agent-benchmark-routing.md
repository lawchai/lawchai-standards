# Research Memory — Coding-agent benchmark routing (2026-09-07)

## Source graph
- Reddit r/codex: “Artificial Analysis coding benchmarks: Astra x Sol x Terra x Luna x Claude x Grok — Intelligence x Price x Time charts” (OP data checked 2026-09-06).
- Exact high-resolution chart links published by OP:
  - coding across brands: `https://files.catbox.moe/d5oxrq.png`
  - coding OpenAI-only: `https://files.catbox.moe/4skvms.png`
  - general intelligence: `https://files.catbox.moe/oobbwi.png`
  - AA-Briefcase: `https://files.catbox.moe/2cmyq0.png`
- Primary corroboration: Artificial Analysis Coding Agent Index v1.4, GPT-6 Astra benchmark article, current Codex model comparison tables.
- Follow-up community experiment: “Astra Low vs Luna Max implementer experiment, Part 2: Results” (2026-09-06).

## Correction to first pass
The first pass under-read the supplied source by summarizing the post mechanics without exploiting the plotted model/effort frontier and its linked evidence deeply enough. This revision captures the decision-relevant points and operationalizes them. The direct Catbox image binary was not retrievable by the current browser, so plotted values are recovered from the OP's exact chart description plus the underlying current Artificial Analysis tables rather than guessed from pixels.

## Source-derived mechanics
1. Coding-agent comparisons must bind claims to **model + effort/settings + harness + benchmark suite + pricing basis + measurement date**. The Reddit post uses native coding CLIs and API-equivalent task cost and explicitly warns that API cost cannot be converted directly into subscription quota consumption.
2. Artificial Analysis Coding Agent Index v1.4 is an equal-weight composite of DeepSWE (113 tasks), Terminal-Bench v2.1 (89), and SWE-Atlas-QnA (124), with pass@1 averaged over three attempts.
3. Current Codex-harness table (2026-09-07 retrieval):
   - GPT-6 Astra max: Index 67; DeepSWE 67%; Terminal-Bench 83%; SWE-Atlas-QnA 51%; $4.72/task; 26.8m/task; 4M tokens/task.
   - GPT-5.6 Sol max: 65; 69%; 83%; 43%; $5.00; 10.2m; 13.2M.
   - Sol high: 64; 65%; 82%; 45%; $3.00; 6.2m; 8M.
   - Sol xhigh: 63; 67%; 80%; 43%; $3.74; 7.3m; 9.9M.
   - Sol medium: 62; 64%; 81%; 40%; $2.19; 5.0m; 5.8M.
   - Terra max: 60; 67%; 78%; 36%; $1.93; 8.2m; 9.6M.
   - Luna max: 57; 63%; 75%; 33%; $0.29; 8.0m; 16M.
4. The image/post therefore suggests a **frontier**, not a single winner:
   - Luna max is the extreme low-cost point but gives up capability and may consume many tokens.
   - Sol medium/high occupy strong speed/capability middle points.
   - Astra sits at the top capability/token-efficiency edge, but max has much higher wall time in AA and API token prices are high.
   - Terra is often squeezed between Luna and Sol in this particular public frontier; that is a routing prior, not proof Terra is useless.
5. Astra's headline advantage is more about **agentic completion and token efficiency** than a huge raw-intelligence jump. AA reports Astra max at 67 vs Sol max 65 in Coding Agent Index, with ~4M vs ~13.2M tokens/task; AA's Intelligence Index places Astra and Sol similarly at the top effort.
6. Composite scores hide task-shape differences. Astra's largest relative public advantage over Sol max in the current table is repository Q&A (51% vs 43%), while DeepSWE is slightly lower (67% vs 69%) and Terminal-Bench is equal (83%).
7. Cost, subscription burn, token use, and wall time are distinct axes. Prompt caching and provider quota accounting can reverse apparent API-cost rankings.
8. Harness effects are material; model-only rankings are unsafe.
9. Community charts are useful discovery/decision aids, not canonical truth. The source labels four Astra coding points approximate and commenters challenge benchmark freshness.
10. A contemporaneous controlled community experiment gives a useful but low-N operational signal: on one bounded complex UI implementation, Astra Low completed in 8m16s versus Luna Max 36m18s plus 19m42s repair; Luna needed two repairs and Astra none, with similar reported five-hour usage burn. A follow-up Luna Max orchestrator → Astra Low run was slower and used more reported tokens than the author's Sol Medium → Astra Low setup. This is **not** sufficient for a causal general superiority claim.

## Reconciliation with LawChai
- **ALREADY_COVERED:** Governance already binds consequential agent-eval claims to model/version, harness/tools, environment/revision, budget and evaluator contract.
- **ADD/OPERATIONALIZE:** Route by task class and evidence frontier, not a universal model rank.
- **ADD/OPERATIONALIZE:** Separate orchestration from implementation and measure whether orchestration overhead improves closure; do not assume a second model adds value.
- **ADD/OPERATIONALIZE:** For bounded complex coding, Astra Low becomes a candidate challenger to the current Sol/Jules route rather than being reserved only for exceptional architecture.
- **KEEP UNKNOWN:** Benchmark-to-LawChai productivity transfer, Astra Low vs Sol Medium on LawChai repos, and API-cost-to-subscription-quota mapping remain UNKNOWN until directly measured.

## Safe routing prior
Use this as a prior, overridden by repo-specific evidence:
- **Mechanical, well-specified, high-volume:** Luna / cheapest capable route.
- **General repo implementation and coordination:** Sol Medium as baseline.
- **Bounded but genuinely complex implementation with clear acceptance tests:** trial Astra Low before escalating reasoning effort.
- **High-coupling architecture/debugging:** Astra Low/Medium or Sol High chosen by task-fit evidence; higher effort is not automatically better.
- **Terra:** no default role when Luna or Sol offers a clearly better observed fit; retain as fallback/challenger rather than delete.
- **Final integration:** strongest justified route + actual CI/runtime verification, never benchmark score alone.
- **Parallel overflow:** Jules when its repo-bounded execution and capacity advantages dominate.

## Measurement contract for LawChai
For material coding allocations record:
`task class -> immutable repo SHA -> model/version -> effort -> harness -> prompt/work packet -> wall time -> subscription/API usage basis -> reported tokens -> repairs -> tests/verification -> closure result`.

Prefer matched bounded comparisons when practical. Preserve failed/negative runs. Do not promote a global provider rule until repeated LawChai evidence covers more than one repo/task class.

## Evidence status
- Exact Reddit post/source graph recovered: PASS.
- Underlying AA benchmark tables/methodology retrieved: PASS (2026-09-07).
- Direct high-resolution Catbox image pixel inspection: BLOCKED by current browser retrieval; no pixel values inferred.
- Follow-up controlled community experiment inspected: PASS as external observational evidence.
- LawChai-specific comparative experiment: NOT_RUN.
- Causal superiority / ROI claim: NOT_SUPPORTED.

## Reconsideration triggers
Re-evaluate when benchmark suite/version changes, model effort behavior changes, harness changes materially, provider pricing/quota policy changes, or LawChai task-level closure evidence becomes strong enough to override public benchmark priors.
