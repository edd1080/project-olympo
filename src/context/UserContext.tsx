import React, { createContext, useContext, useState, ReactNode } from 'react';

export type UserRole = 'agent' | 'manager' | 'dev';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  permissions: string[];
}

interface UserContextType {
  user: User | null;
  role: UserRole | null;
  isAuthenticated: boolean;
  login: (credentials: { username: string; password: string }) => Promise<boolean>;
  loginAsAgent: () => void;
  loginAsManager: () => void;
  logout: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(
    !!localStorage.getItem('authToken')
  );

  const login = async (credentials: { username: string; password: string }): Promise<boolean> => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock authentication logic
    if (credentials.username === 'gerente' || credentials.username === 'manager') {
      const managerUser: User = {
        id: 'MGR_001',
        name: 'María González',
        email: 'maria.gonzalez@creditoproductivo.com',
        role: 'manager',
        permissions: ['view_investigations', 'authorize_credits', 'manage_agents']
      };
      setUser(managerUser);
      localStorage.setItem('authToken', 'manager-token-123');
      localStorage.setItem('userRole', 'manager');
      setIsAuthenticated(true);
      return true;
    } else if (credentials.username === 'agente' || credentials.username === 'agent') {
      const agentUser: User = {
        id: 'AGT_001',
        name: 'Carlos Morales',
        email: 'carlos.morales@creditoproductivo.com',
        role: 'agent',
        permissions: ['create_applications', 'field_investigation', 'client_contact']
      };
      setUser(agentUser);
      localStorage.setItem('authToken', 'agent-token-123');
      localStorage.setItem('userRole', 'agent');
      setIsAuthenticated(true);
      return true;
    }
    
    return false;
  };

  const loginAsAgent = () => {
    const agentUser: User = {
      id: 'DEV_AGT_001',
      name: 'Agente Dev',
      email: 'agente.dev@creditoproductivo.com',
      role: 'agent',
      permissions: ['create_applications', 'field_investigation', 'client_contact']
    };
    setUser(agentUser);
    localStorage.setItem('authToken', 'dev-agent-token');
    localStorage.setItem('userRole', 'agent');
    setIsAuthenticated(true);
  };

  const loginAsManager = () => {
    const managerUser: User = {
      id: 'DEV_MGR_001',
      name: 'Gerente Dev',
      email: 'gerente.dev@creditoproductivo.com',
      role: 'manager',
      permissions: ['view_investigations', 'authorize_credits', 'manage_agents']
    };
    setUser(managerUser);
    localStorage.setItem('authToken', 'dev-manager-token');
    localStorage.setItem('userRole', 'manager');
    setIsAuthenticated(true);
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('authToken');
    localStorage.removeItem('userRole');
  };

  // Initialize user from localStorage if available
  React.useEffect(() => {
    const token = localStorage.getItem('authToken');
    const role = localStorage.getItem('userRole') as UserRole;
    
    if (token && role) {
      if (role === 'manager') {
        const managerUser: User = {
          id: 'MGR_001',
          name: 'María González',
          email: 'maria.gonzalez@creditoproductivo.com',
          role: 'manager',
          permissions: ['view_investigations', 'authorize_credits', 'manage_agents']
        };
        setUser(managerUser);
      } else {
        const agentUser: User = {
          id: 'AGT_001',
          name: 'Carlos Morales',
          email: 'carlos.morales@creditoproductivo.com',
          role: 'agent',
          permissions: ['create_applications', 'field_investigation', 'client_contact']
        };
        setUser(agentUser);
      }
      setIsAuthenticated(true);
    }
  }, []);

  const value: UserContextType = {
    user,
    role: user?.role || null,
    isAuthenticated,
    login,
    loginAsAgent,
    loginAsManager,
    logout
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};