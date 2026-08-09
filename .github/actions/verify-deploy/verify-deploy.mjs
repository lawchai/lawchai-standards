import fs from 'node:fs';
import { verifyDeployment } from './verify-deploy-core.mjs';

function appendOutput(name, value) {
  if (!process.env.GITHUB_OUTPUT) return;
  fs.appendFileSync(process.env.GITHUB_OUTPUT, `${name}=${String(value)}\n`);
}

function escapeTable(value) {
  return String(value ?? 'unknown')
    .replace(/\r?\n/g, ' ')
    .replace(/\|/g, '\\|');
}

function appendSummary(receipt) {
  if (!process.env.GITHUB_STEP_SUMMARY) return;
  const lines = [
    '### Verified Closure — deployment identity',
    '',
    '| Field | Evidence |',
    '| --- | --- |',
    `| Status | ${escapeTable(receipt.status)} |`,
    `| Terminal state | ${escapeTable(receipt.terminal_state)} |`,
    `| Expected SHA | \`${escapeTable(receipt.expected_sha)}\` |`,
    `| Observed SHA | \`${escapeTable(receipt.observed_sha)}\` |`,
    `| Build timestamp | ${escapeTable(receipt.built_at)} |`,
    `| Version URL | ${escapeTable(receipt.version_url)} |`,
    `| Attempts used | ${escapeTable(receipt.attempts_used)} / ${escapeTable(receipt.max_attempts)} |`,
    `| Checked at | ${escapeTable(receipt.checked_at)} |`,
    `| Reason | ${escapeTable(receipt.reason)} |`,
    '',
    receipt.status === 'pass'
      ? 'Deployment closure verified against the expected commit.'
      : 'Deployment closure is **not verified**. Missing or conflicting evidence is never treated as success.',
    '',
  ];
  fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY, lines.join('\n'));
}

const receipt = await verifyDeployment({
  versionUrl: process.env.INPUT_VERSION_URL,
  expectedSha: process.env.INPUT_EXPECTED_SHA,
  attempts: process.env.INPUT_ATTEMPTS,
  delaySeconds: process.env.INPUT_DELAY_SECONDS,
  timeoutSeconds: process.env.INPUT_TIMEOUT_SECONDS,
});

appendOutput('status', receipt.status);
appendOutput('terminal_state', receipt.terminal_state);
appendOutput('observed_sha', receipt.observed_sha ?? '');
appendOutput('built_at', receipt.built_at ?? '');
appendOutput('attempts_used', receipt.attempts_used);
appendOutput('receipt_json', JSON.stringify(receipt));
appendSummary(receipt);

console.log(JSON.stringify(receipt));
if (receipt.status !== 'pass') process.exitCode = 1;
