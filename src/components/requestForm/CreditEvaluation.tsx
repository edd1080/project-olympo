
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { CheckCircle, Calculator, ArrowRight, XCircle } from 'lucide-react';

interface CreditEvaluationProps {
  formData: any;
  updateFormData: (field: string, value: any) => void;
}

const CreditEvaluation: React.FC<CreditEvaluationProps> = ({ formData, updateFormData }) => {
  // Initial evaluation data - this would come from an API in production
  const [loanData, setLoanData] = useState({
    approvedAmount: formData.approvedAmount || 7500,
    months: formData.months || 12,
    monthlyPayment: formData.monthlyPayment || 750,
    interestRate: 15, // 15% annual interest rate
    minAmount: 2500,
    maxAmount: 9000,
    minMonths: 6,
    maxMonths: 24
  });

  const [showCalculator, setShowCalculator] = useState(false);
  const [customAmount, setCustomAmount] = useState(loanData.approvedAmount);
  const [customMonths, setCustomMonths] = useState(loanData.months);
  const [customPayment, setCustomPayment] = useState(loanData.monthlyPayment);

  // Calculate monthly payment when amount or months change
  useEffect(() => {
    const principal = customAmount;
    const monthlyRate = loanData.interestRate / 100 / 12;
    const payment = principal * monthlyRate * Math.pow(1 + monthlyRate, customMonths) / 
                   (Math.pow(1 + monthlyRate, customMonths) - 1);
    setCustomPayment(Math.round(payment));
  }, [customAmount, customMonths, loanData.interestRate]);

  // Update form data when loan details change
  useEffect(() => {
    updateFormData('approvedAmount', loanData.approvedAmount);
    updateFormData('months', loanData.months);
    updateFormData('monthlyPayment', loanData.monthlyPayment);
  }, [loanData]);

  const handleApproveCurrentOffer = () => {
    // Update form data with current values
    updateFormData('loanAccepted', true);
    updateFormData('customLoan', false);
  };

  const handleOpenCalculator = () => {
    setShowCalculator(true);
  };

  const handleSaveCustomValues = () => {
    setLoanData({
      ...loanData,
      approvedAmount: customAmount,
      months: customMonths,
      monthlyPayment: customPayment
    });

    updateFormData('approvedAmount', customAmount);
    updateFormData('months', customMonths);
    updateFormData('monthlyPayment', customPayment);
    updateFormData('loanAccepted', true);
    updateFormData('customLoan', true);
    
    setShowCalculator(false);
  };

  return (
    <div className="space-y-6">
      {/* Evaluation Result Card */}
      <div className="bg-gradient-to-br from-primary/10 to-primary/5 p-6 rounded-xl shadow-sm border border-primary/20 text-center">
        <div className="mx-auto w-16 h-16 bg-primary/15 rounded-full flex items-center justify-center mb-4">
          <CheckCircle className="h-8 w-8 text-primary" />
        </div>
        
        <h2 className="text-2xl font-bold mb-2">¡Evaluación Completada!</h2>
        <p className="text-muted-foreground mb-6">
          En base a la información proporcionada, hemos pre-aprobado la siguiente oferta:
        </p>
        
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="p-4 bg-background rounded-lg shadow-sm">
            <p className="text-sm text-muted-foreground">Monto Aprobado</p>
            <p className="text-2xl font-bold">Q{loanData.approvedAmount.toLocaleString()}</p>
          </div>
          <div className="p-4 bg-background rounded-lg shadow-sm">
            <p className="text-sm text-muted-foreground">Plazo</p>
            <p className="text-2xl font-bold">{loanData.months} meses</p>
          </div>
          <div className="p-4 bg-background rounded-lg shadow-sm">
            <p className="text-sm text-muted-foreground">Pago Mensual</p>
            <p className="text-2xl font-bold">Q{loanData.monthlyPayment.toLocaleString()}</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Button 
            onClick={handleApproveCurrentOffer} 
            className="w-full bg-primary/90 hover:bg-primary"
          >
            <CheckCircle className="mr-2 h-4 w-4" />
            Aceptar esta oferta
          </Button>
          <Button 
            variant="outline" 
            onClick={handleOpenCalculator}
            className="w-full border-primary/30 text-primary hover:bg-primary/10"
          >
            <Calculator className="mr-2 h-4 w-4" />
            Ajustar valores
          </Button>
        </div>
      </div>

      {/* Custom Loan Calculator Dialog */}
      <Dialog open={showCalculator} onOpenChange={setShowCalculator}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="text-xl">Calculadora de Préstamo</DialogTitle>
            <DialogDescription>
              Ajusta los valores para personalizar tu préstamo
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6 py-4">
            {/* Amount Slider */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Monto del Préstamo</span>
                <span className="text-lg font-bold">Q{customAmount.toLocaleString()}</span>
              </div>
              <Slider
                value={[customAmount]}
                min={loanData.minAmount}
                max={loanData.maxAmount}
                step={100}
                onValueChange={(value) => setCustomAmount(value[0])}
                className="py-4"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Q{loanData.minAmount.toLocaleString()}</span>
                <span>Q{loanData.maxAmount.toLocaleString()}</span>
              </div>
            </div>
            
            {/* Term Slider */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Plazo en Meses</span>
                <span className="text-lg font-bold">{customMonths} meses</span>
              </div>
              <Slider
                value={[customMonths]}
                min={loanData.minMonths}
                max={loanData.maxMonths}
                step={1}
                onValueChange={(value) => setCustomMonths(value[0])}
                className="py-4"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>{loanData.minMonths} meses</span>
                <span>{loanData.maxMonths} meses</span>
              </div>
            </div>
            
            {/* Summary */}
            <div className="bg-muted p-4 rounded-md">
              <div className="flex justify-between items-center">
                <span className="font-medium">Pago Mensual Estimado:</span>
                <span className="text-xl font-bold text-primary">Q{customPayment.toLocaleString()}</span>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Tasa de interés anual: {loanData.interestRate}% • 
                Monto total a pagar: Q{(customPayment * customMonths).toLocaleString()}
              </p>
            </div>
          </div>
          
          <div className="flex justify-end gap-3 mt-4">
            <Button variant="outline" onClick={() => setShowCalculator(false)}>
              <XCircle className="mr-2 h-4 w-4" />
              Cancelar
            </Button>
            <Button onClick={handleSaveCustomValues}>
              <CheckCircle className="mr-2 h-4 w-4" />
              Aceptar estos valores
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CreditEvaluation;
