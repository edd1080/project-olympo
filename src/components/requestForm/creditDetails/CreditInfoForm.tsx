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
const CreditInfoForm: React.FC<CreditInfoFormProps> = ({
  formData,
  updateFormData
}) => {
  // Product-based configurations
  const productConfigs = {
    'credifacil': { interestRate: 18, termMonths: 24 },
    'crediamiga': { interestRate: 15, termMonths: 24 },
    'credicasa': { interestRate: 12, termMonths: 36 },
    'credinegocio': { interestRate: 20, termMonths: 18 },
    'crediemergencia': { interestRate: 25, termMonths: 12 }
  };

  // Auto-update interest rate and term when product changes
  const handleProductTypeChange = (value: string) => {
    updateFormData('productType', value);
    const config = productConfigs[value as keyof typeof productConfigs];
    if (config) {
      updateFormData('interestRate', config.interestRate.toString());
      updateFormData('termMonths', config.termMonths.toString());
    }
  };
  return <div className="space-y-6">
      {/* Subtitle */}
      <h3 className="text-subtitle text-secondary-foreground">Información del crédito</h3>
      
      {/* Network participation checkbox */}
      <div className="flex items-center space-x-2">
        <Checkbox id="isInCreditNetwork" checked={formData.isInCreditNetwork || false} onCheckedChange={checked => updateFormData('isInCreditNetwork', checked)} />
        <Label htmlFor="isInCreditNetwork" className="text-sm font-normal cursor-pointer">
          El solicitante ya forma parte de la red de crédito productivo
        </Label>
      </div>

      {/* Product information grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="productType" className="text-label">
            Tipo de producto *
          </Label>
          <Select onValueChange={handleProductTypeChange} value={formData.productType || ''}>
            <SelectTrigger>
              <SelectValue placeholder="Seleccionar producto" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="credifacil">CrediFácil</SelectItem>
              <SelectItem value="crediamiga">CrediAmiga</SelectItem>
              <SelectItem value="credicasa">CrediCasa</SelectItem>
              <SelectItem value="credinegocio">CrediNegocio</SelectItem>
              <SelectItem value="crediemergencia">CrediEmergencia</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="modality" className="text-label">
            Modalidad *
          </Label>
          <Select onValueChange={value => updateFormData('modality', value)} value={formData.modality || ''}>
            <SelectTrigger>
              <SelectValue placeholder="Seleccionar modalidad" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="individual">Individual</SelectItem>
              <SelectItem value="grupo">En Grupo</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Amount and rate */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="requestedAmount" className="text-label">Monto solicitado (Q) *</Label>
          <Input 
            id="requestedAmount" 
            type="number" 
            inputMode="numeric"
            min="0" 
            step="0.01" 
            value={formData.requestedAmount || ''} 
            onChange={e => updateFormData('requestedAmount', e.target.value)} 
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
            inputMode="numeric"
            min="0" 
            max="100" 
            step="0.01" 
            value={formData.interestRate || ''} 
            onChange={e => updateFormData('interestRate', e.target.value)} 
            placeholder="0.00" 
            readOnly 
            className="bg-muted" 
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
            inputMode="numeric"
            min="1" 
            max="120" 
            value={formData.termMonths || ''} 
            onChange={e => updateFormData('termMonths', e.target.value)} 
            placeholder="24" 
            readOnly 
            className="bg-muted" 
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="investmentDestination" className="text-label">
            Inversión/Destino
          </Label>
          <Input id="investmentDestination" value={formData.investmentDestination || ''} onChange={e => updateFormData('investmentDestination', e.target.value)} placeholder="Destino del crédito" />
        </div>
      </div>

      {/* Guarantee and location */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="guarantee" className="text-label">
            Garantía
          </Label>
          <Select onValueChange={value => updateFormData('guarantee', value)} value={formData.guarantee || ''}>
            <SelectTrigger>
              <SelectValue placeholder="Seleccionar garantía" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="hipotecaria">Garantía Hipotecaria</SelectItem>
              <SelectItem value="prendaria">Garantía Prendaria</SelectItem>
              <SelectItem value="fiador">Fiador Solidario</SelectItem>
              <SelectItem value="aval">Aval</SelectItem>
              <SelectItem value="sin-garantia">Sin Garantía</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="investmentLocation" className="text-label">
            Lugar de inversión
          </Label>
          <Input id="investmentLocation" value={formData.investmentLocation || ''} onChange={e => updateFormData('investmentLocation', e.target.value)} placeholder="Ubicación de la inversión" />
        </div>
      </div>
    </div>;
};
export default CreditInfoForm;