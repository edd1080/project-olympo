
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import Header from '@/components/layout/Header';
import BottomNavigation from '@/components/layout/BottomNavigation';
import { Card } from '@/components/ui/card';
import { 
  ArrowLeft, ArrowRight, Save, Send, AlertCircle, 
  User, Search, Briefcase, DollarSign, FileText, FileCheck, CheckCircle 
} from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

// Form section components
import PersonalInfo from '@/components/requestForm/PersonalInfo';
import WorkInfo from '@/components/requestForm/WorkInfo';
import IncomeExpenses from '@/components/requestForm/IncomeExpenses';
import CreditInfo from '@/components/requestForm/CreditInfo';
import DocumentsSection from '@/components/requestForm/DocumentsSection';
import ConsentSection from '@/components/requestForm/ConsentSection';
import CharacterAnalysis from '@/components/requestForm/CharacterAnalysis';

const steps = [
  { id: 'personal', title: 'Información Personal', icon: <User size={18} /> },
  { id: 'character', title: 'Análisis de Carácter', icon: <Search size={18} /> },
  { id: 'work', title: 'Información Laboral', icon: <Briefcase size={18} /> },
  { id: 'finances', title: 'Información Financiera', icon: <DollarSign size={18} /> },
  { id: 'credit', title: 'Datos del Crédito', icon: <FileText size={18} /> },
  { id: 'documents', title: 'Documentos', icon: <FileCheck size={18} /> },
  { id: 'consent', title: 'Consentimiento', icon: <CheckCircle size={18} /> },
];

