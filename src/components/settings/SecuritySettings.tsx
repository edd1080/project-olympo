
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Shield } from 'lucide-react';

const SecuritySettings = () => {
  return (
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
  );
};

export default SecuritySettings;
