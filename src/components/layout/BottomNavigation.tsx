import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { User, FileSpreadsheet, AlertCircle, Settings } from 'lucide-react';

const BottomNavigation = () => {
  const location = useLocation();
  
  const tabs = [
    { path: '/', icon: User, label: 'Inicio', exactMatch: true },
    { path: '/applications', icon: FileSpreadsheet, label: 'Solicitudes' },
    { path: '/alerts', icon: AlertCircle, label: 'Alertas' },
    { path: '/settings', icon: Settings, label: 'Ajustes' }
  ];
  
  const isActive = (path: string, exactMatch?: boolean): boolean => {
    if (exactMatch) {
      return location.pathname === path;
    }
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 flex justify-center pb-6 px-4">
      <div className="bg-background/80 backdrop-blur-md border border-border/20 rounded-full shadow-lg">
        <div className="flex items-center gap-1 px-2 py-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const active = isActive(tab.path, tab.exactMatch);
            
            return (
              <Link 
                key={tab.path}
                to={tab.path}
                className={`
                  flex flex-col items-center justify-center px-4 py-2 rounded-full 
                  ${active 
                    ? 'bg-primary text-primary-foreground' 
                    : 'text-muted-foreground'
                  }
                `}
              >
                <Icon className="h-5 w-5" />
                <span className="text-xs mt-0.5 font-medium">
                  {tab.label}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default BottomNavigation;