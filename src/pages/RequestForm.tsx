
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import Header from '@/components/layout/Header';
import BottomNavigation from '@/components/layout/BottomNavigation';
import { 
  ArrowLeft, ArrowRight, Save, Send, AlertCircle, 
  User, Search, Briefcase, DollarSign, FileText, FileCheck, CheckCircle,
  Calculator, XCircle
} from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { Separator } from "@/components/ui/separator";

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
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';

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
      // For now, we'll use mock data
      console.log(`Fetching data for application: ${id}`);
      
      // Simulate API delay
      setTimeout(() => {
        // This is mock data - in a real app, this would come from an API
        const mockData = {
          // Mock application data here
          personalInfo: {
            firstName: 'María',
            lastName: 'Rodríguez',
            // ... other personal info fields
          },
          // ... other sections
          termsAccepted: false,
          dataProcessingAccepted: false,
          creditCheckAccepted: false
        };
        
        setFormData(mockData);
        
        // Set sections that have data as complete
        if (mockData.personalInfo) {
          setSectionStatus(prev => ({ ...prev, personal: 'complete' }));
        }
        // Do the same for other sections...
        
        toast({
          title: "Datos cargados",
          description: `Se ha cargado la solicitud ${id} para edición`,
          duration: 3000,
        });
      }, 500);
    }
  }, [navigate, activeStep, id, toast]);
  
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
  
  const handlePrev = () => {
    if (activeStep > 0) {
      setActiveStep(prev => prev - 1);
      console.log(`Moving to step: ${steps[activeStep - 1].id}`);
      
      window.scrollTo(0, 0);
    } else {
      handleShowExitDialog();
    }
  };
  
  const handleSaveDraft = () => {
    console.log('Saving draft:', formData);
    
    toast({
      title: "Borrador guardado",
      description: "Tu solicitud ha sido guardada como borrador.",
      duration: 3000,
    });
    
    // In a real application, you would send this data to your API
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
  
  // CSS styles for hide-scrollbar
  const hideScrollbarStyle = {
    msOverflowStyle: 'none',
    scrollbarWidth: 'none',
    '::-webkit-scrollbar': {
      display: 'none'
    }
  } as React.CSSProperties;
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-4 pb-20 max-w-5xl">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center">
            <Button 
              variant="ghost" 
              size="icon" 
              className="mr-2"
              onClick={handlePrev}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-xl font-medium">
              {id ? `Editar Solicitud ${id}` : 'Nueva Solicitud'}
            </h1>
          </div>
          
          <Button
            variant="outline"
            size="icon"
            className="text-muted-foreground"
            onClick={handleShowExitDialog}
            title="Guardar y salir"
          >
            <XCircle className="h-4 w-4" />
          </Button>
        </div>
        
        {/* Section navigation - sleek design */}
        <div className="relative mb-6">
          <div className="flex overflow-x-auto gap-1 pb-1" style={hideScrollbarStyle}>
            {steps.map((step, index) => {
              const isActive = activeStep === index;
              const isCompleted = sectionStatus[step.id] === 'complete';
              const isPast = index < activeStep;
              const isClickable = index <= activeStep;
              
              return (
                <button
                  key={step.id}
                  onClick={() => isClickable && setActiveStep(index)}
                  disabled={!isClickable}
                  className={`
                    flex items-center gap-2 py-2 px-3 min-w-fit rounded-lg transition-all duration-200
                    ${isActive ? 'bg-primary/10 text-primary shadow-sm' : ''}
                    ${isCompleted && !isActive ? 'text-green-600 dark:text-green-400' : ''}
                    ${isPast && !isActive && !isCompleted ? 'text-primary/70' : ''}
                    ${!isClickable ? 'opacity-40' : 'hover:bg-accent'}
                  `}
                >
                  <div className={`
                    flex items-center justify-center w-6 h-6 rounded-full text-xs font-medium
                    ${isActive ? 'bg-primary text-primary-foreground' : ''} 
                    ${isCompleted && !isActive ? 'bg-green-600 text-white dark:bg-green-500' : ''}
                    ${!isActive && !isCompleted ? 'bg-muted border' : ''}
                  `}>
                    {isCompleted ? <CheckCircle size={14} /> : index + 1}
                  </div>
                  <span className="whitespace-nowrap font-medium text-sm">
                    {step.title}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
        
        {/* Current section header */}
        <div className="flex items-center mb-6 gap-3">
          <div className={`
            p-2.5 rounded-full 
            ${sectionStatus[steps[activeStep].id] === 'complete' 
              ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400' 
              : 'bg-primary/10 text-primary'}
          `}>
            {steps[activeStep].icon}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-semibold">
                {steps[activeStep].title}
              </h2>
              <div className={`
                ml-2 px-2 py-0.5 text-xs rounded-full font-medium
                ${sectionStatus[steps[activeStep].id] === 'complete' 
                  ? 'bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-400' 
                  : 'bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-400'}
              `}>
                {sectionStatus[steps[activeStep].id] === 'complete' ? 'Completado' : 'Pendiente'}
              </div>
            </div>
            <p className="text-xs text-muted-foreground">
              Paso {activeStep + 1} de {steps.length}
            </p>
          </div>
        </div>
        
        <Separator className="mb-6" />
        
        <div className="mb-24">
          {renderStepContent()}
        </div>
        
        {/* Sticky action buttons */}
        <div className="fixed bottom-16 sm:bottom-4 left-0 right-0 z-10">
          <div className="bg-background/80 backdrop-blur-lg border-t py-3 shadow-md">
            <div className="flex justify-between items-center gap-4 container max-w-5xl px-4 mx-auto">
              <Button
                variant="outline"
                size="icon"
                onClick={handlePrev}
                className="transition-all hover:translate-x-[-2px]"
                aria-label="Atrás"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              
              <div className="flex gap-2">
                <Button
                  variant="secondary"
                  size="icon"
                  onClick={handleSaveDraft}
                  className="transition-all hover:bg-secondary/80"
                  aria-label="Guardar Borrador"
                >
                  <Save className="h-4 w-4" />
                </Button>
                
                {isLastStep ? (
                  <Button
                    onClick={handleSubmit}
                    disabled={!formData.termsAccepted || !formData.dataProcessingAccepted || !formData.creditCheckAccepted}
                    className="transition-all hover:bg-primary/90"
                  >
                    <Send className="mr-2 h-4 w-4" />
                    Enviar Solicitud
                  </Button>
                ) : (
                  <Button
                    onClick={handleNext}
                    className="transition-all hover:translate-x-[2px]"
                  >
                    Siguiente
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
            
            {isLastStep && (!formData.termsAccepted || !formData.dataProcessingAccepted || !formData.creditCheckAccepted) && (
              <div className="flex items-center gap-2 mt-4 p-2 rounded-md bg-destructive/10 text-destructive text-sm container max-w-5xl mx-auto px-4">
                <AlertCircle className="h-4 w-4" />
                <p>Debes aceptar los términos obligatorios para continuar</p>
              </div>
            )}
          </div>
        </div>
      </main>
      
      <BottomNavigation />
      
      {/* Save & Exit Dialog */}
      <Dialog open={showExitDialog} onOpenChange={setShowExitDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>¿Desea salir de la solicitud?</DialogTitle>
            <DialogDescription>
              Puede guardar su progreso actual para continuar más tarde o salir sin guardar.
            </DialogDescription>
          </DialogHeader>
          
          <DialogFooter className="flex flex-col sm:flex-row gap-2 sm:justify-between mt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => handleExit(false)}
              className="w-full sm:w-auto"
            >
              <XCircle className="mr-2 h-4 w-4" />
              Salir sin guardar
            </Button>
            <Button 
              type="button"
              onClick={() => handleExit(true)}
              className="w-full sm:w-auto"
            >
              <Save className="mr-2 h-4 w-4" />
              Guardar y salir
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default RequestForm;
