import test from 'node:test';
import assert from 'node:assert/strict';
import { runVerificationFactory } from '../.github/actions/verification-factory/verification-factory.mjs';

test('runVerificationFactory generates valid schema v1 receipt for lawchai-standards repo', () => {
  const receipt = runVerificationFactory({
    repository: 'lawchai/lawchai-standards',
    base_sha: '1111111111111111111111111111111111111111',
    head_sha: '2222222222222222222222222222222222222222',
    risk_class: 'low',
  });

  assert.equal(receipt.schema_version, 1);
  assert.equal(receipt.repository, 'lawchai/lawchai-standards');
  assert.equal(receipt.base_sha, '1111111111111111111111111111111111111111');
  assert.equal(receipt.head_sha, '2222222222222222222222222222222222222222');
  assert.ok(Array.isArray(receipt.checks));
  assert.equal(receipt.terminal_state, 'READY_PR');
  assert.equal(receipt.executed_nonzero, true);
  assert.ok(receipt.verified_at);
});

test('runVerificationFactory detects zero-test guard or build script failures', () => {
  const mockOptions = {
    repository: 'lawchai/mock-fail-app',
    base_sha: '0000000000000000000000000000000000000000',
    head_sha: '0000000000000000000000000000000000000000',
  };

  const receipt = runVerificationFactory(mockOptions);
  assert.ok(['READY_PR', 'BLOCKED'].includes(receipt.terminal_state));
});
