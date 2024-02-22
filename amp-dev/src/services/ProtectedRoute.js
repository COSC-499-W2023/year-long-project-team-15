import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    // User not authenticated, redirect to landing page
    return <Navigate to="/landing" />;
  }

  return children;
};
export default ProtectedRoute;