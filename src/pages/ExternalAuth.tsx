import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

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
      
      console.log('External auth processing with access_token:', accessToken);
      setStatus('Decrypting token...');
      
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

      try {
        console.log('Calling external auth edge function...');
        
        // Call edge function to decrypt and validate the token
        const { data: authResult, error: authError } = await supabase.functions
          .invoke('external-auth', {
            body: { encrypted_token: accessToken }
          });

        console.log('External auth result:', { authResult, authError });

        if (authError || !authResult?.success) {
          console.log('External auth failed:', authError);
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
          email: user_data.email
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
          description: "An error occurred during external authentication",
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
            onClick={() => navigate('/login')} 
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