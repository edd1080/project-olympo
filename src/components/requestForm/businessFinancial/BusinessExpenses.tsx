import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

interface BusinessExpensesProps {
  formData: any;
  updateFormData: (field: string, value: any) => void;
}

const currencyToNumber = (v: string) => {
  const n = parseFloat(v);
  return Number.isFinite(n) ? n : 0;
};

const CurrencyInput: React.FC<{
  id: string;
  label: string;
  value: string | number;
  onChange: (val: string) => void;
}> = ({ id, label, value, onChange }) => {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <div className="relative">
        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">Q</span>
        <Input
          id={id}
          type="number"
          inputMode="decimal"
          step="0.01"
          className="pl-7"
          value={value ?? ''}
          onChange={(e) => onChange(e.target.value)}
        />
      </div>
    </div>
  );
};

const CalculatedField: React.FC<{
  id: string;
  label: string;
  value: number;
}> = ({ id, label, value }) => {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <div className="relative">
        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">Q</span>
        <Input
          id={id}
          type="text"
          className="pl-7 bg-muted/50 text-muted-foreground"
          value={value.toLocaleString('es-GT', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          readOnly
        />
      </div>
    </div>
  );
};

const BusinessExpenses: React.FC<BusinessExpensesProps> = ({ formData, updateFormData }) => {
  const expenses = formData.businessExpenses || {
    bonusesAndBonifications: '',
    entrepreneurSalary: '',
    adminSalary: '',
    localRent: '',
    water: '',
    electricity: '',
    phone: '',
    freight: '',
    otherExpenses: '',
  };

  const setField = (field: keyof typeof expenses, val: string) => {
    updateFormData('businessExpenses', {
      ...expenses,
      [field]: val,
    });
  };

  // Calculate totals
  const totalAdminExpenses = React.useMemo(() => {
    return Object.keys(expenses).reduce((total, key) => {
      const value = expenses[key as keyof typeof expenses];
      return total + currencyToNumber(value);
    }, 0);
  }, [expenses]);

  const utilidadLiquida = React.useMemo(() => {
    const cashSales = currencyToNumber(formData.cashSales || '0');
    const creditSales = currencyToNumber(formData.creditSales || '0');
    const totalSales = cashSales + creditSales;
    return totalSales - totalAdminExpenses;
  }, [formData.cashSales, formData.creditSales, totalAdminExpenses]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Gastos del negocio</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <CurrencyInput 
            id="bonusesAndBonifications" 
            label="Bonos y aguinaldos" 
            value={expenses.bonusesAndBonifications} 
            onChange={(v) => setField('bonusesAndBonifications', v)} 
          />
          <CurrencyInput 
            id="entrepreneurSalary" 
            label="Sueldo de empresario" 
            value={expenses.entrepreneurSalary} 
            onChange={(v) => setField('entrepreneurSalary', v)} 
          />
          <CurrencyInput 
            id="adminSalary" 
            label="Sueldo de administración" 
            value={expenses.adminSalary} 
            onChange={(v) => setField('adminSalary', v)} 
          />
          <CurrencyInput 
            id="localRent" 
            label="Alquiler de local" 
            value={expenses.localRent} 
            onChange={(v) => setField('localRent', v)} 
          />
          <CurrencyInput 
            id="water" 
            label="Agua" 
            value={expenses.water} 
            onChange={(v) => setField('water', v)} 
          />
          <CurrencyInput 
            id="electricity" 
            label="Luz" 
            value={expenses.electricity} 
            onChange={(v) => setField('electricity', v)} 
          />
          <CurrencyInput 
            id="phone" 
            label="Teléfono" 
            value={expenses.phone} 
            onChange={(v) => setField('phone', v)} 
          />
          <CurrencyInput 
            id="freight" 
            label="Fletes (combustibles)" 
            value={expenses.freight} 
            onChange={(v) => setField('freight', v)} 
          />
          <CurrencyInput 
            id="otherExpenses" 
            label="Otros gastos" 
            value={expenses.otherExpenses} 
            onChange={(v) => setField('otherExpenses', v)} 
          />
        </div>
        
        <div className="mt-6 pt-4 border-t border-border">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <CalculatedField 
              id="totalAdminExpenses" 
              label="Total de gastos de administración" 
              value={totalAdminExpenses} 
            />
            <CalculatedField 
              id="netProfit" 
              label="Utilidad líquida" 
              value={utilidadLiquida} 
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BusinessExpenses;
