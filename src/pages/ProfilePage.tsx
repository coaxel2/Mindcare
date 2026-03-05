import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Mail, Calendar, LogOut, Trash2, Info, ChevronRight } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { formatDate } from '../utils/formatDate';

export default function ProfilePage() {
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  const createdAt = user?.metadata.creationTime
    ? new Date(user.metadata.creationTime)
    : null;

  return (
    <div className="flex flex-col gap-5 py-5 pb-10 max-w-lg mx-auto">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-bold leading-tight">Mon profil</h1>
      </motion.div>

      {/* Avatar + Name */}
      <motion.div
        className="bg-bg-card rounded-2xl p-5 shadow-[var(--shadow-card)] border border-border/40 flex flex-col items-center"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="w-16 h-16 rounded-full bg-violet-100 flex items-center justify-center text-violet-600 text-2xl font-bold mb-2">
          {profile?.displayName?.charAt(0)?.toUpperCase() || '?'}
        </div>
        <h2 className="text-base font-bold">
          {profile?.displayName || 'Utilisateur'}
        </h2>
        <p className="text-text-secondary text-xs">{user?.email}</p>
      </motion.div>

      {/* Info */}
      <motion.div
        className="bg-bg-card rounded-2xl shadow-[var(--shadow-card)] border border-border/40 overflow-hidden"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="divide-y divide-border/50">
          <div className="flex items-center gap-3.5 px-5 py-4">
            <User size={16} className="text-text-muted flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-[10px] text-text-muted uppercase tracking-wide font-semibold">Nom</p>
              <p className="text-sm font-medium mt-0.5">{profile?.displayName}</p>
            </div>
          </div>
          <div className="flex items-center gap-3.5 px-5 py-4">
            <Mail size={16} className="text-text-muted flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-[10px] text-text-muted uppercase tracking-wide font-semibold">Email</p>
              <p className="text-sm font-medium truncate mt-0.5">{user?.email}</p>
            </div>
          </div>
          {createdAt && (
            <div className="flex items-center gap-3.5 px-5 py-4">
              <Calendar size={16} className="text-text-muted flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-[10px] text-text-muted uppercase tracking-wide font-semibold">Membre depuis</p>
                <p className="text-sm font-medium mt-0.5">{formatDate(createdAt)}</p>
              </div>
            </div>
          )}
        </div>
      </motion.div>

      {/* Actions */}
      <motion.div
        className="bg-bg-card rounded-2xl shadow-[var(--shadow-card)] border border-border/40 overflow-hidden"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <button
          onClick={() => navigate('/app/about')}
          className="w-full flex items-center gap-3.5 px-5 py-4 active:bg-gray-50 transition-colors text-left"
        >
          <Info size={16} className="text-text-muted" />
          <span className="flex-1 text-sm font-medium">À propos</span>
          <ChevronRight size={14} className="text-text-muted" />
        </button>
      </motion.div>

      {/* Sign out */}
      <motion.div
        className="flex flex-col gap-2.5"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <button
          onClick={handleSignOut}
          className="w-full flex items-center justify-center gap-2 py-3 bg-violet-50 text-violet-500 font-semibold rounded-xl active:bg-violet-100 transition-colors text-sm"
        >
          <LogOut size={16} />
          Se déconnecter
        </button>

        <button
          onClick={() => setShowDeleteConfirm(true)}
          className="w-full flex items-center justify-center gap-2 py-3 text-danger text-sm font-medium active:bg-danger-light rounded-xl transition-colors"
        >
          <Trash2 size={14} />
          Supprimer mon compte
        </button>
      </motion.div>

      {/* Delete confirmation */}
      {showDeleteConfirm && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
        >
          <motion.div
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            className="bg-white rounded-2xl p-5 max-w-sm w-full shadow-xl"
          >
            <h3 className="font-bold text-base mb-1.5">
              Supprimer ton compte ?
            </h3>
            <p className="text-text-secondary text-xs mb-5 leading-relaxed">
              Cette action est irréversible. Toutes tes données seront supprimées.
            </p>
            <div className="flex gap-2.5">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 py-2.5 bg-gray-100 text-text-secondary font-semibold rounded-xl text-sm active:bg-gray-200 transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={() => {
                  // TODO: implement delete account
                  setShowDeleteConfirm(false);
                }}
                className="flex-1 py-2.5 bg-danger text-white font-semibold rounded-xl text-sm active:bg-red-600 transition-colors"
              >
                Supprimer
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
