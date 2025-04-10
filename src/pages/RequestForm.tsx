
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Header from '@/components/layout/Header';
import BottomNavigation from '@/components/layout/BottomNavigation';
import BreadcrumbNavigation from '@/components/navigation/BreadcrumbNavigation';
import SectionHeader from '@/components/requestForm/SectionHeader';
import { 
  User, Search, Briefcase, DollarSign, Calculator, CheckCircle, FileCheck 
} from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

// Form section components
import PersonalInfo from '@/components/requestForm/PersonalInfo';
import WorkInfo from '@/components/requestForm/WorkInfo';
import FinancialInfo from '@/components/requestForm/FinancialInfo';
import CreditInfo from '@/components/requestForm/CreditInfo';
import DocumentsSection from '@/components/requestForm/DocumentsSection';
import ConsentSection from '@/components/requestForm/ConsentSection';
import CharacterAnalysis from '@/components/requestForm/CharacterAnalysis';
import CreditEvaluation from '@/components/requestForm/CreditEvaluation';
import PhotoDocumentUpload from '@/components/requestForm/PhotoDocumentUpload';

// New refactored components
import ExitDialog from '@/components/requestForm/ExitDialog';
import StepNavigation from '@/components/requestForm/StepNavigation';
import FormActionBar from '@/components/requestForm/FormActionBar';

const steps = [
  { id: 'personal', title: 'Información Personal', icon: <User size={18} /> },
  { id: 'character', title: 'Análisis de Carácter', icon: <Search size={18} /> },
  { id: 'work', title: 'Información Laboral', icon: <Briefcase size={18} /> },
  { id: 'finances', title: 'Información Financiera', icon: <DollarSign size={18} /> },
  { id: 'evaluation', title: 'Evaluación Crediticia', icon: <Calculator size={18} /> },
  { id: 'documents', title: 'Documentos', icon: <FileCheck size={18} /> },
  { id: 'consent', title: 'Consentimiento', icon: <CheckCircle size={18} /> },
];

const RequestForm = () => {
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
  });
  const [showExitDialog, setShowExitDialog] = useState(false);
  const [toastShown, setToastShown] = useState(false);
  
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
          creditCheckAccepted: false
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
            description: `Se ha cargado la solicitud ${id} para edición`,
            duration: 3000,
          });
          setToastShown(true);
        }
      }, 500);
    }
  }, [navigate, activeStep, id, toast, toastShown]);
  
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
        duration: 3000,
      });
      return;
    }
    
    toast({
      title: "Solicitud enviada",
      description: "Tu solicitud ha sido enviada correctamente.",
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
  
  const renderStepContent = () => {
    switch (activeStep) {
      case 0:
        return <PersonalInfo formData={formData} updateFormData={updateFormData} />;
      case 1:
        return <CharacterAnalysis formData={formData} updateFormData={updateFormData} />;
      case 2:
        return <WorkInfo formData={formData} updateFormData={updateFormData} />;
      case 3:
        return <FinancialInfo formData={formData} updateFormData={updateFormData} />;
      case 4:
        return <CreditEvaluation formData={formData} updateFormData={updateFormData} />;
      case 5:
        return <PhotoDocumentUpload formData={formData} updateFormData={updateFormData} />;
      case 6:
        return <ConsentSection formData={formData} updateFormData={updateFormData} />;
      default:
        return null;
    }
  };
  
  const isLastStep = activeStep === steps.length - 1;
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header personName={personName?.split(' ')[0] || ''} />
      
      <main className="flex-1 container mx-auto px-4 py-0 pb-20 max-w-5xl">
        <BreadcrumbNavigation />
        
        <div className="mb-4">
          <StepNavigation 
            steps={steps} 
            activeStep={activeStep} 
            sectionStatus={sectionStatus}
            onChangeStep={handleChangeSection}
          />
        </div>
        
        {/* Section Header */}
        <SectionHeader 
          sectionId={steps[activeStep].id} 
          currentStep={activeStep + 1} 
          totalSteps={steps.length}
          status={sectionStatus[steps[activeStep].id]}
        />
        
        <div className="mb-24">
          {renderStepContent()}
        </div>
        
        {/* Action Bar */}
        <FormActionBar
          steps={steps}
          activeStep={activeStep}
          isLastStep={isLastStep}
          formData={formData}
          sectionStatus={sectionStatus}
          onChangeSection={handleChangeSection}
          onNext={handleNext}
          onSaveDraft={handleSaveDraft}
          onSubmit={handleSubmit}
        />
      </main>
      
      <BottomNavigation />
      
      {/* Exit Dialog */}
      <ExitDialog 
        open={showExitDialog} 
        onOpenChange={setShowExitDialog}
        onExit={handleExit}
      />
    </div>
  );
};

export default RequestForm;
