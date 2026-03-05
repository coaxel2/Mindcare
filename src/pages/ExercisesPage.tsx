import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Moon, Square, Footprints, Brain, Sparkles, X } from 'lucide-react';
import { BREATHING_EXERCISES, WELLNESS_EXERCISES } from '../constants/exercises';
import type { BreathingExercise } from '../types';

const ICONS: Record<string, React.ReactNode> = {
  heart: <Heart size={24} />,
  moon: <Moon size={24} />,
  square: <Square size={24} />,
};

function BreathingCircle({ exercise, onClose }: { exercise: BreathingExercise; onClose: () => void }) {
  const [phase, setPhase] = useState<'inhale' | 'hold' | 'exhale' | 'done'>('inhale');
  const [cycle, setCycle] = useState(1);
  const [isRunning, setIsRunning] = useState(false);

  const totalCycles = exercise.cycles;

  const startExercise = () => {
    setIsRunning(true);
    setCycle(1);
    runCycle(1);
  };

  const runCycle = (currentCycle: number) => {
    if (currentCycle > totalCycles) {
      setPhase('done');
      setIsRunning(false);
      return;
    }

    setPhase('inhale');
    setTimeout(() => {
      if (exercise.holdSeconds > 0) {
        setPhase('hold');
        setTimeout(() => {
          setPhase('exhale');
          setTimeout(() => {
            setCycle(currentCycle + 1);
            runCycle(currentCycle + 1);
          }, exercise.exhaleSeconds * 1000);
        }, exercise.holdSeconds * 1000);
      } else {
        setPhase('exhale');
        setTimeout(() => {
          setCycle(currentCycle + 1);
          runCycle(currentCycle + 1);
        }, exercise.exhaleSeconds * 1000);
      }
    }, exercise.inhaleSeconds * 1000);
  };

  const phaseLabel = {
    inhale: 'Inspire...',
    hold: 'Retiens...',
    exhale: 'Expire...',
    done: 'Terminé !',
  };

  const phaseScale = {
    inhale: 1.4,
    hold: 1.4,
    exhale: 1,
    done: 1,
  };

  const phaseDuration = {
    inhale: exercise.inhaleSeconds,
    hold: exercise.holdSeconds,
    exhale: exercise.exhaleSeconds,
    done: 0.5,
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-violet-500 flex flex-col items-center justify-center"
    >
      <button
        onClick={onClose}
        className="absolute top-6 right-6 text-white/70 hover:text-white transition-colors"
      >
        <X size={24} />
      </button>

      <p className="text-white/70 text-sm mb-2 font-medium">
        {exercise.title}
      </p>

      <div className="relative flex items-center justify-center my-8">
        <motion.div
          className="w-40 h-40 rounded-full bg-white/20 flex items-center justify-center"
          animate={{ scale: phaseScale[phase] }}
          transition={{
            duration: phaseDuration[phase],
            ease: 'easeInOut',
          }}
        >
          <motion.div className="w-24 h-24 rounded-full bg-white/30" />
        </motion.div>
      </div>

      <motion.p
        key={phase}
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-white text-xl font-semibold mb-2"
      >
        {phaseLabel[phase]}
      </motion.p>

      {isRunning && phase !== 'done' && (
        <p className="text-white/60 text-sm">
          Cycle {Math.min(cycle, totalCycles)} / {totalCycles}
        </p>
      )}

      {!isRunning && phase !== 'done' && (
        <button
          onClick={startExercise}
          className="mt-8 px-8 py-3 bg-white text-violet-500 font-semibold rounded-full hover:bg-white/90 transition-colors"
        >
          Commencer
        </button>
      )}

      {phase === 'done' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mt-4"
        >
          <p className="text-white/80 text-sm mb-4">Bravo, tu as terminé !</p>
          <button
            onClick={onClose}
            className="px-8 py-3 bg-white text-violet-500 font-semibold rounded-full hover:bg-white/90 transition-colors"
          >
            Fermer
          </button>
        </motion.div>
      )}
    </motion.div>
  );
}

export default function ExercisesPage() {
  const [activeBreathing, setActiveBreathing] = useState<BreathingExercise | null>(null);
  const [activeWellness, setActiveWellness] = useState<string | null>(null);

  const wellnessIcons: Record<string, React.ReactNode> = {
    grounding: <Footprints size={22} />,
    relaxation: <Brain size={22} />,
    mindfulness: <Sparkles size={22} />,
  };

  return (
    <div className="py-4 space-y-6 max-w-lg mx-auto">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold font-[family-name:var(--font-family-heading)]">
          Exercices
        </h1>
        <p className="text-text-secondary text-sm mt-1">Prends un moment pour toi</p>
      </motion.div>

      {/* Breathing */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <h2 className="text-lg font-semibold font-[family-name:var(--font-family-heading)] mb-3">
          Respiration
        </h2>
        <div className="space-y-3">
          {BREATHING_EXERCISES.map((ex) => (
            <motion.button
              key={ex.id}
              onClick={() => setActiveBreathing(ex)}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-bg-card rounded-2xl p-4 shadow-sm text-left hover:shadow-md transition-shadow flex items-center gap-4"
            >
              <div className="w-12 h-12 rounded-xl bg-violet-50 text-violet-500 flex items-center justify-center flex-shrink-0">
                {ICONS[ex.icon] || <Heart size={24} />}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-sm">{ex.title}</h3>
                <p className="text-text-muted text-xs mt-0.5 truncate">{ex.description}</p>
              </div>
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Wellness */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h2 className="text-lg font-semibold font-[family-name:var(--font-family-heading)] mb-3">
          Bien-être
        </h2>
        <div className="space-y-3">
          {WELLNESS_EXERCISES.map((ex) => (
            <div key={ex.id}>
              <motion.button
                onClick={() => setActiveWellness(activeWellness === ex.id ? null : ex.id)}
                whileTap={{ scale: 0.98 }}
                className="w-full bg-bg-card rounded-2xl p-4 shadow-sm text-left hover:shadow-md transition-shadow flex items-center gap-4"
              >
                <div className="w-12 h-12 rounded-xl bg-green-50 text-green-600 flex items-center justify-center flex-shrink-0">
                  {wellnessIcons[ex.category]}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-sm">{ex.title}</h3>
                  <p className="text-text-muted text-xs mt-0.5">{ex.description}</p>
                  <span className="text-violet-500 text-[11px] font-medium mt-1 block">
                    {ex.durationMinutes} min
                  </span>
                </div>
              </motion.button>

              <AnimatePresence>
                {activeWellness === ex.id && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="bg-bg-card rounded-xl mx-2 mt-1 overflow-hidden"
                  >
                    <div className="p-4 space-y-2.5">
                      {ex.steps.map((step, i) => (
                        <div key={i} className="flex items-start gap-3">
                          <div className="w-6 h-6 rounded-full bg-violet-50 text-violet-500 flex items-center justify-center flex-shrink-0 text-xs font-semibold">
                            {i + 1}
                          </div>
                          <p className="text-sm text-text-secondary leading-relaxed">{step}</p>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Breathing overlay */}
      <AnimatePresence>
        {activeBreathing && (
          <BreathingCircle
            exercise={activeBreathing}
            onClose={() => setActiveBreathing(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
