
import React, { useEffect, useState } from 'react';
import { useFormContext, GuarantorData } from '../RequestFormProvider';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowLeft, Save, X, CheckCircle } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import GuarantorWizardHeader from './GuarantorWizardHeader';
import GuarantorSearch from './GuarantorSearch';
import GuarantorCharacter from './GuarantorCharacter';
import GuarantorFinancial from './GuarantorFinancial';
import GuarantorDocuments from './GuarantorDocuments';
import GuarantorConsent from './GuarantorConsent';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const NonSalariedGuarantorForm = () => {
  const {
    guarantorStep,
    setGuarantorStep,
    currentGuarantor,
    setCurrentGuarantor,
    saveGuarantor,
    cancelGuarantorForm
  } = useFormContext();
  
  const [showExitDialog, setShowExitDialog] = useState(false);
  const [isStepComplete, setIsStepComplete] = useState(false);
  
  // Track the completion status of each step
  const [stepsStatus, setStepsStatus] = useState({
    personal: false,
    character: false,
    financial: false,
    documents: false,
    consent: false
  });
  
  // Calculate the total progress
  const calculateProgress = () => {
    const steps = Object.values(stepsStatus);
    const completedSteps = steps.filter(Boolean).length;
    return (completedSteps / steps.length) * 100;
  };
  
  // Update the data for the current guarantor
  const updateGuarantorData = (field: keyof GuarantorData, value: any) => {
    if (currentGuarantor) {
      setCurrentGuarantor({
        ...currentGuarantor,
        [field]: value
      });
    }
  };
  
  // Handle step completion
  const setStepComplete = (step: keyof typeof stepsStatus, isComplete: boolean) => {
    setStepsStatus(prev => ({
      ...prev,
      [step]: isComplete
    }));
  };
  
  // Navigate to the next step
  const handleNext = () => {
    if (guarantorStep < 4) {
      setGuarantorStep(guarantorStep + 1);
    } else {
      // Final step, save the guarantor
      saveGuarantor();
    }
  };
  
  // Navigate to the previous step
  const handleBack = () => {
    if (guarantorStep > 0) {
      setGuarantorStep(guarantorStep - 1);
    }
  };
  
  // Mark step as complete
  useEffect(() => {
    switch (guarantorStep) {
      case 0:
        setIsStepComplete(!!stepsStatus.personal);
        break;
      case 1:
        setIsStepComplete(!!stepsStatus.character);
        break;
      case 2:
        setIsStepComplete(!!stepsStatus.financial);
        break;
      case 3:
        setIsStepComplete(!!stepsStatus.documents);
        break;
      case 4:
        setIsStepComplete(!!stepsStatus.consent);
        break;
      default:
        setIsStepComplete(false);
    }
  }, [guarantorStep, stepsStatus]);
  
  // Render the current step
  const renderStep = () => {
    switch (guarantorStep) {
      case 0:
        return (
          <GuarantorSearch 
            guarantor={currentGuarantor!} 
            updateGuarantorData={updateGuarantorData}
            setStepComplete={(isComplete) => setStepComplete('personal', isComplete)}
          />
        );
      case 1:
        return (
          <GuarantorCharacter
            guarantor={currentGuarantor!}
            updateGuarantorData={updateGuarantorData}
            setStepComplete={(isComplete) => setStepComplete('character', isComplete)}
          />
        );
      case 2:
        return (
          <GuarantorFinancial
            guarantor={currentGuarantor!}
            updateGuarantorData={updateGuarantorData}
            setStepComplete={(isComplete) => setStepComplete('financial', isComplete)}
          />
        );
      case 3:
        return (
          <GuarantorDocuments
            guarantor={currentGuarantor!}
            updateGuarantorData={updateGuarantorData}
            setStepComplete={(isComplete) => setStepComplete('documents', isComplete)}
          />
        );
      case 4:
        return (
          <GuarantorConsent
            guarantor={currentGuarantor!}
            updateGuarantorData={updateGuarantorData}
            setStepComplete={(isComplete) => setStepComplete('consent', isComplete)}
          />
        );
      default:
        return null;
    }
  };
  
  const stepTitles = [
    'Información Personal',
    'Análisis de Carácter',
    'Información Financiera',
    'Documentos',
    'Consentimiento'
  ];
  
  // Save progress when user navigates away
  const handleExit = () => {
    setShowExitDialog(false);
    
    // If there's any data filled in, save as draft
    if (currentGuarantor?.personalInfo?.firstName || 
        currentGuarantor?.personalInfo?.cui ||
        currentGuarantor?.businessInfo?.monthlySales) {
      saveGuarantor();
    } else {
      cancelGuarantorForm();
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => setShowExitDialog(true)}
        >
          <X className="h-4 w-4 mr-2" />
          Cancelar
        </Button>
        
        <Button 
          variant="outline" 
          size="sm" 
          onClick={saveGuarantor}
        >
          <Save className="h-4 w-4 mr-2" />
          Guardar borrador
        </Button>
      </div>
      
      <Card className="border-0 shadow-none">
        <GuarantorWizardHeader 
          currentStep={guarantorStep} 
          titles={stepTitles}
          onStepChange={setGuarantorStep}
        />
        
        <div className="px-1 py-2">
          <div className="flex justify-between text-sm mb-1">
            <span>Progreso</span>
            <span>{Math.round(calculateProgress())}%</span>
          </div>
          <Progress value={calculateProgress()} className="h-1.5" />
        </div>
        
        <div className="mt-6 mb-20">
          {renderStep()}
        </div>
      </Card>
      
      <div className="fixed bottom-16 left-0 right-0 p-4 bg-background/95 backdrop-blur-md border-t z-40">
        <div className="container max-w-5xl mx-auto">
          <div className="flex justify-between gap-3">
            <Button 
              variant="outline" 
              onClick={handleBack}
              disabled={guarantorStep === 0}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Anterior
            </Button>
            
            <Button 
              onClick={handleNext}
              disabled={!isStepComplete}
            >
              {guarantorStep === 4 ? (
                <>
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Finalizar
                </>
              ) : (
                'Siguiente'
              )}
            </Button>
          </div>
        </div>
      </div>
      
      <AlertDialog open={showExitDialog} onOpenChange={setShowExitDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Salir del formulario?</AlertDialogTitle>
            <AlertDialogDescription>
              ¿Deseas salir del formulario de fiador no asalariado? Los cambios no guardados se perderán.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleExit}>Salir</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default NonSalariedGuarantorForm;
