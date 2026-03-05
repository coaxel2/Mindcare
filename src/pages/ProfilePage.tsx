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
    <div className="py-4 space-y-6 max-w-lg mx-auto">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold font-[family-name:var(--font-family-heading)]">
          Mon profil
        </h1>
      </motion.div>

      {/* Avatar + Name */}
      <motion.div
        className="bg-bg-card rounded-2xl p-6 shadow-sm flex flex-col items-center"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="w-20 h-20 rounded-full bg-violet-100 flex items-center justify-center text-violet-600 text-3xl font-bold mb-3">
          {profile?.displayName?.charAt(0)?.toUpperCase() || '?'}
        </div>
        <h2 className="text-lg font-semibold font-[family-name:var(--font-family-heading)]">
          {profile?.displayName || 'Utilisateur'}
        </h2>
        <p className="text-text-secondary text-sm">{user?.email}</p>
      </motion.div>

      {/* Info */}
      <motion.div
        className="bg-bg-card rounded-2xl shadow-sm overflow-hidden"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="divide-y divide-border">
          <div className="flex items-center gap-3 px-5 py-4">
            <User size={18} className="text-text-muted" />
            <div className="flex-1">
              <p className="text-xs text-text-muted">Nom</p>
              <p className="text-sm font-medium">{profile?.displayName}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 px-5 py-4">
            <Mail size={18} className="text-text-muted" />
            <div className="flex-1">
              <p className="text-xs text-text-muted">Email</p>
              <p className="text-sm font-medium">{user?.email}</p>
            </div>
          </div>
          {createdAt && (
            <div className="flex items-center gap-3 px-5 py-4">
              <Calendar size={18} className="text-text-muted" />
              <div className="flex-1">
                <p className="text-xs text-text-muted">Membre depuis</p>
                <p className="text-sm font-medium">{formatDate(createdAt)}</p>
              </div>
            </div>
          )}
        </div>
      </motion.div>

      {/* Actions */}
      <motion.div
        className="bg-bg-card rounded-2xl shadow-sm overflow-hidden"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <button
          onClick={() => navigate('/app/about')}
          className="w-full flex items-center gap-3 px-5 py-4 hover:bg-gray-50 transition-colors text-left"
        >
          <Info size={18} className="text-text-muted" />
          <span className="flex-1 text-sm font-medium">À propos</span>
          <ChevronRight size={16} className="text-text-muted" />
        </button>
      </motion.div>

      {/* Sign out */}
      <motion.div
        className="space-y-3"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <button
          onClick={handleSignOut}
          className="w-full flex items-center justify-center gap-2 py-3.5 bg-violet-50 text-violet-500 font-semibold rounded-full hover:bg-violet-100 transition-colors text-sm"
        >
          <LogOut size={18} />
          Se déconnecter
        </button>

        <button
          onClick={() => setShowDeleteConfirm(true)}
          className="w-full flex items-center justify-center gap-2 py-3.5 text-danger text-sm font-medium hover:bg-danger-light rounded-full transition-colors"
        >
          <Trash2 size={16} />
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
            className="bg-white rounded-2xl p-6 max-w-sm w-full"
          >
            <h3 className="font-bold text-lg mb-2 font-[family-name:var(--font-family-heading)]">
              Supprimer ton compte ?
            </h3>
            <p className="text-text-secondary text-sm mb-6">
              Cette action est irréversible. Toutes tes données seront supprimées.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 py-2.5 bg-gray-100 text-text-secondary font-medium rounded-full text-sm hover:bg-gray-200 transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={() => {
                  // TODO: implement delete account
                  setShowDeleteConfirm(false);
                }}
                className="flex-1 py-2.5 bg-danger text-white font-medium rounded-full text-sm hover:bg-red-600 transition-colors"
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
