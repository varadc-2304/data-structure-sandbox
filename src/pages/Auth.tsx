
import React, { useEffect } from 'react';

const Auth = () => {
  useEffect(() => {
    // Redirect to ikshvaku-innovations.in when users try to access the login page
    window.location.href = 'https://ikshvaku-innovations.in';
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="flex justify-center mb-4">
          <img 
            src="/lovable-uploads/6f3dd66f-503a-45c3-9ff8-6a169b14f030.png" 
            alt="Drona Logo" 
            className="w-16 h-16"
          />
        </div>
        <h1 className="text-2xl font-bold text-drona-green mb-4">Drona</h1>
        <p className="text-gray-500">Redirecting to Ikshvaku Innovations...</p>
      </div>
    </div>
  );
};

export default Auth;
