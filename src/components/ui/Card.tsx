import type { ReactNode, MouseEventHandler } from 'react';
import { cn } from '../../utils/cn';

interface CardProps {
  children: ReactNode;
  className?: string;
  onClick?: MouseEventHandler<HTMLDivElement>;
  hoverable?: boolean;
}

export default function Card({ children, className, onClick, hoverable = false }: CardProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        'rounded-2xl bg-bg-card p-5 shadow-[var(--shadow-card)] border border-border/40',
        hoverable && 'cursor-pointer transition-shadow active:shadow-[var(--shadow-card-hover)]',
        className
      )}
    >
      {children}
    </div>
  );
}
