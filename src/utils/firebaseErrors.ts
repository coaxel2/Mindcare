const firebaseErrorMessages: Record<string, string> = {
  'auth/email-already-in-use': 'Cette adresse email est déjà utilisée par un autre compte.',
  'auth/invalid-email': "L'adresse email est invalide.",
  'auth/weak-password': 'Le mot de passe est trop faible. Il doit contenir au moins 6 caractères.',
  'auth/user-not-found': 'Aucun compte ne correspond à cette adresse email.',
  'auth/wrong-password': 'Le mot de passe est incorrect.',
  'auth/too-many-requests': 'Trop de tentatives. Réessaie plus tard.',
  'auth/invalid-credential': 'Les identifiants sont invalides. Vérifie ton email et ton mot de passe.',
  'auth/network-request-failed': 'Erreur de connexion. Vérifie ta connexion internet.',
};

export const getAuthErrorMessage = (errorCode: string): string => {
  return firebaseErrorMessages[errorCode] || 'Une erreur est survenue. Réessaie.';
};
