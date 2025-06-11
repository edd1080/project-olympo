
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, Save, Check } from 'lucide-react';
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
    subStep,
    isLastStep,
    isLastSubStep,
    formData,
    handleSaveDraft,
    handleSubNext,
    handleSubmit
  } = useFormContext();

  const showNext = !(isLastStep && isLastSubStep);

  return (
    <div className="fixed bottom-16 left-0 right-0 p-4 bg-background/95 backdrop-blur-md border-t z-40">
      <div className="container max-w-5xl mx-auto">
        <div className="flex justify-between items-center">
          {/* Left: Empty space (removed back button) */}
          <div className="flex-1"></div>
          
          {/* Center: Save draft button (icon only) */}
          <div className="flex-1 flex justify-center">
            <Button 
              variant="outline" 
              onClick={handleSaveDraft}
              size="icon"
            >
              <Save className="h-4 w-4" />
            </Button>
          </div>

          {/* Right: Next/Submit button */}
          <div className="flex-1 flex justify-end">
            {isLastStep && isLastSubStep ? (
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
            ) : showNext ? (
              <Button onClick={handleSubNext}>
                Siguiente
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            ) : (
              <div></div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormActionBar;
