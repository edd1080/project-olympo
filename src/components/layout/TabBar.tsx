import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, FileSpreadsheet, AlertCircle, Settings, ClipboardList, CheckCircle } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useIsMobile } from '@/hooks/use-mobile';
import { isRoleBasedNavigationEnabled } from '@/utils/featureFlags';

const TabBar = () => {
  const { user, isAuthenticated } = useAuth();
  const location = useLocation();
  const isMobile = useIsMobile();

  // Helper function to check if we should hide the tab bar for request forms and KYC
  const shouldHideForRequestForms = () => {
    const pathname = location.pathname;
    
    // Hide completely on all credit request form routes and related flows
    const formRoutes = [
      /^\/request-form$/,
      /^\/request-form-oficial$/,
      /^\/applications\/[^/]+\/edit$/,
      /^\/applications\/[^/]+\/guarantor/,
      /^\/identity-verification$/,
      /^\/kyc/,
      /^\/prequalifications$/,
      /^\/personal-info$/,
      /^\/guarantor-financial-form$/,
      // Hide during any form filling process
      /\/form$/,
      /\/edit$/,
      /\/guarantor/,
      /\/request/,
      /\/solicitud/,
    ];
    
    return formRoutes.some(route => route.test(pathname));
  };

  // Don't show on login page or request form routes - COMPLETELY HIDDEN
  if (location.pathname === '/login' || shouldHideForRequestForms()) {
    return null;
  }

  // Manager tabs if user is manager and feature is enabled
  const managerTabs = [
    { path: '/manager', icon: Home, label: 'Inicio', exactMatch: true },
    { path: '/manager/invc', icon: ClipboardList, label: 'INVC' },
    { path: '/manager/authorizations', icon: CheckCircle, label: 'Autorizar' },
    { path: '/manager/settings', icon: Settings, label: 'Ajustes' }
  ];

  // Regular user tabs
  const userTabs = [
    { path: '/', icon: Home, label: 'Inicio', exactMatch: true },
    { path: '/applications', icon: FileSpreadsheet, label: 'Solicitudes' },
    { path: '/alerts', icon: AlertCircle, label: 'Alertas' },
    { path: '/settings', icon: Settings, label: 'Ajustes' }
  ];

  // Determine which tabs to use
  const tabs = isAuthenticated && user?.role === 'manager' && isRoleBasedNavigationEnabled() 
    ? managerTabs 
    : userTabs;
  
  const isActive = (path: string, exactMatch?: boolean): boolean => {
    if (exactMatch) {
      return location.pathname === path;
    }
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t border-border">
      <nav className="flex items-center justify-around py-2 px-4 safe-area-inset-bottom">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const active = isActive(tab.path, tab.exactMatch);
          
          return (
            <Link 
              key={tab.path}
              to={tab.path}
              className={`
                flex flex-col items-center justify-center min-w-0 py-2 px-3 rounded-lg
                transition-all duration-200 ease-out
                ${active 
                  ? 'text-primary' 
                  : 'text-muted-foreground hover:text-foreground'
                }
              `}
            >
              {/* Icon */}
              <Icon className={`h-5 w-5 mb-1 transition-all duration-200 ${
                active ? 'scale-110' : ''
              }`} />
              
              {/* Label */}
              <span className={`text-xs font-medium tracking-tight transition-all duration-200 ${
                active ? 'font-semibold' : ''
              }`}>
                {tab.label}
              </span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
};

export default TabBar;