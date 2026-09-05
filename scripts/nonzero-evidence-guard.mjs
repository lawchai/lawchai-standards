import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

function normalizedStatus(value) {
  return typeof value === 'string' ? value.trim().toUpperCase() : '';
}

/**
 * Mechanically evaluates whether an evidence record or claim represents valid
 * execution evidence for the exact Git revision and environment. When `requireNonzero`
 * is true (the default for test execution), PASS must be tied to a positive integer test count.
 */
export function evaluateNonZeroEvidence({
  evidence,
  name = 'tests',
  required = true,
  headSha,
  environment,
  checks = [],
  blockers = [],
  requireNonzero = true,
}) {
  if (!required) {
    checks.push({ name, status: 'not_applicable', details: 'Check is not configured for this repository invocation.' });
    return { valid: false, executed_nonzero: false, status: 'not_applicable' };
  }

  if (!evidence || typeof evidence !== 'object') {
    checks.push({ name, status: 'not_run', details: 'No execution evidence supplied; no PASS claimed.' });
    blockers.push(`${name} execution evidence missing`);
    return { valid: false, executed_nonzero: false, status: 'not_run' };
  }

  const normalizedHeadSha = typeof headSha === 'string' ? headSha.trim() : '';
  const evidenceHeadSha = typeof evidence.head_sha === 'string' ? evidence.head_sha.trim() : '';

  if (!normalizedHeadSha || !/^[0-9a-fA-F]{40}$/.test(normalizedHeadSha) || evidenceHeadSha !== normalizedHeadSha) {
    checks.push({ name, status: 'fail', details: 'Evidence head SHA does not match the expected exact head SHA.' });
    blockers.push(`${name} evidence revision mismatch`);
    return { valid: false, executed_nonzero: false, status: 'fail' };
  }

  const normalizedEnv = typeof environment === 'string' ? environment.trim() : '';
  const evidenceEnv = typeof evidence.environment === 'string' ? evidence.environment.trim() : '';

  if (!normalizedEnv || evidenceEnv !== normalizedEnv) {
    checks.push({ name, status: 'fail', details: 'Evidence environment does not match the expected execution environment.' });
    blockers.push(`${name} evidence environment mismatch`);
    return { valid: false, executed_nonzero: false, status: 'fail' };
  }

  const status = normalizedStatus(evidence.status);
  if (status !== 'PASS') {
    checks.push({ name, status: status.toLowerCase() || 'unknown', details: `Execution evidence status is ${status || 'UNKNOWN'}; no PASS claimed.` });
    blockers.push(`${name} did not pass`);
    return { valid: false, executed_nonzero: false, status: status.toLowerCase() || 'unknown' };
  }

  if (requireNonzero) {
    const count = evidence.test_count;
    const isNonzeroFlag = evidence.executed_nonzero === true;
    const isValidCount = Number.isInteger(count) && count > 0;

    if (!isNonzeroFlag || !isValidCount) {
      checks.push({ name, status: 'fail', details: 'PASS evidence lacks a positive mechanically reported test count or executed_nonzero flag.' });
      blockers.push(`${name} lacks non-zero execution evidence`);
      return { valid: false, executed_nonzero: false, status: 'fail' };
    }

    checks.push({ name, status: 'pass', details: `Executed ${count} test(s) successfully at exact head ${normalizedHeadSha} in ${normalizedEnv}.` });
    return { valid: true, executed_nonzero: true, status: 'pass', test_count: count };
  }

  checks.push({ name, status: 'pass', details: `Explicit PASS execution evidence matches exact head ${normalizedHeadSha} in ${normalizedEnv}.` });
  return { valid: true, executed_nonzero: false, status: 'pass' };
}

/**
 * Parses stdout/stderr TAP, Vitest/Jest output, or JSON test results into structured
 * execution evidence metadata.
 */
