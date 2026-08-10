import assert from 'node:assert/strict';
import test from 'node:test';
import { verifyDeployment } from '../.github/actions/verify-deploy/verify-deploy-core.mjs';

const SHA = '0123456789abcdef0123456789abcdef01234567';
const OTHER_SHA = '89abcdef0123456789abcdef0123456789abcdef';
const BUILT_AT = '2026-08-09T02:00:00Z';

function response(body, status = 200, headers = {}) {
  return new Response(body, { status, headers: { 'content-type': 'application/json', ...headers } });
}

function jsonVersion(sha = SHA, builtAt = BUILT_AT) {
  return response(JSON.stringify({ sha, built_at: builtAt }));
}

const base = {
  versionUrl: 'https://example.test/version',
  expectedSha: SHA,
  attempts: 3,
  delaySeconds: 0,
  timeoutSeconds: 1,
};

const noSleep = async () => {};

test('passes only when the live identity exactly matches the expected commit', async () => {
  const receipt = await verifyDeployment(base, { fetchImpl: async () => jsonVersion(), sleep: noSleep });
  assert.equal(receipt.status, 'pass');
  assert.equal(receipt.terminal_state, 'verified');
  assert.equal(receipt.observed_sha, SHA);
  assert.equal(receipt.built_at, BUILT_AT);
  assert.equal(receipt.attempts_used, 1);
});

test('retries propagation mismatch and passes if a later attempt matches', async () => {
  let calls = 0;
  const receipt = await verifyDeployment(base, {
    fetchImpl: async () => (++calls === 1 ? jsonVersion(OTHER_SHA) : jsonVersion()),
    sleep: noSleep,
  });
  assert.equal(receipt.status, 'pass');
  assert.equal(receipt.attempts_used, 2);
  assert.equal(calls, 2);
});

test('returns mismatch after the retry window when a valid live SHA remains different', async () => {
  let calls = 0;
  const receipt = await verifyDeployment(base, {
    fetchImpl: async () => {
      calls += 1;
      return jsonVersion(OTHER_SHA);
    },
    sleep: noSleep,
  });
  assert.equal(receipt.status, 'mismatch');
  assert.equal(receipt.terminal_state, 'mismatch');
  assert.equal(receipt.observed_sha, OTHER_SHA);
  assert.equal(receipt.attempts_used, 3);
  assert.equal(calls, 3);
});

test('network failure remains unknown and never becomes a negative fact or pass', async () => {
  const receipt = await verifyDeployment(base, {
    fetchImpl: async () => { throw new TypeError('network down'); },
    sleep: noSleep,
  });
  assert.equal(receipt.status, 'unknown');
  assert.equal(receipt.terminal_state, 'unreachable');
  assert.equal(receipt.observed_sha, null);
  assert.equal(receipt.attempts_used, 3);
});

test('invalid JSON remains unknown', async () => {
  const receipt = await verifyDeployment(base, {
    fetchImpl: async () => response('not json'),
    sleep: noSleep,
  });
  assert.equal(receipt.status, 'unknown');
  assert.equal(receipt.terminal_state, 'invalid_response');
});

test('missing or invalid built_at remains unknown', async () => {
  const receipt = await verifyDeployment(base, {
    fetchImpl: async () => response(JSON.stringify({ sha: SHA })),
    sleep: noSleep,
  });
  assert.equal(receipt.status, 'unknown');
  assert.equal(receipt.terminal_state, 'invalid_response');
});

test('HTTP errors remain unknown', async () => {
  const receipt = await verifyDeployment(base, {
    fetchImpl: async () => response('{}', 503),
    sleep: noSleep,
  });
  assert.equal(receipt.status, 'unknown');
  assert.equal(receipt.terminal_state, 'http_error');
});

test('configuration rejects non-HTTPS version URLs', async () => {
  const receipt = await verifyDeployment({ ...base, versionUrl: 'http://example.test/version' }, {
    fetchImpl: async () => { throw new Error('must not fetch'); },
    sleep: noSleep,
  });
  assert.equal(receipt.status, 'unknown');
  assert.equal(receipt.terminal_state, 'config_error');
  assert.equal(receipt.attempts_used, 0);
});

test('configuration rejects abbreviated commit identifiers', async () => {
  const receipt = await verifyDeployment({ ...base, expectedSha: SHA.slice(0, 12) }, {
    fetchImpl: async () => { throw new Error('must not fetch'); },
    sleep: noSleep,
  });
  assert.equal(receipt.status, 'unknown');
  assert.equal(receipt.terminal_state, 'config_error');
  assert.equal(receipt.attempts_used, 0);
});

test('oversized version documents remain unknown and raw content is not retained', async () => {
  const huge = JSON.stringify({ sha: SHA, built_at: BUILT_AT, padding: 'x'.repeat(70 * 1024) });
  const receipt = await verifyDeployment(base, {
    fetchImpl: async () => response(huge),
    sleep: noSleep,
  });
  assert.equal(receipt.status, 'unknown');
  assert.equal(receipt.terminal_state, 'invalid_response');
  assert.equal('raw_body' in receipt, false);
});

test('streaming response exceeding max bytes aborts early and fails closed', async () => {
  const receipt = await verifyDeployment(base, {
    fetchImpl: async () => {
      const stream = new ReadableStream({
        start(controller) {
          controller.enqueue(new Uint8Array(40 * 1024)); // 40 KiB
          controller.enqueue(new Uint8Array(30 * 1024)); // 30 KiB - total 70 KiB
          controller.close();
        }
      });
      return new Response(stream, { status: 200, headers: { 'content-type': 'application/json' } });
    },
    sleep: noSleep,
  });
  assert.equal(receipt.status, 'unknown');
  assert.equal(receipt.terminal_state, 'invalid_response');
  assert.match(receipt.reason, /exceeded maximum allowed size/);
});

test('configuration rejects invalid absolute URLs', async () => {
  const receipt = await verifyDeployment({ ...base, versionUrl: 'not-a-url' }, {
    fetchImpl: async () => { throw new Error('must not fetch'); },
    sleep: noSleep,
  });
  assert.equal(receipt.status, 'unknown');
  assert.equal(receipt.terminal_state, 'config_error');
  assert.match(receipt.reason, /valid absolute URL/);
});

test('configuration rejects credentials in URLs', async () => {
  for (const invalidUrl of [
    'https://user:pass@example.test/version',
    'https://user@example.test/version',
  ]) {
    const receipt = await verifyDeployment({ ...base, versionUrl: invalidUrl }, {
      fetchImpl: async () => { throw new Error('must not fetch'); },
      sleep: noSleep,
    });
    assert.equal(receipt.status, 'unknown');
    assert.equal(receipt.terminal_state, 'config_error');
    assert.match(receipt.reason, /credentials/);
  }
});

test('non-object JSON payloads remain unknown', async () => {
  for (const invalidPayload of ['null', '[]', '"string"', '123']) {
    const receipt = await verifyDeployment(base, {
      fetchImpl: async () => response(invalidPayload),
      sleep: noSleep,
    });
    assert.equal(receipt.status, 'unknown');
    assert.equal(receipt.terminal_state, 'invalid_response');
    assert.match(receipt.reason, /JSON object/);
  }
});
