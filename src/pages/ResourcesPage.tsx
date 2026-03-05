import { motion } from 'framer-motion';
import { Phone, ExternalLink, Heart, BookOpen, AlertTriangle } from 'lucide-react';
import { RESOURCE_CATEGORIES } from '../constants/resources';

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  'phone': <AlertTriangle size={20} />,
  'heart-handshake': <Heart size={20} />,
  'book-open': <BookOpen size={20} />,
};

const CATEGORY_COLORS: Record<string, string> = {
  'phone': 'bg-danger-light text-danger',
  'heart-handshake': 'bg-violet-50 text-violet-500',
  'book-open': 'bg-green-50 text-green-600',
};

export default function ResourcesPage() {
  return (
    <div className="py-4 space-y-6 max-w-lg mx-auto">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold font-[family-name:var(--font-family-heading)]">
          Ressources
        </h1>
        <p className="text-text-secondary text-sm mt-1">
          Des personnes sont là pour t'écouter et t'aider
        </p>
      </motion.div>

      {/* Urgence banner */}
      <motion.div
        className="bg-gradient-to-r from-violet-500 to-violet-400 rounded-2xl p-5 text-white"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <p className="font-semibold text-base">En cas d'urgence</p>
        <p className="text-white/80 text-sm mt-1">
          Si toi ou quelqu'un est en danger immédiat, appelle le 15 (SAMU) ou le 3114.
        </p>
        <div className="flex gap-3 mt-4">
          <a
            href="tel:15"
            className="flex items-center gap-2 px-4 py-2 bg-white/20 rounded-full text-sm font-medium hover:bg-white/30 transition-colors"
          >
            <Phone size={16} /> 15
          </a>
          <a
            href="tel:3114"
            className="flex items-center gap-2 px-4 py-2 bg-white/20 rounded-full text-sm font-medium hover:bg-white/30 transition-colors"
          >
            <Phone size={16} /> 3114
          </a>
        </div>
      </motion.div>

      {/* Categories */}
      {RESOURCE_CATEGORIES.map((category, catIdx) => (
        <motion.div
          key={category.title}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 + catIdx * 0.1 }}
        >
          <div className="flex items-center gap-2 mb-3">
            <div className={`w-8 h-8 rounded-lg ${CATEGORY_COLORS[category.icon] || 'bg-violet-50 text-violet-500'} flex items-center justify-center`}>
              {CATEGORY_ICONS[category.icon] || <Heart size={16} />}
            </div>
            <h2 className="text-lg font-semibold font-[family-name:var(--font-family-heading)]">
              {category.title}
            </h2>
          </div>

          <div className="space-y-2">
            {category.resources.map((resource) => (
              <div
                key={resource.name}
                className="bg-bg-card rounded-xl p-4 shadow-sm"
              >
                <h3 className="font-medium text-sm text-text-primary">{resource.name}</h3>
                <p className="text-text-secondary text-xs mt-1 leading-relaxed">
                  {resource.description}
                </p>
                <div className="flex flex-wrap items-center gap-3 mt-3">
                  {resource.phone && (
                    <a
                      href={`tel:${resource.phone.replace(/\s/g, '')}`}
                      className="flex items-center gap-1.5 text-violet-500 text-xs font-medium hover:underline"
                    >
                      <Phone size={13} /> {resource.phone}
                    </a>
                  )}
                  {resource.url && (
                    <a
                      href={resource.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-violet-500 text-xs font-medium hover:underline"
                    >
                      <ExternalLink size={13} /> Site web
                    </a>
                  )}
                  {resource.available && (
                    <span className="text-text-muted text-[11px]">
                      {resource.available}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      ))}

      {/* Disclaimer */}
      <motion.p
        className="text-text-muted text-xs text-center px-4 pb-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        MindCare ne remplace pas un suivi professionnel de santé mentale.
        N'hésite pas à consulter un professionnel si tu en ressens le besoin.
      </motion.p>
    </div>
  );
}
