import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const DEFAULT_RULES_PATH = path.resolve(__dirname, 'canonical-rules.json');

export function loadRuleRegistry(customPath = null) {
  const filePath = customPath ? path.resolve(customPath) : DEFAULT_RULES_PATH;
  if (!fs.existsSync(filePath)) {
    throw new Error(`Rule registry file not found: ${filePath}`);
  }
  const raw = fs.readFileSync(filePath, 'utf8');
  let data;
  try {
    data = JSON.parse(raw);
  } catch (err) {
    throw new Error(`Malformed JSON in rule registry file ${filePath}: ${err.message}`);
  }
  validateRuleIndex(data);
  return data;
}

export function validateRuleIndex(data) {
  if (!data || typeof data !== 'object') {
    throw new Error('Rule index must be a non-null object');
  }
  if (typeof data.schema_version !== 'number' || data.schema_version < 1) {
    throw new Error('Rule index must specify integer schema_version >= 1');
  }
  if (!Array.isArray(data.rules)) {
    throw new Error('Rule index must contain a "rules" array');
  }

  const validStatuses = new Set(['canonical', 'superseded', 'historical_evidence']);
  const ruleIds = new Set();

  for (const rule of data.rules) {
    if (!rule || typeof rule !== 'object') {
      throw new Error('Rule item must be an object');
    }
    const requiredFields = ['id', 'title', 'status', 'version', 'source_file', 'summary', 'provenance', 'tags'];
    for (const field of requiredFields) {
      if (!rule[field]) {
        throw new Error(`Rule missing required field "${field}"`);
      }
    }
    if (!/^[a-z0-9-]+$/.test(rule.id)) {
      throw new Error(`Invalid rule id format: "${rule.id}"`);
    }
    if (ruleIds.has(rule.id)) {
      throw new Error(`Duplicate rule id found: "${rule.id}"`);
    }
    ruleIds.add(rule.id);

    if (!validStatuses.has(rule.status)) {
      throw new Error(`Rule "${rule.id}" has invalid status "${rule.status}"`);
    }
    if (!Array.isArray(rule.tags)) {
      throw new Error(`Rule "${rule.id}" tags must be an array`);
    }
    if (typeof rule.provenance !== 'object' || !rule.provenance.origin_document || !rule.provenance.rationale) {
      throw new Error(`Rule "${rule.id}" missing valid provenance object`);
    }
  }

  // Validate supersession links
  for (const rule of data.rules) {
    if (rule.superseded_by) {
      if (!ruleIds.has(rule.superseded_by)) {
        throw new Error(`Rule "${rule.id}" references non-existent superseded_by ID "${rule.superseded_by}"`);
      }
      if (rule.superseded_by === rule.id) {
        throw new Error(`Rule "${rule.id}" cannot be superseded_by itself`);
      }
    }
    if (Array.isArray(rule.supersedes)) {
      for (const supId of rule.supersedes) {
        if (!ruleIds.has(supId)) {
          throw new Error(`Rule "${rule.id}" references non-existent supersedes ID "${supId}"`);
        }
        if (supId === rule.id) {
          throw new Error(`Rule "${rule.id}" cannot supersede itself`);
        }
      }
    }
  }

  return true;
}

export function getCanonicalRules(options = {}, registry = null) {
  const data = registry || loadRuleRegistry();
  const {
    tag = null,
    sourceFile = null,
    query = null,
    includeSuperseded = false,
    includeHistorical = false,
  } = options;

  let candidates = data.rules;

  if (!includeSuperseded) {
    candidates = candidates.filter((r) => r.status !== 'superseded');
  }
  if (!includeHistorical) {
    candidates = candidates.filter((r) => r.status !== 'historical_evidence');
  }

  if (tag) {
    const normTag = tag.toLowerCase();
    candidates = candidates.filter((r) => (r.tags || []).some((t) => t.toLowerCase() === normTag));
  }

  if (sourceFile) {
    const normFile = sourceFile.toLowerCase();
    candidates = candidates.filter((r) => (r.source_file || '').toLowerCase().includes(normFile));
  }

  if (query) {
    const q = query.toLowerCase();
    candidates = candidates.filter((r) =>
      r.id.toLowerCase().includes(q) ||
      r.title.toLowerCase().includes(q) ||
      r.summary.toLowerCase().includes(q) ||
      (r.tags || []).some((t) => t.toLowerCase().includes(q))
    );
  }

  // Current-view preference:
  // If includeSuperseded was requested along with a query, prefer canonical rules
  // and rank canonical active rules ahead of superseded/historical entries.
  return candidates.sort((a, b) => {
    const rank = { canonical: 0, historical_evidence: 1, superseded: 2 };
    return (rank[a.status] ?? 3) - (rank[b.status] ?? 3);
  });
}

