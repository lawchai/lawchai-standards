# Multi-brand repository topology — 2026-09-07

Status: ADOPTED DESIGN / repository creation itself not executed in this connector surface.

## Placement rule

### lawchai
Use for canonical product repositories and shared components that are authoritative, versioned, independently testable, and consumed by more than one product.

### lawchai-labs
Use for disposable/experimental feature prototypes, source adapters, ranking experiments, UI explorations, and other bounded work whose purpose is parallel exploration. Labs repositories must not become hidden production authorities.

Rule:
`canonical product monorepo per brand + bounded lab federation + few shared authoritative packages`.

## Canonical product repositories — create

1. `lawchai/venture-opportunities`
   - funding, grants, accelerators, incubators, fellowships, startup credits, competitions, investor programs.

2. `lawchai/event-network`
   - startup events, networking, conferences, conventions, meetups, workshops, demo days.

3. `lawchai/startup-careers`
   - startup jobs, role taxonomy, compensation/equity, company stage, location/remote, application freshness.

Klanko remains `lawchai/klanko`.

## Shared authoritative repositories — create when contract boundary is real

1. `lawchai/catalog-platform-core`
   - source identity, UNKNOWN semantics, provenance, freshness, source-identity dedupe, generic field search/filter, ingestion admission, candidate fingerprint primitives.

2. `lawchai/source-adapter-contracts`
   - common adapter request/result contracts, fixtures, source capability declarations, canonical URL and attribution requirements.

3. `lawchai/entity-link-core`
   - conservative cross-source entity-link/canonicalization primitives; candidate matching must not silently establish identity.

4. `lawchai/geo-time-core`
   - timezone/date/location normalization, remote/physical semantics, radius/geography primitives.

5. `lawchai/catalog-receipts`
   - ingestion/update/freshness/provenance receipts; no brand-specific quality or eligibility semantics.

Do not split these out before at least two independent consumers exist. Until then keep their implementation in a canonical product repo and extract by immutable revision.

## venture-opportunities lab repositories — wave 1

- `lawchai-labs/venture-source-adapters`
- `lawchai-labs/venture-grants-ingestion`
- `lawchai-labs/venture-accelerator-ingestion`
- `lawchai-labs/venture-competition-ingestion`
- `lawchai-labs/venture-eligibility-engine`
- `lawchai-labs/venture-deadline-engine`
- `lawchai-labs/venture-value-equity-normalizer`
- `lawchai-labs/venture-opportunity-dedupe`
- `lawchai-labs/venture-search-ranking`
- `lawchai-labs/venture-saved-searches`
- `lawchai-labs/venture-alerts`
- `lawchai-labs/venture-application-workspace`
- `lawchai-labs/venture-source-admin`
- `lawchai-labs/venture-onboarding-experiments`
- `lawchai-labs/venture-homepage-experiments`

## event-network lab repositories — wave 1

- `lawchai-labs/event-source-adapters`
- `lawchai-labs/event-calendar-ingestion`
- `lawchai-labs/event-canonicalizer`
- `lawchai-labs/event-date-time-engine`
- `lawchai-labs/event-geo-discovery`
- `lawchai-labs/event-category-taxonomy`
- `lawchai-labs/event-search-ranking`
- `lawchai-labs/event-networking-intent`
- `lawchai-labs/event-rsvp-deeplink`
- `lawchai-labs/event-saved-searches`
- `lawchai-labs/event-alerts`
- `lawchai-labs/event-organizer-import`
- `lawchai-labs/event-source-admin`
- `lawchai-labs/event-homepage-experiments`
- `lawchai-labs/event-map-experiments`

## startup-careers lab repositories — wave 1

- `lawchai-labs/careers-source-adapters`
- `lawchai-labs/careers-job-normalizer`
- `lawchai-labs/careers-job-dedupe`
- `lawchai-labs/careers-role-taxonomy`
- `lawchai-labs/careers-compensation-normalizer`
- `lawchai-labs/careers-equity-normalizer`
- `lawchai-labs/careers-company-stage-enrichment`
- `lawchai-labs/careers-location-remote`
- `lawchai-labs/careers-search-ranking`
- `lawchai-labs/careers-saved-searches`
- `lawchai-labs/careers-alerts`
- `lawchai-labs/careers-application-tracker`
- `lawchai-labs/careers-company-pages`
- `lawchai-labs/careers-source-admin`
- `lawchai-labs/careers-homepage-experiments`

## High-ROI second-wave writer lanes

These add concurrency where ownership is genuinely separable. They remain experimental and may be archived once their result is integrated.

