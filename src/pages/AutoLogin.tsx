
import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Card } from '@/components/ui/card';

const AutoLogin = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { setUser } = useAuth();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(true);

  useEffect(() => {
    const processAutoLogin = async () => {
      const token = searchParams.get('token');
      
      if (!token) {
        toast({
          variant: "destructive",
          title: "Invalid Login Link",
          description: "No token provided",
        });
        // Redirect to ikshvaku-innovations.in instead of auth page
        window.location.href = 'https://ikshvaku-innovations.in';
        return;
      }

      try {
        // Verify token and get user info
        const { data: tokenData, error: tokenError } = await supabase
          .from('auto_login_tokens')
          .select('user_id, expires_at, used')
          .eq('token', token)
          .single();

        if (tokenError || !tokenData) {
          toast({
            variant: "destructive",
            title: "Invalid Token",
            description: "The login token is invalid or has expired",
          });
          window.location.href = 'https://ikshvaku-innovations.in';
          return;
        }

        // Check if token is expired
        if (new Date() > new Date(tokenData.expires_at)) {
          toast({
            variant: "destructive",
            title: "Token Expired",
            description: "The login token has expired",
          });
          window.location.href = 'https://ikshvaku-innovations.in';
          return;
        }

        // Check if token is already used
        if (tokenData.used) {
          toast({
            variant: "destructive",
            title: "Token Already Used",
            description: "This login token has already been used",
          });
          window.location.href = 'https://ikshvaku-innovations.in';
          return;
        }

        // Get user details
        const { data: userData, error: userError } = await supabase
          .from('auth')
          .select('id, email')
          .eq('id', tokenData.user_id)
          .single();

        if (userError || !userData) {
          toast({
            variant: "destructive",
            title: "User Not Found",
            description: "The user associated with this token could not be found",
          });
          window.location.href = 'https://ikshvaku-innovations.in';
          return;
        }

        // Mark token as used
        await supabase
          .from('auto_login_tokens')
          .update({ used: true })
          .eq('token', token);

        // Set user in context (this will handle localStorage automatically)
        setUser({
          id: userData.id,
          email: userData.email
        });

        toast({
          title: "Login Successful",
          description: "You have been automatically logged in",
        });

        navigate('/', { replace: true });

      } catch (error) {
        console.error('Auto-login error:', error);
        toast({
          variant: "destructive",
          title: "Login Failed",
          description: "An error occurred during automatic login",
        });
        window.location.href = 'https://ikshvaku-innovations.in';
      } finally {
        setIsProcessing(false);
      }
    };

    processAutoLogin();
  }, [searchParams, navigate, setUser, toast]);

  if (isProcessing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="p-8 w-full max-w-md text-center">
          <div className="flex justify-center mb-4">
            <img 
              src="/lovable-uploads/6f3dd66f-503a-45c3-9ff8-6a169b14f030.png" 
              alt="Drona Logo" 
              className="w-16 h-16"
            />
          </div>
          <h1 className="text-2xl font-bold text-drona-green mb-4">Drona</h1>
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-drona-green mx-auto"></div>
          <p className="text-gray-500 mt-4">Processing automatic login...</p>
        </Card>
      </div>
    );
  }

  return null;
};

export default AutoLogin;
