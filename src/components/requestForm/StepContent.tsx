
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
import FormTypeBanner from '../forms/FormTypeBanner';

const StepContent: React.FC = () => {
  const { activeStep, formData, updateFormData, showNonSalariedGuarantorForm } = useFormContext();

  // Si el formulario de fiador no asalariado está activo, mostrar ese en su lugar
  if (showNonSalariedGuarantorForm) {
    return (
      <>
        <FormTypeBanner type="guarantor" />
        <NonSalariedGuarantorForm />
      </>
    );
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
      <FormTypeBanner type="applicant" />
      {renderStepContent()}
    </div>
  );
};

export default StepContent;
