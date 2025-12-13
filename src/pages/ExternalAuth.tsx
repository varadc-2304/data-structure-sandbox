import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { externalAuthSchema } from '@/lib/validation';

const ExternalAuth = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { setUser } = useAuth();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(true);
  const [status, setStatus] = useState('Processing external authentication...');

  useEffect(() => {
    const processExternalAuth = async () => {
      const accessToken = searchParams.get('access_token');
      
      console.log('External auth processing started');
      setStatus('Validating token...');
      
      if (!accessToken) {
        console.log('No access token provided');
        setStatus('Error: No access token provided');
        toast({
          variant: "destructive",
          title: "Invalid Access Token",
          description: "No access token provided",
        });
        setIsProcessing(false);
        return;
      }

      // Validate token format
      const tokenValidation = externalAuthSchema.safeParse({ encrypted_token: accessToken });
      if (!tokenValidation.success) {
        console.log('Invalid token format:', tokenValidation.error);
        setStatus('Error: Invalid token format');
        toast({
          variant: "destructive",
          title: "Invalid Token",
          description: "The provided token has an invalid format",
        });
        setIsProcessing(false);
        return;
      }

      // Additional security checks
      if (accessToken.length > 2048) {
        console.log('Token too long');
        setStatus('Error: Invalid token');
        toast({
          variant: "destructive",
          title: "Invalid Token",
          description: "The provided token is invalid",
        });
        setIsProcessing(false);
        return;
      }

      try {
        console.log('Calling external auth edge function...');
        setStatus('Verifying authentication...');
        
        // Call edge function to verify and validate the token
        const { data: authResult, error: authError } = await supabase.functions
          .invoke('external-auth', {
            body: { encrypted_token: accessToken }
          });

        console.log('External auth completed');

        if (authError) {
          console.log('External auth failed:', authError);
          setStatus('Error: Authentication failed');
          toast({
            variant: "destructive",
            title: "Authentication Failed",
            description: "The authentication service is currently unavailable",
          });
          setIsProcessing(false);
          return;
        }

        if (!authResult?.success) {
          console.log('Authentication rejected:', authResult?.error);
          setStatus('Error: Invalid or expired token');
          toast({
            variant: "destructive",
            title: "Authentication Failed",
            description: authResult?.error || "The external token is invalid or has expired",
          });
          setIsProcessing(false);
          return;
        }

        const { user_data, is_new_user } = authResult;
        
        // Validate user data
        if (!user_data?.id || !user_data?.email) {
          console.log('Invalid user data received');
          setStatus('Error: Invalid user data');
          toast({
            variant: "destructive",
            title: "Authentication Failed",
            description: "Invalid user data received from authentication service",
          });
          setIsProcessing(false);
          return;
        }

        if (is_new_user) {
          setStatus('Setting up new user account...');
          toast({
            title: "Welcome!",
            description: "Your account has been created successfully",
          });
        } else {
          setStatus('Logging in existing user...');
        }

        // Set user in context
        setUser({
          id: user_data.id,
          email: user_data.email,
          name: user_data.name || user_data.email?.split('@')[0] || 'User'
        });

        setStatus('Authentication successful! Redirecting...');
        console.log('Redirecting to dashboard...');
        
        // Small delay to show success message
        setTimeout(() => {
          navigate('/dashboard', { replace: true });
        }, 1000);

      } catch (error) {
        console.error('External auth error:', error);
        setStatus('Error: Authentication failed');
        toast({
          variant: "destructive",
          title: "Authentication Failed",
          description: "An unexpected error occurred during authentication",
        });
        setIsProcessing(false);
      }
    };

    processExternalAuth();
  }, [searchParams, navigate, setUser, toast]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center max-w-md mx-auto p-6">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-drona-green mx-auto mb-4"></div>
        <h2 className="text-xl font-semibold text-gray-800 mb-2">
          {isProcessing ? 'Authenticating...' : 'Authentication Complete'}
        </h2>
        <p className="text-gray-600">{status}</p>
        {!isProcessing && (
          <button 
            onClick={() => navigate('/')} 
            className="mt-4 px-4 py-2 bg-drona-green text-white rounded hover:bg-drona-dark transition-colors"
          >
            Go to Login
          </button>
        )}
      </div>
    </div>
  );
};

export default ExternalAuth;