export function parseRunnerOutput(rawOutput) {
  if (typeof rawOutput !== 'string' || !rawOutput.trim()) {
    return {
      status: 'NO_TESTS',
      executed_nonzero: false,
      test_count: 0,
      passed_count: 0,
      failed_count: 0,
      details: 'Empty runner output',
    };
  }

  // Try parsing JSON output
  try {
    const json = JSON.parse(rawOutput);
    if (json && typeof json === 'object') {
      const numPass = json.numPassedTests ?? json.passed ?? json.passCount ?? (Array.isArray(json.tests) ? json.tests.filter(t => t.status === 'passed').length : null);
      const numTotal = json.numTotalTests ?? json.total ?? json.testCount ?? (Array.isArray(json.tests) ? json.tests.length : null);
      const numFail = json.numFailedTests ?? json.failed ?? json.failCount ?? 0;

      if (Number.isInteger(numPass) && numPass > 0 && numFail === 0) {
        return {
          status: 'PASS',
          executed_nonzero: true,
          test_count: numPass,
          passed_count: numPass,
          failed_count: numFail,
          details: `Parsed JSON test report: ${numPass} passed test(s)`,
        };
      } else {
        return {
          status: numFail > 0 ? 'FAIL' : 'NO_TESTS',
          executed_nonzero: false,
          test_count: numPass || 0,
          passed_count: numPass || 0,
          failed_count: numFail,
          details: 'JSON test report showed 0 passed tests or test failures',
        };
      }
    }
  } catch {
    // Not raw JSON, proceed with text regex parsing
  }

  // Node.js test runner TAP output parsing
  const tapPassMatch = rawOutput.match(/#\s*pass\s+(\d+)/i);
  const tapFailMatch = rawOutput.match(/#\s*fail\s+(\d+)/i);

  if (tapPassMatch) {
    const passed = parseInt(tapPassMatch[1], 10);
    const failed = tapFailMatch ? parseInt(tapFailMatch[1], 10) : 0;
    if (passed > 0 && failed === 0) {
      return {
        status: 'PASS',
        executed_nonzero: true,
        test_count: passed,
        passed_count: passed,
        failed_count: failed,
        details: `Parsed TAP summary: ${passed} passed test(s)`,
      };
    } else {
      return {
        status: failed > 0 ? 'FAIL' : 'NO_TESTS',
        executed_nonzero: false,
        test_count: passed,
        passed_count: passed,
        failed_count: failed,
        details: `TAP summary showed ${passed} passed, ${failed} failed`,
      };
    }
  }

  // Jest / Vitest console text output parsing
  const jestPassMatch = rawOutput.match(/Tests:\s*(\d+)\s*passed(?:,\s*(\d+)\s*total)?/i);
  if (jestPassMatch) {
    const passed = parseInt(jestPassMatch[1], 10);
    if (passed > 0) {
      return {
        status: 'PASS',
        executed_nonzero: true,
        test_count: passed,
        passed_count: passed,
        failed_count: 0,
        details: `Parsed test console output: ${passed} passed test(s)`,
      };
    }
  }

  return {
    status: 'NO_TESTS',
    executed_nonzero: false,
    test_count: 0,
    passed_count: 0,
    failed_count: 0,
    details: 'Runner output contained no positive test execution evidence',
  };
}

/**
 * Creates a verified evidence record suitable for VERIFICATION_EVIDENCE_JSON.
 */
export function createNonZeroEvidence({
  headSha,
  environment,
  runnerOutput,
  checkName = 'tests',
}) {
  const parsed = parseRunnerOutput(runnerOutput);
  return {
    [checkName]: {
      status: parsed.status,
      head_sha: headSha,
      environment,
      executed_nonzero: parsed.executed_nonzero,
      test_count: parsed.test_count,
      details: parsed.details,
    },
  };
}

const currentFile = fileURLToPath(import.meta.url);
if (process.argv[1] && path.resolve(process.argv[1]) === path.resolve(currentFile)) {
  const args = process.argv.slice(2);
  let headSha = '';
  let environment = '';
  let evidenceRaw = '';
  let runnerOutputFile = '';

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--head-sha' && args[i + 1]) headSha = args[++i];
    else if (args[i] === '--environment' && args[i + 1]) environment = args[++i];
    else if (args[i] === '--evidence' && args[i + 1]) evidenceRaw = args[++i];
    else if (args[i] === '--runner-output-file' && args[i + 1]) runnerOutputFile = args[++i];
  }

  if (runnerOutputFile && fs.existsSync(runnerOutputFile)) {
    const raw = fs.readFileSync(runnerOutputFile, 'utf8');
    const created = createNonZeroEvidence({ headSha, environment, runnerOutput: raw });
    evidenceRaw = JSON.stringify(created.tests);
  }

  let evidenceObj = null;
  if (evidenceRaw) {
    try {
      evidenceObj = JSON.parse(evidenceRaw);
    } catch (err) {
      console.error(`Invalid evidence JSON: ${err.message}`);
      process.exit(1);
    }
  }

  const checks = [];
  const blockers = [];
  const res = evaluateNonZeroEvidence({
    evidence: evidenceObj,
    headSha,
    environment,
    checks,
    blockers,
    requireNonzero: true,
  });

  console.log(JSON.stringify({ result: res, checks, blockers }, null, 2));
  if (!res.valid) {
    process.exit(1);
  }
}
