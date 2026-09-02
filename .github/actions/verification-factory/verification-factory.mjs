import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';

function findTestFilesOnDisk(dir) {
  const testFiles = [];
  function traverse(currentDir) {
    if (!fs.existsSync(currentDir)) return;
    for (const entry of fs.readdirSync(currentDir, { withFileTypes: true })) {
      if (entry.name === 'node_modules' || entry.name === '.git' || entry.name === 'dist') continue;
      const fullPath = path.join(currentDir, entry.name);
      if (entry.isDirectory()) {
        traverse(fullPath);
      } else {
        const normalized = fullPath.replace(/\\/g, '/');
        if (
          /\.(test|spec)\.[cm]?[jt]sx?$/i.test(normalized) ||
          (/(^|\/)(tests|__tests__)\//.test(normalized) && /\.[cm]?[jt]sx?$/i.test(normalized))
        ) {
          testFiles.push(fullPath);
        }
      }
    }
  }
  traverse(dir);
  return testFiles;
}

function readEvidence(options) {
  if (options.verification_evidence && typeof options.verification_evidence === 'object') {
    return options.verification_evidence;
  }
  const raw = process.env.VERIFICATION_EVIDENCE_JSON;
  if (!raw) return {};
  try {
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch {
    return { __parse_error: 'VERIFICATION_EVIDENCE_JSON is not valid JSON' };
  }
}

function normalizedStatus(value) {
  return typeof value === 'string' ? value.trim().toUpperCase() : '';
}

function evaluateExecutionEvidence({
  name,
  evidence,
  required,
  headSha,
  environment,
  checks,
  blockers,
  requireNonzero = false,
}) {
  if (!required) {
    checks.push({ name, status: 'not_applicable', details: 'Check is not configured for this repository invocation.' });
    return false;
  }
  if (!evidence || typeof evidence !== 'object') {
    checks.push({ name, status: 'not_run', details: 'No execution evidence supplied; no PASS claimed.' });
    blockers.push(`${name} execution evidence missing`);
    return false;
  }
  if (!headSha || evidence.head_sha !== headSha) {
    checks.push({ name, status: 'fail', details: 'Evidence head SHA does not match the receipt head SHA.' });
    blockers.push(`${name} evidence revision mismatch`);
    return false;
  }
  if (!environment || evidence.environment !== environment) {
    checks.push({ name, status: 'fail', details: 'Evidence environment does not match the receipt environment.' });
    blockers.push(`${name} evidence environment mismatch`);
    return false;
  }
  if (normalizedStatus(evidence.status) !== 'PASS') {
    const status = normalizedStatus(evidence.status) || 'UNKNOWN';
    checks.push({ name, status: status.toLowerCase(), details: `Execution evidence status is ${status}; no PASS claimed.` });
    blockers.push(`${name} did not pass`);
    return false;
  }
  if (requireNonzero) {
    const count = evidence.test_count;
    if (evidence.executed_nonzero !== true || !Number.isInteger(count) || count <= 0) {
      checks.push({ name, status: 'fail', details: 'PASS evidence lacks a positive mechanically reported test count.' });
      blockers.push(`${name} lacks non-zero execution evidence`);
      return false;
    }
    checks.push({ name, status: 'pass', details: `Executed ${count} test(s) successfully at the exact head/environment.` });
    return true;
  }
  checks.push({ name, status: 'pass', details: 'Explicit PASS execution evidence matches the exact head/environment.' });
  return true;
}

export function runVerificationFactory(options = {}) {
  const cwd = options.cwd || process.cwd();
  const repo = options.repository || process.env.GITHUB_REPOSITORY || 'lawchai/unknown';
  const baseSha = options.base_sha || process.env.BASE_SHA || '0000000000000000000000000000000000000000';
  const headSha = options.head_sha || process.env.HEAD_SHA || '0000000000000000000000000000000000000000';
  const riskClass = options.risk_class || process.env.RISK_CLASS || 'low';
  const semanticContractChanged = options.semantic_contract_changed ?? process.env.SEMANTIC_CONTRACT_CHANGED === 'true';
  const persistenceChanged = options.persistence_changed ?? process.env.PERSISTENCE_CHANGED === 'true';
  const browserRequired = options.browser_required ?? process.env.BROWSER_REQUIRED === 'true';
  const evidence = readEvidence(options);
  const environment = options.environment || evidence.environment || process.env.VERIFICATION_ENVIRONMENT || '';

  const checks = [];
  const blockers = [];

  if (evidence.__parse_error) {
    checks.push({ name: 'evidence_payload', status: 'fail', details: evidence.__parse_error });
    blockers.push(evidence.__parse_error);
  }

  const scopeFilePath = path.join(cwd, '.github', 'lawchai-scope.yml');
  let authorizedPaths = options.authorized_paths || [];
  if (fs.existsSync(scopeFilePath)) {
    try {
      const scopeContent = fs.readFileSync(scopeFilePath, 'utf8');
      const lines = scopeContent.split('\n');
      const parsedPaths = [];
      let inAllowed = false;
      for (const line of lines) {
        if (line.trim().startsWith('allowed_paths:')) {
          inAllowed = true;
          continue;
        }
        if (inAllowed) {
          if (line.trim().startsWith('- ')) parsedPaths.push(line.trim().substring(2).trim());
          else if (line.trim() && !line.startsWith(' ')) inAllowed = false;
        }
      }
      if (parsedPaths.length > 0 && authorizedPaths.length === 0) authorizedPaths = parsedPaths;
      checks.push({ name: 'scope_inventory', status: 'info', details: `Found ${authorizedPaths.length} allowed path(s) in scope configuration.` });
    } catch (err) {
      checks.push({ name: 'scope_inventory', status: 'fail', details: `Error reading scope file: ${err.message}` });
      blockers.push(`Scope check failed: ${err.message}`);
    }
  } else {
    checks.push({ name: 'scope_inventory', status: 'warn', details: 'No .github/lawchai-scope.yml found.' });
  }

  const pkgPath = path.join(cwd, 'package.json');
  let scripts = {};
  if (fs.existsSync(pkgPath)) {
    try {
      const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
      scripts = pkg.scripts || {};
      if (!scripts.build) {
        blockers.push('package.json missing build script');
        checks.push({ name: 'build_script_check', status: 'fail', details: 'package.json must define a build script.' });
      } else {
        checks.push({ name: 'build_script_check', status: 'pass', details: 'Build script is configured; execution is evaluated separately.' });
      }
      const permissivePattern = /(?:passWithNoTests|pass-with-no-tests|allowNoTests|allow-no-tests|allowEmpty|allow-empty)(?!\s*=\s*false)/i;
      if (scripts.test && permissivePattern.test(scripts.test)) {
        blockers.push('Test script contains permissive zero-test flag');
        checks.push({ name: 'zero_test_guard', status: 'fail', details: 'Test script permits a successful zero-test run.' });
      } else {
        checks.push({ name: 'zero_test_guard', status: 'pass', details: 'No permissive zero-test flag detected in the test script.' });
      }
    } catch (err) {
      blockers.push(`Failed to parse package.json: ${err.message}`);
      checks.push({ name: 'package_json_check', status: 'fail', details: err.message });
    }
  } else {
    blockers.push('package.json missing');
    checks.push({ name: 'package_json_check', status: 'fail', details: 'package.json is required for this verification factory.' });
  }

  let testFiles = [];
  try {
    const gitFiles = execSync('git ls-files', { cwd, encoding: 'utf8' }).split('\n').filter(Boolean);
    testFiles = gitFiles.filter((file) => {
      const normalized = file.replace(/\\/g, '/');
      return (
        /\.(test|spec)\.[cm]?[jt]sx?$/i.test(normalized) ||
        (/(^|\/)(tests|__tests__)\//.test(normalized) && /\.[cm]?[jt]sx?$/i.test(normalized))
      );
    });
  } catch {
    testFiles = findTestFilesOnDisk(cwd);
  }
  checks.push({
    name: 'tracked_test_inventory',
    status: 'info',
    details: testFiles.length > 0
      ? `Detected ${testFiles.length} test file(s); presence is inventory only, not execution evidence.`
      : 'No test files detected; no automated test coverage is claimed.',
  });

  const testsRequired = Boolean(scripts.test) || testFiles.length > 0;
  const testPassed = evaluateExecutionEvidence({
    name: 'tests',
    evidence: evidence.tests,
    required: testsRequired,
    headSha,
    environment,
    checks,
    blockers,
    requireNonzero: true,
  });
  evaluateExecutionEvidence({
    name: 'typecheck',
    evidence: evidence.typecheck,
    required: Boolean(scripts.typecheck),
    headSha,
    environment,
    checks,
    blockers,
  });
  evaluateExecutionEvidence({
    name: 'lint',
    evidence: evidence.lint,
    required: Boolean(scripts.lint),
    headSha,
    environment,
    checks,
    blockers,
  });
  evaluateExecutionEvidence({
    name: 'build',
    evidence: evidence.build,
    required: Boolean(scripts.build),
    headSha,
    environment,
    checks,
    blockers,
  });

  if (browserRequired || evidence.browser) {
    evaluateExecutionEvidence({
      name: 'browser_accessibility',
      evidence: evidence.browser,
      required: true,
      headSha,
      environment,
      checks,
      blockers,
    });
  } else {
    checks.push({
      name: 'browser_accessibility',
      status: 'not_run',
      details: 'No browser/accessibility execution evidence supplied and this invocation did not require it; no PASS claimed.',
    });
  }

  const terminalState = blockers.length > 0 ? 'BLOCKED' : 'READY_PR';
  return {
    schema_version: 2,
    repository: repo,
    base_sha: baseSha,
    head_sha: headSha,
    environment: environment || null,
    terminal_state: terminalState,
    executed_nonzero: testPassed,
    risk_class: riskClass,
    authorized_paths: authorizedPaths,
    checks,
    contract_changes: {
      semantic_contract_changed: Boolean(semanticContractChanged),
      persistence_changed: Boolean(persistenceChanged),
    },
    blockers,
    next_action: terminalState === 'READY_PR'
      ? 'Proceed only under the repository integration policy and current authority.'
      : `Resolve verification blockers: ${blockers.join('; ')}`,
    verified_at: new Date().toISOString(),
  };
}

if (process.argv[1] && process.argv[1].endsWith('verification-factory.mjs')) {
  try {
    const receipt = runVerificationFactory();
    console.log(JSON.stringify(receipt, null, 2));
    if (process.env.GITHUB_STEP_SUMMARY) {
      fs.appendFileSync(
        process.env.GITHUB_STEP_SUMMARY,
        `### Verification Factory Summary\n- **Terminal State**: ${receipt.terminal_state}\n- **Executed Non-Zero Tests**: ${receipt.executed_nonzero}\n- **Blockers**: ${receipt.blockers.length}\n`
      );
    }
    if (receipt.terminal_state === 'BLOCKED') process.exit(1);
  } catch (err) {
    console.error(`Verification Factory Error: ${err.message}`);
    process.exit(1);
  }
}
