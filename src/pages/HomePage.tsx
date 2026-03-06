import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MessageCircle, Wind, BookHeart, LifeBuoy, ArrowRight, Video } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useMood } from '../hooks/useMood';
import { MOODS } from '../constants/moods';
import type { MoodType } from '../types';

export default function HomePage() {
  const { user, profile } = useAuth();
  const { todayMood, saveMood, hasMoodToday, isLoading } = useMood(user?.uid ?? '');
  const [selectedMood, setSelectedMood] = useState<MoodType | null>(null);
  const [note, setNote] = useState('');
  const [showNote, setShowNote] = useState(false);
  const navigate = useNavigate();

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

  return (
    <div className="space-y-5 py-4 pb-6 max-w-lg mx-auto px-4">
      {/* Urgent Care Card */}
      <motion.div
        className="bg-yellow-50 rounded-3xl p-6 flex items-start justify-between"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="flex-1">
          <h2 className="text-xl font-bold text-text-primary">
            Need to talk to<br />someone?
          </h2>
          <p className="text-sm text-text-secondary mt-1">Available now</p>
        </div>
        <motion.button
          onClick={() => navigate('/app/chat')}
          whileTap={{ scale: 0.95 }}
          className="bg-yellow-400 text-text-primary font-bold rounded-full px-5 py-2.5 text-sm active:bg-yellow-500 transition-colors flex-shrink-0"
        >
          Chat now
        </motion.button>
      </motion.div>

      {/* How are you feeling - Mood Check */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h3 className="font-bold text-text-primary mb-3">How are you feeling?</h3>
        <div className="bg-bg-card rounded-2xl p-5 border border-border/40">
          {!isLoading && (
            <>
              <div className="flex justify-between items-center gap-2">
                {MOODS.map((mood) => (
                  <motion.button
                    key={mood.type}
                    onClick={() => handleMoodSelect(mood.type)}
                    whileTap={{ scale: 0.9 }}
                    className={`flex flex-col items-center gap-1.5 p-2.5 rounded-xl transition-all flex-1 ${
                      selectedMood === mood.type
                        ? 'bg-violet-50 ring-2 ring-violet-200'
                        : 'active:bg-gray-50'
                    }`}
                  >
                    <span className="text-2xl">{mood.emoji}</span>
                    <span className="text-[9px] text-text-secondary font-medium text-center">{mood.label}</span>
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
                    placeholder="Add a note (optional)..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-bg focus:border-violet-500 focus:ring-2 focus:ring-violet-100 outline-none transition-all resize-none text-sm"
                    rows={2}
                  />
                  <button
                    onClick={handleSaveMood}
                    className="w-full py-2.5 bg-violet-500 text-white font-semibold rounded-full text-sm active:bg-violet-600 transition-colors"
                  >
                    Save
                  </button>
                </motion.div>
              )}

              {hasMoodToday && (
                <p className="text-text-muted text-xs text-center mt-3 pt-3 border-t border-border/40">
                  ✓ Mood saved for today
                </p>
              )}
            </>
          )}
        </div>
      </motion.div>

      {/* Upcoming Session */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-bold text-text-primary">Recommended for you</h3>
          <button className="text-violet-500 text-sm font-semibold flex items-center gap-1">
            See all <ArrowRight size={14} />
          </button>
        </div>

        <motion.div
          whileTap={{ scale: 0.98 }}
          onClick={() => navigate('/app/exercises')}
          className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-3xl p-5 text-white cursor-pointer active:opacity-90 transition-opacity"
        >
          <div className="flex items-start justify-between gap-3 mb-4">
            <div className="flex-1">
              <h4 className="font-bold text-lg">Breathing Exercise</h4>
              <p className="text-blue-100 text-sm mt-1">Calm & Relax, 5 min</p>
              <p className="text-blue-200 text-xs mt-2.5 font-medium">Recommended for you • Next: Today 14:00</p>
            </div>
            <div className="flex-shrink-0 w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
              <Wind size={18} />
            </div>
          </div>
          <motion.button
            whileTap={{ scale: 0.95 }}
            className="bg-pink-400 text-white font-bold rounded-full px-4 py-2 text-sm active:bg-pink-500 transition-colors flex items-center gap-2 w-full justify-center"
          >
            <Video size={16} />
            Start now
          </motion.button>
        </motion.div>
      </motion.div>

      {/* Popular Resources */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-bold text-text-primary">Popular resources</h3>
          <button
            onClick={() => navigate('/app/resources')}
            className="text-violet-500 text-sm font-semibold flex items-center gap-1"
          >
            See all <ArrowRight size={14} />
          </button>
        </div>

        <motion.div
          whileTap={{ scale: 0.98 }}
          onClick={() => navigate('/app/resources')}
          className="bg-bg-card rounded-2xl p-4 border border-border/40 flex items-start gap-3 cursor-pointer active:shadow-[var(--shadow-card-hover)] transition-shadow"
        >
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-100 to-violet-50 flex items-center justify-center flex-shrink-0">
            <BookHeart size={20} className="text-violet-500" />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="font-bold text-text-primary text-sm">Meditation for Anxiety</h4>
            <p className="text-text-secondary text-xs mt-1">Mental Health • 8 min read</p>
            <div className="flex items-center gap-1 mt-2">
              <div className="flex gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="text-yellow-400 text-xs">★</span>
                ))}
              </div>
              <span className="text-text-muted text-xs">4.8 • 234 views</span>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Quick Actions Grid */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <h3 className="font-bold text-text-primary mb-3">More options</h3>
        <div className="grid grid-cols-2 gap-3">
          {[
            { icon: MessageCircle, label: 'Chat with AI', to: '/app/chat', color: 'bg-violet-50 text-violet-500' },
            { icon: BookHeart, label: 'My Journal', to: '/app/journal', color: 'bg-yellow-50 text-yellow-600' },
            { icon: Wind, label: 'Exercises', to: '/app/exercises', color: 'bg-green-50 text-green-600' },
            { icon: LifeBuoy, label: 'Resources', to: '/app/resources', color: 'bg-blue-50 text-blue-600' },
          ].map(({ icon: Icon, label, to, color }) => (
            <motion.button
              key={to}
              onClick={() => navigate(to)}
              whileTap={{ scale: 0.97 }}
              className="bg-bg-card rounded-2xl p-4 shadow-[var(--shadow-card)] text-left active:shadow-[var(--shadow-card-hover)] transition-shadow border border-border/40"
            >
              <div className={`w-8 h-8 rounded-lg ${color} flex items-center justify-center mb-2`}>
                <Icon size={18} />
              </div>
              <span className="text-[12px] font-semibold text-text-primary">{label}</span>
            </motion.button>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
