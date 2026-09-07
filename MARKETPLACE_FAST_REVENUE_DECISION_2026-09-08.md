# Fast Marketplace Revenue Decision — 2026-09-08

Status: research-backed product/distribution decision. Revenue outcome remains UNKNOWN until observed paid conversion. This note does not authorize billing/vendor spend, secrets, production promotion, or mutation of overlapping product branches.

## Revised decision

For literal **fastest path from small build to a paid marketplace listing**, the ranking is now:

1. **Framer Marketplace + external checkout first.** Framer's current 2026 publishing docs say plugins, components, and templates publish immediately with no review queue; paid products are supported; Framer says creators keep 100% of Marketplace revenue. Payment-processor/checkout fees still apply separately.
2. **Gumroad standalone in parallel** as the fastest direct-sale surface and a practical checkout/delivery layer for a Framer paid product. Direct-sale discovery is weaker than a vertical marketplace, but there is no app-store review dependency.
3. **Chrome Web Store next** when the product is genuinely browser-native. It remains strong software discovery but has extension review/policy friction, so it is not the literal fastest paid-listing route.
4. **Microsoft Edge Add-ons** after Chrome for low-incremental-cost Chromium distribution.
5. **Etsy** only for original digital downloads such as spreadsheets, templates, calculators, PDFs, and design assets; not the preferred software/plugin route.
6. **Atlassian Marketplace** later for higher-value B2B workflows; stronger native paid-app economics but materially slower review/platform work.
7. **Google Workspace Marketplace / Figma** later when the workflow is native to those ecosystems; both introduce review/verification delay.

Not day-zero priorities:
- Lemon Squeezy Marketplace requires prior sales/revenue eligibility before marketplace submission and then review.
- Payhip Marketplace has an approval process.
- Envato is not a current route for this plan because new author applications were paused in the July 2026 update.

## Highest-ROI smallest build selected

Prefer a **paid Framer code component**, not a full SaaS, browser extension, template, or backend-heavy plugin, for the first literal money test.

Working product: **Hiring Economics Calculator**

Positioning:
> An embeddable hiring / staffing economics calculator for recruitment agencies, HR SaaS sites, staffing firms, and employer career sites.

Primary user journey:

`enter assumptions -> compare hiring scenarios -> expose break-even / economic difference -> copy summary -> CTA`

Possible configurable inputs:
- role compensation;
- vacancy-cost or value-per-day assumption;
- expected time-to-fill for two scenarios;
- recruiter/agency fee or fixed acquisition cost;
- optional probability or scenario assumptions where the buyer deliberately supplies them.

Outputs:
- estimated vacancy cost by scenario;
- estimated recruiting fee/cost;
- estimated economic difference;
- break-even time-to-fill threshold;
- compact sensitivity/scenario view;
- copyable calculation summary;
- configurable CTA.

Integrity contract:
- calculations local and deterministic;
- every material assumption visible and user-configurable;
- UNKNOWN is not silently converted to zero;
- no universal ROI, productivity, hiring-quality, or causal claims;
- label outputs as estimates/scenarios unless the buyer supplies evidence supporting stronger language;
- no PII, auth, external API, analytics, or backend required for the MVP.

## Why this product rather than generic Framer utilities

Current Framer Marketplace sampling shows dense competition in generic SEO/audit/QA tools, forms/lead-capture components, and generic ROI/pricing calculators. Searches for recruitment/hiring/vacancy-cost calculator terms did not surface a clear direct equivalent in the sampled results; that is a **market-gap hypothesis, not proof of absence**.

The hiring-economics wedge is preferable because it is:
- narrower than a generic calculator;
- directly useful on commercial recruitment/HR websites;
- deterministic rather than dependent on paid AI inference;
- tiny enough to ship as one component;
- compatible with Framer's immediate-publishing model;
- reusable later as a standalone widget, Gumroad download, Chrome side-panel utility, or B2B lead-generation tool.

## Pricing hypothesis

Observed paid Framer components in the sampled marketplace span roughly low-single-digits through a few tens of dollars, including calculator-like components around $5-$29.

Initial test range: **$9-$19 one-time**.

