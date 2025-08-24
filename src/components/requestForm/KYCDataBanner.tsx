import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface KYCDataBannerProps {
  onClose: () => void;
}

export const KYCDataBanner: React.FC<KYCDataBannerProps> = ({ onClose }) => {
  const [isVisible, setIsVisible] = useState(true);

  const handleClose = () => {
    setIsVisible(false);
    onClose();
  };

  if (!isVisible) return null;

  return (
    <div className="mb-6 p-4 bg-primary/10 rounded-lg border border-primary/20 relative">
      <Button
        variant="ghost"
        size="sm"
        onClick={handleClose}
        className="absolute top-2 right-2 h-6 w-6 p-0 hover:bg-primary/20"
      >
        <X className="h-4 w-4" />
      </Button>
      <div className="flex items-center gap-2 mb-2 pr-8">
        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
        <span className="text-sm font-medium">Datos prellenados desde verificación KYC</span>
      </div>
      <p className="text-sm text-muted-foreground pr-8">
        Los datos de identificación han sido prellenados automáticamente. 
        Revisa y completa la información faltante.
      </p>
    </div>
  );
};

export default KYCDataBanner;