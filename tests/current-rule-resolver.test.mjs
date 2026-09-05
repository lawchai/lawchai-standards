import test from 'node:test';
import assert from 'node:assert/strict';
import {
  loadRuleRegistry,
  validateRuleIndex,
  getCanonicalRules,
  getRuleById,
  detectStalePolicy,
} from '../scripts/resolve-rules.mjs';

test('loadRuleRegistry loads and validates canonical rules data', () => {
  const registry = loadRuleRegistry();
  assert.equal(typeof registry, 'object');
  assert.equal(registry.schema_version, 1);
  assert.ok(Array.isArray(registry.rules));
  assert.ok(registry.rules.length >= 7);
});

test('getCanonicalRules enforces current-view preference by excluding superseded and historical rules by default', () => {
  const rules = getCanonicalRules();
  assert.ok(rules.length > 0);
  for (const rule of rules) {
    assert.equal(rule.status, 'canonical', `Rule ${rule.id} should be canonical`);
    assert.equal(rule.superseded_by, null);
  }

  const allRuleIds = rules.map((r) => r.id);
  assert.ok(allRuleIds.includes('rule-workflow-sha-pinning'));
  assert.ok(allRuleIds.includes('rule-per-pr-scope-declaration'));
  assert.ok(!allRuleIds.includes('rule-mutable-branch-workflow-references'));
  assert.ok(!allRuleIds.includes('rule-portfolio-ui-audit-20260806'));
});

test('getCanonicalRules filter options and sorting preference', () => {
  const ciRules = getCanonicalRules({ tag: 'ci' });
  assert.ok(ciRules.length >= 2);
  for (const r of ciRules) {
    assert.equal(r.status, 'canonical');
  }

  // When explicitly including superseded entries in a query, canonical entries are ranked first
  const queryResult = getCanonicalRules({ query: 'scope', includeSuperseded: true, includeHistorical: true });
  assert.ok(queryResult.length >= 2);
  const statuses = queryResult.map((r) => r.status);
  assert.equal(statuses[0], 'canonical', 'First returned match must be canonical');
});

test('getRuleById resolves full supersession lineage and provenance', () => {
  const rule = getRuleById('rule-workflow-sha-pinning');
  assert.ok(rule);
  assert.equal(rule.id, 'rule-workflow-sha-pinning');
  assert.equal(rule.status, 'canonical');
  assert.ok(rule.provenance.origin_document);
  assert.ok(Array.isArray(rule.supersedes_rules));
  assert.equal(rule.supersedes_rules[0].id, 'rule-mutable-branch-workflow-references');

  const supersededRule = getRuleById('rule-mutable-branch-workflow-references');
  assert.ok(supersededRule);
  assert.equal(supersededRule.status, 'superseded');
  assert.equal(supersededRule.superseded_by_rule.id, 'rule-workflow-sha-pinning');
});

test('detectStalePolicy catches deprecated patterns and flags superseded policy misuse', () => {
  const badSampleText = `
    steps:
      - uses: lawchai/lawchai-standards/.github/workflows/ci-react-ts.yml@main
        with:
          note: inherited scope metadata from previous PR
  `;

  const findings = detectStalePolicy(badSampleText);
  assert.ok(findings.length >= 2);
  assert.ok(findings.some((f) => f.patternMatched.includes('@main')));
  assert.ok(findings.some((f) => f.patternMatched.includes('inherited scope metadata')));

  for (const f of findings) {
    assert.equal(f.severity, 'error');
    assert.ok(f.canonicalRuleId);
  }
});

test('detectStalePolicy passes clean canonical policy text', () => {
  const cleanSampleText = `
    jobs:
      ci:
        uses: lawchai/lawchai-standards/.github/workflows/ci-react-ts.yml@0123456789abcdef0123456789abcdef01234567
  `;

  const findings = detectStalePolicy(cleanSampleText);
  assert.equal(findings.length, 0, 'Clean canonical guidance should produce zero stale findings');
});

test('validateRuleIndex rejects malformed rule data and cyclic references', () => {
  assert.throws(() => validateRuleIndex(null), /non-null object/);
  assert.throws(() => validateRuleIndex({ schema_version: 1 }), /"rules" array/);

  const duplicateRuleData = {
    schema_version: 1,
    rules: [
      {
        id: 'dup-rule',
        title: 'Dup 1',
        status: 'canonical',
        version: '1.0',
        source_file: 'README.md',
        summary: 'Summary 1',
        provenance: { origin_document: 'README.md', rationale: 'R1' },
        tags: ['test']
      },
      {
        id: 'dup-rule',
        title: 'Dup 2',
        status: 'canonical',
        version: '1.0',
        source_file: 'README.md',
        summary: 'Summary 2',
        provenance: { origin_document: 'README.md', rationale: 'R2' },
        tags: ['test']
      }
    ]
  };
  assert.throws(() => validateRuleIndex(duplicateRuleData), /Duplicate rule id/);

  const selfRefData = {
    schema_version: 1,
    rules: [
      {
        id: 'self-ref',
        title: 'Self Ref',
        status: 'superseded',
        version: '1.0',
        source_file: 'README.md',
        summary: 'Summary',
        superseded_by: 'self-ref',
        provenance: { origin_document: 'README.md', rationale: 'R' },
        tags: ['test']
      }
    ]
  };
  assert.throws(() => validateRuleIndex(selfRefData), /cannot be superseded_by itself/);
});

test('preserves historical evidence records without treating them as active rules', () => {
  const historicalRule = getRuleById('rule-portfolio-ui-audit-20260806');
  assert.ok(historicalRule);
  assert.equal(historicalRule.status, 'historical_evidence');
  assert.equal(historicalRule.source_file, 'PORTFOLIO_UI_AUDIT_2026-08-06.md');

  const defaultRules = getCanonicalRules();
  assert.ok(!defaultRules.some((r) => r.id === 'rule-portfolio-ui-audit-20260806'));
});
