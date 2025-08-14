export type UserRole = 'agent' | 'manager';

export interface User {
  id: string;
  username: string;
  email?: string;
  role: UserRole;
  permissions: string[];
  agencyId?: string;
  fullName?: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface DevAccess {
  type: 'agent' | 'manager';
  token: string;
}

export const PERMISSIONS = {
  // Agent permissions
  AGENT_CREATE_APPLICATION: 'agent:create_application',
  AGENT_VIEW_APPLICATIONS: 'agent:view_applications',
  AGENT_EDIT_APPLICATION: 'agent:edit_application',
  
  // Manager permissions
  MANAGER_VIEW_INVC: 'manager:view_invc',
  MANAGER_CONDUCT_INVC: 'manager:conduct_invc',
  MANAGER_APPROVE_CREDIT: 'manager:approve_credit',
  MANAGER_REJECT_CREDIT: 'manager:reject_credit',
  MANAGER_VIEW_ALL_APPLICATIONS: 'manager:view_all_applications',
} as const;

export const ROLE_PERMISSIONS: Record<UserRole, string[]> = {
  agent: [
    PERMISSIONS.AGENT_CREATE_APPLICATION,
    PERMISSIONS.AGENT_VIEW_APPLICATIONS,
    PERMISSIONS.AGENT_EDIT_APPLICATION,
  ],
  manager: [
    PERMISSIONS.MANAGER_VIEW_INVC,
    PERMISSIONS.MANAGER_CONDUCT_INVC,
    PERMISSIONS.MANAGER_APPROVE_CREDIT,
    PERMISSIONS.MANAGER_REJECT_CREDIT,
    PERMISSIONS.MANAGER_VIEW_ALL_APPLICATIONS,
  ],
};