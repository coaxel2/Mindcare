import { doc, getDoc, setDoc, updateDoc, Timestamp } from 'firebase/firestore';
import { db } from '../config/firebase';
import type { UserProfile } from '../types';

export const createUserProfile = async (
  uid: string,
  data: { email: string; displayName: string }
): Promise<void> => {
  const userRef = doc(db, 'users', uid);
  const profile: UserProfile = {
    uid,
    email: data.email,
    displayName: data.displayName,
    photoURL: null,
    onboardingCompleted: false,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
    preferences: {
      notifications: true,
      dailyReminderTime: null,
    },
  };
  await setDoc(userRef, profile);
};

export const getUserProfile = async (uid: string): Promise<UserProfile | null> => {
  const userRef = doc(db, 'users', uid);
  const snapshot = await getDoc(userRef);
  if (!snapshot.exists()) {
    return null;
  }
  return snapshot.data() as UserProfile;
};

export const updateUserProfile = async (
  uid: string,
  data: Partial<UserProfile>
): Promise<void> => {
  const userRef = doc(db, 'users', uid);
  await updateDoc(userRef, {
    ...data,
    updatedAt: Timestamp.now(),
  });
};
