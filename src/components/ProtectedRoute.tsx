
import React from 'react';
import { Outlet } from 'react-router-dom';

export const ProtectedRoute = () => {
  // No authentication required - render child routes directly
  return <Outlet />;
};
