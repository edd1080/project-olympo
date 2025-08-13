import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Check, X, ArrowLeft, ArrowRight, Camera, MapPin } from 'lucide-react';

interface TutorialModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const TutorialModal: React.FC<TutorialModalProps> = ({ open, onOpenChange }) => {
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      title: "Bienvenido a INVC",
      description: "Te guiaremos por el proceso de investigación de campo para validar solicitudes de crédito.",
      content: (
        <div className="text-center py-4">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="h-8 w-8 text-primary" />
          </div>
          <p className="text-sm text-muted-foreground">
            Tu misión es validar la información proporcionada por el solicitante comparándola con la realidad en campo.
          </p>
        </div>
      )
    },
    {
      title: "Sistema de Deslizar (Swipe)",
      description: "Desliza las tarjetas para confirmar o marcar discrepancias.",
      content: (
        <div className="space-y-4">
          <Card className="border-success/50">
            <CardContent className="pt-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Deslizar a la derecha →</h4>
                  <p className="text-sm text-muted-foreground">Confirma que la información coincide</p>
                </div>
                <Badge className="bg-success/10 text-success border-success">
                  <Check className="h-3 w-3 mr-1" />
                  Confirmado
                </Badge>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-warning/50">
            <CardContent className="pt-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Deslizar a la izquierda ←</h4>
                  <p className="text-sm text-muted-foreground">Marca discrepancia y agrega comentario</p>
                </div>
                <Badge className="bg-warning/10 text-warning border-warning">
                  <X className="h-3 w-3 mr-1" />
                  No coincide
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      )
    },
    {
      title: "Chips de Estado",
      description: "Los chips del resumen cambian de color según el progreso:",
      content: (
        <div className="space-y-3">
          <div className="flex items-center gap-2 justify-between">
            <span className="text-sm">Geotag:</span>
            <div className="flex gap-1">
              <Badge variant="secondary"><MapPin className="h-3 w-3" /> Pendiente</Badge>
              <Badge className="bg-success/10 text-success border-success"><MapPin className="h-3 w-3" /> Válido</Badge>
              <Badge className="bg-error/10 text-error border-error"><MapPin className="h-3 w-3" /> Inválido</Badge>
            </div>
          </div>
          
          <div className="flex items-center gap-2 justify-between">
            <span className="text-sm">Fotos:</span>
            <div className="flex gap-1">
              <Badge variant="secondary"><Camera className="h-3 w-3" /> 0/2</Badge>
              <Badge className="bg-info/10 text-info border-info"><Camera className="h-3 w-3" /> 1/2</Badge>
              <Badge className="bg-success/10 text-success border-success"><Camera className="h-3 w-3" /> 2/2</Badge>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "¡Listo para empezar!",
      description: "Recuerda: La precisión es clave para una evaluación correcta.",
      content: (
        <div className="text-center py-4">
          <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="h-8 w-8 text-success" />
          </div>
          <div className="space-y-2 text-sm text-muted-foreground">
            <p>• Toma fotos claras con geotag activado</p>
            <p>• Sé específico en los comentarios de discrepancias</p>
            <p>• Puedes cerrar la investigación en cualquier momento</p>
          </div>
        </div>
      )
    }
  ];

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const finish = () => {
    localStorage.setItem('invc_tutorial_completed', 'true');
    onOpenChange(false);
    setCurrentStep(0);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{steps[currentStep].title}</DialogTitle>
          <DialogDescription>
            {steps[currentStep].description}
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          {steps[currentStep].content}
        </div>

        <div className="flex justify-center gap-1 mb-4">
          {steps.map((_, index) => (
            <div 
              key={index}
              className={`w-2 h-2 rounded-full transition-colors ${
                index === currentStep ? 'bg-primary' : 'bg-muted'
              }`}
            />
          ))}
        </div>

        <DialogFooter className="flex justify-between">
          <Button 
            variant="outline" 
            onClick={prevStep}
            disabled={currentStep === 0}
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Anterior
          </Button>
          
          {currentStep < steps.length - 1 ? (
            <Button onClick={nextStep}>
              Siguiente
              <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
          ) : (
            <Button onClick={finish} className="bg-success hover:bg-success/90">
              ¡Comenzar INVC!
              <Check className="h-4 w-4 ml-1" />
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TutorialModal;