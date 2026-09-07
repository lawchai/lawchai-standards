# Fast Marketplace Revenue Decision — 2026-09-08

Status: research-backed product/distribution decision. Revenue outcome remains UNKNOWN until observed paid conversion. This note does not authorize billing/vendor spend, secrets, production promotion, or mutation of overlapping Ask-Klanko branches.

## Decision

For the fastest credible marketplace test from the current LawChai/Klanko portfolio:

1. **Chrome Web Store first** for discovery/distribution.
2. **Microsoft Edge Add-ons second, using the same Chromium package where compatible.**
3. **External checkout/license for monetization**; do not depend on a native Chrome Web Store payments system.
4. **Google Workspace Marketplace is not the fastest default public route** because public listings add app review and, where OAuth scopes require it, OAuth verification/security work.
5. Atlassian Marketplace is a later B2B option when a Jira/Confluence-specific workflow has stronger willingness-to-pay evidence.
6. Shopify is a later merchant-specific option; its app-store requirements and embedded/billing integration create more initial surface area.

## Highest-ROI product bet

Do **not** build another generic Workday/job-application autofill extension as the first bet. The Chrome Web Store already contains numerous Workday/job autofill products, including established and newly published entrants. Demand exists, but differentiation is weak and competition is unusually dense.

Prefer a browser companion derived from **Ask Klanko's evidence/adjudication mechanics**:

`question or selected text -> ask configured models -> normalize candidate answers -> expose agreement/disagreement/UNKNOWN -> evidence/provenance-aware synthesis -> recommended next action -> copy/export Decision Packet`

Working positioning: **Ask Klanko — ask several AIs, get one decision dossier rather than several chat tabs.**

This is deliberately different from generic multi-AI broadcast extensions whose main value proposition is sending one prompt to multiple AI services side-by-side. The wedge is adjudication and decision quality: disagreement, unknowns, provenance, explicit assumptions, and a reusable result.

## Reuse / live-repo constraint

`lawchai/Ask-Klanko` already has an open draft PR #8, **Agent-adjudicated Evidence Packet as Ask Klanko's primary journey**, implementing a question -> routed agents -> per-dimension adjudication -> claim-level provenance -> disagreements/UNKNOWNs -> defensible confidence -> fingerprinted Evidence Packet workflow. That makes Ask-Klanko the highest-leverage reuse source.

Do not create a competing implementation inside the currently overlapping Ask-Klanko mutable scope while its active PRs/writers remain unresolved. Package/browser-extension work should begin only in a disjoint scope or after reconciliation with the active branch state.

## Smallest marketplace MVP

Primary action: **Compare this with Klanko**.

Minimum useful journey:

1. User types a question or explicitly selects page text.
2. User chooses 2-5 configured AI providers/models.
3. Extension sends the explicit user input to those configured endpoints.
4. Side-by-side candidate answers remain inspectable.
5. Klanko produces a structured synthesis:
   - agreement;
   - meaningful disagreement;
   - unsupported/unknown items;
   - assumptions;
   - evidence/provenance where available;
   - one recommended next action.
6. Copy/export a deterministic Decision Packet.

Keep the visible interface narrow: one dominant compare action, progressive disclosure for model/provider configuration and evidence detail.

## Chrome review-risk contract

Optimize for a reviewable, single-purpose extension:

- request the narrowest permissions possible;
- avoid `<all_urls>` and broad host access unless indispensable;
- prefer explicit user action over continuous page observation;
- no hidden background browsing;
- no automatic form submission;
- no scraping/automation whose purpose is to evade AI-provider safety controls or usage restrictions;
- disclose exactly what user data is sent to which configured provider;
- treat credentials/API keys as sensitive and never collect more than required;
- separate optional provider permissions where technically practical.

A BYOK/provider-API architecture is the safer first technical shape than DOM-driving logged-in AI web sessions. It trades some onboarding friction for a materially cleaner policy/security boundary.

## Monetization hypothesis — not evidence

Chrome Web Store discovery does not establish willingness to pay. Initial pricing is an experiment, not a forecast.

Candidate packaging:

- Free: 2-model comparison + basic agreement/disagreement view.
- Paid: more configured models, richer synthesis, saved history, Decision Packet export, reusable presets/workflows.
- Checkout/license: external web checkout linked from the extension/listing as allowed by applicable policy.

Do not claim revenue, conversion, ROI, retention, or product-market fit before observed transactions/usage support it.

## Marketplace ordering rationale

### Chrome Web Store — first
- Official Chrome documentation says most extension reviews complete within a few days, though reviews can take up to a few weeks.
- Broad host/sensitive permissions and large/hard-to-review code increase review time.
- Marketplace fit is strong for lightweight browser-native utilities.

### Microsoft Edge Add-ons — parallel second
- Microsoft documents that Chromium extensions can generally be ported to Edge with minimal/no rewrite when APIs are compatible.
- This creates additional distribution with low incremental product work.

### Google Workspace Marketplace — not first
- Public apps require Marketplace review.
- OAuth configuration is part of the publishing path, and sensitive/restricted scopes can require additional verification/security work.
- Use it only when the product's core job is genuinely Workspace-native rather than as a generic discovery channel.

### Atlassian Marketplace — later B2B
- Forge app publication has Marketplace review and platform-specific implementation, but Atlassian provides a native paid-app billing path and attractive economics for qualifying Forge revenue.
- Revisit when there is a concrete Jira/Confluence workflow with stronger organizational willingness to pay.

### Shopify App Store — later commerce vertical
- Production apps must meet a larger set of App Store and integration/billing requirements.
- Better fit once there is a clear merchant workflow, not for the fastest generic launch.

## Competitor observation

Generic job-application autofill and generic AI form filling are both crowded Chrome categories. Multi-AI prompt broadcasters also exist, including products that open/send one prompt across multiple AI services. The observed gap worth testing is **not multi-model access itself** but **decision adjudication after multiple answers**.

This is a product hypothesis, not proof of an underserved market. Counterfactual demand and paid conversion remain UNKNOWN until exposed users choose/pay.

## Sources checked 2026-09-08

Primary/official:
- Chrome Web Store review process: https://developer.chrome.com/docs/webstore/review-process
- Chrome Web Store docs: https://developer.chrome.com/docs/webstore
- Google Workspace Marketplace OAuth configuration: https://developers.google.com/workspace/marketplace/configure-oauth-consent-screen
- Microsoft Edge extensions overview: https://learn.microsoft.com/en-us/microsoft-edge/extensions/
- Atlassian Forge Marketplace listing: https://developer.atlassian.com/platform/marketplace/listing-forge-apps/
- Atlassian Marketplace pricing/payment/billing: https://developer.atlassian.com/platform/marketplace/pricing-payment-and-billing/
- Shopify App Store requirements: https://shopify.dev/docs/apps/launch/shopify-app-store/app-store-requirements

Current-market examples inspected:
- Multi-AI Chat, Chrome Web Store: https://chromewebstore.google.com/detail/multi-ai-chat/ajjjgkcggdkpaomfpghendbngmkfighe
- Multi Search & Multi AI, Chrome Web Store: https://chromewebstore.google.com/detail/multi-search-multi-ai/oiiajjjedfdfboacleknggbcbkjhngen
- Current Chrome Web Store listings for Workday/job autofill products were sampled during the 2026-09-08 research pass.

Internal reuse evidence:
- lawchai/Ask-Klanko PR #8: https://github.com/lawchai/Ask-Klanko/pull/8
- lawchai/lawchai-standards/PORTFOLIO_REUSE_CATALOG.md

## Reconsideration triggers

Re-rank marketplaces/product shape when any of these occurs:

- Chrome review/policy materially changes;
- a marketplace-specific paid workflow shows stronger direct demand;
- paid conversion data contradicts the multi-AI decision-adjudication hypothesis;
- Ask-Klanko active PRs are reconciled and a clean extension packaging scope becomes available;
- provider/API terms make the BYOK architecture materially worse than an alternative compliant design.

Terminal state: **DECISION_PERSISTED / BUILD_NOT_STARTED / REVENUE_UNKNOWN**.
