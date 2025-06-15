
import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { supabase } from '@/lib/supabase';
import { Session, User } from '@supabase/supabase-js';

type AuthUser = {
  id: string;
  email: string;
};

type AuthContextType = {
  user: AuthUser | null;
  loading: boolean;
  signOut: () => Promise<void>;
  setUser: (user: AuthUser | null) => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUserState] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session);
        setSession(session);
        
        if (session?.user) {
          // Check if user exists in our auth table
          const { data: authUser, error } = await supabase
            .from('auth')
            .select('id, email')
            .eq('id', session.user.id)
            .single();

          if (authUser && !error) {
            const userData = {
              id: authUser.id,
              email: authUser.email
            };
            setUserState(userData);
            localStorage.setItem('user', JSON.stringify({
              id: userData.id,
              email: userData.email,
              timestamp: new Date().getTime()
            }));
          } else {
            console.log('User not found in auth table:', error);
            setUserState(null);
            localStorage.removeItem('user');
          }
        } else {
          setUserState(null);
          localStorage.removeItem('user');
        }
        setLoading(false);
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (!session) {
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Error signing out:', error);
    }
    localStorage.removeItem('user');
    setUserState(null);
    setSession(null);
  };

  const setUser = (userData: AuthUser | null) => {
    if (userData) {
      localStorage.setItem('user', JSON.stringify({
        id: userData.id,
        email: userData.email,
        timestamp: new Date().getTime()
      }));
    } else {
      localStorage.removeItem('user');
    }
    setUserState(userData);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signOut,
        setUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
