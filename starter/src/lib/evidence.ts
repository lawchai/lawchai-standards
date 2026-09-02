export type EvidenceStatus =
  | 'KNOWN'
  | 'UNKNOWN'
  | 'SYNTHETIC'
  | 'OBSERVED'
  | 'DERIVED'
  | 'HYPOTHESIS';

export interface EvidenceRecord {
  id: string;
  status: EvidenceStatus;
  label: string;
  source: string;
  recordedAt: string;
  details?: Record<string, unknown>;
}

export function createEvidenceRecord(
  id: string,
  status: EvidenceStatus,
  label: string,
  source = 'user-input',
  details?: Record<string, unknown>
): EvidenceRecord {
  return {
    id,
    status,
    label,
    source,
    recordedAt: new Date().toISOString(),
    details,
  };
}

export function filterEvidenceByStatus(
  records: EvidenceRecord[],
  status: EvidenceStatus
): EvidenceRecord[] {
  return records.filter((r) => r.status === status);
}

export function isExplicitlyTruthful(record: EvidenceRecord): boolean {
  return record.status === 'KNOWN' || record.status === 'OBSERVED';
}

export function summarizeEvidence(records: EvidenceRecord[]): Record<EvidenceStatus, number> {
  const summary: Record<EvidenceStatus, number> = {
    KNOWN: 0,
    UNKNOWN: 0,
    SYNTHETIC: 0,
    OBSERVED: 0,
    DERIVED: 0,
    HYPOTHESIS: 0,
  };

  for (const record of records) {
    if (record.status in summary) {
      summary[record.status]++;
    }
  }

  return summary;
}