### venture-opportunities — wave 2

- `lawchai-labs/venture-investor-program-ingestion`
- `lawchai-labs/venture-startup-credit-ingestion`
- `lawchai-labs/venture-fellowship-incubator-ingestion`
- `lawchai-labs/venture-stage-sector-taxonomy`
- `lawchai-labs/venture-geography-jurisdiction`
- `lawchai-labs/venture-requirement-extractor`
- `lawchai-labs/venture-fit-explanation`
- `lawchai-labs/venture-deadline-calendar`
- `lawchai-labs/venture-change-detection`
- `lawchai-labs/venture-data-quality-audits`

### event-network — wave 2

- `lawchai-labs/event-series-recurrence`
- `lawchai-labs/event-speaker-session-ingestion`
- `lawchai-labs/event-ticket-pricing`
- `lawchai-labs/event-venue-travel`
- `lawchai-labs/event-calendar-sync`
- `lawchai-labs/event-agenda-planner`
- `lawchai-labs/event-change-detection`
- `lawchai-labs/event-data-quality-audits`
- `lawchai-labs/event-structured-data-seo`
- `lawchai-labs/event-notification-digest`

### startup-careers — wave 2

- `lawchai-labs/careers-job-freshness`
- `lawchai-labs/careers-job-expiry`
- `lawchai-labs/careers-skills-taxonomy`
- `lawchai-labs/careers-company-funding-enrichment`
- `lawchai-labs/careers-visa-work-auth`
- `lawchai-labs/careers-salary-benchmark`
- `lawchai-labs/careers-equity-estimator`
- `lawchai-labs/careers-change-detection`
- `lawchai-labs/careers-data-quality-audits`
- `lawchai-labs/careers-notification-digest`

## Cross-brand experimental mechanism labs

These are non-authoritative experiments. Promote a mechanism to `lawchai/*` only after at least two real consumers prove a stable contract.

- `lawchai-labs/catalog-query-language-experiments`
- `lawchai-labs/catalog-ranking-eval-harness`
- `lawchai-labs/catalog-source-policy-checker`
- `lawchai-labs/catalog-freshness-monitor`
- `lawchai-labs/catalog-schema-migration-lab`
- `lawchai-labs/catalog-observability-lab`
- `lawchai-labs/catalog-import-export-lab`
- `lawchai-labs/catalog-accessibility-performance-lab`

## Writer topology inside each canonical brand repository

Do not rely on mini repos for all concurrency. Decompose each canonical brand repo so writers can own non-overlapping directories:

```
src/
  contracts/
  features/
    discovery/
    search/
    filters/
    saved/
    alerts/
    entities/
    source-status/
    detail-page/
    compare/
  adapters/
  platform/
    persistence/
    telemetry/
    routing/
  ui/
    primitives/
    tokens/
  pages/
  tests/
```

Brand-specific directories then fan out further, e.g. venture `eligibility/`, `deadlines/`, `value/`; events `calendar/`, `geo/`, `organizers/`; careers `compensation/`, `roles/`, `applications/`.

## Writer rules

- one writer per overlapping mutable scope;
- one integration writer per canonical brand;
- lab repos may run many independent writers because they are non-authoritative;
- a lab repo graduates only through explicit contract + deterministic tests + immutable revision;
- copied mutable production state is prohibited;
- source adapters must preserve attribution, authorization and freshness boundaries;
- ranking semantics stay brand-specific;
- auth, secrets, billing, migrations and production deployment remain singular authorities;
- final composition is serialized;
- source-specific adapter repos are allowed only when the access/attribution contract for that source is explicit; repository separation must not be used to normalize unauthorized scraping.

## Creation policy

Create the three canonical brand repositories first. Lab repositories are a concurrency pool and may be created in waves. Shared authoritative repositories are extracted only after the two-consumer rule is met.

For Windows environments where PowerShell 7 is not installed, invoke creation scripts with Windows PowerShell (`powershell.exe`) or execute the `.ps1` directly from the current Windows PowerShell session. `pwsh.exe` is the PowerShell 6+ binary and must not be assumed present.

## Capacity

The expanded topology exposes:
- 3 canonical brand integration repos;
- up to 5 shared authoritative packages once extraction criteria are met;
- 45 wave-1 brand labs;
- 30 wave-2 brand labs;
- 8 cross-brand mechanism labs;
- many additional non-overlapping writer lanes inside each canonical repo.

That is up to 83 lab repositories plus canonical in-repo scopes. This is a capacity ceiling, not a target for permanently active repositories. Prefer activating only enough labs to keep useful independent work occupied without creating integration debt.
