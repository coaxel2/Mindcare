import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ONBOARDING_SLIDES } from '../constants/onboarding';

export default function OnboardingPage() {
  const [current, setCurrent] = useState(0);
  const navigate = useNavigate();
  const slide = ONBOARDING_SLIDES[current];

  const next = () => {
    if (current < ONBOARDING_SLIDES.length - 1) {
      setCurrent(current + 1);
    } else {
      navigate('/signup');
    }
  };

  const skip = () => navigate('/signup');

  return (
    <div className="min-h-dvh bg-bg flex flex-col items-center justify-between px-6 py-8">
      <div className="flex justify-end w-full">
        {current < ONBOARDING_SLIDES.length - 1 && (
          <button
            onClick={skip}
            className="text-text-muted text-xs font-semibold active:text-violet-500 transition-colors"
          >
            Passer
          </button>
        )}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.25 }}
          className="flex flex-col items-center text-center flex-1 justify-center max-w-sm"
        >
          <img
            src={slide.image}
            alt={slide.title}
            className="w-56 h-56 mb-8"
          />
          <h1 className="font-bold leading-tight text-text-primary mb-2">
            {slide.title}
          </h1>
          <p className="text-text-secondary text-sm leading-relaxed">
            {slide.description}
          </p>
        </motion.div>
      </AnimatePresence>

      <div className="w-full max-w-sm flex flex-col items-center gap-5">
        <div className="flex gap-1.5">
          {ONBOARDING_SLIDES.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === current ? 'w-7 bg-violet-500' : 'w-1.5 bg-violet-200'
              }`}
            />
          ))}
        </div>

        <button
          onClick={next}
          className="w-full py-3 bg-violet-500 text-white font-bold rounded-xl text-sm active:bg-violet-600 transition-colors"
        >
          {current === ONBOARDING_SLIDES.length - 1 ? 'Commencer' : 'Suivant'}
        </button>

        {current === ONBOARDING_SLIDES.length - 1 && (
          <button
            onClick={() => navigate('/login')}
            className="text-violet-500 text-xs font-semibold"
          >
            J'ai déjà un compte
          </button>
        )}
      </div>
    </div>
  );
}
