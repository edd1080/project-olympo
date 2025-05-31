
import React, { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

interface ContactHousingFormProps {
  formData: any;
  updateFormData: (field: string, value: any) => void;
}

const ContactHousingForm: React.FC<ContactHousingFormProps> = ({ formData, updateFormData }) => {
  const [hasDisability, setHasDisability] = useState(formData.hasDisability || false);

  useEffect(() => {
    updateFormData('hasDisability', hasDisability);
  }, [hasDisability, updateFormData]);

  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-semibold text-lg">Contacto y Vivienda</h3>
        <p className="text-muted-foreground text-sm">
          Complete la información de contacto y vivienda del solicitante.
        </p>
      </div>
      
      <div className="space-y-6">
        {/* Contacto */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="mobilePhone">Teléfono Móvil *</Label>
            <Input 
              id="mobilePhone"
              value={formData.mobilePhone || ''} 
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, '').slice(0, 8);
                updateFormData('mobilePhone', value);
              }}
              placeholder="12345678"
              maxLength={8}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Correo Electrónico *</Label>
            <Input 
              id="email"
              type="email"
              value={formData.email || ''} 
              onChange={(e) => updateFormData('email', e.target.value)}
              placeholder="correo@ejemplo.com"
            />
          </div>
        </div>

        {/* Tipo Vivienda */}
        <div className="space-y-3">
          <Label>Tipo Vivienda *</Label>
          <RadioGroup 
            value={formData.housingType || ''} 
            onValueChange={(value) => updateFormData('housingType', value)}
            className="grid grid-cols-2 md:grid-cols-3 gap-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="own" id="own" />
              <Label htmlFor="own">Propia</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="rent" id="rent" />
              <Label htmlFor="rent">Alquilada</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="family" id="family" />
              <Label htmlFor="family">Familiar</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="mortgage" id="mortgage" />
              <Label htmlFor="mortgage">Hipotecada</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="other" id="other" />
              <Label htmlFor="other">Otra</Label>
            </div>
          </RadioGroup>
        </div>

        {/* Dirección y Estabilidad */}
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="address">Dirección Completa *</Label>
            <Textarea 
              id="address"
              value={formData.address || ''} 
              onChange={(e) => updateFormData('address', e.target.value)}
              placeholder="Dirección completa y detallada (mínimo 10 caracteres)"
              rows={3}
              minLength={10}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="residenceStability">Estabilidad Domiciliar *</Label>
            <Select value={formData.residenceStability || ''} onValueChange={(value) => updateFormData('residenceStability', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Tiempo en la dirección actual" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1year">1 año</SelectItem>
                <SelectItem value="2years">2 años</SelectItem>
                <SelectItem value="3years">3 años</SelectItem>
                <SelectItem value="5years">5 años</SelectItem>
                <SelectItem value="more5years">Más de 5 años</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Profesión */}
        <div className="space-y-2">
          <Label htmlFor="profession">Profesión/Oficio *</Label>
          <Select value={formData.profession || ''} onValueChange={(value) => updateFormData('profession', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Seleccionar profesión" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="commerce">Comercio</SelectItem>
              <SelectItem value="agriculture">Agricultura</SelectItem>
              <SelectItem value="services">Servicios</SelectItem>
              <SelectItem value="manufacturing">Manufactura</SelectItem>
              <SelectItem value="transport">Transporte</SelectItem>
              <SelectItem value="construction">Construcción</SelectItem>
              <SelectItem value="other">Otro</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Toggle Incapacidad */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Switch 
              id="hasDisability"
              checked={hasDisability}
              onCheckedChange={setHasDisability}
            />
            <Label htmlFor="hasDisability">¿Tiene alguna incapacidad?</Label>
          </div>

          {hasDisability && (
            <div className="space-y-2">
              <Label htmlFor="disabilityDescription">Descripción de la Incapacidad *</Label>
              <Input 
                id="disabilityDescription"
                value={formData.disabilityDescription || ''} 
                onChange={(e) => updateFormData('disabilityDescription', e.target.value)}
                placeholder="Describir la incapacidad"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContactHousingForm;
