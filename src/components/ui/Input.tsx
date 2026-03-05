import type { InputHTMLAttributes } from 'react';
import type { LucideIcon } from 'lucide-react';
import { cn } from '../../utils/cn';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: LucideIcon;
}

export default function Input({ label, error, icon: Icon, className, id, ...rest }: InputProps) {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className="w-full">
      {label && (
        <label htmlFor={inputId} className="mb-1.5 block text-sm font-medium text-text-secondary">
          {label}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
            <Icon className="h-5 w-5 text-text-muted" />
          </div>
        )}
        <input
          id={inputId}
          className={cn(
            'w-full rounded-xl border border-border bg-white px-4 py-3 text-text-primary placeholder:text-text-muted transition-all focus:border-violet-500 focus:ring-2 focus:ring-violet-100 focus:outline-none',
            Icon && 'pl-11',
            error && 'border-danger focus:border-danger focus:ring-red-100',
            className
          )}
          {...rest}
        />
      </div>
      {error && <p className="mt-1.5 text-sm text-danger">{error}</p>}
    </div>
  );
}
