import { diagnoses } from '../data/diagnoses';
import { patients } from '../data/patients';
import { useGame } from '../state/useGame';
import { Clipboard } from './Clipboard';

export function Documentation() {
  const { state, dispatch } = useGame();
  const patient = patients.find((entry) => entry.id === state.selectedPatientId);
  const symptoms = state.tokens.filter((token) => token.slot === 'symptoms');
  const stated = state.tokens.filter((token) => token.slot === 'stated');
  const evidence = state.tokens.filter((token) => token.slot === 'diagnosis');

  if (!patient) return null;

  return (
    <main className="documentation-layout">
      <section className="panel document-panel">
        <p className="eyebrow">End-of-session documentation</p>
        <h2>Clinical note for {patient.name}</h2>
        <p className="muted">Tap a token, then tap a slot title. Drag and drop also works where supported.</p>
        <div className="form-preview">
          <label>
            Observed Symptoms
            <textarea readOnly value={symptoms.map((token) => token.label).join('\n')} />
          </label>
          <label>
            Patient Stated
            <textarea readOnly value={stated.map((token) => token.label).join('\n')} />
          </label>
          <label>
            Final Diagnosis Evidence
            <textarea readOnly value={evidence.map((token) => token.label).join('\n')} />
          </label>
          <label>
            Final Diagnosis
            <select value={state.finalDiagnosisId ?? ''} onChange={(event) => dispatch({ type: 'SET_FINAL_DIAGNOSIS', diagnosisId: event.target.value })} aria-label="Select final diagnosis">
              <option value="">Select diagnosis</option>
              {diagnoses.map((diagnosis) => <option key={diagnosis.id} value={diagnosis.id}>{diagnosis.name}</option>)}
            </select>
          </label>
          <button type="button" disabled={!state.finalDiagnosisId} onClick={() => dispatch({ type: 'COMPLETE_DOCUMENTATION' })} aria-label="File clinical note and show scoring feedback">File note and close session</button>
        </div>
      </section>
      <Clipboard />
    </main>
  );
}
