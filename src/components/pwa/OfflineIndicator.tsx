import React from 'react';
import { WifiOff, Wifi } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface OfflineIndicatorProps {
  isOnline: boolean;
}

const OfflineIndicator: React.FC<OfflineIndicatorProps> = ({ isOnline }) => {
  if (isOnline) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-50">
      <Alert className="rounded-none border-x-0 border-t-0 bg-destructive/10 border-destructive/20">
        <WifiOff className="h-4 w-4" />
        <AlertDescription className="text-sm">
          Sin conexión a internet. Trabajando en modo offline.
        </AlertDescription>
      </Alert>
    </div>
  );
};

export default OfflineIndicator;