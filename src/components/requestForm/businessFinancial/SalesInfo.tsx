import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

interface SalesInfoProps {
  formData: any;
  updateFormData: (field: string, value: any) => void;
}

const SalesInfo: React.FC<SalesInfoProps> = ({ formData, updateFormData }) => {
  const calculateTotalSales = () => {
    const cash = parseFloat(formData.cashSales) || 0;
    const credit = parseFloat(formData.creditSales) || 0;
    return cash + credit;
  };

  const calculateGrossProfit = () => {
    const totalSales = calculateTotalSales();
    const costOfSales = parseFloat(formData.costOfSales) || 0;
    return totalSales - costOfSales;
  };

  const calculateNetProfit = () => {
    const grossProfit = calculateGrossProfit();
    const operatingExpenses = parseFloat(formData.operatingExpenses) || 0;
    return grossProfit - operatingExpenses;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Información de Ventas</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="cashSales">Ventas en Efectivo (Q) *</Label>
            <Input
              id="cashSales"
              type="number"
              min="0"
              step="0.01"
              value={formData.cashSales || ''}
              onChange={(e) => updateFormData('cashSales', e.target.value)}
              placeholder="0.00"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="creditSales">Ventas a Crédito (Q)</Label>
            <Input
              id="creditSales"
              type="number"
              min="0"
              step="0.01"
              value={formData.creditSales || ''}
              onChange={(e) => updateFormData('creditSales', e.target.value)}
              placeholder="0.00"
            />
          </div>
        </div>

        <div className="bg-muted/20 p-3 rounded-md">
          <div className="flex justify-between items-center">
            <span className="font-medium">Total de Ventas:</span>
            <span className="text-lg font-bold">Q {calculateTotalSales().toFixed(2)}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="costOfSales">Costo de Ventas (Q) *</Label>
            <Input
              id="costOfSales"
              type="number"
              min="0"
              step="0.01"
              value={formData.costOfSales || ''}
              onChange={(e) => updateFormData('costOfSales', e.target.value)}
              placeholder="0.00"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="operatingExpenses">Gastos Operativos (Q) *</Label>
            <Input
              id="operatingExpenses"
              type="number"
              min="0"
              step="0.01"
              value={formData.operatingExpenses || ''}
              onChange={(e) => updateFormData('operatingExpenses', e.target.value)}
              placeholder="0.00"
            />
          </div>
        </div>

        <div className="space-y-2">
          <div className="bg-muted/20 p-3 rounded-md">
            <div className="flex justify-between items-center">
              <span className="font-medium">Utilidad Bruta:</span>
              <span className="text-lg font-bold text-green-600">Q {calculateGrossProfit().toFixed(2)}</span>
            </div>
          </div>
          <div className="bg-muted/20 p-3 rounded-md">
            <div className="flex justify-between items-center">
              <span className="font-medium">Utilidad Neta:</span>
              <span className="text-lg font-bold text-green-600">Q {calculateNetProfit().toFixed(2)}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SalesInfo;
