import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Sparkles } from 'lucide-react';

interface FormTypeSelectionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelectType: (type: 'legacy' | 'oficial') => void;
}

const FormTypeSelectionModal: React.FC<FormTypeSelectionModalProps> = ({
  open,
  onOpenChange,
  onSelectType
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Seleccionar Tipo de Solicitud</DialogTitle>
          <DialogDescription>
            Elige el tipo de formulario que deseas utilizar para crear la nueva solicitud de crédito.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
          <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => onSelectType('legacy')}>
            <CardHeader className="text-center">
              <div className="mx-auto mb-2 h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                <FileText className="h-6 w-6 text-blue-600" />
              </div>
              <CardTitle className="text-lg">Legacy</CardTitle>
              <CardDescription>
                Formulario tradicional con el flujo actual
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Flujo existente</li>
                <li>• 6 secciones principales</li>
                <li>• Interfaz familiar</li>
                <li>• Completamente funcional</li>
              </ul>
              <Button className="w-full mt-4" variant="outline">
                Usar Legacy
              </Button>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => onSelectType('oficial')}>
            <CardHeader className="text-center">
              <div className="mx-auto mb-2 h-12 w-12 rounded-full bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
              <CardTitle className="text-lg">Oficial</CardTitle>
              <CardDescription>
                Nueva experiencia optimizada (En desarrollo)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Nuevo diseño moderno</li>
                <li>• Flujo optimizado</li>
                <li>• Verificación de identidad</li>
                <li>• 5 pasos estructurados</li>
              </ul>
              <Button className="w-full mt-4">
                Usar Oficial
              </Button>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FormTypeSelectionModal;