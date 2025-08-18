
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, ArrowLeft, Save, Check } from 'lucide-react';
import { useFormContext } from './RequestFormProvider';
import { ConfirmationModal } from '@/components/authorization/ConfirmationModal';

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
    handleSubPrevious,
    handleSubmit
  } = useFormContext();

  const [showConfirmModal, setShowConfirmModal] = useState(false);

  // Check if we're at the very first step
  const isFirstStep = activeStep === 0 && subStep === 0;
  
  // Check if we should show the next button
  const showNext = !(isLastStep && isLastSubStep);

  return (
    <div className="fixed bottom-0 left-0 right-0 p-4 bg-background/95 backdrop-blur-md border-t z-40">
      <div className="container max-w-5xl mx-auto">
        <div className="flex justify-between items-center">
          {/* Left: Anterior button */}
          <div className="flex-1">
            <Button 
              variant="outline" 
              onClick={handleSubPrevious}
              disabled={isFirstStep}
              className={isFirstStep ? "opacity-50 cursor-not-allowed" : ""}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Anterior
            </Button>
          </div>
          
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
                onClick={() => setShowConfirmModal(true)}
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
      
      {/* Confirmation Modal */}
      {showConfirmModal && (
        <ConfirmationModal
          title="Enviar solicitud"
          message="¿Confirmas que deseas enviar esta solicitud? Podrás revisarla en la lista de solicitudes."
          confirmText="Enviar"
          onConfirm={() => {
            setShowConfirmModal(false);
            handleSubmit();
          }}
          onCancel={() => setShowConfirmModal(false)}
        />
      )}
    </div>
  );
};

export default FormActionBar;
