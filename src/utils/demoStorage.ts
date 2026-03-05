/**
 * localStorage-based storage for demo mode (no Firebase)
 */

export function demoGet<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function demoSet<T>(key: string, value: T): void {
  localStorage.setItem(key, JSON.stringify(value));
}

export function demoUid(): string {
  try {
    const u = localStorage.getItem('mindcare_demo_user');
    if (u) return (JSON.parse(u) as { uid: string }).uid;
  } catch { /* ignore */ }
  return 'demo_user';
}
