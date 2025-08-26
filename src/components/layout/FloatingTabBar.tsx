import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, FileSpreadsheet, AlertCircle, Settings, ClipboardList, CheckCircle } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useScrollDirection } from '@/hooks/useScrollDirection';
import { useIsMobile } from '@/hooks/use-mobile';
import { isRoleBasedNavigationEnabled } from '@/utils/featureFlags';

const FloatingTabBar = () => {
  const { user, isAuthenticated } = useAuth();
  const location = useLocation();
  const { isVisible } = useScrollDirection();
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
    <div className={`fixed bottom-4 left-0 right-0 z-50 flex justify-center px-4 transition-all duration-300 ease-out ${
      isVisible ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'
    }`}>
      <nav className="flex items-center justify-center bg-background/80 backdrop-blur-xl border border-border/50 rounded-xl px-1.5 py-1.5 shadow-2xl shadow-black/10 dark:shadow-black/30 scale-[0.966]">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const active = isActive(tab.path, tab.exactMatch);
          
          return (
            <Link 
              key={tab.path}
              to={tab.path}
              className={`
                relative flex flex-col items-center justify-center min-w-0 px-3 py-1.5 mx-0.5 rounded-lg font-medium text-xs
                transition-all duration-300 ease-out transform-gpu
                hover:scale-105 active:scale-95
                ${active 
                  ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/25 scale-105' 
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                }
              `}
            >
              {/* Icon */}
              <Icon className={`h-4 w-4 mb-0.5 transition-transform duration-200 ${
                active ? 'scale-110' : ''
              }`} />
              
              {/* Label */}
              <span className={`font-medium tracking-tight transition-all duration-200 text-[10px] ${
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

export default FloatingTabBar;