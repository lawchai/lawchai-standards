import test from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { mkdtempSync, mkdirSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import {
  DEFAULT_MIN_LEAD_DAYS,
  classifyLiteral,
  findDateLiterals,
  isTestFile,
  literalToEpoch,
  scanRepository,
  scanSource
} from '../scripts/find-test-timebombs.mjs';

const DAY = 24 * 60 * 60 * 1000;
const at = (iso) => Date.parse(iso);
const script = fileURLToPath(new URL('../scripts/find-test-timebombs.mjs', import.meta.url));

test('only test files are scanned', () => {
  for (const file of ['test/a.test.mjs', 'tests/unit/b.js', 'src/__tests__/c.tsx', 'src/widget.spec.ts', 'e2e/smoke.mjs', 'tests/test_core.py', 'pkg/test_api.py']) {
    assert.equal(isTestFile(file), true, file);
  }
  for (const file of ['src/app.mjs', 'README.md', 'test/fixture.json', 'docs/tests.md', 'src/contest/entry.js']) {
    assert.equal(isTestFile(file), false, file);
  }
});

test('quoted date literals are found; identifiers, unquoted and impossible dates are not', () => {
  const source = [
    "['resolveBy', '2026-10-08T00:00'],",
    'const due = "2027-01-15";',
    'const stamp = `2026-11-09T00:00:00Z`;',
    "const id = 'run-2026-10-08';",
    'const bare = 2026-10-08;',
    "const never = '2026-02-31';",
    "const offset = '2028-02-29T01:02:03+08:00';"
  ].join('\n');
  assert.deepEqual(findDateLiterals(source).map((item) => [item.line, item.literal]), [
    [1, '2026-10-08T00:00'], [2, '2027-01-15'], [3, '2026-11-09T00:00:00Z'], [7, '2028-02-29T01:02:03+08:00']
  ]);
  assert.equal(literalToEpoch('2026-10-08'), at('2026-10-08T23:59:59.999Z'), 'a bare date lasts until the end of that day');
  assert.equal(literalToEpoch('2026-10-08T00:00'), at('2026-10-08T00:00:00Z'));
  assert.equal(literalToEpoch('2028-02-29T01:02:03+08:00'), at('2028-02-28T17:02:03Z'));
  assert.equal(literalToEpoch('2026-02-31'), null);
});

test('a deadline written ahead of time is TICKING until it passes, then EXPIRED', () => {
  const authored = at('2026-09-08T00:00:00Z');
  const deadline = at('2026-10-08T00:00:00Z');
  assert.equal(classifyLiteral(deadline, authored, at('2026-09-20T00:00:00Z')), 'TICKING');
  assert.equal(classifyLiteral(deadline, authored, at('2026-10-08T00:00:00Z')), 'EXPIRED');
  assert.equal(classifyLiteral(deadline, authored, at('2026-11-13T00:00:00Z')), 'EXPIRED');
});

test('negative: ordinary fixtures are not reported', () => {
  const now = at('2026-11-13T00:00:00Z');
  assert.equal(classifyLiteral(at('2026-01-01T00:00:00Z'), at('2026-09-08T00:00:00Z'), now), null, 'already past when written');
  assert.equal(classifyLiteral(at('2026-09-09T00:00:00Z'), at('2026-09-08T00:00:00Z'), now), null, 'a clock set one day ahead');
  assert.equal(classifyLiteral(at('2026-09-08T00:00:00Z') + (DEFAULT_MIN_LEAD_DAYS * DAY) - 1, at('2026-09-08T00:00:00Z'), now), null);
  assert.equal(classifyLiteral(at('2026-09-08T00:00:00Z') + DEFAULT_MIN_LEAD_DAYS * DAY, at('2026-09-08T00:00:00Z'), now), 'EXPIRED');
  assert.equal(classifyLiteral(at('2099-01-01T00:00:00Z'), at('2026-09-08T00:00:00Z'), now), null, 'beyond the horizon');
  assert.equal(classifyLiteral(at('2099-01-01T00:00:00Z'), at('2026-09-08T00:00:00Z'), now, 40000), 'TICKING');
  assert.equal(classifyLiteral(Number.NaN, 1, 2), null);
  assert.equal(classifyLiteral(5, undefined, 2), null, 'an unknown commit date reports nothing rather than guessing');
});

test('findings carry file, line, status and distance, using the commit date of that line', () => {
  const source = "const a = '2026-10-08T00:00';\nconst b = '2027-06-01';\nconst c = '2026-10-08T00:00';\n";
  const lineDates = [at('2026-09-08T00:00:00Z'), at('2026-09-08T00:00:00Z'), at('2026-10-20T00:00:00Z')];
  const findings = scanSource('test/x.test.mjs', source, (line) => lineDates[line - 1], at('2026-11-13T00:00:00Z'));
  assert.deepEqual(findings, [
    { file: 'test/x.test.mjs', line: 1, literal: '2026-10-08T00:00', status: 'EXPIRED', authored: '2026-09-08', days: -36 },
    { file: 'test/x.test.mjs', line: 2, literal: '2027-06-01', status: 'TICKING', authored: '2026-09-08', days: 201 }
  ], 'line 3 was committed after its date and is not a bomb');
});

test('end to end against a real git history, including the exit-code gate', () => {
  const repo = mkdtempSync(path.join(tmpdir(), 'timebomb-'));
  const git = (args, env = {}) => execFileSync('git', ['-C', repo, ...args], { env: { ...process.env, ...env }, stdio: 'ignore' });
  git(['init', '-q']);
  git(['config', 'user.email', 'test@example.invalid']);
  git(['config', 'user.name', 'Test']);
  mkdirSync(path.join(repo, 'test'));
  mkdirSync(path.join(repo, 'src'));
  writeFileSync(path.join(repo, 'test', 'deadline.test.mjs'), "const resolveBy = '2026-10-08T00:00';\nconst later = '2027-03-01';\nconst old = '2025-01-01';\n");
  writeFileSync(path.join(repo, 'src', 'app.mjs'), "export const launch = '2026-10-08T00:00';\n");
  const when = '2026-09-08T12:00:00Z';
  git(['add', '-A']);
  git(['commit', '-q', '-m', 'seed'], { GIT_AUTHOR_DATE: when, GIT_COMMITTER_DATE: when });

  const now = at('2026-11-13T00:00:00Z');
  assert.deepEqual(scanRepository(repo, { now }).map((item) => [item.file, item.line, item.status]), [
    ['test/deadline.test.mjs', 1, 'EXPIRED'], ['test/deadline.test.mjs', 2, 'TICKING']
  ]);
  assert.deepEqual(scanRepository(repo, { now: at('2026-09-20T00:00:00Z') }).map((item) => item.status), ['TICKING', 'TICKING']);

  const run = (extra) => {
    try { execFileSync(process.execPath, [script, repo, ...extra], { stdio: 'pipe' }); return 0; } catch (error) { return error.status; }
  };
  assert.equal(run([]), 0, 'reporting alone never fails');
  assert.equal(run(['--fail-on-expired']), 1, 'the gate fails once a written-ahead date has passed');
  assert.equal(run(['--fail-on-expired', '--min-lead-days', '400']), 0);
  assert.equal(run(['--horizon-days', '-1']), 2);
  try { execFileSync(process.execPath, [script], { stdio: 'pipe' }); assert.fail('usage error expected'); } catch (error) { assert.equal(error.status, 2); }
});

test('clock-shift preload moves only the ambient clock, and only when asked', () => {
  const preload = fileURLToPath(new URL('../scripts/clock-shift-preload.mjs', import.meta.url));
  const probe = 'const real = Number(process.env.REAL_NOW); const drift = Math.round((Date.now() - real) / 86400000); const fresh = Math.round((new Date().getTime() - real) / 86400000); console.log(JSON.stringify({ drift, fresh, fixed: new Date("2026-01-02T03:04:05Z").toISOString(), parsed: Date.parse("2026-01-02T03:04:05Z"), isDate: new Date() instanceof Date, name: Date.name }));';
  const run = (days) => JSON.parse(execFileSync(process.execPath, ['--import', preload, '-e', probe], {
    env: { ...process.env, CLOCK_SHIFT_DAYS: days, REAL_NOW: String(Date.now()) }, encoding: 'utf8'
  }));
  const shifted = run('30');
  assert.deepEqual({ drift: shifted.drift, fresh: shifted.fresh }, { drift: 30, fresh: 30 });
  assert.equal(shifted.fixed, '2026-01-02T03:04:05.000Z', 'explicit dates are untouched');
  assert.equal(shifted.parsed, Date.parse('2026-01-02T03:04:05Z'));
  assert.equal(shifted.isDate, true);
  assert.equal(shifted.name, 'Date');
  assert.equal(run('-60').drift, -60);
  assert.equal(run('0').drift, 0);
  assert.throws(() => run('soon'), /Command failed/);
});
