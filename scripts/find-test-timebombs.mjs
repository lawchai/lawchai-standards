#!/usr/bin/env node
// Finds "time-bomb" date literals in test files: a quoted calendar date that was still in the
// future when its line was committed. Such a test passes on the day it is written and starts
// failing, with no code change, once the calendar passes the date.
//
//   node scripts/find-test-timebombs.mjs <repo-dir> [<repo-dir> ...] [--json] [--horizon-days N] [--min-lead-days N] [--fail-on-expired]
//
// EXPIRED  the date was in the future when written and has since passed — check whether the
//          test still passes today.
// TICKING  the date is still in the future — it will flip on that day.
//
// A finding is a candidate for review, not proof of a defect: a test that injects its own
// clock can use a fixed future date safely. Read-only: runs `git blame` and reads files.
import { execFileSync } from 'node:child_process';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const DAY_MS = 24 * 60 * 60 * 1000;
export const DEFAULT_HORIZON_DAYS = 730;
// A fixture clock set a day or two ahead of the commit is common and harmless; a deadline is
// usually set further out. Literals closer than this to their commit date are ignored.
export const DEFAULT_MIN_LEAD_DAYS = 7;
const SKIP_DIRS = new Set(['.git', 'node_modules', 'dist', 'build', 'coverage', '.wrangler', 'vendor', 'artifacts', '.next', 'out']);
const TEST_EXTENSIONS = /\.(?:[cm]?[jt]sx?|py)$/;
const DATE_LITERAL = /(['"`])(20\d{2}-(?:0[1-9]|1[0-2])-(?:0[1-9]|[12]\d|3[01])(?:[T ](?:[01]\d|2[0-3]):[0-5]\d(?::[0-5]\d(?:\.\d{1,3})?)?(?:Z|[+-]\d{2}:?\d{2})?)?)\1/g;

export function isTestFile(relativePath) {
  const normal = relativePath.split(path.sep).join('/');
  if (!TEST_EXTENSIONS.test(normal)) return false;
  return /(?:^|\/)(?:tests?|__tests__|e2e|spec)\//.test(normal) || /\.(?:test|spec)\.[cm]?[jt]sx?$/.test(normal) || /(?:^|\/)test_[^/]+\.py$/.test(normal);
}

// Epoch milliseconds for a date literal. A bare date counts as the end of that day in UTC,
// so a deadline of "2026-10-08" is not reported as expired during 2026-10-08.
export function literalToEpoch(literal) {
  const dateOnly = /^\d{4}-\d{2}-\d{2}$/.test(literal);
  const hasZone = /(?:Z|[+-]\d{2}:?\d{2})$/.test(literal);
  const iso = dateOnly ? `${literal}T23:59:59.999Z` : `${literal.replace(' ', 'T')}${hasZone ? '' : 'Z'}`;
  const value = Date.parse(iso);
  if (!Number.isFinite(value)) return null;
  // Reject impossible calendar dates such as 2026-02-31 that Date.parse rolls over.
  const [year, month, day] = literal.slice(0, 10).split('-').map(Number);
  const check = new Date(Date.UTC(year, month - 1, day));
  if (check.getUTCMonth() !== month - 1 || check.getUTCDate() !== day) return null;
  return value;
}

export function findDateLiterals(source) {
  const found = [];
  source.split('\n').forEach((line, index) => {
    for (const match of line.matchAll(DATE_LITERAL)) {
      const epoch = literalToEpoch(match[2]);
      if (epoch !== null) found.push({ line: index + 1, literal: match[2], epoch });
    }
  });
  return found;
}

// authoredMs: when the line was committed. Returns null when the literal was already in the
// past at that moment (an ordinary fixed fixture), or lies beyond the horizon.
export function classifyLiteral(epoch, authoredMs, nowMs, horizonDays = DEFAULT_HORIZON_DAYS, minLeadDays = DEFAULT_MIN_LEAD_DAYS) {
  if (![epoch, authoredMs, nowMs].every(Number.isFinite)) return null;
  if (epoch - authoredMs < minLeadDays * DAY_MS) return null;
  if (epoch <= nowMs) return 'EXPIRED';
  return epoch - nowMs <= horizonDays * DAY_MS ? 'TICKING' : null;
}

export function scanSource(relativePath, source, lineDateMs, nowMs, horizonDays = DEFAULT_HORIZON_DAYS, minLeadDays = DEFAULT_MIN_LEAD_DAYS) {
  const findings = [];
  for (const item of findDateLiterals(source)) {
    const authored = lineDateMs(item.line);
    const status = classifyLiteral(item.epoch, authored, nowMs, horizonDays, minLeadDays);
    if (!status) continue;
    findings.push({
      file: relativePath,
      line: item.line,
      literal: item.literal,
      status,
      authored: new Date(authored).toISOString().slice(0, 10),
      days: Math.round((item.epoch - nowMs) / DAY_MS)
    });
  }
  return findings;
}

function listTestFiles(root) {
  const files = [];
  const walk = (dir) => {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      if (entry.isSymbolicLink()) continue;
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        if (!SKIP_DIRS.has(entry.name)) walk(full);
      } else if (entry.isFile()) {
        const relative = path.relative(root, full);
        if (isTestFile(relative) && statSync(full).size <= 2 * 1024 * 1024) files.push(relative);
      }
    }
  };
  walk(root);
  return files.sort();
}

