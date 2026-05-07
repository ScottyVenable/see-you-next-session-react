import { diagnoses } from '../data/diagnoses';
import { patients } from '../data/patients';
import { decor, skills } from '../data/upgrades';
import type { GameState, Patient, ResponseOption, SessionResult, Token, TokenSlot } from '../types';

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));
const hasToken = (state: GameState, tokenId: string) => state.tokens.some((token) => token.id === tokenId);
const uniqueTokens = (tokens: Token[]) => [...new Map(tokens.map((token) => [token.id, token])).values()];

export const createInitialState = (): GameState => ({
  screen: 'inbox',
  turn: 0,
  focus: 8,
  maxFocus: 8,
  knowledgePoints: 3,
  score: 0,
  anxiety: 0,
  tokens: [],
  unlockedDialogueIds: ['start'],
  completedPatientIds: [],
  purchasedSkillIds: [],
  purchasedDecorIds: [],
  focusMode: false,
  testedDiagnosisIds: [],
  onboardingDismissed: false,
  devConsoleOpen: false,
  sessionLog: ['Clinic workstation online.'],
});

export type GameAction =
  | { type: 'START_SESSION'; patientId: string }
  | { type: 'COLLECT_TOKEN'; tokenId: string }
  | { type: 'OBSERVE_VISUAL'; tokenId: string }
  | { type: 'RESPOND'; response: ResponseOption }
  | { type: 'TOGGLE_FOCUS' }
  | { type: 'SYNTHESIZE'; tokenAId: string; tokenBId: string }
  | { type: 'TEST_DIAGNOSIS'; diagnosisId: string }
  | { type: 'ASSIGN_TOKEN'; tokenId: string; slot: TokenSlot }
  | { type: 'SET_FINAL_DIAGNOSIS'; diagnosisId: string }
  | { type: 'COMPLETE_DOCUMENTATION' }
  | { type: 'BUY_SKILL'; skillId: string; cost: number }
  | { type: 'BUY_DECOR'; decorId: string; cost: number }
  | { type: 'GO_UPGRADES' }
  | { type: 'GO_INBOX' }
  | { type: 'DISMISS_ONBOARDING' }
  | { type: 'RESET_NEW_GAME' }
  | { type: 'TOGGLE_DEV_CONSOLE' }
  | { type: 'CHEAT'; code: string };

export const getPatient = (state: GameState) => patients.find((patient) => patient.id === state.selectedPatientId);

const getAvailableToken = (patientId: string | undefined, tokenId: string) => {
  const patient = patients.find((entry) => entry.id === patientId);
  return patient ? [...patient.textTokens, ...patient.visualTokens, patient.requiredBreakthrough?.result].find((token) => token?.id === tokenId) : undefined;
};

const addToken = (state: GameState, token: Token): GameState => {
  if (hasToken(state, token.id)) {
    return state;
  }

  return {
    ...state,
    tokens: uniqueTokens([...state.tokens, { ...token, slot: 'clipboard' }]),
    score: state.score + (token.kind === 'breakthrough' ? 80 : 20),
    sessionLog: [`Token added: ${token.label}.`, ...state.sessionLog].slice(0, 8),
  };
};

const applyTurnPressure = (state: GameState) => {
  const decorRelief = state.purchasedDecorIds.includes('fish-tank') ? 1 : 0;
  return {
    ...state,
    turn: clamp(state.turn + 1, 1, 6),
    anxiety: clamp(state.anxiety + 3 - decorRelief, 0, 100),
  };
};

export const getObservationCost = (state: GameState) => (state.purchasedSkillIds.includes('anxiety-specialist') ? 1 : 2);

