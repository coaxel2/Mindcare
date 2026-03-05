import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useMood } from '../hooks/useMood';
import { MOODS, getMoodConfig } from '../constants/moods';
import { formatDate } from '../utils/formatDate';
import {
  startOfMonth, endOfMonth, eachDayOfInterval, getDay, format,
  subMonths, addMonths, isSameDay, isToday
} from 'date-fns';
import { fr } from 'date-fns/locale';

export default function JournalPage() {
  const { user } = useAuth();
  const { moodHistory, isLoading } = useMood(user?.uid ?? '');
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedPeriod, setSelectedPeriod] = useState<'7j' | '30j' | '90j'>('30j');

  const monthDays = useMemo(() => {
    const start = startOfMonth(currentMonth);
    const end = endOfMonth(currentMonth);
    return eachDayOfInterval({ start, end });
  }, [currentMonth]);

  const startDayOffset = getDay(startOfMonth(currentMonth));
  const adjustedOffset = startDayOffset === 0 ? 6 : startDayOffset - 1;

  const getMoodForDay = (day: Date) => {
    return moodHistory.find((entry) => {
      const entryDate = entry.createdAt?.toDate?.() ?? new Date(entry.createdAt as unknown as string);
      return isSameDay(entryDate, day);
    });
  };

  const filteredHistory = useMemo(() => {
    const now = new Date();
    const days = selectedPeriod === '7j' ? 7 : selectedPeriod === '30j' ? 30 : 90;
    const cutoff = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
    return moodHistory.filter((entry) => {
      const date = entry.createdAt?.toDate?.() ?? new Date(entry.createdAt as unknown as string);
      return date >= cutoff;
    });
  }, [moodHistory, selectedPeriod]);

  const moodCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const mood of MOODS) {
      counts[mood.type] = filteredHistory.filter((e) => e.mood === mood.type).length;
    }
    return counts;
  }, [filteredHistory]);

  const totalEntries = filteredHistory.length;

  return (
    <div className="py-4 space-y-6 max-w-lg mx-auto">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold font-[family-name:var(--font-family-heading)]">
          Mon journal
        </h1>
        <p className="text-text-secondary text-sm mt-1">Ton historique émotionnel</p>
      </motion.div>

      {/* Calendar */}
      <motion.div
        className="bg-bg-card rounded-2xl p-5 shadow-sm"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
            className="text-text-muted hover:text-violet-500 transition-colors"
          >
            <ChevronLeft size={20} />
          </button>
          <h3 className="font-semibold text-sm capitalize font-[family-name:var(--font-family-heading)]">
            {format(currentMonth, 'MMMM yyyy', { locale: fr })}
          </h3>
          <button
            onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
            className="text-text-muted hover:text-violet-500 transition-colors"
          >
            <ChevronRight size={20} />
          </button>
        </div>

        <div className="grid grid-cols-7 gap-1 text-center text-[11px] text-text-muted mb-2">
          {['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'].map((d) => (
            <div key={d} className="py-1 font-medium">{d}</div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1">
          {Array.from({ length: adjustedOffset }).map((_, i) => (
            <div key={`empty-${i}`} />
          ))}
          {monthDays.map((day) => {
            const mood = getMoodForDay(day);
            const moodConfig = mood ? getMoodConfig(mood.mood) : null;
            return (
              <div
                key={day.toISOString()}
                className={`aspect-square flex items-center justify-center rounded-lg text-xs relative ${
                  isToday(day) ? 'ring-2 ring-violet-500 ring-offset-1' : ''
                }`}
                style={{
                  backgroundColor: moodConfig ? `${moodConfig.color}30` : 'transparent',
                }}
              >
                {moodConfig ? (
                  <span className="text-sm">{moodConfig.emoji}</span>
                ) : (
                  <span className="text-text-muted">{format(day, 'd')}</span>
                )}
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* Period selector + stats */}
      <motion.div
        className="bg-bg-card rounded-2xl p-5 shadow-sm"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="flex gap-2 mb-4">
          {(['7j', '30j', '90j'] as const).map((period) => (
            <button
              key={period}
              onClick={() => setSelectedPeriod(period)}
              className={`px-4 py-1.5 rounded-full text-xs font-medium transition-colors ${
                selectedPeriod === period
                  ? 'bg-violet-500 text-white'
                  : 'bg-violet-50 text-violet-500 hover:bg-violet-100'
              }`}
            >
              {period}
            </button>
          ))}
        </div>

        <div className="space-y-3">
          {MOODS.map((mood) => {
            const count = moodCounts[mood.type] || 0;
            const percentage = totalEntries > 0 ? (count / totalEntries) * 100 : 0;
            return (
              <div key={mood.type} className="flex items-center gap-3">
                <span className="text-lg w-8 text-center">{mood.emoji}</span>
                <div className="flex-1">
                  <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full rounded-full"
                      style={{ backgroundColor: mood.color }}
                      initial={{ width: 0 }}
                      animate={{ width: `${percentage}%` }}
                      transition={{ duration: 0.5, ease: 'easeOut' }}
                    />
                  </div>
                </div>
                <span className="text-xs text-text-muted w-8 text-right">{count}</span>
              </div>
            );
          })}
        </div>

        {totalEntries === 0 && !isLoading && (
          <p className="text-text-muted text-sm text-center mt-4">
            Aucune donnée pour cette période
          </p>
        )}
      </motion.div>

      {/* Recent entries */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <h2 className="text-lg font-semibold font-[family-name:var(--font-family-heading)] mb-3">
          Dernières entrées
        </h2>
        <div className="space-y-2">
          {moodHistory.slice(0, 10).map((entry) => {
            const config = getMoodConfig(entry.mood);
            const date = entry.createdAt?.toDate?.() ?? new Date(entry.createdAt as unknown as string);
            return (
              <div key={entry.id} className="bg-bg-card rounded-xl p-4 shadow-sm flex items-start gap-3">
                <span className="text-2xl">{config.emoji}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-sm">{config.label}</span>
                    <span className="text-text-muted text-xs">{formatDate(date, 'dd MMM yyyy')}</span>
                  </div>
                  {entry.note && (
                    <p className="text-text-secondary text-sm mt-1 truncate">{entry.note}</p>
                  )}
                </div>
              </div>
            );
          })}
          {moodHistory.length === 0 && !isLoading && (
            <p className="text-text-muted text-sm text-center py-8">
              Enregistre ta première humeur depuis l'accueil !
            </p>
          )}
        </div>
      </motion.div>
    </div>
  );
}
