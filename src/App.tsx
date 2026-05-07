import { useEffect } from 'react';
import { DevConsole } from './components/DevConsole';
import { Documentation } from './components/Documentation';
import { Header } from './components/Header';
import { Inbox } from './components/Inbox';
import { SessionView } from './components/SessionView';
import { SessionSummary } from './components/SessionSummary';
import { Upgrades } from './components/Upgrades';
import { useGame } from './state/useGame';

function App() {
  const { state, dispatch } = useGame();

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === '~' || event.code === 'Backquote') {
        dispatch({ type: 'TOGGLE_DEV_CONSOLE' });
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [dispatch]);

  return (
    <div className="app-shell">
      <Header />
      {state.screen === 'inbox' && <Inbox />}
      {state.screen === 'session' && <SessionView />}
      {state.screen === 'documentation' && <Documentation />}
      {state.screen === 'sessionSummary' && <SessionSummary />}
      {state.screen === 'upgrades' && <Upgrades />}
      <DevConsole />
    </div>
  );
}

export default App;
