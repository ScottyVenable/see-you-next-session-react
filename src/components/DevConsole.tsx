import { useState } from 'react';
import { useGame } from '../state/useGame';

export function DevConsole() {
  const { state, dispatch } = useGame();
  const [code, setCode] = useState('');
  if (!state.devConsoleOpen) return null;

  return (
    <aside className="dev-console">
      <div className="section-head">
        <div>
          <p className="eyebrow">Development console</p>
          <h2>State readout</h2>
        </div>
        <button type="button" className="ghost" onClick={() => dispatch({ type: 'TOGGLE_DEV_CONSOLE' })}>Close</button>
      </div>
      <dl>
        <div><dt>Focus</dt><dd>{state.focus}/{state.maxFocus}</dd></div>
        <div><dt>KP</dt><dd>{state.knowledgePoints}</dd></div>
        <div><dt>Turn</dt><dd>{state.turn}</dd></div>
        <div><dt>Patient</dt><dd>{state.selectedPatientId ?? 'none'}</dd></div>
        <div><dt>Screen</dt><dd>{state.screen}</dd></div>
        <div><dt>Tokens</dt><dd>{state.tokens.length}</dd></div>
      </dl>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          dispatch({ type: 'CHEAT', code });
          setCode('');
        }}
      >
        <input value={code} onChange={(event) => setCode(event.target.value)} placeholder="kp, focus, tokens, calm" />
        <button type="submit">Run</button>
      </form>
      <ol>
        {state.sessionLog.map((entry, index) => <li key={`${entry}-${index}`}>{entry}</li>)}
      </ol>
    </aside>
  );
}
