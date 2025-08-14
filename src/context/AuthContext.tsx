import React, { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, AuthState, LoginCredentials, DevAccess, UserRole, ROLE_PERMISSIONS } from '@/types/auth';
import { useToast } from '@/hooks/use-toast';

interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>;
  devLogin: (access: DevAccess) => Promise<void>;
  logout: () => void;
  hasPermission: (permission: string) => boolean;
  hasRole: (role: UserRole) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: true,
  });

  const navigate = useNavigate();
  const { toast } = useToast();

  // Check for existing authentication on mount
  useEffect(() => {
    const initAuth = () => {
      const token = localStorage.getItem('authToken');
      const userStr = localStorage.getItem('user');
      
      if (token && userStr) {
        try {
          const user: User = JSON.parse(userStr);
          setAuthState({
            user,
            token,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error) {
          console.error('Error parsing stored user data:', error);
          localStorage.removeItem('authToken');
          localStorage.removeItem('user');
          setAuthState(prev => ({ ...prev, isLoading: false }));
        }
      } else {
        setAuthState(prev => ({ ...prev, isLoading: false }));
      }
    };

    initAuth();
  }, []);

  const login = async (credentials: LoginCredentials): Promise<void> => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true }));

      // Simulate API call - In real app, this would be an actual API request
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Mock user data based on credentials
      const mockUser: User = {
        id: '1',
        username: credentials.username,
        email: `${credentials.username}@creditoproductivo.com`,
        role: credentials.username.includes('gerente') ? 'manager' : 'agent',
        permissions: ROLE_PERMISSIONS[credentials.username.includes('gerente') ? 'manager' : 'agent'],
        agencyId: 'agency-1',
        fullName: credentials.username.includes('gerente') ? 'Gerente Principal' : 'Agente de Crédito',
      };

      const token = `auth-${Date.now()}-${mockUser.role}`;

      // Store in localStorage
      localStorage.setItem('authToken', token);
      localStorage.setItem('user', JSON.stringify(mockUser));

      setAuthState({
        user: mockUser,
        token,
        isAuthenticated: true,
        isLoading: false,
      });

      toast({
        title: "Inicio de sesión exitoso",
        description: `Bienvenido, ${mockUser.fullName}`,
      });

      // Navigate based on role
      navigate(mockUser.role === 'manager' ? '/manager' : '/');

    } catch (error) {
      setAuthState(prev => ({ ...prev, isLoading: false }));
      toast({
        title: "Error de autenticación",
        description: "Credenciales inválidas",
        variant: "destructive",
      });
      throw error;
    }
  };

  const devLogin = async (access: DevAccess): Promise<void> => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true }));

      const mockUser: User = {
        id: access.type === 'manager' ? 'manager-dev' : 'agent-dev',
        username: `dev-${access.type}`,
        email: `dev-${access.type}@creditoproductivo.com`,
        role: access.type,
        permissions: ROLE_PERMISSIONS[access.type],
        agencyId: 'dev-agency',
        fullName: access.type === 'manager' ? 'Gerente (Desarrollo)' : 'Agente (Desarrollo)',
      };

      // Store in localStorage
      localStorage.setItem('authToken', access.token);
      localStorage.setItem('user', JSON.stringify(mockUser));

      setAuthState({
        user: mockUser,
        token: access.token,
        isAuthenticated: true,
        isLoading: false,
      });

      toast({
        title: "Acceso de desarrollo",
        description: `Conectado como ${mockUser.fullName}`,
      });

      // Navigate based on role
      navigate(access.type === 'manager' ? '/manager' : '/');

    } catch (error) {
      setAuthState(prev => ({ ...prev, isLoading: false }));
      toast({
        title: "Error de acceso",
        description: "No se pudo acceder en modo desarrollo",
        variant: "destructive",
      });
    }
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    setAuthState({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
    });
    navigate('/login');
    toast({
      title: "Sesión cerrada",
      description: "Has cerrado sesión exitosamente",
    });
  };

  const hasPermission = (permission: string): boolean => {
    return authState.user?.permissions.includes(permission) ?? false;
  };

  const hasRole = (role: UserRole): boolean => {
    return authState.user?.role === role;
  };

  const value: AuthContextType = {
    ...authState,
    login,
    devLogin,
    logout,
    hasPermission,
    hasRole,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};