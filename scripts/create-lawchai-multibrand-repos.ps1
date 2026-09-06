[CmdletBinding()]
param(
    [ValidateSet('Core','Wave1','Full')]
    [string]$Scale = 'Full',

    [switch]$IncludeSharedCandidates,
    [switch]$DryRun
)

Set-StrictMode -Version 2.0
$ErrorActionPreference = 'Stop'

function Assert-Command {
    param([Parameter(Mandatory=$true)][string]$Name)
    if (-not (Get-Command $Name -ErrorAction SilentlyContinue)) {
        throw "Required command '$Name' was not found in PATH. Install GitHub CLI first: https://cli.github.com/"
    }
}

function Invoke-Gh {
    param([Parameter(Mandatory=$true)][string[]]$Arguments)
    & gh @Arguments
    if ($LASTEXITCODE -ne 0) {
        throw "gh command failed (exit $LASTEXITCODE): gh $($Arguments -join ' ')"
    }
}

function Test-RepoExists {
    param([Parameter(Mandatory=$true)][string]$FullName)
    & gh repo view $FullName --json nameWithOwner --jq '.nameWithOwner' 1>$null 2>$null
    return ($LASTEXITCODE -eq 0)
}

function Add-RepoTarget {
    param(
        [Parameter(Mandatory=$true)][System.Collections.ArrayList]$List,
        [Parameter(Mandatory=$true)][string]$Owner,
        [Parameter(Mandatory=$true)][string]$Name,
        [Parameter(Mandatory=$true)][string]$Description,
        [Parameter(Mandatory=$true)][string]$Kind
    )
    [void]$List.Add([pscustomobject]@{
        Owner = $Owner
        Name = $Name
        FullName = "$Owner/$Name"
        Description = $Description
        Kind = $Kind
    })
}

Assert-Command -Name 'gh'

Write-Host "Checking GitHub CLI authentication..."
& gh auth status
if ($LASTEXITCODE -ne 0) {
    throw 'GitHub CLI is not authenticated. Run: gh auth login'
}

# Fail before creating anything if either namespace is inaccessible.
Write-Host "Checking repository namespaces..."
& gh api users/lawchai 1>$null 2>$null
if ($LASTEXITCODE -ne 0) {
    throw "Cannot access GitHub owner 'lawchai'."
}
& gh api orgs/lawchai-labs 1>$null 2>$null
if ($LASTEXITCODE -ne 0) {
    throw "Cannot access GitHub organization 'lawchai-labs'."
}

$targets = New-Object System.Collections.ArrayList

# Canonical brands: always included.
Add-RepoTarget $targets 'lawchai' 'venture-opportunities' 'Canonical startup funding, grants, accelerators, programs and competitions product.' 'canonical'
Add-RepoTarget $targets 'lawchai' 'event-network' 'Canonical startup events, networking, conferences, meetups, workshops and demo-days product.' 'canonical'
Add-RepoTarget $targets 'lawchai' 'startup-careers' 'Canonical startup jobs, companies, compensation, equity and application-freshness product.' 'canonical'

# Shared packages are candidates only until the two-real-consumer extraction rule is met.
if ($IncludeSharedCandidates) {
    Add-RepoTarget $targets 'lawchai' 'catalog-platform-core' 'Shared brand-neutral catalog primitives; extract only after two real consumers.' 'shared-candidate'
    Add-RepoTarget $targets 'lawchai' 'source-adapter-contracts' 'Shared source adapter contracts, fixtures, attribution and capability declarations.' 'shared-candidate'
    Add-RepoTarget $targets 'lawchai' 'entity-link-core' 'Conservative cross-source entity linking and canonicalization primitives.' 'shared-candidate'
    Add-RepoTarget $targets 'lawchai' 'geo-time-core' 'Shared timezone, date, location and geography normalization primitives.' 'shared-candidate'
    Add-RepoTarget $targets 'lawchai' 'catalog-receipts' 'Shared ingestion, freshness, update and provenance receipt primitives.' 'shared-candidate'
}

