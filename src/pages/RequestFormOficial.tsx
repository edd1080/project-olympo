import React from 'react';
import { useLocation } from 'react-router-dom';
import Header from '@/components/layout/Header';

import BreadcrumbNavigation from '@/components/navigation/BreadcrumbNavigation';
import DynamicFormHeader from '@/components/requestForm/DynamicFormHeader';
import { KYCDataBanner } from '@/components/requestForm/KYCDataBanner';
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
          <KYCDataBanner onClose={() => {/* Banner dismissed */}} />
        )}
        
        {/* Step Content */}
        <div className="mt-6">
          <StepContent />
        </div>
        
        {/* Action Bar */}
        <FormActionBar steps={stepsOficial} />
      </main>
      
      
      
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