export const calculateSessionResult = (state: GameState, patient: Patient, kpEarned: number): SessionResult => {
  const selectedDiagnosis = diagnoses.find((entry) => entry.id === state.finalDiagnosisId);
  const correctDiagnosis = diagnoses.find((entry) => entry.id === patient.correctDiagnosisId);
  const strongTags = correctDiagnosis?.strongTags ?? [];
  const supportingTokenCount = state.tokens.filter((token) => token.tags.some((tag) => strongTags.includes(tag))).length;
  const totalTokenCount = state.tokens.length;
  const tokenQualityPercent = totalTokenCount > 0 ? Math.round((supportingTokenCount / totalTokenCount) * 100) : 0;
  const breakthroughsFound = state.tokens.filter((token) => token.kind === 'breakthrough').length;
  const focusPercent = state.maxFocus > 0 ? Math.round((state.focus / state.maxFocus) * 100) : 0;
  const projectedKnowledgePoints = state.knowledgePoints + kpEarned;
  const availableUpgrade = [...skills, ...decor].find(
    (upgrade) =>
      projectedKnowledgePoints >= upgrade.cost &&
      !state.purchasedSkillIds.includes(upgrade.id) &&
      !state.purchasedDecorIds.includes(upgrade.id),
  );
  const incompletePatient = patients.find((entry) => entry.id !== patient.id && !state.completedPatientIds.includes(entry.id));

  return {
    patientId: patient.id,
    patientName: patient.name,
    diagnosisAccuracy: state.finalDiagnosisId === patient.correctDiagnosisId ? 'Accurate' : 'Partial',
    selectedDiagnosisName: selectedDiagnosis?.name ?? 'Unselected',
    correctDiagnosisName: correctDiagnosis?.name ?? 'Unknown',
    tokenQuality: `${supportingTokenCount}/${totalTokenCount} collected tokens supported the fictional formulation (${tokenQualityPercent}%)`,
    supportingTokenCount,
    totalTokenCount,
    breakthroughsFound,
    focusEfficiency: `${state.focus}/${state.maxFocus} Focus preserved (${focusPercent}%)`,
    kpEarned,
    nextSessionGuidance: availableUpgrade
      ? `Spend ${availableUpgrade.cost} KP on ${availableUpgrade.name}, then take the next fictional consult.`
      : incompletePatient
        ? `${incompletePatient.name.split(' ')[0]}'s authored consult is ready for the next session.`
        : 'All current consults are complete. Replay cases to refine evidence quality, not to model real care.',
  };
};

export const canUnlockNode = (state: GameState, nodeId: string) => {
  const patient = getPatient(state);
  const node = patient?.dialogue.find((entry) => entry.id === nodeId);
  return Boolean(node && (!node.unlocksWhenTokens || node.unlocksWhenTokens.every((tokenId) => hasToken(state, tokenId))));
};

