import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Plus, Check, X } from 'lucide-react';
import type { ComparisonField } from '@/types/invc-comparison';

interface ProductsListProps {
  field: ComparisonField;
  applicationId: string;
}

export const ProductsList: React.FC<ProductsListProps> = ({ field, applicationId }) => {
  const [newProduct, setNewProduct] = useState('');
  const [observedProducts, setObservedProducts] = useState<string[]>([]);

  const declaredProducts = Array.isArray(field.declaredValue) ? field.declaredValue : [];
  
  const handleProductToggle = (product: string, checked: boolean) => {
    if (checked) {
      setObservedProducts(prev => [...prev, product]);
    } else {
      setObservedProducts(prev => prev.filter(p => p !== product));
    }
  };

  const handleAddNewProduct = () => {
    if (newProduct.trim() && !observedProducts.includes(newProduct.trim())) {
      setObservedProducts(prev => [...prev, newProduct.trim()]);
      setNewProduct('');
    }
  };

  const calculateCoincidenceRate = () => {
    if (declaredProducts.length === 0) return 0;
    const matches = declaredProducts.filter(product => observedProducts.includes(product));
    return (matches.length / declaredProducts.length) * 100;
  };

  const coincidenceRate = calculateCoincidenceRate();
  const meetsThreshold = coincidenceRate >= 70;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="text-base">Productos/Servicios</span>
          <Badge variant={field.status === 'pending' ? 'secondary' : 
                        field.status === 'confirmed' ? 'default' : 
                        field.status === 'adjusted' ? 'secondary' : 'destructive'}>
            {field.status === 'pending' && 'Pendiente'}
            {field.status === 'confirmed' && 'Confirmado'}
            {field.status === 'adjusted' && 'Ajustado'}
            {field.status === 'blocked' && 'Bloqueado'}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Productos Declarados */}
          <div>
            <h4 className="font-medium text-sm mb-3">Declarados ({declaredProducts.length})</h4>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {declaredProducts.map((product, index) => (
                <div key={index} className="flex items-center space-x-2 p-2 border rounded">
                  <Checkbox
                    id={`declared-${index}`}
                    checked={observedProducts.includes(product)}
                    onCheckedChange={(checked) => handleProductToggle(product, checked as boolean)}
                  />
                  <label 
                    htmlFor={`declared-${index}`}
                    className="text-sm flex-1 cursor-pointer"
                  >
                    {product}
                  </label>
                  {observedProducts.includes(product) && (
                    <Check className="h-4 w-4 text-green-600" />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Productos Observados */}
          <div>
            <h4 className="font-medium text-sm mb-3">Observados Hoy ({observedProducts.length})</h4>
            
            {/* Agregar nuevo producto */}
            <div className="flex gap-2 mb-3">
              <Input
                value={newProduct}
                onChange={(e) => setNewProduct(e.target.value)}
                placeholder="Agregar producto/servicio"
                className="text-sm"
                onKeyPress={(e) => e.key === 'Enter' && handleAddNewProduct()}
              />
              <Button 
                onClick={handleAddNewProduct}
                size="sm"
                variant="outline"
                disabled={!newProduct.trim()}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            {/* Lista de productos observados */}
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {observedProducts.map((product, index) => {
                const isDeclared = declaredProducts.includes(product);
                return (
                  <div key={index} className={`p-2 border rounded flex items-center justify-between ${
                    isDeclared ? 'bg-green-50 border-green-200' : 'bg-blue-50 border-blue-200'
                  }`}>
                    <span className="text-sm">{product}</span>
                    <div className="flex items-center gap-1">
                      {isDeclared ? (
                        <Badge variant="default" className="text-xs bg-green-100 text-green-800">
                          Coincide
                        </Badge>
                      ) : (
                        <Badge variant="secondary" className="text-xs bg-blue-100 text-blue-800">
                          Nuevo
                        </Badge>
                      )}
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setObservedProducts(prev => prev.filter(p => p !== product))}
                        className="h-6 w-6 p-0"
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Análisis de Coincidencia */}
        {observedProducts.length > 0 && (
          <div className={`p-3 rounded-lg border ${
            meetsThreshold ? 'bg-green-50 border-green-200' : 'bg-orange-50 border-orange-200'
          }`}>
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium text-sm">Análisis de Coincidencia</span>
              <Badge variant={meetsThreshold ? 'default' : 'secondary'}>
                {coincidenceRate.toFixed(0)}% coincidencia
              </Badge>
            </div>
            <div className="text-xs text-muted-foreground">
              {declaredProducts.filter(p => observedProducts.includes(p)).length} de {declaredProducts.length} productos declarados confirmados
              {observedProducts.filter(p => !declaredProducts.includes(p)).length > 0 && 
                ` • ${observedProducts.filter(p => !declaredProducts.includes(p)).length} productos adicionales encontrados`
              }
            </div>
            {!meetsThreshold && (
              <div className="text-xs text-orange-700 mt-1">
                ⚠️ Se requiere mínimo 70% de coincidencia
              </div>
            )}
          </div>
        )}

        {/* Acciones */}
        {observedProducts.length > 0 && field.status === 'pending' && (
          <div className="flex gap-2 pt-4 border-t">
            <Button size="sm" variant="outline" disabled={!meetsThreshold}>
              <Check className="h-3 w-3 mr-1" />
              Confirmar
            </Button>
            <Button size="sm" variant="outline">
              <X className="h-3 w-3 mr-1" />
              Ajustar
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};