import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

interface Props {
  isAuthenticated: boolean;
}

const ProtectedRoute: React.FC<Props> = ({ isAuthenticated }) => {
  // Double-check localStorage as well
  const token = localStorage.getItem('token');
  
  return (isAuthenticated && token) ? <Outlet /> : <Navigate to="/" replace />;
};

export default ProtectedRoute;