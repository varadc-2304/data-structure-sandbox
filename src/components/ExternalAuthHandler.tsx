import { useExternalIframeAuth } from '@/hooks/useExternalIframeAuth';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

export const ExternalAuthHandler = () => {
  const { state, statusMessage, isProcessing } = useExternalIframeAuth();

  if (state === 'not-external' || state === 'ready') {
    return null; // Let normal routing handle this
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="max-w-md w-full mx-auto p-6">
        <div className="text-center space-y-4">
          {isProcessing && (
            <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
          )}
          
          <h2 className="text-2xl font-semibold text-foreground">
            {state === 'checking-iframe' && 'Checking Access...'}
            {state === 'iframe-blocked' && 'Access Blocked'}
            {state === 'processing-auth' && 'Authenticating...'}
            {state === 'auth-success' && 'Success!'}
            {state === 'auth-failed' && 'Authentication Failed'}
          </h2>
          
          {statusMessage && (
            <p className="text-muted-foreground">{statusMessage}</p>
          )}

          {state === 'iframe-blocked' && (
            <div className="space-y-4">
              <p className="text-sm text-destructive">
                This application can only be accessed from authorized domains.
              </p>
              <Button 
                onClick={() => window.open('https://skilljourney.in', '_blank')}
                className="w-full"
              >
                Go to SkillJourney
              </Button>
            </div>
          )}

          {state === 'auth-failed' && (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                You will be redirected to the login page shortly.
              </p>
              <Button 
                onClick={() => window.location.href = '/login'}
                variant="outline"
                className="w-full"
              >
                Go to Login Now
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};