if ($Scale -eq 'Wave1' -or $Scale -eq 'Full') {
    $wave1 = @(
        'venture-source-adapters','venture-grants-ingestion','venture-accelerator-ingestion','venture-competition-ingestion','venture-eligibility-engine','venture-deadline-engine','venture-value-equity-normalizer','venture-opportunity-dedupe','venture-search-ranking','venture-saved-searches','venture-alerts','venture-application-workspace','venture-source-admin','venture-onboarding-experiments','venture-homepage-experiments',
        'event-source-adapters','event-calendar-ingestion','event-canonicalizer','event-date-time-engine','event-geo-discovery','event-category-taxonomy','event-search-ranking','event-networking-intent','event-rsvp-deeplink','event-saved-searches','event-alerts','event-organizer-import','event-source-admin','event-homepage-experiments','event-map-experiments',
        'careers-source-adapters','careers-job-normalizer','careers-job-dedupe','careers-role-taxonomy','careers-compensation-normalizer','careers-equity-normalizer','careers-company-stage-enrichment','careers-location-remote','careers-search-ranking','careers-saved-searches','careers-alerts','careers-application-tracker','careers-company-pages','careers-source-admin','careers-homepage-experiments'
    )
    foreach ($name in $wave1) {
        Add-RepoTarget $targets 'lawchai-labs' $name 'NON_AUTHORITATIVE_EXPERIMENT — bounded multibrand catalog writer lane.' 'lab-wave1'
    }
}

if ($Scale -eq 'Full') {
    $wave2 = @(
        'venture-investor-program-ingestion','venture-startup-credit-ingestion','venture-fellowship-incubator-ingestion','venture-stage-sector-taxonomy','venture-geography-jurisdiction','venture-requirement-extractor','venture-fit-explanation','venture-deadline-calendar','venture-change-detection','venture-data-quality-audits',
        'event-series-recurrence','event-speaker-session-ingestion','event-ticket-pricing','event-venue-travel','event-calendar-sync','event-agenda-planner','event-change-detection','event-data-quality-audits','event-structured-data-seo','event-notification-digest',
        'careers-job-freshness','careers-job-expiry','careers-skills-taxonomy','careers-company-funding-enrichment','careers-visa-work-auth','careers-salary-benchmark','careers-equity-estimator','careers-change-detection','careers-data-quality-audits','careers-notification-digest'
    )
    foreach ($name in $wave2) {
        Add-RepoTarget $targets 'lawchai-labs' $name 'NON_AUTHORITATIVE_EXPERIMENT — second-wave independent writer lane.' 'lab-wave2'
    }

    $crossBrand = @(
        'catalog-query-language-experiments','catalog-ranking-eval-harness','catalog-source-policy-checker','catalog-freshness-monitor','catalog-schema-migration-lab','catalog-observability-lab','catalog-import-export-lab','catalog-accessibility-performance-lab'
    )
    foreach ($name in $crossBrand) {
        Add-RepoTarget $targets 'lawchai-labs' $name 'NON_AUTHORITATIVE_EXPERIMENT — cross-brand mechanism lab; promote only after two real consumers.' 'lab-cross-brand'
    }
}

Write-Host ""
Write-Host "Target scale: $Scale"
Write-Host "Target repositories: $($targets.Count)"
if ($IncludeSharedCandidates) { Write-Host 'Shared candidates: INCLUDED' } else { Write-Host 'Shared candidates: SKIPPED (recommended until two-consumer rule is met)' }
if ($DryRun) { Write-Host 'Mode: DRY RUN' } else { Write-Host 'Mode: CREATE/SKIP + VERIFY' }
Write-Host ""

$created = 0
$skipped = 0

foreach ($target in $targets) {
    if (Test-RepoExists -FullName $target.FullName) {
        Write-Host "SKIP   $($target.FullName)"
        $skipped++
        continue
    }

    if ($DryRun) {
        Write-Host "WOULD  $($target.FullName) [$($target.Kind)]"
        continue
    }

    Write-Host "CREATE $($target.FullName) [$($target.Kind)]"
    Invoke-Gh -Arguments @('repo','create',$target.FullName,'--private','--add-readme','--description',$target.Description,'--disable-wiki')
    $created++
}

if ($DryRun) {
    Write-Host ""
    Write-Host "Dry run complete. No repositories were created."
    exit 0
}

Write-Host ""
Write-Host 'Verifying all targets...'
$missing = New-Object System.Collections.ArrayList
foreach ($target in $targets) {
    if (-not (Test-RepoExists -FullName $target.FullName)) {
        [void]$missing.Add($target.FullName)
    }
}

if ($missing.Count -gt 0) {
    Write-Host "Verification failed. Missing repositories:" -ForegroundColor Red
    foreach ($name in $missing) { Write-Host "  - $name" -ForegroundColor Red }
    throw "$($missing.Count) target repositories are missing after creation."
}

Write-Host ""
Write-Host "SUCCESS: verified $($targets.Count) repositories. Created=$created SkippedExisting=$skipped"
Write-Host 'No secrets, billing, deployments, migrations, production auth, or existing repository visibility were modified.'
