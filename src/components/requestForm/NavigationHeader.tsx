
import React from 'react';
import BreadcrumbNavigation from '@/components/navigation/BreadcrumbNavigation';
import StepNavigation from '@/components/requestForm/StepNavigation';
import { useFormContext } from './RequestFormProvider';

interface NavigationHeaderProps {
  steps: {
    id: string;
    title: string;
    icon: React.ReactNode;
  }[];
}

const NavigationHeader: React.FC<NavigationHeaderProps> = ({ steps }) => {
  const { activeStep, sectionStatus, handleChangeSection } = useFormContext();

  return (
    <>
      <div className="mb-3 mt-4">
        <BreadcrumbNavigation />
      </div>
      
      <div className="mb-6 mt-5">
        <StepNavigation 
          steps={steps} 
          activeStep={activeStep} 
          sectionStatus={sectionStatus}
          onChangeStep={handleChangeSection}
        />
      </div>
    </>
  );
};

export default NavigationHeader;
