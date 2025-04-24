
import React from 'react';
import { 
  User, 
  Search, 
  DollarSign, 
  FileCheck, 
  CheckCircle 
} from 'lucide-react';

interface GuarantorWizardHeaderProps {
  currentStep: number;
  titles: string[];
  onStepChange: (step: number) => void;
}

const GuarantorWizardHeader: React.FC<GuarantorWizardHeaderProps> = ({ 
  currentStep, 
  titles,
  onStepChange
}) => {
  const stepIcons = [
    <User size={16} />,
    <Search size={16} />,
    <DollarSign size={16} />,
    <FileCheck size={16} />,
    <CheckCircle size={16} />
  ];
  
  return (
    <div className="mb-6">
      <h2 className="text-xl font-semibold mb-4 text-[#9b87f5]">Registro de Fiador No Asalariado</h2>
      
      <div className="w-full flex items-center">
        {titles.map((title, index) => (
          <React.Fragment key={index}>
            <button
              className={`relative flex flex-col items-center z-10 ${
                index <= currentStep ? 'cursor-pointer' : 'cursor-not-allowed opacity-70'
              }`}
              onClick={() => index <= currentStep && onStepChange(index)}
              disabled={index > currentStep}
              aria-label={`Ir al paso ${index + 1}: ${title}`}
            >
              <div className={`
                w-8 h-8 rounded-full flex items-center justify-center
                ${index < currentStep 
                  ? 'bg-[#9b87f5] text-white' 
                  : index === currentStep 
                    ? 'bg-[#9b87f5] text-white' 
                    : 'bg-muted border'
                }
              `}>
                {index < currentStep ? <CheckCircle size={16} /> : stepIcons[index]}
              </div>
              <span className="text-xs mt-1 hidden sm:block">{title}</span>
            </button>
            
            {index < titles.length - 1 && (
              <div className={`
                flex-1 h-1 mx-2
                ${index < currentStep ? 'bg-[#9b87f5]' : 'bg-muted'}
              `}></div>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default GuarantorWizardHeader;
