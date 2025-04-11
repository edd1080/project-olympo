
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight, Save, Check } from 'lucide-react';
import { useFormContext } from './RequestFormProvider';

interface FormActionBarProps {
  steps: {
    id: string;
    title: string;
    icon: React.ReactNode;
  }[];
}

const FormActionBar: React.FC<FormActionBarProps> = ({ steps }) => {
  const {
    activeStep,
    isLastStep,
    formData,
    sectionStatus,
    handleSaveDraft,
    handleNext,
    handleSubmit,
    handleChangeSection
  } = useFormContext();

  return (
    <div className="fixed bottom-16 left-0 right-0 p-4 bg-background/95 backdrop-blur-md border-t z-40">
      <div className="container max-w-5xl mx-auto">
        <div className="flex justify-between gap-3">
          {activeStep > 0 ? (
            <Button 
              variant="outline" 
              onClick={() => handleChangeSection(activeStep - 1)}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Anterior
            </Button>
          ) : (
            <div></div> {/* Empty div to maintain layout */}
          )}
          
          <Button 
            variant="outline" 
            onClick={handleSaveDraft}
          >
            <Save className="mr-2 h-4 w-4" />
            Guardar borrador
          </Button>

          {isLastStep ? (
            <Button 
              onClick={handleSubmit}
              disabled={
                !formData.termsAccepted || 
                !formData.dataProcessingAccepted || 
                !formData.creditCheckAccepted
              }
            >
              <Check className="mr-2 h-4 w-4" />
              Enviar solicitud
            </Button>
          ) : (
            <Button onClick={handleNext}>
              Siguiente
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default FormActionBar;
