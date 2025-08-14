import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Plus, X } from 'lucide-react';

interface InstallPromptProps {
  isVisible: boolean;
  onInstall: () => void;
  onDismiss: () => void;
}

const InstallPrompt: React.FC<InstallPromptProps> = ({ isVisible, onInstall, onDismiss }) => {
  if (!isVisible) return null;

  return (
    <div className="fixed bottom-20 left-4 right-4 z-50 animate-fade-in">
      <Card className="border-primary/20 shadow-lg bg-background/95 backdrop-blur">
        <CardContent className="p-4">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                <Plus size={16} className="text-primary" />
              </div>
              <div>
                <p className="font-medium text-sm">Instalar Créditos Productivos</p>
                <p className="text-xs text-muted-foreground">Agregar a pantalla de inicio</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button size="sm" onClick={onInstall} className="h-8">
                Instalar
              </Button>
              <Button size="sm" variant="ghost" onClick={onDismiss} className="h-8 w-8 p-0">
                <X size={14} />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default InstallPrompt;