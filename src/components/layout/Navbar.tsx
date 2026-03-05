import { NavLink, useLocation } from 'react-router-dom';
import { Home, MessageCircle, BookHeart, Wind, LifeBuoy } from 'lucide-react';
import { cn } from '../../utils/cn';

const NAV_ITEMS = [
  { to: '/app', icon: Home, label: 'Accueil', end: true },
  { to: '/app/chat', icon: MessageCircle, label: 'Chat', end: false },
  { to: '/app/journal', icon: BookHeart, label: 'Journal', end: false },
  { to: '/app/exercises', icon: Wind, label: 'Exercices', end: false },
  { to: '/app/resources', icon: LifeBuoy, label: 'Ressources', end: false },
];

export default function Navbar() {
  const location = useLocation();

  return (
    <nav className="flex-shrink-0 border-t border-border bg-bg-card px-2 pb-[env(safe-area-inset-bottom)]">
      <div className="flex items-center justify-around">
        {NAV_ITEMS.map(({ to, icon: Icon, label, end }) => {
          const isActive = end
            ? location.pathname === to
            : location.pathname.startsWith(to);
          return (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={cn(
                'flex flex-col items-center gap-0.5 py-2 px-3 text-[11px] transition-colors',
                isActive ? 'text-violet-500' : 'text-text-muted hover:text-text-secondary'
              )}
            >
              <Icon size={22} strokeWidth={isActive ? 2.5 : 2} />
              <span className="font-medium">{label}</span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}
