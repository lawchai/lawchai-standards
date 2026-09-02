import test from 'node:test';
import assert from 'node:assert/strict';
import { runVerificationFactory } from '../.github/actions/verification-factory/verification-factory.mjs';

const base = '1111111111111111111111111111111111111111';
const head = '2222222222222222222222222222222222222222';
const environment = 'github-hosted-ubuntu-node22';

function passingEvidence() {
  return {
    environment,
    tests: { status: 'PASS', head_sha: head, environment, executed_nonzero: true, test_count: 4 },
  };
}

test('verification receipt requires explicit exact-head execution evidence', () => {
  const receipt = runVerificationFactory({
    repository: 'lawchai/lawchai-standards',
    base_sha: base,
    head_sha: head,
    environment,
    verification_evidence: passingEvidence(),
  });

  assert.equal(receipt.schema_version, 2);
  assert.equal(receipt.repository, 'lawchai/lawchai-standards');
  assert.equal(receipt.head_sha, head);
  assert.equal(receipt.executed_nonzero, true);
  assert.ok(receipt.checks.some((check) => check.name === 'tracked_test_inventory' && check.status === 'info'));
});

test('test-file presence alone never becomes executed_nonzero or READY_PR', () => {
  const receipt = runVerificationFactory({
    repository: 'lawchai/lawchai-standards',
    base_sha: base,
    head_sha: head,
    environment,
    verification_evidence: {},
  });

  assert.equal(receipt.executed_nonzero, false);
  assert.equal(receipt.terminal_state, 'BLOCKED');
  assert.ok(receipt.checks.some((check) => check.name === 'tests' && check.status === 'not_run'));
});

test('mismatched or zero-count test evidence fails closed', () => {
  const receipt = runVerificationFactory({
    repository: 'lawchai/lawchai-standards',
    base_sha: base,
    head_sha: head,
    environment,
    verification_evidence: {
      environment,
      tests: { status: 'PASS', head_sha: base, environment, executed_nonzero: true, test_count: 0 },
    },
  });

  assert.equal(receipt.executed_nonzero, false);
  assert.equal(receipt.terminal_state, 'BLOCKED');
});

test('browser accessibility is never inferred PASS', () => {
  const receipt = runVerificationFactory({
    repository: 'lawchai/lawchai-standards',
    base_sha: base,
    head_sha: head,
    environment,
    verification_evidence: passingEvidence(),
    browser_required: false,
  });
  const check = receipt.checks.find((item) => item.name === 'browser_accessibility');
  assert.equal(check.status, 'not_run');
});
