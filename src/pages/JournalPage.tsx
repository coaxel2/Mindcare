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
    <div className="flex flex-col gap-5 py-4 pb-6 max-w-lg mx-auto">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-bold leading-tight">Mon journal</h1>
        <p className="text-text-secondary text-sm mt-1.5">Ton historique émotionnel</p>
      </motion.div>

      {/* Calendar */}
      <motion.div
        className="bg-bg-card rounded-2xl p-5 shadow-[var(--shadow-card)] border border-border/40"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="flex items-center justify-between mb-3">
          <button
            onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-text-muted active:bg-violet-50 active:text-violet-500 transition-colors"
          >
            <ChevronLeft size={18} />
          </button>
          <h3 className="font-bold text-sm capitalize">
            {format(currentMonth, 'MMMM yyyy', { locale: fr })}
          </h3>
          <button
            onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-text-muted active:bg-violet-50 active:text-violet-500 transition-colors"
          >
            <ChevronRight size={18} />
          </button>
        </div>

        <div className="grid grid-cols-7 gap-1 text-center text-[10px] text-text-muted mb-1.5">
          {['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'].map((d) => (
            <div key={d} className="py-0.5 font-semibold uppercase tracking-wide">{d}</div>
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
                className={`aspect-square flex items-center justify-center rounded-lg text-xs ${
                  isToday(day) ? 'ring-2 ring-violet-500 ring-offset-1' : ''
                }`}
                style={{
                  backgroundColor: moodConfig ? `${moodConfig.color}25` : 'transparent',
                }}
              >
                {moodConfig ? (
                  <span className="text-sm">{moodConfig.emoji}</span>
                ) : (
                  <span className="text-text-muted text-[11px]">{format(day, 'd')}</span>
                )}
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* Period selector + stats */}
      <motion.div
        className="bg-bg-card rounded-2xl p-5 shadow-[var(--shadow-card)] border border-border/40"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="flex gap-1.5 mb-4">
          {(['7j', '30j', '90j'] as const).map((period) => (
            <button
              key={period}
              onClick={() => setSelectedPeriod(period)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                selectedPeriod === period
                  ? 'bg-violet-500 text-white'
                  : 'bg-violet-50 text-violet-500 active:bg-violet-100'
              }`}
            >
              {period}
            </button>
          ))}
        </div>

        <div className="space-y-2.5">
          {MOODS.map((mood) => {
            const count = moodCounts[mood.type] || 0;
            const percentage = totalEntries > 0 ? (count / totalEntries) * 100 : 0;
            return (
              <div key={mood.type} className="flex items-center gap-2.5">
                <span className="text-base w-7 text-center">{mood.emoji}</span>
                <div className="flex-1">
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full rounded-full"
                      style={{ backgroundColor: mood.color }}
                      initial={{ width: 0 }}
                      animate={{ width: `${percentage}%` }}
                      transition={{ duration: 0.5, ease: 'easeOut' }}
                    />
                  </div>
                </div>
                <span className="text-[11px] text-text-muted w-6 text-right font-medium">{count}</span>
              </div>
            );
          })}
        </div>

        {totalEntries === 0 && !isLoading && (
          <p className="text-text-muted text-xs text-center mt-4">
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
        <h2 className="font-bold mb-3">Dernières entrées</h2>
        <div className="bg-bg-card rounded-2xl shadow-[var(--shadow-card)] border border-border/40 overflow-hidden divide-y divide-border/50">
          {moodHistory.slice(0, 10).map((entry) => {
            const config = getMoodConfig(entry.mood);
            const date = entry.createdAt?.toDate?.() ?? new Date(entry.createdAt as unknown as string);
            return (
              <div key={entry.id} className="px-4 py-4 flex items-start gap-3.5">
                <span className="text-xl">{config.emoji}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-sm">{config.label}</span>
                    <span className="text-text-muted text-[11px]">{formatDate(date, 'dd MMM yyyy')}</span>
                  </div>
                  {entry.note && (
                    <p className="text-text-secondary text-xs mt-1 truncate">{entry.note}</p>
                  )}
                </div>
              </div>
            );
          })}
          {moodHistory.length === 0 && !isLoading && (
            <p className="text-text-muted text-xs text-center py-8">
              Enregistre ta première humeur depuis l'accueil !
            </p>
          )}
        </div>
      </motion.div>
    </div>
  );
}
