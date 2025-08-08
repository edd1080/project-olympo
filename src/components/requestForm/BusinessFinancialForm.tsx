import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Checkbox } from '@/components/ui/checkbox';
import { Trash2, Plus, Upload } from 'lucide-react';

interface BusinessFinancialFormProps {
  formData: any;
  updateFormData: (field: string, value: any) => void;
}

const BusinessFinancialForm: React.FC<BusinessFinancialFormProps> = ({ formData, updateFormData }) => {
  // Initialize arrays if they don't exist
  if (!formData.products) {
    updateFormData('products', [{ 
      id: 1, 
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
      photo: null 
    }]);
  }
  if (!formData.fixedAssets) {
    updateFormData('fixedAssets', []);
  }
  if (!formData.liabilities) {
    updateFormData('liabilities', []);
  }

  // Helper functions for calculations
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

  const calculateTotalAssets = () => {
    const fixedAssets = (formData.fixedAssets || []).reduce((sum: number, asset: any) => 
      sum + (parseFloat(asset.value) || 0), 0);
    const currentAssets = parseFloat(formData.currentAssets) || 0;
    return fixedAssets + currentAssets;
  };

  const calculateTotalLiabilities = () => {
    return (formData.liabilities || []).reduce((sum: number, liability: any) => 
      sum + (parseFloat(liability.amount) || 0), 0);
  };

  const calculateEquity = () => {
    return calculateTotalAssets() - calculateTotalLiabilities();
  };

  // Product management functions
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
      photo: null
    };
    updateFormData('products', [...(formData.products || []), newProduct]);
  };

  const removeProduct = (id: number) => {
    updateFormData('products', formData.products.filter((p: any) => p.id !== id));
  };

  const updateProduct = (id: number, field: string, value: any) => {
    const updatedProducts = formData.products.map((p: any) => 
      p.id === id ? { ...p, [field]: value } : p
    );
    updateFormData('products', updatedProducts);
  };

  // Fixed assets management
  const addFixedAsset = () => {
    const newAsset = {
      id: Date.now(),
      description: '',
      value: '',
      condition: ''
    };
    updateFormData('fixedAssets', [...(formData.fixedAssets || []), newAsset]);
  };

  const removeFixedAsset = (id: number) => {
    updateFormData('fixedAssets', formData.fixedAssets.filter((a: any) => a.id !== id));
  };

  const updateFixedAsset = (id: number, field: string, value: any) => {
    const updatedAssets = formData.fixedAssets.map((a: any) => 
      a.id === id ? { ...a, [field]: value } : a
    );
    updateFormData('fixedAssets', updatedAssets);
  };

  // Liabilities management
  const addLiability = () => {
    const newLiability = {
      id: Date.now(),
      institution: '',
      amount: '',
      monthlyPayment: '',
      purpose: ''
    };
    updateFormData('liabilities', [...(formData.liabilities || []), newLiability]);
  };

  const removeLiability = (id: number) => {
    updateFormData('liabilities', formData.liabilities.filter((l: any) => l.id !== id));
  };

  const updateLiability = (id: number, field: string, value: any) => {
    const updatedLiabilities = formData.liabilities.map((l: any) => 
      l.id === id ? { ...l, [field]: value } : l
    );
    updateFormData('liabilities', updatedLiabilities);
  };

  return (
    <div className="space-y-6">
      <h3 className="text-subtitle text-secondary-foreground">Información financiera del negocio</h3>

      {/* Business General Information */}
      <Card>
        <CardHeader>
          <CardTitle>Información General del Negocio</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="businessName">Nombre del Negocio *</Label>
              <Input
                id="businessName"
                value={formData.businessName || ''}
                onChange={(e) => updateFormData('businessName', e.target.value)}
                placeholder="Nombre comercial"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="businessType">Tipo de Negocio *</Label>
              <Select value={formData.businessType || ''} onValueChange={(value) => updateFormData('businessType', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="retail">Comercio al por menor</SelectItem>
                  <SelectItem value="wholesale">Comercio al por mayor</SelectItem>
                  <SelectItem value="services">Servicios</SelectItem>
                  <SelectItem value="manufacturing">Manufactura</SelectItem>
                  <SelectItem value="agriculture">Agricultura</SelectItem>
                  <SelectItem value="food">Comida</SelectItem>
                  <SelectItem value="other">Otro</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="yearsInBusiness">Años en el Negocio *</Label>
              <Input
                id="yearsInBusiness"
                type="number"
                min="0"
                value={formData.yearsInBusiness || ''}
                onChange={(e) => updateFormData('yearsInBusiness', e.target.value)}
                placeholder="0"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="numberOfEmployees">Número de Empleados</Label>
              <Input
                id="numberOfEmployees"
                type="number"
                min="0"
                value={formData.numberOfEmployees || ''}
                onChange={(e) => updateFormData('numberOfEmployees', e.target.value)}
                placeholder="0"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Sales Information */}
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
          
          {/* Calculated Total Sales */}
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

          {/* Calculated Profits */}
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

      {/* Products Section */}
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
            {(formData.products || []).map((product: any, index: number) => (
              <Card key={product.id} className="border-l-4 border-l-primary/20">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-base">Producto #{index + 1}</CardTitle>
                    {formData.products.length > 1 && (
                      <Button
                        onClick={() => removeProduct(product.id)}
                        size="sm"
                        variant="ghost"
                        className="text-destructive hover:text-destructive"
                      >
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
                      <Select 
                        value={product.unit || ''} 
                        onValueChange={(value) => updateProduct(product.id, 'unit', value)}
                      >
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
                      <Select 
                        value={product.bestMonth || ''} 
                        onValueChange={(value) => updateProduct(product.id, 'bestMonth', value)}
                      >
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
                      <Select 
                        value={product.worstMonth || ''} 
                        onValueChange={(value) => updateProduct(product.id, 'worstMonth', value)}
                      >
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

    </div>
  );
};

export default BusinessFinancialForm;