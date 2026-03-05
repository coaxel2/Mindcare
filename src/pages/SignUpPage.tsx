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
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-violet-500 flex items-center justify-center mb-4">
            <svg width="32" height="32" viewBox="0 0 64 64" fill="none">
              <path d="M32 18C25.373 18 20 23.373 20 30c0 4.418 2.388 8.275 5.943 10.352L24 46h16l-1.943-5.648C41.612 38.275 44 34.418 44 30c0-6.627-5.373-12-12-12z" fill="white"/>
              <circle cx="27" cy="29" r="2" fill="#5D39FB"/>
              <circle cx="37" cy="29" r="2" fill="#5D39FB"/>
              <path d="M27 34c0 0 2.5 3 5 3s5-3 5-3" stroke="#5D39FB" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </div>
          <h1 className="font-bold leading-tight text-center">Créer ton compte</h1>
          <p className="text-text-secondary text-sm mt-1 text-center">
            Commence ton parcours de bien-être
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="text-xs font-semibold text-text-secondary mb-1.5 block">Prénom</label>
            <div className="flex items-center gap-2.5 w-full px-3.5 py-3 rounded-xl bg-white" style={{ border: '1.5px solid #E5E7EB' }}>
              <User size={16} className="text-text-muted flex-shrink-0" />
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Ton prénom"
                className="flex-1 bg-transparent outline-none text-sm text-text-primary placeholder:text-text-muted"
                required
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-text-secondary mb-1.5 block">Email</label>
            <div className="flex items-center gap-2.5 w-full px-3.5 py-3 rounded-xl bg-white" style={{ border: '1.5px solid #E5E7EB' }}>
              <Mail size={16} className="text-text-muted flex-shrink-0" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ton@email.com"
                className="flex-1 bg-transparent outline-none text-sm text-text-primary placeholder:text-text-muted"
                required
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-text-secondary mb-1.5 block">Mot de passe</label>
            <div className="flex items-center gap-2.5 w-full px-3.5 py-3 rounded-xl bg-white" style={{ border: '1.5px solid #E5E7EB' }}>
              <Lock size={16} className="text-text-muted flex-shrink-0" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="6 caractères minimum"
                className="flex-1 bg-transparent outline-none text-sm text-text-primary placeholder:text-text-muted"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-text-muted active:text-text-secondary flex-shrink-0"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-text-secondary mb-1.5 block">Confirmer le mot de passe</label>
            <div className="flex items-center gap-2.5 w-full px-3.5 py-3 rounded-xl bg-white" style={{ border: '1.5px solid #E5E7EB' }}>
              <Lock size={16} className="text-text-muted flex-shrink-0" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirme ton mot de passe"
                className="flex-1 bg-transparent outline-none text-sm text-text-primary placeholder:text-text-muted"
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
            className="w-full py-3.5 bg-violet-500 text-white font-bold rounded-xl active:bg-violet-600 transition-colors disabled:opacity-50 mt-2 text-sm"
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
