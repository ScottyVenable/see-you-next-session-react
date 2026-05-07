import { useMemo, useState } from 'react';
import { diagnoses } from '../data/diagnoses';
import { useGame } from '../state/useGame';

export function Handbook() {
  const { state, dispatch } = useGame();
  const [firstToken, setFirstToken] = useState<string>('');
  const [secondToken, setSecondToken] = useState<string>('');
  const support = useMemo(
    () =>
      diagnoses.map((diagnosis) => ({
        ...diagnosis,
        matches: state.tokens.filter((token) => token.tags.some((tag) => diagnosis.strongTags.includes(tag))).length,
      })),
    [state.tokens],
  );

  return (
    <section className="panel handbook">
      <p className="eyebrow">Synthesis handbook</p>
      <h2>Disorders and criteria</h2>
      <p className="muted">Use dropdowns or tap token chips to fill the two synthesis slots. Test theories from each diagnosis card.</p>
      <div className="synthesis-slots" aria-live="polite">
        <span>First: {state.tokens.find((token) => token.id === firstToken)?.label ?? 'empty'}</span>
        <span>Second: {state.tokens.find((token) => token.id === secondToken)?.label ?? 'empty'}</span>
      </div>
      <div className="token-stack handbook-token-stack" aria-label="Tap tokens to prepare synthesis">
        {state.tokens.map((token) => (
          <button
            type="button"
            key={token.id}
            className={`token-pill ${token.kind}${token.id === firstToken || token.id === secondToken ? ' selected' : ''}`}
            onClick={() => {
              if (!firstToken || firstToken === token.id) {
                setFirstToken(token.id);
                return;
              }
              setSecondToken(token.id);
            }}
          >
            <span>{token.label}</span>
            <small>{token.kind}</small>
          </button>
        ))}
      </div>
      <div className="synthesis-row">
        <select value={firstToken} onChange={(event) => setFirstToken(event.target.value)} aria-label="First synthesis token">
          <option value="">First token</option>
          {state.tokens.map((token) => <option key={token.id} value={token.id}>{token.label}</option>)}
        </select>
        <select value={secondToken} onChange={(event) => setSecondToken(event.target.value)} aria-label="Second synthesis token">
          <option value="">Second token</option>
          {state.tokens.map((token) => <option key={token.id} value={token.id}>{token.label}</option>)}
        </select>
        <button
          type="button"
          disabled={!firstToken || !secondToken || firstToken === secondToken}
          onClick={() => dispatch({ type: 'SYNTHESIZE', tokenAId: firstToken, tokenBId: secondToken })}
        >
          Combine tokens
        </button>
      </div>
      <div className="diagnosis-list">
        {support.map((diagnosis) => (
          <article key={diagnosis.id} className="diagnosis-card">
            <div className="mail-meta">
              <strong>{diagnosis.name}</strong>
              <span>{diagnosis.matches} matches</span>
            </div>
            <p>{diagnosis.summary}</p>
            <ul>
              {diagnosis.criteria.map((criterion) => <li key={criterion}>{criterion}</li>)}
            </ul>
            <button type="button" className="secondary" onClick={() => dispatch({ type: 'TEST_DIAGNOSIS', diagnosisId: diagnosis.id })}>
              {state.testedDiagnosisIds.includes(diagnosis.id) ? 'Retest theory' : 'Test theory'}
            </button>
          </article>
        ))}
      </div>
    </section>
  );
}
