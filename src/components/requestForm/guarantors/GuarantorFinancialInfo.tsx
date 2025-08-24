
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { DollarSign, Home, Car, Banknote } from 'lucide-react';
import { useFormContext } from '../RequestFormProvider';

interface GuarantorFinancialInfoProps {
  guarantorIndex: number;
}

const GuarantorFinancialInfo: React.FC<GuarantorFinancialInfoProps> = ({ guarantorIndex }) => {
  const { guarantors, updateGuarantor } = useFormContext();
  const guarantor = guarantors[guarantorIndex];

  const handleInputChange = (field: string, value: string | number | boolean) => {
    updateGuarantor(guarantorIndex, field, value);
    
    // Check if financial info is completed based on employment type
    const updatedGuarantor = { ...guarantor, [field]: value };
    const isAsalariado = guarantor.employmentType === 'asalariado';
    
    let isCompleted = false;
    if (isAsalariado) {
      // For salaried guarantors, only require income and expenses
      isCompleted = !!(
        updatedGuarantor.monthlyIncome > 0 && 
        updatedGuarantor.monthlyExpenses >= 0
      );
    } else {
      // For business owners, require full financial info
      isCompleted = !!(
        updatedGuarantor.monthlyIncome > 0 && 
        updatedGuarantor.monthlyExpenses >= 0 && 
        updatedGuarantor.bankAccounts
      );
    }
    
    if (isCompleted !== guarantor.financialInfoCompleted) {
      updateGuarantor(guarantorIndex, 'financialInfoCompleted', isCompleted);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-GT', {
      style: 'currency',
      currency: 'GTQ',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const isAsalariado = guarantor.employmentType === 'asalariado';

  return (
    <div className="space-y-6">
      <div className="border-b pb-4">
        <h3 className="text-lg font-semibold">Análisis Financiero del Fiador {guarantorIndex + 1}</h3>
        <p className="text-muted-foreground">
          {isAsalariado 
            ? 'Información de ingresos y gastos mensuales (fiador asalariado)'
            : 'Información financiera para evaluar la capacidad de respaldo del fiador'
          }
        </p>
      </div>

      {/* Ingresos y Gastos */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-primary" />
            Ingresos y Gastos Mensuales
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor={`monthlyIncome-${guarantorIndex}`}>Ingresos Mensuales *</Label>
              <div className="relative">
                <span className="absolute left-3 top-3 text-muted-foreground">Q</span>
                <Input
                  id={`monthlyIncome-${guarantorIndex}`}
                  type="number"
                  value={guarantor.monthlyIncome || ''}
                  onChange={(e) => handleInputChange('monthlyIncome', parseFloat(e.target.value) || 0)}
                  placeholder="0.00"
                  className="pl-8"
                  min="0"
                />
              </div>
              {guarantor.monthlyIncome > 0 && (
                <p className="text-sm text-muted-foreground">
                  {formatCurrency(guarantor.monthlyIncome)}
                </p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor={`monthlyExpenses-${guarantorIndex}`}>Gastos Mensuales *</Label>
              <div className="relative">
                <span className="absolute left-3 top-3 text-muted-foreground">Q</span>
                <Input
                  id={`monthlyExpenses-${guarantorIndex}`}
                  type="number"
                  value={guarantor.monthlyExpenses || ''}
                  onChange={(e) => handleInputChange('monthlyExpenses', parseFloat(e.target.value) || 0)}
                  placeholder="0.00"
                  className="pl-8"
                  min="0"
                />
              </div>
              {guarantor.monthlyExpenses > 0 && (
                <p className="text-sm text-muted-foreground">
                  {formatCurrency(guarantor.monthlyExpenses)}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor={`otherIncome-${guarantorIndex}`}>Otros Ingresos</Label>
            <div className="relative">
              <span className="absolute left-3 top-3 text-muted-foreground">Q</span>
              <Input
                id={`otherIncome-${guarantorIndex}`}
                type="number"
                value={guarantor.otherIncome || ''}
                onChange={(e) => handleInputChange('otherIncome', parseFloat(e.target.value) || 0)}
                placeholder="0.00"
                className="pl-8"
                min="0"
              />
            </div>
            {guarantor.otherIncome > 0 && (
              <p className="text-sm text-muted-foreground">
                {formatCurrency(guarantor.otherIncome)}
              </p>
            )}
          </div>

          {/* Flujo disponible */}
          {guarantor.monthlyIncome > 0 && guarantor.monthlyExpenses >= 0 && (
            <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="font-medium">Flujo disponible mensual:</span>
                <span className={`font-bold ${
                  (guarantor.monthlyIncome + guarantor.otherIncome - guarantor.monthlyExpenses) > 0 
                    ? 'text-green-600' 
                    : 'text-red-600'
                }`}>
                  {formatCurrency(guarantor.monthlyIncome + guarantor.otherIncome - guarantor.monthlyExpenses)}
                </span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Patrimonio - Only for business owners */}
      {!isAsalariado && (
        <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Home className="h-5 w-5 text-primary" />
            Patrimonio y Bienes
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id={`hasProperty-${guarantorIndex}`}
                checked={guarantor.hasProperty}
                onCheckedChange={(checked) => handleInputChange('hasProperty', checked)}
              />
              <Label htmlFor={`hasProperty-${guarantorIndex}`}>Posee propiedades inmuebles</Label>
            </div>
            
            {guarantor.hasProperty && (
              <div className="space-y-2 ml-6">
                <Label htmlFor={`propertyValue-${guarantorIndex}`}>Valor estimado de propiedades</Label>
                <div className="relative">
                  <span className="absolute left-3 top-3 text-muted-foreground">Q</span>
                  <Input
                    id={`propertyValue-${guarantorIndex}`}
                    type="number"
                    value={guarantor.propertyValue || ''}
                    onChange={(e) => handleInputChange('propertyValue', parseFloat(e.target.value) || 0)}
                    placeholder="0.00"
                    className="pl-8"
                    min="0"
                  />
                </div>
                {guarantor.propertyValue && guarantor.propertyValue > 0 && (
                  <p className="text-sm text-muted-foreground">
                    {formatCurrency(guarantor.propertyValue)}
                  </p>
                )}
              </div>
            )}
          </div>

          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id={`hasVehicle-${guarantorIndex}`}
                checked={guarantor.hasVehicle}
                onCheckedChange={(checked) => handleInputChange('hasVehicle', checked)}
              />
              <Label htmlFor={`hasVehicle-${guarantorIndex}`}>Posee vehículos</Label>
            </div>
            
            {guarantor.hasVehicle && (
              <div className="space-y-2 ml-6">
                <Label htmlFor={`vehicleValue-${guarantorIndex}`}>Valor estimado de vehículos</Label>
                <div className="relative">
                  <span className="absolute left-3 top-3 text-muted-foreground">Q</span>
                  <Input
                    id={`vehicleValue-${guarantorIndex}`}
                    type="number"
                    value={guarantor.vehicleValue || ''}
                    onChange={(e) => handleInputChange('vehicleValue', parseFloat(e.target.value) || 0)}
                    placeholder="0.00"
                    className="pl-8"
                    min="0"
                  />
                </div>
                {guarantor.vehicleValue && guarantor.vehicleValue > 0 && (
                  <p className="text-sm text-muted-foreground">
                    {formatCurrency(guarantor.vehicleValue)}
                  </p>
                )}
              </div>
            )}
          </div>
        </CardContent>
        </Card>
      )}

      {/* Cuentas Bancarias - Only for business owners */}
      {!isAsalariado && (
        <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Banknote className="h-5 w-5 text-primary" />
            Información Bancaria
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor={`bankAccounts-${guarantorIndex}`}>Bancos donde mantiene cuentas *</Label>
            <Textarea
              id={`bankAccounts-${guarantorIndex}`}
              value={guarantor.bankAccounts}
              onChange={(e) => handleInputChange('bankAccounts', e.target.value)}
              placeholder="Ej: Banco Industrial - Cuenta de Ahorros, Banco G&T - Cuenta Monetaria"
              className="min-h-[80px]"
            />
          </div>
        </CardContent>
        </Card>
      )}
    </div>
  );
};

export default GuarantorFinancialInfo;
