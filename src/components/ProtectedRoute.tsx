
import React, { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useExternalIframeAuth } from '@/hooks/useExternalIframeAuth';
import { Loader2 } from 'lucide-react';

export const ProtectedRoute = () => {
  const { user, loading } = useAuth();
  const { isInIframe, isReady } = useExternalIframeAuth();
  const [redirectDelay, setRedirectDelay] = useState(false);

  // Wait for external auth handler to complete
  if (!isReady) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin mx-auto" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  useEffect(() => {
    // Only redirect if not in iframe mode and no user
    if (!loading && !user && !isInIframe) {
      const timer = setTimeout(() => {
        setRedirectDelay(true);
      }, 2000); // Wait 2 seconds before redirecting

      return () => clearTimeout(timer);
    }
  }, [user, loading, isInIframe]);

  useEffect(() => {
    // Only redirect after the delay and if still no user and not in iframe
    if (redirectDelay && !user && !loading && !isInIframe) {
      window.location.href = 'https://ikshvaku-innovations.in';
    }
  }, [redirectDelay, user, loading, isInIframe]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin mx-auto" />
          <p className="text-muted-foreground">Checking authentication...</p>
        </div>
      </div>
    );
  }

  // If not authenticated and delay hasn't passed, show loading
  if (!user && !redirectDelay) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin mx-auto" />
          <p className="text-muted-foreground">Checking authentication...</p>
        </div>
      </div>
    );
  }

  // If authenticated, render the child routes
  if (user) {
    return <Outlet />;
  }

  // Show loading while redirect is happening (only if not in iframe)
  if (!isInIframe) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin mx-auto" />
          <p className="text-muted-foreground">Redirecting...</p>
        </div>
      </div>
    );
  }

  // If in iframe but no user, show a message
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="max-w-md w-full mx-auto p-6">
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-semibold text-foreground">Authentication Required</h2>
          <p className="text-muted-foreground">
            Please authenticate through the parent application to access this content.
          </p>
        </div>
      </div>
    </div>
  );
};
