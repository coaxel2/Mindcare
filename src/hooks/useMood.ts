import { useState, useEffect, useCallback } from 'react';
import {
  saveMood as saveMoodService,
  getTodayMood,
  getMoodHistory as getMoodHistoryService,
} from '../services/mood.service';
import type { MoodType, MoodEntry } from '../types';

export const useMood = (uid: string) => {
  const [todayMood, setTodayMood] = useState<MoodEntry | null>(null);
  const [moodHistory, setMoodHistory] = useState<MoodEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const hasMoodToday = todayMood !== null;

  const loadMoodData = useCallback(async () => {
    if (!uid) return;
    setIsLoading(true);
    try {
      const [today, history] = await Promise.all([
        getTodayMood(uid),
        getMoodHistoryService(uid),
      ]);
      setTodayMood(today);
      setMoodHistory(history);
    } finally {
      setIsLoading(false);
    }
  }, [uid]);

  useEffect(() => {
    loadMoodData();
  }, [loadMoodData]);

  const saveMood = useCallback(
    async (mood: MoodType, note: string = '') => {
      await saveMoodService(uid, mood, note);
      await loadMoodData();
    },
    [uid, loadMoodData]
  );

  return {
    todayMood,
    moodHistory,
    isLoading,
    saveMood,
    hasMoodToday,
  };
};
