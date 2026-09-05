import test from 'node:test';
import assert from 'node:assert/strict';
import {
  evaluateNonZeroEvidence,
  parseRunnerOutput,
  createNonZeroEvidence,
} from '../scripts/nonzero-evidence-guard.mjs';

const headSha = 'abcdef0123456789abcdef0123456789abcdef01';
const environment = 'github-ubuntu-node22';

test('evaluateNonZeroEvidence accepts valid non-zero PASS evidence for exact revision and environment', () => {
  const checks = [];
  const blockers = [];
  const evidence = {
    status: 'PASS',
    head_sha: headSha,
    environment,
    executed_nonzero: true,
    test_count: 12,
  };

  const res = evaluateNonZeroEvidence({
    evidence,
    name: 'tests',
    required: true,
    headSha,
    environment,
    checks,
    blockers,
    requireNonzero: true,
  });

  assert.equal(res.valid, true);
  assert.equal(res.executed_nonzero, true);
  assert.equal(res.status, 'pass');
  assert.equal(res.test_count, 12);
  assert.equal(blockers.length, 0);
  assert.ok(checks.some((c) => c.name === 'tests' && c.status === 'pass'));
});

test('evaluateNonZeroEvidence rejects false-PASS with zero test count', () => {
  const checks = [];
  const blockers = [];
  const evidence = {
    status: 'PASS',
    head_sha: headSha,
    environment,
    executed_nonzero: true,
    test_count: 0,
  };

  const res = evaluateNonZeroEvidence({
    evidence,
    name: 'tests',
    required: true,
    headSha,
    environment,
    checks,
    blockers,
    requireNonzero: true,
  });

  assert.equal(res.valid, false);
  assert.equal(res.executed_nonzero, false);
  assert.equal(res.status, 'fail');
  assert.ok(blockers.includes('tests lacks non-zero execution evidence'));
  assert.ok(checks.some((c) => c.name === 'tests' && c.status === 'fail'));
});

test('evaluateNonZeroEvidence rejects false-PASS with non-integer or missing test_count', () => {
  for (const count of [null, undefined, '12', -5, 3.14]) {
    const checks = [];
    const blockers = [];
    const evidence = {
      status: 'PASS',
      head_sha: headSha,
      environment,
      executed_nonzero: true,
      test_count: count,
    };

    const res = evaluateNonZeroEvidence({
      evidence,
      name: 'tests',
      required: true,
      headSha,
      environment,
      checks,
      blockers,
      requireNonzero: true,
    });

    assert.equal(res.valid, false);
    assert.equal(res.executed_nonzero, false);
    assert.ok(blockers.includes('tests lacks non-zero execution evidence'));
  }
});

test('evaluateNonZeroEvidence rejects false-PASS when executed_nonzero is false', () => {
  const checks = [];
  const blockers = [];
  const evidence = {
    status: 'PASS',
    head_sha: headSha,
    environment,
    executed_nonzero: false,
    test_count: 10,
  };

  const res = evaluateNonZeroEvidence({
    evidence,
    name: 'tests',
    required: true,
    headSha,
    environment,
    checks,
    blockers,
    requireNonzero: true,
  });

  assert.equal(res.valid, false);
  assert.equal(res.executed_nonzero, false);
  assert.ok(blockers.includes('tests lacks non-zero execution evidence'));
});

test('evaluateNonZeroEvidence rejects head SHA mismatch', () => {
  const checks = [];
  const blockers = [];
  const evidence = {
    status: 'PASS',
    head_sha: '0000000000000000000000000000000000000000',
    environment,
    executed_nonzero: true,
    test_count: 10,
  };

  const res = evaluateNonZeroEvidence({
    evidence,
    name: 'tests',
    required: true,
    headSha,
    environment,
    checks,
    blockers,
    requireNonzero: true,
  });

  assert.equal(res.valid, false);
  assert.equal(res.executed_nonzero, false);
  assert.ok(blockers.includes('tests evidence revision mismatch'));
});

