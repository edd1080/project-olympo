
import React from 'react';
import { useFormContext } from './RequestFormProvider';
import CircularProgress from './CircularProgress';
import { steps } from './formSteps';

const DynamicFormHeader: React.FC = () => {
  const { activeStep } = useFormContext();
  
  const currentStep = steps[activeStep];
  const totalSteps = steps.length;
  const currentStepNumber = activeStep + 1;
  const progress = (currentStepNumber / totalSteps) * 100;

  // Define step contexts for each section
  const getStepContext = (stepId: string) => {
    switch (stepId) {
      case 'identification':
        return 'Datos básicos';
      case 'finances':
        return 'Información financiera';
      case 'business':
        return 'Perfil económico';
      case 'guarantors':
        return 'Fiadores y referencias';
      case 'documents':
        return 'Documentos y cierre';
      case 'review':
        return 'Revisión final';
      default:
        return 'Información general';
    }
  };

  return (
    <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b border-border/50 shadow-sm">
      <div className="container mx-auto px-4 py-4 max-w-5xl">
        <div className="flex items-center justify-between">
          {/* Left side: Title and step info */}
          <div className="flex-1 min-w-0">
            <h1 className="text-xl md:text-2xl font-semibold text-foreground truncate transition-all duration-300">
              {currentStep.title}
            </h1>
            <p className="text-sm text-muted-foreground mt-1 transition-all duration-300">
              Paso {currentStepNumber} de {totalSteps} – {getStepContext(currentStep.id)}
            </p>
          </div>
          
          {/* Right side: Circular progress */}
          <div className="flex-shrink-0 ml-4">
            <CircularProgress 
              progress={progress} 
              size={48} 
              strokeWidth={4}
            />
          </div>
        </div>
        
        {/* Progress bar for mobile - optional linear indicator */}
        <div className="mt-3 md:hidden">
          <div className="w-full bg-muted/30 rounded-full h-1.5">
            <div 
              className="bg-primary h-1.5 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DynamicFormHeader;
