import React from 'react';
import { Navigate } from 'react-router-dom';
import { useUser, UserRole } from '@/context/UserContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: UserRole;
  redirectTo?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requiredRole,
  redirectTo = '/login' 
}) => {
  const { isAuthenticated, role } = useUser();

  if (!isAuthenticated) {
    return <Navigate to={redirectTo} replace />;
  }

  if (requiredRole && role !== requiredRole) {
    // Redirect to appropriate dashboard based on user role
    const dashboardPath = role === 'manager' ? '/manager/invc' : '/';
    return <Navigate to={dashboardPath} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;