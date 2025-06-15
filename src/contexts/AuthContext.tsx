
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

  console.log('AuthProvider rendering - user:', user, 'loading:', loading);

  useEffect(() => {
    console.log('AuthProvider useEffect starting...');
    
    // Check for existing session first
    const checkSession = async () => {
      try {
        console.log('Checking initial session...');
        const { data: { session }, error } = await supabase.auth.getSession();
        console.log('Initial session check result:', { session, error });
        
        if (session?.user) {
          setSession(session);
          // Check if user exists in our auth table
          const { data: authUser, error: authError } = await supabase
            .from('auth')
            .select('id, email')
            .eq('id', session.user.id)
            .single();

          console.log('Auth table lookup result:', { authUser, authError });

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
            console.log('User set from auth table:', userData);
          } else {
            console.log('User not found in auth table, checking localStorage...');
            // Check localStorage as fallback
            const storedUser = localStorage.getItem('user');
            if (storedUser) {
              try {
                const parsedUser = JSON.parse(storedUser);
                const isRecent = new Date().getTime() - parsedUser.timestamp < 24 * 60 * 60 * 1000;
                if (isRecent && parsedUser.id && parsedUser.email) {
                  setUserState({
                    id: parsedUser.id,
                    email: parsedUser.email
                  });
                  console.log('Restored user from localStorage:', parsedUser);
                } else {
                  localStorage.removeItem('user');
                  console.log('Removed stale user from localStorage');
                }
              } catch (error) {
                console.error('Error parsing stored user:', error);
                localStorage.removeItem('user');
              }
            }
          }
        } else {
          console.log('No session found, checking localStorage...');
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
                console.log('Removed stale user from localStorage');
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
        console.log('Setting initial check complete and loading false');
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
            console.log('User set from auth state change:', userData);
          } else {
            console.log('User not found in auth table during state change:', error);
            setUserState(null);
            localStorage.removeItem('user');
          }
        } else {
          setUserState(null);
          localStorage.removeItem('user');
          console.log('User cleared from auth state change');
        }
        
        if (initialCheckComplete) {
          setLoading(false);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [initialCheckComplete]);

  const signOut = async () => {
    console.log('Signing out user...');
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Error signing out:', error);
    }
    localStorage.removeItem('user');
    setUserState(null);
    setSession(null);
  };

  const setUser = (userData: AuthUser | null) => {
    console.log('Setting user manually:', userData);
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
