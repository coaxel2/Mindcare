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
    <nav className="flex-shrink-0 border-t border-border/60 bg-bg-card/80 backdrop-blur-md px-1 pb-[env(safe-area-inset-bottom)]">
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
                'flex flex-col items-center gap-0.5 py-2 px-2.5 text-[10px] transition-colors relative',
                isActive ? 'text-violet-500' : 'text-text-muted active:text-text-secondary'
              )}
            >
              {isActive && (
                <span className="absolute -top-px left-1/2 -translate-x-1/2 w-5 h-[2px] bg-violet-500 rounded-full" />
              )}
              <Icon size={20} strokeWidth={isActive ? 2.5 : 1.8} />
              <span className={cn('font-medium', isActive && 'font-semibold')}>{label}</span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}
