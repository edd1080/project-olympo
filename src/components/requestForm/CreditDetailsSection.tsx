import React from 'react';
import { useFormContext } from './RequestFormProvider';
import CreditInfoForm from './creditDetails/CreditInfoForm';
import PersonalDataForm from './creditDetails/PersonalDataForm';
import ContactDataForm from './creditDetails/ContactDataForm';
import EducationFamilyForm from './creditDetails/EducationFamilyForm';
import AdditionalDataForm from './creditDetails/AdditionalDataForm';
import CreditDetailsNavigation from './creditDetails/CreditDetailsNavigation';

interface CreditDetailsSectionProps {
  formData: any;
  updateFormData: (field: string, value: any) => void;
}

const CreditDetailsSection: React.FC<CreditDetailsSectionProps> = ({ formData, updateFormData }) => {
  const { subStep } = useFormContext();

  const renderSubForm = () => {
    switch (subStep) {
      case 0:
        return <CreditInfoForm formData={formData} updateFormData={updateFormData} />;
      case 1:
        return <PersonalDataForm formData={formData} updateFormData={updateFormData} />;
      case 2:
        return <ContactDataForm formData={formData} updateFormData={updateFormData} />;
      case 3:
        return <EducationFamilyForm formData={formData} updateFormData={updateFormData} />;
      case 4:
        return <AdditionalDataForm formData={formData} updateFormData={updateFormData} />;
      default:
        return <CreditInfoForm formData={formData} updateFormData={updateFormData} />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Navigation indicator */}
      <CreditDetailsNavigation />
      
      {/* Current sub-form content */}
      <div className="space-y-6">
        {renderSubForm()}
      </div>
    </div>
  );
};

export default CreditDetailsSection;