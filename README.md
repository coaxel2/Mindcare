# MindCare

Application conversationnelle de bien-être mental pour les 18-24 ans.

## Stack technique

- **Frontend** : React 19 + TypeScript + Vite + TailwindCSS v4 + Framer Motion
- **Backend** : Firebase (Auth + Firestore + Cloud Functions)
- **IA** : OpenAI gpt-4o-mini via Firebase Cloud Function
- **Icônes** : lucide-react | **Dates** : date-fns (locale fr)

## Installation

```bash
npm install
```

## Configuration Firebase

1. Crée un projet sur [console.firebase.google.com](https://console.firebase.google.com)
2. Active **Authentication** (Email/Mot de passe)
3. Active **Firestore** en mode production
4. Active **Cloud Functions**
5. Copie `.env.example` en `.env` et remplis les variables :

```bash
cp .env.example .env
```

```
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
```

## Démarrer en développement

```bash
npm run dev
```

L'app tourne sur `http://localhost:5173`

## Build production

```bash
npm run build
```

## Cloud Function (IA)

Pour activer le chat IA avec OpenAI :

```bash
cd functions
npm install
```

Ajoute la clé OpenAI comme secret Firebase :
```bash
firebase functions:secrets:set OPENAI_API_KEY
```

Déploie la fonction :
```bash
npm run deploy
```

> Sans la clé OpenAI, le chat répond avec un message de fallback bienveillant.

## Règles Firestore

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{uid} {
      allow read, write: if request.auth != null && request.auth.uid == uid;
      match /{subcollection=**} {
        allow read, write: if request.auth != null && request.auth.uid == uid;
      }
    }
  }
}
```

## Structure du projet

```
src/
├── config/firebase.ts        # Init Firebase
├── contexts/AuthContext.tsx   # Auth state global
├── types/                    # Interfaces TypeScript
├── constants/                # Données statiques
├── services/                 # Accès Firestore + Cloud Functions
├── hooks/                    # useAuth, useChat, useMood, useDistressDetection
├── components/
│   ├── ui/                   # Button, Input, Card, Modal, Loader, Avatar, Badge
│   ├── layout/               # AppShell, Navbar, Header, ProtectedRoute
│   ├── preloader/            # Preloader animé
│   └── ...
├── pages/                    # 10 pages complètes
├── animations/variants.ts    # Presets Framer Motion
└── utils/                    # cn, formatDate, firebaseErrors
functions/
└── src/index.ts              # Cloud Function sendMessage (OpenAI proxy)
```

## Pages

| Route | Page |
|-------|------|
| `/onboarding` | Slides de bienvenue (3 étapes) |
| `/login` | Connexion |
| `/signup` | Création de compte |
| `/app` | Accueil + mood check-in |
| `/app/chat` | Chat IA conversationnel |
| `/app/journal` | Journal émotionnel + calendrier |
| `/app/exercises` | Respiration + exercices bien-être |
| `/app/resources` | Ressources d'aide |
| `/app/profile` | Profil utilisateur |
| `/app/about` | À propos |

## Urgences intégrées

L'app détecte automatiquement les mots-clés de détresse et affiche une alerte avec :
- **3114** – Numéro national de prévention du suicide (24h/24)
- **Fil Santé Jeunes** – 0 800 235 236 (9h-23h)
- **SOS Amitié** – 09 72 39 40 50 (24h/24)
