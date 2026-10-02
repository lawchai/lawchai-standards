import { describe, it, expect } from 'vitest';
import {
  createEvidenceRecord,
  summarizeEvidence,
  isExplicitlyTruthful,
  compareEvidenceLists,
  transitionEvidenceStatus,
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

  it('compares evidence lists identifying added, removed, modified, and unchanged items', () => {
    const rec1 = createEvidenceRecord('1', 'UNKNOWN', 'Fact 1');
    const rec2 = createEvidenceRecord('2', 'SYNTHETIC', 'Fact 2');
    const rec3 = createEvidenceRecord('3', 'OBSERVED', 'Fact 3');

    const previous = [rec1, rec2];
    const rec1Modified = { ...rec1, status: 'KNOWN' as const };
    const current = [rec1Modified, rec3];

    const diff = compareEvidenceLists(previous, current);
    expect(diff.added).toHaveLength(1);
    expect(diff.added[0].id).toBe('3');
    expect(diff.removed).toHaveLength(1);
    expect(diff.removed[0].id).toBe('2');
    expect(diff.modified).toHaveLength(1);
    expect(diff.modified[0].previousStatus).toBe('UNKNOWN');
    expect(diff.modified[0].newStatus).toBe('KNOWN');
  });

  it('transitions evidence status recording provenance details', () => {
    const original = createEvidenceRecord('1', 'UNKNOWN', 'Unverified fact');
    const transitioned = transitionEvidenceStatus(original, 'KNOWN', 'Verified via document audit', 'auditor-1');

    expect(transitioned.status).toBe('KNOWN');
    expect(transitioned.details?.previousStatus).toBe('UNKNOWN');
    expect(transitioned.details?.transitionReason).toBe('Verified via document audit');
    expect(transitioned.details?.transitionedBy).toBe('auditor-1');
  });
});
