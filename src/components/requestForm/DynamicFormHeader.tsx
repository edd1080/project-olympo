import React, { useState } from 'react';
import { ChevronDown, CheckCircle } from 'lucide-react';
import { useFormContext } from './RequestFormProvider';
import { steps } from './formSteps';
import { stepsOficial } from './formStepsOficial';
const DynamicFormHeader: React.FC = () => {
  const {
    activeStep,
    handleChangeSection,
    sectionStatus,
    steps: contextSteps
  } = useFormContext();
  const [isExpanded, setIsExpanded] = useState(false);
  const currentStep = contextSteps[activeStep];
  const totalSteps = contextSteps.length;
  const currentStepNumber = activeStep + 1;
  const progress = currentStepNumber / totalSteps * 100;

  // Define step contexts for each section
  const getStepContext = (stepId: string) => {
    switch (stepId) {
      // Legacy application sections
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
      // Official application sections
      case 'credit-details':
        return 'Información del crédito';
      case 'character':
        return 'Evaluación de carácter';
      case 'business-financial':
        return 'Datos del negocio';
      case 'financial-info':
        return 'Información financiera';
      case 'signature':
        return 'Firma y cláusulas';
      default:
        return 'Información general';
    }
  };
  const handleSectionSelect = (index: number) => {
    handleChangeSection(index);
    setIsExpanded(false);
  };
  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };
  return <div className="sticky top-0 z-20 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="flex items-center">
        {/* Full width clickable title and step info */}
        <div className="w-full relative">
          <button onClick={toggleExpanded} className="flex items-center gap-2 text-left w-full group hover:bg-accent/50 rounded-lg p-2 -m-2 transition-colors">
            <div className="flex-1 min-w-0">
              <h1 className="text-xl md:text-2xl font-semibold text-foreground truncate transition-all duration-300">
                {currentStep.title}
              </h1>
              <p className="text-sm text-muted-foreground mt-1 transition-all duration-300">
                Paso {currentStepNumber} de {totalSteps} – {getStepContext(currentStep.id)}
              </p>
            </div>
            <ChevronDown size={20} className={`text-muted-foreground transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} />
          </button>

           {/* Dropdown menu */}
           {isExpanded && <div className="absolute top-full left-0 mt-2 w-full max-w-md bg-popover border rounded-lg shadow-lg z-30 py-2">
               {contextSteps.map((step, index) => {
            const isActive = activeStep === index;
            const isCompleted = sectionStatus[step.id] === 'complete';
            return <button key={step.id} onClick={() => handleSectionSelect(index)} className={`
                      w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-accent transition-colors
                      ${isActive ? 'bg-accent/50' : ''}
                    `}>
                    <div className={`
                      flex items-center justify-center w-6 h-6 rounded-full text-xs font-medium flex-shrink-0
                      ${isActive ? 'bg-primary text-primary-foreground' : ''} 
                      ${isCompleted && !isActive ? 'bg-green-600 text-white dark:bg-green-500' : ''}
                      ${!isActive && !isCompleted ? 'bg-muted border' : ''}
                    `}>
                      {isCompleted && !isActive ? <CheckCircle size={14} /> : index + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className={`font-medium text-sm truncate ${isActive ? 'text-primary' : ''} ${isCompleted && !isActive ? 'text-green-600 dark:text-green-400' : ''}`}>
                        {step.title}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {getStepContext(step.id)}
                      </div>
                    </div>
                  </button>;
          })}
            </div>}
        </div>
      </div>
      
      {/* Progress bar for mobile - linear indicator without percentage */}
      <div className="mt-3 md:hidden">
        <div className="w-full bg-muted/30 rounded-full h-1.5">
          <div className="bg-primary h-1.5 rounded-full transition-all duration-500 ease-out" style={{
          width: `${progress}%`
        }} />
        </div>
      </div>

      {/* Overlay to close dropdown when clicking outside */}
      {isExpanded && <div className="fixed inset-0 z-10" onClick={() => setIsExpanded(false)} />}
    </div>;
};
export default DynamicFormHeader;