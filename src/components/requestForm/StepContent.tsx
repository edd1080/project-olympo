
import React from 'react';
import { useFormContext } from './RequestFormProvider';
import CreditInfoSection from './CreditInfoSection';
import CharacterAnalysis from './CharacterAnalysis';
import BusinessFinancialSection from './BusinessFinancialSection';
import PhotoDocumentUpload from './PhotoDocumentUpload';
import SignatureClauseSection from './SignatureClauseSection';
import FormTypeBanner from '../forms/FormTypeBanner';

const StepContent: React.FC = () => {
  const { activeStep, formData, updateFormData, isInGuarantorForm } = useFormContext();

  const renderStepContent = () => {
    switch (activeStep) {
      case 0:
        return <CreditInfoSection formData={formData} updateFormData={updateFormData} />;
      case 1:
        return <CharacterAnalysis formData={formData} updateFormData={updateFormData} />;
      case 2:
        return <BusinessFinancialSection formData={formData} updateFormData={updateFormData} />;
      case 3:
        return <PhotoDocumentUpload formData={formData} updateFormData={updateFormData} />;
      case 4:
        return <SignatureClauseSection formData={formData} updateFormData={updateFormData} />;
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
