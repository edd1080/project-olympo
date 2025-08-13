import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useComparison } from '@/context/ComparisonContext';
import { useInvestigation } from '@/context/InvestigationContext';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, AlertTriangle } from 'lucide-react';
import { canFinalizeInvestigation } from '@/utils/comparisonHelpers';
import type { ComparisonInvestigation } from '@/types/invc-comparison';

interface ComparisonFooterProps {
  comparison: ComparisonInvestigation;
  applicationId: string;
}

export const ComparisonFooter: React.FC<ComparisonFooterProps> = ({ 
  comparison, 
  applicationId 
}) => {
  const { finalizeComparison } = useComparison();
  const navigate = useNavigate();

  const canFinalize = canFinalizeInvestigation(comparison);
  const { summary } = comparison;

  const handleFinalize = async () => {
    try {
      // Finalizar comparación
      const result = await finalizeComparison(applicationId);
      
      // Navegar a detalles de aplicación
      navigate(`/application-details/${applicationId}`);
    } catch (error) {
      console.error('Error al finalizar comparación:', error);
    }
  };

  const getFinalizationMessage = () => {
    if (!canFinalize) {
      return 'Complete todos los campos obligatorios para finalizar';
    }
    
    if (summary.overallRisk === 'high') {
      return 'Investigación completada - Riesgo alto detectado';
    }
    
    if (summary.adjustedFields > 0) {
      return `Investigación completada - ${summary.adjustedFields} ajustes realizados`;
    }
    
    return 'Investigación completada - Datos confirmados';
  };

  const getButtonVariant = () => {
    if (!canFinalize) return 'secondary';
    if (summary.overallRisk === 'high') return 'destructive';
    return 'default';
  };

  const getButtonIcon = () => {
    if (!canFinalize) return <AlertTriangle className="h-4 w-4" />;
    return <CheckCircle className="h-4 w-4" />;
  };

  return (
    <div className="sticky bottom-0 z-10 bg-background/80 backdrop-blur-sm border-t">
      <Card className="m-4 p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium">
              {getFinalizationMessage()}
            </p>
            <p className="text-xs text-muted-foreground">
              {summary.completedFields}/{summary.totalFields} campos completados
            </p>
          </div>
          
          <Button
            onClick={handleFinalize}
            disabled={!canFinalize}
            variant={getButtonVariant()}
            size="lg"
            className="gap-2"
          >
            {getButtonIcon()}
            Finalizar INVC
          </Button>
        </div>
        
        {summary.overallRisk === 'high' && (
          <div className="mt-3 p-3 bg-red-50 rounded-lg border border-red-200">
            <div className="flex items-start gap-2">
              <AlertTriangle className="h-4 w-4 text-red-600 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium text-red-900">Riesgo Alto Detectado</p>
                <p className="text-red-800">
                  Revisar recomendación: {summary.recommendedAction === 'reject' ? 'Rechazar solicitud' : 'Verificación adicional'}
                </p>
              </div>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};