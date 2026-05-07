import { useGame } from '../state/useGame';

export function SessionSummary() {
  const { state, dispatch } = useGame();
  const result = state.lastSessionResult;

  if (!result) {
    return null;
  }

  return (
    <main className="grid-page">
      <section className="panel summary-panel" aria-labelledby="summary-title">
        <p className="eyebrow">End-of-session feedback</p>
        <h2 id="summary-title">{result.patientName} filed</h2>
        <div className="summary-grid">
          <article className="summary-card">
            <span>Diagnosis accuracy</span>
            <strong>{result.diagnosisAccuracy}</strong>
            <p>{result.selectedDiagnosisName} selected. Correct formulation: {result.correctDiagnosisName}.</p>
          </article>
          <article className="summary-card">
            <span>Token quality</span>
            <strong>{result.supportingTokenCount}/{result.totalTokenCount}</strong>
            <p>{result.tokenQuality}</p>
          </article>
          <article className="summary-card">
            <span>Breakthroughs found</span>
            <strong>{result.breakthroughsFound}</strong>
            <p>Use breakthroughs to strengthen difficult cases before documentation.</p>
          </article>
          <article className="summary-card">
            <span>Focus efficiency</span>
            <strong>{result.focusEfficiency}</strong>
            <p>Preserved Focus keeps future choices flexible on mobile runs.</p>
          </article>
          <article className="summary-card">
            <span>KP earned</span>
            <strong>{result.kpEarned}</strong>
            <p>Knowledge Points are saved and can be spent in the office.</p>
          </article>
        </div>
      </section>
      <aside className="panel note-panel">
        <p className="eyebrow">Next session</p>
        <h2>Unlock guidance</h2>
        <p>{result.nextSessionGuidance}</p>
        <div className="button-row">
          <button type="button" onClick={() => dispatch({ type: 'GO_INBOX' })} aria-label="Return to inbox for the next session">
            Next consult
          </button>
          <button type="button" className="secondary" onClick={() => dispatch({ type: 'GO_UPGRADES' })} aria-label="Review saved Knowledge Point upgrades">
            Review upgrades
          </button>
        </div>
      </aside>
    </main>
  );
}
