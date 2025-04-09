
import React from 'react';
import { useLocation } from 'react-router-dom';
import ThemeToggle from '@/components/ui/ThemeToggle';
import { Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Header = () => {
  const location = useLocation();
  
  // Get page title based on current path
  const getPageTitle = () => {
    switch (location.pathname) {
      case '/prospects':
        return 'Prospectos';
      case '/applications':
        return 'Solicitudes';
      case '/alerts':
        return 'Alertas';
      case '/settings':
        return 'Ajustes';
      case '/login':
        return 'Iniciar Sesión';
      default:
        return 'CreditFlow';
    }
  };

  return (
    <header className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="container flex h-16 items-center justify-between">
        <h1 className="text-xl font-bold text-primary">{getPageTitle()}</h1>
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="icon"
            className="rounded-full w-9 h-9"
            aria-label="Notifications"
          >
            <Bell className="h-5 w-5" />
          </Button>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
};

export default Header;
