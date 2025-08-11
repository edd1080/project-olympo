import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { User, FileSpreadsheet, AlertCircle, Settings } from 'lucide-react';

const BottomNavigation = () => {
  const location = useLocation();
  const [activeTabIndex, setActiveTabIndex] = useState(0);
  
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

  useEffect(() => {
    const currentIndex = tabs.findIndex(tab => 
      isActive(tab.path, tab.exactMatch)
    );
    if (currentIndex !== -1) {
      setActiveTabIndex(currentIndex);
    }
  }, [location.pathname]);

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 flex justify-center pb-6 px-4">
      <div className="bg-background/80 backdrop-blur-md border border-border/20 rounded-full shadow-lg relative overflow-hidden">
        {/* Simple moving circle indicator */}
        <div 
          className="absolute inset-y-2 bg-primary rounded-full transition-all duration-300 ease-out shadow-sm"
          style={{
            width: 'calc(25% - 4px)',
            left: `calc(${activeTabIndex * 25}% + 2px)`,
          }}
        />
        
        <div className="flex items-center gap-1 px-2 py-2 relative z-10">
          {tabs.map((tab, index) => {
            const Icon = tab.icon;
            const active = isActive(tab.path, tab.exactMatch);
            
            return (
              <Link 
                key={tab.path}
                to={tab.path}
                className={`
                  flex flex-col items-center justify-center px-4 py-2 rounded-full 
                  transition-colors duration-300 ease-out
                  ${active 
                    ? 'text-primary-foreground' 
                    : 'text-muted-foreground hover:text-foreground'
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