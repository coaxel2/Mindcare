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
    <div className="py-4 space-y-6 max-w-lg mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-2xl font-bold font-[family-name:var(--font-family-heading)]">
          {greeting}, {profile?.displayName?.split(' ')[0] || 'toi'} 👋
        </h1>
        <p className="text-text-secondary mt-1">Comment tu te sens aujourd'hui ?</p>
      </motion.div>

      {/* Mood Check-in */}
      <motion.div
        className="bg-bg-card rounded-2xl p-5 shadow-sm"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        {!isLoading && (
          <>
            <div className="flex justify-between items-center mb-4">
              {MOODS.map((mood) => (
                <motion.button
                  key={mood.type}
                  onClick={() => handleMoodSelect(mood.type)}
                  whileTap={{ scale: 0.9 }}
                  className={`flex flex-col items-center gap-1.5 p-2 rounded-xl transition-all ${
                    selectedMood === mood.type
                      ? 'bg-violet-50 scale-110'
                      : 'hover:bg-gray-50'
                  }`}
                >
                  <span className="text-3xl">{mood.emoji}</span>
                  <span className="text-[10px] text-text-secondary font-medium">{mood.label}</span>
                </motion.button>
              ))}
            </div>

            {showNote && !hasMoodToday && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="space-y-3"
              >
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Ajoute une note si tu veux (optionnel)..."
                  className="w-full px-4 py-3 rounded-xl border border-border bg-white focus:border-violet-500 focus:ring-2 focus:ring-violet-100 outline-none transition-all resize-none text-sm"
                  rows={2}
                />
                <button
                  onClick={handleSaveMood}
                  className="w-full py-2.5 bg-violet-500 text-white font-medium rounded-full text-sm hover:bg-violet-600 transition-colors"
                >
                  Enregistrer mon humeur
                </button>
              </motion.div>
            )}

            {hasMoodToday && (
              <p className="text-text-muted text-sm text-center">
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
        <h2 className="text-lg font-semibold font-[family-name:var(--font-family-heading)] mb-3">
          Que veux-tu faire ?
        </h2>
        <div className="grid grid-cols-2 gap-3">
          {quickActions.map(({ icon: Icon, label, to, color }) => (
            <motion.button
              key={to}
              onClick={() => navigate(to)}
              whileTap={{ scale: 0.97 }}
              className="bg-bg-card rounded-2xl p-4 shadow-sm text-left hover:shadow-md transition-shadow"
            >
              <div className={`w-10 h-10 rounded-xl ${color} flex items-center justify-center mb-3`}>
                <Icon size={20} />
              </div>
              <span className="text-sm font-medium text-text-primary">{label}</span>
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Encouragement */}
      <motion.div
        className="bg-gradient-to-r from-violet-500 to-violet-400 rounded-2xl p-5 text-white"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <p className="text-sm font-medium opacity-90">Pensée du jour</p>
        <p className="text-base mt-2 font-medium leading-relaxed">
          "Prendre soin de soi n'est pas un luxe, c'est une nécessité."
        </p>
      </motion.div>
    </div>
  );
}
