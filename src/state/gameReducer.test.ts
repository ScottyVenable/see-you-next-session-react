import { describe, expect, it } from 'vitest';
import { patients } from '../data/patients';
import { calculateSessionResult, createInitialState, gameReducer, getObservationCost } from './gameReducer';

describe('gameReducer', () => {
  it('starts Gregory with six-turn session resources', () => {
    const state = gameReducer(createInitialState(), { type: 'START_SESSION', patientId: 'gregory-vigil' });

    expect(state.screen).toBe('session');
    expect(state.turn).toBe(1);
    expect(state.focus).toBe(state.maxFocus);
    expect(state.anxiety).toBe(patients[0].startingAnxiety);
  });

  it('collects text clues and visual clues through focus costs', () => {
    let state = gameReducer(createInitialState(), { type: 'START_SESSION', patientId: 'gregory-vigil' });
    state = gameReducer(state, { type: 'COLLECT_TOKEN', tokenId: 'gregory-worry' });
    state = gameReducer(state, { type: 'OBSERVE_VISUAL', tokenId: 'gregory-nails' });

    expect(state.tokens.map((token) => token.id)).toContain('gregory-worry');
    expect(state.tokens.map((token) => token.id)).toContain('gregory-nails');
    expect(state.focus).toBe(state.maxFocus - getObservationCost(createInitialState()));
  });

  it('creates Mara breakthrough only from the contradiction pair', () => {
    let state = gameReducer(createInitialState(), { type: 'START_SESSION', patientId: 'mara-lowell' });
    state = gameReducer(state, { type: 'COLLECT_TOKEN', tokenId: 'mara-severe-history' });
    state = gameReducer(state, { type: 'OBSERVE_VISUAL', tokenId: 'mara-healthy' });
    state = gameReducer(state, { type: 'SYNTHESIZE', tokenAId: 'mara-severe-history', tokenBId: 'mara-healthy' });

    expect(state.tokens.map((token) => token.id)).toContain('mara-breakthrough');
    expect(state.focus).toBe(state.maxFocus);
    expect(state.knowledgePoints).toBeGreaterThan(createInitialState().knowledgePoints);
  });

  it('rewards accurate documentation with completion and KP', () => {
    let state = gameReducer(createInitialState(), { type: 'START_SESSION', patientId: 'gregory-vigil' });
    state = gameReducer(state, { type: 'SET_FINAL_DIAGNOSIS', diagnosisId: 'generalized-anxiety' });
    state = gameReducer(state, { type: 'COMPLETE_DOCUMENTATION' });

    expect(state.screen).toBe('sessionSummary');
    expect(state.completedPatientIds).toContain('gregory-vigil');
    expect(state.knowledgePoints).toBe(createInitialState().knowledgePoints + 3);
    expect(state.lastSessionResult?.diagnosisAccuracy).toBe('Accurate');
    expect(state.lastSessionResult?.kpEarned).toBe(3);
  });

  it('calculates token quality and focus efficiency for scoring feedback', () => {
    let state = gameReducer(createInitialState(), { type: 'START_SESSION', patientId: 'gregory-vigil' });
    state = gameReducer(state, { type: 'COLLECT_TOKEN', tokenId: 'gregory-worry' });
    state = gameReducer(state, { type: 'OBSERVE_VISUAL', tokenId: 'gregory-nails' });
    state = gameReducer(state, { type: 'SET_FINAL_DIAGNOSIS', diagnosisId: 'generalized-anxiety' });

    const result = calculateSessionResult(state, patients[0], 3);

    expect(result.supportingTokenCount).toBe(2);
    expect(result.totalTokenCount).toBe(2);
    expect(result.tokenQuality).toContain('100%');
    expect(result.focusEfficiency).toContain(`${state.focus}/${state.maxFocus}`);
  });

  it('resets durable progress without carrying dev console state', () => {
    let state = gameReducer(createInitialState(), { type: 'TOGGLE_DEV_CONSOLE' });
    state = gameReducer(state, { type: 'BUY_DECOR', decorId: 'comfortable-chair', cost: 3 });
    state = gameReducer(state, { type: 'RESET_NEW_GAME' });

    expect(state.devConsoleOpen).toBe(false);
    expect(state.purchasedDecorIds).toEqual([]);
    expect(state.knowledgePoints).toBe(createInitialState().knowledgePoints);
  });
});
