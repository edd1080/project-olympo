import React from 'react';
import { useFormContext } from './RequestFormProvider';
import BusinessFinancialForm from './BusinessFinancialForm';

interface BusinessFinancialSectionProps {
  formData: any;
  updateFormData: (field: string, value: any) => void;
}

const BusinessFinancialSection: React.FC<BusinessFinancialSectionProps> = ({ formData, updateFormData }) => {
  const { subStep } = useFormContext();

  const renderSubForm = () => {
    switch (subStep) {
      case 0:
        return <BusinessFinancialForm formData={formData} updateFormData={updateFormData} />;
      case 1:
        return <BusinessFinancialForm formData={formData} updateFormData={updateFormData} />;
      case 2:
        return <BusinessFinancialForm formData={formData} updateFormData={updateFormData} />;
      case 3:
        return <BusinessFinancialForm formData={formData} updateFormData={updateFormData} />;
      default:
        return <BusinessFinancialForm formData={formData} updateFormData={updateFormData} />;
    }
  };

  return (
    <div className="space-y-6">
      {renderSubForm()}
    </div>
  );
};

export default BusinessFinancialSection;