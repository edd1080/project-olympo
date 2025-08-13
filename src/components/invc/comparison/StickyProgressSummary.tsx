import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle } from 'lucide-react';
import type { ComparisonInvestigation } from '@/types/invc-comparison';

interface StickyProgressSummaryProps {
  comparison: ComparisonInvestigation;
}

export const StickyProgressSummary: React.FC<StickyProgressSummaryProps> = ({ comparison }) => {
  const { summary, detectedDifferences } = comparison;
  
  const criticalIssues = detectedDifferences.filter(diff => diff.severity === 'critical');
  const hasIssues = criticalIssues.length > 0;

  if (!hasIssues && summary.overallStatus === 'completed') {
    return null;
  }

  return (
    <div className="sticky top-4 z-10">
      <Card className="p-4 border-l-4 border-l-orange-500 bg-orange-50">
        <div className="flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 text-orange-600 mt-0.5" />
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="font-medium text-orange-900">
                Resumen de Diferencias
              </h3>
              {hasIssues && (
                <Badge variant="destructive" className="text-xs">
                  {criticalIssues.length} críticas
                </Badge>
              )}
            </div>
            
            <div className="text-sm text-orange-800 space-y-1">
              {summary.overallRisk === 'high' && (
                <p>• Riesgo alto detectado - Revisar campos críticos</p>
              )}
              {summary.recommendedAction === 'adjust_credit' && (
                <p>• Se recomienda ajustar monto del crédito</p>
              )}
              {summary.recommendedAction === 'reject' && (
                <p>• Se recomienda rechazar la solicitud</p>
              )}
              {summary.recommendedAction === 'additional_verification' && (
                <p>• Se requiere verificación adicional</p>
              )}
            </div>

            {criticalIssues.length > 0 && (
              <div className="mt-3 space-y-1">
                <p className="text-xs font-medium text-orange-900">
                  Diferencias críticas:
                </p>
                {criticalIssues.slice(0, 3).map((diff, index) => (
                  <p key={index} className="text-xs text-orange-800">
                    • {diff.fieldName}: {diff.description}
                  </p>
                ))}
                {criticalIssues.length > 3 && (
                  <p className="text-xs text-orange-700">
                    ... y {criticalIssues.length - 3} más
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
};