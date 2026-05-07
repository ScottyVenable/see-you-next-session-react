import type { Decor, Skill } from '../types';

export const skills: Skill[] = [
  {
    id: 'anxiety-specialist',
    name: 'Anxiety Specialist',
    description: 'Focus observations cost 1 less, minimum 1.',
    cost: 4,
  },
  {
    id: 'clinical-endurance',
    name: 'Clinical Endurance',
    description: 'Start future sessions with 2 more maximum Focus.',
    cost: 5,
  },
  {
    id: 'integrative-formulation',
    name: 'Integrative Formulation',
    description: 'Breakthroughs grant 1 extra Knowledge Point.',
    cost: 6,
  },
];

export const decor: Decor[] = [
  {
    id: 'comfortable-chair',
    name: 'Comfortable Chair',
    description: 'A grounded office seat. Future sessions gain 1 maximum Focus.',
    cost: 3,
  },
  {
    id: 'fish-tank',
    name: 'Fish Tank',
    description: 'Gentle movement in the corner slows patient anxiety each turn.',
    cost: 4,
  },
];
