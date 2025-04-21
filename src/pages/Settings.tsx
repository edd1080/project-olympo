import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/layout/Header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { ChevronRight, LogOut, Bell, Shield, Moon, Smartphone, HelpCircle, User, HardDrive, Wifi, Battery, MapPin } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { useToast } from '@/hooks/use-toast';
import BottomNavigation from '@/components/layout/BottomNavigation';

const Settings = () => {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const { toast } = useToast();

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
      description: "Has salido de tu cuenta",
    });
    navigate('/login');
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 px-4 pb-20">
        <div className="space-y-0.5 py-6">
          <h2 className="text-2xl font-bold">Ajustes</h2>
          <p className="text-muted-foreground">Gestiona tu cuenta y preferencias</p>
        </div>
        
        <Separator className="my-6" />
        
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5 text-primary" />
                Perfil
              </CardTitle>
              <CardDescription>
                Gestiona tu información personal y preferencias
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between py-2">
                <div>
                  <p className="font-medium">Información personal</p>
                  <p className="text-sm text-muted-foreground">Nombre, correo, teléfono</p>
                </div>
                <ChevronRight className="h-5 w-5 text-muted-foreground" />
              </div>
              <div className="flex items-center justify-between py-2">
                <div>
                  <p className="font-medium">Cambiar contraseña</p>
                  <p className="text-sm text-muted-foreground">Actualiza tu contraseña</p>
                </div>
                <ChevronRight className="h-5 w-5 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <HardDrive className="h-5 w-5 text-primary" />
                Información Técnica
              </CardTitle>
              <CardDescription>
                Estado del dispositivo y sistema
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div>
                  <p className="font-medium mb-2">Memoria RAM</p>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Total</p>
                      <p className="font-medium">{deviceInfo.ram.total}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Usada</p>
                      <p className="font-medium">{deviceInfo.ram.used}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Libre</p>
                      <p className="font-medium">{deviceInfo.ram.free}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <p className="font-medium mb-2">Almacenamiento</p>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Total</p>
                      <p className="font-medium">{deviceInfo.storage.total}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Disponible</p>
                      <p className="font-medium">{deviceInfo.storage.available}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <p className="font-medium mb-2">GPS</p>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-primary" />
                    <span className="text-sm">
                      {deviceInfo.gps.status === 'online' ? 'Funcionando correctamente' : 'Desconectado'}
                    </span>
                    {deviceInfo.gps.status === 'online' && (
                      <div className="w-2 h-2 rounded-full bg-green-500" />
                    )}
                  </div>
                </div>

                <div>
                  <p className="font-medium mb-2">Sistema</p>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <p className="text-muted-foreground">Sistema Operativo</p>
                      <p>{deviceInfo.system.os}</p>
                    </div>
                    <div className="flex justify-between">
                      <p className="text-muted-foreground">Modelo</p>
                      <p>{deviceInfo.system.model}</p>
                    </div>
                    <div className="flex justify-between">
                      <p className="text-muted-foreground">Nombre del dispositivo</p>
                      <p>{deviceInfo.system.name}</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5 text-primary" />
                Notificaciones
              </CardTitle>
              <CardDescription>
                Configura cómo quieres recibir notificaciones
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between py-2">
                <div>
                  <p className="font-medium">Notificaciones push</p>
                  <p className="text-sm text-muted-foreground">Recibe alertas en tu dispositivo</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between py-2">
                <div>
                  <p className="font-medium">Correos electrónicos</p>
                  <p className="text-sm text-muted-foreground">Recibe actualizaciones por correo</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between py-2">
                <div>
                  <p className="font-medium">Alertas de sistema</p>
                  <p className="text-sm text-muted-foreground">Cambios de estado en solicitudes</p>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Smartphone className="h-5 w-5 text-primary" />
                Preferencias de aplicación
              </CardTitle>
              <CardDescription>
                Personaliza tu experiencia en la aplicación
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between py-2">
                <div>
                  <p className="font-medium">Tema oscuro</p>
                  <p className="text-sm text-muted-foreground">Activa el modo oscuro</p>
                </div>
                <Switch 
                  checked={theme === 'dark'} 
                  onCheckedChange={toggleTheme} 
                />
              </div>
              <div className="flex items-center justify-between py-2">
                <div>
                  <p className="font-medium">Alta resolución</p>
                  <p className="text-sm text-muted-foreground">Mejora la calidad visual</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between py-2">
                <div>
                  <p className="font-medium">Datos móviles</p>
                  <p className="text-sm text-muted-foreground">Sincroniza solo con WiFi</p>
                </div>
                <Switch />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                Seguridad
              </CardTitle>
              <CardDescription>
                Configura opciones de seguridad
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between py-2">
                <div>
                  <p className="font-medium">Autenticación de dos factores</p>
                  <p className="text-sm text-muted-foreground">Mayor protección para tu cuenta</p>
                </div>
                <Switch />
              </div>
              <div className="flex items-center justify-between py-2">
                <div>
                  <p className="font-medium">Bloqueo biométrico</p>
                  <p className="text-sm text-muted-foreground">Huella digital o Face ID</p>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <HelpCircle className="h-5 w-5 text-primary" />
                Ayuda y soporte
              </CardTitle>
              <CardDescription>
                Encuentra ayuda y recursos para usar CreditFlow
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between py-2">
                <div>
                  <p className="font-medium">Centro de ayuda</p>
                  <p className="text-sm text-muted-foreground">Preguntas frecuentes</p>
                </div>
                <ChevronRight className="h-5 w-5 text-muted-foreground" />
              </div>
              <div className="flex items-center justify-between py-2">
                <div>
                  <p className="font-medium">Contactar soporte</p>
                  <p className="text-sm text-muted-foreground">Obtén asistencia personalizada</p>
                </div>
                <ChevronRight className="h-5 w-5 text-muted-foreground" />
              </div>
              <div className="flex items-center justify-between py-2">
                <div>
                  <p className="font-medium">Reportar problema</p>
                  <p className="text-sm text-muted-foreground">Informa sobre errores o fallos</p>
                </div>
                <ChevronRight className="h-5 w-5 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
          
          <Button 
            variant="destructive" 
            className="w-full flex items-center justify-center gap-2"
            onClick={handleLogout}
          >
            <LogOut className="h-5 w-5" />
            Cerrar sesión
          </Button>
        </div>
      </main>
      
      <BottomNavigation />
    </div>
  );
};

export default Settings;
