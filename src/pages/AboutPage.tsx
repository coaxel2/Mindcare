import { motion } from 'framer-motion';
import { Heart, Shield, AlertTriangle } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="flex flex-col gap-5 py-5 pb-10 max-w-lg mx-auto">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-bold leading-tight">À propos</h1>
      </motion.div>

      {/* Logo + Mission */}
      <motion.div
        className="bg-bg-card rounded-2xl p-5 shadow-[var(--shadow-card)] border border-border/40 text-center"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="w-14 h-14 rounded-2xl bg-violet-500 flex items-center justify-center mx-auto mb-3">
          <svg width="30" height="30" viewBox="0 0 64 64" fill="none">
            <path d="M32 18C25.373 18 20 23.373 20 30c0 4.418 2.388 8.275 5.943 10.352L24 46h16l-1.943-5.648C41.612 38.275 44 34.418 44 30c0-6.627-5.373-12-12-12z" fill="white"/>
            <circle cx="27" cy="29" r="2" fill="#5D39FB"/>
            <circle cx="37" cy="29" r="2" fill="#5D39FB"/>
            <path d="M27 34c0 0 2.5 3 5 3s5-3 5-3" stroke="#5D39FB" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </div>
        <h2 className="text-base font-bold mb-0.5">MindCare</h2>
        <p className="text-text-muted text-[11px] mb-3">Version 1.0.0</p>
        <p className="text-text-secondary text-xs leading-relaxed">
          MindCare est un compagnon de bien-être mental conçu pour les jeunes adultes de 18 à 24 ans.
          Notre mission est d'offrir un espace d'écoute bienveillant, sans jugement, pour t'aider
          à mieux comprendre tes émotions et prendre soin de ta santé mentale.
        </p>
      </motion.div>

      {/* Values */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h2 className="font-bold mb-2.5">Nos valeurs</h2>
        <div className="bg-bg-card rounded-2xl shadow-[var(--shadow-card)] border border-border/40 overflow-hidden divide-y divide-border/50">
          {[
            {
              icon: <Heart size={18} />,
              title: 'Bienveillance',
              desc: 'Un espace sans jugement où tu peux t\'exprimer librement.',
              color: 'bg-violet-50 text-violet-500',
            },
            {
              icon: <Shield size={18} />,
              title: 'Confidentialité',
              desc: 'Tes données restent privées et sécurisées.',
              color: 'bg-green-50 text-green-600',
            },
            {
              icon: <AlertTriangle size={18} />,
              title: 'Prévention',
              desc: 'Nous ne diagnostiquons pas. Nous accompagnons et orientons vers des professionnels.',
              color: 'bg-yellow-50 text-yellow-600',
            },
          ].map((value) => (
            <div key={value.title} className="px-4 py-3.5 flex items-start gap-3">
              <div className={`w-9 h-9 rounded-xl ${value.color} flex items-center justify-center flex-shrink-0`}>
                {value.icon}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-sm">{value.title}</h3>
                <p className="text-text-secondary text-xs mt-0.5 leading-relaxed">{value.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Disclaimer */}
      <motion.div
        className="bg-yellow-50 rounded-2xl p-4 border border-yellow-200/60"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <h3 className="font-bold text-xs text-yellow-700 mb-1.5">Avertissement</h3>
        <p className="text-yellow-700/80 text-[11px] leading-relaxed">
          MindCare est un outil d'accompagnement et de prévention. Il ne remplace en aucun cas
          un suivi professionnel de santé mentale (psychologue, psychiatre, médecin).
          Si tu es en situation de crise, contacte le 3114 (numéro national de prévention du suicide)
          ou le 15 (SAMU).
        </p>
      </motion.div>

      {/* Credits */}
      <motion.div
        className="text-center text-text-muted text-[11px] pb-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <p>Conçu avec soin par l'équipe MindCare</p>
        <p className="mt-0.5">© 2026 MindCare — Tous droits réservés</p>
      </motion.div>
    </div>
  );
}
