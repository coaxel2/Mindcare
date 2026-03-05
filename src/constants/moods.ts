import type { MoodType } from '../types';

export interface MoodConfig {
  type: MoodType;
  emoji: string;
  label: string;
  color: string;
}

export const MOODS: MoodConfig[] = [
  { type: 'tres_bien', emoji: '😄', label: 'Très bien', color: '#27D48D' },
  { type: 'bien', emoji: '🙂', label: 'Bien', color: '#5EEDB3' },
  { type: 'neutre', emoji: '😐', label: 'Neutre', color: '#FFE208' },
  { type: 'mal', emoji: '😔', label: 'Mal', color: '#FFA07A' },
  { type: 'tres_mal', emoji: '😢', label: 'Très mal', color: '#FF6B6B' },
];

export function getMoodConfig(type: MoodType): MoodConfig {
  return MOODS.find(m => m.type === type) ?? MOODS[2];
}