const RequestForm = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [sectionStatus, setSectionStatus] = useState<Record<string, 'pending' | 'complete'>>({
    personal: 'pending',
    character: 'pending',
    work: 'pending',
    finances: 'pending',
    credit: 'pending',
    documents: 'pending',
    consent: 'pending',
  });
  
  useEffect(() => {
    // Check if user is authenticated
    const authToken = localStorage.getItem('authToken');
    if (!authToken) {
      navigate('/login');
      return;
    }
    
    // Log for tracking
    console.log(`RequestForm initialized, active step: ${steps[activeStep].id}`);
  }, [navigate, activeStep]);
  
  const updateFormData = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };
  
  const handleNext = () => {
    if (activeStep < steps.length - 1) {
      // Mark current section as complete when moving forward
      setSectionStatus(prev => ({ ...prev, [steps[activeStep].id]: 'complete' }));
      setActiveStep(prev => prev + 1);
      console.log(`Moving to step: ${steps[activeStep + 1].id}`);
      
      // Scroll to top on step change
      window.scrollTo(0, 0);
    }
  };
  
  const handlePrev = () => {
    if (activeStep > 0) {
      setActiveStep(prev => prev - 1);
      console.log(`Moving to step: ${steps[activeStep - 1].id}`);
      
      // Scroll to top on step change
      window.scrollTo(0, 0);
    } else {
      // If on first step, go back to previous page
      navigate(-1);
    }
  };
  
  const handleSaveDraft = () => {
    // Save draft logic would go here
    console.log('Saving draft:', formData);
    
    toast({
      title: "Borrador guardado",
      description: "Tu solicitud ha sido guardada como borrador.",
      duration: 3000,
    });
  };
  
  const handleSubmit = () => {
    // Form submission logic would go here
    console.log('Submitting form:', formData);
    
    // Check for required consents
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
    
    // Navigate to applications page after successful submission
    setTimeout(() => {
      navigate('/applications');
    }, 1000);
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
        return <IncomeExpenses formData={formData} updateFormData={updateFormData} />;
      case 4:
        return <CreditInfo formData={formData} updateFormData={updateFormData} />;
      case 5:
        return <DocumentsSection formData={formData} updateFormData={updateFormData} />;
      case 6:
        return <ConsentSection formData={formData} updateFormData={updateFormData} />;
      default:
        return null;
    }
  };
  
  const isLastStep = activeStep === steps.length - 1;
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-4 pb-20 max-w-3xl">
        <div className="mb-4 flex items-center">
          <Button 
            variant="ghost" 
            size="icon" 
            className="mr-2"
            onClick={handlePrev}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-xl font-medium">Nueva Solicitud</h1>
        </div>
        
        {/* Improved horizontal tabs navigation */}
        <div className="mb-5">
          <div className="overflow-x-auto pb-2 hide-scrollbar">
            <Tabs 
              value={steps[activeStep].id}
              className="w-full"
              onValueChange={(value) => {
                const index = steps.findIndex(step => step.id === value);
                if (index <= activeStep) { // Only allow navigation to current or previous steps
                  setActiveStep(index);
                }
              }}
            >
              <TabsList className="inline-flex w-auto h-12 p-1">
                {steps.map((step, index) => {
                  const status = sectionStatus[step.id];
                  return (
                    <TabsTrigger
                      key={step.id}
                      value={step.id}
                      disabled={index > activeStep}
                      className={`
                        px-4 py-2 min-w-[120px] flex items-center gap-2
                        ${index === activeStep ? 'bg-primary text-primary-foreground' : ''}
                        ${index < activeStep ? 'text-primary' : ''}
                        ${index > activeStep ? 'opacity-50' : ''}
                        ${status === 'complete' ? 'border-l-2 border-green-500' : ''}
                        ${status === 'pending' ? 'border-l-2 border-orange-400' : ''}
                      `}
                    >
                      <span className="flex-shrink-0">{step.icon}</span>
                      <span className="hidden sm:inline whitespace-nowrap">{step.title}</span>
                      <span className="inline sm:hidden">{index + 1}</span>
                    </TabsTrigger>
                  );
                })}
              </TabsList>
            </Tabs>
          </div>
          
          {/* Section header with icon and progress indicator */}
          <div className="mt-4">
            <div className="flex items-center gap-3 mb-1">
              <div className="bg-muted/30 p-2 rounded-full">
                {steps[activeStep].icon}
              </div>
              <div>
                <h2 className="text-lg font-medium">
                  {steps[activeStep].title}
                </h2>
                <p className="text-sm text-muted-foreground">
                  Paso {activeStep + 1} de {steps.length}
                </p>
              </div>
              <div className={`ml-auto px-3 py-1 text-xs rounded-full ${
                sectionStatus[steps[activeStep].id] === 'complete' 
                  ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300' 
                  : 'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300'
              }`}>
                {sectionStatus[steps[activeStep].id] === 'complete' ? 'Completado' : 'Pendiente'}
              </div>
            </div>
            
            <div className="w-full bg-muted h-1.5 mt-1 rounded-full overflow-hidden">
              <div 
                className="bg-primary h-1.5 transition-all duration-300 ease-in-out rounded-full"
                style={{ width: `${((activeStep + 1) / steps.length) * 100}%` }}
              />
            </div>
          </div>
        </div>
        
        <div className="mb-24 min-h-[500px] bg-background p-5 rounded-lg shadow-sm">
          {renderStepContent()}
        </div>
        
        {/* Sticky bottom navigation */}
        <div className="fixed bottom-16 sm:bottom-4 left-0 right-0 z-10">
          <div className="bg-background/80 backdrop-blur-md border-t py-4">
            <div className="flex justify-between gap-4 container max-w-3xl px-4 mx-auto">
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
              <div className="flex items-center gap-2 mt-4 p-2 rounded-md bg-destructive/10 text-destructive text-sm container max-w-3xl mx-auto px-4">
                <AlertCircle className="h-4 w-4" />
                <p>Debes aceptar los términos obligatorios para continuar</p>
              </div>
            )}
          </div>
        </div>
      </main>
      
      <BottomNavigation />
      
      <style jsx global>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};

export default RequestForm;
