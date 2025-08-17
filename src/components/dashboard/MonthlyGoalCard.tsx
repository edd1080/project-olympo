import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import CircularProgress from '@/components/requestForm/CircularProgress';
import { useIsMobile } from '@/hooks/use-mobile';

const MonthlyGoalCard = () => {
  const [selectedPeriod, setSelectedPeriod] = useState<'W' | 'M' | 'Y'>('M');
  const isMobile = useIsMobile();
  
  // Mock data - in real app this would come from props or API
  const currentValue = 750000;
  const targetValue = 1000000;
  const progress = (currentValue / targetValue) * 100;
  
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-GT', {
      style: 'currency',
      currency: 'GTQ',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const periods = [
    { key: 'W' as const, label: 'W' },
    { key: 'M' as const, label: 'M' },
    { key: 'Y' as const, label: 'Y' },
  ];

  return (
    <Card className="mb-6">
      <CardContent className="p-6">
        <div className={`flex ${isMobile ? 'flex-col space-y-4' : 'justify-between items-start'} mb-6`}>
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-1">
              Meta de Colocación
            </h3>
            <p className="text-sm text-muted-foreground">
              Progreso mensual de créditos colocados
            </p>
          </div>
          
          {/* Period Toggle - Hidden on mobile */}
          {!isMobile && (
            <div className="flex bg-muted rounded-lg p-1">
              {periods.map((period) => (
                <Button
                  key={period.key}
                  variant={selectedPeriod === period.key ? "default" : "ghost"}
                  size="sm"
                  className="px-3 py-1 h-8 text-xs font-medium"
                  onClick={() => setSelectedPeriod(period.key)}
                >
                  {period.label}
                </Button>
              ))}
            </div>
          )}
        </div>
        
        <div className={`flex items-center ${isMobile ? 'flex-col space-y-6' : 'justify-between gap-8'}`}>
          {/* Metrics on left */}
          <div className={`space-y-4 ${isMobile ? 'text-center order-2' : 'flex-1'}`}>
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                ACTUAL
              </p>
              <p className={`${isMobile ? 'text-xl' : 'text-2xl'} font-bold text-foreground`}>
                {formatCurrency(currentValue)}
              </p>
            </div>
            
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                META
              </p>
              <p className={`${isMobile ? 'text-base' : 'text-lg'} font-semibold text-muted-foreground`}>
                {formatCurrency(targetValue)}
              </p>
            </div>
            
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                RESTANTE
              </p>
              <p className={`${isMobile ? 'text-base' : 'text-lg'} font-semibold text-amber-600`}>
                {formatCurrency(targetValue - currentValue)}
              </p>
            </div>
          </div>

          {/* Progress Circle on right */}
          <div className={`${isMobile ? 'order-1' : ''}`}>
            <CircularProgress 
              progress={progress} 
              size={isMobile ? 100 : 140} 
              strokeWidth={isMobile ? 8 : 10}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MonthlyGoalCard;