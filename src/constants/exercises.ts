import type { BreathingExercise, WellnessExercise } from '../types';

export const BREATHING_EXERCISES: BreathingExercise[] = [
  {
    id: 'coherence',
    title: 'Cohérence cardiaque',
    description: 'Inspire 5 secondes, expire 5 secondes. Apaise le système nerveux en quelques minutes.',
    inhaleSeconds: 5,
    holdSeconds: 0,
    exhaleSeconds: 5,
    cycles: 6,
    icon: 'heart',
  },
  {
    id: '478',
    title: 'Respiration 4-7-8',
    description: 'Technique de relaxation profonde. Inspire 4s, retiens 7s, expire 8s.',
    inhaleSeconds: 4,
    holdSeconds: 7,
    exhaleSeconds: 8,
    cycles: 4,
    icon: 'moon',
  },
  {
    id: 'box',
    title: 'Respiration carrée',
    description: 'Inspire, retiens, expire, retiens — chaque phase dure 4 secondes.',
    inhaleSeconds: 4,
    holdSeconds: 4,
    exhaleSeconds: 4,
    cycles: 6,
    icon: 'square',
  },
];

export const WELLNESS_EXERCISES: WellnessExercise[] = [
  {
    id: '54321',
    title: 'Ancrage 5-4-3-2-1',
    description: 'Reconnecte-toi au moment présent avec tes 5 sens.',
    durationMinutes: 5,
    steps: [
      'Nomme 5 choses que tu vois autour de toi',
      'Touche 4 objets différents et décris leur texture',
      'Écoute et identifie 3 sons distincts',
      'Identifie 2 odeurs autour de toi',
      'Concentre-toi sur 1 goût dans ta bouche',
    ],
    category: 'grounding',
  },
  {
    id: 'body-scan',
    title: 'Scan corporel',
    description: 'Parcours ton corps de la tête aux pieds pour relâcher les tensions.',
    durationMinutes: 10,
    steps: [
      'Installe-toi confortablement et ferme les yeux',
      'Porte ton attention sur le sommet de ta tête',
      'Descends lentement vers ton front, tes yeux, ta mâchoire',
      'Continue vers tes épaules, tes bras, tes mains',
      'Passe à ton torse, ton ventre',
      'Termine par tes jambes et tes pieds',
      'Relâche chaque zone de tension que tu rencontres',
    ],
    category: 'relaxation',
  },
  {
    id: 'gratitude',
    title: '3 gratitudes',
    description: 'Prends un moment pour noter 3 choses positives de ta journée.',
    durationMinutes: 5,
    steps: [
      'Ferme les yeux et prends 3 grandes respirations',
      'Pense à un moment agréable de ta journée',
      'Pense à une personne qui compte pour toi',
      'Pense à une chose simple qui te rend heureux/heureuse',
      'Note ces 3 gratitudes dans ton journal si tu le souhaites',
    ],
    category: 'mindfulness',
  },
];
