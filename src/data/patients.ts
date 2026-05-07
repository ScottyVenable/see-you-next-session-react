import type { Patient, Token } from '../types';

const makeToken = (
  id: string,
  label: string,
  kind: Token['kind'],
  source: string,
  description: string,
  tags: string[],
  conflictsWith: string[] = [],
): Token => ({ id, label, kind, source, description, tags, conflictsWith, slot: 'clipboard' });

export const patients: Patient[] = [
  {
    id: 'gregory-vigil',
    name: 'Gregory Vigil',
    difficulty: 'tutorial',
    requestSubject: 'Tutorial consult: I cannot turn my brain off',
    requestBody:
      'This is for the clinic training sim, not a request for real-life treatment advice. In the puzzle hour, I keep rehearsing work mistakes, family worries, and health what-ifs until I lose time to checking.',
    profile: 'Accountant, 41. Tutorial case. Polite, sleep-deprived, apologizes before answering, and shows a broad, persistent worry pattern that affects ledgers, family calls, and sleep.',
    startingAnxiety: 42,
    correctDiagnosisId: 'generalized-anxiety',
    textTokens: [
      makeToken('gregory-worry', 'Persistent worry', 'text', 'Gregory', 'Worry persists across work, family, money, and health for most days of the week.', ['worry', 'anxiety', 'generalized', 'duration']),
      makeToken('gregory-concentrate', "Can't concentrate", 'text', 'Gregory', 'Loses track of ledgers and conversations because attention keeps returning to possible mistakes.', ['concentration', 'anxiety', 'impairment']),
      makeToken('gregory-six-months', 'Six-month most-days pattern', 'text', 'Gregory', 'Describes roughly seven months of worry on most days, with only brief quiet stretches.', ['duration', 'generalized', 'anxiety', 'impairment']),
    ],
    visualTokens: [
      makeToken('gregory-nails', 'Bitten nails', 'visual', 'Observation', 'Nail beds are ragged; he notices the glance and folds his hands under the clipboard.', ['anxiety', 'restlessness', 'tension']),
      makeToken('gregory-bags', 'Bags under eyes', 'visual', 'Observation', 'Dark under-eye circles and slow blinks support his report of poor sleep.', ['sleep', 'fatigue', 'anxiety']),
    ],
    dialogue: [
      {
        id: 'start',
        patientText:
          'Every morning starts with a list of possible disasters. If I answer one email wrong, I can feel the whole week collapse before breakfast, even when part of me knows the fear is outpacing the facts.',
        keywordTokenIds: ['gregory-worry'],
        responseOptions: [
          { id: 'reflect-threat-scan', label: 'Reflect the constant threat scanning', technique: 'reflect', nextNodeId: 'scope', anxietyDelta: -6 },
          { id: 'ground-before-map', label: 'Orient to the room before mapping worries', technique: 'ground', nextNodeId: 'scope', anxietyDelta: -8, focusDelta: -1 },
          { id: 'challenge-too-soon', label: 'Challenge the odds of disaster immediately', technique: 'challenge', nextNodeId: 'scope', anxietyDelta: 7 },
        ],
      },
      {
        id: 'scope',
        patientText:
          'It is not one topic. Work, my sister driving at night, a mole I have had for years, the rent escrow. My mind treats all of it like an alarm, and reassurance only buys me an hour.',
        keywordTokenIds: [],
        responseOptions: [
          { id: 'clarify-domains', label: 'Clarify how many life areas are affected', technique: 'clarify', nextNodeId: 'work-focus', anxietyDelta: -5, unlockTokenIds: ['gregory-six-months'] },
          { id: 'reflect-generalized', label: 'Name the cross-domain pattern without diagnosing yet', technique: 'reflect', nextNodeId: 'work-focus', anxietyDelta: -6 },
          { id: 'ground-list', label: 'Slow the list into one item at a time', technique: 'ground', nextNodeId: 'work-focus', anxietyDelta: -7, focusDelta: -1 },
        ],
      },
      {
        id: 'work-focus',
        patientText:
          'I reread spreadsheets until the numbers blur. Then I miss what people say in meetings because I am still mentally checking the last thing I sent and preparing apologies for errors no one has found.',
        keywordTokenIds: ['gregory-concentrate'],
        responseOptions: [
          { id: 'clarify-impairment', label: 'Clarify impairment at work and home', technique: 'clarify', nextNodeId: 'body-sleep', anxietyDelta: -4 },
          { id: 'reflect-worry-attention', label: 'Name the loop between worry and attention', technique: 'reflect', nextNodeId: 'body-sleep', anxietyDelta: -7 },
          { id: 'challenge-productivity', label: 'Frame checking as simple perfectionism', technique: 'challenge', nextNodeId: 'body-sleep', anxietyDelta: 8 },
        ],
      },
      {
        id: 'body-sleep',
        patientText:
          'Sleep is not really sleep. It is more like negotiating with tomorrow until the alarm interrupts. My jaw aches, my shoulders stay braced, and coffee has become a workaround instead of rest.',
        keywordTokenIds: [],
        responseOptions: [
          { id: 'clarify-duration', label: 'Clarify duration and most-days pattern', technique: 'clarify', nextNodeId: 'reassurance', anxietyDelta: -5, unlockTokenIds: ['gregory-six-months'] },
          { id: 'reflect-body-load', label: 'Reflect the physical load of vigilance', technique: 'reflect', nextNodeId: 'reassurance', anxietyDelta: -6 },
          { id: 'ground-tense', label: 'Briefly orient from shoulders to chair', technique: 'ground', nextNodeId: 'reassurance', anxietyDelta: -8, focusDelta: -1 },
        ],
      },
      {
        id: 'reassurance',
        patientText:
          'People keep telling me to stop overthinking. I would if there were a switch. Mostly I want proof that I am not missing something dangerous, but the proof expires as soon as the next worry arrives.',
        keywordTokenIds: [],
        unlocksWhenTokens: ['gregory-worry', 'gregory-concentrate'],
        responseOptions: [
          { id: 'reflect-not-choice', label: 'Reflect effort without endorsing every fear', technique: 'reflect', nextNodeId: 'close', anxietyDelta: -7 },
          { id: 'clarify-safety-behaviors', label: 'Clarify checking and reassurance loops', technique: 'clarify', nextNodeId: 'close', anxietyDelta: -5, requiresTokenIds: ['gregory-worry'] },
          { id: 'challenge-switch', label: 'Say worry should be easy to switch off', technique: 'challenge', nextNodeId: 'close', anxietyDelta: 10 },
        ],
      },
      {
        id: 'close',
        patientText:
          'That summary sounds uncomfortably accurate for the case note: worry across several areas, checking that does not hold, poor sleep, body tension, and attention shredded by trying to prevent mistakes.',
        keywordTokenIds: [],
        responseOptions: [
          { id: 'close-formulation', label: 'Summarize worry, focus, sleep, and impairment', technique: 'reflect', anxietyDelta: -6 },
          { id: 'close-document', label: 'Collaboratively move to documentation', technique: 'clarify', anxietyDelta: -4 },
        ],
      },
    ],
  },
  {
    id: 'ayla-collingwood',
    name: 'Ayla Collingwood',
    difficulty: 'medium',
    requestSubject: 'My mood has two engines',
    requestBody:
      'For this fictional clinic exercise, I need someone to track both parts of the pattern. Some weeks I am unstoppable and sleep feels optional; later it turns into a room with no windows.',
    profile: 'Graduate student, 29. Medium case. Quick speech and intense eye contact during elevated material, then a marked slowdown when describing depressive weeks and losses.',
    startingAnxiety: 55,
    correctDiagnosisId: 'bipolar-i',
    textTokens: [
      makeToken('ayla-racing', 'Racing thoughts / manic', 'text', 'Ayla', 'Thoughts arrive too quickly to organize during high-energy weeks with reduced need for sleep.', ['mania', 'racing-thoughts', 'activation', 'decreased-sleep']),
      makeToken('ayla-hopeless', 'Hopeless / depressed', 'text', 'Ayla', 'Periods of low mood, withdrawal, and hopeless language follow activation.', ['depression', 'hopelessness', 'episodic']),
      makeToken('ayla-impairment', 'Marked impairment during highs', 'text', 'Ayla', 'Elevated weeks bring spending, conflict, missed obligations, and intervention from others rather than only productivity.', ['mania', 'impairment', 'risky-decisions', 'episodic']),
    ],
    visualTokens: [
      makeToken('ayla-fidget', 'Fidgeting', 'visual', 'Observation', 'Hands move constantly while describing elevated weeks, tapping out a quick uneven rhythm.', ['activation', 'mania', 'psychomotor']),
      makeToken('ayla-pupils', 'Wide pupils', 'visual', 'Observation', 'Eyes remain unusually wide and alert as she jumps between projects and unfinished plans.', ['activation', 'mania']),
      makeToken('ayla-slumped', 'Slumped posture', 'visual', 'Observation', 'Posture collapses when depressive weeks are discussed, shoulders drawing inward.', ['depression', 'psychomotor']),
      makeToken('ayla-flat', 'Flat expression', 'visual', 'Observation', 'Affect flattens around hopeless content; her voice loses pace and color.', ['flat-affect', 'depression']),
    ],
    dialogue: [
      {
        id: 'start',
        patientText:
          'When the fast weeks start, I can write all night. I do not miss sleep. I miss being interrupted because every idea feels connected and urgent, and my body feels several steps ahead of the room.',
        keywordTokenIds: ['ayla-racing'],
        responseOptions: [
          { id: 'clarify-energy-sleep', label: 'Map energy, sleep, and impairment', technique: 'clarify', nextNodeId: 'sleep-energy', anxietyDelta: -5 },
          { id: 'ground-pace', label: 'Slow the pace with orientation', technique: 'ground', nextNodeId: 'sleep-energy', anxietyDelta: -7, focusDelta: -1 },
          { id: 'challenge-productivity-only', label: 'Ask if this is only productivity', technique: 'challenge', nextNodeId: 'sleep-energy', anxietyDelta: 8 },
        ],
      },
      {
        id: 'sleep-energy',
        patientText:
          'I once stayed up for three nights building a proposal, cleaning the apartment, and emailing professors at dawn. I felt brilliant until my advisor asked me to stop sending messages and my partner hid my cards.',
        keywordTokenIds: [],
        responseOptions: [
          { id: 'clarify-consequences', label: 'Clarify consequences and judgment changes', technique: 'clarify', nextNodeId: 'consequences', anxietyDelta: -4, unlockTokenIds: ['ayla-impairment'] },
          { id: 'reflect-velocity', label: 'Reflect velocity and social fallout', technique: 'reflect', nextNodeId: 'consequences', anxietyDelta: -6, requiresTokenIds: ['ayla-racing'] },
          { id: 'challenge-sleep', label: 'Suggest everyone loses sleep sometimes', technique: 'challenge', nextNodeId: 'consequences', anxietyDelta: 8 },
        ],
      },
      {
        id: 'consequences',
        patientText:
          'The high part is not just happy. It is loud. I spend money I meant to save, interrupt people, start projects I cannot finish, and hear my own voice getting faster while everyone else looks alarmed.',
        keywordTokenIds: [],
        responseOptions: [
          { id: 'clarify-manic-features', label: 'Clarify manic features without moral judgment', technique: 'clarify', nextNodeId: 'low', anxietyDelta: -5 },
          { id: 'reflect-not-character', label: 'Separate symptoms from character', technique: 'reflect', nextNodeId: 'low', anxietyDelta: -7 },
          { id: 'ground-loud-room', label: 'Ground before turning toward the crash', technique: 'ground', nextNodeId: 'low', anxietyDelta: -6, focusDelta: -1 },
        ],
      },
      {
        id: 'low',
        patientText:
          'Then I crash. Messages feel impossible. I tell myself everyone is better off if I stay quiet, and even showering feels like an argument I keep losing. The contrast makes me distrust both versions of myself.',
        keywordTokenIds: ['ayla-hopeless'],
        responseOptions: [
          { id: 'reflect-low-state', label: 'Hold the depressive state with care', technique: 'reflect', nextNodeId: 'contrast', anxietyDelta: -6 },
          { id: 'clarify-low-timing', label: 'Clarify timing between highs and lows', technique: 'clarify', nextNodeId: 'contrast', anxietyDelta: -4 },
          { id: 'challenge-inconsistency', label: 'Call the two accounts inconsistent', technique: 'challenge', nextNodeId: 'contrast', anxietyDelta: 9 },
        ],
      },
      {
        id: 'contrast',
        patientText:
          'The worst part is people only meet one version. They either praise the spark or worry about the silence, and neither one feels like the whole chart. I need the note to show sequence, not a personality flaw.',
        keywordTokenIds: [],
        responseOptions: [
          { id: 'reflect-both-poles', label: 'Hold activation and depression in one formulation', technique: 'reflect', nextNodeId: 'close', anxietyDelta: -7, requiresTokenIds: ['ayla-racing', 'ayla-hopeless'] },
          { id: 'clarify-episode-order', label: 'Clarify episode order for the note', technique: 'clarify', nextNodeId: 'close', anxietyDelta: -5 },
          { id: 'ground-transition', label: 'Ground before closing the hour', technique: 'ground', nextNodeId: 'close', anxietyDelta: -5, focusDelta: -1 },
        ],
      },
      {
        id: 'close',
        patientText:
          'So the puzzle note should not erase either side: fast thoughts, less sleep, consequences that other people noticed, then the weeks where I disappear and stop trusting my own momentum.',
        keywordTokenIds: [],
        responseOptions: [
          { id: 'close-bipolar-pattern', label: 'Document episodic activation plus depression', technique: 'reflect', anxietyDelta: -5 },
          { id: 'close-evidence', label: 'List the evidence tokens for documentation', technique: 'clarify', anxietyDelta: -4 },
        ],
      },
    ],
  },
  {
    id: 'mara-lowell',
    name: 'Mara Lowell',
    difficulty: 'hard',
    requestSubject: 'Specialist after specialist missed it',
    requestBody:
      'This fictional intake is complicated. I need a clinician who will finally understand how severe my claimed illnesses are and write only what the evidence in this hour can support.',
    profile: 'Office manager, 36. Hard case. Highly detailed medical narrative, polished affect, healthy observed stamina, and a path that requires non-accusatory contradiction synthesis.',
    startingAnxiety: 48,
    correctDiagnosisId: 'factitious-disorder',
    textTokens: [
      makeToken('mara-severe-history', 'Claims severe medical history', 'text', 'Mara', 'Reports dramatic recurrent illness, organ scares, inpatient stays, and many procedures.', ['medical-claims', 'severity', 'factitious']),
      makeToken('mara-specialists', 'Many specialists, few records', 'text', 'Mara', 'Names many consultations but offers limited verifiable documentation or release details.', ['medical-claims', 'falsification', 'records-gap']),
      makeToken('mara-no-incentive', 'No obvious external reward', 'text', 'Mara', 'The request centers on recognition, care, and being documented as ill rather than money, medication, housing, or avoiding duty.', ['factitious', 'no-external-incentive', 'presentation']),
    ],
    visualTokens: [
      makeToken('mara-healthy', 'Perfect-health presentation', 'visual', 'Observation', 'Steady gait, easy breathing, clear voice, and sustained stamina do not match the claimed current severity.', ['healthy-presentation', 'contradiction', 'factitious'], ['mara-severe-history']),
      makeToken('mara-clear-skin', 'Clear skin tone', 'visual', 'Observation', 'Color, hydration, and alertness appear robust while she describes ongoing systemic collapse.', ['healthy-presentation', 'contradiction'], ['mara-severe-history']),
      makeToken('mara-no-distress', 'No visible acute distress', 'visual', 'Observation', 'She sits comfortably through the hour without guarding, wincing, breathlessness, or fatigue cues.', ['healthy-presentation', 'contradiction'], ['mara-severe-history']),
      makeToken('mara-composed', 'Composed while describing crisis', 'visual', 'Observation', 'Affect remains controlled and rehearsed during intense medical claims, suggesting the player should compare story with observed state.', ['contradiction', 'presentation'], ['mara-severe-history']),
    ],
    requiredBreakthrough: {
      tokenIds: ['mara-severe-history', 'mara-healthy'],
      result: makeToken(
        'mara-breakthrough',
        'Contradiction: claimed severity vs healthy presentation',
        'breakthrough',
        'Synthesis',
        'The claimed severe medical history conflicts with healthy visual evidence gathered in the room. Treat the discrepancy as a fictional clinical puzzle, not a real-world diagnosis or character judgment.',
        ['contradiction', 'medical-claims', 'healthy-presentation', 'falsification', 'factitious'],
      ),
    },
    dialogue: [
      {
        id: 'start',
        patientText:
          'I have been through everything. Rare infections, organ scares, emergency consults. Most clinicians get intimidated when they realize how severe it is, and then they write something too small.',
        keywordTokenIds: ['mara-severe-history'],
        responseOptions: [
          { id: 'clarify-chronology', label: 'Ask for chronology and records', technique: 'clarify', nextNodeId: 'records', anxietyDelta: -2 },
          { id: 'reflect-believed', label: 'Reflect the wish to be believed', technique: 'reflect', nextNodeId: 'records', anxietyDelta: -5 },
          { id: 'challenge-inconsistency-early', label: 'Confront inconsistency immediately', technique: 'challenge', nextNodeId: 'records', anxietyDelta: 14 },
        ],
      },
      {
        id: 'records',
        patientText:
          'Records are scattered. Some hospitals merged. One doctor retired. I can reconstruct most of it from memory if you need the official version, but releases always slow everything down.',
        keywordTokenIds: ['mara-specialists'],
        responseOptions: [
          { id: 'clarify-record-gaps', label: 'Track gaps without accusing', technique: 'clarify', nextNodeId: 'functioning', anxietyDelta: -3 },
          { id: 'reflect-paper-trail', label: 'Reflect how much rests on the paper trail', technique: 'reflect', nextNodeId: 'functioning', anxietyDelta: -4 },
          { id: 'challenge-records', label: 'Say missing records prove exaggeration', technique: 'challenge', nextNodeId: 'functioning', anxietyDelta: 13 },
        ],
      },
      {
        id: 'functioning',
        patientText:
          'I still come to work because if I stop, no one believes I am ill. I can perform normal for exactly as long as a room requires it, even if that means looking healthier than the story sounds.',
        keywordTokenIds: [],
        responseOptions: [
          { id: 'clarify-functioning', label: 'Clarify functioning versus claimed severity', technique: 'clarify', nextNodeId: 'letter', anxietyDelta: -2 },
          { id: 'ground-discrepancy', label: 'Stabilize before exploring discrepancies', technique: 'ground', nextNodeId: 'letter', anxietyDelta: -5, focusDelta: -1 },
          { id: 'reflect-performance', label: 'Reflect the pressure to perform illness and wellness', technique: 'reflect', nextNodeId: 'letter', anxietyDelta: -4 },
        ],
      },
      {
        id: 'letter',
        patientText:
          'I need you to write that this is serious. Not for a lawsuit or time off; I need the chart to prove someone saw the severity. If you understand the pattern, you will know what to include.',
        keywordTokenIds: [],
        responseOptions: [
          { id: 'clarify-document-limits', label: 'Clarify what can be documented from this hour', technique: 'clarify', nextNodeId: 'discrepancy', anxietyDelta: -3, unlockTokenIds: ['mara-no-incentive'] },
          { id: 'reflect-need-serious', label: 'Reflect the need for the suffering to count', technique: 'reflect', nextNodeId: 'discrepancy', anxietyDelta: -6, unlockTokenIds: ['mara-no-incentive'] },
          { id: 'challenge-letter', label: 'Refuse the request as manipulation', technique: 'challenge', nextNodeId: 'discrepancy', anxietyDelta: 15 },
        ],
      },
      {
        id: 'discrepancy',
        patientText:
          'You noticed I look well: steady breathing, clear color, no guarding. Everyone notices. They think that cancels the story, but maybe the mismatch is the only way I know to keep control of the room.',
        keywordTokenIds: [],
        unlocksWhenTokens: ['mara-breakthrough'],
        responseOptions: [
          { id: 'after-breakthrough', label: 'Name the discrepancy as a clinical question', technique: 'clarify', nextNodeId: 'resolved', anxietyDelta: -8, requiresTokenIds: ['mara-breakthrough'] },
          { id: 'reflect-without-accusing', label: 'Reflect the fear underneath being seen as well', technique: 'reflect', nextNodeId: 'resolved', anxietyDelta: -7, requiresTokenIds: ['mara-breakthrough'] },
        ],
      },
      {
        id: 'resolved',
        patientText:
          'No one has said it that gently before. Comparing what I claimed with what you saw sounds different from calling me a liar. Maybe I do not know what happens if people stop looking, or if they look and do not find anything.',
        keywordTokenIds: [],
        responseOptions: [
          { id: 'close-factitious', label: 'Document contradiction and factitious hypothesis', technique: 'reflect', anxietyDelta: -9 },
          { id: 'close-evidence', label: 'List claimed severity beside healthy visual evidence', technique: 'clarify', anxietyDelta: -7 },
        ],
      },
    ],
  },
];
