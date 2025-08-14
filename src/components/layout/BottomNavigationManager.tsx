import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, ClipboardList, CheckCircle, AlertCircle, Settings } from 'lucide-react';
import { useScrollDirection } from '@/hooks/useScrollDirection';
import { useIsMobile } from '@/hooks/use-mobile';

const BottomNavigationManager = () => {
  const location = useLocation();
  const { isVisible } = useScrollDirection();
  const isMobile = useIsMobile();
  
  const tabs = [
    { path: '/manager', icon: Home, label: 'Inicio', exactMatch: true },
    { path: '/manager/invc', icon: ClipboardList, label: 'INVC' },
    { path: '/manager/authorizations', icon: CheckCircle, label: 'Autorizar' },
    { path: '/manager/settings', icon: Settings, label: 'Ajustes' }
  ];
  
  const isActive = (path: string, exactMatch?: boolean): boolean => {
    if (exactMatch) {
      return location.pathname === path;
    }
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };

  return (
    <div className={`fixed bottom-1 left-0 right-0 z-50 flex justify-center pb-2 ${isMobile ? 'px-2' : 'px-4'} transition-transform duration-300 ${
      isVisible ? 'translate-y-0' : 'translate-y-full'
    }`}>
      <nav className={`flex items-center ${isMobile ? 'space-x-2' : 'space-x-2'} bg-background/10 backdrop-blur-md border border-border/30 rounded-2xl p-2 shadow-xl`}>
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const active = isActive(tab.path, tab.exactMatch);
          
          return (
            <Link 
              key={tab.path}
              to={tab.path}
              className={`
                flex ${isMobile ? 'flex-col items-center gap-0.5 px-2 py-2' : 'items-center gap-2 px-3 py-2'} rounded-xl font-medium tracking-tighter transition-all duration-300 hover:scale-105 active:scale-95
                ${active 
                  ? 'bg-primary/30 backdrop-blur-md text-primary shadow-lg' 
                  : 'text-muted-foreground hover:bg-primary/10'
                }
              `}
            >
              <Icon className="h-4 w-4" />
              <span className={isMobile ? 'text-xs' : 'text-sm'}>{tab.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
};

export default BottomNavigationManager;