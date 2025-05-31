
import React, { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

interface IdentificationContactProps {
  formData: any;
  updateFormData: (field: string, value: any) => void;
}

const IdentificationContact: React.FC<IdentificationContactProps> = ({ formData, updateFormData }) => {
  const [hasDisability, setHasDisability] = useState(formData.hasDisability || false);
  const [isMarried, setIsMarried] = useState(formData.civilStatus === 'married');

  useEffect(() => {
    setIsMarried(formData.civilStatus === 'married');
  }, [formData.civilStatus]);

  useEffect(() => {
    updateFormData('hasDisability', hasDisability);
  }, [hasDisability, updateFormData]);

  // CUI validation function
  const validateCUI = (cui: string) => {
    if (cui.length !== 13) return false;
    // Implement CUI checksum validation for Guatemala
    return true; // Simplified for now
  };

  return (
    <Card className="border-0 shadow-none">
      <CardContent className="p-0 space-y-6">
        <div>
          <h3 className="font-semibold text-lg">Identificación y Contacto</h3>
          <p className="text-muted-foreground text-sm">
            Complete la información básica del solicitante.
          </p>
        </div>
        
        <div className="space-y-6">
          {/* Agencia y Fecha */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="agency">Agencia *</Label>
              <Select value={formData.agency || ''} onValueChange={(value) => updateFormData('agency', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar agencia" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="central">Agencia Central</SelectItem>
                  <SelectItem value="zona1">Zona 1</SelectItem>
                  <SelectItem value="zona10">Zona 10</SelectItem>
                  <SelectItem value="mixco">Mixco</SelectItem>
                  <SelectItem value="villa_nueva">Villa Nueva</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Fecha Solicitud *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !formData.applicationDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.applicationDate ? format(formData.applicationDate, "PPP") : "Seleccionar fecha"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={formData.applicationDate}
                    onSelect={(date) => updateFormData('applicationDate', date)}
                    initialFocus
                    className="p-3 pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {/* CUI y NIT */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="cui">CUI (13 dígitos) *</Label>
              <Input 
                id="cui"
                value={formData.cui || ''} 
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, '').slice(0, 13);
                  updateFormData('cui', value);
                }}
                placeholder="1234567890123"
                maxLength={13}
                className={!validateCUI(formData.cui || '') && formData.cui ? 'border-red-500' : ''}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="nit">NIT (opcional)</Label>
              <Input 
                id="nit"
                value={formData.nit || ''} 
                onChange={(e) => updateFormData('nit', e.target.value)}
                placeholder="12345678-9"
              />
            </div>
          </div>

          {/* Tipo Socio y Nombre */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="memberType">Tipo Socio *</Label>
              <Select value={formData.memberType || ''} onValueChange={(value) => updateFormData('memberType', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="nuevo">Nuevo</SelectItem>
                  <SelectItem value="activo">Activo</SelectItem>
                  <SelectItem value="reingreso">Reingreso</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="fullName">Nombre Completo *</Label>
              <Input 
                id="fullName"
                value={formData.fullName || ''} 
                onChange={(e) => updateFormData('fullName', e.target.value)}
                placeholder="Nombres y apellidos completos"
              />
            </div>
          </div>

          {/* Fecha Nacimiento y Estado Civil */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Fecha Nacimiento *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !formData.birthDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.birthDate ? format(formData.birthDate, "PPP") : "Seleccionar fecha"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={formData.birthDate}
                    onSelect={(date) => updateFormData('birthDate', date)}
                    initialFocus
                    className="p-3 pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label htmlFor="civilStatus">Estado Civil *</Label>
              <Select 
                value={formData.civilStatus || ''} 
                onValueChange={(value) => updateFormData('civilStatus', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="single">Soltero/a</SelectItem>
                  <SelectItem value="married">Casado/a</SelectItem>
                  <SelectItem value="divorced">Divorciado/a</SelectItem>
                  <SelectItem value="widowed">Viudo/a</SelectItem>
                  <SelectItem value="cohabiting">Unión libre</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Campos condicionales para cónyuge */}
          {isMarried && (
            <div className="border rounded-md p-4 space-y-4 bg-muted/20">
              <h4 className="font-medium">Información del Cónyuge</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="spouseName">Nombre Cónyuge *</Label>
                  <Input 
                    id="spouseName"
                    value={formData.spouseName || ''} 
                    onChange={(e) => updateFormData('spouseName', e.target.value)}
                    placeholder="Nombre completo del cónyuge"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="spouseActivity">Actividad Laboral Cónyuge *</Label>
                  <Select value={formData.spouseActivity || ''} onValueChange={(value) => updateFormData('spouseActivity', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar actividad" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="employed">Empleado</SelectItem>
                      <SelectItem value="self_employed">Independiente</SelectItem>
                      <SelectItem value="housework">Hogar</SelectItem>
                      <SelectItem value="student">Estudiante</SelectItem>
                      <SelectItem value="unemployed">Desempleado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          )}

          {/* Nivel Educativo y Dependientes */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="educationLevel">Nivel Educativo *</Label>
              <Select value={formData.educationLevel || ''} onValueChange={(value) => updateFormData('educationLevel', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar nivel" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="primary">Primaria</SelectItem>
                  <SelectItem value="secondary">Secundaria</SelectItem>
                  <SelectItem value="highschool">Bachillerato</SelectItem>
                  <SelectItem value="technical">Técnico</SelectItem>
                  <SelectItem value="university">Universidad</SelectItem>
                  <SelectItem value="postgraduate">Postgrado</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="dependents">Número Dependientes *</Label>
              <Input 
                id="dependents"
                type="number"
                min="0"
                value={formData.dependents || ''} 
                onChange={(e) => updateFormData('dependents', e.target.value)}
                placeholder="0"
              />
            </div>
          </div>

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

          {/* Información del Crédito */}
          <div className="border-t pt-6 space-y-4">
            <h4 className="font-medium">Información del Crédito Solicitado</h4>
            
            <div className="space-y-2">
              <Label htmlFor="creditPurpose">Destino del Crédito *</Label>
              <Select value={formData.creditPurpose || ''} onValueChange={(value) => updateFormData('creditPurpose', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar destino" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="business_capital">Capital de Trabajo</SelectItem>
                  <SelectItem value="equipment">Compra de Equipo</SelectItem>
                  <SelectItem value="inventory">Inventario</SelectItem>
                  <SelectItem value="expansion">Expansión del Negocio</SelectItem>
                  <SelectItem value="personal">Gastos Personales</SelectItem>
                  <SelectItem value="education">Educación</SelectItem>
                  <SelectItem value="health">Salud</SelectItem>
                  <SelectItem value="other">Otro</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="requestedAmount">Monto Solicitado Q *</Label>
                <Input 
                  id="requestedAmount"
                  type="number"
                  min="1"
                  value={formData.requestedAmount || ''} 
                  onChange={(e) => updateFormData('requestedAmount', e.target.value)}
                  placeholder="0.00"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="termMonths">Plazo (meses) *</Label>
                <Input 
                  id="termMonths"
                  type="number"
                  min="6"
                  max="60"
                  value={formData.termMonths || ''} 
                  onChange={(e) => updateFormData('termMonths', e.target.value)}
                  placeholder="12"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="capitalPayment">Forma Pago Capital *</Label>
                <Select value={formData.capitalPayment || ''} onValueChange={(value) => updateFormData('capitalPayment', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar forma" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="monthly">Mensual</SelectItem>
                    <SelectItem value="biweekly">Quincenal</SelectItem>
                    <SelectItem value="weekly">Semanal</SelectItem>
                    <SelectItem value="end_term">Al Vencimiento</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="interestPayment">Forma Pago Interés *</Label>
                <Select value={formData.interestPayment || ''} onValueChange={(value) => updateFormData('interestPayment', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar forma" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="monthly">Mensual</SelectItem>
                    <SelectItem value="biweekly">Quincenal</SelectItem>
                    <SelectItem value="weekly">Semanal</SelectItem>
                    <SelectItem value="deducted">Descontado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Observaciones */}
          <div className="space-y-2">
            <Label htmlFor="characterObservations">Observaciones de Carácter (opcional)</Label>
            <Textarea 
              id="characterObservations"
              value={formData.characterObservations || ''} 
              onChange={(e) => updateFormData('characterObservations', e.target.value)}
              placeholder="Observaciones adicionales sobre el carácter del solicitante"
              rows={3}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default IdentificationContact;
