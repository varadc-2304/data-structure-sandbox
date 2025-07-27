import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useIframe } from './useIframe';
import { supabase } from '@/lib/supabase';
import { externalAuthSchema } from '@/lib/validation';
import { toast } from 'sonner';

export type ExternalIframeAuthState = 
  | 'checking-iframe'
  | 'iframe-blocked' 
  | 'processing-auth'
  | 'auth-success'
  | 'auth-failed'
  | 'not-external'
  | 'ready';

export const useExternalIframeAuth = () => {
  const [state, setState] = useState<ExternalIframeAuthState>('checking-iframe');
  const [statusMessage, setStatusMessage] = useState('');
  const { isInIframe, isAllowedIframe } = useIframe();
  const { user, setUser } = useAuth();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const handleExternalIframeAuth = async () => {
      // Step 1: Check if we have an access token (external auth request)
      const accessToken = searchParams.get('access_token');
      
      if (!accessToken) {
        setState('not-external');
        return;
      }

      // Step 2: Wait for iframe detection to complete
      if (isInIframe === undefined) {
        setState('checking-iframe');
        setStatusMessage('Checking iframe context...');
        return;
      }

      // Step 3: Block if iframe is not allowed
      if (isInIframe && !isAllowedIframe) {
        setState('iframe-blocked');
        setStatusMessage('Access blocked - unauthorized iframe');
        toast.error('Access blocked from unauthorized domain');
        return;
      }

      // Step 4: Process external authentication
      setState('processing-auth');
      setStatusMessage('Authenticating...');

      try {
        // Validate token format
        const validationResult = externalAuthSchema.safeParse({ access_token: accessToken });
        if (!validationResult.success) {
          throw new Error('Invalid token format');
        }

        // Call external auth edge function
        const { data, error } = await supabase.functions.invoke('external-auth', {
          body: { encrypted_token: accessToken }
        });

        if (error) {
          throw new Error(error.message || 'Authentication failed');
        }

        if (!data?.success || !data?.user) {
          throw new Error('Invalid authentication response');
        }

        // Set user in context
        setUser({
          id: data.user.id,
          email: data.user.email
        });

        setState('auth-success');
        setStatusMessage('Authentication successful! Redirecting...');
        
        // Show success message
        if (data.isNewUser) {
          toast.success('Welcome! Your account has been created.');
        } else {
          toast.success('Welcome back!');
        }

        // Redirect to dashboard after short delay
        setTimeout(() => {
          navigate('/dashboard', { replace: true });
        }, 1500);

      } catch (error) {
        console.error('External auth error:', error);
        setState('auth-failed');
        setStatusMessage(error instanceof Error ? error.message : 'Authentication failed');
        toast.error('Authentication failed. Please try again.');
        
        // Redirect to login after delay
        setTimeout(() => {
          navigate('/login', { replace: true });
        }, 3000);
      }
    };

    handleExternalIframeAuth();
  }, [isInIframe, isAllowedIframe, searchParams, setUser, navigate]);

  // Mark as ready when not external auth and iframe check is complete
  useEffect(() => {
    if (state === 'not-external' && isInIframe !== undefined) {
      setState('ready');
    }
  }, [state, isInIframe]);

  return {
    state,
    statusMessage,
    isInIframe,
    isAllowedIframe,
    isProcessing: ['checking-iframe', 'processing-auth'].includes(state),
    isReady: state === 'ready' || state === 'auth-success'
  };
};