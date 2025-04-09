
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import Header from '@/components/layout/Header';
import BottomNavigation from '@/components/layout/BottomNavigation';
import { Card } from '@/components/ui/card';
import { ArrowLeft, ArrowRight, Save, Send, AlertCircle } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Form section components
import PersonalInfo from '@/components/requestForm/PersonalInfo';
import WorkInfo from '@/components/requestForm/WorkInfo';
import IncomeExpenses from '@/components/requestForm/IncomeExpenses';
import CreditInfo from '@/components/requestForm/CreditInfo';
import DocumentsSection from '@/components/requestForm/DocumentsSection';
import ConsentSection from '@/components/requestForm/ConsentSection';
import CharacterAnalysis from '@/components/requestForm/CharacterAnalysis';

const steps = [
  { id: 'personal', title: 'Información Personal', icon: '👤' },
  { id: 'character', title: 'Análisis de Carácter', icon: '🔍' },
  { id: 'work', title: 'Información Laboral', icon: '💼' },
  { id: 'finances', title: 'Información Financiera', icon: '💰' },
  { id: 'credit', title: 'Datos del Crédito', icon: '📝' },
  { id: 'documents', title: 'Documentos', icon: '📄' },
  { id: 'consent', title: 'Consentimiento', icon: '✓' },
];

const RequestForm = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState<Record<string, any>>({});
  
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
        
        {/* New section selector design using Tabs */}
        <div className="mb-6">
          <Tabs value={steps[activeStep].id} className="w-full">
            <TabsList className="w-full justify-between bg-card p-1 overflow-x-auto flex-wrap gap-1">
              {steps.map((step, index) => (
                <TabsTrigger
                  key={step.id}
                  value={step.id}
                  disabled={index > activeStep}
                  onClick={() => {
                    if (index <= activeStep) {
                      setActiveStep(index);
                    }
                  }}
                  className={`
                    flex items-center gap-2 whitespace-nowrap
                    ${index === activeStep ? 'bg-primary text-primary-foreground' : ''}
                    ${index < activeStep ? 'text-primary' : ''}
                    ${index > activeStep ? 'opacity-50' : ''}
                  `}
                >
                  <span className="text-base">{step.icon}</span>
                  <span className="hidden sm:inline">{step.title}</span>
                  <span className="inline sm:hidden">{index + 1}</span>
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
          
          {/* Section progress indicator */}
          <div className="mt-4 text-center">
            <p className="text-sm text-muted-foreground">
              Paso {activeStep + 1} de {steps.length}: <span className="font-medium text-foreground">{steps[activeStep].title}</span>
            </p>
            <div className="w-full bg-muted h-1 mt-2 rounded-full overflow-hidden">
              <div 
                className="bg-primary h-1 transition-all duration-300 ease-in-out rounded-full"
                style={{ width: `${((activeStep + 1) / steps.length) * 100}%` }}
              />
            </div>
          </div>
        </div>
        
        <div className="mb-8 min-h-[500px] bg-background p-5 rounded-lg shadow-sm">
          {renderStepContent()}
        </div>
        
        <div className="border-t pt-4">
          <div className="flex justify-between gap-4 container max-w-3xl px-0">
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
            <div className="flex items-center gap-2 mt-4 p-2 rounded-md bg-destructive/10 text-destructive text-sm">
              <AlertCircle className="h-4 w-4" />
              <p>Debes aceptar los términos obligatorios para continuar</p>
            </div>
          )}
        </div>
      </main>
      
      <BottomNavigation />
    </div>
  );
};

export default RequestForm;
