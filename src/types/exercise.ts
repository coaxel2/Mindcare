export interface BreathingExercise {
  id: string;
  title: string;
  description: string;
  inhaleSeconds: number;
  holdSeconds: number;
  exhaleSeconds: number;
  cycles: number;
  icon: string;
}

export interface WellnessExercise {
  id: string;
  title: string;
  description: string;
  durationMinutes: number;
  steps: string[];
  category: 'grounding' | 'relaxation' | 'mindfulness';
}
