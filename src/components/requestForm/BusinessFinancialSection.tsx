import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Trash2, Plus, Upload } from 'lucide-react';
import { useFormContext } from './RequestFormProvider';

interface BusinessFinancialSectionProps {
  formData: any;
  updateFormData: (field: string, value: any) => void;
}

const BusinessFinancialSection: React.FC<BusinessFinancialSectionProps> = ({ formData, updateFormData }) => {
  const { subStep, setSubStep } = useFormContext();

  // Initialize arrays if they don't exist
  if (!formData.products) {
    updateFormData('products', [{ id: 1, type: '', unit: '', quantity: '', unitCost: '', sellingPrice: '', margin: '', bestMonth: '', worstMonth: '', bestAmount: '', worstAmount: '', photo: null }]);
  }
  if (!formData.fixedAssets) {
    updateFormData('fixedAssets', []);
  }
  if (!formData.liabilities) {
    updateFormData('liabilities', []);
  }

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

  const addFixedAsset = () => {
    const newAsset = {
      id: Date.now(),
      type: '',
      brand: '',
      model: '',
      plates: '',
      value: ''
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

  const addLiability = () => {
    const newLiability = {
      id: Date.now(),
      creditor: '',
      amount: '',
      balance: '',
      dueDate: ''
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

  const renderSubSection = () => {
    switch (subStep) {
      case 0: // Información general
        return (
          <Card>
            <CardHeader>
              <CardTitle>Información general del negocio</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="businessName">Nombre del negocio</Label>
                  <Input
                    id="businessName"
                    value={formData.businessName || ''}
                    onChange={(e) => updateFormData('businessName', e.target.value)}
                    placeholder="Nombre comercial"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="businessAddress">Dirección del negocio</Label>
                  <Input
                    id="businessAddress"
                    value={formData.businessAddress || ''}
                    onChange={(e) => updateFormData('businessAddress', e.target.value)}
                    placeholder="Dirección completa"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="cashSales">Ventas mensuales al contado (Q)</Label>
                  <Input
                    id="cashSales"
                    type="number"
                    value={formData.cashSales || ''}
                    onChange={(e) => updateFormData('cashSales', e.target.value)}
                    placeholder="0.00"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="creditSales">Ventas mensuales al crédito (Q)</Label>
                  <Input
                    id="creditSales"
                    type="number"
                    value={formData.creditSales || ''}
                    onChange={(e) => updateFormData('creditSales', e.target.value)}
                    placeholder="0.00"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="totalSales">Total de ventas mensuales (Q)</Label>
                <Input
                  id="totalSales"
                  type="number"
                  value={(parseFloat(formData.cashSales || '0') + parseFloat(formData.creditSales || '0')).toFixed(2)}
                  readOnly
                  className="bg-muted font-medium"
                />
              </div>
            </CardContent>
          </Card>
        );

      case 1: // Egresos / Gastos administrativos
        return (
          <Card>
            <CardHeader>
              <CardTitle>Egresos / Gastos administrativos</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="costOfSales">Costo de venta (Q)</Label>
                <Input
                  id="costOfSales"
                  type="number"
                  value={formData.costOfSales || ''}
                  onChange={(e) => updateFormData('costOfSales', e.target.value)}
                  placeholder="0.00"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="grossProfit">Utilidad bruta (Q)</Label>
                <Input
                  id="grossProfit"
                  type="number"
                  value={(parseFloat(formData.cashSales || '0') + parseFloat(formData.creditSales || '0') - parseFloat(formData.costOfSales || '0')).toFixed(2)}
                  readOnly
                  className="bg-muted font-medium"
                />
              </div>

              <Separator />

              <h4 className="font-medium text-primary">Gastos administrativos</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="bonuses">Bonos/Aguinaldos (Q)</Label>
                  <Input
                    id="bonuses"
                    type="number"
                    value={formData.bonuses || ''}
                    onChange={(e) => updateFormData('bonuses', e.target.value)}
                    placeholder="0.00"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="salaries">Sueldos (Q)</Label>
                  <Input
                    id="salaries"
                    type="number"
                    value={formData.salaries || ''}
                    onChange={(e) => updateFormData('salaries', e.target.value)}
                    placeholder="0.00"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="rent">Alquiler (Q)</Label>
                  <Input
                    id="rent"
                    type="number"
                    value={formData.rent || ''}
                    onChange={(e) => updateFormData('rent', e.target.value)}
                    placeholder="0.00"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="water">Agua (Q)</Label>
                  <Input
                    id="water"
                    type="number"
                    value={formData.water || ''}
                    onChange={(e) => updateFormData('water', e.target.value)}
                    placeholder="0.00"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="electricity">Luz (Q)</Label>
                  <Input
                    id="electricity"
                    type="number"
                    value={formData.electricity || ''}
                    onChange={(e) => updateFormData('electricity', e.target.value)}
                    placeholder="0.00"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Teléfono (Q)</Label>
                  <Input
                    id="phone"
                    type="number"
                    value={formData.phone || ''}
                    onChange={(e) => updateFormData('phone', e.target.value)}
                    placeholder="0.00"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="freight">Fletes (Q)</Label>
                  <Input
                    id="freight"
                    type="number"
                    value={formData.freight || ''}
                    onChange={(e) => updateFormData('freight', e.target.value)}
                    placeholder="0.00"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="otherExpenses">Otros gastos (Q)</Label>
                  <Input
                    id="otherExpenses"
                    type="number"
                    value={formData.otherExpenses || ''}
                    onChange={(e) => updateFormData('otherExpenses', e.target.value)}
                    placeholder="0.00"
                  />
                </div>
              </div>

              <Separator />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="totalAdminExpenses">Total gastos administración (Q)</Label>
                  <Input
                    id="totalAdminExpenses"
                    type="number"
                    value={(
                      parseFloat(formData.bonuses || '0') +
                      parseFloat(formData.salaries || '0') +
                      parseFloat(formData.rent || '0') +
                      parseFloat(formData.water || '0') +
                      parseFloat(formData.electricity || '0') +
                      parseFloat(formData.phone || '0') +
                      parseFloat(formData.freight || '0') +
                      parseFloat(formData.otherExpenses || '0')
                    ).toFixed(2)}
                    readOnly
                    className="bg-muted font-medium"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="netProfit">Utilidad líquida (Q)</Label>
                  <Input
                    id="netProfit"
                    type="number"
                    value={(
                      (parseFloat(formData.cashSales || '0') + parseFloat(formData.creditSales || '0')) -
                      parseFloat(formData.costOfSales || '0') -
                      (
                        parseFloat(formData.bonuses || '0') +
                        parseFloat(formData.salaries || '0') +
                        parseFloat(formData.rent || '0') +
                        parseFloat(formData.water || '0') +
                        parseFloat(formData.electricity || '0') +
                        parseFloat(formData.phone || '0') +
                        parseFloat(formData.freight || '0') +
                        parseFloat(formData.otherExpenses || '0')
                      )
                    ).toFixed(2)}
                    readOnly
                    className="bg-muted font-medium"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        );

      case 2: // Ingresos por productos
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Ingresos por productos (detalle del negocio)
                <Button onClick={addProduct} size="sm" variant="outline">
                  <Plus className="h-4 w-4 mr-2" />
                  Agregar producto
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {formData.products?.map((product: any, index: number) => (
                <div key={product.id} className="p-4 border rounded-lg space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">Producto {index + 1}</h4>
                    {formData.products.length > 1 && (
                      <Button
                        onClick={() => removeProduct(product.id)}
                        size="sm"
                        variant="outline"
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label>Tipo de producto</Label>
                      <Input
                        value={product.type}
                        onChange={(e) => updateProduct(product.id, 'type', e.target.value)}
                        placeholder="Ej: Granos básicos"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Unidad</Label>
                      <Input
                        value={product.unit}
                        onChange={(e) => updateProduct(product.id, 'unit', e.target.value)}
                        placeholder="Ej: Quintal, Libra"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Cantidad</Label>
                      <Input
                        type="number"
                        value={product.quantity}
                        onChange={(e) => updateProduct(product.id, 'quantity', e.target.value)}
                        placeholder="0"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label>Costo unitario (Q)</Label>
                      <Input
                        type="number"
                        value={product.unitCost}
                        onChange={(e) => updateProduct(product.id, 'unitCost', e.target.value)}
                        placeholder="0.00"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Precio de venta (Q)</Label>
                      <Input
                        type="number"
                        value={product.sellingPrice}
                        onChange={(e) => updateProduct(product.id, 'sellingPrice', e.target.value)}
                        placeholder="0.00"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Margen (%)</Label>
                      <Input
                        type="number"
                        value={product.margin}
                        onChange={(e) => updateProduct(product.id, 'margin', e.target.value)}
                        placeholder="0.00"
                        readOnly
                        className="bg-muted"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-2">
                        <Label>Mejor mes</Label>
                        <Input
                          value={product.bestMonth}
                          onChange={(e) => updateProduct(product.id, 'bestMonth', e.target.value)}
                          placeholder="Enero"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Monto (Q)</Label>
                        <Input
                          type="number"
                          value={product.bestAmount}
                          onChange={(e) => updateProduct(product.id, 'bestAmount', e.target.value)}
                          placeholder="0.00"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-2">
                        <Label>Peor mes</Label>
                        <Input
                          value={product.worstMonth}
                          onChange={(e) => updateProduct(product.id, 'worstMonth', e.target.value)}
                          placeholder="Marzo"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Monto (Q)</Label>
                        <Input
                          type="number"
                          value={product.worstAmount}
                          onChange={(e) => updateProduct(product.id, 'worstAmount', e.target.value)}
                          placeholder="0.00"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Foto del producto (opcional)</Label>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm">
                        <Upload className="h-4 w-4 mr-2" />
                        Subir foto
                      </Button>
                      {product.photo && (
                        <span className="text-sm text-muted-foreground">{product.photo.name}</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        );

      case 3: // Información financiera adicional
        const requestedAmount = parseFloat(formData.requestedAmount || '0');
        
        if (requestedAmount <= 20000) {
          return (
            <Card>
              <CardContent className="p-8 text-center">
                <h3 className="text-lg font-medium mb-2">Información financiera adicional no requerida</h3>
                <p className="text-muted-foreground">
                  Esta sección solo es requerida para montos superiores a Q20,000.
                  Monto solicitado: Q{requestedAmount.toLocaleString()}
                </p>
              </CardContent>
            </Card>
          );
        }

        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Estado de situación financiera</CardTitle>
                <p className="text-sm text-muted-foreground">Requerido para montos mayores a Q20,000</p>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Activos */}
                <div>
                  <h4 className="font-medium text-primary mb-4">Activos</h4>
                  
                  <div className="space-y-4">
                    <h5 className="font-medium">Activos corrientes</h5>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="cash">Caja y bancos (Q)</Label>
                        <Input
                          id="cash"
                          type="number"
                          value={formData.cash || ''}
                          onChange={(e) => updateFormData('cash', e.target.value)}
                          placeholder="0.00"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="clients">Clientes (Q)</Label>
                        <Input
                          id="clients"
                          type="number"
                          value={formData.clients || ''}
                          onChange={(e) => updateFormData('clients', e.target.value)}
                          placeholder="0.00"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="inventory">Inventarios (Q)</Label>
                        <Input
                          id="inventory"
                          type="number"
                          value={formData.inventory || ''}
                          onChange={(e) => updateFormData('inventory', e.target.value)}
                          placeholder="0.00"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="totalCurrentAssets">Total activos corrientes (Q)</Label>
                        <Input
                          id="totalCurrentAssets"
                          type="number"
                          value={(
                            parseFloat(formData.cash || '0') +
                            parseFloat(formData.clients || '0') +
                            parseFloat(formData.inventory || '0')
                          ).toFixed(2)}
                          readOnly
                          className="bg-muted font-medium"
                        />
                      </div>
                    </div>
                  </div>

                  <Separator className="my-4" />

                  <div className="space-y-4">
                    <h5 className="font-medium">Activos no corrientes</h5>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="land">Terrenos (Q)</Label>
                        <Input
                          id="land"
                          type="number"
                          value={formData.land || ''}
                          onChange={(e) => updateFormData('land', e.target.value)}
                          placeholder="0.00"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="machinery">Maquinaria (Q)</Label>
                        <Input
                          id="machinery"
                          type="number"
                          value={formData.machinery || ''}
                          onChange={(e) => updateFormData('machinery', e.target.value)}
                          placeholder="0.00"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="vehicles">Vehículos (Q)</Label>
                        <Input
                          id="vehicles"
                          type="number"
                          value={formData.vehicles || ''}
                          onChange={(e) => updateFormData('vehicles', e.target.value)}
                          placeholder="0.00"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="totalNonCurrentAssets">Total activos no corrientes (Q)</Label>
                        <Input
                          id="totalNonCurrentAssets"
                          type="number"
                          value={(
                            parseFloat(formData.land || '0') +
                            parseFloat(formData.machinery || '0') +
                            parseFloat(formData.vehicles || '0')
                          ).toFixed(2)}
                          readOnly
                          className="bg-muted font-medium"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Pasivos */}
                <div>
                  <h4 className="font-medium text-primary mb-4">Pasivos</h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="shortTermLiabilities">Pasivos corto plazo (Q)</Label>
                      <Input
                        id="shortTermLiabilities"
                        type="number"
                        value={formData.shortTermLiabilities || ''}
                        onChange={(e) => updateFormData('shortTermLiabilities', e.target.value)}
                        placeholder="0.00"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="longTermLiabilities">Pasivos largo plazo (Q)</Label>
                      <Input
                        id="longTermLiabilities"
                        type="number"
                        value={formData.longTermLiabilities || ''}
                        onChange={(e) => updateFormData('longTermLiabilities', e.target.value)}
                        placeholder="0.00"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <div className="space-y-2">
                      <Label htmlFor="totalLiabilities">Total pasivos (Q)</Label>
                      <Input
                        id="totalLiabilities"
                        type="number"
                        value={(
                          parseFloat(formData.shortTermLiabilities || '0') +
                          parseFloat(formData.longTermLiabilities || '0')
                        ).toFixed(2)}
                        readOnly
                        className="bg-muted font-medium"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="patrimony">Patrimonio (Q)</Label>
                      <Input
                        id="patrimony"
                        type="number"
                        value={formData.patrimony || ''}
                        onChange={(e) => updateFormData('patrimony', e.target.value)}
                        placeholder="0.00"
                      />
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Detalle de activos fijos */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-medium text-primary">Detalle de activos fijos</h4>
                    <Button onClick={addFixedAsset} size="sm" variant="outline">
                      <Plus className="h-4 w-4 mr-2" />
                      Agregar activo
                    </Button>
                  </div>

                  {formData.fixedAssets?.map((asset: any) => (
                    <div key={asset.id} className="p-4 border rounded-lg space-y-4 mb-4">
                      <div className="flex items-center justify-between">
                        <h5 className="font-medium">Activo fijo</h5>
                        <Button
                          onClick={() => removeFixedAsset(asset.id)}
                          size="sm"
                          variant="outline"
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Tipo</Label>
                          <Input
                            value={asset.type}
                            onChange={(e) => updateFixedAsset(asset.id, 'type', e.target.value)}
                            placeholder="Ej: Vehículo, Maquinaria"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Marca</Label>
                          <Input
                            value={asset.brand}
                            onChange={(e) => updateFixedAsset(asset.id, 'brand', e.target.value)}
                            placeholder="Marca del activo"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label>Modelo</Label>
                          <Input
                            value={asset.model}
                            onChange={(e) => updateFixedAsset(asset.id, 'model', e.target.value)}
                            placeholder="Modelo"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Placas</Label>
                          <Input
                            value={asset.plates}
                            onChange={(e) => updateFixedAsset(asset.id, 'plates', e.target.value)}
                            placeholder="Número de placas"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Valor (Q)</Label>
                          <Input
                            type="number"
                            value={asset.value}
                            onChange={(e) => updateFixedAsset(asset.id, 'value', e.target.value)}
                            placeholder="0.00"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Detalle de pasivos */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-medium text-primary">Detalle de pasivos</h4>
                    <Button onClick={addLiability} size="sm" variant="outline">
                      <Plus className="h-4 w-4 mr-2" />
                      Agregar pasivo
                    </Button>
                  </div>

                  {formData.liabilities?.map((liability: any) => (
                    <div key={liability.id} className="p-4 border rounded-lg space-y-4 mb-4">
                      <div className="flex items-center justify-between">
                        <h5 className="font-medium">Pasivo</h5>
                        <Button
                          onClick={() => removeLiability(liability.id)}
                          size="sm"
                          variant="outline"
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Acreedor</Label>
                          <Input
                            value={liability.creditor}
                            onChange={(e) => updateLiability(liability.id, 'creditor', e.target.value)}
                            placeholder="Nombre del acreedor"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Monto original (Q)</Label>
                          <Input
                            type="number"
                            value={liability.amount}
                            onChange={(e) => updateLiability(liability.id, 'amount', e.target.value)}
                            placeholder="0.00"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Saldo actual (Q)</Label>
                          <Input
                            type="number"
                            value={liability.balance}
                            onChange={(e) => updateLiability(liability.id, 'balance', e.target.value)}
                            placeholder="0.00"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Fecha de vencimiento</Label>
                          <Input
                            type="date"
                            value={liability.dueDate}
                            onChange={(e) => updateLiability(liability.id, 'dueDate', e.target.value)}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {renderSubSection()}
    </div>
  );
};

export default BusinessFinancialSection;