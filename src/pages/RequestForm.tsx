
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import Header from '@/components/layout/Header';
import BottomNavigation from '@/components/layout/BottomNavigation';
import { Card } from '@/components/ui/card';
import { ArrowLeft, ArrowRight, Save, Send, AlertCircle } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

// Form section components
import PersonalInfo from '@/components/requestForm/PersonalInfo';
import WorkInfo from '@/components/requestForm/WorkInfo';
import IncomeExpenses from '@/components/requestForm/IncomeExpenses';
import CreditInfo from '@/components/requestForm/CreditInfo';
import DocumentsSection from '@/components/requestForm/DocumentsSection';
import ConsentSection from '@/components/requestForm/ConsentSection';
import CharacterAnalysis from '@/components/requestForm/CharacterAnalysis';

const steps = [
  { id: 'personal', title: 'Información Personal' },
  { id: 'character', title: 'Análisis de Carácter' },
  { id: 'work', title: 'Información Laboral' },
  { id: 'finances', title: 'Ingresos y Egresos' },
  { id: 'credit', title: 'Datos del Crédito' },
  { id: 'documents', title: 'Documentos' },
  { id: 'consent', title: 'Consentimiento' },
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
      
      <main className="flex-1 px-4 py-4 pb-20 mx-auto w-full max-w-3xl">
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
        
        <Card className="overflow-hidden mb-6">
          <div className="flex overflow-x-auto scrollbar-none">
            {steps.map((step, index) => (
              <div
                key={step.id}
                className={`
                  flex-1 py-2 px-4 text-center text-sm whitespace-nowrap cursor-pointer border-b-2 transition-colors
                  ${index === activeStep ? 'border-primary text-primary font-medium' : 'border-transparent'}
                `}
                onClick={() => {
                  // Allow clicking on previously visited steps
                  if (index <= activeStep) {
                    setActiveStep(index);
                    console.log(`Clicked step: ${steps[index].id}`);
                  }
                }}
              >
                <div className="flex flex-col items-center sm:flex-row sm:justify-center">
                  <span className={`
                    flex items-center justify-center rounded-full h-6 w-6 text-xs mb-1 sm:mb-0 sm:mr-2
                    ${index === activeStep ? 'bg-primary text-primary-foreground' : 
                      index < activeStep ? 'bg-primary/20 text-primary' : 'bg-muted text-muted-foreground'}
                  `}>
                    {index + 1}
                  </span>
                  <span className="hidden sm:block">{step.title}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>
        
        <div className="mb-8 min-h-[500px]">
          {renderStepContent()}
        </div>
        
        <div className="border-t pt-4">
          <div className="flex justify-between gap-4">
            <Button
              variant="outline"
              onClick={handlePrev}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Atrás
            </Button>
            
            <div className="flex gap-2">
              <Button
                variant="secondary"
                onClick={handleSaveDraft}
              >
                <Save className="mr-2 h-4 w-4" />
                Guardar Borrador
              </Button>
              
              {isLastStep ? (
                <Button
                  onClick={handleSubmit}
                  disabled={!formData.termsAccepted || !formData.dataProcessingAccepted || !formData.creditCheckAccepted}
                >
                  <Send className="mr-2 h-4 w-4" />
                  Enviar Solicitud
                </Button>
              ) : (
                <Button
                  onClick={handleNext}
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
