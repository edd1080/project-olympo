import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Trash2, Plus } from 'lucide-react';

interface FixedAssetsDescriptionProps {
  formData: any;
  updateFormData: (field: string, value: any) => void;
}

const FixedAssetsDescription: React.FC<FixedAssetsDescriptionProps> = ({ formData, updateFormData }) => {
  const items = formData.fixedAssetsDetails || [];

  const setItems = (next: any[]) => updateFormData('fixedAssetsDetails', next);

  const addItem = () => {
    setItems([
      ...items,
      { id: Date.now(), tipo: '', marca: '', modelo: '', placa: '', valor: '' },
    ]);
  };

  const removeItem = (id: number) => setItems(items.filter((i: any) => i.id !== id));

  const updateItem = (id: number, key: string, value: any) =>
    setItems(items.map((i: any) => (i.id === id ? { ...i, [key]: value } : i)));

  return (
    <Card>
      <CardHeader className="pb-4">
        <div className="space-y-4">
          <CardTitle>Descripción de activos fijos</CardTitle>
          <p className="text-sm text-muted-foreground">
            Agrega información detallada de los activos fijos del negocio
          </p>
          <Button onClick={addItem} size="sm" variant="outline" className="w-full sm:w-auto">
            <Plus className="h-4 w-4 mr-2" /> Agregar activo fijo
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {items.length === 0 && (
          <div className="text-sm text-muted-foreground">Agrega activos fijos si aplica.</div>
        )}
        {items.map((item: any, idx: number) => (
          <div key={item.id} className="grid grid-cols-1 md:grid-cols-6 gap-4 p-4 border rounded-md">
            <div className="space-y-2">
              <Label>Tipo</Label>
              <Input value={item.tipo} onChange={(e) => updateItem(item.id, 'tipo', e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Marca</Label>
              <Input value={item.marca} onChange={(e) => updateItem(item.id, 'marca', e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Modelo</Label>
              <Input value={item.modelo} onChange={(e) => updateItem(item.id, 'modelo', e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>No. Placa</Label>
              <Input value={item.placa} onChange={(e) => updateItem(item.id, 'placa', e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Valor (Q) {item.tipo || item.marca || item.modelo || item.placa ? <span className="text-destructive">*</span> : null}</Label>
              <Input
                type="number"
                step="0.01"
                value={item.valor}
                onChange={(e) => updateItem(item.id, 'valor', e.target.value)}
                placeholder="0.00"
              />
              {(item.tipo || item.marca || item.modelo || item.placa) && !item.valor && (
                <div className="text-xs text-destructive">El valor es requerido si agregas un activo fijo.</div>
              )}
            </div>
            <div className="flex items-end">
              <Button onClick={() => removeItem(item.id)} size="sm" variant="ghost" className="text-destructive hover:text-destructive">
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default FixedAssetsDescription;
