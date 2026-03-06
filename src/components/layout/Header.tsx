import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Bell, Grid } from 'lucide-react';
import { getGreeting } from '../../utils/formatDate';

export default function Header() {
  const { profile } = useAuth();
  const navigate = useNavigate();
  const greeting = getGreeting();

  return (
    <header className="flex-shrink-0 bg-bg-card border-b border-border px-4 py-4">
      <div className="flex items-start justify-between gap-3 mb-4">
        {/* Left: Avatar + Greeting */}
        <div className="flex items-start gap-3 flex-1">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-400 to-violet-500 flex items-center justify-center flex-shrink-0 overflow-hidden">
            {profile?.photoURL ? (
              <img src={profile.photoURL} alt={profile.displayName} className="w-full h-full object-cover" />
            ) : (
              <span className="text-lg font-bold text-white">
                {profile?.displayName?.charAt(0)?.toUpperCase() || '?'}
              </span>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-text-secondary text-sm">
              {greeting}, {profile?.displayName?.split(' ')[0] || 'toi'} 👋
            </p>
            <h1 className="font-bold text-lg text-text-primary leading-tight">
              Have a nice day
            </h1>
          </div>
        </div>

        {/* Right: Icons */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <button className="p-2 hover:bg-bg rounded-lg transition-colors text-text-secondary">
            <Bell size={20} />
          </button>
          <button
            onClick={() => navigate('/app/profile')}
            className="p-2 hover:bg-bg rounded-lg transition-colors text-text-secondary"
          >
            <Grid size={20} />
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <svg
          className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted"
          width="18"
          height="18"
          viewBox="0 0 20 20"
          fill="none"
          stroke="currentColor"
        >
          <circle cx="9" cy="9" r="6" />
          <path d="m14 14 3 3" strokeLinecap="round" />
        </svg>
        <input
          type="text"
          placeholder="Search resources..."
          className="w-full bg-bg rounded-full py-2.5 pl-10 pr-4 text-sm text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-violet-500/30"
        />
      </div>
    </header>
  );
}
