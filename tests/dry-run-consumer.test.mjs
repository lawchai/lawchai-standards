import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { initStarter } from '../scripts/init-starter.mjs';
import { runVerificationFactory } from '../.github/actions/verification-factory/verification-factory.mjs';
import { generateHandoffMarkdown } from '../scripts/generate-handoff.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

test('dry-run consumer workflow: starter -> verification -> handoff generation', () => {
  const consumerDir = path.join(rootDir, 'tmp-dry-run-pipeline-doctor');
  if (fs.existsSync(consumerDir)) {
    fs.rmSync(consumerDir, { recursive: true, force: true });
  }

  const dummySha = 'abcdef0123456789abcdef0123456789abcdef01';

  // Step 1: Scaffold consumer app
  const scaffoldRes = initStarter([
    '--id', 'pipeline-doctor',
    '--title', 'Pipeline Doctor',
    '--purpose', 'Automated diagnostic tool for CI/CD pipelines',
    '--owner', 'lawchai',
    '--repository', 'lawchai/pipeline-doctor',
    '--standards-sha', dummySha,
    '--output', consumerDir,
  ]);

  assert.ok(scaffoldRes.success);
  assert.ok(fs.existsSync(path.join(consumerDir, 'product-contract.json')));
  assert.ok(fs.existsSync(path.join(consumerDir, '.github', 'lawchai-scope.yml')));

  // Step 2: Run verification factory against consumer
  const verificationReceipt = runVerificationFactory({
    cwd: consumerDir,
    repository: 'lawchai/pipeline-doctor',
    base_sha: dummySha,
    head_sha: dummySha,
    risk_class: 'low',
    semantic_contract_changed: false,
    persistence_changed: false,
  });

  assert.equal(verificationReceipt.schema_version, 2);
  assert.equal(verificationReceipt.repository, 'lawchai/pipeline-doctor');
  assert.equal(verificationReceipt.terminal_state, 'BLOCKED');
  assert.equal(verificationReceipt.executed_nonzero, false);
  assert.ok(verificationReceipt.blockers.some((blocker) => blocker.includes('tests execution evidence missing')));

  // Step 3: Generate handoff report for consumer
  const handoffInput = {
    repository: 'lawchai/pipeline-doctor',
    branch: 'feature/baseline-adoption',
    base_sha: dummySha,
    head_sha: dummySha,
    objective: 'Adopt LawChai starter baseline and verification factory without changing product semantics',
    scope: {
      allowed_paths: verificationReceipt.authorized_paths,
      authorized_behaviours: ['Adopt baseline product contract and reusable verification factory'],
      excluded_behaviours: ['Do not modify diagnostic rules or domain logic'],
    },
    changed_paths: [
      { path: 'product-contract.json', reason: 'Configured pipeline doctor metadata' },
      { path: '.github/workflows/ci.yml', reason: 'Pinned lawchai-standards reusable workflow' },
    ],
    verification: {
      test_command: 'npm test',
      test_result: 'NOT_RUN',
      zero_test_guard: 'passed',
      typecheck_result: 'NOT_RUN',
      lint_result: 'NOT_RUN',
      build_result: 'NOT_RUN',
      browser_journey_result: 'NOT_RUN',
    },
    semantic_contract: {
      public_signatures_changed: false,
      return_values_changed: false,
      storage_schema_changed: false,
      error_handling_changed: false,
      persistence_reset_changed: false,
      import_export_changed: false,
      migration_changed: false,
      consumers_searched: ['lawchai/pipeline-doctor'],
    },
    accessibility: {
      keyboard_only: true,
      visible_focus: true,
      reduced_motion: true,
      zoom_200: true,
      viewports_320_390: true,
      no_horizontal_overflow: true,
      touch_targets_44: true,
    },
    security_privacy_data: {
      secrets_exposed: false,
      sensitive_real_data_used: false,
      synthetic_data_disclosure: 'Present in README.md',
    },
    blockers: [],
    unknowns: [],
    rejected_alternatives: ['Custom handwritten workflow configuration'],
    terminal_state: '[BLOCKED]',
    exact_next_action: 'Run exact-head consumer verification and regenerate the handoff with execution evidence',
  };

  const handoffReportMd = generateHandoffMarkdown(handoffInput);

  assert.ok(handoffReportMd.includes('## Outcome'));
  assert.ok(handoffReportMd.includes('lawchai/pipeline-doctor'));
  assert.ok(handoffReportMd.includes('[BLOCKED]'));
  assert.ok(handoffReportMd.includes('NOT_RUN'));

  // Clean up
  fs.rmSync(consumerDir, { recursive: true, force: true });
});
