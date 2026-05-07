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
      <section className="panel patient-panel">
        <div className="section-head">
          <div>
            <p className="eyebrow">Turn {state.turn}/6. Ten-minute block</p>
            <h2>{patient.name}</h2>
          </div>
          <div className="anxiety-meter">
            <span>Anxiety</span>
            <meter min="0" max="100" value={state.anxiety} />
            <strong>{state.anxiety}</strong>
          </div>
        </div>
        <div className="patient-text">
          <p>{node.patientText}</p>
        </div>
        <div className="keyword-row">
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
      </section>

      <aside className="panel cue-panel">
        <div className="section-head">
          <div>
            <p className="eyebrow">Observation mode</p>
            <h2>Patient cues</h2>
          </div>
          <button
            type="button"
            className={state.focusMode ? 'focus-toggle active' : 'focus-toggle'}
            onClick={() => dispatch({ type: 'TOGGLE_FOCUS' })}
            aria-label={state.focusMode ? 'Close focus mode' : 'Open focus mode to observe patient cues'}
          >
            {state.focusMode ? 'Close focus mode' : 'Open focus mode'}
          </button>
        </div>
        <p className="focus-instruction">Focus mode dims the room and illuminates cue cards. Tap any cue to spend Focus and create a Visual Token.</p>
        {state.focusMode && <p className="focus-banner" aria-live="polite">Focus mode active. Visual cues are ready for mobile tap collection.</p>}
        <div className="cue-grid">
          {patient.visualTokens.map((token) => (
            <button
              type="button"
              className={`cue-card${collectedIds.has(token.id) ? ' collected' : ''}`}
              key={token.id}
              disabled={collectedIds.has(token.id)}
              onClick={() => dispatch({ type: 'OBSERVE_VISUAL', tokenId: token.id })}
              aria-label={collectedIds.has(token.id) ? `${token.label} collected` : `Observe ${token.label}. Costs Focus.`}
            >
              <span>{collectedIds.has(token.id) || state.focusMode ? token.label : 'Unexamined cue'}</span>
              <small>{collectedIds.has(token.id) ? 'Collected' : 'Costs Focus'}</small>
            </button>
          ))}
        </div>
      </aside>

      <Clipboard compact />
      <Handbook />
    </main>
  );
}
