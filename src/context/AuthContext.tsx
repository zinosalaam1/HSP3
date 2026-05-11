import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/lib/supabase';
import type { User } from '@/types';
import type { Session } from '@supabase/supabase-js';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ error: string | null }>;
  adminLogin: (email: string, password: string) => Promise<{ error: string | null }>;
  register: (email: string, password: string, name: string) => Promise<{ error: string | null }>;
  logout: () => Promise<void>;
  updateProfile: (updates: Partial<Pick<User, 'name'>>) => Promise<{ error: string | null }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  // Load profile — with client-side fallback creation if trigger didn't fire
  async function loadProfile(authUser: { id: string; email?: string; user_metadata?: Record<string, string> }): Promise<User | null> {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', authUser.id)
      .single();

    if (!error && data) {
      return {
        id: data.id,
        email: data.email,
        name: data.name,
        role: data.role as 'admin' | 'customer',
        created_at: data.created_at,
      };
    }

    // Profile missing — trigger didn't fire. Create it now from the frontend.
    const name =
      authUser.user_metadata?.name ||
      authUser.email?.split('@')[0] ||
      'User';

    const { data: created, error: createError } = await supabase
      .from('profiles')
      .upsert({
        id: authUser.id,
        email: authUser.email ?? '',
        name,
        role: 'customer',
      }, { onConflict: 'id' })
      .select()
      .single();

    if (createError || !created) {
      console.error('Could not create profile:', createError?.message);
      return null;
    }

    return {
      id: created.id,
      email: created.email,
      name: created.name,
      role: created.role as 'admin' | 'customer',
      created_at: created.created_at,
    };
  }

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      setSession(session);
      if (session?.user) {
        const profile = await loadProfile(session.user);
        setUser(profile);
      }
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        setSession(session);
        if (session?.user) {
          const profile = await loadProfile(session.user);
          setUser(profile);
        } else {
          setUser(null);
        }
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  // Regular user login
  const login = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return { error: error.message };
    return { error: null };
  };

  // Admin-only login — rejects non-admin accounts after auth
  const adminLogin = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return { error: error.message };

    // Check role before allowing in
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', data.user.id)
      .single();

    if (!profile || profile.role !== 'admin') {
      // Sign them back out — not an admin account
      await supabase.auth.signOut();
      return { error: 'This account does not have admin access.' };
    }

    return { error: null };
  };

  const register = async (email: string, password: string, name: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { name } },
    });

    if (error) return { error: error.message };

    // Immediately create profile as a fallback (trigger may be slow or broken)
    if (data.user) {
      await supabase.from('profiles').upsert({
        id: data.user.id,
        email,
        name,
        role: 'customer',
      }, { onConflict: 'id' });
    }

    return { error: null };
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
  };

  const updateProfile = async (updates: Partial<Pick<User, 'name'>>) => {
    if (!user) return { error: 'Not authenticated' };
    const { error } = await supabase.from('profiles').update(updates).eq('id', user.id);
    if (error) return { error: error.message };
    setUser((u) => (u ? { ...u, ...updates } : u));
    return { error: null };
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'admin',
        loading,
        login,
        adminLogin,
        register,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
