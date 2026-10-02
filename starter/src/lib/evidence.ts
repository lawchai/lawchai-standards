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

export interface EvidenceDiffItem {
  record: EvidenceRecord;
  changeType: 'ADDED' | 'REMOVED' | 'MODIFIED' | 'UNCHANGED';
  previousStatus?: EvidenceStatus;
  newStatus?: EvidenceStatus;
}

export interface EvidenceComparisonResult {
  added: EvidenceRecord[];
  removed: EvidenceRecord[];
  modified: EvidenceDiffItem[];
  unchanged: EvidenceRecord[];
  totalPrevious: number;
  totalCurrent: number;
}

export function compareEvidenceLists(
  previous: EvidenceRecord[],
  current: EvidenceRecord[]
): EvidenceComparisonResult {
  const prevMap = new Map<string, EvidenceRecord>();
  for (const p of previous) {
    prevMap.set(p.id, p);
  }

  const currMap = new Map<string, EvidenceRecord>();
  for (const c of current) {
    currMap.set(c.id, c);
  }

  const added: EvidenceRecord[] = [];
  const removed: EvidenceRecord[] = [];
  const modified: EvidenceDiffItem[] = [];
  const unchanged: EvidenceRecord[] = [];

  for (const c of current) {
    if (!prevMap.has(c.id)) {
      added.push(c);
    } else {
      const p = prevMap.get(c.id)!;
      if (p.status !== c.status || p.label !== c.label) {
        modified.push({
          record: c,
          changeType: 'MODIFIED',
          previousStatus: p.status,
          newStatus: c.status,
        });
      } else {
        unchanged.push(c);
      }
    }
  }

  for (const p of previous) {
    if (!currMap.has(p.id)) {
      removed.push(p);
    }
  }

  return {
    added,
    removed,
    modified,
    unchanged,
    totalPrevious: previous.length,
    totalCurrent: current.length,
  };
}

export function transitionEvidenceStatus(
  record: EvidenceRecord,
  newStatus: EvidenceStatus,
  reason: string,
  reviewer = 'user-reviewer'
): EvidenceRecord {
  return {
    ...record,
    status: newStatus,
    details: {
      ...(record.details || {}),
      previousStatus: record.status,
      transitionReason: reason,
      transitionedBy: reviewer,
      transitionedAt: new Date().toISOString(),
    },
  };
}
