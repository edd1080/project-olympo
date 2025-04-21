
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Bell } from 'lucide-react';

const NotificationSettings = () => {
  return (
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
  );
};

export default NotificationSettings;
