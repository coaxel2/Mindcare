import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { getAuthErrorMessage } from '../utils/firebaseErrors';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [resetSent, setResetSent] = useState(false);
  const { signIn, resetPassword } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await signIn(email, password);
      navigate('/app');
    } catch (err: unknown) {
      const firebaseErr = err as { code?: string };
      setError(getAuthErrorMessage(firebaseErr.code ?? ''));
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async () => {
    if (!email) {
      setError('Entre ton adresse email pour réinitialiser ton mot de passe.');
      return;
    }
    try {
      await resetPassword(email);
      setResetSent(true);
      setError('');
    } catch (err: unknown) {
      const firebaseErr = err as { code?: string };
      setError(getAuthErrorMessage(firebaseErr.code ?? ''));
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
          <h1 className="font-bold leading-tight text-center">Content de te revoir</h1>
          <p className="text-text-secondary text-sm mt-1 text-center">
            Connecte-toi pour continuer
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
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
                placeholder="••••••••"
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

          {error && (
            <motion.p
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-danger text-xs bg-danger-light px-3 py-2 rounded-lg"
            >
              {error}
            </motion.p>
          )}

          {resetSent && (
            <motion.p
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-green-600 text-xs bg-green-50 px-3 py-2 rounded-lg"
            >
              Email de réinitialisation envoyé !
            </motion.p>
          )}

          <button
            type="button"
            onClick={handleReset}
            className="text-xs text-violet-500 font-medium self-end -mt-1"
          >
            Mot de passe oublié ?
          </button>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-violet-500 text-white font-bold rounded-xl active:bg-violet-600 transition-colors disabled:opacity-50 text-sm"
          >
            {loading ? 'Connexion...' : 'Se connecter'}
          </button>
        </form>

        <p className="text-center text-text-secondary text-xs mt-6">
          Pas encore de compte ?{' '}
          <Link to="/signup" className="text-violet-500 font-semibold">
            Créer un compte
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
