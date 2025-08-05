import React from 'react';
import { useLocation } from 'react-router-dom';
import Header from '@/components/layout/Header';
import BottomNavigation from '@/components/layout/BottomNavigation';
import BreadcrumbNavigation from '@/components/navigation/BreadcrumbNavigation';
import DynamicFormHeader from '@/components/requestForm/DynamicFormHeader';
import { getFirstNameAndLastName } from '@/lib/nameUtils';

// Refactored components
import RequestFormProvider, { useFormContext } from '@/components/requestForm/RequestFormProvider';
import StepContent from '@/components/requestForm/StepContent';
import ExitDialog from '@/components/requestForm/ExitDialog';
import FormActionBar from '@/components/requestForm/FormActionBar';
import { stepsOficial } from '@/components/requestForm/formStepsOficial';

const RequestFormOficialContent = () => {
  const location = useLocation();
  const kycData = location.state?.identityData;
  const applicationId = location.state?.applicationId;
  
  const { 
    personName,
    showExitDialog,
    setShowExitDialog,
    handleExit,
    hasUnsavedChanges
  } = useFormContext();

  return (
    <div className="min-h-screen flex flex-col">
      <Header personName={getFirstNameAndLastName(personName || kycData?.fullName)} />
      
      <main className="flex-1 container mx-auto px-4 py-0 pb-20 max-w-5xl">
        {/* Breadcrumb Navigation */}
        <div className="mb-3 mt-4">
          <BreadcrumbNavigation />
        </div>
        
        {/* Dynamic Form Header */}
        <DynamicFormHeader />
        
        {/* KYC Data Banner */}
        {kycData && (
          <div className="mb-6 p-4 bg-primary/10 rounded-lg border border-primary/20">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm font-medium">Datos prellenados desde verificación KYC</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Los datos de identificación han sido prellenados automáticamente. 
              Revisa y completa la información faltante.
            </p>
          </div>
        )}
        
        {/* Step Content */}
        <div className="mt-6">
          <StepContent />
        </div>
        
        {/* Action Bar */}
        <FormActionBar steps={stepsOficial} />
      </main>
      
      <BottomNavigation />
      
      {/* Exit Dialog */}
      <ExitDialog 
        open={showExitDialog} 
        onOpenChange={setShowExitDialog}
        onExit={handleExit}
        hasUnsavedChanges={hasUnsavedChanges}
      />
    </div>
  );
};

const RequestFormOficial = () => {
  const location = useLocation();
  const kycData = location.state?.identityData;
  
  return (
    <RequestFormProvider steps={stepsOficial} initialKYCData={kycData}>
      <RequestFormOficialContent />
    </RequestFormProvider>
  );
};

export default RequestFormOficial;