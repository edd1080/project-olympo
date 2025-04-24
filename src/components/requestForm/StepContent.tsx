
import React from 'react';
import { useFormContext } from './RequestFormProvider';
import PersonalInfo from './PersonalInfo';
import CharacterAnalysis from './CharacterAnalysis';
import FinancialInfo from './FinancialInfo';
import PhotoDocumentUpload from './PhotoDocumentUpload';
import ConsentSection from './ConsentSection';
import SignatureSection from './SignatureSection';
import GuarantorsSection from './GuarantorsSection';
import NonSalariedGuarantorForm from './guarantorFlow/NonSalariedGuarantorForm';

const StepContent: React.FC = () => {
  const { activeStep, formData, updateFormData, showNonSalariedGuarantorForm } = useFormContext();

  // If the non-salaried guarantor form is active, show that instead of the regular steps
  if (showNonSalariedGuarantorForm) {
    return <NonSalariedGuarantorForm />;
  }

  const renderStepContent = () => {
    switch (activeStep) {
      case 0:
        return <PersonalInfo formData={formData} updateFormData={updateFormData} />;
      case 1:
        return <CharacterAnalysis formData={formData} updateFormData={updateFormData} />;
      case 2:
        return <FinancialInfo formData={formData} updateFormData={updateFormData} />;
      case 3:
        return <PhotoDocumentUpload formData={formData} updateFormData={updateFormData} />;
      case 4:
        return <ConsentSection formData={formData} updateFormData={updateFormData} />;
      case 5:
        return <SignatureSection formData={formData} updateFormData={updateFormData} />;
      case 6:
        return <GuarantorsSection formData={formData} updateFormData={updateFormData} />;
      default:
        return null;
    }
  };

  return (
    <div className="mb-24">
      {renderStepContent()}
    </div>
  );
};

export default StepContent;
