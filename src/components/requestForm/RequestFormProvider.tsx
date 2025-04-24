import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";

// Generate a random 6-digit number for application IDs
const generateRandomId = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Define guarantor types
export type GuarantorType = 'salaried' | 'non-salaried';

// Define guarantor status and data structure
export interface GuarantorData {
  id: string;
  name: string;
  identification: string;
  coveragePercentage: number;
  status: 'pending' | 'complete';
  type?: GuarantorType;
  tempId?: string;
  isExistingGuarantor?: boolean;
  personalInfo?: {
    firstName: string;
    lastName: string;
    cui: string;
    email: string;
    phone: string;
    education: string;
    profession: string;
    housingType: string;
    maritalStatus: string;
    dependents: number;
    address: string;
  };
  characterInfo?: {
    isReliable: boolean;
    isOrganized: boolean;
    hasStableIncome: boolean;
    hasGoodReputation: boolean;
    additionalNotes: string;
  };
  businessInfo?: {
    monthlySales: number;
    cashSales: number;
    creditSales: number;
    costs: number;
    grossProfit: number;
    administrativeExpenses: number;
    netProfit: number;
    profitMargin: number;
    products: {
      id: string;
      name: string;
      price: number;
      cost: number;
      highSeasonMonths: string[];
      lowSeasonMonths: string[];
      photoUrl?: string;
    }[];
  };
  documentsStatus?: {
    dpi: 'pending' | 'complete' | 'error';
    residenceProof: 'pending' | 'complete' | 'error';
    businessPhotos: 'pending' | 'complete' | 'error';
    financialStatement: 'pending' | 'complete' | 'error';
    taxDeclaration: 'pending' | 'complete' | 'error';
  };
  consentInfo?: {
    hasSignedConsent: boolean;
    witnessName?: string;
    witnessId?: string;
    signatureUrl?: string;
  };
  evaluationResult?: {
    isApproved: boolean;
    suggestedCoveragePercentage: number;
    evaluationScore: number;
    evaluationNotes: string;
  };
}

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
  showNonSalariedGuarantorForm: boolean;
  setShowNonSalariedGuarantorForm: React.Dispatch<React.SetStateAction<boolean>>;
  currentGuarantor: GuarantorData | null;
  setCurrentGuarantor: React.Dispatch<React.SetStateAction<GuarantorData | null>>;
  guarantorStep: number;
  setGuarantorStep: React.Dispatch<React.SetStateAction<number>>;
  saveGuarantor: () => void;
  cancelGuarantorForm: () => void;
  requiredCoveragePercentage: number;
  calculateCoveragePercentage: () => number;
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
  
  // Non-salaried guarantor flow state
  const [showNonSalariedGuarantorForm, setShowNonSalariedGuarantorForm] = useState(false);
  const [currentGuarantor, setCurrentGuarantor] = useState<GuarantorData | null>(null);
  const [guarantorStep, setGuarantorStep] = useState(0);
  const [requiredCoveragePercentage] = useState(100);
  
  // Calculate the total coverage percentage provided by all guarantors
  const calculateCoveragePercentage = () => {
    const guarantors = formData.guarantors || [];
    return guarantors.reduce((total: number, guarantor: GuarantorData) => 
      total + guarantor.coveragePercentage, 0);
  };
  
  // Save the current guarantor to the list of guarantors
  const saveGuarantor = () => {
    if (!currentGuarantor) return;
    
    const guarantors = [...(formData.guarantors || [])];
    const existingIndex = guarantors.findIndex(g => g.id === currentGuarantor.id);
    
    if (existingIndex >= 0) {
      guarantors[existingIndex] = {...currentGuarantor};
    } else {
      guarantors.push(currentGuarantor);
    }
    
    // Update form data with new guarantors
    setFormData(prev => ({
      ...prev,
      guarantors
    }));
    
    // Reset guarantor flow
    setShowNonSalariedGuarantorForm(false);
    setCurrentGuarantor(null);
    setGuarantorStep(0);
    
    toast({
      title: "Fiador guardado",
      description: "La información del fiador ha sido guardada correctamente.",
      className: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100",
    });
  };
  
  // Cancel the guarantor form and return to main flow
  const cancelGuarantorForm = () => {
    if (currentGuarantor && (
      currentGuarantor.personalInfo?.firstName || 
      currentGuarantor.businessInfo?.monthlySales
    )) {
      // Show confirmation dialog if there's data to lose
      if (!window.confirm("¿Está seguro que desea cancelar? Se perderán los datos no guardados.")) {
        return;
      }
    }
    
    setShowNonSalariedGuarantorForm(false);
    setCurrentGuarantor(null);
    setGuarantorStep(0);
  };
  
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
              status: 'complete' as const,
              type: 'salaried' as GuarantorType
            },
            {
              id: 'guarantor-2',
              name: 'Ana López',
              identification: '9876-5432-1098',
              coveragePercentage: 50,
              status: 'pending' as const,
              type: 'non-salaried' as GuarantorType
            }
          ],
          creditAmount: 50000
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
    setAgentComments,
    showNonSalariedGuarantorForm,
    setShowNonSalariedGuarantorForm,
    currentGuarantor,
    setCurrentGuarantor,
    guarantorStep,
    setGuarantorStep,
    saveGuarantor,
    cancelGuarantorForm,
    requiredCoveragePercentage,
    calculateCoveragePercentage
  };

  return (
    <FormContext.Provider value={value}>
      {children}
    </FormContext.Provider>
  );
};

export default RequestFormProvider;
