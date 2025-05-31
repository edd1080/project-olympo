
import React from 'react';
import { useFormContext } from './RequestFormProvider';
import IdentificationContact from './IdentificationContact';
import AnalisisFinanciero from './AnalisisFinanciero';
import BusinessEconomicProfile from './BusinessEconomicProfile';
import GuarantorsSection from './GuarantorsSection';
import PhotoDocumentUpload from './PhotoDocumentUpload';
import ReviewSection from './ReviewSection';
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
        return <IdentificationContact formData={formData} updateFormData={updateFormData} />;
      case 1:
        return <AnalisisFinanciero formData={formData} updateFormData={updateFormData} />;
      case 2:
        return <BusinessEconomicProfile formData={formData} updateFormData={updateFormData} />;
      case 3:
        return <GuarantorsSection formData={formData} updateFormData={updateFormData} />;
      case 4:
        return <PhotoDocumentUpload formData={formData} updateFormData={updateFormData} />;
      case 5:
        return <ReviewSection formData={formData} updateFormData={updateFormData} />;
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
