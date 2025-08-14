import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dictamen } from '@/types/authorization';
import { DollarSign, Calendar, Percent, Shield, CreditCard, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';

interface DictamenViewProps {
  dictamen: Dictamen;
}

export const DictamenView: React.FC<DictamenViewProps> = ({ dictamen }) => {
  const getEvaluationIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'conditional':
        return <AlertTriangle className="h-4 w-4 text-amber-600" />;
      case 'rejected':
        return <XCircle className="h-4 w-4 text-red-600" />;
      default:
        return <AlertTriangle className="h-4 w-4 text-gray-600" />;
    }
  };

  const getEvaluationBadge = (status: string) => {
    const variants = {
      approved: { variant: 'secondary' as const, label: 'Aprobado' },
      conditional: { variant: 'default' as const, label: 'Condicional' },
      rejected: { variant: 'destructive' as const, label: 'Rechazado' },
    };
    
    return variants[status as keyof typeof variants] || variants.conditional;
  };

  return (
    <div className="space-y-6">
      {/* Credit Details */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Crédito Recomendado
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-3">
              <DollarSign className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Monto</p>
                <p className="font-semibold">Q{dictamen.creditAmount.toLocaleString()}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Plazo</p>
                <p className="font-semibold">{dictamen.term} meses</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Percent className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Tasa</p>
                <p className="font-semibold">{dictamen.rate}% anual</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Shield className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Garantía</p>
                <p className="font-semibold">{dictamen.guarantee}</p>
              </div>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t">
            <div className="flex items-center gap-3">
              <CreditCard className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Forma de pago</p>
                <p className="font-semibold">{dictamen.paymentMethod}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Evaluations */}
      <Card>
        <CardHeader>
          <CardTitle>Evaluaciones</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* SIB Evaluation */}
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                {getEvaluationIcon(dictamen.evaluations.sib.status)}
                <div>
                  <p className="font-medium">Evaluación SIB</p>
                  <p className="text-sm text-muted-foreground">{dictamen.evaluations.sib.details}</p>
                </div>
              </div>
              <div className="text-right">
                <Badge {...getEvaluationBadge(dictamen.evaluations.sib.status)}>
                  {getEvaluationBadge(dictamen.evaluations.sib.status).label}
                </Badge>
                <p className="text-sm text-muted-foreground mt-1">Score: {dictamen.evaluations.sib.score}</p>
              </div>
            </div>

            {/* Internal Evaluation */}
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                {getEvaluationIcon(dictamen.evaluations.internal.status)}
                <div>
                  <p className="font-medium">Evaluación Interna</p>
                  <p className="text-sm text-muted-foreground">{dictamen.evaluations.internal.details}</p>
                </div>
              </div>
              <div className="text-right">
                <Badge {...getEvaluationBadge(dictamen.evaluations.internal.status)}>
                  {getEvaluationBadge(dictamen.evaluations.internal.status).label}
                </Badge>
                <p className="text-sm text-muted-foreground mt-1">Score: {dictamen.evaluations.internal.score}</p>
              </div>
            </div>

            {/* Prequalifier Evaluation */}
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                {getEvaluationIcon(dictamen.evaluations.prequalifier.status)}
                <div>
                  <p className="font-medium">Precalificador</p>
                  <p className="text-sm text-muted-foreground">{dictamen.evaluations.prequalifier.details}</p>
                </div>
              </div>
              <div className="text-right">
                <Badge {...getEvaluationBadge(dictamen.evaluations.prequalifier.status)}>
                  {getEvaluationBadge(dictamen.evaluations.prequalifier.status).label}
                </Badge>
                <p className="text-sm text-muted-foreground mt-1">Score: {dictamen.evaluations.prequalifier.score}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payment Capacity */}
      <Card>
        <CardHeader>
          <CardTitle>Capacidad de Pago</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Ingresos mensuales</p>
              <p className="font-semibold text-lg">Q{dictamen.paymentCapacity.monthlyIncome.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Egresos mensuales</p>
              <p className="font-semibold text-lg">Q{dictamen.paymentCapacity.monthlyExpenses.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Capacidad disponible</p>
              <p className="font-semibold text-lg text-green-600">Q{dictamen.paymentCapacity.availableCapacity.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Cuota recomendada</p>
              <p className="font-semibold text-lg">Q{dictamen.paymentCapacity.recommendedPayment.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Ratio deuda/ingreso</p>
              <p className="font-semibold">{(dictamen.paymentCapacity.debtToIncomeRatio * 100).toFixed(1)}%</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Liquidez</p>
              <p className="font-semibold">{dictamen.paymentCapacity.liquidity}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Signatures */}
      <Card>
        <CardHeader>
          <CardTitle>Firmas y Aprobaciones</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <p className="font-medium">{dictamen.signatures.agent.name}</p>
                <p className="text-sm text-muted-foreground">{dictamen.signatures.agent.role}</p>
              </div>
              <div className="text-right">
                <Badge variant="secondary">Firmado</Badge>
                <p className="text-sm text-muted-foreground">{dictamen.signatures.agent.date}</p>
              </div>
            </div>
            
            {dictamen.signatures.manager && (
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="font-medium">{dictamen.signatures.manager.name}</p>
                  <p className="text-sm text-muted-foreground">{dictamen.signatures.manager.role}</p>
                </div>
                <div className="text-right">
                  <Badge variant={dictamen.signatures.manager.digitallySigned ? "secondary" : "outline"}>
                    {dictamen.signatures.manager.digitallySigned ? "Firmado" : "Pendiente"}
                  </Badge>
                  <p className="text-sm text-muted-foreground">{dictamen.signatures.manager.date}</p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};