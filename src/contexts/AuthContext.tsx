
import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { supabase } from '@/lib/supabase';
import { Session, User } from '@supabase/supabase-js';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged, signOut as firebaseSignOut, User as FirebaseUser } from 'firebase/auth';

type AuthUser = {
  id: string;
  email: string;
  name: string;
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

  // Safety timeout to ensure loading doesn't stay true forever
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (loading) {
        console.warn('Auth loading timeout - setting loading to false');
        setLoading(false);
      }
    }, 5000); // 5 second timeout

    return () => clearTimeout(timeout);
  }, [loading]);

  // Firebase auth state listener (primary auth method)
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
      if (firebaseUser) {
        const userData = {
          id: firebaseUser.uid,
          email: firebaseUser.email || '',
          name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'User'
        };
        setUserState(userData);
        localStorage.setItem('user', JSON.stringify({
          id: userData.id,
          email: userData.email,
          name: userData.name,
          timestamp: new Date().getTime()
        }));
        setLoading(false);
      } else {
        // Check localStorage as fallback
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          try {
            const parsedUser = JSON.parse(storedUser);
            const isRecent = new Date().getTime() - parsedUser.timestamp < 7 * 24 * 60 * 60 * 1000;
            if (isRecent && parsedUser.id && parsedUser.email) {
              setUserState({
                id: parsedUser.id,
                email: parsedUser.email,
                name: parsedUser.name || parsedUser.email.split('@')[0] || 'User'
              });
              setLoading(false);
            } else {
              localStorage.removeItem('user');
              setUserState(null);
              setLoading(false);
            }
          } catch (error) {
            console.error('Error parsing stored user:', error);
            localStorage.removeItem('user');
            setUserState(null);
            setLoading(false);
          }
        } else {
          setUserState(null);
          setLoading(false);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  // Supabase auth state listener (for backward compatibility)
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
            const userName = session.user.user_metadata?.full_name || session.user.user_metadata?.name || authUser.email?.split('@')[0] || 'User';
            const userData = {
              id: authUser.id,
              email: authUser.email,
              name: userName
            };
            setUserState(userData);
            localStorage.setItem('user', JSON.stringify({
              id: userData.id,
              email: userData.email,
              name: userData.name,
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
              // Check if stored user is recent (within 7 days)
              const isRecent = new Date().getTime() - parsedUser.timestamp < 7 * 24 * 60 * 60 * 1000;
              if (isRecent && parsedUser.id && parsedUser.email) {
                setUserState({
                  id: parsedUser.id,
                  email: parsedUser.email,
                  name: parsedUser.name || parsedUser.email.split('@')[0] || 'User'
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
            const userName = session.user.user_metadata?.full_name || session.user.user_metadata?.name || authUser.email?.split('@')[0] || 'User';
            const userData = {
              id: authUser.id,
              email: authUser.email,
              name: userName
            };
            setUserState(userData);
            localStorage.setItem('user', JSON.stringify({
              id: userData.id,
              email: userData.email,
              name: userData.name,
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
    // Sign out from Firebase
    try {
      await firebaseSignOut(auth);
    } catch (error) {
      console.error('Error signing out from Firebase:', error);
    }
    
    // Also sign out from Supabase if there's a session
    if (session) {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Error signing out from Supabase:', error);
      }
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
        name: userData.name,
        timestamp: new Date().getTime()
      }));
      setUserState(userData);
      setLoading(false); // Ensure loading is set to false after setting user
    } else {
      localStorage.removeItem('user');
      setUserState(null);
      setLoading(false);
    }
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
