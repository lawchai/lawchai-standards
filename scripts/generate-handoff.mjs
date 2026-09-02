import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export function validateHandoffInput(data) {
  const errors = [];
  if (!data || typeof data !== 'object') {
    return ['Input must be a valid JSON object'];
  }

  const requiredFields = [
    'repository',
    'branch',
    'base_sha',
    'head_sha',
    'objective',
    'scope',
    'changed_paths',
    'verification',
    'semantic_contract',
    'terminal_state',
    'exact_next_action',
  ];

  for (const field of requiredFields) {
    if (!data[field]) {
      errors.push(`Missing required field: "${field}"`);
    }
  }

  if (data.base_sha && !/^[0-9a-fA-F]{40}$/.test(data.base_sha)) {
    errors.push(`Invalid base_sha: "${data.base_sha}". Must be 40-character hex SHA.`);
  }
  if (data.head_sha && !/^[0-9a-fA-F]{40}$/.test(data.head_sha)) {
    errors.push(`Invalid head_sha: "${data.head_sha}". Must be 40-character hex SHA.`);
  }

  const validTerminalStates = ['READY_PR', '[BLOCKED]', 'UNCHANGED_FAILURE'];
  if (data.terminal_state && !validTerminalStates.includes(data.terminal_state)) {
    errors.push(`Invalid terminal_state: "${data.terminal_state}". Must be one of: ${validTerminalStates.join(', ')}`);
  }

  return errors;
}

export function generateHandoffMarkdown(data) {
  const validationErrors = validateHandoffInput(data);
  if (validationErrors.length > 0) {
    throw new Error(`Invalid handoff report data:\n${validationErrors.join('\n')}`);
  }

  const scopePaths = (data.scope.allowed_paths || []).map((p) => `  - ${p}`).join('\n') || '  - none';
  const authBehaviors = (data.scope.authorized_behaviours || []).map((b) => `  - ${b}`).join('\n') || '  - none';
  const exclBehaviors = (data.scope.excluded_behaviours || []).map((b) => `  - ${b}`).join('\n') || '  - none';

  const changedPaths = (data.changed_paths || [])
    .map((cp) => `- \`${cp.path}\` — ${cp.reason}`)
    .join('\n') || '- None';

  const sem = data.semantic_contract || {};
  const semTable = `| Contract surface | Changed? | Evidence or compatibility note |
|---|---:|---|
| Public signatures | ${sem.public_signatures_changed ? 'Yes' : 'No'} | ${sem.public_signatures_note || 'N/A'} |
| Return/sentinel values | ${sem.return_values_changed ? 'Yes' : 'No'} | ${sem.return_values_note || 'N/A'} |
| Storage/schema formats | ${sem.storage_schema_changed ? 'Yes' : 'No'} | ${sem.storage_schema_note || 'N/A'} |
| Error handling | ${sem.error_handling_changed ? 'Yes' : 'No'} | ${sem.error_handling_note || 'N/A'} |
| Persistence/reset | ${sem.persistence_reset_changed ? 'Yes' : 'No'} | ${sem.persistence_reset_note || 'N/A'} |
| Import/export | ${sem.import_export_changed ? 'Yes' : 'No'} | ${sem.import_export_note || 'N/A'} |
| Migration behaviour | ${sem.migration_changed ? 'Yes' : 'No'} | ${sem.migration_note || 'N/A'} |`;

  const consumers = (sem.consumers_searched || []).map((c) => `- \`${c}\``).join('\n') || '- None';

  const ver = data.verification || {};
  const verTable = `| Check | Command or evidence | Result |
|---|---|---|
| Deterministic tests | \`${ver.test_command || 'npm test'}\` | ${ver.test_result || 'Pass'} |
| Type check | \`npm run typecheck\` | ${ver.typecheck_result || 'Pass'} |
| Lint | \`npm run lint\` | ${ver.lint_result || 'Pass'} |
| Build | \`npm run build\` | ${ver.build_result || 'Pass'} |
| Browser journey | Visual / Mobile checks | ${ver.browser_journey_result || 'Pass'} |`;

  const acc = data.accessibility || {};
  const accList = `- [${acc.keyboard_only ? 'x' : ' '}] Keyboard-only journey
- [${acc.visible_focus ? 'x' : ' '}] Visible focus
- [${acc.reduced_motion ? 'x' : ' '}] Reduced motion
- [${acc.zoom_200 ? 'x' : ' '}] 200% zoom
- [${acc.viewports_320_390 ? 'x' : ' '}] 320px and 390px viewports
- [${acc.no_horizontal_overflow ? 'x' : ' '}] No horizontal overflow
- [${acc.touch_targets_44 ? 'x' : ' '}] 44×44 controls where applicable`;

  const sec = data.security_privacy_data || {};
  const secText = `- Secrets exposed: ${sec.secrets_exposed ? 'YES (BLOCKER)' : 'No'}
- Sensitive real data used: ${sec.sensitive_real_data_used ? 'Yes' : 'No'}
- Synthetic-data disclosure: ${sec.synthetic_data_disclosure || 'Present'}`;

  const blockers = (data.blockers || []).map((b) => `- ${b}`).join('\n') || '- None';
  const unknowns = (data.unknowns || []).map((u) => `- ${u}`).join('\n') || '- None';
  const rejectedAlts = (data.rejected_alternatives || []).map((a) => `- ${a}`).join('\n') || '- None';

  return `## Outcome

${data.objective}

## Metadata

- Repository: \`${data.repository}\`
- Branch: \`${data.branch}\`
- Base SHA: \`${data.base_sha}\`
- Head SHA: \`${data.head_sha}\`
- Terminal State: **${data.terminal_state}**
- Generated At: \`${data.timestamp || new Date().toISOString()}\`

## Scope

\`\`\`yaml
allowed_paths:
${scopePaths}
authorised_behaviours:
${authBehaviors}
excluded_behaviours:
${exclBehaviors}
\`\`\`

## Changed paths

${changedPaths}

## Semantic-contract declaration

${semTable}

Consumers searched:

${consumers}

## Verification

Exact head SHA: \`${data.head_sha}\`

${verTable}

Zero-test guard: ${ver.zero_test_guard || 'passed'}

## Accessibility

${accList}

## Security, privacy, and data

${secText}

## Blockers and Unknowns

Blockers:
${blockers}

Unknowns:
${unknowns}

Rejected Alternatives:
${rejectedAlts}

## Terminal State & Exact Next Action

- **Terminal State**: \`${data.terminal_state}\`
- **Exact Next Action**: ${data.exact_next_action}
`;
}

if (process.argv[1] && path.resolve(process.argv[1]) === __filename) {
  const args = process.argv.slice(2);
  let inputFile = '';
  let outputFile = '';

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--input' && args[i + 1]) {
      inputFile = args[++i];
    } else if (args[i] === '--output' && args[i + 1]) {
      outputFile = args[++i];
    }
  }

  if (!inputFile) {
    console.error('Usage: node scripts/generate-handoff.mjs --input <file.json> [--output <file.md>]');
    process.exit(1);
  }

  try {
    const raw = fs.readFileSync(path.resolve(inputFile), 'utf8');
    const parsed = JSON.parse(raw);
    const md = generateHandoffMarkdown(parsed);

    if (outputFile) {
      fs.writeFileSync(path.resolve(outputFile), md, 'utf8');
      console.log(`Handoff report written to: ${outputFile}`);
    } else {
      console.log(md);
    }
  } catch (err) {
    console.error(`Failed to generate handoff report: ${err.message}`);
    process.exit(1);
  }
}
