import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, X, User, Users, Edit, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

// Import the form context to access exit dialog functionality
import { useFormContext } from '@/components/requestForm/RequestFormProvider';
const applicationStatuses = {
  'pending': {
    label: 'Pendiente',
    color: 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200'
  },
  'reviewing': {
    label: 'En revisión',
    color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
  },
  'approved': {
    label: 'Aprobado',
    color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
  },
  'rejected': {
    label: 'Rechazado',
    color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
  }
};
const Header = ({
  personName,
  applicationStatus,
  applicationId
}: {
  personName?: string;
  applicationStatus?: string;
  applicationId?: string;
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

  // Check if we're on application details page
  const isApplicationDetailsPage = location.pathname.match(/^\/applications\/[^\/]+(?:\/edit)?$/);

  // Get page title based on current path
  const getPageTitle = () => {
    const isEditRoute = location.pathname.includes('/edit');

    // If we have an applicationId, show it (for application details pages)
    if (applicationId && isApplicationDetailsPage) {
      return applicationId;
    }
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
      case '/manager':
        return 'Inicio';
      case '/manager/invc':
        return 'INVC';
      case '/manager/authorizations':
        return 'Autorizar';
      case '/manager/settings':
        return 'Ajustes y Configuración';
      default:
        // Handle INVC routes
        if (location.pathname.includes('/manager/invc/') && location.pathname.includes('/comparison')) {
          const id = location.pathname.split('/')[3];
          return `INVC - Solicitud #${id}`;
        }
        if (location.pathname.includes('/manager/invc/') && location.pathname.includes('/review')) {
          return 'Revisión Final - INVC';
        }
        if (location.pathname.includes('/manager/invc/')) {
          const id = location.pathname.split('/')[3];
          return `INVC - Detalles #${id}`;
        }
        return 'Crédito Productivo';
    }
  };
  const handleGoBack = () => {
    // Special handling for authorization routes - show confirmation modal
    if (location.pathname.match(/^\/manager\/authorizations\/[^\/]+$/)) {
      // This will be handled by the parent component (AuthorizationDetails)
      // We'll emit a custom event to trigger the confirmation modal
      window.dispatchEvent(new CustomEvent('authorizationExit'));
      return;
    }

    // Special handling for INVC routes
    if (location.pathname.includes('/manager/invc/') && location.pathname.includes('/comparison')) {
      const id = location.pathname.split('/')[3];
      navigate(`/manager/invc/${id}`);
    } else if (location.pathname.includes('/manager/invc/') && location.pathname.includes('/review')) {
      const id = location.pathname.split('/')[3];
      navigate(`/manager/invc/${id}/comparison`);
    } else if (location.pathname.match(/^\/manager\/invc\/[^\/]+$/)) {
      navigate('/manager/invc');
    }
    // Special handling for edit routes
    else if (location.pathname.includes('/edit')) {
      // Extract application ID from path like "/applications/SCO_884214/edit"
      const pathParts = location.pathname.split('/');
      const appId = pathParts[2];
      if (appId) {
        navigate(`/applications/${appId}`);
      } else {
        navigate('/applications');
      }
    } else if (location.pathname.match(/^\/applications\/[^\/]+$/)) {
      // From application details to applications list
      navigate('/applications');
    } else {
      // Default back behavior
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
  const showBackButton = !['/', '/prospects', '/applications', '/alerts', '/settings', '/login', '/manager', '/manager/invc', '/manager/authorizations'].includes(location.pathname);

  // Show X button for authorization routes instead of back arrow
  const showExitButton = location.pathname.match(/^\/manager\/authorizations\/[^\/]+$/);
  const getStatusBadge = () => {
    if (!applicationStatus || !isApplicationDetailsPage) return null;
    const statusConfig = applicationStatuses[applicationStatus as keyof typeof applicationStatuses];
    if (!statusConfig) return null;
    return <Badge className={`text-xs px-2 py-1 ${statusConfig.color}`}>
        {statusConfig.label}
      </Badge>;
  };
  return <header className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="flex h-14 items-center px-4 relative">
        {/* Left button area */}
        <div className="flex items-center gap-3 flex-1">
          {showExitButton ? <Button variant="ghost" size="icon" className="rounded-full w-8 h-8" onClick={handleGoBack} aria-label="Cerrar">
              <X className="h-5 w-5" />
            </Button> : showBackButton}
          
          {/* Title */}
          <h1 className="text-lg font-bold text-primary">
            {getPageTitle()}
          </h1>
          {isGuarantorForm && <Users className="h-4 w-4 text-accent" />}
        </div>
        
        {/* Right area - Status badge for application details */}
        <div className="flex items-center gap-2">
          {getStatusBadge()}
          
          {/* Add button for applications page */}
          {location.pathname === '/applications' && <Button variant="ghost" size="icon" className="rounded-full w-8 h-8 bg-primary/10 hover:bg-primary/20 text-primary" onClick={() => navigate('/identity-verification')} aria-label="Nueva Solicitud">
              <Plus className="h-4 w-4" />
            </Button>}
          
          {location.pathname.includes('/edit') && <Button variant="ghost" size="icon" className="rounded-full w-8 h-8" onClick={handleExit} aria-label="Cerrar">
              <X className="h-5 w-5" />
            </Button>}
        </div>
      </div>
    </header>;
};
export default Header;