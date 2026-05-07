import { useState } from 'react';
import { patients } from '../data/patients';
import { useGame } from '../state/useGame';
import { OnboardingTips } from './OnboardingTips';

export function Inbox() {
  const { state, dispatch } = useGame();
  const [selectedPatientId, setSelectedPatientId] = useState(patients[0]?.id);
  const selectedPatient = patients.find((patient) => patient.id === selectedPatientId) ?? patients[0];

  return (
    <main className="grid-page">
      <section className="panel inbox-panel">
        <div className="section-head">
          <div>
            <p className="eyebrow">Clinical workstation inbox</p>
            <h2>Session requests</h2>
            <p className="muted">Select Gregory, Ayla, or Mara. Each hour has six ten-minute turns: read, observe, synthesize, document.</p>
          </div>
          <span className="inbox-count">{patients.length} pending</span>
        </div>
        <div className="mail-workstation">
          <nav className="mail-list" aria-label="Patient inbox list">
            {patients.map((patient) => (
              <button
                type="button"
                className={`mail-card mail-row${patient.id === selectedPatient.id ? ' selected' : ''}`}
                key={patient.id}
                onClick={() => setSelectedPatientId(patient.id)}
                aria-pressed={patient.id === selectedPatient.id}
              >
                <span className="mail-meta">
                  <strong>{patient.name.split(' ')[0]}</strong>
                  <small>{patient.difficulty}</small>
                </span>
                <span className="mail-subject">{patient.requestSubject}</span>
                <span className="profile">{patient.profile}</span>
              </button>
            ))}
          </nav>
          <article className="mail-card mail-detail" aria-live="polite">
            <div className="mail-meta">
              <strong>{selectedPatient.name}</strong>
              <span>{selectedPatient.difficulty}</span>
            </div>
            <h3>{selectedPatient.requestSubject}</h3>
            <p>{selectedPatient.requestBody}</p>
            <p className="profile">{selectedPatient.profile}</p>
            <button type="button" onClick={() => dispatch({ type: 'START_SESSION', patientId: selectedPatient.id })} aria-label={`Accept ${selectedPatient.name} session request`}>
              {state.completedPatientIds.includes(selectedPatient.id) ? `Replay ${selectedPatient.name.split(' ')[0]}` : `Accept ${selectedPatient.name.split(' ')[0]}`}
            </button>
          </article>
        </div>
      </section>
      <aside className="panel note-panel">
        <p className="eyebrow">Director note</p>
        <h2>Parchment but Clinical</h2>
        <p>
          No portraits. No props. The interface is the room: paper grain, typed notes, structured cards,
          and a clean mobile-first clinical rhythm.
        </p>
        <button className="secondary" onClick={() => dispatch({ type: 'GO_UPGRADES' })} aria-label="Review office upgrades">Review upgrades</button>
      </aside>
      <OnboardingTips />
    </main>
  );
}
