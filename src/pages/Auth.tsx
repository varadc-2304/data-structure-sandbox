
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent } from '@/components/ui/card';

const Auth = () => {
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState('Processing authentication...');
  const navigate = useNavigate();
  const { setUser } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        setStatus('Verifying authentication...');
        
        // Get the session from the URL hash (Supabase OAuth redirects use hash)
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Session error:', error);
          setStatus('Authentication failed');
          toast({
            variant: "destructive",
            title: "Authentication Failed",
            description: error.message || "Failed to authenticate with Google",
          });
          setLoading(false);
          setTimeout(() => {
            navigate('/', { replace: true });
          }, 2000);
          return;
        }

        if (!session || !session.user) {
          setStatus('No session found');
          toast({
            variant: "destructive",
            title: "Authentication Failed",
            description: "No valid session found",
          });
          setLoading(false);
          setTimeout(() => {
            navigate('/', { replace: true });
          }, 2000);
          return;
        }

        // Check if user exists in auth table, if not create them
        const { data: existingUser, error: checkError } = await supabase
          .from('auth')
          .select('id, email')
          .eq('email', session.user.email)
          .single();

        if (checkError && checkError.code === 'PGRST116') {
          // User doesn't exist, create new user
          setStatus('Creating your account...');
          
          const { data: newUser, error: createError } = await supabase
            .from('auth')
            .insert({
              id: session.user.id,
              email: session.user.email || '',
              name: session.user.user_metadata?.full_name || session.user.user_metadata?.name || session.user.email?.split('@')[0] || 'User',
              password: 'GOOGLE_OAUTH', // Placeholder for OAuth users
              created_at: new Date().toISOString(),
            })
            .select('id, email')
            .single();

          if (createError) {
            console.error('User creation error:', createError);
            setStatus('Failed to create account');
            toast({
              variant: "destructive",
              title: "Account Creation Failed",
              description: "Failed to create your account",
            });
            setLoading(false);
            setTimeout(() => {
              navigate('/', { replace: true });
            }, 2000);
            return;
          }

          // Set user in context
          const userName = session.user.user_metadata?.full_name || session.user.user_metadata?.name || session.user.email?.split('@')[0] || 'User';
          setUser({
            id: newUser.id,
            email: newUser.email,
            name: userName
          });

          setStatus('Account created successfully!');
          toast({
            title: "Welcome!",
            description: "Your account has been created successfully",
          });
        } else if (existingUser) {
          // User exists, set in context
          const userName = session.user.user_metadata?.full_name || session.user.user_metadata?.name || existingUser.email?.split('@')[0] || 'User';
          setUser({
            id: existingUser.id,
            email: existingUser.email,
            name: userName
          });

          setStatus('Login successful!');
          toast({
            title: "Login Successful",
            description: "Welcome back!",
          });
        } else {
          // Some other error
          console.error('Error checking user:', checkError);
          setStatus('Authentication error');
          toast({
            variant: "destructive",
            title: "Authentication Failed",
            description: "An error occurred during authentication",
          });
          setLoading(false);
          setTimeout(() => {
            navigate('/', { replace: true });
          }, 2000);
          return;
        }

        setStatus('Redirecting to dashboard...');
        
        // Small delay to show success message
        setTimeout(() => {
          navigate('/dashboard', { replace: true });
        }, 1000);

      } catch (error) {
        console.error('Auth callback error:', error);
        setStatus('An error occurred');
        toast({
          variant: "destructive",
          title: "Authentication Failed",
          description: "An unexpected error occurred",
        });
        setLoading(false);
        setTimeout(() => {
          navigate('/login', { replace: true });
        }, 2000);
      }
    };

    handleAuthCallback();
  }, [navigate, setUser, toast]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardContent className="p-8 text-center space-y-4">
          <div className="flex justify-center">
            <div className="h-12 w-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
          <h2 className="text-xl font-semibold text-foreground">
            {loading ? 'Authenticating...' : 'Authentication Complete'}
          </h2>
          <p className="text-sm text-muted-foreground">{status}</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;
