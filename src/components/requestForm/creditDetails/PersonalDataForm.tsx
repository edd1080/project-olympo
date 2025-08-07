import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Shield } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { validateDPI, formatDPI } from '@/utils/dpiValidation';

interface PersonalDataFormProps {
  formData: any;
  updateFormData: (field: string, value: any) => void;
}

const PersonalDataForm: React.FC<PersonalDataFormProps> = ({ formData, updateFormData }) => {
  const [cuiError, setCuiError] = React.useState<string>('');
  const [nitError, setNitError] = React.useState<string>('');

  const handleCUIChange = (value: string) => {
    const validation = validateDPI(value);
    if (!validation.isValid) {
      setCuiError(validation.error || '');
    } else {
      setCuiError('');
    }
    updateFormData('cui', value);
  };

  const handleNITChange = (value: string) => {
    // Basic NIT validation (Guatemala format)
    if (value && !/^\d{1,8}-?\d?$/.test(value)) {
      setNitError('Formato de NIT inválido');
    } else {
      setNitError('');
    }
    updateFormData('nit', value);
  };

  const isPreFilled = formData.personalInfo?.numeroDocumento;

  return (
    <div className="space-y-6">
      {/* Subtitle */}
      <h3 className="text-subtitle text-secondary-foreground">Datos personales</h3>
      
      {/* Pre-filled indicator */}
      {isPreFilled && (
        <div className="flex items-center gap-2 p-3 bg-primary/10 border border-primary/20 rounded-lg">
          <Shield className="h-4 w-4 text-primary" />
          <span className="text-sm text-primary">
            Algunos datos han sido prellenados desde la verificación de identidad
          </span>
        </div>
      )}

      {/* CUI and Names */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="cui" className="text-label">
            CUI *
          </Label>
          <Input
            id="cui"
            value={formData.cui || formData.personalInfo?.numeroDocumento || ''}
            onChange={(e) => handleCUIChange(e.target.value)}
            placeholder="0000 00000 0000"
            className={isPreFilled ? "bg-muted" : ""}
            readOnly={isPreFilled}
          />
          {cuiError && (
            <p className="text-sm text-destructive">{cuiError}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="firstName" className="text-label">
            Primer nombre *
          </Label>
          <Input
            id="firstName"
            value={formData.firstName || formData.personalInfo?.nombres?.split(' ')[0] || ''}
            onChange={(e) => updateFormData('firstName', e.target.value)}
            placeholder="Primer nombre"
            className={isPreFilled ? "bg-muted" : ""}
            readOnly={isPreFilled}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="secondName" className="text-label">
            Segundo nombre
          </Label>
          <Input
            id="secondName"
            value={formData.secondName || formData.personalInfo?.nombres?.split(' ')[1] || ''}
            onChange={(e) => updateFormData('secondName', e.target.value)}
            placeholder="Segundo nombre"
            className={isPreFilled ? "bg-muted" : ""}
            readOnly={isPreFilled}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="firstLastName" className="text-label">
            Primer apellido *
          </Label>
          <Input
            id="firstLastName"
            value={formData.firstLastName || formData.personalInfo?.apellidos?.split(' ')[0] || ''}
            onChange={(e) => updateFormData('firstLastName', e.target.value)}
            placeholder="Primer apellido"
            className={isPreFilled ? "bg-muted" : ""}
            readOnly={isPreFilled}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="secondLastName" className="text-label">
            Segundo apellido
          </Label>
          <Input
            id="secondLastName"
            value={formData.secondLastName || formData.personalInfo?.apellidos?.split(' ')[1] || ''}
            onChange={(e) => updateFormData('secondLastName', e.target.value)}
            placeholder="Segundo apellido"
            className={isPreFilled ? "bg-muted" : ""}
            readOnly={isPreFilled}
          />
        </div>

        <div className="space-y-2">
          <Label className="text-label">
            Fecha de nacimiento *
          </Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !formData.birthDate && "text-muted-foreground",
                  isPreFilled && "bg-muted"
                )}
                disabled={isPreFilled}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {formData.birthDate || formData.personalInfo?.fechaNacimiento ? 
                  format(new Date(formData.birthDate || formData.personalInfo?.fechaNacimiento), "dd/MM/yyyy") : 
                  "Seleccionar fecha"
                }
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={formData.birthDate ? new Date(formData.birthDate) : undefined}
                onSelect={(date) => updateFormData('birthDate', date?.toISOString())}
                disabled={(date) => {
                  const today = new Date();
                  const eighteenYearsAgo = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate());
                  return date > eighteenYearsAgo || date < new Date("1900-01-01");
                }}
                initialFocus
                className={cn("p-3 pointer-events-auto")}
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {/* NIT */}
      <div className="space-y-2">
        <Label htmlFor="nit" className="text-label">
          NIT *
        </Label>
        <Input
          id="nit"
          value={formData.nit || formData.personalInfo?.nit || ''}
          onChange={(e) => handleNITChange(e.target.value)}
          placeholder="00000000-0"
          className={isPreFilled ? "bg-muted" : ""}
          readOnly={isPreFilled}
        />
        {nitError && (
          <p className="text-sm text-destructive">{nitError}</p>
        )}
      </div>
    </div>
  );
};

export default PersonalDataForm;