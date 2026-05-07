import { useGame } from '../state/useGame';

export function Header() {
  const { state, dispatch } = useGame();
  return (
    <header className="topbar">
      <div>
        <p className="eyebrow">Clinical RPG workstation</p>
        <h1>See You Next Session</h1>
      </div>
      <div className="status-strip" aria-label="game status">
        <span>Focus {state.focus}/{state.maxFocus}</span>
        <span>KP {state.knowledgePoints}</span>
        <span>Score {state.score}</span>
        <button type="button" className="ghost" onClick={() => dispatch({ type: 'GO_UPGRADES' })} aria-label="Open office upgrades">Office</button>
        <button type="button" className="ghost" onClick={() => dispatch({ type: 'RESET_NEW_GAME' })} aria-label="Reset progress and start a new game">New game</button>
        <button type="button" className="console-button" onClick={() => dispatch({ type: 'TOGGLE_DEV_CONSOLE' })} aria-pressed={state.devConsoleOpen}>
          ~ Dev
        </button>
      </div>
    </header>
  );
}
