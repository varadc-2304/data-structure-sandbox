
import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { supabase } from '@/lib/supabase';

type User = {
  id: string;
  email: string;
};

type AuthContextType = {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for user in localStorage
    const checkAuth = () => {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser);
          // Check if the session is still valid (optional: add expiration check)
          setUser({
            id: parsedUser.id,
            email: parsedUser.email
          });
        } catch (error) {
          console.error("Error parsing stored user:", error);
          localStorage.removeItem('user');
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase
      .from('auth')
      .select('id, email')
      .eq('email', email)
      .eq('password', password)
      .single();
    
    if (error) {
      throw error;
    }
    
    if (!data) {
      throw new Error('Invalid login credentials');
    }
    
    // Store user in localStorage
    localStorage.setItem('user', JSON.stringify({
      id: data.id,
      email: data.email,
      timestamp: new Date().getTime()
    }));
    
    setUser({
      id: data.id,
      email: data.email
    });
  };

  const signOut = async () => {
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signIn,
        signOut,
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
