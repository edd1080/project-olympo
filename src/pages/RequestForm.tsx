
import React from 'react';
import Header from '@/components/layout/Header';
import BottomNavigation from '@/components/layout/BottomNavigation';
import SectionHeader from '@/components/requestForm/SectionHeader';

// Refactored components
import RequestFormProvider, { useFormContext } from '@/components/requestForm/RequestFormProvider';
import StepContent from '@/components/requestForm/StepContent';
import NavigationHeader from '@/components/requestForm/NavigationHeader';
import ExitDialog from '@/components/requestForm/ExitDialog';
import FormActionBar from '@/components/requestForm/FormActionBar';
import { steps } from '@/components/requestForm/formSteps';

const RequestFormContent = () => {
  const { 
    personName, 
    activeStep, 
    sectionStatus,
    showExitDialog,
    setShowExitDialog,
    handleExit
  } = useFormContext();

  return (
    <div className="min-h-screen flex flex-col">
      <Header personName={personName?.split(' ')[0] || ''} />
      
      <main className="flex-1 container mx-auto px-4 py-0 pb-20 max-w-5xl">
        <NavigationHeader steps={steps} />
        
        {/* Section Header */}
        <SectionHeader 
          sectionId={steps[activeStep].id} 
          currentStep={activeStep + 1} 
          totalSteps={steps.length}
          status={sectionStatus[steps[activeStep].id]}
        />
        
        <StepContent />
        
        {/* Action Bar */}
        <FormActionBar
          steps={steps}
        />
      </main>
      
      <BottomNavigation />
      
      {/* Exit Dialog */}
      <ExitDialog 
        open={showExitDialog} 
        onOpenChange={setShowExitDialog}
        onExit={handleExit}
      />
    </div>
  );
};

const RequestForm = () => {
  return (
    <RequestFormProvider steps={steps}>
      <RequestFormContent />
    </RequestFormProvider>
  );
};

export default RequestForm;
