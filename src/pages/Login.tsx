
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Shield, Lock } from 'lucide-react';
import { Chrome } from 'lucide-react';

const Login = () => {
  const [loading, setLoading] = useState(false);
  const { setUser } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      // Get the current origin for the redirect URL
      const redirectUrl = `${window.location.origin}/auth`;
      
      // Initiate Google OAuth flow
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: redirectUrl,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      });

      if (error) {
        console.error('Google OAuth error:', error);
        toast({
          variant: "destructive",
          title: "Login Failed",
          description: error.message || "Failed to initiate Google login",
        });
        setLoading(false);
      }
      // If successful, the user will be redirected to Google
      // and then back to /auth route
    } catch (error) {
      console.error('Login error:', error);
      toast({
        variant: "destructive",
        title: "Login Failed",
        description: "An error occurred during login",
      });
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md border">
        <CardHeader className="text-center space-y-6">
          <div className="flex justify-center">
            <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
              <img 
                src="/lovable-uploads/6f3dd66f-503a-45c3-9ff8-6a169b14f030.png" 
                alt="Drona Logo" 
                className="w-12 h-12"
              />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-foreground">
            Welcome to Drona
          </CardTitle>
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">
              Sign in to access interactive computer science visualizations
            </p>
            <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground pt-2">
              <div className="flex items-center gap-1">
                <Shield className="h-3 w-3 text-primary" />
                <span>Secure</span>
              </div>
              <div className="flex items-center gap-1">
                <Lock className="h-3 w-3 text-primary" />
                <span>Encrypted</span>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <Button 
              onClick={handleGoogleLogin}
              className="w-full h-12 text-base flex items-center justify-center gap-3"
              disabled={loading}
              variant="outline"
            >
              {loading ? (
                <>
                  <div className="h-4 w-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                  <span>Connecting...</span>
                </>
              ) : (
                <>
                  <Chrome className="h-5 w-5" />
                  <span>Continue with Google</span>
                </>
              )}
            </Button>
          </div>
          
          {/* Security Indicators */}
          <div className="mt-6 pt-6 border-t border-border">
            <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <Shield className="h-3.5 w-3.5 text-primary" />
                <span>Secure Login</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Lock className="h-3.5 w-3.5 text-primary" />
                <span>Encrypted</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
