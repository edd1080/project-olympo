
import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";

// Generate a random 6-digit number for application IDs
const generateRandomId = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

interface FormContextType {
  activeStep: number;
  setActiveStep: React.Dispatch<React.SetStateAction<number>>;
  formData: Record<string, any>;
  updateFormData: (field: string, value: any) => void;
  personName: string;
  sectionStatus: Record<string, 'pending' | 'complete'>;
  setSectionStatus: React.Dispatch<React.SetStateAction<Record<string, 'pending' | 'complete'>>>;
  handleNext: () => void;
  handleChangeSection: (index: number) => void;
  handleSaveDraft: () => void;
  handleSubmit: () => void;
  handleShowExitDialog: () => void;
  isLastStep: boolean;
  showExitDialog: boolean;
  setShowExitDialog: React.Dispatch<React.SetStateAction<boolean>>;
  handleExit: (save: boolean) => void;
  hasFatca: boolean;
  setHasFatca: React.Dispatch<React.SetStateAction<boolean>>;
  isPep: boolean;
  setIsPep: React.Dispatch<React.SetStateAction<boolean>>;
  agentComments: string;
  setAgentComments: React.Dispatch<React.SetStateAction<string>>;
}

export const FormContext = createContext<FormContextType | undefined>(undefined);

interface Props {
  children: React.ReactNode;
  steps: {
    id: string;
    title: string;
    icon: React.ReactNode;
  }[];
}

export const useFormContext = () => {
  const context = useContext(FormContext);
  if (context === undefined) {
    throw new Error('useFormContext must be used within a RequestFormProvider');
  }
  return context;
};

export const RequestFormProvider: React.FC<Props> = ({ children, steps }) => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [personName, setPersonName] = useState<string>("");
  const [sectionStatus, setSectionStatus] = useState<Record<string, 'pending' | 'complete'>>({
    personal: 'pending',
    character: 'pending',
    work: 'pending',
    finances: 'pending',
    evaluation: 'pending',
    documents: 'pending',
    consent: 'pending',
    signature: 'pending',
    guarantors: 'pending',
  });
  const [showExitDialog, setShowExitDialog] = useState(false);
  const [toastShown, setToastShown] = useState(false);
  const [hasFatca, setHasFatca] = useState(false);
  const [isPep, setIsPep] = useState(false);
  const [agentComments, setAgentComments] = useState("");
  
  useEffect(() => {
    const authToken = localStorage.getItem('authToken');
    if (!authToken) {
      navigate('/login');
      return;
    }
    
    console.log(`RequestForm initialized, active step: ${steps[activeStep].id}`);
    
    // If we're editing an existing application, fetch its data
    if (id) {
      // In a real app, you would fetch the application data from an API
      console.log(`Fetching data for application: ${id}`);
      
      // Simulate API delay
      setTimeout(() => {
        // This is mock data - in a real app, this would come from an API
        const mockData = {
          personalInfo: {
            firstName: 'María',
            lastName: 'Rodríguez',
          },
          termsAccepted: false,
          dataProcessingAccepted: false,
          creditCheckAccepted: false,
          applicationCode: `BVM_${generateRandomId()}`,
          hasFatca: false,
          isPep: false,
          agentComments: "",
          guarantors: [
            {
              id: 'guarantor-1',
              name: 'Juan Pérez',
              identification: '1234-5678-9012',
              coveragePercentage: 50,
              status: 'complete' as const
            },
            {
              id: 'guarantor-2',
              name: 'Ana López',
              identification: '9876-5432-1098',
              coveragePercentage: 50,
              status: 'pending' as const
            }
          ]
        };
        
        setFormData(mockData);
        setPersonName(`${mockData.personalInfo.firstName} ${mockData.personalInfo.lastName}`);
        
        // Set sections that have data as complete
        if (mockData.personalInfo) {
          setSectionStatus(prev => ({ ...prev, personal: 'complete' }));
        }
        
        // Only show toast once
        if (!toastShown) {
          toast({
            title: "Datos cargados",
            description: `Se ha cargado la solicitud ${mockData.applicationCode || id} para edición`,
            duration: 3000,
            className: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100",
          });
          setToastShown(true);
        }
      }, 500);
    }
  }, [navigate, activeStep, id, toast, toastShown, steps]);
  
  const updateFormData = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };
  
  const handleNext = () => {
    if (activeStep < steps.length - 1) {
      setSectionStatus(prev => ({ ...prev, [steps[activeStep].id]: 'complete' }));
      setActiveStep(prev => prev + 1);
      console.log(`Moving to step: ${steps[activeStep + 1].id}`);
      
      window.scrollTo(0, 0);
    }
  };
  
  const handleChangeSection = (index: number) => {
    setActiveStep(index);
    console.log(`Jumping to step: ${steps[index].id}`);
    window.scrollTo(0, 0);
  };
  
  const handleSaveDraft = () => {
    console.log('Saving draft:', formData);
    
    toast({
      title: "Borrador guardado",
      description: "Tu solicitud ha sido guardada como borrador.",
      variant: "default",
      className: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100",
      duration: 3000,
    });
  };
  
  const handleSubmit = () => {
    console.log('Submitting form:', formData);
    
    if (!formData.termsAccepted || !formData.dataProcessingAccepted || !formData.creditCheckAccepted) {
      toast({
        title: "Error en el envío",
        description: "Debes aceptar los términos obligatorios para continuar.",
        variant: "destructive",
        className: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100",
        duration: 3000,
      });
      return;
    }
    
    toast({
      title: "Solicitud enviada",
      description: "Tu solicitud ha sido enviada correctamente.",
      variant: "default",
      className: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100",
      duration: 3000,
    });
    
    setTimeout(() => {
      navigate('/applications');
    }, 1000);
  };
  
  const handleShowExitDialog = () => {
    setShowExitDialog(true);
  };
  
  const handleExit = (save: boolean) => {
    if (save) {
      handleSaveDraft();
    }
    
    setShowExitDialog(false);
    navigate('/applications');
  };
  
  const isLastStep = activeStep === steps.length - 1;
  
  const value = {
    activeStep,
    setActiveStep,
    formData,
    updateFormData,
    personName,
    sectionStatus,
    setSectionStatus,
    handleNext,
    handleChangeSection,
    handleSaveDraft,
    handleSubmit,
    handleShowExitDialog,
    isLastStep,
    showExitDialog,
    setShowExitDialog,
    handleExit,
    hasFatca,
    setHasFatca,
    isPep,
    setIsPep,
    agentComments,
    setAgentComments
  };

  return (
    <FormContext.Provider value={value}>
      {children}
    </FormContext.Provider>
  );
};

export default RequestFormProvider;
