import type { CSSProperties } from 'react';
import { patients } from '../data/patients';
import { useGame } from '../state/useGame';
import { Clipboard } from './Clipboard';
import { Handbook } from './Handbook';
import { TokenPill } from './TokenPill';

export function SessionView() {
  const { state, dispatch } = useGame();
  const patient = patients.find((entry) => entry.id === state.selectedPatientId);
  const node = patient?.dialogue.find((entry) => entry.id === state.currentNodeId);
  if (!patient || !node) return null;

  const collectedIds = new Set(state.tokens.map((token) => token.id));
  const visibleResponses = node.responseOptions.filter((response) => !response.requiresTokenIds?.some((tokenId) => !collectedIds.has(tokenId)));

  return (
    <main className={`session-layout ${state.focusMode ? 'focus-active' : ''}`}>
      {/* Office Viewport - POV of Therapist */}
      <section className="office-viewport">
        <div className="office-wall">
          <div className="certificate-wall">
             <div className="certificate" title="Psychology Degree">📜<br/>Degree</div>
             {state.turn > 3 && <div className="certificate" title="Specialization">📜<br/>Spec.</div>}
          </div>
        </div>

        <div className="patient-container">
          <div className="patient-text-bubble">
             {node.patientText}
          </div>
          <div className="patient-sprite-placeholder">
            {patient.name}
          </div>
        </div>

        {/* Floating keyword tokens over the patient */}
        <div className="keyword-row" style={{ position: 'absolute', bottom: '20px', left: '20px' }}>
          {node.keywordTokenIds.map((tokenId) => {
            const token = patient.textTokens.find((entry) => entry.id === tokenId);
            return token ? (
              <TokenPill
                key={token.id}
                token={token}
                disabled={collectedIds.has(token.id)}
                actionLabel={collectedIds.has(token.id) ? `${token.label} already collected` : `Add ${token.label} to Clipboard`}
                onClick={() => dispatch({ type: 'COLLECT_TOKEN', tokenId: token.id })}
              />
            ) : null;
          })}
        </div>

        <div className="anxiety-meter" style={{ position: 'absolute', top: '20px', right: '20px', background: 'rgba(255,255,255,0.8)', padding: '10px', borderRadius: '12px' }}>
            <span className="eyebrow">Anxiety</span>
            <meter min="0" max="100" value={state.anxiety} />
            <strong>{state.anxiety}</strong>
        </div>
      </section>

      {/* Observation Panel */}
      <aside className="panel cue-panel">
        <div className="section-head">
          <div>
            <p className="eyebrow">Observation mode</p>
            <h3>Patient cues</h3>
          </div>
          <button
            type="button"
            className={state.focusMode ? 'focus-toggle active' : 'focus-toggle'}
            onClick={() => dispatch({ type: 'TOGGLE_FOCUS' })}
            aria-label={state.focusMode ? 'Close focus mode' : 'Open focus mode to observe patient cues'}
          >
            {state.focusMode ? 'Focus' : 'Focus'}
          </button>
        </div>
        <div className="cue-grid">
          {patient.visualTokens.map((token) => (
            <button
              type="button"
              className={`cue-card${collectedIds.has(token.id) ? ' collected' : ''}`}
              key={token.id}
              disabled={collectedIds.has(token.id)}
              onClick={() => dispatch({ type: 'OBSERVE_VISUAL', tokenId: token.id })}
            >
              <span>{collectedIds.has(token.id) || state.focusMode ? token.label : '???'}</span>
            </button>
          ))}
        </div>
      </aside>

      {/* Response Wheel overlay or dedicated section */}
      <div className="response-panel panel" style={{ gridColumn: '1 / 3' }}>
        <p className="eyebrow">Choose your response</p>
        <div className="response-wheel" aria-label="response menu">
          {visibleResponses.map((response, index) => (
            <button
              key={response.id}
              type="button"
              className={`response ${response.technique}`}
              style={{ '--item-index': index, '--item-count': visibleResponses.length } as CSSProperties}
              onClick={() => dispatch({ type: 'RESPOND', response })}
            >
              <span>{response.technique}</span>
              {response.label}
            </button>
          ))}
        </div>
      </div>

      <div className="clipboard-container">
        <Clipboard compact />
      </div>
      
      <div className="handbook-panel">
        <Handbook />
      </div>
    </main>
  );
}
