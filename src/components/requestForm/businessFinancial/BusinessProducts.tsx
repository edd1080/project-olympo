import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Separator } from '@/components/ui/separator';
import { Trash2, Camera } from 'lucide-react';

interface BusinessProductsProps {
  formData: any;
  updateFormData: (field: string, value: any) => void;
}

const BusinessProducts: React.FC<BusinessProductsProps> = ({ formData, updateFormData }) => {
  // Ensure at least one product exists
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
          bestMonths: [],
          worstMonths: [],
          bestAmount: '',
          worstAmount: '',
          photo: null,
        },
      ]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const products = formData.products || [];

  const [selectedId, setSelectedId] = useState<number | null>(() => (products[0]?.id ?? null));

  // Keep selection in sync with products array
  useEffect(() => {
    if (products.length === 0) {
      setSelectedId(null);
      return;
    }
    if (!selectedId || !products.some((p: any) => p.id === selectedId)) {
      setSelectedId(products[products.length - 1].id);
    }
  }, [products, selectedId]);

  const selectedProduct = useMemo(() => {
    const product = products.find((p: any) => p.id === selectedId) || products[0];
    if (!product) return null;
    
    // Backward compatibility: convert old single month to array
    return {
      ...product,
      bestMonths: product.bestMonths ?? (product.bestMonth ? [product.bestMonth] : []),
      worstMonths: product.worstMonths ?? (product.worstMonth ? [product.worstMonth] : []),
    };
  }, [products, selectedId]);

  const updateProduct = (id: number, field: string, value: any) => {
    const updatedProducts = (formData.products || []).map((p: any) => (p.id === id ? { ...p, [field]: value } : p));
    updateFormData('products', updatedProducts);
  };

  const removeProduct = (id: number) => {
    const updated = (formData.products || []).filter((p: any) => p.id !== id);
    updateFormData('products', updated);
  };

  // Product chips selector with auto-scroll
  const chipContainerRef = useRef<HTMLDivElement | null>(null);
  const chipRefs = useRef<Record<number, HTMLButtonElement | null>>({});
  useEffect(() => {
    if (!selectedId) return;
    const el = chipRefs.current[selectedId];
    if (el) el.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
  }, [selectedId]);

  // Photo handling
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !selectedProduct) return;
    const reader = new FileReader();
    reader.onload = () => {
      updateProduct(selectedProduct.id, 'photo', reader.result as string);
    };
    reader.readAsDataURL(file);
    // Reset input so the same file can be selected again
    e.currentTarget.value = '';
  };

  return (
    <div className="space-y-3">
      {/* Hide scrollbar style */}
      <style>{`
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        .hide-scrollbar::-webkit-scrollbar { display: none; }
      `}</style>

      {/* Product selector chips */}
      <nav className="hide-scrollbar overflow-x-auto" ref={chipContainerRef}>
        <div className="flex items-center gap-2 py-1">
          {products.map((p: any, idx: number) => (
            <button
              key={p.id}
              ref={(el) => { if (el) chipRefs.current[p.id] = el; }}
              type="button"
              onClick={() => setSelectedId(p.id)}
              className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm whitespace-nowrap transition-colors ${
                p.id === selectedId ? 'bg-primary/10 text-primary border-primary' : 'bg-background hover:bg-muted'
              }`}
            >
              <span className="font-medium">{p.type?.trim() ? p.type : `Producto ${idx + 1}`}</span>
            </button>
          ))}
        </div>
      </nav>

      {/* Outer single card that shows the selected product */}
      {selectedProduct && (
        <Card>
          <CardContent className="space-y-4 pt-6">
            <div className="flex items-center justify-between">
              <div className="text-base font-semibold">{selectedProduct.type?.trim() ? selectedProduct.type : `Producto #${products.findIndex((x: any) => x.id === selectedProduct.id) + 1}`}</div>
              {products.length > 1 && (
                <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive" onClick={() => removeProduct(selectedProduct.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>

            {/* Core fields */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Tipo de Producto *</Label>
                <Input
                  value={selectedProduct.type || ''}
                  onChange={(e) => updateProduct(selectedProduct.id, 'type', e.target.value)}
                  placeholder="Ej: Ropa, Alimentos, etc."
                />
              </div>
              <div className="space-y-2">
                <Label>Unidad de Medida *</Label>
                <Select value={selectedProduct.unit || ''} onValueChange={(value) => updateProduct(selectedProduct.id, 'unit', value)}>
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
                  value={selectedProduct.quantity || ''}
                  onChange={(e) => updateProduct(selectedProduct.id, 'quantity', e.target.value)}
                  placeholder="0"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label>Costo Unitario (Q) *</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={selectedProduct.unitCost || ''}
                  onChange={(e) => updateProduct(selectedProduct.id, 'unitCost', e.target.value)}
                  placeholder="0.00"
                />
              </div>
              <div className="space-y-2">
                <Label>Total Costo (Q)</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={selectedProduct.unitCost || ''}
                  readOnly
                  className="bg-muted"
                  placeholder="0.00"
                />
              </div>
              <div className="space-y-2">
                <Label>Precio de Venta (Q) *</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={selectedProduct.sellingPrice || ''}
                  onChange={(e) => updateProduct(selectedProduct.id, 'sellingPrice', e.target.value)}
                  placeholder="0.00"
                />
              </div>
              <div className="space-y-2">
                <Label>Margen (%)</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={selectedProduct.margin || ''}
                  onChange={(e) => updateProduct(selectedProduct.id, 'margin', e.target.value)}
                  placeholder="0.00"
                  disabled
                  className="bg-muted"
                />
              </div>
            </div>

            <Separator />

            {/* Seasonality Section */}
            <div className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Mejores Meses (seleccionar múltiples)</Label>
                  <ToggleGroup
                    type="multiple"
                    size="sm"
                    value={selectedProduct.bestMonths || []}
                    onValueChange={(value) => updateProduct(selectedProduct.id, 'bestMonths', value)}
                    className="grid grid-cols-4 gap-2"
                  >
                    <ToggleGroupItem 
                      value="january" 
                      variant="outline"
                      className="h-8 px-2 text-xs hover:bg-[#E18E33]/10 border-[#E18E33]/60 data-[state=on]:bg-[#E18E33] data-[state=on]:text-white"
                    >
                      Ene
                    </ToggleGroupItem>
                    <ToggleGroupItem 
                      value="february" 
                      variant="outline"
                      className="h-8 px-2 text-xs hover:bg-[#E18E33]/10 border-[#E18E33]/60 data-[state=on]:bg-[#E18E33] data-[state=on]:text-white"
                    >
                      Feb
                    </ToggleGroupItem>
                    <ToggleGroupItem 
                      value="march" 
                      variant="outline"
                      className="h-8 px-2 text-xs hover:bg-[#E18E33]/10 border-[#E18E33]/60 data-[state=on]:bg-[#E18E33] data-[state=on]:text-white"
                    >
                      Mar
                    </ToggleGroupItem>
                    <ToggleGroupItem 
                      value="april" 
                      variant="outline"
                      className="h-8 px-2 text-xs hover:bg-[#E18E33]/10 border-[#E18E33]/60 data-[state=on]:bg-[#E18E33] data-[state=on]:text-white"
                    >
                      Abr
                    </ToggleGroupItem>
                    <ToggleGroupItem 
                      value="may" 
                      variant="outline"
                      className="h-8 px-2 text-xs hover:bg-[#E18E33]/10 border-[#E18E33]/60 data-[state=on]:bg-[#E18E33] data-[state=on]:text-white"
                    >
                      May
                    </ToggleGroupItem>
                    <ToggleGroupItem 
                      value="june" 
                      variant="outline"
                      className="h-8 px-2 text-xs hover:bg-[#E18E33]/10 border-[#E18E33]/60 data-[state=on]:bg-[#E18E33] data-[state=on]:text-white"
                    >
                      Jun
                    </ToggleGroupItem>
                    <ToggleGroupItem 
                      value="july" 
                      variant="outline"
                      className="h-8 px-2 text-xs hover:bg-[#E18E33]/10 border-[#E18E33]/60 data-[state=on]:bg-[#E18E33] data-[state=on]:text-white"
                    >
                      Jul
                    </ToggleGroupItem>
                    <ToggleGroupItem 
                      value="august" 
                      variant="outline"
                      className="h-8 px-2 text-xs hover:bg-[#E18E33]/10 border-[#E18E33]/60 data-[state=on]:bg-[#E18E33] data-[state=on]:text-white"
                    >
                      Ago
                    </ToggleGroupItem>
                    <ToggleGroupItem 
                      value="september" 
                      variant="outline"
                      className="h-8 px-2 text-xs hover:bg-[#E18E33]/10 border-[#E18E33]/60 data-[state=on]:bg-[#E18E33] data-[state=on]:text-white"
                    >
                      Sep
                    </ToggleGroupItem>
                    <ToggleGroupItem 
                      value="october" 
                      variant="outline"
                      className="h-8 px-2 text-xs hover:bg-[#E18E33]/10 border-[#E18E33]/60 data-[state=on]:bg-[#E18E33] data-[state=on]:text-white"
                    >
                      Oct
                    </ToggleGroupItem>
                    <ToggleGroupItem 
                      value="november" 
                      variant="outline"
                      className="h-8 px-2 text-xs hover:bg-[#E18E33]/10 border-[#E18E33]/60 data-[state=on]:bg-[#E18E33] data-[state=on]:text-white"
                    >
                      Nov
                    </ToggleGroupItem>
                    <ToggleGroupItem 
                      value="december" 
                      variant="outline"
                      className="h-8 px-2 text-xs hover:bg-[#E18E33]/10 border-[#E18E33]/60 data-[state=on]:bg-[#E18E33] data-[state=on]:text-white"
                    >
                      Dic
                    </ToggleGroupItem>
                  </ToggleGroup>
                </div>

                <div className="space-y-2">
                  <Label>Total ventas en mejores meses (Q)</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={selectedProduct.bestAmount || ''}
                    onChange={(e) => updateProduct(selectedProduct.id, 'bestAmount', e.target.value)}
                    placeholder="0.00"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Peores Meses (seleccionar múltiples)</Label>
                  <ToggleGroup
                    type="multiple"
                    size="sm"
                    value={selectedProduct.worstMonths || []}
                    onValueChange={(value) => updateProduct(selectedProduct.id, 'worstMonths', value)}
                    className="grid grid-cols-4 gap-2"
                  >
                    <ToggleGroupItem 
                      value="january" 
                      variant="outline"
                      className="h-8 px-2 text-xs hover:bg-[#E18E33]/10 border-[#E18E33]/60 data-[state=on]:bg-[#E18E33] data-[state=on]:text-white"
                    >
                      Ene
                    </ToggleGroupItem>
                    <ToggleGroupItem 
                      value="february" 
                      variant="outline"
                      className="h-8 px-2 text-xs hover:bg-[#E18E33]/10 border-[#E18E33]/60 data-[state=on]:bg-[#E18E33] data-[state=on]:text-white"
                    >
                      Feb
                    </ToggleGroupItem>
                    <ToggleGroupItem 
                      value="march" 
                      variant="outline"
                      className="h-8 px-2 text-xs hover:bg-[#E18E33]/10 border-[#E18E33]/60 data-[state=on]:bg-[#E18E33] data-[state=on]:text-white"
                    >
                      Mar
                    </ToggleGroupItem>
                    <ToggleGroupItem 
                      value="april" 
                      variant="outline"
                      className="h-8 px-2 text-xs hover:bg-[#E18E33]/10 border-[#E18E33]/60 data-[state=on]:bg-[#E18E33] data-[state=on]:text-white"
                    >
                      Abr
                    </ToggleGroupItem>
                    <ToggleGroupItem 
                      value="may" 
                      variant="outline"
                      className="h-8 px-2 text-xs hover:bg-[#E18E33]/10 border-[#E18E33]/60 data-[state=on]:bg-[#E18E33] data-[state=on]:text-white"
                    >
                      May
                    </ToggleGroupItem>
                    <ToggleGroupItem 
                      value="june" 
                      variant="outline"
                      className="h-8 px-2 text-xs hover:bg-[#E18E33]/10 border-[#E18E33]/60 data-[state=on]:bg-[#E18E33] data-[state=on]:text-white"
                    >
                      Jun
                    </ToggleGroupItem>
                    <ToggleGroupItem 
                      value="july" 
                      variant="outline"
                      className="h-8 px-2 text-xs hover:bg-[#E18E33]/10 border-[#E18E33]/60 data-[state=on]:bg-[#E18E33] data-[state=on]:text-white"
                    >
                      Jul
                    </ToggleGroupItem>
                    <ToggleGroupItem 
                      value="august" 
                      variant="outline"
                      className="h-8 px-2 text-xs hover:bg-[#E18E33]/10 border-[#E18E33]/60 data-[state=on]:bg-[#E18E33] data-[state=on]:text-white"
                    >
                      Ago
                    </ToggleGroupItem>
                    <ToggleGroupItem 
                      value="september" 
                      variant="outline"
                      className="h-8 px-2 text-xs hover:bg-[#E18E33]/10 border-[#E18E33]/60 data-[state=on]:bg-[#E18E33] data-[state=on]:text-white"
                    >
                      Sep
                    </ToggleGroupItem>
                    <ToggleGroupItem 
                      value="october" 
                      variant="outline"
                      className="h-8 px-2 text-xs hover:bg-[#E18E33]/10 border-[#E18E33]/60 data-[state=on]:bg-[#E18E33] data-[state=on]:text-white"
                    >
                      Oct
                    </ToggleGroupItem>
                    <ToggleGroupItem 
                      value="november" 
                      variant="outline"
                      className="h-8 px-2 text-xs hover:bg-[#E18E33]/10 border-[#E18E33]/60 data-[state=on]:bg-[#E18E33] data-[state=on]:text-white"
                    >
                      Nov
                    </ToggleGroupItem>
                    <ToggleGroupItem 
                      value="december" 
                      variant="outline"
                      className="h-8 px-2 text-xs hover:bg-[#E18E33]/10 border-[#E18E33]/60 data-[state=on]:bg-[#E18E33] data-[state=on]:text-white"
                    >
                      Dic
                    </ToggleGroupItem>
                  </ToggleGroup>
                </div>

                <div className="space-y-2">
                  <Label>Total ventas en peores meses (Q)</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={selectedProduct.worstAmount || ''}
                    onChange={(e) => updateProduct(selectedProduct.id, 'worstAmount', e.target.value)}
                    placeholder="0.00"
                  />
                </div>
              </div>
            </div>

            <Separator />

            {/* Photo capture/upload */}
            <div className="space-y-2">
              <Label>Foto del Producto</Label>
              {selectedProduct.photo ? (
                <div className="flex items-start gap-4">
                  <img
                    src={selectedProduct.photo}
                    alt={`Foto del producto ${selectedProduct.type?.trim() ? selectedProduct.type : ''}`}
                    className="h-32 w-32 rounded-md object-cover"
                    loading="lazy"
                  />
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => updateProduct(selectedProduct.id, 'photo', null)}>
                      Eliminar foto
                    </Button>
                    <Button 
                      size="sm" 
                      onClick={() => fileInputRef.current?.click()}
                      className="bg-[#E18E33] hover:bg-[#E18E33]/90 text-white font-medium"
                    >
                      <Camera className="h-4 w-4 mr-1.5" />
                      Reemplazar
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Button 
                    onClick={() => fileInputRef.current?.click()}
                    className="bg-[#E18E33] hover:bg-[#E18E33]/90 text-white font-medium"
                  >
                    <Camera className="h-4 w-4 mr-1.5" />
                    Tomar/Subir foto
                  </Button>
                  <span className="text-sm text-muted-foreground">Formato: JPG/PNG</span>
                </div>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                className="hidden"
                onChange={handleFileSelect}
              />
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default BusinessProducts;
