import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AuthorizationRequest } from '@/types/authorization';
import { TrendingUp, TrendingDown, DollarSign, Percent } from 'lucide-react';

interface FinancialAnalysisProps {
  request: AuthorizationRequest;
}

export const FinancialAnalysis: React.FC<FinancialAnalysisProps> = ({ request }) => {
  const { paymentCapacity } = request.dictamen;
  
  const getCapacityColor = (ratio: number) => {
    if (ratio < 0.3) return 'text-green-600';
    if (ratio < 0.5) return 'text-amber-600';
    return 'text-red-600';
  };

  const getRatioStatus = (ratio: number, thresholds: { good: number; warning: number }) => {
    if (ratio >= thresholds.good) return { color: 'text-green-600', status: 'Excelente' };
    if (ratio >= thresholds.warning) return { color: 'text-amber-600', status: 'Aceptable' };
    return { color: 'text-red-600', status: 'Riesgo' };
  };

  const liquidityStatus = getRatioStatus(paymentCapacity.liquidity, { good: 1.5, warning: 1.0 });
  const profitabilityStatus = getRatioStatus(paymentCapacity.profitability, { good: 0.15, warning: 0.10 });

  return (
    <div className="space-y-6">
      {/* Income vs Expenses */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Análisis de Ingresos y Egresos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <TrendingUp className="h-6 w-6 text-green-600 mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">Ingresos Mensuales</p>
              <p className="text-xl font-bold text-green-600">
                Q{paymentCapacity.monthlyIncome.toLocaleString()}
              </p>
            </div>
            <div className="text-center p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
              <TrendingDown className="h-6 w-6 text-red-600 mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">Egresos Mensuales</p>
              <p className="text-xl font-bold text-red-600">
                Q{paymentCapacity.monthlyExpenses.toLocaleString()}
              </p>
            </div>
            <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <DollarSign className="h-6 w-6 text-blue-600 mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">Capacidad Disponible</p>
              <p className="text-xl font-bold text-blue-600">
                Q{paymentCapacity.availableCapacity.toLocaleString()}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Financial Ratios */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Percent className="h-5 w-5" />
            Razones Financieras
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Debt to Income Ratio */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Ratio Deuda/Ingreso</span>
                <span className={`font-bold ${getCapacityColor(paymentCapacity.debtToIncomeRatio)}`}>
                  {(paymentCapacity.debtToIncomeRatio * 100).toFixed(1)}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full ${paymentCapacity.debtToIncomeRatio < 0.3 ? 'bg-green-600' : paymentCapacity.debtToIncomeRatio < 0.5 ? 'bg-amber-600' : 'bg-red-600'}`}
                  style={{ width: `${Math.min(paymentCapacity.debtToIncomeRatio * 100, 100)}%` }}
                ></div>
              </div>
              <p className="text-xs text-muted-foreground">
                Recomendado: &lt; 30%
              </p>
            </div>

            {/* Liquidity Ratio */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Ratio de Liquidez</span>
                <div className="text-right">
                  <span className={`font-bold ${liquidityStatus.color}`}>
                    {paymentCapacity.liquidity.toFixed(2)}
                  </span>
                  <p className={`text-xs ${liquidityStatus.color}`}>{liquidityStatus.status}</p>
                </div>
              </div>
            </div>

            {/* Profitability */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Rentabilidad</span>
                <div className="text-right">
                  <span className={`font-bold ${profitabilityStatus.color}`}>
                    {(paymentCapacity.profitability * 100).toFixed(1)}%
                  </span>
                  <p className={`text-xs ${profitabilityStatus.color}`}>{profitabilityStatus.status}</p>
                </div>
              </div>
            </div>

            {/* Current Ratio */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Ratio Corriente</span>
                <span className="font-bold">
                  {paymentCapacity.currentRatio.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payment Recommendation */}
      <Card>
        <CardHeader>
          <CardTitle>Recomendación de Pago</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="font-medium">Cuota Mensual Recomendada</span>
                <span className="text-xl font-bold text-blue-600">
                  Q{paymentCapacity.recommendedPayment.toLocaleString()}
                </span>
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                Representa el {((paymentCapacity.recommendedPayment / paymentCapacity.monthlyIncome) * 100).toFixed(1)}% 
                de los ingresos mensuales
              </p>
            </div>
            
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Capacidad total disponible</span>
                <p className="font-medium">Q{paymentCapacity.availableCapacity.toLocaleString()}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Margen de seguridad</span>
                <p className="font-medium">
                  Q{(paymentCapacity.availableCapacity - paymentCapacity.recommendedPayment).toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};