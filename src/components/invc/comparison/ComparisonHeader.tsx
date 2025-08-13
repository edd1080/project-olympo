import React from 'react';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, AlertTriangle, Clock } from 'lucide-react';
import type { ComparisonInvestigation } from '@/types/invc-comparison';

interface ComparisonHeaderProps {
  comparison: ComparisonInvestigation;
}

export const ComparisonHeader: React.FC<ComparisonHeaderProps> = ({ comparison }) => {
  const { summary } = comparison;
  
  const getStatusIcon = () => {
    switch (summary.overallStatus) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'in_progress':
        return <Clock className="h-5 w-5 text-blue-600" />;
      case 'blocked':
        return <AlertTriangle className="h-5 w-5 text-red-600" />;
      default:
        return <Clock className="h-5 w-5 text-muted-foreground" />;
    }
  };

  const getStatusBadge = () => {
    switch (summary.overallStatus) {
      case 'completed':
        return <Badge variant="default" className="bg-green-100 text-green-800">Completado</Badge>;
      case 'in_progress':
        return <Badge variant="default" className="bg-blue-100 text-blue-800">En Progreso</Badge>;
      case 'blocked':
        return <Badge variant="destructive">Bloqueado</Badge>;
      default:
        return <Badge variant="secondary">Pendiente</Badge>;
    }
  };

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          {getStatusIcon()}
          <div>
            <h2 className="text-xl font-semibold">Comparación de Datos</h2>
            <p className="text-sm text-muted-foreground">
              Solicitud {comparison.applicationData.id}
            </p>
          </div>
        </div>
        {getStatusBadge()}
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between text-sm">
          <span>Progreso General</span>
          <span className="font-medium">
            {summary.completedFields}/{summary.totalFields} campos
          </span>
        </div>
        
        <Progress 
          value={(summary.completedFields / summary.totalFields) * 100} 
          className="h-2"
        />

        <div className="grid grid-cols-3 gap-4 text-sm">
          <div className="text-center">
            <div className="font-medium text-green-600">{summary.confirmedFields}</div>
            <div className="text-muted-foreground">Confirmados</div>
          </div>
          <div className="text-center">
            <div className="font-medium text-orange-600">{summary.adjustedFields}</div>
            <div className="text-muted-foreground">Ajustados</div>
          </div>
          <div className="text-center">
            <div className="font-medium text-red-600">{summary.blockedFields}</div>
            <div className="text-muted-foreground">Bloqueados</div>
          </div>
        </div>
      </div>
    </Card>
  );
};