export function getRuleById(id, registry = null) {
  const data = registry || loadRuleRegistry();
  const rule = data.rules.find((r) => r.id === id);
  if (!rule) {
    return null;
  }

  const result = { ...rule };
  if (rule.superseded_by) {
    result.superseded_by_rule = data.rules.find((r) => r.id === rule.superseded_by) || null;
  }
  if (Array.isArray(rule.supersedes) && rule.supersedes.length > 0) {
    result.supersedes_rules = data.rules.filter((r) => rule.supersedes.includes(r.id));
  }

  return result;
}

export function detectStalePolicy(inputContentOrPath, options = {}, registry = null) {
  const data = registry || loadRuleRegistry();
  let text = inputContentOrPath;

  if (typeof inputContentOrPath === 'string' && fs.existsSync(inputContentOrPath) && fs.statSync(inputContentOrPath).isFile()) {
    text = fs.readFileSync(inputContentOrPath, 'utf8');
  }

  if (typeof text !== 'string') {
    return [];
  }

  const findings = [];

  // 1. Search for deprecated pattern strings registered across rules
  for (const rule of data.rules) {
    const canonicalReplacement = rule.status === 'superseded' && rule.superseded_by
      ? data.rules.find((r) => r.id === rule.superseded_by)
      : (rule.status === 'canonical' ? rule : null);

    const patterns = Array.isArray(rule.deprecated_patterns) ? rule.deprecated_patterns : [];

    for (const pattern of patterns) {
      if (text.includes(pattern)) {
        findings.push({
          ruleId: rule.id,
          status: rule.status,
          canonicalRuleId: canonicalReplacement ? canonicalReplacement.id : null,
          patternMatched: pattern,
          severity: 'error',
          message: `Detected stale policy / deprecated pattern "${pattern}". Superseded or deprecated guidance must not be presented as active guidance. Current canonical rule: ${canonicalReplacement ? canonicalReplacement.id + ' (' + canonicalReplacement.title + ')' : 'N/A'}.`
        });
      }
    }

    // 2. Search for explicit references to superseded rule IDs when not qualified with historical context
    if (rule.status === 'superseded') {
      const ruleIdRegex = new RegExp(`\\b${rule.id}\\b`, 'g');
      if (ruleIdRegex.test(text)) {
        // Check if text explicitly notes it is superseded or historical
        const hasDisclaimer = /superseded|deprecated|historical|former/i.test(text);
        if (!hasDisclaimer) {
          findings.push({
            ruleId: rule.id,
            status: rule.status,
            canonicalRuleId: canonicalReplacement ? canonicalReplacement.id : null,
            patternMatched: rule.id,
            severity: 'warning',
            message: `Text references superseded rule ID "${rule.id}" without explicit supersession disclaimer. Current canonical rule: ${canonicalReplacement ? canonicalReplacement.id : 'N/A'}.`
          });
        }
      }
    }
  }

  return findings;
}

// CLI Interface
if (process.argv[1] && path.resolve(process.argv[1]) === __filename) {
  const args = process.argv.slice(2);

  if (args.includes('--validate')) {
    try {
      loadRuleRegistry();
      console.log('Rule registry validation: OK');
    } catch (err) {
      console.error(`Rule registry validation failed: ${err.message}`);
      process.exit(1);
    }
  } else if (args.includes('--list')) {
    const rules = getCanonicalRules();
    console.log(`Canonical Rules (${rules.length}):\n`);
    for (const r of rules) {
      console.log(`- [${r.id}] ${r.title} (Source: ${r.source_file})`);
      console.log(`  Summary: ${r.summary}\n`);
    }
  } else if (args.includes('--query')) {
    const idx = args.indexOf('--query');
    const q = args[idx + 1] || '';
    const rules = getCanonicalRules({ query: q });
    console.log(`Canonical Rules matching "${q}" (${rules.length}):\n`);
    for (const r of rules) {
      console.log(`- [${r.id}] ${r.title} (${r.status})`);
      console.log(`  Source: ${r.source_file}`);
      console.log(`  Summary: ${r.summary}\n`);
    }
  } else if (args.includes('--rule')) {
    const idx = args.indexOf('--rule');
    const id = args[idx + 1] || '';
    const rule = getRuleById(id);
    if (!rule) {
      console.error(`Rule not found: ${id}`);
      process.exit(1);
    }
    console.log(JSON.stringify(rule, null, 2));
  } else if (args.includes('--check')) {
    const idx = args.indexOf('--check');
    const target = args[idx + 1];
    if (!target) {
      console.error('Usage: node scripts/resolve-rules.mjs --check <file|text>');
      process.exit(1);
    }
    const findings = detectStalePolicy(target);
    if (findings.length === 0) {
      console.log('Stale-policy check passed: No superseded or deprecated patterns detected.');
    } else {
      console.error(`Stale-policy guard triggered (${findings.length} findings):\n`);
      for (const f of findings) {
        console.error(`- [${f.severity.toUpperCase()}] ${f.message}`);
      }
      process.exit(1);
    }
  } else {
    console.log('Usage: node scripts/resolve-rules.mjs [--list] [--query <text>] [--rule <id>] [--check <file>] [--validate]');
  }
}
