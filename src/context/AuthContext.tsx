
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Session, User } from '@supabase/supabase-js';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

interface AuthContextType {
  session: Session | null;
  user: User | null;
  loading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  session: null,
  user: null,
  loading: true,
  signOut: async () => {},
});

export const useAuth = () => useContext(AuthContext);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Create demo user in both tables to ensure login works
    const createDemoUser = async () => {
      try {
        // First, ensure user exists in the custom users table
        const { data: existingUsers, error: checkError } = await supabase
          .from('users')
          .select('*')
          .eq('email', 'demo@drona.com')
          .maybeSingle();
          
        if (!existingUsers && !checkError) {
          // Insert into custom users table if doesn't exist
          const { error } = await supabase
            .from('users')
            .insert([
              { email: 'demo@drona.com', password: 'password123' }
            ]);
            
          if (error) {
            console.error('Error inserting demo user:', error);
          } else {
            console.log('Demo user created in users table');
          }
        }
        
        // Then try to sign in with demo credentials to check if user exists in auth
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email: 'demo@drona.com',
          password: 'password123',
        });
        
        // If login fails, create the user in auth
        if (signInError) {
          console.log('Creating demo user in auth');
          const { error: signUpError } = await supabase.auth.signUp({
            email: 'demo@drona.com',
            password: 'password123',
          });
          
          if (signUpError) {
            console.error('Error creating auth user:', signUpError);
          } else {
            console.log('Demo user created in auth');
          }
        }
      } catch (error) {
        console.error('Error in demo user creation:', error);
      }
    };

    createDemoUser();
    
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
        
        if (event === 'SIGNED_OUT') {
          navigate('/auth');
        } else if (event === 'SIGNED_IN') {
          navigate('/');
        }
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider value={{ session, user, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};
