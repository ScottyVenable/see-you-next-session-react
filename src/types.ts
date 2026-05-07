export type TokenKind = 'text' | 'visual' | 'breakthrough';
export type TokenSlot = 'clipboard' | 'symptoms' | 'stated' | 'diagnosis';

export interface Token {
  id: string;
  label: string;
  kind: TokenKind;
  source: string;
  description: string;
  tags: string[];
  conflictsWith?: string[];
  slot: TokenSlot;
}

export interface ResponseOption {
  id: string;
  label: string;
  technique: 'reflect' | 'challenge' | 'ground' | 'clarify';
  nextNodeId?: string;
  anxietyDelta: number;
  focusDelta?: number;
  unlockTokenIds?: string[];
  requiresTokenIds?: string[];
}

export interface DialogueNode {
  id: string;
  patientText: string;
  keywordTokenIds: string[];
  responseOptions: ResponseOption[];
  unlocksWhenTokens?: string[];
}

export interface Patient {
  id: string;
  name: string;
  difficulty: 'tutorial' | 'medium' | 'hard';
  requestSubject: string;
  requestBody: string;
  profile: string;
  startingAnxiety: number;
  correctDiagnosisId: string;
  textTokens: Token[];
  visualTokens: Token[];
  dialogue: DialogueNode[];
  requiredBreakthrough?: {
    tokenIds: [string, string];
    result: Token;
  };
}

export interface Diagnosis {
  id: string;
  name: string;
  summary: string;
  criteria: string[];
  strongTags: string[];
}

export interface Skill {
  id: string;
  name: string;
  description: string;
  cost: number;
}

export interface Decor {
  id: string;
  name: string;
  description: string;
  cost: number;
}

export type Screen = 'inbox' | 'session' | 'documentation' | 'sessionSummary' | 'upgrades';

export interface SessionResult {
  patientId: string;
  patientName: string;
  diagnosisAccuracy: 'Accurate' | 'Partial';
  selectedDiagnosisName: string;
  correctDiagnosisName: string;
  tokenQuality: string;
  supportingTokenCount: number;
  totalTokenCount: number;
  breakthroughsFound: number;
  focusEfficiency: string;
  kpEarned: number;
  nextSessionGuidance: string;
}

export interface GameState {
  screen: Screen;
  selectedPatientId?: string;
  currentNodeId?: string;
  turn: number;
  focus: number;
  maxFocus: number;
  knowledgePoints: number;
  score: number;
  anxiety: number;
  tokens: Token[];
  unlockedDialogueIds: string[];
  completedPatientIds: string[];
  purchasedSkillIds: string[];
  purchasedDecorIds: string[];
  focusMode: boolean;
  testedDiagnosisIds: string[];
  finalDiagnosisId?: string;
  lastSessionResult?: SessionResult;
  onboardingDismissed: boolean;
  devConsoleOpen: boolean;
  sessionLog: string[];
}
