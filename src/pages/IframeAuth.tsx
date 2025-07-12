
import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

const IframeAuth = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { setUser } = useAuth();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(true);

  useEffect(() => {
    const processIframeAuth = async () => {
      const token = searchParams.get('token');
      
      console.log('Iframe auth processing with token:', token);
      
      if (!token) {
        console.log('No token provided');
        toast({
          variant: "destructive",
          title: "Invalid Iframe Token",
          description: "No token provided",
        });
        return;
      }

      try {
        console.log('Verifying iframe token...');
        
        // Verify token and get user info (same logic as AutoLogin)
        const { data: tokenData, error: tokenError } = await supabase
          .from('auto_login_tokens')
          .select('user_id, expires_at, used')
          .eq('token', token)
          .single();

        console.log('Token verification result:', { tokenData, tokenError });

        if (tokenError || !tokenData) {
          console.log('Token verification failed:', tokenError);
          toast({
            variant: "destructive",
            title: "Invalid Token",
            description: "The iframe token is invalid or has expired",
          });
          return;
        }

        // Check if token is expired
        if (new Date() > new Date(tokenData.expires_at)) {
          console.log('Token expired');
          toast({
            variant: "destructive",
            title: "Token Expired",
            description: "The iframe token has expired",
          });
          return;
        }

        // Check if token is already used
        if (tokenData.used) {
          console.log('Token already used');
          toast({
            variant: "destructive",
            title: "Token Already Used",
            description: "This iframe token has already been used",
          });
          return;
        }

        console.log('Getting user details for user_id:', tokenData.user_id);

        // Get user details
        const { data: userData, error: userError } = await supabase
          .from('auth')
          .select('id, email')
          .eq('id', tokenData.user_id)
          .single();

        console.log('User details result:', { userData, userError });

        if (userError || !userData) {
          console.log('User not found:', userError);
          toast({
            variant: "destructive",
            title: "User Not Found",
            description: "The user associated with this token could not be found",
          });
          return;
        }

        console.log('Marking token as used...');

        // Mark token as used
        const { error: updateError } = await supabase
          .from('auto_login_tokens')
          .update({ used: true })
          .eq('token', token);

        if (updateError) {
          console.log('Error marking token as used:', updateError);
        }

        console.log('Setting user in context...');

        // Set user in context
        setUser({
          id: userData.id,
          email: userData.email
        });

        console.log('Redirecting to home page...');
        navigate('/', { replace: true });

      } catch (error) {
        console.error('Iframe auth error:', error);
        toast({
          variant: "destructive",
          title: "Authentication Failed",
          description: "An error occurred during iframe authentication",
        });
      } finally {
        setIsProcessing(false);
      }
    };

    processIframeAuth();
  }, [searchParams, navigate, setUser, toast]);

  if (isProcessing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-drona-green mx-auto mb-4"></div>
          <p className="text-gray-500">Authenticating for iframe...</p>
        </div>
      </div>
    );
  }

  return null;
};

export default IframeAuth;
