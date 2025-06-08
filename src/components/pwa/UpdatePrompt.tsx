
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Download, X } from 'lucide-react';

interface UpdatePromptProps {
  isVisible: boolean;
  onUpdate: () => void;
  onDismiss: () => void;
}

const UpdatePrompt: React.FC<UpdatePromptProps> = ({ isVisible, onUpdate, onDismiss }) => {
  if (!isVisible) return null;

  return (
    <div className="fixed top-4 left-4 right-4 z-50 animate-fade-in">
      <Card className="border-primary/20 shadow-lg">
        <CardContent className="p-4">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                <Download size={16} className="text-primary" />
              </div>
              <div>
                <p className="font-medium text-sm">Nueva versión disponible</p>
                <p className="text-xs text-muted-foreground">Toca para actualizar la aplicación</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button size="sm" onClick={onUpdate} className="h-8">
                Actualizar
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

export default UpdatePrompt;
