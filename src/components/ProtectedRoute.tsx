
import React, { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

export const ProtectedRoute = () => {
  const { user, loading } = useAuth();
  const [redirectDelay, setRedirectDelay] = useState(false);

  useEffect(() => {
    // Give more time for authentication to load before redirecting
    if (!loading && !user) {
      const timer = setTimeout(() => {
        setRedirectDelay(true);
      }, 2000); // Wait 2 seconds before redirecting

      return () => clearTimeout(timer);
    }
  }, [user, loading]);

  useEffect(() => {
    // Only redirect after the delay and if still no user
    if (redirectDelay && !user && !loading) {
      console.log('Redirecting to ikshvaku-innovations.in - no authenticated user found');
      window.location.href = 'https://ikshvaku-innovations.in';
    }
  }, [redirectDelay, user, loading]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-drona-green"></div>
      </div>
    );
  }

  // If not authenticated and delay hasn't passed, show loading
  if (!user && !redirectDelay) {
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
    return <Outlet />;
  }

  // Show loading while redirect is happening
  return (
    <div className="flex justify-center items-center h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-drona-green mx-auto mb-4"></div>
        <p className="text-gray-500">Redirecting...</p>
      </div>
    </div>
  );
};
