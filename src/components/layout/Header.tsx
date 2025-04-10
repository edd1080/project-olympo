
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import ThemeToggle from '@/components/ui/ThemeToggle';
import { ArrowLeft, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Header = ({ personName }: { personName?: string }) => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Get page title based on current path
  const getPageTitle = () => {
    const isEditRoute = location.pathname.includes('/edit');
    
    if (personName && isEditRoute) {
      return personName;
    }
    
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

  const handleGoBack = () => {
    if (location.pathname.includes('/edit')) {
      navigate('/applications');
    } else {
      navigate(-1);
    }
  };

  const handleExit = () => {
    if (location.pathname.includes('/edit')) {
      navigate('/applications');
    } else {
      navigate(-1);
    }
  };

  return (
    <header className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="flex h-14 items-center justify-between px-4">
        <div className="flex items-center gap-2">
          {location.pathname.includes('/edit') && (
            <Button 
              variant="ghost" 
              size="icon"
              onClick={handleGoBack}
              className="rounded-full w-8 h-8"
              aria-label="Volver"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
          )}
          <h1 className="text-lg font-bold text-primary">{getPageTitle()}</h1>
        </div>
        <div className="flex items-center gap-2">
          {location.pathname.includes('/edit') && (
            <Button 
              variant="ghost" 
              size="icon"
              className="rounded-full w-8 h-8"
              onClick={handleExit}
              aria-label="Cerrar"
            >
              <X className="h-5 w-5" />
            </Button>
          )}
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
};

export default Header;
