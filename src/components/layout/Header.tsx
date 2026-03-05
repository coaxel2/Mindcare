import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Settings } from 'lucide-react';

export default function Header() {
  const { profile } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="flex-shrink-0 flex items-center justify-between px-4 py-3 bg-bg-card border-b border-border">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-violet-500 flex items-center justify-center">
          <svg width="22" height="22" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M32 18C25.373 18 20 23.373 20 30c0 4.418 2.388 8.275 5.943 10.352L24 46h16l-1.943-5.648C41.612 38.275 44 34.418 44 30c0-6.627-5.373-12-12-12z" fill="white"/>
            <circle cx="27" cy="29" r="2" fill="#5D39FB"/>
            <circle cx="37" cy="29" r="2" fill="#5D39FB"/>
            <path d="M27 34c0 0 2.5 3 5 3s5-3 5-3" stroke="#5D39FB" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </div>
        <span className="font-semibold text-lg font-[family-name:var(--font-family-heading)]">
          MindCare
        </span>
      </div>
      <button
        onClick={() => navigate('/app/profile')}
        className="flex items-center gap-2 text-text-secondary hover:text-violet-500 transition-colors"
      >
        <div className="w-8 h-8 rounded-full bg-violet-100 flex items-center justify-center text-violet-600 text-sm font-semibold">
          {profile?.displayName?.charAt(0)?.toUpperCase() || '?'}
        </div>
        <Settings size={18} />
      </button>
    </header>
  );
}
