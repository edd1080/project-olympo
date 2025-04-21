
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useFormContext as useRequestFormContext } from '../RequestFormProvider';
import { useFormContext as useGeneralFormContext } from '@/context/FormContext';
import { FilePlus, FileMinus } from 'lucide-react';
import { AssetLiabilityItem, FinancialFormData } from './types';

const AssetLiabilityTables = () => {
  // Try to get context from RequestFormProvider
  let formData: Partial<FinancialFormData> = {};
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

  const addRow = (type: 'assets' | 'liabilities') => {
    const newItem: AssetLiabilityItem = {
      id: `${type}_${Date.now()}`,
      description: '',
      value: 0
    };

    const currentItems = formData[type] || [];
    updateFormData(type, [...currentItems, newItem]);
  };

  const removeRow = (type: 'assets' | 'liabilities', id: string) => {
    const currentItems = formData[type] || [];
    updateFormData(type, currentItems.filter((item: AssetLiabilityItem) => item.id !== id));
  };

  const updateRow = (type: 'assets' | 'liabilities', id: string, field: string, value: string) => {
    const currentItems = formData[type] || [];
    const updatedItems = currentItems.map((item: AssetLiabilityItem) => {
      if (item.id === id) {
        return { ...item, [field]: field === 'value' ? parseFloat(value) || 0 : value };
      }
      return item;
    });
    updateFormData(type, updatedItems);
  };

  return (
    <div className="space-y-8">
      {/* Fixed Assets Table */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h4 className="font-medium">Activos Fijos</h4>
          <Button variant="outline" size="sm" onClick={() => addRow('assets')}>
            <FilePlus className="h-4 w-4 mr-2" />
            Agregar Activo
          </Button>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[60%]">Descripción</TableHead>
              <TableHead>Valor</TableHead>
              <TableHead className="w-[100px]">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {(formData.assets || []).map((item: AssetLiabilityItem) => (
              <TableRow key={item.id}>
                <TableCell>
                  <Input
                    value={item.description}
                    onChange={(e) => updateRow('assets', item.id, 'description', e.target.value)}
                  />
                </TableCell>
                <TableCell>
                  <Input
                    type="number"
                    value={item.value}
                    onChange={(e) => updateRow('assets', item.id, 'value', e.target.value)}
                  />
                </TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeRow('assets', item.id)}
                  >
                    <FileMinus className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Liabilities Table */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h4 className="font-medium">Pasivos</h4>
          <Button variant="outline" size="sm" onClick={() => addRow('liabilities')}>
            <FilePlus className="h-4 w-4 mr-2" />
            Agregar Pasivo
          </Button>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[60%]">Descripción</TableHead>
              <TableHead>Valor</TableHead>
              <TableHead className="w-[100px]">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {(formData.liabilities || []).map((item: AssetLiabilityItem) => (
              <TableRow key={item.id}>
                <TableCell>
                  <Input
                    value={item.description}
                    onChange={(e) => updateRow('liabilities', item.id, 'description', e.target.value)}
                  />
                </TableCell>
                <TableCell>
                  <Input
                    type="number"
                    value={item.value}
                    onChange={(e) => updateRow('liabilities', item.id, 'value', e.target.value)}
                  />
                </TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeRow('liabilities', item.id)}
                  >
                    <FileMinus className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default AssetLiabilityTables;