test('evaluateNonZeroEvidence rejects environment mismatch', () => {
  const checks = [];
  const blockers = [];
  const evidence = {
    status: 'PASS',
    head_sha: headSha,
    environment: 'different-environment',
    executed_nonzero: true,
    test_count: 10,
  };

  const res = evaluateNonZeroEvidence({
    evidence,
    name: 'tests',
    required: true,
    headSha,
    environment,
    checks,
    blockers,
    requireNonzero: true,
  });

  assert.equal(res.valid, false);
  assert.equal(res.executed_nonzero, false);
  assert.ok(blockers.includes('tests evidence environment mismatch'));
});

test('evaluateNonZeroEvidence rejects status SKIPPED or FAIL', () => {
  for (const status of ['SKIPPED', 'FAIL', 'UNKNOWN', 'NO_TESTS']) {
    const checks = [];
    const blockers = [];
    const evidence = {
      status,
      head_sha: headSha,
      environment,
      executed_nonzero: true,
      test_count: 10,
    };

    const res = evaluateNonZeroEvidence({
      evidence,
      name: 'tests',
      required: true,
      headSha,
      environment,
      checks,
      blockers,
      requireNonzero: true,
    });

    assert.equal(res.valid, false);
    assert.equal(res.executed_nonzero, false);
    assert.ok(blockers.includes('tests did not pass'));
  }
});

test('parseRunnerOutput correctly parses Node.js TAP summary with non-zero pass', () => {
  const tapOutput = `TAP version 13
# Subtest: example test
ok 1 - example test
# tests 35
# pass 35
# fail 0
# cancelled 0
# skipped 0
# todo 0
# duration_ms 120.5`;

  const parsed = parseRunnerOutput(tapOutput);
  assert.equal(parsed.status, 'PASS');
  assert.equal(parsed.executed_nonzero, true);
  assert.equal(parsed.test_count, 35);
  assert.equal(parsed.passed_count, 35);
  assert.equal(parsed.failed_count, 0);
});

test('parseRunnerOutput rejects TAP output with 0 passed tests', () => {
  const tapOutput = `TAP version 13
# tests 0
# pass 0
# fail 0`;

  const parsed = parseRunnerOutput(tapOutput);
  assert.equal(parsed.status, 'NO_TESTS');
  assert.equal(parsed.executed_nonzero, false);
  assert.equal(parsed.test_count, 0);
});

test('parseRunnerOutput correctly parses JSON test reports', () => {
  const jsonReport = JSON.stringify({
    numPassedTests: 8,
    numFailedTests: 0,
    numTotalTests: 8,
  });

  const parsed = parseRunnerOutput(jsonReport);
  assert.equal(parsed.status, 'PASS');
  assert.equal(parsed.executed_nonzero, true);
  assert.equal(parsed.test_count, 8);
});

test('parseRunnerOutput rejects JSON test reports with zero passed tests', () => {
  const jsonReport = JSON.stringify({
    numPassedTests: 0,
    numFailedTests: 0,
    numTotalTests: 0,
  });

  const parsed = parseRunnerOutput(jsonReport);
  assert.equal(parsed.status, 'NO_TESTS');
  assert.equal(parsed.executed_nonzero, false);
  assert.equal(parsed.test_count, 0);
});

test('parseRunnerOutput correctly parses Jest/Vitest console text output', () => {
  const jestOutput = 'Tests: 15 passed, 15 total\nSnapshots: 0 total\nTime: 1.23s';

  const parsed = parseRunnerOutput(jestOutput);
  assert.equal(parsed.status, 'PASS');
  assert.equal(parsed.executed_nonzero, true);
  assert.equal(parsed.test_count, 15);
});

test('createNonZeroEvidence constructs valid evidence object', () => {
  const tapOutput = '# pass 42\n# fail 0';
  const evidence = createNonZeroEvidence({
    headSha,
    environment,
    runnerOutput: tapOutput,
    checkName: 'tests',
  });

  assert.equal(typeof evidence.tests, 'object');
  assert.equal(evidence.tests.status, 'PASS');
  assert.equal(evidence.tests.head_sha, headSha);
  assert.equal(evidence.tests.environment, environment);
  assert.equal(evidence.tests.executed_nonzero, true);
  assert.equal(evidence.tests.test_count, 42);
});
