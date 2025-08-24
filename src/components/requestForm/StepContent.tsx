
import React from 'react';
import { useFormContext } from './RequestFormProvider';
import CreditDetailsSection from './CreditDetailsSection';
import CharacterAnalysis from './CharacterAnalysis';
import BusinessFinancialSection from './BusinessFinancialSection';
import FinancialInfoSection from './FinancialInfoSection';
import PhotoDocumentUpload from './PhotoDocumentUpload';
import SignatureClauseSection from './SignatureClauseSection';
import CreditEvaluation from './CreditEvaluation';
import FormTypeBanner from '../forms/FormTypeBanner';

const StepContent: React.FC = () => {
  const { activeStep, formData, updateFormData, isInGuarantorForm } = useFormContext();

  const renderStepContent = () => {
    // Show credit evaluation after step 3 if connected to internet
    if (activeStep === 4 && formData.showCreditEvaluation && !formData.creditEvaluationAccepted) {
      return <CreditEvaluation formData={formData} updateFormData={updateFormData} />;
    }

    switch (activeStep) {
      case 0:
        return <CreditDetailsSection formData={formData} updateFormData={updateFormData} />;
      case 1:
        return <CharacterAnalysis formData={formData} updateFormData={updateFormData} />;
      case 2:
        return <BusinessFinancialSection formData={formData} updateFormData={updateFormData} />;
      case 3:
        return <FinancialInfoSection formData={formData} updateFormData={updateFormData} />;
      case 4:
        return <PhotoDocumentUpload formData={formData} updateFormData={updateFormData} />;
      case 5:
        return <SignatureClauseSection formData={formData} updateFormData={updateFormData} />;
      /* Ocultar excepciones para formulario oficial
      case 'exceptions':
        return <ApplicationExceptions formData={formData} updateFormData={updateFormData} />;
      */
      default:
        return null;
    }
  };

  // For the new official form, we don't need guarantor banners as those are handled differently
  const getFormType = () => {
    return 'applicant';
  };

  return (
    <div className="mb-24">
      {renderStepContent()}
    </div>
  );
};

export default StepContent;
