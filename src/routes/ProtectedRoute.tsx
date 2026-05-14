import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAppSelector } from '../store/hooks';

interface ProtectedRouteProps {
  requiredRole?: 'student' | 'admin';
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ requiredRole }) => {
  const { user } = useAppSelector((state) => state.auth);

  if (!user) {
    return <Navigate to="/login" replace />;
  }
  if (requiredRole && user.role !== requiredRole) {
    console.warn(`Access denied: User is not an ${requiredRole}`);
    return <Navigate to="/courses" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;