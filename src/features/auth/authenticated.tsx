import React from 'react';
import { isLogin } from '../../utils/session';
import { Navigate } from 'react-router-dom';

export const Authenticated = ({ children }: { children: React.ReactNode }) => {
  return isLogin() ? children : <Navigate to='/login' />;
};
