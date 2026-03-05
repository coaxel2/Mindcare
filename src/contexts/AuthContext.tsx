import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { IS_DEMO_MODE, auth } from '../config/firebase';
import type { UserProfile } from '../types';

export interface AppUser {
  uid: string;
  email: string | null;
  metadata: { creationTime?: string };
}

interface AuthContextType {
  user: AppUser | null;
  profile: UserProfile | null;
  loading: boolean;
  signUp: (email: string, password: string, displayName: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
}

// ── Demo storage ─────────────────────────────────────────────────────────────
const DEMO_USER_KEY = 'mindcare_demo_user';
const DEMO_PROFILE_KEY = 'mindcare_demo_profile';

function loadDemoSession(): { user: AppUser; profile: UserProfile } | null {
  try {
    const u = localStorage.getItem(DEMO_USER_KEY);
    const p = localStorage.getItem(DEMO_PROFILE_KEY);
    if (u && p) return { user: JSON.parse(u), profile: JSON.parse(p) };
  } catch { /* ignore */ }
  return null;
}

function saveDemoSession(user: AppUser, profile: UserProfile) {
  localStorage.setItem(DEMO_USER_KEY, JSON.stringify(user));
  localStorage.setItem(DEMO_PROFILE_KEY, JSON.stringify(profile));
}

function clearDemoSession() {
  localStorage.removeItem(DEMO_USER_KEY);
  localStorage.removeItem(DEMO_PROFILE_KEY);
}

// ── Context ───────────────────────────────────────────────────────────────────
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AppUser | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (IS_DEMO_MODE) {
      const session = loadDemoSession();
      if (session) {
        setUser(session.user);
        setProfile(session.profile);
      }
      setLoading(false);
      return;
    }

    // Firebase mode
    (async () => {
      const { onAuthStateChanged } = await import('firebase/auth');
      const { getUserProfile } = await import('../services/user.service');

      const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
        if (firebaseUser) {
          setUser(firebaseUser as unknown as AppUser);
          const p = await getUserProfile(firebaseUser.uid);
          setProfile(p);
        } else {
          setUser(null);
          setProfile(null);
        }
        setLoading(false);
      });
      return unsubscribe;
    })();
  }, []);

  const signUp = async (email: string, password: string, displayName: string) => {
    if (IS_DEMO_MODE) {
      const uid = `demo_${Date.now()}`;
      const newUser: AppUser = {
        uid,
        email,
        metadata: { creationTime: new Date().toISOString() },
      };
      const newProfile: UserProfile = {
        uid,
        email,
        displayName,
        photoURL: null,
        onboardingCompleted: true,
        createdAt: null as never,
        updatedAt: null as never,
        preferences: { notifications: false, dailyReminderTime: null },
      };
      saveDemoSession(newUser, newProfile);
      setUser(newUser);
      setProfile(newProfile);
      return;
    }

    const { createUserWithEmailAndPassword, updateProfile } = await import('firebase/auth');
    const { createUserProfile, getUserProfile } = await import('../services/user.service');
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(cred.user, { displayName });
    await createUserProfile(cred.user.uid, { email, displayName });
    const p = await getUserProfile(cred.user.uid);
    setUser(cred.user as unknown as AppUser);
    setProfile(p);
  };

  const signIn = async (email: string, password: string) => {
    if (IS_DEMO_MODE) {
      const session = loadDemoSession();
      if (session?.user.email === email) {
        setUser(session.user);
        setProfile(session.profile);
        return;
      }
      throw Object.assign(new Error('Utilisateur non trouvé'), { code: 'auth/user-not-found' });
    }

    const { signInWithEmailAndPassword } = await import('firebase/auth');
    const { getUserProfile } = await import('../services/user.service');
    const cred = await signInWithEmailAndPassword(auth, email, password);
    const p = await getUserProfile(cred.user.uid);
    setUser(cred.user as unknown as AppUser);
    setProfile(p);
  };

  const signOut = async () => {
    if (IS_DEMO_MODE) {
      clearDemoSession();
      setUser(null);
      setProfile(null);
      return;
    }
    const { signOut: fbSignOut } = await import('firebase/auth');
    await fbSignOut(auth);
    setUser(null);
    setProfile(null);
  };

  const resetPassword = async (email: string) => {
    if (IS_DEMO_MODE) {
      alert(`[Mode démo] Réinitialisation simulée pour ${email}`);
      return;
    }
    const { sendPasswordResetEmail } = await import('firebase/auth');
    await sendPasswordResetEmail(auth, email);
  };

  return (
    <AuthContext.Provider value={{ user, profile, loading, signUp, signIn, signOut, resetPassword }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
};
