import test from 'node:test';
import assert from 'node:assert/strict';
import { validateHandoffInput, generateHandoffMarkdown } from '../scripts/generate-handoff.mjs';

test('validateHandoffInput catches missing required fields and invalid SHAs', () => {
  const invalidData = {
    repository: 'lawchai/test',
    base_sha: 'invalid-sha',
    head_sha: '2222222222222222222222222222222222222222',
  };

  const errors = validateHandoffInput(invalidData);
  assert.ok(errors.length > 0);
  assert.ok(errors.some((e) => e.includes('base_sha')));
  assert.ok(errors.some((e) => e.includes('objective')));
});

test('generateHandoffMarkdown produces compliant Markdown with required sections', () => {
  const validData = {
    repository: 'lawchai/pipeline-doctor',
    branch: 'jules/dry-run-test',
    base_sha: '1111111111111111111111111111111111111111',
    head_sha: '2222222222222222222222222222222222222222',
    objective: 'Implement dry run consumer test',
    scope: {
      allowed_paths: ['.github/lawchai-scope.yml', 'src/App.tsx'],
      authorized_behaviours: ['Update UI'],
      excluded_behaviours: ['Change database'],
    },
    changed_paths: [
      { path: 'src/App.tsx', reason: 'Update layout' },
    ],
    verification: {
      test_command: 'npm test',
      test_result: 'Pass',
      zero_test_guard: 'passed',
      typecheck_result: 'Pass',
      lint_result: 'Pass',
      build_result: 'Pass',
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
    terminal_state: 'READY_PR',
    exact_next_action: 'Submit pull request',
  };

  const md = generateHandoffMarkdown(validData);
  assert.ok(md.includes('## Outcome'));
  assert.ok(md.includes('## Metadata'));
  assert.ok(md.includes('## Scope'));
  assert.ok(md.includes('## Changed paths'));
  assert.ok(md.includes('## Semantic-contract declaration'));
  assert.ok(md.includes('## Verification'));
  assert.ok(md.includes('## Terminal State & Exact Next Action'));
  assert.ok(md.includes('READY_PR'));
});
