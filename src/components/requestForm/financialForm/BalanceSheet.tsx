
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { useFormContext as useRequestFormContext } from '../RequestFormProvider';
import { useFormContext as useGeneralFormContext } from '@/context/FormContext';

interface BalanceSheetProps {
  section: 'currentAssets' | 'nonCurrentAssets' | 'otherAssets' | 'shortTermLiabilities' | 'longTermLiabilities';
}

const sectionItems = {
  currentAssets: [
    { id: 'cash', label: 'Efectivo' },
    { id: 'accounts_receivable', label: 'Cuentas por Cobrar' },
    { id: 'inventory', label: 'Inventario' }
  ],
  nonCurrentAssets: [
    { id: 'fixed_assets', label: 'Activos Fijos' },
    { id: 'investments', label: 'Inversiones' }
  ],
  otherAssets: [
    { id: 'other_assets', label: 'Otros Activos' }
  ],
  shortTermLiabilities: [
    { id: 'accounts_payable', label: 'Cuentas por Pagar' },
    { id: 'short_term_loans', label: 'Préstamos a Corto Plazo' }
  ],
  longTermLiabilities: [
    { id: 'long_term_loans', label: 'Préstamos a Largo Plazo' },
    { id: 'mortgages', label: 'Hipotecas' }
  ]
};

const BalanceSheet: React.FC<BalanceSheetProps> = ({ section }) => {
  // Try to get context from RequestFormProvider
  let formData = {};
  let updateFormData = (field: string, value: any) => {};
  
  try {
    const requestContext = useRequestFormContext();
    if (requestContext) {
      formData = requestContext.formData;
      updateFormData = requestContext.updateFormData;
    }
  } catch {
    // If RequestFormContext is not available, we'll use the general FormContext
    try {
      const generalContext = useGeneralFormContext();
      if (generalContext) {
        formData = generalContext.formData;
        updateFormData = generalContext.updateFormData;
      }
    } catch (e) {
      console.error("No form context available:", e);
    }
  }
  
  const items = sectionItems[section];

  const handleValueChange = (itemId: string, type: 'before' | 'current', value: string) => {
    const numericValue = value === '' ? 0 : parseFloat(value);
    const newBalanceData = {
      ...formData.balanceSheet,
      [section]: {
        ...formData.balanceSheet?.[section],
        [itemId]: {
          ...formData.balanceSheet?.[section]?.[itemId],
          [type]: numericValue
        }
      }
    };
    
    updateFormData('balanceSheet', newBalanceData);
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[300px]">Concepto</TableHead>
          <TableHead>Saldo Anterior</TableHead>
          <TableHead>Saldo Actual</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {items.map((item) => (
          <TableRow key={item.id}>
            <TableCell>{item.label}</TableCell>
            <TableCell>
              <Input
                type="number"
                value={formData.balanceSheet?.[section]?.[item.id]?.before || ''}
                onChange={(e) => handleValueChange(item.id, 'before', e.target.value)}
                className="w-[200px]"
              />
            </TableCell>
            <TableCell>
              <Input
                type="number"
                value={formData.balanceSheet?.[section]?.[item.id]?.current || ''}
                onChange={(e) => handleValueChange(item.id, 'current', e.target.value)}
                className="w-[200px]"
              />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default BalanceSheet;
