import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MessageCircle, Wind, BookHeart, LifeBuoy } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useMood } from '../hooks/useMood';
import { MOODS } from '../constants/moods';
import { getGreeting } from '../utils/formatDate';
import type { MoodType } from '../types';

export default function HomePage() {
  const { user, profile } = useAuth();
  const { todayMood, saveMood, hasMoodToday, isLoading } = useMood(user?.uid ?? '');
  const [selectedMood, setSelectedMood] = useState<MoodType | null>(null);
  const [note, setNote] = useState('');
  const [showNote, setShowNote] = useState(false);
  const navigate = useNavigate();
  const greeting = getGreeting();

  useEffect(() => {
    if (todayMood) {
      setSelectedMood(todayMood.mood);
    }
  }, [todayMood]);

  const handleMoodSelect = async (mood: MoodType) => {
    setSelectedMood(mood);
    setShowNote(true);
  };

  const handleSaveMood = async () => {
    if (selectedMood && user) {
      await saveMood(selectedMood, note);
      setShowNote(false);
      setNote('');
    }
  };

  const quickActions = [
    { icon: MessageCircle, label: 'Parler à MindCare', to: '/app/chat', color: 'bg-violet-50 text-violet-500' },
    { icon: Wind, label: 'Respirer', to: '/app/exercises', color: 'bg-green-50 text-green-600' },
    { icon: BookHeart, label: 'Mon journal', to: '/app/journal', color: 'bg-yellow-50 text-yellow-600' },
    { icon: LifeBuoy, label: 'Ressources', to: '/app/resources', color: 'bg-violet-50 text-violet-500' },
  ];

  return (
    <div className="flex flex-col gap-5 py-5 pb-10">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="font-bold leading-tight">
          {greeting}, {profile?.displayName?.split(' ')[0] || 'toi'} 👋
        </h1>
        <p className="text-text-secondary mt-1.5 text-sm">Comment tu te sens aujourd'hui ?</p>
      </motion.div>

      {/* Mood Check-in */}
      <motion.div
        className="bg-bg-card rounded-2xl p-5 shadow-[var(--shadow-card)] border border-border/40"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        {!isLoading && (
          <>
            <div className="flex justify-between items-center">
              {MOODS.map((mood) => (
                <motion.button
                  key={mood.type}
                  onClick={() => handleMoodSelect(mood.type)}
                  whileTap={{ scale: 0.9 }}
                  className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all ${
                    selectedMood === mood.type
                      ? 'bg-violet-50 scale-105 ring-2 ring-violet-200'
                      : 'active:bg-gray-50'
                  }`}
                >
                  <span className="text-2xl">{mood.emoji}</span>
                  <span className="text-[10px] text-text-secondary font-medium">{mood.label}</span>
                </motion.button>
              ))}
            </div>

            {showNote && !hasMoodToday && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="space-y-2.5 mt-3 pt-3 border-t border-border/40"
              >
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Ajoute une note (optionnel)..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-bg focus:border-violet-500 focus:ring-2 focus:ring-violet-100 outline-none transition-all resize-none text-sm"
                  rows={2}
                />
                <button
                  onClick={handleSaveMood}
                  className="w-full py-2.5 bg-violet-500 text-white font-semibold rounded-xl text-sm active:bg-violet-600 transition-colors"
                >
                  Enregistrer
                </button>
              </motion.div>
            )}

            {hasMoodToday && (
              <p className="text-text-muted text-xs text-center mt-3 pt-3 border-t border-border/40">
                ✓ Humeur enregistrée pour aujourd'hui
              </p>
            )}
          </>
        )}
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h2 className="font-bold mb-3">Que veux-tu faire ?</h2>
        <div className="grid grid-cols-2 gap-3">
          {quickActions.map(({ icon: Icon, label, to, color }) => (
            <motion.button
              key={to}
              onClick={() => navigate(to)}
              whileTap={{ scale: 0.97 }}
              className="bg-bg-card rounded-2xl p-4 shadow-[var(--shadow-card)] text-left active:shadow-[var(--shadow-card-hover)] transition-shadow border border-border/40 overflow-hidden"
            >
              <div className={`w-9 h-9 rounded-xl ${color} flex items-center justify-center mb-2.5`}>
                <Icon size={18} />
              </div>
              <span className="text-[13px] font-semibold text-text-primary leading-tight">{label}</span>
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Encouragement */}
      <motion.div
        className="bg-gradient-to-br from-violet-600 via-violet-500 to-violet-400 rounded-2xl p-5 text-white"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <p className="text-[10px] font-bold uppercase tracking-widest opacity-60">Pensée du jour</p>
        <p className="text-[15px] mt-2.5 font-semibold leading-relaxed">
          "Prendre soin de soi n'est pas un luxe, c'est une nécessité."
        </p>
      </motion.div>
    </div>
  );
}
