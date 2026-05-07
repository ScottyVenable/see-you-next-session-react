import { createContext, type Dispatch } from 'react';
import type { GameAction } from './gameReducer';
import type { GameState } from '../types';

export interface GameContextValue {
  state: GameState;
  dispatch: Dispatch<GameAction>;
}

export const GameContext = createContext<GameContextValue | undefined>(undefined);
