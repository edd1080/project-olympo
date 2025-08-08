import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { CalendarIcon, Trash2, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LiabilitiesDescriptionProps {
  formData: any;
  updateFormData: (field: string, value: any) => void;
}

const LiabilitiesDescription: React.FC<LiabilitiesDescriptionProps> = ({ formData, updateFormData }) => {
  const items = formData.liabilitiesDetails || [];

  const setItems = (next: any[]) => updateFormData('liabilitiesDetails', next);

  const addItem = () => {
    setItems([
      ...items,
      { id: Date.now(), acreedorProveedor: '', montoCredito: '', saldo: '', fechaVencimiento: undefined },
    ]);
  };

  const removeItem = (id: number) => setItems(items.filter((i: any) => i.id !== id));

  const updateItem = (id: number, key: string, value: any) =>
    setItems(items.map((i: any) => (i.id === id ? { ...i, [key]: value } : i)));

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Descripción de pasivos</CardTitle>
        <Button onClick={addItem} size="sm" variant="outline">
          <Plus className="h-4 w-4 mr-2" /> Agregar pasivo
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {items.length === 0 && (
          <div className="text-sm text-muted-foreground">Agrega pasivos si aplica.</div>
        )}
        {items.map((item: any) => (
          <div key={item.id} className="grid grid-cols-1 md:grid-cols-5 gap-4 p-4 border rounded-md">
            <div className="space-y-2">
              <Label>Acreedor/Proveedor</Label>
              <Input value={item.acreedorProveedor} onChange={(e) => updateItem(item.id, 'acreedorProveedor', e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Monto del crédito {item.acreedorProveedor ? <span className="text-destructive">*</span> : null}</Label>
              <Input
                type="number"
                step="0.01"
                value={item.montoCredito}
                onChange={(e) => updateItem(item.id, 'montoCredito', e.target.value)}
                placeholder="0.00"
              />
            </div>
            <div className="space-y-2">
              <Label>Saldo {item.acreedorProveedor ? <span className="text-destructive">*</span> : null}</Label>
              <Input
                type="number"
                step="0.01"
                value={item.saldo}
                onChange={(e) => updateItem(item.id, 'saldo', e.target.value)}
                placeholder="0.00"
              />
            </div>
            <div className="space-y-2">
              <Label>Fecha de vencimiento</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      'justify-start text-left font-normal',
                      !item.fechaVencimiento && 'text-muted-foreground'
                    )}
                  >
                    {item.fechaVencimiento ? new Date(item.fechaVencimiento).toLocaleDateString('es-GT') : <span>Seleccionar</span>}
                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={item.fechaVencimiento ? new Date(item.fechaVencimiento) : undefined}
                    onSelect={(date) => updateItem(item.id, 'fechaVencimiento', date?.toISOString() ?? undefined)}
                    initialFocus
                    className={cn('p-3 pointer-events-auto')}
                  />
                </PopoverContent>
              </Popover>
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

export default LiabilitiesDescription;
