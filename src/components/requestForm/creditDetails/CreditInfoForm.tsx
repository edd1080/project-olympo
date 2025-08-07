import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface CreditInfoFormProps {
  formData: any;
  updateFormData: (field: string, value: any) => void;
}

const CreditInfoForm: React.FC<CreditInfoFormProps> = ({ formData, updateFormData }) => {
  return (
    <div className="space-y-6">
      {/* Subtitle */}
      <h3 className="text-subtitle text-secondary-foreground">Información del crédito</h3>
      
      {/* Network participation checkbox */}
      <div className="flex items-center space-x-2">
        <Checkbox
          id="isInCreditNetwork"
          checked={formData.isInCreditNetwork || false}
          onCheckedChange={(checked) => updateFormData('isInCreditNetwork', checked)}
        />
        <Label 
          htmlFor="isInCreditNetwork" 
          className="text-sm font-normal cursor-pointer"
        >
          El solicitante ya forma parte de la red de crédito productivo
        </Label>
      </div>

      {/* Product information grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="productType" className="text-label">
            Tipo de producto *
          </Label>
          <Select 
            onValueChange={(value) => updateFormData('productType', value)} 
            value={formData.productType || ''}
          >
            <SelectTrigger>
              <SelectValue placeholder="Seleccionar tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="individual">Individual</SelectItem>
              <SelectItem value="colectivo">Colectivo</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="modality" className="text-label">
            Modalidad *
          </Label>
          <Select 
            onValueChange={(value) => updateFormData('modality', value)} 
            value={formData.modality || ''}
          >
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
          <Label htmlFor="product" className="text-label">
            Producto *
          </Label>
          <Select 
            onValueChange={(value) => updateFormData('product', value)} 
            value={formData.product || ''}
          >
            <SelectTrigger>
              <SelectValue placeholder="Seleccionar producto" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="credito-comercial">Crédito Comercial</SelectItem>
              <SelectItem value="credito-personal">Crédito Personal</SelectItem>
              <SelectItem value="microcredito">Microcrédito</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Amount and rate */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="requestedAmount" className="text-label">
            Préstamo solicitado (Q) *
          </Label>
          <Input
            id="requestedAmount"
            type="number"
            min="0"
            step="0.01"
            value={formData.requestedAmount || ''}
            onChange={(e) => updateFormData('requestedAmount', e.target.value)}
            placeholder="0.00"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="interestRate" className="text-label">
            Tasa de interés (%) *
          </Label>
          <Input
            id="interestRate"
            type="number"
            min="0"
            max="100"
            step="0.01"
            value={formData.interestRate || ''}
            onChange={(e) => updateFormData('interestRate', e.target.value)}
            placeholder="0.00"
            readOnly={formData.product ? true : false}
            className={formData.product ? "bg-muted" : ""}
          />
        </div>
      </div>

      {/* Term and destination */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="termMonths" className="text-label">
            Plazo (meses) *
          </Label>
          <Input
            id="termMonths"
            type="number"
            min="1"
            max="120"
            value={formData.termMonths || ''}
            onChange={(e) => updateFormData('termMonths', e.target.value)}
            placeholder="12"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="investmentDestination" className="text-label">
            Inversión/Destino
          </Label>
          <Input
            id="investmentDestination"
            value={formData.investmentDestination || ''}
            onChange={(e) => updateFormData('investmentDestination', e.target.value)}
            placeholder="Destino del crédito"
          />
        </div>
      </div>

      {/* Guarantee and location */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="guarantee" className="text-label">
            Garantía
          </Label>
          <Input
            id="guarantee"
            value={formData.guarantee || ''}
            onChange={(e) => updateFormData('guarantee', e.target.value)}
            placeholder="Tipo de garantía"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="investmentLocation" className="text-label">
            Lugar de inversión
          </Label>
          <Input
            id="investmentLocation"
            value={formData.investmentLocation || ''}
            onChange={(e) => updateFormData('investmentLocation', e.target.value)}
            placeholder="Ubicación de la inversión"
          />
        </div>
      </div>
    </div>
  );
};

export default CreditInfoForm;