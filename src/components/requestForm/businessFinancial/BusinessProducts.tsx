import React, { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Trash2, Plus } from 'lucide-react';

interface BusinessProductsProps {
  formData: any;
  updateFormData: (field: string, value: any) => void;
}

const BusinessProducts: React.FC<BusinessProductsProps> = ({ formData, updateFormData }) => {
  useEffect(() => {
    if (!formData.products || formData.products.length === 0) {
      updateFormData('products', [
        {
          id: Date.now(),
          type: '',
          unit: '',
          quantity: '',
          unitCost: '',
          sellingPrice: '',
          margin: '',
          bestMonth: '',
          worstMonth: '',
          bestAmount: '',
          worstAmount: '',
          photo: null,
        },
      ]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const addProduct = () => {
    const newProduct = {
      id: Date.now(),
      type: '',
      unit: '',
      quantity: '',
      unitCost: '',
      sellingPrice: '',
      margin: '',
      bestMonth: '',
      worstMonth: '',
      bestAmount: '',
      worstAmount: '',
      photo: null,
    };
    updateFormData('products', [...(formData.products || []), newProduct]);
  };

  const removeProduct = (id: number) => {
    updateFormData('products', (formData.products || []).filter((p: any) => p.id !== id));
  };

  const updateProduct = (id: number, field: string, value: any) => {
    const updatedProducts = (formData.products || []).map((p: any) => (p.id === id ? { ...p, [field]: value } : p));
    updateFormData('products', updatedProducts);
  };

  const products = formData.products || [];

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Productos del Negocio</CardTitle>
        <Button onClick={addProduct} size="sm" variant="outline">
          <Plus className="h-4 w-4 mr-2" />
          Agregar Producto
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {products.map((product: any, index: number) => (
            <Card key={product.id} className="border-l-4 border-l-primary/20">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-base">Producto #{index + 1}</CardTitle>
                  {products.length > 1 && (
                    <Button onClick={() => removeProduct(product.id)} size="sm" variant="ghost" className="text-destructive hover:text-destructive">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Tipo de Producto *</Label>
                    <Input
                      value={product.type || ''}
                      onChange={(e) => updateProduct(product.id, 'type', e.target.value)}
                      placeholder="Ej: Ropa, Alimentos, etc."
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Unidad de Medida *</Label>
                    <Select value={product.unit || ''} onValueChange={(value) => updateProduct(product.id, 'unit', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="piece">Pieza</SelectItem>
                        <SelectItem value="kg">Kilogramo</SelectItem>
                        <SelectItem value="lb">Libra</SelectItem>
                        <SelectItem value="liter">Litro</SelectItem>
                        <SelectItem value="meter">Metro</SelectItem>
                        <SelectItem value="dozen">Docena</SelectItem>
                        <SelectItem value="box">Caja</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Cantidad Mensual *</Label>
                    <Input
                      type="number"
                      value={product.quantity || ''}
                      onChange={(e) => updateProduct(product.id, 'quantity', e.target.value)}
                      placeholder="0"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Costo Unitario (Q) *</Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={product.unitCost || ''}
                      onChange={(e) => updateProduct(product.id, 'unitCost', e.target.value)}
                      placeholder="0.00"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Precio de Venta (Q) *</Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={product.sellingPrice || ''}
                      onChange={(e) => updateProduct(product.id, 'sellingPrice', e.target.value)}
                      placeholder="0.00"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Margen (%)</Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={product.margin || ''}
                      onChange={(e) => updateProduct(product.id, 'margin', e.target.value)}
                      placeholder="0.00"
                      disabled
                      className="bg-muted"
                    />
                  </div>
                </div>

                <Separator />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Mejor Mes</Label>
                    <Select value={product.bestMonth || ''} onValueChange={(value) => updateProduct(product.id, 'bestMonth', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar mes" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="january">Enero</SelectItem>
                        <SelectItem value="february">Febrero</SelectItem>
                        <SelectItem value="march">Marzo</SelectItem>
                        <SelectItem value="april">Abril</SelectItem>
                        <SelectItem value="may">Mayo</SelectItem>
                        <SelectItem value="june">Junio</SelectItem>
                        <SelectItem value="july">Julio</SelectItem>
                        <SelectItem value="august">Agosto</SelectItem>
                        <SelectItem value="september">Septiembre</SelectItem>
                        <SelectItem value="october">Octubre</SelectItem>
                        <SelectItem value="november">Noviembre</SelectItem>
                        <SelectItem value="december">Diciembre</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Peor Mes</Label>
                    <Select value={product.worstMonth || ''} onValueChange={(value) => updateProduct(product.id, 'worstMonth', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar mes" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="january">Enero</SelectItem>
                        <SelectItem value="february">Febrero</SelectItem>
                        <SelectItem value="march">Marzo</SelectItem>
                        <SelectItem value="april">Abril</SelectItem>
                        <SelectItem value="may">Mayo</SelectItem>
                        <SelectItem value="june">Junio</SelectItem>
                        <SelectItem value="july">Julio</SelectItem>
                        <SelectItem value="august">Agosto</SelectItem>
                        <SelectItem value="september">Septiembre</SelectItem>
                        <SelectItem value="october">Octubre</SelectItem>
                        <SelectItem value="november">Noviembre</SelectItem>
                        <SelectItem value="december">Diciembre</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default BusinessProducts;
