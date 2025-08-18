
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@/context/ThemeContext';
import Header from '@/components/layout/Header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ChevronRight, LogOut, User, HelpCircle, AlertTriangle, Download, Smartphone, Bug, CreditCard } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import AppIssueSheet from '@/components/settings/AppIssueSheet';
import CreditIssueSheet from '@/components/settings/CreditIssueSheet';

import { useInstallPrompt } from '@/hooks/useInstallPrompt';
import { usePWA } from '@/hooks/usePWA';
// DeviceInfo commented out but preserved for future use
// import DeviceInfo from '@/components/settings/DeviceInfo';
import NotificationSettings from '@/components/settings/NotificationSettings';
import AppPreferences from '@/components/settings/AppPreferences';
// SecuritySettings commented out but preserved for future use
// import SecuritySettings from '@/components/settings/SecuritySettings';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';

const Settings = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { theme, toggleTheme } = useTheme();
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const [showAppIssueSheet, setShowAppIssueSheet] = useState(false);
  const [showCreditIssueSheet, setShowCreditIssueSheet] = useState(false);
  const { canInstall, isInstalled, installApp } = useInstallPrompt();
  const { isOnline } = usePWA();

  // DeviceInfo data commented out but preserved for future use
  /*
  const deviceInfo = {
    ram: {
      total: '4GB',
      used: '2.5GB',
      free: '1.5GB'
    },
    storage: {
      total: '64GB',
      available: '32.5GB'
    },
    gps: {
      status: 'online'
    },
    system: {
      os: 'Android 13',
      model: 'Pixel 6',
      name: 'Pixel-Device'
    }
  };
  */

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
              <h2 className="text-lg font-semibold">Perfil</h2>
            </div>
            <p className="text-sm text-muted-foreground mb-6">Gestiona tu información personal y preferencias</p>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between py-4 cursor-pointer hover:bg-accent/50 rounded-md px-4" onClick={() => navigate('/settings/personal-info')}>
                <div>
                  <p className="font-medium">Información personal</p>
                  <p className="text-sm text-muted-foreground">Nombre, correo, teléfono</p>
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
          
          {/* DeviceInfo component commented out but preserved for future use
           <DeviceInfo deviceInfo={deviceInfo} />
           */}
          
          {/* Notification Settings - Clean Version */}
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
                  <p className="font-medium">Alertas de sistema</p>
                  <p className="text-sm text-muted-foreground">Cambios de estado en solicitudes</p>
                </div>
                <div className="relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent bg-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                  <span className="pointer-events-none block h-5 w-5 rounded-full bg-background shadow-lg ring-0 transition-transform translate-x-5" />
                </div>
              </div>
            </div>
          </div>
          
          <Separator />
          
          {/* App Preferences - Clean Version */}
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
                <div 
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${
                    theme === 'dark' ? 'bg-primary' : 'bg-input'
                  }`}
                  onClick={toggleTheme}
                >
                  <span className={`pointer-events-none block h-5 w-5 rounded-full bg-background shadow-lg ring-0 transition-transform ${
                    theme === 'dark' ? 'translate-x-5' : 'translate-x-0'
                  }`} />
                </div>
              </div>
            </div>
          </div>
          
          <Separator />
          
          {/* SecuritySettings component commented out but preserved for future use
           <SecuritySettings />
           */}

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
          
          {/* Help and Support - Clean Version */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <HelpCircle className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-semibold">Ayuda y soporte</h2>
            </div>
            <p className="text-sm text-muted-foreground mb-6">Encuentra ayuda y recursos para usar Crédito Productivo</p>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between py-4 cursor-pointer hover:bg-accent/50 rounded-md px-4" onClick={() => setShowAppIssueSheet(true)}>
                <div className="flex items-center gap-3">
                  <Bug className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium">Reportar problema con la app</p>
                    <p className="text-sm text-muted-foreground">Reporta sobre errores o fallos en esta aplicación</p>
                  </div>
                </div>
                <ChevronRight className="h-5 w-5 text-muted-foreground" />
              </div>
              
              <div className="flex items-center justify-between py-4 cursor-pointer hover:bg-accent/50 rounded-md px-4" onClick={() => setShowCreditIssueSheet(true)}>
                <div className="flex items-center gap-3">
                  <CreditCard className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium">Reportar problema con solicitud de crédito</p>
                    <p className="text-sm text-muted-foreground">Recibe soporte para alguna solicitud de crédito en específico</p>
                  </div>
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

      <AppIssueSheet 
        isOpen={showAppIssueSheet} 
        onClose={() => setShowAppIssueSheet(false)} 
      />
      
      <CreditIssueSheet 
        isOpen={showCreditIssueSheet} 
        onClose={() => setShowCreditIssueSheet(false)} 
      />
    </div>
  );
};

export default Settings;
