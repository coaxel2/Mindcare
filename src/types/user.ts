import type { Timestamp } from 'firebase/firestore';

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL: string | null;
  onboardingCompleted: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  preferences: {
    notifications: boolean;
    dailyReminderTime: string | null;
  };
}
