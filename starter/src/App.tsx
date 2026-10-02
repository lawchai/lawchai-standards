import React, { useState, useEffect } from 'react';
import { LocalStorageManager } from './lib/storage';
import {
  createEvidenceRecord,
  EvidenceRecord,
  EvidenceStatus,
  summarizeEvidence,
  isExplicitlyTruthful,
  compareEvidenceLists,
  transitionEvidenceStatus,
} from './lib/evidence';
import productContract from '../product-contract.json';

interface AppState {
  inputQuery: string;
  evidenceList: EvidenceRecord[];
  baselineSnapshot: EvidenceRecord[];
}

const initialBaseline: EvidenceRecord[] = [
  createEvidenceRecord('e-1', 'SYNTHETIC', 'Sample Synthetic Baseline Record', 'system-init'),
  createEvidenceRecord('e-2', 'UNKNOWN', 'Unverified Initial State', 'system-init'),
];

const storage = new LocalStorageManager<AppState>({
  key: 'lawchai_starter_state_v1',
  version: 1,
  defaultValue: {
    inputQuery: '',
    evidenceList: initialBaseline,
    baselineSnapshot: initialBaseline,
  },
});

export const App: React.FC = () => {
  const [state, setState] = useState<AppState>(() => storage.load());
  const [activeTab, setActiveTab] = useState<'journey' | 'evidence' | 'review' | 'recovery'>('journey');
  const [importText, setImportText] = useState('');
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [transitionReason, setTransitionReason] = useState<{ [id: string]: string }>({});

  useEffect(() => {
    storage.save(state);
  }, [state]);

  const handleAddEvidence = () => {
    if (!state.inputQuery.trim()) return;
    const newRecord = createEvidenceRecord(
      `e-${Date.now()}`,
      'OBSERVED',
      state.inputQuery,
      'user-interactive'
    );
    setState((prev) => ({
      ...prev,
      inputQuery: '',
      evidenceList: [newRecord, ...prev.evidenceList],
    }));
    setFeedback({ type: 'success', text: 'New observation recorded to local evidence ledger.' });
  };

  const handleTransition = (record: EvidenceRecord, targetStatus: EvidenceStatus) => {
    const reason = transitionReason[record.id] || 'Manual review update';
    const updated = transitionEvidenceStatus(record, targetStatus, reason, 'compliance-reviewer');

    setState((prev) => ({
      ...prev,
      evidenceList: prev.evidenceList.map((item) => (item.id === record.id ? updated : item)),
    }));
    setFeedback({
      type: 'success',
      text: `Record "${record.label}" status transitioned to ${targetStatus}.`,
    });
  };

  const handleCaptureSnapshot = () => {
    setState((prev) => ({
      ...prev,
      baselineSnapshot: [...prev.evidenceList],
    }));
    setFeedback({ type: 'success', text: 'Baseline comparison snapshot updated to current evidence state.' });
  };

  const handleExport = () => {
    const jsonStr = storage.exportJSON();
    navigator.clipboard?.writeText(jsonStr);
    setFeedback({ type: 'success', text: 'State JSON exported and copied to clipboard.' });
  };

  const handleImport = () => {
    if (!importText.trim()) {
      setFeedback({ type: 'error', text: 'Please paste a valid state JSON string before importing.' });
      return;
    }
    const success = storage.importJSON(importText);
    if (success) {
      const loaded = storage.load();
      setState(loaded);
      setImportText('');
      setFeedback({ type: 'success', text: 'State successfully imported and reloaded from storage.' });
    } else {
      setFeedback({ type: 'error', text: 'Import failed. JSON format or schema is invalid.' });
    }
  };

  const handleReset = () => {
    storage.reset();
    setState(storage.load());
    setFeedback({ type: 'success', text: 'Local state reset to default product contract baseline.' });
  };

  const summary = summarizeEvidence(state.evidenceList);
  const truthfulCount = state.evidenceList.filter(isExplicitlyTruthful).length;
  const comparison = compareEvidenceLists(state.baselineSnapshot || [], state.evidenceList);

  return (
    <div style={{ maxWidth: '840px', margin: '0 auto', padding: '2rem', fontFamily: 'system-ui, -apple-system, sans-serif', color: '#0f172a' }}>
      {/* Standards & Version-Aware Header */}
      <header style={{ borderBottom: '1px solid #cbd5e1', paddingBottom: '1rem', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.5rem' }}>
          <div>
            <h1 style={{ fontSize: '1.75rem', margin: 0, fontWeight: 700, color: '#0f172a' }}>{productContract.title}</h1>
            <p style={{ margin: '0.25rem 0 0', color: '#475569', fontSize: '0.95rem' }}>{productContract.purpose}</p>
          </div>
          <span style={{ fontSize: '0.75rem', background: '#e2e8f0', padding: '0.25rem 0.5rem', borderRadius: '0.25rem', fontFamily: 'monospace' }}>
            Risk Class: <strong>{productContract.risk_class.toUpperCase()}</strong>
          </span>
        </div>

        {/* Standards & Ledger Compliance Bar */}
        <div
          style={{
            marginTop: '1rem',
            padding: '0.75rem 1rem',
            background: '#f8fafc',
            border: '1px solid #e2e8f0',
            borderRadius: '0.375rem',
            fontSize: '0.85rem',
            display: 'flex',
            flexWrap: 'wrap',
            gap: '1rem',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <div>
            <span>Standards SHA: <code style={{ fontFamily: 'monospace' }}>{productContract.standards_sha.slice(0, 10)}...</code></span>
            <span style={{ marginLeft: '1rem' }}>Schema: <strong>v{productContract.schema_version}</strong></span>
          </div>
          <div>
            <span>Truthful Evidence: <strong className="lc-data">{truthfulCount}</strong> / {state.evidenceList.length}</span>
          </div>
        </div>
      </header>

      {/* Interactive Feedback Notification */}
      {feedback && (
        <div
          style={{
            padding: '0.75rem 1rem',
            marginBottom: '1rem',
            borderRadius: '0.375rem',
            fontSize: '0.875rem',
            background: feedback.type === 'success' ? '#f0fdf4' : '#fef2f2',
            border: `1px solid ${feedback.type === 'success' ? '#bbf7d0' : '#fecaca'}`,
            color: feedback.type === 'success' ? '#166534' : '#991b1b',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <span>{feedback.text}</span>
          <button
            onClick={() => setFeedback(null)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', minHeight: '32px', color: 'inherit' }}
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Navigation Bar */}
      <nav style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        {[
          { id: 'journey', label: 'Primary Journey' },
          { id: 'evidence', label: `Evidence Ledger (${state.evidenceList.length})` },
          { id: 'review', label: 'Compare & Review' },
          { id: 'recovery', label: 'Recovery & Export' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            style={{
              padding: '0.625rem 1.25rem',
              minHeight: '44px',
              borderRadius: '0.375rem',
              border: '1px solid ' + (activeTab === tab.id ? '#2563eb' : '#cbd5e1'),
              background: activeTab === tab.id ? '#2563eb' : '#ffffff',
              color: activeTab === tab.id ? '#ffffff' : '#1e293b',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      {/* Tab 1: Primary Journey */}
      {activeTab === 'journey' && (
        <section style={{ background: '#f8fafc', padding: '1.5rem', borderRadius: '0.5rem', border: '1px solid #e2e8f0' }}>
          <h2 style={{ fontSize: '1.25rem', margin: '0 0 1rem', color: '#0f172a' }}>Record Primary Observation</h2>
          <p style={{ fontSize: '0.875rem', color: '#475569', marginBottom: '1rem' }}>
            Enter verifiable factual observations. Observed input is recorded into the local evidence ledger under the <code>OBSERVED</code> truth classification.
          </p>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            <input
              type="text"
              value={state.inputQuery}
              onChange={(e) => setState((prev) => ({ ...prev, inputQuery: e.target.value }))}
              placeholder="Enter observed evidence detail..."
              style={{
                flex: 1,
                minWidth: '240px',
                minHeight: '44px',
                padding: '0.5rem 0.75rem',
                borderRadius: '0.375rem',
                border: '1px solid #cbd5e1',
                fontSize: '1rem',
              }}
            />
            <button
              onClick={handleAddEvidence}
              style={{
                minHeight: '44px',
                padding: '0.5rem 1.25rem',
                backgroundColor: '#16a34a',
                color: '#fff',
                border: 'none',
                borderRadius: '0.375rem',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Add Record
            </button>
          </div>
        </section>
      )}

      {/* Tab 2: Evidence Ledger */}
      {activeTab === 'evidence' && (
        <section>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
            {Object.entries(summary).map(([status, count]) => (
              <span
                key={status}
                style={{
                  background: '#f1f5f9',
                  border: '1px solid #cbd5e1',
                  padding: '0.375rem 0.75rem',
                  borderRadius: '0.375rem',
                  fontSize: '0.875rem',
                }}
              >
                {status}: <strong className="lc-data">{count}</strong>
              </span>
            ))}
          </div>

          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {state.evidenceList.map((item) => (
              <li
                key={item.id}
                style={{
                  border: '1px solid #e2e8f0',
                  padding: '1rem',
                  borderRadius: '0.375rem',
                  marginBottom: '0.75rem',
                  background: '#ffffff',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
                  <strong style={{ fontSize: '1rem' }}>{item.label}</strong>
                  <span
                    style={{
                      fontSize: '0.75rem',
                      fontWeight: 'bold',
                      padding: '0.25rem 0.5rem',
                      borderRadius: '0.25rem',
                      background: item.status === 'SYNTHETIC' ? '#fef08a' : isExplicitlyTruthful(item) ? '#bbf7d0' : '#e2e8f0',
                      color: item.status === 'SYNTHETIC' ? '#713f12' : isExplicitlyTruthful(item) ? '#14532d' : '#334155',
                    }}
                  >
                    {item.status}
                  </span>
                </div>
                <div style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '0.5rem' }}>
                  Source: <strong>{item.source}</strong> | Recorded: <span className="lc-data">{item.recordedAt}</span>
                </div>
                {item.details?.previousStatus && (
                  <div style={{ fontSize: '0.8rem', color: '#475569', marginTop: '0.25rem', background: '#f8fafc', padding: '0.375rem', borderRadius: '0.25rem' }}>
                    Transition: {String(item.details.previousStatus)} &rarr; {item.status} | Reason: {String(item.details.transitionReason)}
                  </div>
                )}
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Tab 3: Compare & Review */}
      {activeTab === 'review' && (
        <section style={{ background: '#f8fafc', padding: '1.5rem', borderRadius: '0.5rem', border: '1px solid #e2e8f0' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
            <h2 style={{ fontSize: '1.25rem', margin: 0 }}>Compliance &amp; Snapshot Review</h2>
            <button
              onClick={handleCaptureSnapshot}
              style={{
                minHeight: '44px',
                padding: '0.5rem 1rem',
                background: '#0284c7',
                color: '#ffffff',
                border: 'none',
                borderRadius: '0.375rem',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Update Baseline Snapshot
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.75rem', marginBottom: '1.5rem' }}>
            <div style={{ background: '#ffffff', padding: '0.75rem', borderRadius: '0.375rem', border: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Added Records</div>
              <div style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#16a34a' }}>{comparison.added.length}</div>
            </div>
            <div style={{ background: '#ffffff', padding: '0.75rem', borderRadius: '0.375rem', border: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Removed Records</div>
              <div style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#dc2626' }}>{comparison.removed.length}</div>
            </div>
            <div style={{ background: '#ffffff', padding: '0.75rem', borderRadius: '0.375rem', border: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Modified Statuses</div>
              <div style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#d97706' }}>{comparison.modified.length}</div>
            </div>
            <div style={{ background: '#ffffff', padding: '0.75rem', borderRadius: '0.375rem', border: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Unchanged</div>
              <div style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#475569' }}>{comparison.unchanged.length}</div>
            </div>
          </div>

          <h3 style={{ fontSize: '1rem', marginBottom: '0.75rem' }}>Status Review &amp; Compliance Transition</h3>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {state.evidenceList.map((item) => (
              <li key={item.id} style={{ background: '#ffffff', padding: '1rem', border: '1px solid #e2e8f0', borderRadius: '0.375rem', marginBottom: '0.75rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                  <strong>{item.label}</strong>
                  <span style={{ fontSize: '0.8rem', background: '#e2e8f0', padding: '0.2rem 0.5rem', borderRadius: '0.25rem' }}>{item.status}</span>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
                  <input
                    type="text"
                    placeholder="Review note / transition reason..."
                    value={transitionReason[item.id] || ''}
                    onChange={(e) => setTransitionReason((prev) => ({ ...prev, [item.id]: e.target.value }))}
                    style={{ flex: 1, minWidth: '180px', minHeight: '44px', padding: '0.25rem 0.5rem', border: '1px solid #cbd5e1', borderRadius: '0.25rem', fontSize: '0.875rem' }}
                  />
                  {(['KNOWN', 'UNKNOWN', 'OBSERVED', 'SYNTHETIC'] as EvidenceStatus[]).map((st) => (
                    <button
                      key={st}
                      disabled={item.status === st}
                      onClick={() => handleTransition(item, st)}
                      style={{
                        minHeight: '44px',
                        padding: '0.25rem 0.5rem',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        border: '1px solid #cbd5e1',
                        borderRadius: '0.25rem',
                        background: item.status === st ? '#e2e8f0' : '#ffffff',
                        cursor: item.status === st ? 'default' : 'pointer',
                      }}
                    >
                      To {st}
                    </button>
                  ))}
                </div>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Tab 4: Recovery & Export */}
      {activeTab === 'recovery' && (
        <section style={{ background: '#f8fafc', padding: '1.5rem', borderRadius: '0.5rem', border: '1px solid #e2e8f0' }}>
          <h2 style={{ fontSize: '1.25rem', margin: '0 0 1rem' }}>State Import, Export &amp; Reset Recovery</h2>

          <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
            <button
              onClick={handleExport}
              style={{
                minHeight: '44px',
                padding: '0.5rem 1.25rem',
                background: '#2563eb',
                color: '#ffffff',
                border: 'none',
                borderRadius: '0.375rem',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Export JSON State
            </button>
            <button
              onClick={handleReset}
              style={{
                minHeight: '44px',
                padding: '0.5rem 1.25rem',
                background: '#ef4444',
                color: '#ffffff',
                border: 'none',
                borderRadius: '0.375rem',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Reset Persistence
            </button>
          </div>

          <div style={{ borderTop: '1px solid #cbd5e1', paddingTop: '1rem' }}>
            <h3 style={{ fontSize: '1rem', margin: '0 0 0.5rem' }}>Import Local Storage JSON State</h3>
            <textarea
              rows={5}
              value={importText}
              onChange={(e) => setImportText(e.target.value)}
              placeholder="Paste state JSON envelope here..."
              style={{
                width: '100%',
                padding: '0.5rem',
                fontFamily: 'monospace',
                fontSize: '0.85rem',
                borderRadius: '0.375rem',
                border: '1px solid #cbd5e1',
                marginBottom: '0.75rem',
              }}
            />
            <button
              onClick={handleImport}
              style={{
                minHeight: '44px',
                padding: '0.5rem 1.25rem',
                background: '#16a34a',
                color: '#ffffff',
                border: 'none',
                borderRadius: '0.375rem',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Validate &amp; Import State JSON
            </button>
          </div>
        </section>
      )}
    </div>
  );
};

export default App;
