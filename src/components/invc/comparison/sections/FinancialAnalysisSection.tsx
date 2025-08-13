import React from 'react';
import { ComparisonRow } from '../ComparisonRow';
import { DifferenceIndicator } from '../components/DifferenceIndicator';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, AlertTriangle } from 'lucide-react';
import type { INVCSection } from '@/types/invc-comparison';

interface FinancialAnalysisSectionProps {
  section: INVCSection;
  applicationId: string;
}

export const FinancialAnalysisSection: React.FC<FinancialAnalysisSectionProps> = ({ 
  section, 
  applicationId 
}) => {
  // Calcular métricas financieras
  const incomesField = section.fields.find(f => f.fieldName === 'monthly_income');
  const expensesField = section.fields.find(f => f.fieldName === 'monthly_expenses');
  
  const declaredIncome = incomesField?.declaredValue || 0;
  const observedIncome = incomesField?.observedValue || declaredIncome;
  const declaredExpenses = expensesField?.declaredValue || 0;
  const observedExpenses = expensesField?.observedValue || declaredExpenses;
  
  const declaredCapacity = declaredIncome - declaredExpenses;
  const observedCapacity = observedIncome - observedExpenses;
  
  const capacityDifference = observedCapacity - declaredCapacity;
  const capacityDifferencePercent = declaredCapacity !== 0 
    ? (capacityDifference / declaredCapacity) * 100 
    : 0;

  const getRiskLevel = () => {
    if (Math.abs(capacityDifferencePercent) > 20) return 'high';
    if (Math.abs(capacityDifferencePercent) > 15) return 'medium';
    return 'low';
  };

  const getRiskColor = () => {
    const risk = getRiskLevel();
    switch (risk) {
      case 'high': return 'text-red-600';
      case 'medium': return 'text-orange-600';
      default: return 'text-green-600';
    }
  };

  const getRiskIcon = () => {
    const risk = getRiskLevel();
    switch (risk) {
      case 'high': return <AlertTriangle className="h-4 w-4" />;
      case 'medium': return capacityDifference > 0 ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />;
      default: return capacityDifference > 0 ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-4">
      <div className="text-sm text-muted-foreground mb-4">
        Verificar los montos financieros declarados y evaluar la capacidad de pago real.
      </div>
      
      {section.fields.map((field) => (
        <ComparisonRow
          key={field.id}
          field={field}
          onObservedChange={(value) => {
            console.log('Observed change:', field.fieldName, value);
          }}
          onConfirm={() => {
            console.log('Confirmed:', field.fieldName);
          }}
          onAdjust={(reason, comment) => {
            console.log('Adjusted:', field.fieldName, reason, comment);
          }}
          onBlock={(reason, comment) => {
            console.log('Blocked:', field.fieldName, reason, comment);
          }}
          showDifference={true}
        />
      ))}

      {/* Resumen de Capacidad de Pago */}
      <Card className="mt-6">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            Análisis de Capacidad de Pago
            <Badge variant={getRiskLevel() === 'high' ? 'destructive' : getRiskLevel() === 'medium' ? 'secondary' : 'default'}>
              {getRiskLevel() === 'high' ? 'Riesgo Alto' : getRiskLevel() === 'medium' ? 'Riesgo Medio' : 'Riesgo Bajo'}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium text-sm mb-2">Declarado</h4>
              <div className="space-y-1 text-sm">
                <div>Ingresos: Q{declaredIncome.toLocaleString()}</div>
                <div>Egresos: Q{declaredExpenses.toLocaleString()}</div>
                <div className="font-medium">Capacidad: Q{declaredCapacity.toLocaleString()}</div>
              </div>
            </div>
            <div>
              <h4 className="font-medium text-sm mb-2">Observado</h4>
              <div className="space-y-1 text-sm">
                <div>Ingresos: Q{observedIncome.toLocaleString()}</div>
                <div>Egresos: Q{observedExpenses.toLocaleString()}</div>
                <div className="font-medium">Capacidad: Q{observedCapacity.toLocaleString()}</div>
              </div>
            </div>
          </div>

          <div className={`flex items-center gap-2 ${getRiskColor()}`}>
            {getRiskIcon()}
            <span className="font-medium">
              Diferencia: {capacityDifference > 0 ? '+' : ''}Q{capacityDifference.toLocaleString()} 
              ({capacityDifferencePercent > 0 ? '+' : ''}{capacityDifferencePercent.toFixed(1)}%)
            </span>
          </div>

          <DifferenceIndicator 
            difference={capacityDifferencePercent}
            threshold={15}
            type="percentage"
          />
        </CardContent>
      </Card>

      <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
        <h4 className="font-medium text-orange-900 mb-2">Umbrales de Validación</h4>
        <ul className="text-sm text-orange-800 space-y-1">
          <li>• Ingresos: ±15% considera diferencia significativa</li>
          <li>• Egresos: ±20% considera diferencia significativa</li>
          <li>• Capacidad de pago: &gt;20% requiere ajuste de monto</li>
          <li>• Capacidad negativa: bloqueo automático de solicitud</li>
        </ul>
      </div>
    </div>
  );
};