export const gameReducer = (state: GameState, action: GameAction): GameState => {
  switch (action.type) {
    case 'START_SESSION': {
      const patient = patients.find((entry) => entry.id === action.patientId);
      if (!patient) return state;
      const maxFocus =
        8 +
        (state.purchasedSkillIds.includes('clinical-endurance') ? 2 : 0) +
        (state.purchasedDecorIds.includes('comfortable-chair') ? 1 : 0);
      return {
        ...state,
        screen: 'session',
        selectedPatientId: patient.id,
        currentNodeId: 'start',
        turn: 1,
        focus: maxFocus,
        maxFocus,
        anxiety: patient.startingAnxiety,
        tokens: [],
        focusMode: false,
        testedDiagnosisIds: [],
        finalDiagnosisId: undefined,
        lastSessionResult: undefined,
        unlockedDialogueIds: ['start'],
        sessionLog: [`${patient.name} entered the office.`, ...state.sessionLog].slice(0, 8),
      };
    }

    case 'COLLECT_TOKEN': {
      const token = getAvailableToken(state.selectedPatientId, action.tokenId);
      if (!token || token.kind !== 'text') return state;
      return addToken(state, token);
    }

    case 'OBSERVE_VISUAL': {
      const token = getAvailableToken(state.selectedPatientId, action.tokenId);
      if (!token || token.kind !== 'visual' || hasToken(state, token.id)) return state;
      const cost = getObservationCost(state);
      if (state.focus < cost) return { ...state, sessionLog: ['Not enough Focus to observe.', ...state.sessionLog].slice(0, 8) };
      return addToken({ ...state, focus: state.focus - cost }, token);
    }

    case 'RESPOND': {
      if (action.response.requiresTokenIds?.some((tokenId) => !hasToken(state, tokenId))) return state;
      let next = applyTurnPressure({
        ...state,
        focus: clamp(state.focus + (action.response.focusDelta ?? 0), 0, state.maxFocus),
        anxiety: clamp(state.anxiety + action.response.anxietyDelta, 0, 100),
        score: state.score + Math.max(2, 10 - Math.max(0, action.response.anxietyDelta)),
      });
      for (const tokenId of action.response.unlockTokenIds ?? []) {
        const token = getAvailableToken(state.selectedPatientId, tokenId);
        if (token) next = addToken(next, token);
      }
      if (action.response.nextNodeId && canUnlockNode(next, action.response.nextNodeId)) {
        next = { ...next, currentNodeId: action.response.nextNodeId };
      }
      if (next.turn >= 6 || !action.response.nextNodeId) {
        next = { ...next, screen: 'documentation', focusMode: false };
      }
      return { ...next, sessionLog: [`Response used: ${action.response.technique}.`, ...next.sessionLog].slice(0, 8) };
    }

    case 'TOGGLE_FOCUS':
      return { ...state, focusMode: !state.focusMode };

    case 'SYNTHESIZE': {
      const patient = getPatient(state);
      const rule = patient?.requiredBreakthrough;
      const chosen = [action.tokenAId, action.tokenBId].sort().join('|');
      const needed = rule?.tokenIds.toSorted().join('|');
      if (!rule || chosen !== needed || !rule.tokenIds.every((tokenId) => hasToken(state, tokenId))) {
        return { ...state, focus: clamp(state.focus - 1, 0, state.maxFocus), sessionLog: ['The synthesis did not hold.', ...state.sessionLog].slice(0, 8) };
      }
      const bonus = state.purchasedSkillIds.includes('integrative-formulation') ? 2 : 1;
      return addToken(
        {
          ...state,
          focus: state.maxFocus,
          knowledgePoints: state.knowledgePoints + bonus,
          unlockedDialogueIds: [...new Set([...state.unlockedDialogueIds, 'resolved'])],
        },
        rule.result,
      );
    }

    case 'TEST_DIAGNOSIS': {
      const diagnosis = diagnoses.find((entry) => entry.id === action.diagnosisId);
      if (!diagnosis) return state;
      const matches = state.tokens.filter((token) => token.tags.some((tag) => diagnosis.strongTags.includes(tag))).length;
      return {
        ...state,
        testedDiagnosisIds: [...new Set([...state.testedDiagnosisIds, diagnosis.id])],
        score: state.score + matches * 10,
        sessionLog: [`Theory tested: ${diagnosis.name}. ${matches} supporting tokens.`, ...state.sessionLog].slice(0, 8),
      };
    }

    case 'ASSIGN_TOKEN':
      return { ...state, tokens: state.tokens.map((token) => (token.id === action.tokenId ? { ...token, slot: action.slot } : token)) };

    case 'SET_FINAL_DIAGNOSIS':
      return { ...state, finalDiagnosisId: action.diagnosisId };

    case 'COMPLETE_DOCUMENTATION': {
      const patient = getPatient(state);
      if (!patient || !state.finalDiagnosisId) return state;
      const correct = state.finalDiagnosisId === patient.correctDiagnosisId;
      const kpGain = correct ? 3 : 1;
      const lastSessionResult = calculateSessionResult(state, patient, kpGain);
      return {
        ...state,
        screen: 'sessionSummary',
        selectedPatientId: undefined,
        completedPatientIds: [...new Set([...state.completedPatientIds, patient.id])],
        knowledgePoints: state.knowledgePoints + kpGain,
        score: state.score + (correct ? 150 : 25),
        lastSessionResult,
        sessionLog: [`Session filed for ${patient.name}. ${correct ? 'Evidence-supported game formulation.' : 'Partial fictional formulation.'}`, ...state.sessionLog].slice(0, 8),
      };
    }

    case 'BUY_SKILL':
      if (state.knowledgePoints < action.cost || state.purchasedSkillIds.includes(action.skillId)) return state;
      return { ...state, knowledgePoints: state.knowledgePoints - action.cost, purchasedSkillIds: [...state.purchasedSkillIds, action.skillId] };

    case 'BUY_DECOR':
      if (state.knowledgePoints < action.cost || state.purchasedDecorIds.includes(action.decorId)) return state;
      return { ...state, knowledgePoints: state.knowledgePoints - action.cost, purchasedDecorIds: [...state.purchasedDecorIds, action.decorId] };

    case 'GO_UPGRADES':
      return { ...state, screen: 'upgrades' };

    case 'GO_INBOX':
      return { ...state, screen: 'inbox' };

    case 'DISMISS_ONBOARDING':
      return { ...state, onboardingDismissed: true };

    case 'RESET_NEW_GAME':
      return { ...createInitialState(), sessionLog: ['New game started.'] };

    case 'TOGGLE_DEV_CONSOLE':
      return { ...state, devConsoleOpen: !state.devConsoleOpen };

    case 'CHEAT': {
      const code = action.code.trim().toLowerCase();
      if (code === 'kp') return { ...state, knowledgePoints: state.knowledgePoints + 10 };
      if (code === 'focus') return { ...state, focus: state.maxFocus };
      if (code === 'tokens') {
        const patient = getPatient(state);
        return patient ? { ...state, tokens: uniqueTokens([...state.tokens, ...patient.textTokens, ...patient.visualTokens]) } : state;
      }
      if (code === 'calm') return { ...state, anxiety: 0 };
      return { ...state, sessionLog: [`Unknown cheat: ${action.code}.`, ...state.sessionLog].slice(0, 8) };
    }

    default:
      return state;
  }
};
