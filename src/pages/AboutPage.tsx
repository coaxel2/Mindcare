import { motion } from 'framer-motion';
import { Heart, Shield, AlertTriangle } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="py-4 space-y-6 max-w-lg mx-auto">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold font-[family-name:var(--font-family-heading)]">
          À propos
        </h1>
      </motion.div>

      {/* Logo + Mission */}
      <motion.div
        className="bg-bg-card rounded-2xl p-6 shadow-sm text-center"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="w-16 h-16 rounded-2xl bg-violet-500 flex items-center justify-center mx-auto mb-4">
          <svg width="36" height="36" viewBox="0 0 64 64" fill="none">
            <path d="M32 18C25.373 18 20 23.373 20 30c0 4.418 2.388 8.275 5.943 10.352L24 46h16l-1.943-5.648C41.612 38.275 44 34.418 44 30c0-6.627-5.373-12-12-12z" fill="white"/>
            <circle cx="27" cy="29" r="2" fill="#5D39FB"/>
            <circle cx="37" cy="29" r="2" fill="#5D39FB"/>
            <path d="M27 34c0 0 2.5 3 5 3s5-3 5-3" stroke="#5D39FB" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </div>
        <h2 className="text-xl font-bold font-[family-name:var(--font-family-heading)] mb-2">
          MindCare
        </h2>
        <p className="text-text-muted text-xs mb-4">Version 1.0.0</p>
        <p className="text-text-secondary text-sm leading-relaxed">
          MindCare est un compagnon de bien-être mental conçu pour les jeunes adultes de 18 à 24 ans.
          Notre mission est d'offrir un espace d'écoute bienveillant, sans jugement, pour t'aider
          à mieux comprendre tes émotions et prendre soin de ta santé mentale.
        </p>
      </motion.div>

      {/* Values */}
      <motion.div
        className="space-y-3"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h2 className="text-lg font-semibold font-[family-name:var(--font-family-heading)]">
          Nos valeurs
        </h2>

        {[
          {
            icon: <Heart size={20} />,
            title: 'Bienveillance',
            desc: 'Un espace sans jugement où tu peux t\'exprimer librement.',
            color: 'bg-violet-50 text-violet-500',
          },
          {
            icon: <Shield size={20} />,
            title: 'Confidentialité',
            desc: 'Tes données restent privées et sécurisées.',
            color: 'bg-green-50 text-green-600',
          },
          {
            icon: <AlertTriangle size={20} />,
            title: 'Prévention',
            desc: 'Nous ne diagnostiquons pas. Nous accompagnons et orientons vers des professionnels.',
            color: 'bg-yellow-50 text-yellow-600',
          },
        ].map((value) => (
          <div key={value.title} className="bg-bg-card rounded-xl p-4 shadow-sm flex items-start gap-3">
            <div className={`w-10 h-10 rounded-xl ${value.color} flex items-center justify-center flex-shrink-0`}>
              {value.icon}
            </div>
            <div>
              <h3 className="font-medium text-sm">{value.title}</h3>
              <p className="text-text-secondary text-xs mt-0.5 leading-relaxed">{value.desc}</p>
            </div>
          </div>
        ))}
      </motion.div>

      {/* Disclaimer */}
      <motion.div
        className="bg-yellow-50 rounded-2xl p-5"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <h3 className="font-semibold text-sm text-yellow-700 mb-2">Avertissement</h3>
        <p className="text-yellow-700/80 text-xs leading-relaxed">
          MindCare est un outil d'accompagnement et de prévention. Il ne remplace en aucun cas
          un suivi professionnel de santé mentale (psychologue, psychiatre, médecin).
          Si tu es en situation de crise, contacte le 3114 (numéro national de prévention du suicide)
          ou le 15 (SAMU).
        </p>
      </motion.div>

      {/* Credits */}
      <motion.div
        className="text-center text-text-muted text-xs pb-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <p>Conçu avec soin par l'équipe MindCare</p>
        <p className="mt-1">© 2026 MindCare — Tous droits réservés</p>
      </motion.div>
    </div>
  );
}
