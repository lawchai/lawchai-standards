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

## venture-opportunities lab repositories

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

## event-network lab repositories

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

## startup-careers lab repositories

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

## writer topology inside each canonical brand repository

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
- final composition is serialized.

## Capacity

This topology exposes:
- 3 canonical brand integration repos;
- 5 potential shared authoritative packages;
- 45 bounded lab repos;
- many more writer lanes inside each canonical repo.

The lab count is an upper-bound concurrency pool, not a requirement to keep every repository permanently active.
