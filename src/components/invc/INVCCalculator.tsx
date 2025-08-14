import React, { useState } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Calculator, CheckCircle } from 'lucide-react';

interface INVCCalculatorProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (newAmount: number, term: number, newQuota: number) => void;
  currentAmount: number;
  currentTerm: number;
  currentQuota: number;
}

export const INVCCalculator: React.FC<INVCCalculatorProps> = ({
  isOpen,
  onClose,
  onConfirm,
  currentAmount,
  currentTerm,
  currentQuota
}) => {
  const [amount, setAmount] = useState(Math.min(currentAmount, 50000)); // No puede exceder el original
  const [term, setTerm] = useState(currentTerm);

  const interestRate = 0.025; // 2.5% mensual (ejemplo)

  const calculateQuota = (principal: number, termMonths: number, monthlyRate: number): number => {
    if (monthlyRate === 0) return principal / termMonths;
    
    const quota = (principal * monthlyRate * Math.pow(1 + monthlyRate, termMonths)) / 
                   (Math.pow(1 + monthlyRate, termMonths) - 1);
    
    return Math.round(quota);
  };

  const newQuota = calculateQuota(amount, term, interestRate);
  const totalPayment = newQuota * term;
  const totalInterest = totalPayment - amount;

  const formatCurrency = (value: number) => {
    return `Q${value.toLocaleString('es-GT', { minimumFractionDigits: 2 })}`;
  };

  const handleConfirm = () => {
    onConfirm(amount, term, newQuota);
    onClose();
  };

  const reductionAmount = currentAmount - amount;
  const reductionPercentage = Math.round((reductionAmount / currentAmount) * 100);

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="bottom" className="h-[90vh]">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <Calculator className="w-5 h-5" />
            Calculadora de Crédito
          </SheetTitle>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          {/* Current vs New Comparison */}
          <Card className="p-4 bg-blue-50 dark:bg-blue-900/20 border-blue-200">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  Solicitud Original
                </div>
                <div className="mt-1">
                  <div className="text-lg font-semibold">{formatCurrency(currentAmount)}</div>
                  <div className="text-sm text-muted-foreground">{currentTerm} cuotas de {formatCurrency(currentQuota)}</div>
                </div>
              </div>
              <div>
                <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  Propuesta Ajustada
                </div>
                <div className="mt-1">
                  <div className="text-lg font-semibold text-primary">{formatCurrency(amount)}</div>
                  <div className="text-sm text-muted-foreground">{term} cuotas de {formatCurrency(newQuota)}</div>
                </div>
              </div>
            </div>
            
            {reductionAmount > 0 && (
              <div className="mt-3 pt-3 border-t border-blue-200">
                <Badge variant="secondary" className="text-sm">
                  Reducción: {formatCurrency(reductionAmount)} ({reductionPercentage}%)
                </Badge>
              </div>
            )}
          </Card>

          {/* Amount Slider */}
          <div>
            <label className="block text-sm font-medium mb-3">
              Monto del Crédito: {formatCurrency(amount)}
            </label>
            <Slider
              value={[amount]}
              onValueChange={(value) => setAmount(value[0])}
              max={Math.min(currentAmount, 50000)} // No puede exceder el original ni Q50,000
              min={2500}
              step={500}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>Q2,500</span>
              <span>Q{Math.min(currentAmount, 50000).toLocaleString()}</span>
            </div>
          </div>

          {/* Term Selection */}
          <div>
            <label className="block text-sm font-medium mb-3">
              Plazo (meses)
            </label>
            <div className="grid grid-cols-4 gap-2">
              {[6, 9, 12, 18].map((months) => (
                <Button
                  key={months}
                  variant={term === months ? "default" : "outline"}
                  onClick={() => setTerm(months)}
                  className="h-12"
                >
                  {months}
                </Button>
              ))}
            </div>
          </div>

          {/* Payment Summary */}
          <Card className="p-4">
            <h3 className="font-medium mb-3">Resumen de Pagos</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Cuota mensual:</span>
                <span className="font-medium">{formatCurrency(newQuota)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Total a pagar:</span>
                <span className="font-medium">{formatCurrency(totalPayment)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Total intereses:</span>
                <span className="font-medium">{formatCurrency(totalInterest)}</span>
              </div>
              <div className="pt-2 border-t">
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Plazo:</span>
                  <span className="font-medium">{term} cuotas</span>
                </div>
              </div>
            </div>
          </Card>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button
              onClick={handleConfirm}
              className="flex-1"
              disabled={amount >= currentAmount} // Solo permitir reducciones
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              Confirmar Ajuste
            </Button>
          </div>

          {amount >= currentAmount && (
            <div className="text-center text-sm text-muted-foreground">
              Solo se permiten reducciones del monto original
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};