// committer-time per line from `git blame --line-porcelain`. In a shallow clone, lines older
// than the shallow boundary are attributed to the boundary commit, so old bombs can be missed.
function blameLineDates(root, relativePath) {
  let output;
  try {
    output = execFileSync('git', ['-C', root, 'blame', '--line-porcelain', '--', relativePath], { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024, stdio: ['ignore', 'pipe', 'ignore'] });
  } catch {
    return null;
  }
  const dates = [];
  let current = null;
  for (const line of output.split('\n')) {
    if (line.startsWith('committer-time ')) current = Number(line.slice(15)) * 1000;
    else if (line.startsWith('\t')) dates.push(current);
  }
  return dates;
}

export function scanRepository(root, options = {}) {
  const nowMs = options.now ?? Date.now();
  const horizonDays = options.horizonDays ?? DEFAULT_HORIZON_DAYS;
  const minLeadDays = options.minLeadDays ?? DEFAULT_MIN_LEAD_DAYS;
  const findings = [];
  for (const relative of listTestFiles(root)) {
    const source = readFileSync(path.join(root, relative), 'utf8');
    if (!DATE_LITERAL.test(source)) { DATE_LITERAL.lastIndex = 0; continue; }
    DATE_LITERAL.lastIndex = 0;
    const dates = blameLineDates(root, relative);
    if (!dates) continue;
    findings.push(...scanSource(relative, source, (line) => dates[line - 1], nowMs, horizonDays, minLeadDays));
  }
  return findings;
}

function main(argv) {
  const roots = [];
  const options = { json: false, failOnExpired: false, horizonDays: DEFAULT_HORIZON_DAYS, minLeadDays: DEFAULT_MIN_LEAD_DAYS };
  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === '--json') options.json = true;
    else if (arg === '--fail-on-expired') options.failOnExpired = true;
    else if (arg === '--horizon-days') { options.horizonDays = Number(argv[index + 1]); index += 1; }
    else if (arg === '--min-lead-days') { options.minLeadDays = Number(argv[index + 1]); index += 1; }
    else roots.push(arg);
  }
  if (!roots.length || !Number.isFinite(options.horizonDays) || options.horizonDays < 0 || !Number.isFinite(options.minLeadDays) || options.minLeadDays < 0) {
    process.stderr.write('usage: find-test-timebombs.mjs <repo-dir> [...] [--json] [--horizon-days N] [--min-lead-days N] [--fail-on-expired]\n');
    return 2;
  }
  const report = roots.map((root) => ({ repository: path.basename(path.resolve(root)), findings: scanRepository(path.resolve(root), options) }));
  if (options.json) {
    process.stdout.write(JSON.stringify(report, null, 2) + '\n');
  } else {
    for (const { repository, findings } of report) {
      for (const item of findings) {
        const when = item.status === 'EXPIRED' ? `passed ${-item.days} day(s) ago` : `in ${item.days} day(s)`;
        process.stdout.write(`${item.status}\t${repository}\t${item.file}:${item.line}\t${item.literal}\t${when}\twritten ${item.authored}\n`);
      }
    }
    const all = report.flatMap((entry) => entry.findings);
    process.stderr.write(`${all.filter((item) => item.status === 'EXPIRED').length} expired, ${all.filter((item) => item.status === 'TICKING').length} ticking, in ${report.length} repositor${report.length === 1 ? 'y' : 'ies'}\n`);
  }
  const expired = report.some((entry) => entry.findings.some((item) => item.status === 'EXPIRED'));
  return options.failOnExpired && expired ? 1 : 0;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  process.exit(main(process.argv.slice(2)));
}
