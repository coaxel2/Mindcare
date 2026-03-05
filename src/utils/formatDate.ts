import { format, formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';

export function formatDate(date: Date, pattern: string = 'dd MMMM yyyy'): string {
  return format(date, pattern, { locale: fr });
}

export function formatRelative(date: Date): string {
  return formatDistanceToNow(date, { addSuffix: true, locale: fr });
}

export function formatTime(date: Date): string {
  return format(date, 'HH:mm', { locale: fr });
}

export function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Bonjour';
  if (hour < 18) return 'Bon après-midi';
  return 'Bonsoir';
}
