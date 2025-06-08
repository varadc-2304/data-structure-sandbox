
import React, { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

export const ProtectedRoute = () => {
  const { user, loading } = useAuth();

  useEffect(() => {
    // If not loading and no user, redirect to ikshvaku-innovations.in
    if (!loading && !user) {
      window.location.href = 'https://ikshvaku-innovations.in';
    }
  }, [user, loading]);

  if (loading) {
    // You could render a loading spinner here
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-drona-green"></div>
      </div>
    );
  }

  // If not authenticated, show loading while redirect happens
  if (!user) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-drona-green mx-auto mb-4"></div>
          <p className="text-gray-500">Redirecting...</p>
        </div>
      </div>
    );
  }

  // If authenticated, render the child routes
  return <Outlet />;
};
