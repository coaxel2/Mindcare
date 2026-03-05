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
    <div className="min-h-dvh bg-bg flex flex-col items-center justify-between px-6 py-10">
      <div className="flex justify-end w-full">
        {current < ONBOARDING_SLIDES.length - 1 && (
          <button
            onClick={skip}
            className="text-text-muted text-sm font-medium hover:text-violet-500 transition-colors"
          >
            Passer
          </button>
        )}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0, x: 60 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -60 }}
          transition={{ duration: 0.35 }}
          className="flex flex-col items-center text-center flex-1 justify-center max-w-sm"
        >
          <img
            src={slide.image}
            alt={slide.title}
            className="w-64 h-64 mb-10"
          />
          <h1 className="text-3xl font-bold text-text-primary mb-4 font-[family-name:var(--font-family-heading)]">
            {slide.title}
          </h1>
          <p className="text-text-secondary text-base leading-relaxed">
            {slide.description}
          </p>
        </motion.div>
      </AnimatePresence>

      <div className="w-full max-w-sm flex flex-col items-center gap-6">
        <div className="flex gap-2">
          {ONBOARDING_SLIDES.map((_, i) => (
            <div
              key={i}
              className={`h-2 rounded-full transition-all duration-300 ${
                i === current ? 'w-8 bg-violet-500' : 'w-2 bg-violet-200'
              }`}
            />
          ))}
        </div>

        <button
          onClick={next}
          className="w-full py-3.5 bg-violet-500 text-white font-semibold rounded-full text-base hover:bg-violet-600 transition-colors"
        >
          {current === ONBOARDING_SLIDES.length - 1 ? 'Commencer' : 'Suivant'}
        </button>

        {current === ONBOARDING_SLIDES.length - 1 && (
          <button
            onClick={() => navigate('/login')}
            className="text-violet-500 text-sm font-medium hover:underline"
          >
            J'ai déjà un compte
          </button>
        )}
      </div>
    </div>
  );
}
