
import React, { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useIframe } from '@/hooks/useIframe';

export const ProtectedRoute = () => {
  const { user, loading } = useAuth();
  const { isInIframe } = useIframe();
  const [redirectDelay, setRedirectDelay] = useState(false);

  console.log('ProtectedRoute - user:', user, 'loading:', loading, 'isInIframe:', isInIframe);

  useEffect(() => {
    console.log('ProtectedRoute useEffect - user:', user, 'loading:', loading);
    // Only redirect if not in iframe mode and no user
    if (!loading && !user && !isInIframe) {
      const timer = setTimeout(() => {
        console.log('Setting redirect delay to true');
        setRedirectDelay(true);
      }, 2000); // Wait 2 seconds before redirecting

      return () => clearTimeout(timer);
    }
  }, [user, loading, isInIframe]);

  useEffect(() => {
    // Only redirect after the delay and if still no user and not in iframe
    if (redirectDelay && !user && !loading && !isInIframe) {
      console.log('Redirecting to ikshvaku-innovations.in - no authenticated user found');
      window.location.href = 'https://ikshvaku-innovations.in';
    }
  }, [redirectDelay, user, loading, isInIframe]);

  if (loading) {
    console.log('ProtectedRoute - showing loading spinner');
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-drona-green"></div>
      </div>
    );
  }

  // If not authenticated and delay hasn't passed, show loading
  if (!user && !redirectDelay) {
    console.log('ProtectedRoute - showing authentication check');
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-drona-green mx-auto mb-4"></div>
          <p className="text-gray-500">Checking authentication...</p>
        </div>
      </div>
    );
  }

  // If authenticated, render the child routes
  if (user) {
    console.log('ProtectedRoute - user authenticated, rendering Outlet');
    return <Outlet />;
  }

  // Show loading while redirect is happening (only if not in iframe)
  if (!isInIframe) {
    console.log('ProtectedRoute - showing redirect loading');
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-drona-green mx-auto mb-4"></div>
          <p className="text-gray-500">Redirecting...</p>
        </div>
      </div>
    );
  }

  // If in iframe but no user, show a message
  return (
    <div className="flex justify-center items-center h-screen">
      <div className="text-center">
        <p className="text-gray-500">Please authenticate to access this application.</p>
      </div>
    </div>
  );
};
