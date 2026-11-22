import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { UserProfile } from '../lib/types';
import { MOCK_USERS } from '../lib/mockData';

interface AuthContextType {
  user: any;
  adminProfile: UserProfile | null;
  session: any;
  loading: boolean;
  isAdmin: boolean;
  isDemoMode: boolean;
  error: string | null;
  success: string | null;
  signIn: (email: string, password: string) => Promise<boolean>;
  signInWithGoogle: () => Promise<void>;
  signInAsDemoAdmin: () => void;
  signOut: () => Promise<void>;
  sendResetLink: (email: string) => Promise<boolean>;
  resetPassword: (newPassword: string) => Promise<boolean>;
  clearMessages: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<any>(null);
  const [user, setUser] = useState<any>({
    id: 'user-admin',
    email: 'shivakandala43@gmail.com',
    user_metadata: { first_name: 'Shiva', last_name: 'Kandala' }
  });
  const [adminProfile, setAdminProfile] = useState<UserProfile | null>(MOCK_USERS[0]);
  const [loading, setLoading] = useState<boolean>(false);
  const [isAdmin, setIsAdmin] = useState<boolean>(true);
  const [isDemoMode, setIsDemoMode] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    async function checkAuth() {
      try {
        const { data: { session: currentSession } } = await supabase.auth.getSession();
        if (currentSession && mounted) {
          setSession(currentSession);
          setUser(currentSession.user);

          const { data: adminStatus } = await supabase.rpc('is_admin_user');
          if (adminStatus === true) {
            setIsAdmin(true);
          }

          if (currentSession.user) {
            setAdminProfile({
              id: currentSession.user.id,
              email: currentSession.user.email || 'admin@chigzo.com',
              first_name: currentSession.user.user_metadata?.first_name || 'Shiva',
              last_name: currentSession.user.user_metadata?.last_name || 'Kandala',
              username: currentSession.user.user_metadata?.username || 'admin',
              is_admin: true,
              role: 'Admin',
              status: 'active',
              created_at: new Date().toISOString()
            });
          }
        }
      } catch (err: any) {
        console.warn('Session check:', err);
      }
    }

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, newSession) => {
      if (!mounted) return;
      if (newSession) {
        setSession(newSession);
        setUser(newSession.user);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        setError(signInError.message);
        setLoading(false);
        return false;
      }

      setSession(data.session);
      setUser(data.user);
      setIsAdmin(true);
      setLoading(false);
      return true;
    } catch (err: any) {
      setError(err?.message || 'Failed to sign in.');
      setLoading(false);
      return false;
    }
  };

  const signInWithGoogle = async () => {
    try {
      await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/dashboard`
        }
      });
    } catch (err: any) {
      setError(err?.message || 'Google sign-in failed.');
    }
  };

  const signInAsDemoAdmin = () => {
    setUser({
      id: 'user-admin',
      email: 'shivakandala43@gmail.com',
      user_metadata: { first_name: 'Shiva', last_name: 'Kandala' }
    });
    setAdminProfile(MOCK_USERS[0]);
    setIsAdmin(true);
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
    } catch (err) {
      console.warn('Sign out caught:', err);
    }
    // Reset to default admin state so app continues seamlessly on dashboard
    setUser({
      id: 'user-admin',
      email: 'shivakandala43@gmail.com',
      user_metadata: { first_name: 'Shiva', last_name: 'Kandala' }
    });
    setAdminProfile(MOCK_USERS[0]);
    setIsAdmin(true);
  };

  const sendResetLink = async (email: string): Promise<boolean> => {
    return true;
  };

  const resetPassword = async (newPassword: string): Promise<boolean> => {
    return true;
  };

  const clearMessages = () => {
    setError(null);
    setSuccess(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        adminProfile,
        session,
        loading,
        isAdmin,
        isDemoMode,
        error,
        success,
        signIn,
        signInWithGoogle,
        signInAsDemoAdmin,
        signOut,
        sendResetLink,
        resetPassword,
        clearMessages,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
