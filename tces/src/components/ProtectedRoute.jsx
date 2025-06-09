// src/components/ProtectedRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, requireManagerAccess = false }) => {
  const user = JSON.parse(localStorage.getItem('user')); // get logged in user

  if (!user) {
    return <Navigate to="/" replace />;
  }

  if (requireManagerAccess && user.access !== 1) {
    return <Navigate to="/manager-dashboard/home" replace />;
  }

  return children;
};

export default ProtectedRoute;
