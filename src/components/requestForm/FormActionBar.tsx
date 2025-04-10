
import React from 'react';
import { Button } from '@/components/ui/button';
import { Menu, Save, Send, ArrowRight, AlertCircle } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";

interface Step {
  id: string;
  title: string;
  icon: React.ReactNode;
}

interface FormActionBarProps {
  steps: Step[];
  activeStep: number;
  isLastStep: boolean;
  formData: Record<string, any>;
  sectionStatus: Record<string, 'pending' | 'complete'>;
  onChangeSection: (index: number) => void;
  onNext: () => void;
  onSaveDraft: () => void;
  onSubmit: () => void;
}

const FormActionBar: React.FC<FormActionBarProps> = ({ 
  steps, 
  activeStep,
  isLastStep,
  formData,
  sectionStatus,
  onChangeSection,
  onNext,
  onSaveDraft,
  onSubmit
}) => {
  const consentComplete = formData.termsAccepted && formData.dataProcessingAccepted && formData.creditCheckAccepted;

  return (
    <div className="fixed bottom-16 sm:bottom-4 left-0 right-0 z-10">
      <div className="bg-background/80 backdrop-blur-lg border-t py-3 shadow-md">
        <div className="flex justify-between items-center gap-4 container max-w-5xl px-4 mx-auto">
          {/* Section selector dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="outline" 
                size="sm" 
                className="gap-1 font-medium text-sm"
                aria-label="Cambiar sección"
              >
                <Menu className="h-4 w-4" />
                Secciones
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-56 bg-background">
              {steps.map((step, index) => (
                <DropdownMenuItem 
                  key={step.id}
                  onClick={() => onChangeSection(index)} 
                  className={`gap-2 ${activeStep === index ? 'bg-accent text-accent-foreground' : ''}`}
                >
                  <div className={`
                    flex items-center justify-center w-6 h-6 rounded-full text-xs font-medium
                    ${sectionStatus[step.id] === 'complete' ? 'bg-green-600 text-white dark:bg-green-500' : 'bg-muted border'}
                  `}>
                    {sectionStatus[step.id] === 'complete' ? <CheckCircle size={14} /> : index + 1}
                  </div>
                  <span>{step.title}</span>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          
          <div className="flex gap-2">
            <Button
              variant="secondary"
              size="icon"
              onClick={onSaveDraft}
              className="transition-all hover:bg-secondary/80"
              aria-label="Guardar Borrador"
            >
              <Save className="h-4 w-4" />
            </Button>
            
            {isLastStep ? (
              <Button
                onClick={onSubmit}
                disabled={!consentComplete}
                className="transition-all hover:bg-primary/90"
              >
                <Send className="mr-2 h-4 w-4" />
                Enviar Solicitud
              </Button>
            ) : (
              <Button
                onClick={onNext}
                className="transition-all hover:translate-x-[2px]"
              >
                Siguiente
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
        
        {isLastStep && !consentComplete && (
          <div className="flex items-center gap-2 mt-4 p-2 rounded-md bg-destructive/10 text-destructive text-sm container max-w-5xl mx-auto px-4">
            <AlertCircle className="h-4 w-4" />
            <p>Debes aceptar los términos obligatorios para continuar</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FormActionBar;
