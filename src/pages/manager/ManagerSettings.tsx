import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/layout/Header';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ChevronRight, LogOut, User, HelpCircle, AlertTriangle, Download, Smartphone, Users, TrendingUp, Shield } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

import { useInstallPrompt } from '@/hooks/useInstallPrompt';
import { usePWA } from '@/hooks/usePWA';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';

const ManagerSettings = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const { canInstall, isInstalled, installApp } = useInstallPrompt();
  const { isOnline } = usePWA();

  useEffect(() => {
    const authToken = localStorage.getItem('authToken');
    if (!authToken) {
      navigate('/login');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    toast({
      title: "Sesión cerrada",
      description: "Has salido de tu cuenta"
    });
    navigate('/login');
    setShowLogoutDialog(false);
  };

  const handleLogoutClick = () => {
    setShowLogoutDialog(true);
  };

  const handleInstallApp = async () => {
    const success = await installApp();
    if (success) {
      toast({
        title: "¡Aplicación instalada!",
        description: "La aplicación se ha instalado correctamente en tu dispositivo"
      });
    } else {
      toast({
        title: "Error al instalar",
        description: "No se pudo instalar la aplicación. Inténtalo de nuevo.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 px-4 pb-20 my-[20px]">
        <div className="space-y-8">
          {/* Perfil Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <User className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-semibold">Perfil de Gerente</h2>
            </div>
            <p className="text-sm text-muted-foreground mb-6">Gestiona tu información personal y configuración de gerencia</p>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between py-4 cursor-pointer hover:bg-accent/50 rounded-md px-4" onClick={() => navigate('/manager/settings/personal-info')}>
                <div>
                  <p className="font-medium">Información personal</p>
                  <p className="text-sm text-muted-foreground">Datos profesionales y de contacto</p>
                </div>
                <ChevronRight className="h-5 w-5 text-muted-foreground" />
              </div>
              <div className="flex items-center justify-between py-4 rounded-md px-4 opacity-50 cursor-not-allowed">
                <div>
                  <p className="font-medium text-muted-foreground">Cambiar contraseña</p>
                  <p className="text-sm text-muted-foreground">No disponible en esta versión</p>
                </div>
                <ChevronRight className="h-5 w-5 text-muted-foreground" />
              </div>
            </div>
          </div>
          
          <Separator />
          
          {/* Dashboard Configuration */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-semibold">Dashboard</h2>
            </div>
            <p className="text-sm text-muted-foreground mb-6">Configura la vista de tu panel de control gerencial</p>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between py-4">
                <div>
                  <p className="font-medium">Alertas automáticas</p>
                  <p className="text-sm text-muted-foreground">Notificaciones de métricas críticas</p>
                </div>
                <div className="relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent bg-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                  <span className="pointer-events-none block h-5 w-5 rounded-full bg-background shadow-lg ring-0 transition-transform translate-x-5" />
                </div>
              </div>
              <div className="flex items-center justify-between py-4">
                <div>
                  <p className="font-medium">Resumen diario</p>
                  <p className="text-sm text-muted-foreground">Reporte automático al final del día</p>
                </div>
                <div className="relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent bg-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                  <span className="pointer-events-none block h-5 w-5 rounded-full bg-background shadow-lg ring-0 transition-transform translate-x-5" />
                </div>
              </div>
            </div>
          </div>
          
          <Separator />
          
          {/* Team Management */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <Users className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-semibold">Gestión de Equipo</h2>
            </div>
            <p className="text-sm text-muted-foreground mb-6">Configuración para la supervisión de agentes</p>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between py-4">
                <div>
                  <p className="font-medium">Supervisión automática</p>
                  <p className="text-sm text-muted-foreground">Monitoreo de actividad de agentes</p>
                </div>
                <div className="relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent bg-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                  <span className="pointer-events-none block h-5 w-5 rounded-full bg-background shadow-lg ring-0 transition-transform translate-x-5" />
                </div>
              </div>
              <div className="flex items-center justify-between py-4">
                <div>
                  <p className="font-medium">Reportes de desempeño</p>
                  <p className="text-sm text-muted-foreground">Evaluación semanal del equipo</p>
                </div>
                <div className="relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent bg-input transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                  <span className="pointer-events-none block h-5 w-5 rounded-full bg-background shadow-lg ring-0 transition-transform" />
                </div>
              </div>
            </div>
          </div>
          
          <Separator />

          {/* Security Settings */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <Shield className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-semibold">Seguridad</h2>
            </div>
            <p className="text-sm text-muted-foreground mb-6">Configuración de seguridad avanzada para gerentes</p>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between py-4">
                <div>
                  <p className="font-medium">Autenticación de dos factores</p>
                  <p className="text-sm text-muted-foreground">Seguridad adicional para operaciones críticas</p>
                </div>
                <div className="relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent bg-input transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                  <span className="pointer-events-none block h-5 w-5 rounded-full bg-background shadow-lg ring-0 transition-transform" />
                </div>
              </div>
              <div className="flex items-center justify-between py-4">
                <div>
                  <p className="font-medium">Registro de actividad</p>
                  <p className="text-sm text-muted-foreground">Auditoría de acciones de autorización</p>
                </div>
                <div className="relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent bg-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                  <span className="pointer-events-none block h-5 w-5 rounded-full bg-background shadow-lg ring-0 transition-transform translate-x-5" />
                </div>
              </div>
            </div>
          </div>
          
          <Separator />
          
          {/* Notification Settings */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <svg className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5-5-5h5v-5a7.5 7.5 0 1 0-15 0v5H5l5 5 5-5z" />
              </svg>
              <h2 className="text-lg font-semibold">Notificaciones</h2>
            </div>
            <p className="text-sm text-muted-foreground mb-6">Configura cómo quieres recibir notificaciones</p>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between py-4">
                <div>
                  <p className="font-medium">Notificaciones push</p>
                  <p className="text-sm text-muted-foreground">Recibe alertas en tu dispositivo</p>
                </div>
                <div className="relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent bg-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                  <span className="pointer-events-none block h-5 w-5 rounded-full bg-background shadow-lg ring-0 transition-transform translate-x-5" />
                </div>
              </div>
              <div className="flex items-center justify-between py-4">
                <div>
                  <p className="font-medium">Alertas críticas</p>
                  <p className="text-sm text-muted-foreground">Eventos que requieren atención inmediata</p>
                </div>
                <div className="relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent bg-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                  <span className="pointer-events-none block h-5 w-5 rounded-full bg-background shadow-lg ring-0 transition-transform translate-x-5" />
                </div>
              </div>
            </div>
          </div>
          
          <Separator />
          
          {/* App Preferences */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <svg className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
              <h2 className="text-lg font-semibold">Preferencias del app</h2>
            </div>
            <p className="text-sm text-muted-foreground mb-6">Personaliza tu experiencia en la aplicación</p>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between py-4">
                <div>
                  <p className="font-medium">Tema oscuro</p>
                  <p className="text-sm text-muted-foreground">Activa el modo oscuro</p>
                </div>
                <div className="relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent bg-input transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                  <span className="pointer-events-none block h-5 w-5 rounded-full bg-background shadow-lg ring-0 transition-transform" />
                </div>
              </div>
              <div className="flex items-center justify-between py-4">
                <div>
                  <p className="font-medium">Alta resolución</p>
                  <p className="text-sm text-muted-foreground">Mejora la calidad visual</p>
                </div>
                <div className="relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent bg-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                  <span className="pointer-events-none block h-5 w-5 rounded-full bg-background shadow-lg ring-0 transition-transform translate-x-5" />
                </div>
              </div>
            </div>
          </div>
          
          <Separator />

          {/* PWA Installation Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <Smartphone className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-semibold">Aplicación</h2>
            </div>
            <p className="text-sm text-muted-foreground mb-6">Instala la aplicación en tu dispositivo para un acceso más rápido</p>
            
            <div className="space-y-4">
              {isInstalled ? (
                <div className="flex items-center justify-between py-4 px-4 bg-green-50 dark:bg-green-950/20 rounded-md border border-green-200 dark:border-green-800">
                  <div>
                    <p className="font-medium text-green-700 dark:text-green-400">Aplicación instalada</p>
                    <p className="text-sm text-green-600 dark:text-green-500">La aplicación está instalada en tu dispositivo</p>
                  </div>
                  <div className="w-8 h-8 bg-green-100 dark:bg-green-900/50 rounded-full flex items-center justify-center">
                    <Download size={16} className="text-green-600 dark:text-green-400" />
                  </div>
                </div>
              ) : canInstall ? (
                <div className="flex items-center justify-between py-4 cursor-pointer hover:bg-accent/50 rounded-md px-4" onClick={handleInstallApp}>
                  <div>
                    <p className="font-medium">Instalar aplicación</p>
                    <p className="text-sm text-muted-foreground">Agregar a pantalla de inicio</p>
                  </div>
                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                    <Download size={16} className="text-primary" />
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between py-4 px-4 bg-muted/50 rounded-md">
                  <div>
                    <p className="font-medium text-muted-foreground">Instalación no disponible</p>
                    <p className="text-sm text-muted-foreground">Ya está instalada o no es compatible</p>
                  </div>
                  <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
                    <Download size={16} className="text-muted-foreground" />
                  </div>
                </div>
              )}
              
              <div className="flex items-center justify-between py-4 px-4 rounded-md">
                <div>
                  <p className="font-medium">Estado de conexión</p>
                  <p className="text-sm text-muted-foreground">
                    {isOnline ? 'Conectado a internet' : 'Sin conexión - modo offline'}
                  </p>
                </div>
                <div className={`w-3 h-3 rounded-full ${isOnline ? 'bg-green-500' : 'bg-red-500'}`} />
              </div>
            </div>
          </div>
          
          <Separator />
          
          {/* Help and Support */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <HelpCircle className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-semibold">Ayuda y soporte</h2>
            </div>
            <p className="text-sm text-muted-foreground mb-6">Encuentra ayuda y recursos para usar Crédito Productivo</p>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between py-4 cursor-pointer hover:bg-accent/50 rounded-md px-4" onClick={() => navigate('/manager/settings/report-problem')}>
                <div>
                  <p className="font-medium">Reportar problema</p>
                  <p className="text-sm text-muted-foreground">Informa sobre errores o fallos</p>
                </div>
                <ChevronRight className="h-5 w-5 text-muted-foreground" />
              </div>
            </div>
          </div>
          
          <Separator />
          
          <Button variant="destructive" className="w-full flex items-center justify-center gap-2" onClick={handleLogoutClick}>
            <LogOut className="h-5 w-5" />
            Cerrar sesión
          </Button>
        </div>
      </main>
      
      

      <AlertDialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
        <AlertDialogContent className="sm:max-w-[425px]">
          <AlertDialogHeader>
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              <AlertDialogTitle>Cerrar sesión</AlertDialogTitle>
            </div>
            <AlertDialogDescription>
              ¿Estás seguro que quieres cerrar sesión? Tendrás que iniciar sesión nuevamente para acceder a tu cuenta.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleLogout} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Cerrar sesión
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ManagerSettings;