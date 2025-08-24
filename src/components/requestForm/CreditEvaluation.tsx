import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { CheckCircle, Calculator, DollarSign, Calendar, TrendingUp, Sparkles } from 'lucide-react';
import { Label } from '@/components/ui/label';

interface CreditEvaluationProps {
  formData: any;
  updateFormData: (field: string, value: any) => void;
}

const CreditEvaluation: React.FC<CreditEvaluationProps> = ({ formData, updateFormData }) => {
  // Loan details from evaluation
  const [loanDetails, setLoanDetails] = useState({
    approvedAmount: 25000,
    termMonths: formData.termMonths || 12,
    interestRate: formData.interestRate || 18,
    monthlyPayment: 0
  });

  // Calculator state
  const [showCalculator, setShowCalculator] = useState(false);
  const [calculatorAmount, setCalculatorAmount] = useState([25000]);
  const [calculatorMonths, setCalculatorMonths] = useState([12]);
  const [calculatorPayment, setCalculatorPayment] = useState(0);

  // Calculate monthly payment
  useEffect(() => {
    const principal = loanDetails.approvedAmount;
    const monthlyRate = loanDetails.interestRate / 100 / 12;
    const numPayments = loanDetails.termMonths;
    
    const payment = (principal * monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / 
                    (Math.pow(1 + monthlyRate, numPayments) - 1);
    
    setLoanDetails(prev => ({ ...prev, monthlyPayment: Math.round(payment) }));
  }, [loanDetails.approvedAmount, loanDetails.termMonths, loanDetails.interestRate]);

  // Calculate payment for calculator
  useEffect(() => {
    const principal = calculatorAmount[0];
    const monthlyRate = loanDetails.interestRate / 100 / 12;
    const numPayments = calculatorMonths[0];
    
    const payment = (principal * monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / 
                    (Math.pow(1 + monthlyRate, numPayments) - 1);
    
    setCalculatorPayment(Math.round(payment));
  }, [calculatorAmount, calculatorMonths, loanDetails.interestRate]);

  const handleApproveCurrentOffer = () => {
    updateFormData('approvedLoanAmount', loanDetails.approvedAmount);
    updateFormData('approvedTermMonths', loanDetails.termMonths);
    updateFormData('approvedMonthlyPayment', loanDetails.monthlyPayment);
    updateFormData('creditEvaluationAccepted', true);
  };

  const handleOpenCalculator = () => {
    setCalculatorAmount([loanDetails.approvedAmount]);
    setCalculatorMonths([loanDetails.termMonths]);
    setShowCalculator(true);
  };

  const handleSaveCustomValues = () => {
    const newAmount = calculatorAmount[0];
    const newMonths = calculatorMonths[0];
    
    setLoanDetails(prev => ({
      ...prev,
      approvedAmount: newAmount,
      termMonths: newMonths
    }));
    
    updateFormData('approvedLoanAmount', newAmount);
    updateFormData('approvedTermMonths', newMonths);
    updateFormData('approvedMonthlyPayment', calculatorPayment);
    updateFormData('creditEvaluationAccepted', true);
    
    setShowCalculator(false);
  };

  // Update form data when loan details change
  useEffect(() => {
    updateFormData('evaluatedLoanAmount', loanDetails.approvedAmount);
    updateFormData('evaluatedTermMonths', loanDetails.termMonths);
    updateFormData('evaluatedMonthlyPayment', loanDetails.monthlyPayment);
  }, [loanDetails, updateFormData]);

  return (
    <div className="space-y-8">
      {/* Reveal animation container */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-2xl blur-xl -z-10"></div>
        
        <Card className="relative overflow-hidden border-2 border-primary/20 bg-gradient-to-br from-background via-background to-primary/5">
          <CardHeader className="text-center pb-4">
            <div className="flex justify-center mb-4">
              <div className="p-3 rounded-full bg-primary/10">
                <Sparkles className="h-8 w-8 text-primary" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold text-primary">
              ¡Felicidades!
            </CardTitle>
            <p className="text-muted-foreground">
              Su solicitud ha sido pre-aprobada
            </p>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Offer details */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 rounded-lg bg-primary/5 border border-primary/20">
                <DollarSign className="h-6 w-6 text-primary mx-auto mb-2" />
                <div className="text-sm text-muted-foreground">Monto Aprobado</div>
                <div className="text-2xl font-bold text-primary">
                  Q{loanDetails.approvedAmount.toLocaleString()}
                </div>
              </div>
              
              <div className="text-center p-4 rounded-lg bg-secondary/5 border border-secondary/20">
                <Calendar className="h-6 w-6 text-secondary mx-auto mb-2" />
                <div className="text-sm text-muted-foreground">Plazo</div>
                <div className="text-2xl font-bold text-secondary">
                  {loanDetails.termMonths} meses
                </div>
              </div>
              
              <div className="text-center p-4 rounded-lg bg-green-500/5 border border-green-500/20">
                <TrendingUp className="h-6 w-6 text-green-600 mx-auto mb-2" />
                <div className="text-sm text-muted-foreground">Cuota Mensual</div>
                <div className="text-2xl font-bold text-green-600">
                  Q{loanDetails.monthlyPayment.toLocaleString()}
                </div>
              </div>
            </div>

            {/* Interest rate badge */}
            <div className="flex justify-center">
              <Badge variant="outline" className="text-sm">
                Tasa de interés: {loanDetails.interestRate}% anual
              </Badge>
            </div>

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <Button 
                onClick={handleApproveCurrentOffer}
                className="flex-1 bg-primary hover:bg-primary/90"
                size="lg"
              >
                <CheckCircle className="h-5 w-5 mr-2" />
                Aceptar esta oferta
              </Button>
              
              <Button 
                onClick={handleOpenCalculator}
                variant="outline" 
                className="flex-1"
                size="lg"
              >
                <Calculator className="h-5 w-5 mr-2" />
                Ajustar monto
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Calculator Dialog */}
      <Dialog open={showCalculator} onOpenChange={setShowCalculator}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Calculator className="h-5 w-5" />
              Calculadora de Préstamo
            </DialogTitle>
            <DialogDescription>
              Ajuste el monto y plazo según sus necesidades
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6 py-4">
            {/* Amount slider */}
            <div className="space-y-3">
              <Label>Monto del préstamo</Label>
              <div className="px-2">
                <Slider
                  value={calculatorAmount}
                  onValueChange={setCalculatorAmount}
                  max={loanDetails.approvedAmount}
                  min={5000}
                  step={1000}
                  className="w-full"
                />
              </div>
              <div className="text-center">
                <span className="text-2xl font-bold text-primary">
                  Q{calculatorAmount[0].toLocaleString()}
                </span>
              </div>
            </div>

            {/* Term slider */}
            <div className="space-y-3">
              <Label>Plazo en meses</Label>
              <div className="px-2">
                <Slider
                  value={calculatorMonths}
                  onValueChange={setCalculatorMonths}
                  max={48}
                  min={6}
                  step={6}
                  className="w-full"
                />
              </div>
              <div className="text-center">
                <span className="text-2xl font-bold text-secondary">
                  {calculatorMonths[0]} meses
                </span>
              </div>
            </div>

            {/* Payment preview */}
            <div className="text-center p-4 rounded-lg bg-green-500/5 border border-green-500/20">
              <div className="text-sm text-muted-foreground mb-1">Cuota mensual estimada</div>
              <div className="text-2xl font-bold text-green-600">
                Q{calculatorPayment.toLocaleString()}
              </div>
              <div className="text-sm text-muted-foreground mt-1">
                Total a pagar: Q{(calculatorPayment * calculatorMonths[0]).toLocaleString()}
              </div>
            </div>
          </div>
          
          <DialogFooter className="flex gap-3">
            <Button 
              variant="outline" 
              onClick={() => setShowCalculator(false)}
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button 
              onClick={handleSaveCustomValues}
              className="flex-1"
            >
              Aceptar préstamo
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CreditEvaluation;