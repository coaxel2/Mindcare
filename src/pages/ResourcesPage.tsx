import { motion } from 'framer-motion';
import { Phone, ExternalLink, Heart, BookOpen, AlertTriangle, Clock } from 'lucide-react';
import { RESOURCE_CATEGORIES } from '../constants/resources';

const CATEGORY_META: Record<string, { icon: React.ReactNode; color: string; bg: string }> = {
  'phone': {
    icon: <AlertTriangle size={16} />,
    color: 'text-danger',
    bg: 'bg-danger-light',
  },
  'heart-handshake': {
    icon: <Heart size={16} />,
    color: 'text-violet-500',
    bg: 'bg-violet-50',
  },
  'book-open': {
    icon: <BookOpen size={16} />,
    color: 'text-green-600',
    bg: 'bg-green-50',
  },
};

export default function ResourcesPage() {
  return (
    <div className="py-5 pb-10 flex flex-col gap-6 max-w-lg mx-auto">

      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-bold leading-tight">
          Ressources
        </h1>
        <p className="text-text-secondary text-sm mt-1.5">
          Des personnes sont là pour t'écouter et t'aider
        </p>
      </motion.div>

      {/* Urgence banner */}
      <motion.div
        className="bg-gradient-to-br from-violet-600 to-violet-500 rounded-2xl p-5 text-white"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="flex items-center gap-2 mb-1.5">
          <AlertTriangle size={16} className="opacity-90" />
          <p className="font-semibold text-sm">En cas d'urgence</p>
        </div>
        <p className="text-white/80 text-xs leading-relaxed">
          Si toi ou quelqu'un est en danger immédiat, appelle le 15 (SAMU) ou le 3114.
        </p>
        <div className="flex gap-3 mt-4">
          <a
            href="tel:15"
            className="flex items-center gap-1.5 px-5 py-2.5 bg-white text-violet-600 rounded-xl text-xs font-bold shadow-sm active:scale-95 transition-transform"
          >
            <Phone size={13} /> 15
          </a>
          <a
            href="tel:3114"
            className="flex items-center gap-1.5 px-5 py-2.5 bg-white text-violet-600 rounded-xl text-xs font-bold shadow-sm active:scale-95 transition-transform"
          >
            <Phone size={13} /> 3114
          </a>
        </div>
      </motion.div>

      {/* Categories */}
      {RESOURCE_CATEGORIES.map((category, catIdx) => {
        const meta = CATEGORY_META[category.icon] ?? CATEGORY_META['heart-handshake'];
        return (
          <motion.div
            key={category.title}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 + catIdx * 0.08 }}
            className="flex flex-col gap-3"
          >
            {/* Category header */}
            <div className="flex items-center gap-2.5 px-1">
              <div className={`w-7 h-7 rounded-lg ${meta.bg} ${meta.color} flex items-center justify-center flex-shrink-0`}>
                {meta.icon}
              </div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-text-secondary">
                {category.title}
              </h2>
            </div>

            {/* Resource cards */}
            <div className="bg-bg-card rounded-2xl shadow-[var(--shadow-card)] border border-border/40 overflow-hidden divide-y divide-border/40">
              {category.resources.map((resource) => (
                <div key={resource.name} className="px-5 py-4">
                  <p className="text-sm font-semibold text-text-primary leading-snug">
                    {resource.name}
                  </p>
                  <p className="text-xs text-text-secondary mt-1.5 leading-relaxed">
                    {resource.description}
                  </p>
                  <div className="flex flex-wrap items-center gap-2.5 mt-3">
                    {resource.phone && (
                      <a
                        href={`tel:${resource.phone.replace(/\s/g, '')}`}
                        className={`flex items-center gap-1.5 px-3.5 py-2 ${meta.bg} ${meta.color} rounded-xl text-xs font-semibold active:opacity-70 transition-opacity`}
                      >
                        <Phone size={12} /> {resource.phone}
                      </a>
                    )}
                    {resource.url && (
                      <a
                        href={resource.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 px-3.5 py-2 bg-violet-50 text-violet-500 rounded-xl text-xs font-semibold active:opacity-70 transition-opacity"
                      >
                        <ExternalLink size={12} /> Site web
                      </a>
                    )}
                    {resource.available && (
                      <span className="flex items-center gap-1 text-text-muted text-[11px]">
                        <Clock size={11} /> {resource.available}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        );
      })}

      {/* Disclaimer */}
      <motion.div
        className="px-4 py-4 rounded-2xl bg-yellow-50 border border-yellow-200/60"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <p className="text-text-muted text-[11px] text-center leading-relaxed italic">
          MindCare ne remplace pas un suivi professionnel de santé mentale.
          N'hésite pas à consulter un professionnel si tu en ressens le besoin.
        </p>
      </motion.div>
    </div>
  );
}
