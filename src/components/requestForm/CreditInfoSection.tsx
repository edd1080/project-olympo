import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface CreditInfoSectionProps {
  formData: any;
  updateFormData: (field: string, value: any) => void;
}

const CreditInfoSection: React.FC<CreditInfoSectionProps> = ({ formData, updateFormData }) => {
  return (
    <div className="space-y-6">
      {/* Información del Crédito */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Información del crédito</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="productType">Tipo de producto</Label>
            <Select onValueChange={(value) => updateFormData('productType', value)} value={formData.productType || ''}>
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="individual">Individual</SelectItem>
                <SelectItem value="miamiga">MIAMIGA</SelectItem>
                <SelectItem value="grupal">Grupal</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="modality">Modalidad</Label>
            <Select onValueChange={(value) => updateFormData('modality', value)} value={formData.modality || ''}>
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar modalidad" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="normal">Normal</SelectItem>
                <SelectItem value="especial">Especial</SelectItem>
                <SelectItem value="emergencia">Emergencia</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="product">Producto</Label>
            <Select onValueChange={(value) => updateFormData('product', value)} value={formData.product || ''}>
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar producto" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="credito-comercial">Crédito Comercial</SelectItem>
                <SelectItem value="credito-personal">Crédito Personal</SelectItem>
                <SelectItem value="microcrédito">Microcrédito</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="requestedAmount">Monto solicitado (Q)</Label>
            <Input
              id="requestedAmount"
              type="number"
              value={formData.requestedAmount || ''}
              onChange={(e) => updateFormData('requestedAmount', e.target.value)}
              placeholder="0.00"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="interestRate">Tasa de interés (%)</Label>
            <Input
              id="interestRate"
              type="number"
              value={formData.interestRate || ''}
              onChange={(e) => updateFormData('interestRate', e.target.value)}
              placeholder="0.00"
              readOnly
              className="bg-muted"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="term">Plazo (meses)</Label>
            <Input
              id="term"
              type="number"
              value={formData.term || ''}
              onChange={(e) => updateFormData('term', e.target.value)}
              placeholder="12"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="purpose">Destino</Label>
            <Select onValueChange={(value) => updateFormData('purpose', value)} value={formData.purpose || ''}>
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar destino" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="capital-trabajo">Capital de trabajo</SelectItem>
                <SelectItem value="inversion-fija">Inversión fija</SelectItem>
                <SelectItem value="consolidacion">Consolidación de deudas</SelectItem>
                <SelectItem value="otros">Otros</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="guarantee">Garantía</Label>
            <Select onValueChange={(value) => updateFormData('guarantee', value)} value={formData.guarantee || ''}>
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar garantía" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="fiduciaria">Fiduciaria</SelectItem>
                <SelectItem value="hipotecaria">Hipotecaria</SelectItem>
                <SelectItem value="prendaria">Prendaria</SelectItem>
                <SelectItem value="mixta">Mixta</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="investmentLocation">Lugar de inversión</Label>
            <Input
              id="investmentLocation"
              value={formData.investmentLocation || ''}
              onChange={(e) => updateFormData('investmentLocation', e.target.value)}
              placeholder="Ubicación de la inversión"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreditInfoSection;