import type { Timestamp } from 'firebase/firestore';

export type MoodType = 'tres_bien' | 'bien' | 'neutre' | 'mal' | 'tres_mal';

export interface MoodEntry {
  id: string;
  mood: MoodType;
  note: string;
  createdAt: Timestamp;
}
