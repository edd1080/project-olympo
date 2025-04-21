
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { HardDrive, MapPin } from 'lucide-react';

interface DeviceInfoProps {
  deviceInfo: {
    ram: {
      total: string;
      used: string;
      free: string;
    };
    storage: {
      total: string;
      available: string;
    };
    gps: {
      status: string;
    };
    system: {
      os: string;
      model: string;
      name: string;
    };
  };
}

const DeviceInfo = ({ deviceInfo }: DeviceInfoProps) => {
  return (
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
  );
};

export default DeviceInfo;
