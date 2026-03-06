import { motion } from 'framer-motion';

interface PreloaderProps {
  onComplete: () => void;
}

export default function Preloader({ onComplete }: PreloaderProps) {
  return (
    <motion.div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-violet-500"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      onAnimationComplete={(_definition) => {
        // exit animation done
      }}
    >
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        <div className="flex flex-col items-center gap-4">
          <motion.div
            className="w-20 h-20 rounded-2xl bg-white/20 flex items-center justify-center"
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          >
            <svg width="48" height="48" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M32 18C25.373 18 20 23.373 20 30c0 4.418 2.388 8.275 5.943 10.352L24 46h16l-1.943-5.648C41.612 38.275 44 34.418 44 30c0-6.627-5.373-12-12-12z" fill="white"/>
              <circle cx="27" cy="29" r="2" fill="#5D39FB"/>
              <circle cx="37" cy="29" r="2" fill="#5D39FB"/>
              <path d="M27 34c0 0 2.5 3 5 3s5-3 5-3" stroke="#5D39FB" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </motion.div>
          <motion.h1
            className="text-3xl font-bold text-white"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            MindCare
          </motion.h1>
          <motion.p
            className="text-white/70 text-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            Ton compagnon de bien-être mental
          </motion.p>
        </div>
      </motion.div>

      <motion.div
        className="absolute bottom-16 flex gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        onAnimationComplete={() => {
          setTimeout(onComplete, 1200);
        }}
      >
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="w-2 h-2 bg-white/50 rounded-full"
            animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1.2, 0.8] }}
            transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
          />
        ))}
      </motion.div>
    </motion.div>
  );
}
