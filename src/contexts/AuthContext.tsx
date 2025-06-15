
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
  const [initialCheckComplete, setInitialCheckComplete] = useState(false);

  useEffect(() => {
    // Check for existing session first
    const checkSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        console.log('Initial session check:', session, error);
        
        if (session?.user) {
          setSession(session);
          // Check if user exists in our auth table
          const { data: authUser, error: authError } = await supabase
            .from('auth')
            .select('id, email')
            .eq('id', session.user.id)
            .single();

          if (authUser && !authError) {
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
            console.log('User not found in auth table:', authError);
            // Don't clear the user immediately, let the auth state change handle it
          }
        } else {
          // Check localStorage as fallback
          const storedUser = localStorage.getItem('user');
          if (storedUser) {
            try {
              const parsedUser = JSON.parse(storedUser);
              // Check if stored user is recent (within 24 hours)
              const isRecent = new Date().getTime() - parsedUser.timestamp < 24 * 60 * 60 * 1000;
              if (isRecent && parsedUser.id && parsedUser.email) {
                setUserState({
                  id: parsedUser.id,
                  email: parsedUser.email
                });
                console.log('Restored user from localStorage:', parsedUser);
              } else {
                localStorage.removeItem('user');
              }
            } catch (error) {
              console.error('Error parsing stored user:', error);
              localStorage.removeItem('user');
            }
          }
        }
      } catch (error) {
        console.error('Error checking session:', error);
      } finally {
        setInitialCheckComplete(true);
        setLoading(false);
      }
    };

    checkSession();

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
        
        if (initialCheckComplete) {
          setLoading(false);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [initialCheckComplete]);

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
