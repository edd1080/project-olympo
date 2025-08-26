import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from '@/components/layout/Header';
import BreadcrumbNavigation from '@/components/navigation/BreadcrumbNavigation';
import FormTypeBanner from '@/components/forms/FormTypeBanner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Save, DollarSign } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { getFirstNameAndLastName } from '@/lib/nameUtils';

const GuarantorFinancialForm = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const guarantor = location.state?.guarantor;
  const applicationId = location.state?.applicationId;
  const returnTo = location.state?.returnTo || `/applications/${applicationId}`;
  
  const [formData, setFormData] = useState({
    monthlyIncome: guarantor?.monthlyIncome || '',
    monthlyExpenses: guarantor?.monthlyExpenses || ''
  });
  
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    if (!guarantor) {
      toast({
        title: "Error",
        description: "No se encontró información del fiador",
        variant: "destructive"
      });
      navigate(returnTo);
    }
  }, [guarantor, navigate, returnTo, toast]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setHasChanges(true);
  };

  const formatCurrency = (value: string) => {
    const numericValue = value.replace(/[^\d]/g, '');
    if (!numericValue) return '';
    return new Intl.NumberFormat('es-GT', {
      style: 'currency',
      currency: 'GTQ',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(parseInt(numericValue));
  };

  const handleSave = () => {
    const monthlyIncome = parseInt(formData.monthlyIncome.replace(/[^\d]/g, '')) || 0;
    const monthlyExpenses = parseInt(formData.monthlyExpenses.replace(/[^\d]/g, '')) || 0;
    
    if (monthlyIncome <= 0) {
      toast({
        title: "Error de validación",
        description: "Los ingresos mensuales deben ser mayor a cero",
        variant: "destructive"
      });
      return;
    }

    // Simulate saving the data
    toast({
      title: "Información guardada",
      description: `Información financiera de ${guarantor.nombre} actualizada correctamente`,
      duration: 3000
    });
    
    setHasChanges(false);
    
    // Return to application details after a short delay
    setTimeout(() => {
      navigate(returnTo);
    }, 1000);
  };

  const handleCancel = () => {
    if (hasChanges) {
      const confirmLeave = window.confirm('¿Estás seguro de que quieres salir sin guardar los cambios?');
      if (!confirmLeave) return;
    }
    navigate(returnTo);
  };

  if (!guarantor) {
    return <div>Cargando...</div>;
  }

  return (
    <div className="min-h-screen flex flex-col guarantor-theme">
      <Header personName={getFirstNameAndLastName(guarantor.nombre)} />
      
      <main className="flex-1 container mx-auto px-4 py-0 pb-20 max-w-3xl">
        {/* Breadcrumb Navigation */}
        <div className="mb-3 mt-4">
          <BreadcrumbNavigation />
        </div>
        
        {/* Form Type Banner */}
        <FormTypeBanner type="guarantor" />
        
        {/* Header */}
        <div className="mb-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCancel}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver a Detalles
          </Button>
          
          <div>
            <h1 className="text-2xl font-bold">Información Financiera</h1>
            <p className="text-muted-foreground">
              Fiador: {guarantor.nombre} • {guarantor.tipoEmpleo}
            </p>
          </div>
        </div>
        
        {/* Financial Information Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <DollarSign className="h-5 w-5 mr-2 text-primary" />
              Ingresos y Gastos Mensuales
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="monthlyIncome">
                  Ingresos Mensuales <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="monthlyIncome"
                  placeholder="Ej: Q8,000"
                  value={formData.monthlyIncome}
                  onChange={(e) => {
                    const formatted = formatCurrency(e.target.value);
                    handleInputChange('monthlyIncome', formatted);
                  }}
                  className="text-lg"
                />
                <p className="text-xs text-muted-foreground">
                  Ingresa tu salario mensual total
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="monthlyExpenses">
                  Gastos Mensuales <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="monthlyExpenses"
                  placeholder="Ej: Q5,000"
                  value={formData.monthlyExpenses}
                  onChange={(e) => {
                    const formatted = formatCurrency(e.target.value);
                    handleInputChange('monthlyExpenses', formatted);
                  }}
                  className="text-lg"
                />
                <p className="text-xs text-muted-foreground">
                  Suma de todos tus gastos mensuales
                </p>
              </div>
            </div>
            
            {/* Summary */}
            {formData.monthlyIncome && formData.monthlyExpenses && (
              <div className="mt-6 p-4 bg-muted/50 rounded-lg">
                <h3 className="font-medium mb-2">Resumen Financiero</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Ingresos</p>
                    <p className="font-medium text-primary">{formData.monthlyIncome}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Gastos</p>
                    <p className="font-medium">{formData.monthlyExpenses}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Ingreso Neto</p>
                    <p className="font-medium text-green-600">
                      {formatCurrency(
                        String((parseInt(formData.monthlyIncome.replace(/[^\d]/g, '')) || 0) -
                        (parseInt(formData.monthlyExpenses.replace(/[^\d]/g, '')) || 0))
                      )}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
        
        {/* Action Buttons */}
        <div className="fixed bottom-0 left-0 right-0 bg-background border-t p-4 md:relative md:border-t-0 md:bg-transparent md:p-0 md:mt-6">
          <div className="container mx-auto max-w-3xl flex gap-3">
            <Button
              variant="outline"
              onClick={handleCancel}
              className="flex-1 md:flex-none"
            >
              Cancelar
            </Button>
            <Button
              onClick={handleSave}
              className="flex-1 md:flex-none"
              disabled={!formData.monthlyIncome || !formData.monthlyExpenses}
            >
              <Save className="h-4 w-4 mr-2" />
              Guardar Información
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default GuarantorFinancialForm;