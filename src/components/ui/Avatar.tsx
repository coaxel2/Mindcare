import { cn } from '../../utils/cn';

interface AvatarProps {
  name: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizeStyles = {
  sm: 'w-8 h-8 text-sm',
  md: 'w-10 h-10',
  lg: 'w-14 h-14 text-xl',
};

export default function Avatar({ name, size = 'md', className }: AvatarProps) {
  return (
    <div
      className={cn(
        'flex items-center justify-center rounded-full bg-violet-100 font-semibold text-violet-600',
        sizeStyles[size],
        className
      )}
    >
      {name.charAt(0).toUpperCase()}
    </div>
  );
}
