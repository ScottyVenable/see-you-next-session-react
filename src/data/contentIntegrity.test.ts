import { describe, expect, it } from 'vitest';
import { diagnoses } from './diagnoses';
import { patients } from './patients';

const requiredDiagnosisNames = [
  'Generalized Anxiety Disorder',
  'Bipolar I Disorder',
  'Factitious Disorder',
];

describe('MVP narrative content', () => {
  it('defines the three requested MVP patients with complete intake surfaces', () => {
    expect(patients.map((patient) => patient.id)).toEqual([
      'gregory-vigil',
      'ayla-collingwood',
      'mara-lowell',
    ]);

    for (const patient of patients) {
      expect(patient.name).toMatch(/\w+ \w+/);
      expect(patient.requestSubject.length).toBeGreaterThan(10);
      expect(patient.requestBody.length).toBeGreaterThan(80);
      expect(patient.profile.length).toBeGreaterThan(60);
      expect(patient.startingAnxiety).toBeGreaterThanOrEqual(0);
      expect(patient.startingAnxiety).toBeLessThanOrEqual(100);
      expect(patient.dialogue).toHaveLength(6);
    }
  });

  it('keeps token identifiers unique and dialogue references valid', () => {
    for (const patient of patients) {
      const tokens = [
        ...patient.textTokens,
        ...patient.visualTokens,
        ...(patient.requiredBreakthrough ? [patient.requiredBreakthrough.result] : []),
      ];
      const tokenIds = new Set(tokens.map((token) => token.id));
      const nodeIds = new Set(patient.dialogue.map((node) => node.id));

      expect(tokenIds.size).toBe(tokens.length);
      expect(nodeIds.size).toBe(patient.dialogue.length);

      for (const node of patient.dialogue) {
        expect(node.patientText.length).toBeGreaterThan(40);
        expect(node.responseOptions.length).toBeGreaterThan(0);
        expect(node.keywordTokenIds.every((tokenId) => tokenIds.has(tokenId))).toBe(true);
        expect(node.unlocksWhenTokens?.every((tokenId) => tokenIds.has(tokenId))).not.toBe(false);

        for (const response of node.responseOptions) {
          expect(response.label.length).toBeGreaterThan(12);
          expect(response.anxietyDelta).toBeGreaterThanOrEqual(-20);
          expect(response.anxietyDelta).toBeLessThanOrEqual(20);
          expect(response.nextNodeId ? nodeIds.has(response.nextNodeId) : true).toBe(true);
          expect(response.requiresTokenIds?.every((tokenId) => tokenIds.has(tokenId))).not.toBe(false);
          expect(response.unlockTokenIds?.every((tokenId) => tokenIds.has(tokenId))).not.toBe(false);
        }
      }
    }
  });

  it('adds response-unlocked clues and meaningful response pressure for each patient', () => {
    for (const patient of patients) {
      const responseOptions = patient.dialogue.flatMap((node) => node.responseOptions);
      const unlockedTokenIds = responseOptions.flatMap((response) => response.unlockTokenIds ?? []);
      const tokenIds = new Set([
        ...patient.textTokens.map((token) => token.id),
        ...patient.visualTokens.map((token) => token.id),
        ...(patient.requiredBreakthrough ? [patient.requiredBreakthrough.result.id] : []),
      ]);

      expect(unlockedTokenIds.length).toBeGreaterThanOrEqual(1);
      expect(unlockedTokenIds.every((tokenId) => tokenIds.has(tokenId))).toBe(true);
      expect(responseOptions.some((response) => response.anxietyDelta <= -6)).toBe(true);
      expect(responseOptions.some((response) => response.anxietyDelta >= 6)).toBe(true);
    }
  });

  it('includes the required text and visual clue labels', () => {
    const tokenLabels = patients.flatMap((patient) => [
      ...patient.textTokens.map((token) => token.label),
      ...patient.visualTokens.map((token) => token.label),
    ]);

    expect(tokenLabels).toEqual(expect.arrayContaining([
      'Persistent worry',
      "Can't concentrate",
      'Bitten nails',
      'Bags under eyes',
      'Racing thoughts / manic',
      'Hopeless / depressed',
      'Fidgeting',
      'Wide pupils',
      'Slumped posture',
      'Flat expression',
      'Claims severe medical history',
      'Perfect-health presentation',
    ]));
  });

  it('requires Mara synthesis to connect claimed severity with healthy visual evidence', () => {
    const mara = patients.find((patient) => patient.id === 'mara-lowell');
    expect(mara?.requiredBreakthrough?.tokenIds).toEqual(['mara-severe-history', 'mara-healthy']);
    expect(mara?.requiredBreakthrough?.result.label).toContain('claimed severity vs healthy presentation');
    expect(mara?.requiredBreakthrough?.result.description).toMatch(/severe medical history conflicts with healthy visual evidence/i);

    const contradictingVisuals = mara?.visualTokens.filter((token) =>
      token.conflictsWith?.includes('mara-severe-history') && token.tags.includes('healthy-presentation'),
    );
    expect(contradictingVisuals?.length).toBeGreaterThanOrEqual(3);
  });

  it('frames handbook material as fictional puzzle content rather than real clinical advice', () => {
    for (const diagnosis of diagnoses) {
      const handbookText = [diagnosis.summary, ...diagnosis.criteria].join(' ');

      expect(handbookText).toMatch(/fictional|game|puzzle|authored/i);
      expect(handbookText).toMatch(/not real clinical advice|not real advice|without treating the puzzle as real advice/i);
    }
  });

  it('aligns handbook diagnoses with patient evidence tags', () => {
    expect(diagnoses.map((diagnosis) => diagnosis.name)).toEqual(expect.arrayContaining(requiredDiagnosisNames));

    for (const patient of patients) {
      const diagnosis = diagnoses.find((entry) => entry.id === patient.correctDiagnosisId);
      const patientTags = new Set([...patient.textTokens, ...patient.visualTokens].flatMap((token) => token.tags));
      const matches = diagnosis?.strongTags.filter((tag) => patientTags.has(tag)) ?? [];

      expect(diagnosis).toBeDefined();
      expect(diagnosis?.criteria.length).toBeGreaterThanOrEqual(3);
      expect(matches.length).toBeGreaterThanOrEqual(3);
    }
  });
});
