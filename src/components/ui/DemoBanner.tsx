import { IS_DEMO_MODE } from '../../config/firebase';
import { motion, AnimatePresence } from 'framer-motion';
import { FlaskConical, X } from 'lucide-react';
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
        className="flex-shrink-0 bg-yellow-100 border-b border-yellow-200 flex items-center justify-between px-4 py-2 text-xs font-medium text-yellow-800"
      >
        <div className="flex items-center gap-2">
          <FlaskConical size={13} />
          <span>Mode démo — données stockées localement</span>
        </div>
        <button
          onClick={() => setVisible(false)}
          className="p-0.5 rounded active:bg-yellow-200/60 transition-colors"
        >
          <X size={14} />
        </button>
      </motion.div>
    </AnimatePresence>
  );
}
