
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, X, User, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';

// Import the form context to access exit dialog functionality
import { useFormContext } from '@/components/requestForm/RequestFormProvider';

const Header = ({
  personName
}: {
  personName?: string;
}) => {
  const location = useLocation();
  const navigate = useNavigate();

  // Try to get form context if available (only in request form routes)
  let formContext;
  try {
    formContext = useFormContext();
  } catch {
    // Not in a form context, continue with normal behavior
    formContext = null;
  }

  // Determine if we're in a guarantor form
  const isGuarantorForm = location.pathname.includes('/guarantors');

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
        return 'Coopsama App';
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
    // If we're in a form context (request form), use the form's exit handler
    if (formContext && location.pathname.includes('/edit')) {
      formContext.handleShowExitDialog();
    } else {
      // Default behavior for other routes
      if (location.pathname.includes('/edit')) {
        navigate('/applications');
      } else {
        navigate(-1);
      }
    }
  };

  // Show back button for application details and edit routes (but not main pages)
  const showBackButton = !['/', '/prospects', '/applications', '/alerts', '/settings', '/login'].includes(location.pathname);

  return <header className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="flex h-14 items-center px-4 relative">
        {/* Left button area */}
        <div className="flex items-center gap-3">
          {showBackButton && (
            <Button variant="ghost" size="icon" className="rounded-full w-8 h-8" onClick={handleGoBack} aria-label="Regresar">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          )}
          
          {/* Title */}
          <h1 className="text-lg font-bold text-primary">
            {getPageTitle()}
          </h1>
          {isGuarantorForm && <Users className="h-4 w-4 text-accent" />}
        </div>
        
        {/* Right button area */}
        <div className="absolute right-4">
          {location.pathname.includes('/edit') && <Button variant="ghost" size="icon" className="rounded-full w-8 h-8" onClick={handleExit} aria-label="Cerrar">
              <X className="h-5 w-5" />
            </Button>}
        </div>
      </div>
    </header>;
};

export default Header;
