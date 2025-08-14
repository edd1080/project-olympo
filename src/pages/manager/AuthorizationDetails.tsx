import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '@/components/layout/Header';
import { AuthorizationSummary } from '@/components/authorization/AuthorizationSummary';
import { SectionNavigation } from '@/components/authorization/SectionNavigation';
import { SectionContent } from '@/components/authorization/SectionContent';
import { ActionButtons } from '@/components/authorization/ActionButtons';
import { ValidationChecklist } from '@/components/authorization/ValidationChecklist';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { AuthorizationRequest, AuthorizationAction, ValidationResult } from '@/types/authorization';

const AuthorizationDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [currentSection, setCurrentSection] = useState(0);
  const [authorizationRequest, setAuthorizationRequest] = useState<AuthorizationRequest | null>(null);
  const [validationResult, setValidationResult] = useState<ValidationResult>({ isValid: false, blockedReasons: [], warnings: [] });
  const [isLoading, setIsLoading] = useState(true);

  // Mock data - in real app this would come from API
  useEffect(() => {
    const loadAuthorizationRequest = async () => {
      setIsLoading(true);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const mockRequest: AuthorizationRequest = {
        id: id || 'AUTH-001',
        applicationId: 'APP-2024-001',
        applicantName: 'María García Pérez',
        dpi: '1234567891234',
        amount: 15000,
        product: 'Crédito Comercial',
        term: 12,
        status: 'pending',
        businessType: 'Tienda de Abarrotes',
        creditScore: 720,
        riskLevel: 'medium',
        invcResult: 'verified',
        completionPercentage: 85,
        createdDate: '2025-01-14',
        assignedManager: 'Gerente Pérez',
        sections: [
          { id: 'dictamen', name: 'Dictamen', status: 'completed', completionPercentage: 100, required: true, order: 0 },
          { id: 'personal', name: 'Datos Personales', status: 'completed', completionPercentage: 100, required: true, order: 1 },
          { id: 'character', name: 'Carácter', status: 'completed', completionPercentage: 100, required: true, order: 2 },
          { id: 'financial', name: 'Información Financiera', status: 'completed', completionPercentage: 100, required: true, order: 3 },
          { id: 'additional_financial', name: 'Info Financiera Adicional', status: 'completed', completionPercentage: 100, required: false, order: 4 },
          { id: 'documents', name: 'Documentos/Imágenes', status: 'completed', completionPercentage: 100, required: true, order: 5 },
          { id: 'signature', name: 'Cláusula/Firma', status: 'completed', completionPercentage: 100, required: true, order: 6 },
          { id: 'invc', name: 'INVC', status: 'completed', completionPercentage: 100, required: true, order: 7 }
        ],
        dictamen: {
          creditAmount: 15000,
          product: 'Crédito Comercial',
          term: 12,
          rate: 18.5,
          guarantee: 'Fiador solidario',
          paymentMethod: 'Mensual',
          evaluations: {
            sib: { score: 720, status: 'approved', details: 'Sin morosidad actual', date: '2025-01-14' },
            internal: { score: 750, status: 'approved', details: 'Cliente recurrente con buen historial', date: '2025-01-14' },
            prequalifier: { score: 780, status: 'approved', details: 'Cumple todos los criterios', date: '2025-01-14' }
          },
          paymentCapacity: {
            monthlyIncome: 8500,
            monthlyExpenses: 5200,
            availableCapacity: 3300,
            recommendedPayment: 1650,
            debtToIncomeRatio: 0.19,
            liquidity: 1.8,
            profitability: 0.25,
            currentRatio: 2.1,
            acidRatio: 1.4
          },
          signatures: {
            agent: { name: 'Agente López', role: 'Agente de Crédito', date: '2025-01-14', digitallySigned: true },
            manager: { name: 'Gerente Pérez', role: 'Gerente de Sucursal', date: '2025-01-14', digitallySigned: false }
          }
        }
      };
      
      setAuthorizationRequest(mockRequest);
      
      // Validate authorization readiness
      const validation = validateAuthorizationReadiness(mockRequest);
      setValidationResult(validation);
      
      setIsLoading(false);
    };

    loadAuthorizationRequest();
  }, [id]);

  const validateAuthorizationReadiness = (request: AuthorizationRequest): ValidationResult => {
    const blockedReasons = [];
    const warnings = [];
    
    // Required sections completed
    const requiredSections = request.sections.filter(s => s.required);
    const incompleteSections = requiredSections.filter(s => s.status !== 'completed');
    if (incompleteSections.length > 0) {
      blockedReasons.push(`Secciones pendientes: ${incompleteSections.map(s => s.name).join(', ')}`);
    }
    
    // INVC validation
    const invcSection = request.sections.find(s => s.id === 'invc');
    if (invcSection && invcSection.status !== 'completed') {
      blockedReasons.push('INVC pendiente de completar');
    }
    
    // Documents validation
    const docsSection = request.sections.find(s => s.id === 'documents');
    if (docsSection?.status !== 'completed') {
      blockedReasons.push('Documentos pendientes de validación');
    }
    
    // Signature validation
    const signatureSection = request.sections.find(s => s.id === 'signature');
    if (signatureSection?.status !== 'completed') {
      blockedReasons.push('Firma digital pendiente');
    }
    
    return {
      isValid: blockedReasons.length === 0,
      blockedReasons,
      warnings
    };
  };

  const handleActionComplete = (action: AuthorizationAction) => {
    let message = '';
    let variant: "default" | "destructive" | "success" = "default";
    
    switch (action.type) {
      case 'approve':
        message = `Crédito aprobado por Q${authorizationRequest?.amount.toLocaleString()}`;
        variant = "success";
        break;
      case 'return':
        message = 'Expediente devuelto para corrección';
        variant = "default";
        break;
      case 'recommend':
        message = 'Recomendación enviada a coordinación';
        variant = "success";
        break;
      case 'not_recommend':
        message = 'No recomendación enviada a coordinación';
        variant = "default";
        break;
      case 'authorize':
        message = 'Crédito autorizado para desembolso';
        variant = "success";
        break;
      case 'reject':
        message = 'Crédito rechazado definitivamente';
        variant = "destructive";
        break;
    }
    
    toast({
      title: "Acción completada",
      description: message,
      variant
    });
    
    // Navigate back to list
    setTimeout(() => {
      navigate('/manager/authorizations');
    }, 1500);
  };

  const handleSectionChange = (sectionIndex: number) => {
    setCurrentSection(sectionIndex);
    
    // Track telemetry
    if (authorizationRequest) {
      console.log('expediente_seccion_visitada', {
        solicitud_id: authorizationRequest.id,
        seccion: authorizationRequest.sections[sectionIndex]?.name,
        usuario: user?.email
      });
    }
  };

  const handleContinue = () => {
    if (authorizationRequest && currentSection < authorizationRequest.sections.length - 1) {
      setCurrentSection(currentSection + 1);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="mobile-container pt-4">
          <div className="space-y-4">
            <div className="animate-pulse">
              <div className="h-6 bg-muted rounded w-1/3 mb-2"></div>
              <div className="h-4 bg-muted rounded w-1/2"></div>
            </div>
            <div className="animate-pulse space-y-3">
              <div className="h-32 bg-muted rounded"></div>
              <div className="h-12 bg-muted rounded"></div>
              <div className="h-64 bg-muted rounded"></div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (!authorizationRequest) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="mobile-container pt-4">
          <div className="text-center py-8">
            <p className="text-muted-foreground">Expediente no encontrado</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="mobile-container pt-4 space-y-4">
        {/* Authorization Summary - Sticky */}
        <div className="sticky top-16 z-10 bg-background/95 backdrop-blur-sm border-b pb-4">
          <AuthorizationSummary 
            request={authorizationRequest}
            validationResult={validationResult}
            onSectionChange={handleSectionChange}
          />
        </div>

        {/* Validation Checklist */}
        {!validationResult.isValid && (
          <ValidationChecklist validationResult={validationResult} />
        )}

        {/* Section Navigation */}
        <SectionNavigation
          sections={authorizationRequest.sections}
          currentSection={currentSection}
          onSectionChange={handleSectionChange}
          onContinue={handleContinue}
        />

        {/* Section Content */}
        <SectionContent
          section={authorizationRequest.sections[currentSection]}
          request={authorizationRequest}
        />

        {/* Action Buttons - Sticky Footer */}
        <div className="sticky bottom-0 z-10 bg-background/95 backdrop-blur-sm border-t pt-4 pb-safe">
          <ActionButtons
            request={authorizationRequest}
            validationResult={validationResult}
            userRole={user?.role || 'manager'}
            onActionComplete={handleActionComplete}
          />
        </div>
      </main>
    </div>
  );
};

export default AuthorizationDetails;