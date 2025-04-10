
import React, { createContext, useContext, useState, ReactNode } from 'react';

// Define the shape of our form context
interface FormContextType {
  formData: Record<string, any>;
  updateFormData: (field: string, value: any) => void;
  sectionStatus: Record<string, 'pending' | 'complete'>;
  updateSectionStatus: (sectionId: string, status: 'pending' | 'complete') => void;
}

// Create the context
const FormContext = createContext<FormContextType | undefined>(undefined);

// Provider component
interface FormProviderProps {
  children: ReactNode;
  initialData?: Record<string, any>;
  initialStatus?: Record<string, 'pending' | 'complete'>;
}

export const FormProvider: React.FC<FormProviderProps> = ({ 
  children, 
  initialData = {},
  initialStatus = {} 
}) => {
  const [formData, setFormData] = useState<Record<string, any>>(initialData);
  const [sectionStatus, setSectionStatus] = useState<Record<string, 'pending' | 'complete'>>(initialStatus);

  const updateFormData = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const updateSectionStatus = (sectionId: string, status: 'pending' | 'complete') => {
    setSectionStatus(prev => ({ ...prev, [sectionId]: status }));
  };

  return (
    <FormContext.Provider value={{ formData, updateFormData, sectionStatus, updateSectionStatus }}>
      {children}
    </FormContext.Provider>
  );
};

// Custom hook for using the form context
export const useFormContext = () => {
  const context = useContext(FormContext);
  if (context === undefined) {
    throw new Error('useFormContext must be used within a FormProvider');
  }
  return context;
};
