import { describe, it, expect } from 'vitest';
import {
  createEvidenceRecord,
  summarizeEvidence,
  isExplicitlyTruthful,
  filterEvidenceBySource,
  validateEvidenceRecord,
  getTruthfulEvidenceRatio,
} from '../src/lib/evidence';

describe('Evidence Baseline Primitives', () => {
  it('creates evidence records with expected fields', () => {
    const record = createEvidenceRecord('rec-1', 'OBSERVED', 'Observed user interaction', 'test-runner');
    expect(record.id).toBe('rec-1');
    expect(record.status).toBe('OBSERVED');
    expect(record.label).toBe('Observed user interaction');
    expect(record.source).toBe('test-runner');
    expect(record.recordedAt).toBeDefined();
  });

  it('correctly categorizes truthful vs non-truthful/synthetic evidence', () => {
    const knownRec = createEvidenceRecord('1', 'KNOWN', 'Known fact');
    const synthRec = createEvidenceRecord('2', 'SYNTHETIC', 'Synthetic fixture');

    expect(isExplicitlyTruthful(knownRec)).toBe(true);
    expect(isExplicitlyTruthful(synthRec)).toBe(false);
  });

  it('summarizes evidence status counts', () => {
    const records = [
      createEvidenceRecord('1', 'KNOWN', 'Fact A'),
      createEvidenceRecord('2', 'KNOWN', 'Fact B'),
      createEvidenceRecord('3', 'UNKNOWN', 'Unknown C'),
      createEvidenceRecord('4', 'SYNTHETIC', 'Synthetic D'),
    ];

    const summary = summarizeEvidence(records);
    expect(summary.KNOWN).toBe(2);
    expect(summary.UNKNOWN).toBe(1);
    expect(summary.SYNTHETIC).toBe(1);
    expect(summary.OBSERVED).toBe(0);
  });

  it('filters evidence records by source', () => {
    const records = [
      createEvidenceRecord('1', 'KNOWN', 'Fact A', 'system-log'),
      createEvidenceRecord('2', 'OBSERVED', 'Fact B', 'user-input'),
      createEvidenceRecord('3', 'DERIVED', 'Fact C', 'system-log'),
    ];

    const sysLogs = filterEvidenceBySource(records, 'system-log');
    expect(sysLogs).toHaveLength(2);
    expect(sysLogs.map((r) => r.id)).toEqual(['1', '3']);
  });

  it('validates evidence records structure', () => {
    const valid = createEvidenceRecord('1', 'KNOWN', 'Fact A', 'user-input');
    expect(validateEvidenceRecord(valid)).toBe(true);

    expect(validateEvidenceRecord(null)).toBe(false);
    expect(validateEvidenceRecord({ id: '', status: 'KNOWN' })).toBe(false);
    expect(validateEvidenceRecord({ id: '1', status: 'INVALID_STATUS', label: 'x', source: 'y', recordedAt: 'z' })).toBe(false);
  });

  it('calculates truthful evidence ratio', () => {
    expect(getTruthfulEvidenceRatio([])).toBe(0);

    const records = [
      createEvidenceRecord('1', 'KNOWN', 'Fact A'),
      createEvidenceRecord('2', 'OBSERVED', 'Fact B'),
      createEvidenceRecord('3', 'SYNTHETIC', 'Fact C'),
      createEvidenceRecord('4', 'HYPOTHESIS', 'Fact D'),
    ];

    expect(getTruthfulEvidenceRatio(records)).toBe(0.5);
  });
});
