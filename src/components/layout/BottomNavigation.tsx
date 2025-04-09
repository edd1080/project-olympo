
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, FileSpreadsheet, AlertCircle, Settings } from 'lucide-react';

const BottomNavigation = () => {
  const location = useLocation();
  
  const isActive = (path: string): boolean => {
    return location.pathname === path;
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-border z-50">
      <div className="flex justify-around items-center h-16">
        <Link 
          to="/" 
          className={`flex flex-col items-center justify-center w-1/4 py-1 ${isActive('/') ? 'text-primary' : 'text-muted-foreground'}`}
        >
          <Home className="h-6 w-6" />
          <span className="text-xs mt-1">Inicio</span>
        </Link>

        <Link 
          to="/prospects" 
          className={`flex flex-col items-center justify-center w-1/4 py-1 ${isActive('/prospects') ? 'text-primary' : 'text-muted-foreground'}`}
        >
          <Home className="h-6 w-6" />
          <span className="text-xs mt-1">Prospectos</span>
        </Link>

        <Link 
          to="/applications" 
          className={`flex flex-col items-center justify-center w-1/4 py-1 ${isActive('/applications') ? 'text-primary' : 'text-muted-foreground'}`}
        >
          <FileSpreadsheet className="h-6 w-6" />
          <span className="text-xs mt-1">Solicitudes</span>
        </Link>

        <Link 
          to="/alerts" 
          className={`flex flex-col items-center justify-center w-1/4 py-1 ${isActive('/alerts') ? 'text-primary' : 'text-muted-foreground'}`}
        >
          <AlertCircle className="h-6 w-6" />
          <span className="text-xs mt-1">Alertas</span>
        </Link>

        <Link 
          to="/settings" 
          className={`flex flex-col items-center justify-center w-1/4 py-1 ${isActive('/settings') ? 'text-primary' : 'text-muted-foreground'}`}
        >
          <Settings className="h-6 w-6" />
          <span className="text-xs mt-1">Ajustes</span>
        </Link>
      </div>
    </div>
  );
};

export default BottomNavigation;
