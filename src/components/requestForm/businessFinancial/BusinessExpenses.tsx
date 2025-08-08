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

const BusinessExpenses: React.FC<BusinessExpensesProps> = ({ formData, updateFormData }) => {
  const expenses = formData.businessExpenses || {
    rent: '',
    utilities: '',
    wages: '',
    transport: '',
    other: '',
  };

  const setField = (field: keyof typeof expenses, val: string) => {
    updateFormData('businessExpenses', {
      ...expenses,
      [field]: val,
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Gastos del negocio</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <CurrencyInput id="rent" label="Alquiler" value={expenses.rent} onChange={(v) => setField('rent', v)} />
          <CurrencyInput id="utilities" label="Servicios básicos" value={expenses.utilities} onChange={(v) => setField('utilities', v)} />
          <CurrencyInput id="wages" label="Sueldos y salarios" value={expenses.wages} onChange={(v) => setField('wages', v)} />
          <CurrencyInput id="transport" label="Transporte" value={expenses.transport} onChange={(v) => setField('transport', v)} />
          <CurrencyInput id="other" label="Otros" value={expenses.other} onChange={(v) => setField('other', v)} />
        </div>
      </CardContent>
    </Card>
  );
};

export default BusinessExpenses;
