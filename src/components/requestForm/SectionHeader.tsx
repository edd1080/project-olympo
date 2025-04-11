
import React from 'react';
import { CheckCircle, Clock, User, Briefcase, DollarSign, Calculator, FileCheck, CheckSquare } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface SectionHeaderProps {
  sectionId: string;
  currentStep: number;
  totalSteps: number;
  status: 'pending' | 'complete';
}

const SectionHeader: React.FC<SectionHeaderProps> = ({ 
  sectionId, 
  currentStep, 
  totalSteps,
  status
}) => {
  // Get icon based on section ID
  const getSectionIcon = () => {
    switch (sectionId) {
      case 'personal':
        return <User className="h-5 w-5 text-primary" />;
      case 'character':
        return <CheckSquare className="h-5 w-5 text-primary" />;
      case 'work':
        return <Briefcase className="h-5 w-5 text-primary" />;
      case 'finances':
        return <DollarSign className="h-5 w-5 text-primary" />;
      case 'evaluation':
        return <Calculator className="h-5 w-5 text-primary" />;
      case 'documents':
        return <FileCheck className="h-5 w-5 text-primary" />;
      case 'consent':
        return <CheckCircle className="h-5 w-5 text-primary" />;
      default:
        return <User className="h-5 w-5 text-primary" />;
    }
  };

  // Get section title based on section ID
  const getSectionTitle = () => {
    switch (sectionId) {
      case 'personal':
        return 'Información Personal';
      case 'character':
        return 'Análisis de Carácter';
      case 'work':
        return 'Información Laboral';
      case 'finances':
        return 'Información Financiera';
      case 'evaluation':
        return 'Evaluación Crediticia';
      case 'documents':
        return 'Documentos';
      case 'consent':
        return 'Consentimiento';
      case 'signature':
        return 'Firma de Acta';
      case 'guarantors':
        return 'Fiadores';
      default:
        return 'Sección';
    }
  };

  // Get section instructions based on section ID
  const getSectionInstructions = () => {
    switch (sectionId) {
      case 'personal':
        return 'Complete todos los datos personales del solicitante, incluyendo información del cónyuge y dependientes si aplica.';
      case 'character':
        return 'Evalúe el comportamiento y contexto social o financiero del solicitante. Identifique posibles riesgos.';
      case 'finances':
        return 'Ingrese información general financiera, desglose de ingresos y egresos del solicitante.';
      case 'documents':
        return 'Suba fotografías del solicitante, documentos de identificación, comprobantes de domicilio y firma.';
      case 'consent':
        return 'El solicitante debe revisar y aceptar los términos y condiciones del crédito antes de firmar.';
      case 'signature':
        return 'Capture la firma del solicitante y fotografías de la reunión si es necesario.';
      case 'guarantors':
        return 'Agregue hasta 3 fiadores con su información y porcentaje de cobertura de la deuda.';
      default:
        return 'Complete todos los campos requeridos en esta sección.';
    }
  };

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-12 h-12 bg-primary/10 rounded-full">
            {getSectionIcon()}
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">{getSectionTitle()}</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">Paso {currentStep} de {totalSteps}</p>
          </div>
        </div>
        <Badge 
          variant={status === 'complete' ? 'default' : 'outline'} 
          className={status === 'complete' 
            ? "bg-green-100 hover:bg-green-200 text-green-800 dark:bg-green-900 dark:text-green-200"
            : "bg-amber-100 hover:bg-amber-200 text-amber-800 dark:bg-amber-900 dark:text-amber-200"
          }
        >
          {status === 'complete' ? (
            <span className="flex items-center gap-1">
              <CheckCircle className="h-3.5 w-3.5 mr-1" />
              Completado
            </span>
          ) : (
            <span className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5 mr-1" />
              Pendiente
            </span>
          )}
        </Badge>
      </div>
      <div className="h-px bg-gray-200 dark:bg-gray-700 w-full mt-4 mb-4"></div>
      
      <Alert className="bg-muted/50 border-muted mb-6">
        <AlertDescription className="text-foreground font-medium">
          {getSectionInstructions()}
        </AlertDescription>
      </Alert>
    </div>
  );
};

export default SectionHeader;
