import {
  collection,
  addDoc,
  query,
  where,
  orderBy,
  limit as firestoreLimit,
  getDocs,
  Timestamp,
} from 'firebase/firestore';
import { db } from '../config/firebase';
import type { MoodType, MoodEntry } from '../types';

export const saveMood = async (
  uid: string,
  mood: MoodType,
  note: string
): Promise<string> => {
  const moodsRef = collection(db, 'users', uid, 'moods');
  const docRef = await addDoc(moodsRef, {
    mood,
    note,
    createdAt: Timestamp.now(),
  });
  return docRef.id;
};

export const getTodayMood = async (uid: string): Promise<MoodEntry | null> => {
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);

  const moodsRef = collection(db, 'users', uid, 'moods');
  const q = query(
    moodsRef,
    where('createdAt', '>=', Timestamp.fromDate(startOfToday)),
    orderBy('createdAt', 'desc'),
    firestoreLimit(1)
  );

  const snapshot = await getDocs(q);
  if (snapshot.empty) {
    return null;
  }

  const d = snapshot.docs[0];
  return {
    id: d.id,
    ...d.data(),
  } as MoodEntry;
};

export const getMoodHistory = async (
  uid: string,
  limitCount: number = 90
): Promise<MoodEntry[]> => {
  const moodsRef = collection(db, 'users', uid, 'moods');
  const q = query(
    moodsRef,
    orderBy('createdAt', 'desc'),
    firestoreLimit(limitCount)
  );

  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => ({
    id: d.id,
    ...d.data(),
  })) as MoodEntry[];
};
