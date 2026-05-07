import type { GameState } from '../types';
import { createInitialState } from './gameReducer';

const SAVE_KEY = 'see-you-next-session:save:v1';

type DurableState = Pick<
  GameState,
  'knowledgePoints' | 'score' | 'completedPatientIds' | 'purchasedSkillIds' | 'purchasedDecorIds' | 'onboardingDismissed'
>;

const isStringArray = (value: unknown): value is string[] => Array.isArray(value) && value.every((entry) => typeof entry === 'string');

export const toDurableState = (state: GameState): DurableState => ({
  knowledgePoints: state.knowledgePoints,
  score: state.score,
  completedPatientIds: state.completedPatientIds,
  purchasedSkillIds: state.purchasedSkillIds,
  purchasedDecorIds: state.purchasedDecorIds,
  onboardingDismissed: state.onboardingDismissed,
});

export const hydrateInitialState = (): GameState => {
  const initialState = createInitialState();

  if (typeof window === 'undefined') {
    return initialState;
  }

  const rawSave = window.localStorage.getItem(SAVE_KEY);
  if (!rawSave) {
    return initialState;
  }

  try {
    const parsed = JSON.parse(rawSave) as Partial<DurableState>;
    return {
      ...initialState,
      knowledgePoints: typeof parsed.knowledgePoints === 'number' ? parsed.knowledgePoints : initialState.knowledgePoints,
      score: typeof parsed.score === 'number' ? parsed.score : initialState.score,
      completedPatientIds: isStringArray(parsed.completedPatientIds) ? parsed.completedPatientIds : initialState.completedPatientIds,
      purchasedSkillIds: isStringArray(parsed.purchasedSkillIds) ? parsed.purchasedSkillIds : initialState.purchasedSkillIds,
      purchasedDecorIds: isStringArray(parsed.purchasedDecorIds) ? parsed.purchasedDecorIds : initialState.purchasedDecorIds,
      onboardingDismissed: typeof parsed.onboardingDismissed === 'boolean' ? parsed.onboardingDismissed : initialState.onboardingDismissed,
    };
  } catch {
    return initialState;
  }
};

export const persistGameState = (state: GameState) => {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.setItem(SAVE_KEY, JSON.stringify(toDurableState(state)));
};
