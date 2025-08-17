import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import CircularProgress from '@/components/requestForm/CircularProgress';
const MonthlyGoalCard = () => {
  const [selectedPeriod, setSelectedPeriod] = useState<'W' | 'M' | 'Y'>('M');

  // Mock data - in real app this would come from props or API
  const currentValue = 750000;
  const targetValue = 1000000;
  const progress = currentValue / targetValue * 100;
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-GT', {
      style: 'currency',
      currency: 'GTQ',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };
  const periods = [{
    key: 'W' as const,
    label: 'W'
  }, {
    key: 'M' as const,
    label: 'M'
  }, {
    key: 'Y' as const,
    label: 'Y'
  }];
  return <Card className="mb-6">
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-1">
              Meta de Colocación
            </h3>
            <p className="text-sm text-muted-foreground">
              Progreso mensual de créditos colocados
            </p>
          </div>
          
          {/* Period Toggle */}
          
        </div>
        
        <div className="flex items-center justify-between">
          {/* Progress Circle */}
          <div className="flex items-center gap-6">
            <CircularProgress progress={progress} size={120} strokeWidth={8} />
            
            {/* Values */}
            <div className="space-y-3">
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide">
                  ACTUAL
                </p>
                <p className="text-2xl font-bold text-foreground">
                  {formatCurrency(currentValue)}
                </p>
              </div>
              
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide">
                  META
                </p>
                <p className="text-lg font-semibold text-muted-foreground">
                  {formatCurrency(targetValue)}
                </p>
              </div>
              
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide">
                  RESTANTE
                </p>
                <p className="text-lg font-semibold text-amber-600">
                  {formatCurrency(targetValue - currentValue)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>;
};
export default MonthlyGoalCard;