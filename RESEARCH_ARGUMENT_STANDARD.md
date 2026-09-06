# LawChai Research Argument Standard

Purpose: turn research, evaluation, public claims and evidence-heavy product decisions into inspectable arguments rather than piles of sources or unsupported conclusions.

This standard is derived from Wayne C. Booth, Gregory G. Colomb, Joseph M. Williams, Joseph Bizup, and William T. FitzGerald, *The Craft of Research*, 4th ed. (University of Chicago Press, 2016), as supplied to LawChai on 2026-09-07. It is an operational adaptation, not a substitute for the book or for field-specific methodology.

## 1. Start from a problem, not a corpus

Before collecting more material, state:

- **Practical problem**: what condition in the world creates a cost, risk or missed opportunity?
- **Research / conceptual problem**: what do we not know or understand well enough to act or reason responsibly?
- **Consequence**: what remains impossible, unsafe, misleading or inefficient while that knowledge gap remains?
- **Question**: what answer would materially reduce the gap?

A topic is not yet a research problem. A large source pile is not progress unless it reduces a defined uncertainty or improves a consequential argument.

## 2. Build an explicit argument record

For consequential conclusions, record the smallest useful structure:

- **Claim** — the conclusion being advanced.
- **Claim class** — fact/existence, definition/classification, cause/consequence, evaluation, or action/policy.
- **Reasons** — propositions that, if accepted, support the claim.
- **Evidence** — observations, records, measurements, documents or other support for the reasons.
- **Report-of-evidence boundary** — whether the system inspected the evidence directly or only a report/summarisation of it.
- **Warrant** — the general principle connecting a reason to the claim when that connection is not obvious to the intended reader.
- **Qualifications / scope** — conditions under which the claim does and does not hold.
- **Strongest objection or alternative** — the best material challenge, competing explanation, framing or evidence set found.
- **Response** — why the objection changes, limits, defeats or does not defeat the claim.
- **Unknowns** — unresolved questions that could change the conclusion.

Do not force every trivial fact through this full schema. Use it when the reasoning bridge matters.

## 3. Evidence quality gate

Before using evidence consequentially, test whether it is:

1. **Accurate** — reported correctly; material transcription/extraction errors checked.
2. **Precise enough** — specific enough for a reader to assess the actual magnitude, condition or observation.
3. **Sufficient** — enough evidence for the scope of the claim.
4. **Representative** — not an unacknowledged cherry-picked or exceptional case when the claim generalises beyond it.
5. **Authoritative for the use** — source competence and provenance fit the question being answered.

Also preserve relevance through the warrant: strong evidence for a reason does not help if the reason is not relevant to the claim.

Prefer primary evidence, or the closest practicable source to it, for consequential claims. When only secondary or tertiary reports are available, preserve the chain rather than silently converting a report into direct evidence.

## 4. Practical-claim gate

A recommendation to act is stronger than a descriptive or conceptual claim. Before promoting a practical claim, test the supporting chain:

- the problem exists;
- the important cause or obstacle is identified with appropriate uncertainty;
- the proposed action plausibly addresses that cause or obstacle;
- implementation is feasible within the relevant constraints;
- expected cost is proportionate to the problem being addressed;
- foreseeable side effects do not create a larger problem;
- material alternatives were considered rather than omitted by default.

If one of these links is unknown, keep it unknown. Do not convert conceptual evidence into an implementation or ROI claim without the missing bridge.

## 5. Source-engagement protocol

For each material source, preserve separate fields for:

- direct quotation or exact extract, when needed;
- paraphrase or summary;
- the researcher's own inference or reaction;
- source identity and retrieval information;
- what problem/question the source informs;
- where the source agrees or disagrees with other relevant sources;
- confidence/scope actually asserted by the source rather than an inflated restatement.

Do not treat an uncritical summary of one source as research. Disagreement, different evidence, different assumptions or different warrants are often where the useful problem begins.

## 6. Reader / skeptic pass

Once the core claim-reason-evidence structure exists, run a separate adversarial pass. Ask:

- Is the claim clear, specific and significant enough for the intended reader?
- Which reason is least supported?
- Which evidence is weakest on accuracy, precision, sufficiency, representativeness or authority?
- Which reason-to-claim connection relies on an unstated warrant?
- What competing warrant or alternative explanation could reverse the conclusion?
- What evidence would a skeptical reader reasonably expect but not find?
- What limit or unanswered question should be acknowledged explicitly?

Acknowledging a real limit is preferred to pretending the argument is unassailable.

## 7. Communication rules for consequential research

Default to:

- problem/context -> response/claim -> reasons/evidence -> qualifications/objections -> next decision;
- central actors or concepts as sentence subjects where that improves clarity;
- important actions as verbs rather than avoidable nominalisations;
- familiar information before new/complex information when sequencing explanations;
- complexity later, after the reader has the frame needed to interpret it.

These are clarity heuristics, not mandatory prose templates.

## 8. LawChai compatibility

This standard strengthens, rather than replaces, existing LawChai rules:

- `Unknown remains unknown` maps to explicit qualifications and unanswered objections.
- Provenance and smallest evidenced support sets map to source/evidence-chain discipline.
- Causal-claim controls map to the practical-claim and warrant gates.
- Comparator/counterfactual requirements remain mandatory for causal superiority, effect and ROI language.
- Exact-revision verification remains separate from argument quality: a well-structured argument is not execution evidence.

## 9. When useful

Apply the full or partial standard to:

- grant, competition, investor and public product claims;
- model/agent evaluations and ranking claims;
- research synthesis and `os` / `rr` / `ee` work;
- evidence/reputation products such as Klanko;
- architecture or product decisions justified by external evidence;
- consequential decision memos where alternatives and warrants matter.

## 10. When not useful

Do not add ceremony when the conclusion is a directly observable, low-risk fact with no material reasoning bridge, for example:

- a deterministic test returned exit code 0 on the recorded immutable revision;
- a file exists at an inspected path;
- a reversible UI wording change has no consequential public claim attached.

Even in these cases, keep normal LawChai verification and provenance rules.

## 11. Minimal reusable template

```text
Problem / knowledge gap:
Consequence if unresolved:
Question:
Claim + class:
Reasons:
Evidence + provenance:
Direct evidence or report of evidence:
Warrant(s), if material:
Evidence-quality weaknesses:
Strongest objection / alternative:
Response / qualification:
Unknowns that could reverse the conclusion:
Decision / next evidence action:
```
