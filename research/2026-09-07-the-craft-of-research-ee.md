# EE — The Craft of Research (4th ed.)

Date: 2026-09-07 SGT

Source: Wayne C. Booth, Gregory G. Colomb, Joseph M. Williams, Joseph Bizup, William T. FitzGerald, *The Craft of Research*, 4th ed., University of Chicago Press, 2016. User-supplied EPUB. No external research was blended into this `ee` pass.

## Source-derived mechanics

### 1. Research is question- and problem-directed

The book distinguishes a broad topic from a focused question and a genuine research problem. A research problem consists not only of something not known or understood, but also the consequence of that incomplete understanding. It also distinguishes practical problems, which require action in the world, from conceptual/research problems, which require better understanding before action or judgment.

**Applicability:** High. LawChai research can otherwise drift toward corpus accumulation or novelty production without proving that the added material changes a decision.

### 2. Argument is more than a claim plus citations

The book's core argument structure is claim -> reasons -> evidence, strengthened by qualifications, acknowledgments/responses and warrants. A warrant expresses the general principle that makes a reason relevant to a claim. The book recommends testing warrants for reasonableness, limitation, competing warrants, field appropriateness and coverage of the reason/claim.

**Applicability:** High for public claims, product judgments, agent/model evaluations, grant narratives and Klanko's evidence/reputation thesis.

### 3. Evidence and reports of evidence are different

The book stresses that evidence can be transformed at every reporting step and that readers care about the chain from the underlying observation/data to the final claim. It advises getting as close to primary evidence as practicable and preserving enough citation/provenance for readers to inspect the chain.

**Applicability:** High. This directly sharpens LawChai's existing provenance rules and helps prevent a model summary, provider claim or secondary article from silently becoming "the evidence."

### 4. Evidence quality has five useful dimensions

The source tests evidence for accuracy, appropriate precision, sufficiency, representativeness and authority. Relevance is addressed through the argument/warrant relationship.

**Applicability:** High. Existing LawChai rules strongly protect execution evidence and provenance but did not encode this compact evidence-quality checklist explicitly.

### 5. Good research actively engages sources

The book recommends reading sources for their problems, arguments, data and support; preserving complete bibliographic information; recording the scope/confidence of claims; noticing why sources agree or disagree; and separating quotations, paraphrases/summaries and the researcher's own thinking. It warns against treating an uncritical summary of one source as research.

**Applicability:** High for `ee`, `rr`, `os`, Research Memory and competitive/product research.

### 6. Objections and alternatives are part of the argument

The book treats anticipated questions, objections and alternative framings/evidence as necessary for a convincing argument. It also explicitly recommends acknowledging questions that cannot be answered rather than pretending to have the last word.

**Applicability:** High. This maps cleanly to LawChai's unknown/uncertainty discipline and improves decision quality where plausible competing explanations exist.

### 7. Practical recommendations need a longer support chain

For practical/action claims, the source says readers may expect support that the problem exists, that the proposed action addresses it, that implementation is feasible, that costs are justified, that it does not create a larger problem and that it compares acceptably with alternatives.

**Applicability:** High for product bets, architecture recommendations, funding plans and ROI claims.

### 8. Reader-oriented writing is a reasoning tool

The source treats writing as part of thinking, not merely presentation. Useful style heuristics include putting central characters/concepts in subject position, expressing crucial actions in verbs, sequencing old/familiar information before new information and putting complexity later.

**Applicability:** Medium. Useful for research reports and consequential decision documents; excessive enforcement would be low-ROI for routine implementation chatter.

## Reconciliation with current LawChai doctrine

### Already covered strongly

- Unknown remains unknown.
- Provenance/source distinction and smallest evidenced support sets.
- Explicit causal-language controls and counterfactual/comparator discipline.
- Agent-reported evidence is not equivalent to independently executed verification.
- Serious negative memory and reconsideration triggers.

### Material deltas adopted

1. **Explicit research-problem structure:** knowledge gap + consequence + question.
2. **Argument record:** claim + class + reasons + evidence + report-of-evidence boundary + warrant + qualification + objection/alternative + response + unknowns.
3. **Evidence-quality gate:** accurate, precise enough, sufficient, representative, authoritative, with relevance tested through the warrant.
4. **Practical-claim gate:** problem -> cause/obstacle -> solution mechanism -> feasibility -> cost proportionality -> side effects -> alternatives.
5. **Source-note provenance:** quote/exact extract vs paraphrase/summary vs researcher inference must remain distinguishable.
6. **Separate skeptic pass:** challenge the completed core argument rather than trying to anticipate every objection during initial construction.

Implementation: `RESEARCH_ARGUMENT_STANDARD.md` added to `lawchai/lawchai-standards` in the same `ee` pass.

## Klanko-specific application

### Evidence/reputation events

**Inference from source + product context:** Klanko should distinguish direct evidence from reports/summaries of evidence in any evidence object or public proof surface where the distinction changes trust. A receipt or source URL proves a record exists; it does not by itself prove the truth of the underlying claim.

### Evaluation rules as warrants

**Inference:** In blind challenges, ranking comparisons or category reputation updates, the evaluation rule functions like a warrant: it explains why observed task evidence supports a particular evaluative conclusion. If the rule is hidden, vague or changes across tasks, the reputation conclusion becomes harder to interpret.

### Grant and competition claims

**Inference:** Claims registers should preserve the practical-claim chain for recommendations and the argument record for consequential market, traction, superiority or feasibility claims. Existing `UNKNOWN`/synthetic-data boundaries already cover part of this.

### Aggregation strategy

**Inference:** The book's question-first discipline implies that source aggregation alone is not research value. Klanko can aggregate models, events, careers or other entities for discovery, but evaluative conclusions should remain tied to explicit user questions, evidence scope and warrants rather than to volume of indexed material.

## When useful

Use these mechanics when:

- the conclusion could affect money, public positioning, ranking, reputation, eligibility or architecture;
- multiple sources disagree or use different evidence/assumptions;
- a reason-to-claim bridge is not self-evident;
- a recommendation is being made rather than a fact simply reported;
- a source summary might otherwise be mistaken for direct evidence.

## When not useful

Do not force the full argument record onto:

- directly observable low-risk facts;
- exact-SHA test execution receipts where the claim is only that the test ran and passed;
- reversible microcopy or presentation changes without consequential claims;
- mechanical source indexing before any evaluative conclusion is drawn.

## Evidence / outcome

- Source review: completed from the supplied EPUB; no web research used.
- Durable adoption: `RESEARCH_ARGUMENT_STANDARD.md` created.
- Verification of adopted text: file-level GitHub persistence is directly observable from the resulting commits; no runtime or test execution is required for markdown-only additions.
- Product outcome: UNKNOWN. This pass changes standards and reasoning infrastructure; it does not establish that future research accuracy, funding success, product-market fit or Klanko reputation quality improved.
