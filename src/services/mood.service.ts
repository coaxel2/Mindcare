import { IS_DEMO_MODE, db } from '../config/firebase';
import { demoGet, demoSet } from '../utils/demoStorage';
import type { MoodType, MoodEntry } from '../types';

const demoKey = (uid: string) => `mindcare_moods_${uid}`;

function demoSaveMood(uid: string, mood: MoodType, note: string): string {
  const moods = demoGet<MoodEntry[]>(demoKey(uid), []);
  const id = `mood_${Date.now()}`;
  const entry = { id, mood, note, createdAt: new Date().toISOString() } as unknown as MoodEntry;
  demoSet(demoKey(uid), [entry, ...moods]);
  return id;
}

function demoGetTodayMood(uid: string): MoodEntry | null {
  const moods = demoGet<MoodEntry[]>(demoKey(uid), []);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return moods.find((m) => new Date(m.createdAt as unknown as string) >= today) ?? null;
}

function demoGetHistory(uid: string, limitCount: number): MoodEntry[] {
  return demoGet<MoodEntry[]>(demoKey(uid), []).slice(0, limitCount);
}

export const saveMood = async (uid: string, mood: MoodType, note: string): Promise<string> => {
  if (IS_DEMO_MODE) return demoSaveMood(uid, mood, note);
  const { collection, addDoc, Timestamp } = await import('firebase/firestore');
  const docRef = await addDoc(collection(db, 'users', uid, 'moods'), {
    mood, note, createdAt: Timestamp.now(),
  });
  return docRef.id;
};

export const getTodayMood = async (uid: string): Promise<MoodEntry | null> => {
  if (IS_DEMO_MODE) return demoGetTodayMood(uid);
  const { collection, query, where, orderBy, limit, getDocs, Timestamp } =
    await import('firebase/firestore');
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);
  const q = query(
    collection(db, 'users', uid, 'moods'),
    where('createdAt', '>=', Timestamp.fromDate(startOfToday)),
    orderBy('createdAt', 'desc'),
    limit(1)
  );
  const snap = await getDocs(q);
  if (snap.empty) return null;
  const d = snap.docs[0];
  return { id: d.id, ...d.data() } as MoodEntry;
};

export const getMoodHistory = async (uid: string, limitCount = 90): Promise<MoodEntry[]> => {
  if (IS_DEMO_MODE) return demoGetHistory(uid, limitCount);
  const { collection, query, orderBy, limit, getDocs } = await import('firebase/firestore');
  const q = query(
    collection(db, 'users', uid, 'moods'),
    orderBy('createdAt', 'desc'),
    limit(limitCount)
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() })) as MoodEntry[];
};
