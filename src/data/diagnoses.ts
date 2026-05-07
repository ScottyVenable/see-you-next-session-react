import type { Diagnosis } from '../types';

export const diagnoses: Diagnosis[] = [
  {
    id: 'generalized-anxiety',
    name: 'Generalized Anxiety Disorder',
    summary: 'Fictional puzzle formulation: persistent, difficult-to-control worry across multiple domains with attention, sleep, fatigue, and tension costs.',
    criteria: [
      'Excessive worry across several topics more days than not, represented here by work, family, money, and health concerns.',
      'Difficulty controlling the worry, often with checking or reassurance loops that provide only brief relief.',
      'Restlessness, fatigue, poor concentration, muscle tension, or sleep disturbance causing impairment in the fictional case note.',
      'Handbook entries are game criteria for pattern recognition and are not real clinical advice.',
    ],
    strongTags: ['worry', 'concentration', 'sleep', 'anxiety', 'generalized', 'duration', 'tension', 'impairment'],
  },
  {
    id: 'bipolar-i',
    name: 'Bipolar I Disorder',
    summary: 'Fictional puzzle formulation: manic activation with reduced need for sleep and impairment, contrasted with depressive episodes.',
    criteria: [
      'Distinct period of abnormally elevated or irritable mood with increased energy or activity, not merely ordinary productivity.',
      'Racing thoughts, decreased need for sleep, pressured behavior, psychomotor activation, or risky decisions.',
      'Episode causes impairment or marked change noticed by others; depressive episodes may appear elsewhere in the course.',
      'Handbook entries are game criteria for pattern recognition and are not real clinical advice.',
    ],
    strongTags: ['mania', 'racing-thoughts', 'depression', 'activation', 'decreased-sleep', 'psychomotor', 'episodic', 'hopelessness', 'impairment', 'risky-decisions'],
  },
  {
    id: 'factitious-disorder',
    name: 'Factitious Disorder',
    summary: 'Fictional puzzle formulation: possible symptom falsification identified through contradictions between claims and evidence without clear external reward.',
    criteria: [
      'False presentation of physical or psychological symptoms, or a pattern strongly suggesting falsification within the authored case.',
      'Contradictory evidence, such as severe medical claims paired with healthy presentation, missing records, and observed stamina.',
      'Behavior persists without clear external incentives; formulate carefully, non-punitively, and without treating the puzzle as real advice.',
      'The player should compare stated severity with visual evidence before choosing this formulation.',
    ],
    strongTags: ['contradiction', 'medical-claims', 'healthy-presentation', 'falsification', 'severity', 'records-gap', 'factitious', 'presentation', 'no-external-incentive'],
  },
  {
    id: 'major-depression',
    name: 'Major Depressive Disorder',
    summary: 'Fictional puzzle differential: depressed mood or anhedonia with functional impairment, without the manic activation required elsewhere.',
    criteria: [
      'Depressed mood or loss of interest.',
      'Sleep, appetite, energy, concentration, psychomotor, guilt, or safety symptoms.',
      'Symptoms cause distress or impairment in the authored case.',
      'Handbook entries are game criteria for pattern recognition and are not real clinical advice.',
    ],
    strongTags: ['depression', 'flat-affect', 'hopelessness'],
  },
];
