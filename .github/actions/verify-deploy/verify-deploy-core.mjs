const DEFAULT_MAX_RESPONSE_BYTES = 64 * 1024;

function positiveInteger(value, fallback, min, max) {
  const number = Number(value ?? fallback);
  if (!Number.isInteger(number) || number < min || number > max) {
    return null;
  }
  return number;
}

function safeString(value, maxLength = 512) {
  if (typeof value !== 'string') return null;
  const trimmed = value.trim();
  if (!trimmed || trimmed.length > maxLength) return null;
  return trimmed;
}

function normalizeConfig(input) {
  const expectedSha = safeString(input.expectedSha, 128);
  const versionUrl = safeString(input.versionUrl, 2048);
  const attempts = positiveInteger(input.attempts, 5, 1, 20);
  const delaySeconds = positiveInteger(input.delaySeconds, 3, 0, 60);
  const timeoutSeconds = positiveInteger(input.timeoutSeconds, 10, 1, 60);

  if (!expectedSha || !/^[0-9a-fA-F]{7,128}$/.test(expectedSha)) {
    return { error: 'expected_sha must be a non-empty hexadecimal commit identifier' };
  }

  let parsedUrl;
  try {
    parsedUrl = new URL(versionUrl);
  } catch {
    return { error: 'version_url must be a valid absolute URL' };
  }
  if (parsedUrl.protocol !== 'https:') {
    return { error: 'version_url must use https' };
  }

  if (attempts === null) return { error: 'attempts must be an integer from 1 to 20' };
  if (delaySeconds === null) return { error: 'delay_seconds must be an integer from 0 to 60' };
  if (timeoutSeconds === null) return { error: 'timeout_seconds must be an integer from 1 to 60' };

  return {
    value: {
      versionUrl: parsedUrl.toString(),
      expectedSha,
      attempts,
      delayMs: delaySeconds * 1000,
      timeoutMs: timeoutSeconds * 1000,
    },
  };
}

function makeReceipt(base, attempt, status, terminalState, fields = {}) {
  return {
    schema_version: 1,
    status,
    terminal_state: terminalState,
    version_url: base.versionUrl ?? null,
    expected_sha: base.expectedSha ?? null,
    observed_sha: fields.observedSha ?? null,
    built_at: fields.builtAt ?? null,
    attempts_used: attempt,
    max_attempts: base.attempts ?? null,
    checked_at: new Date().toISOString(),
    reason: fields.reason ?? null,
  };
}

async function readBoundedText(response, maxBytes = DEFAULT_MAX_RESPONSE_BYTES) {
  const contentLength = response.headers?.get?.('content-length');
  if (contentLength && Number(contentLength) > maxBytes) {
    throw new Error('response exceeded maximum allowed size');
  }
  const text = await response.text();
  if (Buffer.byteLength(text, 'utf8') > maxBytes) {
    throw new Error('response exceeded maximum allowed size');
  }
  return text;
}

function parseVersionDocument(text) {
  let parsed;
  try {
    parsed = JSON.parse(text);
  } catch {
    return { error: 'version document was not valid JSON' };
  }

  const sha = safeString(parsed?.sha, 128);
  const builtAt = safeString(parsed?.built_at, 128);
  if (!sha || !/^[0-9a-fA-F]{7,128}$/.test(sha)) {
    return { error: 'version document did not contain a valid sha' };
  }
  if (!builtAt || Number.isNaN(Date.parse(builtAt))) {
    return { error: 'version document did not contain a valid built_at timestamp' };
  }

  return { value: { sha, builtAt } };
}

export async function verifyDeployment(input, dependencies = {}) {
  const fetchImpl = dependencies.fetchImpl ?? globalThis.fetch;
  const sleep = dependencies.sleep ?? ((ms) => new Promise((resolve) => setTimeout(resolve, ms)));

  const normalized = normalizeConfig(input);
  if (normalized.error) {
    return makeReceipt(
      {
        versionUrl: input.versionUrl ?? null,
        expectedSha: input.expectedSha ?? null,
        attempts: Number(input.attempts ?? 5) || 5,
      },
      0,
      'unknown',
      'config_error',
      { reason: normalized.error }
    );
  }

  const config = normalized.value;
  let lastReceipt = makeReceipt(config, 0, 'unknown', 'unreachable', {
    reason: 'verification did not execute',
  });

  for (let attempt = 1; attempt <= config.attempts; attempt += 1) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), config.timeoutMs);

    try {
      const response = await fetchImpl(config.versionUrl, {
        method: 'GET',
        headers: { accept: 'application/json' },
        redirect: 'error',
        signal: controller.signal,
      });

      if (!response.ok) {
        lastReceipt = makeReceipt(config, attempt, 'unknown', 'http_error', {
          reason: `version endpoint returned HTTP ${response.status}`,
        });
      } else {
        let text;
        try {
          text = await readBoundedText(response);
        } catch (error) {
          lastReceipt = makeReceipt(config, attempt, 'unknown', 'invalid_response', {
            reason: error instanceof Error ? error.message : 'version response could not be read',
          });
          text = null;
        }

        if (text !== null) {
          const parsed = parseVersionDocument(text);
          if (parsed.error) {
            lastReceipt = makeReceipt(config, attempt, 'unknown', 'invalid_response', {
              reason: parsed.error,
            });
          } else {
            const { sha, builtAt } = parsed.value;
            if (sha === config.expectedSha) {
              return makeReceipt(config, attempt, 'pass', 'verified', {
                observedSha: sha,
                builtAt,
                reason: 'live deployment identity matched expected commit',
              });
            }
            lastReceipt = makeReceipt(config, attempt, 'mismatch', 'mismatch', {
              observedSha: sha,
              builtAt,
              reason: 'live deployment identity did not match expected commit',
            });
          }
        }
      }
    } catch (error) {
      const timedOut = error?.name === 'AbortError';
      lastReceipt = makeReceipt(config, attempt, 'unknown', 'unreachable', {
        reason: timedOut
          ? `version endpoint did not respond within ${config.timeoutMs / 1000}s`
          : 'version endpoint could not be reached',
      });
    } finally {
      clearTimeout(timeout);
    }

    if (attempt < config.attempts && config.delayMs > 0) {
      await sleep(config.delayMs);
    }
  }

  return lastReceipt;
}

export const __test = { normalizeConfig, parseVersionDocument };
