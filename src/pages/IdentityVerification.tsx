import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

// Components
import VerificationWelcome from '@/components/identity/VerificationWelcome';
import DocumentCapture from '@/components/identity/DocumentCapture';
import SelfieCapture from '@/components/identity/SelfieCapture';
import VerificationResult from '@/components/identity/VerificationResult';

// Types and utils
import { VerificationStep, VerificationState } from '@/types/identity';
import { extractDPIData } from '@/utils/dpiExtraction';

const IdentityVerification: React.FC = () => {
  const navigate = useNavigate();
  
  const [state, setState] = useState<VerificationState>({
    currentStep: 'welcome',
    captures: {}
  });

  const steps: { step: VerificationStep; label: string; progress: number }[] = [
    { step: 'welcome', label: 'Bienvenida', progress: 0 },
    { step: 'dpi-front', label: 'DPI Frente', progress: 25 },
    { step: 'dpi-back', label: 'DPI Reverso', progress: 50 },
    { step: 'selfie', label: 'Selfie', progress: 75 },
    { step: 'success', label: 'Completado', progress: 100 }
  ];

  const currentStepInfo = steps.find(s => s.step === state.currentStep);

  const handleStartVerification = () => {
    setState(prev => ({ ...prev, currentStep: 'dpi-front' }));
  };

  const handleDPIFrontCapture = (imageData: string) => {
    setState(prev => ({
      ...prev,
      captures: { ...prev.captures, dpiFrontURL: imageData },
      currentStep: 'dpi-back'
    }));
  };

  const handleDPIBackCapture = (imageData: string) => {
    setState(prev => ({
      ...prev,
      captures: { ...prev.captures, dpiBackURL: imageData },
      currentStep: 'selfie'
    }));
  };

  const handleSelfieCapture = async (imageData: string) => {
    setState(prev => ({
      ...prev,
      captures: { ...prev.captures, selfieURL: imageData },
      currentStep: 'processing'
    }));

    // Procesar datos del DPI
    try {
      const identityData = await extractDPIData(
        state.captures.dpiFrontURL!,
        state.captures.dpiBackURL
      );
      
      setState(prev => ({
        ...prev,
        identityData,
        currentStep: 'success'
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: 'Error al procesar los datos del DPI',
        currentStep: 'error'
      }));
    }
  };

  const handleContinueToForm = () => {
    // Navegar al formulario oficial con datos prellenados
    navigate('/applications/oficial/new', { 
      state: { identityData: state.identityData } 
    });
  };

  const handleRetry = () => {
    setState({
      currentStep: 'welcome',
      captures: {}
    });
  };

  const handleCancel = () => {
    navigate('/');
  };

  const handleGoBack = () => {
    const stepOrder: VerificationStep[] = ['welcome', 'dpi-front', 'dpi-back', 'selfie'];
    const currentIndex = stepOrder.indexOf(state.currentStep);
    
    if (currentIndex > 0) {
      setState(prev => ({ 
        ...prev, 
        currentStep: stepOrder[currentIndex - 1] 
      }));
    } else {
      handleCancel();
    }
  };

  const renderContent = () => {
    switch (state.currentStep) {
      case 'welcome':
        return (
          <VerificationWelcome
            onStartVerification={handleStartVerification}
            onCancel={handleCancel}
          />
        );
      
      case 'dpi-front':
        return (
          <DocumentCapture
            documentType="front"
            onCapture={handleDPIFrontCapture}
            onRetry={() => setState(prev => ({ ...prev, captures: { ...prev.captures, dpiFrontURL: undefined } }))}
            capturedImage={state.captures.dpiFrontURL}
          />
        );
      
      case 'dpi-back':
        return (
          <DocumentCapture
            documentType="back"
            onCapture={handleDPIBackCapture}
            onRetry={() => setState(prev => ({ ...prev, captures: { ...prev.captures, dpiBackURL: undefined } }))}
            capturedImage={state.captures.dpiBackURL}
          />
        );
      
      case 'selfie':
        return (
          <SelfieCapture
            onCapture={handleSelfieCapture}
            onRetry={() => setState(prev => ({ ...prev, captures: { ...prev.captures, selfieURL: undefined } }))}
            capturedImage={state.captures.selfieURL}
          />
        );
      
      case 'processing':
        return (
          <div className="max-w-md mx-auto text-center space-y-6">
            <div className="animate-spin w-16 h-16 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
            <div>
              <h2 className="text-xl font-semibold mb-2">Procesando Datos</h2>
              <p className="text-muted-foreground">
                Estamos extrayendo la información de tu DPI...
              </p>
            </div>
          </div>
        );
      
      case 'success':
        return state.identityData ? (
          <VerificationResult
            identityData={state.identityData}
            onContinue={handleContinueToForm}
            onRetry={handleRetry}
          />
        ) : null;
      
      case 'error':
        return (
          <div className="max-w-md mx-auto text-center space-y-6">
            <div className="text-red-500">
              <h2 className="text-xl font-semibold mb-2">Error en Verificación</h2>
              <p className="text-muted-foreground mb-4">
                {state.error || 'Ocurrió un error durante la verificación'}
              </p>
              <Button onClick={handleRetry} className="w-full">
                Intentar de Nuevo
              </Button>
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 bg-background border-b z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleGoBack}
              className="shrink-0"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            
            <div className="flex-1">
              <h1 className="font-semibold">Verificación de Identidad</h1>
              {currentStepInfo && (
                <p className="text-sm text-muted-foreground">
                  {currentStepInfo.label}
                </p>
              )}
            </div>
          </div>
          
          {currentStepInfo && state.currentStep !== 'welcome' && (
            <div className="mt-4">
              <Progress value={currentStepInfo.progress} className="h-2" />
              <p className="text-xs text-muted-foreground mt-1 text-center">
                {currentStepInfo.progress}% completado
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <main className="container mx-auto px-4 py-6">
        {renderContent()}
      </main>
    </div>
  );
};

export default IdentityVerification;