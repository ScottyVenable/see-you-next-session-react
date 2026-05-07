/**
 * @vitest-environment jsdom
 */
import { beforeEach, describe, expect, it } from 'vitest';
import { createInitialState } from './gameReducer';
import { hydrateInitialState, persistGameState, toDurableState } from './persistence';

describe('game persistence', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('persists durable progress but not transient dev console state', () => {
    const state = {
      ...createInitialState(),
      knowledgePoints: 9,
      score: 220,
      completedPatientIds: ['gregory-vigil'],
      purchasedSkillIds: ['anxiety-specialist'],
      purchasedDecorIds: ['comfortable-chair'],
      onboardingDismissed: true,
      devConsoleOpen: true,
    };

    persistGameState(state);
    const hydrated = hydrateInitialState();

    expect(hydrated.knowledgePoints).toBe(9);
    expect(hydrated.score).toBe(220);
    expect(hydrated.completedPatientIds).toEqual(['gregory-vigil']);
    expect(hydrated.purchasedSkillIds).toEqual(['anxiety-specialist']);
    expect(hydrated.purchasedDecorIds).toEqual(['comfortable-chair']);
    expect(hydrated.onboardingDismissed).toBe(true);
    expect(hydrated.devConsoleOpen).toBe(false);
    expect(hydrated.screen).toBe('inbox');
  });

  it('serializes only durable fields', () => {
    const durableState = toDurableState({ ...createInitialState(), devConsoleOpen: true });

    expect(durableState).not.toHaveProperty('devConsoleOpen');
    expect(durableState).not.toHaveProperty('tokens');
    expect(durableState).toHaveProperty('knowledgePoints');
  });
});