This is a pricing experiment, not evidence of willingness to pay. Do not claim conversion, revenue, ROI, or product-market fit before observed transactions.

## Distribution stack

### Lane A — fastest paid marketplace exposure
**Framer Marketplace -> external checkout (e.g. Gumroad/Stripe-compatible seller flow) -> component delivery**

Advantages:
- no Framer pre-publication review queue under current docs;
- vertical audience already using Framer;
- paid products supported;
- no backend needed for the selected MVP.

Unknown:
- actual organic impressions, conversion, and buyer willingness to pay.

### Lane B — fastest direct sale
**Gumroad product page -> component/download bundle**

Advantages:
- can sell directly without waiting for an app marketplace review;
- useful as checkout/delivery for Framer.

Weakness:
- less guaranteed vertical discovery; traffic may need to be brought in.

### Lane C — next software distribution
**Chrome Web Store -> Edge Add-ons**

Use for the previously selected Ask-Klanko decision-adjudication browser extension once overlapping Ask-Klanko work is reconciled or a truly disjoint packaging scope is established.

## Why not the other fast-looking marketplaces first

### Lemon Squeezy Marketplace
Not a zero-to-one marketplace because current eligibility requires a product already sold through Lemon Squeezy plus at least 3 sales or $50 revenue before marketplace listing review.

### Etsy
Useful for original digital spreadsheets/templates/PDF calculators and has built-in consumer search, but it is a weaker fit for interactive web software. Listing and transaction/payment fees apply. AI-generated items must comply with Etsy's disclosure/original-design rules; prompt bundles are not the selected product.

### Atlassian Marketplace
Potentially stronger B2B willingness-to-pay and native app billing. Current Atlassian guidance says approval commonly takes 10-15 business days. Pure Forge apps have attractive current revenue-share economics, including qualifying 100% gross revenue until the specified lifetime Forge threshold, but this is not the fastest first-dollar lane.

### Google Workspace Marketplace
Public app review plus OAuth consent/verification can add several days and additional security/compliance work. Use only for a genuinely Workspace-native workflow.

### Figma Community / paid widgets
Widget review is typically measured in business days rather than immediate publishing. Good later if a design-native wedge appears.

### Envato
Not currently usable for this fast launch: Envato's July 2026 author update paused new author applications, with no immediate code-category reopening path.

## Live portfolio constraint

`lawchai-labs/contract-desk-command-centre` has active overlapping draft PRs, including PR #69 with deterministic EV/hour, sensitivity, and break-even decision mechanics. Those are useful domain evidence but remain an active mutable scope. Do not mutate or copy an unmerged implementation into a competing branch.

The Framer component should therefore be implemented as a **disjoint new product surface**, using independently specified deterministic formulas and explicit assumptions, rather than modifying Contract Desk or Ask-Klanko active branches.

## Sources checked 2026-09-08

Official/current sources consulted include:
- Framer Marketplace / Creator Program / publishing docs for plugins, components and templates (Aug 2026 updates);
- Framer paid Marketplace checkout documentation;
- Gumroad product-selling documentation;
- Chrome Web Store policy/review documentation;
- Lemon Squeezy Marketplace eligibility documentation;
- Etsy digital product and seller fee policies;
- Atlassian Marketplace app approval and Forge revenue-share documentation;
- Google Workspace Marketplace review/OAuth documentation;
- Figma widget publishing guidance;
- Envato July 2026 author application update.

Current Framer Marketplace samples were also inspected for generic calculators, forms, SEO/audit/QA utilities, job/career components, and hiring/recruitment terms.

## Reconsideration triggers

Re-rank when any of these occurs:
- Framer restores pre-publication review or materially changes creator economics;
- sampled hiring-economics competitors show the wedge is already commoditized;
- a paid transaction or meaningful buyer signal supports a different marketplace/product;
- Chrome review/policy materially improves or a browser-native demand signal dominates;
- Atlassian-specific B2B demand has enough expected value to justify the slower publication path;
- checkout/provider terms materially change.

Terminal state: **DECISION_REVISED_AND_PERSISTED / FRAMER_FIRST / PRODUCT_SPEC_SELECTED / BUILD_NOT_STARTED / REVENUE_UNKNOWN**.
