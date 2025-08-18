import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AuthorizationRequest, ValidationResult } from '@/types/authorization';
import { DollarSign, Calendar, FileText, CheckCircle, AlertTriangle, TrendingDown } from 'lucide-react';

interface AuthorizationSummaryProps {
  request: AuthorizationRequest;
  validationResult: ValidationResult;
  onSectionChange: (sectionIndex: number) => void;
}

export const AuthorizationSummary: React.FC<AuthorizationSummaryProps> = ({
  request,
  validationResult,
  onSectionChange
}) => {

  const getStatusBadge = (status: string) => {
    const variants = {
      pending: { 
        variant: 'outline' as const, 
        label: 'Pendiente',
        className: 'border-amber-500 text-amber-700 bg-amber-50 dark:border-amber-700 dark:text-amber-300 dark:bg-amber-950/20'
      },
      approved: { variant: 'secondary' as const, label: 'Aprobada', className: '' },
      rejected: { variant: 'destructive' as const, label: 'Rechazada', className: '' },
      returned: { variant: 'outline' as const, label: 'Devuelta', className: '' },
      recommended: { variant: 'secondary' as const, label: 'Recomendada', className: '' },
      not_recommended: { variant: 'destructive' as const, label: 'No Recomendada', className: '' },
    };
    
    return variants[status as keyof typeof variants] || variants.pending;
  };

  const statusBadge = getStatusBadge(request.status);

  return (
    <Card>
      <CardContent className="p-4 space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="space-y-1 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="font-semibold text-lg">{request.applicantName}</h2>
              <Badge {...statusBadge} className={statusBadge.className}>
                {statusBadge.label}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">
              {request.id} • DPI: {request.dpi}
            </p>
            {/* Progress - moved here below the name */}
            <div className="space-y-2 mt-3">
              <div className="flex items-center justify-between text-sm">
                <span>Progreso del expediente</span>
                <span className="font-medium">{request.completionPercentage}%</span>
              </div>
              <Progress value={request.completionPercentage} className="h-2" />
            </div>
          </div>
        </div>

        {/* Key Financial Info */}
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="font-medium">Q{request.amount.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground">{request.product}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="font-medium">{request.term} meses</p>
              <p className="text-xs text-muted-foreground">Plazo</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <FileText className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="font-medium">Recomendacion: Aprobar.</p>
              <p className="text-xs text-muted-foreground">{request.businessType}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <FileText className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="font-medium">INVC: {request.invcResult}</p>
              <p className="text-xs text-muted-foreground">Verificación</p>
            </div>
          </div>
        </div>

        {/* Validation Status */}
        <div className="flex items-center gap-2">
          {validationResult.isValid ? (
            <>
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span className="text-sm text-green-600 font-medium">Listo para autorización</span>
            </>
          ) : (
            <>
              <AlertTriangle className="h-4 w-4 text-amber-600" />
              <span className="text-sm text-amber-600 font-medium">
                {validationResult.blockedReasons.length} pendiente(s)
              </span>
            </>
          )}
        </div>

        {/* Alert Message for Manager Attention */}
        <Alert className="border-amber-200 bg-amber-50 dark:bg-amber-950/10 dark:border-amber-800">
          <TrendingDown className="h-4 w-4 text-amber-600" />
          <AlertDescription className="text-amber-800 dark:text-amber-200">
            <span className="font-medium">Atención requerida:</span> Se requiere revisión detallada del Análisis Financiero. 
            Revisar ratios de liquidez y capacidad de pago antes de proceder con la autorización.
            <Button
              variant="link"
              size="sm"
              onClick={() => onSectionChange(3)}
              className="ml-2 p-0 h-auto text-amber-700 dark:text-amber-300 hover:text-amber-900 dark:hover:text-amber-100"
            >
              Ir a Análisis Financiero →
            </Button>
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
};