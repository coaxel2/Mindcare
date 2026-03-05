export interface Resource {
  name: string;
  description: string;
  phone?: string;
  url?: string;
  available?: string;
}

export interface ResourceCategory {
  title: string;
  icon: string;
  resources: Resource[];
}

export const RESOURCE_CATEGORIES: ResourceCategory[] = [
  {
    title: 'Urgence',
    icon: 'phone',
    resources: [
      {
        name: '3114 — Numéro national de prévention du suicide',
        description: 'Écoute professionnelle, confidentielle et gratuite pour les personnes en détresse.',
        phone: '3114',
        available: '24h/24, 7j/7',
      },
      {
        name: '15 — SAMU',
        description: 'En cas d\'urgence médicale immédiate.',
        phone: '15',
        available: '24h/24, 7j/7',
      },
    ],
  },
  {
    title: 'Écoute et soutien',
    icon: 'heart-handshake',
    resources: [
      {
        name: 'Fil Santé Jeunes',
        description: 'Ligne d\'écoute anonyme et gratuite pour les 12-25 ans.',
        phone: '0 800 235 236',
        url: 'https://www.filsantejeunes.com',
        available: '9h-23h, tous les jours',
      },
      {
        name: 'SOS Amitié',
        description: 'Écoute bienveillante pour les personnes en souffrance ou isolées.',
        phone: '09 72 39 40 50',
        url: 'https://www.sos-amitie.com',
        available: '24h/24, 7j/7',
      },
      {
        name: 'Nightline',
        description: 'Service d\'écoute nocturne tenu par des étudiants pour les étudiants.',
        url: 'https://www.nightline.fr',
        available: '21h-2h30, du lundi au vendredi',
      },
    ],
  },
  {
    title: 'Information et accompagnement',
    icon: 'book-open',
    resources: [
      {
        name: 'Psycom',
        description: 'Information fiable sur la santé mentale, les troubles et les soins.',
        url: 'https://www.psycom.org',
      },
      {
        name: 'Mon soutien psy',
        description: 'Dispositif de remboursement de séances chez un psychologue (8 séances/an).',
        url: 'https://www.ameli.fr/assure/remboursements/rembourse/remboursement-seances-psychologue',
      },
      {
        name: 'Santé Psy Étudiant',
        description: 'Consultations gratuites pour les étudiants souffrant de mal-être.',
        url: 'https://santepsy.etudiant.gouv.fr',
      },
    ],
  },
];

export const EMERGENCY_RESOURCES = {
  title: 'Tu n\'es pas seul(e)',
  message: 'Si tu traverses un moment très difficile, ces personnes sont là pour t\'écouter :',
  contacts: [
    { name: '3114 — Prévention du suicide', phone: '3114', available: '24h/24' },
    { name: 'Fil Santé Jeunes', phone: '0 800 235 236', available: '9h-23h' },
    { name: 'SOS Amitié', phone: '09 72 39 40 50', available: '24h/24' },
  ],
};
