
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from "@/components/ui/separator";

interface IncomeExpensesProps {
  formData: any;
  updateFormData: (field: string, value: any) => void;
}

const IncomeExpenses: React.FC<IncomeExpensesProps> = ({ formData, updateFormData }) => {
  return (
    <Card className="border-0 shadow-none">
      <CardContent className="p-0 space-y-4">
        <h3 className="font-semibold text-lg">Ingresos y Egresos</h3>
        <p className="text-muted-foreground text-sm">
          Detalla tu situación financiera mensual.
        </p>
        
        <div className="space-y-6">
          <div>
            <h4 className="text-base font-medium mb-2">Ingresos Mensuales</h4>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="primaryIncome">Ingreso Principal</Label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">$</span>
                    <Input 
                      id="primaryIncome" 
                      type="number"
                      value={formData.primaryIncome || ''} 
                      onChange={(e) => updateFormData('primaryIncome', e.target.value)} 
                      placeholder="0.00"
                      className="pl-8"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="secondaryIncome">Otros Ingresos</Label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">$</span>
                    <Input 
                      id="secondaryIncome" 
                      type="number"
                      value={formData.secondaryIncome || ''} 
                      onChange={(e) => updateFormData('secondaryIncome', e.target.value)} 
                      placeholder="0.00"
                      className="pl-8"
                    />
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="incomeSource">Fuente de Otros Ingresos</Label>
                <Input 
                  id="incomeSource" 
                  value={formData.incomeSource || ''} 
                  onChange={(e) => updateFormData('incomeSource', e.target.value)} 
                  placeholder="Renta, inversiones, etc."
                />
              </div>
            </div>
          </div>
          
          <Separator />
          
          <div>
            <h4 className="text-base font-medium mb-2">Egresos Mensuales</h4>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="rent">Renta / Hipoteca</Label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">$</span>
                    <Input 
                      id="rent" 
                      type="number"
                      value={formData.rent || ''} 
                      onChange={(e) => updateFormData('rent', e.target.value)} 
                      placeholder="0.00"
                      className="pl-8"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="utilities">Servicios (Luz, Agua, etc.)</Label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">$</span>
                    <Input 
                      id="utilities" 
                      type="number"
                      value={formData.utilities || ''} 
                      onChange={(e) => updateFormData('utilities', e.target.value)} 
                      placeholder="0.00"
                      className="pl-8"
                    />
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="food">Alimentación</Label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">$</span>
                    <Input 
                      id="food" 
                      type="number"
                      value={formData.food || ''} 
                      onChange={(e) => updateFormData('food', e.target.value)} 
                      placeholder="0.00"
                      className="pl-8"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="transportation">Transporte</Label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">$</span>
                    <Input 
                      id="transportation" 
                      type="number"
                      value={formData.transportation || ''} 
                      onChange={(e) => updateFormData('transportation', e.target.value)} 
                      placeholder="0.00"
                      className="pl-8"
                    />
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="otherExpenses">Otros Gastos</Label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">$</span>
                  <Input 
                    id="otherExpenses" 
                    type="number"
                    value={formData.otherExpenses || ''} 
                    onChange={(e) => updateFormData('otherExpenses', e.target.value)} 
                    placeholder="0.00"
                    className="pl-8"
                  />
                </div>
              </div>
            </div>
          </div>
          
          <Separator />
          
          <div>
            <h4 className="text-base font-medium mb-2">Deudas Actuales</h4>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="currentLoans">Préstamos / Créditos</Label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">$</span>
                    <Input 
                      id="currentLoans" 
                      type="number"
                      value={formData.currentLoans || ''} 
                      onChange={(e) => updateFormData('currentLoans', e.target.value)} 
                      placeholder="0.00"
                      className="pl-8"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="creditCards">Tarjetas de Crédito</Label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">$</span>
                    <Input 
                      id="creditCards" 
                      type="number"
                      value={formData.creditCards || ''} 
                      onChange={(e) => updateFormData('creditCards', e.target.value)} 
                      placeholder="0.00"
                      className="pl-8"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default IncomeExpenses;
