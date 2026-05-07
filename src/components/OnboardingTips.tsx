import { useGame } from '../state/useGame';

export function OnboardingTips() {
  const { state, dispatch } = useGame();

  if (state.onboardingDismissed || state.completedPatientIds.includes('gregory-vigil')) {
    return null;
  }

  return (
    <aside className="tutorial-card" aria-labelledby="tutorial-title">
      <div>
        <p className="eyebrow">Gregory tutorial</p>
        <h3 id="tutorial-title">First shift checklist</h3>
      </div>
      <ol>
        <li>Select Gregory's email and accept the consult.</li>
        <li>Tap highlighted words to collect Text Tokens.</li>
        <li>Open Focus Mode, then tap patient cues to collect Visual Tokens.</li>
        <li>Use the Handbook to test diagnoses and combine two strong tokens into a breakthrough.</li>
        <li>Document the note by sorting tokens into slots and choosing a final diagnosis.</li>
      </ol>
      <button type="button" className="secondary" onClick={() => dispatch({ type: 'DISMISS_ONBOARDING' })} aria-label="Dismiss Gregory tutorial tips">
        Hide tips
      </button>
    </aside>
  );
}
