import React from 'react';
import { Navigate } from 'react-router-dom';
import { useIsAuthenticated } from '../../providers/auth';

export const Authenticated = ({
  children,
  fallback
}: {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}) => {
  return useIsAuthenticated() ? children : fallback ? fallback : <Navigate to='/login' />;
};
