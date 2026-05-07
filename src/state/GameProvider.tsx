import { useEffect, useMemo, useReducer, type ReactNode } from 'react';
import { GameContext } from './GameContext';
import { gameReducer } from './gameReducer';
import { hydrateInitialState, persistGameState } from './persistence';

export function GameProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(gameReducer, undefined, hydrateInitialState);
  useEffect(() => {
    persistGameState(state);
  }, [state]);
  const value = useMemo(() => ({ state, dispatch }), [state]);
  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}
