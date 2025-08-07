import React from 'react';
import { useFormContext } from '../RequestFormProvider';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const CreditDetailsNavigation: React.FC = () => {
  const { subStep, handleSubNext, handleSubPrevious } = useFormContext();

  const subFormTitles = [
    'Información del crédito',
    'Datos personales', 
    'Datos de contacto',
    'Información solicitante',
    'Información adicional'
  ];

  const canGoNext = subStep < subFormTitles.length - 1;
  const canGoPrevious = subStep > 0;

  return (
    <div className="space-y-4">
      {/* Progress indicator */}
      <div className="flex items-center justify-between">
        <h2 className="text-title">Detalles del Crédito</h2>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">
            Paso {subStep + 1} de {subFormTitles.length}
          </span>
        </div>
      </div>

      {/* Current form title */}
      <div className="border-b border-border pb-2">
        <h3 className="text-lg font-medium text-foreground">
          {subFormTitles[subStep]}
        </h3>
      </div>

      {/* Progress bar */}
      <div className="progress-indicator">
        <div 
          className="progress-bar" 
          style={{ width: `${((subStep + 1) / subFormTitles.length) * 100}%` }}
        />
      </div>

      {/* Navigation buttons */}
      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={handleSubPrevious}
          disabled={!canGoPrevious}
          className="flex items-center gap-2"
        >
          <ChevronLeft className="h-4 w-4" />
          Anterior
        </Button>

        <Button
          onClick={handleSubNext}
          disabled={!canGoNext}
          className="flex items-center gap-2"
        >
          Siguiente
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default CreditDetailsNavigation;