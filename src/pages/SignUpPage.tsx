import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, User } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { getAuthErrorMessage } from '../utils/firebaseErrors';

export default function SignUpPage() {
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signUp } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!displayName.trim()) {
      setError('Entre ton prénom.');
      return;
    }
    if (password.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas.');
      return;
    }

    setLoading(true);
    try {
      await signUp(email, password, displayName.trim());
      navigate('/app');
    } catch (err: unknown) {
      const firebaseErr = err as { code?: string };
      setError(getAuthErrorMessage(firebaseErr.code ?? ''));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-dvh bg-bg flex flex-col items-center justify-center px-6">
      <motion.div
        className="w-full max-w-sm"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-violet-500 flex items-center justify-center mx-auto mb-3">
            <svg width="30" height="30" viewBox="0 0 64 64" fill="none">
              <path d="M32 18C25.373 18 20 23.373 20 30c0 4.418 2.388 8.275 5.943 10.352L24 46h16l-1.943-5.648C41.612 38.275 44 34.418 44 30c0-6.627-5.373-12-12-12z" fill="white"/>
              <circle cx="27" cy="29" r="2" fill="#5D39FB"/>
              <circle cx="37" cy="29" r="2" fill="#5D39FB"/>
              <path d="M27 34c0 0 2.5 3 5 3s5-3 5-3" stroke="#5D39FB" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </div>
          <h1 className="font-bold leading-tight">Créer ton compte</h1>
          <p className="text-text-secondary text-sm mt-1">
            Commence ton parcours de bien-être
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
          <div>
            <label className="text-xs font-semibold text-text-secondary mb-1 block">Prénom</label>
            <div className="relative">
              <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Ton prénom"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-white focus:border-violet-500 focus:ring-2 focus:ring-violet-100 outline-none transition-all text-sm"
                required
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-text-secondary mb-1 block">Email</label>
            <div className="relative">
              <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ton@email.com"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-white focus:border-violet-500 focus:ring-2 focus:ring-violet-100 outline-none transition-all text-sm"
                required
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-text-secondary mb-1 block">Mot de passe</label>
            <div className="relative">
              <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="6 caractères minimum"
                className="w-full pl-10 pr-11 py-2.5 rounded-xl border border-border bg-white focus:border-violet-500 focus:ring-2 focus:ring-violet-100 outline-none transition-all text-sm"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted active:text-text-secondary"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-text-secondary mb-1 block">Confirmer le mot de passe</label>
            <div className="relative">
              <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirme ton mot de passe"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-white focus:border-violet-500 focus:ring-2 focus:ring-violet-100 outline-none transition-all text-sm"
                required
              />
            </div>
          </div>

          {error && (
            <motion.p
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-danger text-xs bg-danger-light px-3 py-2 rounded-lg"
            >
              {error}
            </motion.p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-violet-500 text-white font-bold rounded-xl active:bg-violet-600 transition-colors disabled:opacity-50 mt-1 text-sm"
          >
            {loading ? 'Création...' : 'Créer mon compte'}
          </button>
        </form>

        <p className="text-center text-text-secondary text-xs mt-6">
          Déjà un compte ?{' '}
          <Link to="/login" className="text-violet-500 font-semibold">
            Se connecter
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
