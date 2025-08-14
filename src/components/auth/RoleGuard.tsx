import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { UserRole } from '@/types/auth';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';

interface RoleGuardProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
  requiredPermissions?: string[];
  fallbackPath?: string;
  showAccessDenied?: boolean;
}

export const RoleGuard: React.FC<RoleGuardProps> = ({
  children,
  allowedRoles = [],
  requiredPermissions = [],
  fallbackPath = '/login',
  showAccessDenied = true,
}) => {
  const { isAuthenticated, user, hasRole, hasPermission, isLoading } = useAuth();
  const location = useLocation();

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated || !user) {
    return <Navigate to={fallbackPath} state={{ from: location }} replace />;
  }

  // Check role permissions
  const hasRequiredRole = allowedRoles.length === 0 || allowedRoles.some(role => hasRole(role));
  const hasRequiredPermissions = requiredPermissions.length === 0 || requiredPermissions.every(permission => hasPermission(permission));

  if (!hasRequiredRole || !hasRequiredPermissions) {
    if (showAccessDenied) {
      return (
        <div className="min-h-screen flex items-center justify-center p-4">
          <div className="max-w-md w-full">
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                No tienes permisos para acceder a esta página. 
                {user.role === 'agent' && (
                  <span className="block mt-2">
                    Esta funcionalidad está disponible solo para gerentes.
                  </span>
                )}
                {user.role === 'manager' && (
                  <span className="block mt-2">
                    Esta funcionalidad está disponible solo para agentes.
                  </span>
                )}
              </AlertDescription>
            </Alert>
          </div>
        </div>
      );
    }

    // Redirect based on user role
    const redirectPath = user.role === 'manager' ? '/manager' : '/';
    return <Navigate to={redirectPath} replace />;
  }

  return <>{children}</>;
};

// Specific guards for common use cases
export const ManagerOnlyGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <RoleGuard allowedRoles={['manager']}>{children}</RoleGuard>
);

export const AgentOnlyGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <RoleGuard allowedRoles={['agent']}>{children}</RoleGuard>
);