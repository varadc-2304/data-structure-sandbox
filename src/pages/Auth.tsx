
import React, { useEffect } from 'react';

const Auth = () => {
  useEffect(() => {
    // Redirect to ikshvaku-innovations.in when users try to access the login page
    window.location.href = 'https://ikshvaku-innovations.in';
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-drona-green mb-4">Drona</h1>
        <p className="text-gray-500">Redirecting to Ikshvaku Innovations...</p>
      </div>
    </div>
  );
};

export default Auth;
