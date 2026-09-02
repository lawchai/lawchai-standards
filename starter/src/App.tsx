import React, { useState, useEffect } from 'react';
import { LocalStorageManager } from './lib/storage';
import { createEvidenceRecord, EvidenceRecord, summarizeEvidence } from './lib/evidence';

interface AppState {
  inputQuery: string;
  evidenceList: EvidenceRecord[];
}

const storage = new LocalStorageManager<AppState>({
  key: 'lawchai_starter_state_v1',
  version: 1,
  defaultValue: {
    inputQuery: '',
    evidenceList: [
      createEvidenceRecord('e-1', 'SYNTHETIC', 'Sample Synthetic Baseline Record', 'system-init'),
      createEvidenceRecord('e-2', 'UNKNOWN', 'Unverified Initial State', 'system-init'),
    ],
  },
});

export const App: React.FC = () => {
  const [state, setState] = useState<AppState>(() => storage.load());
  const [activeTab, setActiveTab] = useState<'journey' | 'evidence'>('journey');

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
  };

  const handleReset = () => {
    storage.reset();
    setState(storage.load());
  };

  const summary = summarizeEvidence(state.evidenceList);

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem', fontFamily: 'system-ui, sans-serif' }}>
      <header style={{ borderBottom: '1px solid #e2e8f0', pb: '1rem', mb: '1.5rem' }}>
        <h1 style={{ fontSize: '1.75rem', color: '#0f172a' }}>LawChai Product Starter</h1>
        <p style={{ color: '#475569' }}>
          Standardized React/TypeScript web-product baseline with explicit truth state &amp; persistence.
        </p>
      </header>

      <nav style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
        <button
          onClick={() => setActiveTab('journey')}
          style={{
            padding: '0.5rem 1rem',
            borderRadius: '0.375rem',
            border: 'none',
            background: activeTab === 'journey' ? '#2563eb' : '#e2e8f0',
            color: activeTab === 'journey' ? '#ffffff' : '#0f172a',
            cursor: 'pointer',
          }}
        >
          Primary Journey
        </button>
        <button
          onClick={() => setActiveTab('evidence')}
          style={{
            padding: '0.5rem 1rem',
            borderRadius: '0.375rem',
            border: 'none',
            background: activeTab === 'evidence' ? '#2563eb' : '#e2e8f0',
            color: activeTab === 'evidence' ? '#ffffff' : '#0f172a',
            cursor: 'pointer',
          }}
        >
          Evidence Ledger ({state.evidenceList.length})
        </button>
      </nav>

      {activeTab === 'journey' && (
        <section style={{ background: '#f8fafc', padding: '1.5rem', borderRadius: '0.5rem' }}>
          <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>Record Primary Observation</h2>
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
            <input
              type="text"
              value={state.inputQuery}
              onChange={(e) => setState((prev) => ({ ...prev, inputQuery: e.target.value }))}
              placeholder="Enter observed evidence detail..."
              style={{ flex: 1, padding: '0.5rem', borderRadius: '0.375rem', border: '1px solid #cbd5e1' }}
            />
            <button
              onClick={handleAddEvidence}
              style={{
                padding: '0.5rem 1rem',
                backgroundColor: '#16a34a',
                color: '#fff',
                border: 'none',
                borderRadius: '0.375rem',
                cursor: 'pointer',
              }}
            >
              Add Record
            </button>
          </div>
          <button
            onClick={handleReset}
            style={{
              padding: '0.25rem 0.75rem',
              backgroundColor: '#ef4444',
              color: '#fff',
              border: 'none',
              borderRadius: '0.25rem',
              cursor: 'pointer',
              fontSize: '0.875rem',
            }}
          >
            Reset Persistence
          </button>
        </section>
      )}

      {activeTab === 'evidence' && (
        <section>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
            {Object.entries(summary).map(([status, count]) => (
              <span key={status} style={{ background: '#e2e8f0', padding: '0.25rem 0.5rem', borderRadius: '0.25rem', fontSize: '0.875rem' }}>
                {status}: <strong>{count}</strong>
              </span>
            ))}
          </div>

          <ul style={{ listStyle: 'none', padding: 0 }}>
            {state.evidenceList.map((item) => (
              <li
                key={item.id}
                style={{
                  border: '1px solid #e2e8f0',
                  padding: '1rem',
                  borderRadius: '0.375rem',
                  marginBottom: '0.5rem',
                  background: '#ffffff',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <strong>{item.label}</strong>
                  <span
                    style={{
                      fontSize: '0.75rem',
                      fontWeight: 'bold',
                      padding: '0.25rem 0.5rem',
                      borderRadius: '0.25rem',
                      background: item.status === 'SYNTHETIC' ? '#fef08a' : item.status === 'KNOWN' ? '#bbf7d0' : '#e2e8f0',
                    }}
                  >
                    {item.status}
                  </span>
                </div>
                <div style={{ fontSize: '0.875rem', color: '#64748b', marginTop: '0.25rem' }}>
                  Source: {item.source} | Recorded: {item.recordedAt}
                </div>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
};

export default App;
