
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { User, FileSpreadsheet, AlertCircle, Settings } from 'lucide-react';

const BottomNavigation = () => {
  const location = useLocation();
  
  const isActive = (path: string): boolean => {
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 flex justify-center pb-6 px-4">
      <div className="bg-background/80 backdrop-blur-md border border-border/20 rounded-full shadow-lg">
        <div className="flex items-center gap-1 px-2 py-2">
          <Link 
            to="/" 
            className={`
              flex flex-col items-center justify-center px-4 py-2 rounded-full transition-all duration-300 ease-out
              ${isActive('/') && location.pathname === '/' 
                ? 'bg-primary text-primary-foreground shadow-sm' 
                : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'
              }
            `}
          >
            <User className="h-5 w-5" />
            <span className="text-xs mt-0.5 font-medium">Inicio</span>
          </Link>

          <Link 
            to="/applications" 
            className={`
              flex flex-col items-center justify-center px-4 py-2 rounded-full transition-all duration-300 ease-out
              ${isActive('/applications') 
                ? 'bg-primary text-primary-foreground shadow-sm' 
                : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'
              }
            `}
          >
            <FileSpreadsheet className="h-5 w-5" />
            <span className="text-xs mt-0.5 font-medium">Solicitudes</span>
          </Link>

          <Link 
            to="/alerts" 
            className={`
              flex flex-col items-center justify-center px-4 py-2 rounded-full transition-all duration-300 ease-out
              ${isActive('/alerts') 
                ? 'bg-primary text-primary-foreground shadow-sm' 
                : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'
              }
            `}
          >
            <AlertCircle className="h-5 w-5" />
            <span className="text-xs mt-0.5 font-medium">Alertas</span>
          </Link>

          <Link 
            to="/settings" 
            className={`
              flex flex-col items-center justify-center px-4 py-2 rounded-full transition-all duration-300 ease-out
              ${isActive('/settings') 
                ? 'bg-primary text-primary-foreground shadow-sm' 
                : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'
              }
            `}
          >
            <Settings className="h-5 w-5" />
            <span className="text-xs mt-0.5 font-medium">Ajustes</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BottomNavigation;
