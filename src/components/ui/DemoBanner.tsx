import { IS_DEMO_MODE } from '../../config/firebase';
import { motion, AnimatePresence } from 'framer-motion';
import { FlaskConical } from 'lucide-react';
import { useState } from 'react';

export default function DemoBanner() {
  const [visible, setVisible] = useState(true);
  if (!IS_DEMO_MODE || !visible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -40, opacity: 0 }}
        className="fixed top-0 left-0 right-0 z-50 bg-yellow-400 flex items-center justify-between px-4 py-2 text-xs font-medium text-yellow-900"
      >
        <div className="flex items-center gap-2">
          <FlaskConical size={14} />
          Mode démo — données stockées localement, pas de Firebase requis
        </div>
        <button
          onClick={() => setVisible(false)}
          className="hover:text-yellow-700 transition-colors font-bold"
        >
          ✕
        </button>
      </motion.div>
    </AnimatePresence>
  );
}
