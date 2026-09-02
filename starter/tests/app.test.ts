import { describe, it, expect } from 'vitest';
import { createEvidenceRecord, summarizeEvidence, isExplicitlyTruthful } from '../src/lib/evidence';

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
});
