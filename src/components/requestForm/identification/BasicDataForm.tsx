
import React, { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { DatePicker } from '@/components/ui/date-picker';
import { cn } from '@/lib/utils';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { validateDPI } from '@/utils/dpiValidation';

interface BasicDataFormProps {
  formData: any;
  updateFormData: (field: string, value: any) => void;
}

const BasicDataForm: React.FC<BasicDataFormProps> = ({ formData, updateFormData }) => {
  const [isMarried, setIsMarried] = useState(formData.civilStatus === 'married');
  const [calculatedAge, setCalculatedAge] = useState<number | null>(null);

  useEffect(() => {
    setIsMarried(formData.civilStatus === 'married');
  }, [formData.civilStatus]);

  // Calculate age when birth date changes
  useEffect(() => {
    if (formData.birthDate) {
      const today = new Date();
      const birthDate = new Date(formData.birthDate);
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      
      setCalculatedAge(age);
      updateFormData('age', age);
    }
  }, [formData.birthDate, updateFormData]);

  // DPI validation function
  const validateDPIField = (dpi: string) => {
    if (dpi.length !== 13) return false;
    return /^\d{13}$/.test(dpi);
  };

  // CUA validation function
  const validateCUA = (cua: string) => {
    return /^\d+$/.test(cua) && cua.length > 0;
  };

  // CIF validation function
  const validateCIF = (cif: string) => {
    return /^\d+$/.test(cif) && cif.length > 0;
  };

  // NIT validation function
  const validateNIT = (nit: string) => {
    return /^\d{8}-?\d$/.test(nit);
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-semibold text-lg">Datos Básicos</h3>
        <p className="text-muted-foreground text-sm">
          Complete la información básica del solicitante.
        </p>
      </div>
      
      <div className="space-y-6">
        {/* Agencia y Tipo Socio */}
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
        </div>

        {/* Nombres y Apellidos */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="firstName">Nombres *</Label>
            <Input 
              id="firstName"
              value={formData.firstName || ''} 
              onChange={(e) => {
                const value = e.target.value.replace(/[0-9]/g, '');
                updateFormData('firstName', value);
              }}
              placeholder="Nombres completos"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="lastName">Apellidos</Label>
            <Input 
              id="lastName"
              value={formData.lastName || ''} 
              onChange={(e) => {
                const value = e.target.value.replace(/[0-9]/g, '');
                updateFormData('lastName', value);
              }}
              placeholder="Apellidos completos"
            />
          </div>
        </div>

        {/* DPI y CUA */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="dpi">DPI (13 dígitos) *</Label>
            <Input 
              id="dpi"
              value={formData.dpi || ''} 
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, '').slice(0, 13);
                updateFormData('dpi', value);
              }}
              placeholder="1234567890123"
              maxLength={13}
              className={!validateDPIField(formData.dpi || '') && formData.dpi ? 'border-red-500' : ''}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="cua">CUA - T24 *</Label>
            <Input 
              id="cua"
              value={formData.cua || ''} 
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, '');
                updateFormData('cua', value);
              }}
              placeholder="Código CUA"
              className={!validateCUA(formData.cua || '') && formData.cua ? 'border-red-500' : ''}
            />
          </div>
        </div>

        {/* DPI Extendido en y CIF */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="dpiExtendedIn">DPI Extendido en *</Label>
            <Select value={formData.dpiExtendedIn || ''} onValueChange={(value) => updateFormData('dpiExtendedIn', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar ubicación" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="guatemala">Guatemala</SelectItem>
                <SelectItem value="quetzaltenango">Quetzaltenango</SelectItem>
                <SelectItem value="escuintla">Escuintla</SelectItem>
                <SelectItem value="alta_verapaz">Alta Verapaz</SelectItem>
                <SelectItem value="peten">Petén</SelectItem>
                <SelectItem value="otro">Otro</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="cif">CIF *</Label>
            <Input 
              id="cif"
              value={formData.cif || ''} 
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, '');
                updateFormData('cif', value);
              }}
              placeholder="Código CIF"
              className={!validateCIF(formData.cif || '') && formData.cif ? 'border-red-500' : ''}
            />
          </div>
        </div>

        {/* NIT y Género */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="nit">NIT *</Label>
            <Input 
              id="nit"
              value={formData.nit || ''} 
              onChange={(e) => updateFormData('nit', e.target.value)}
              placeholder="12345678-9"
              className={!validateNIT(formData.nit || '') && formData.nit ? 'border-red-500' : ''}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="gender">Género *</Label>
            <Select value={formData.gender || ''} onValueChange={(value) => updateFormData('gender', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar género" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="masculino">Masculino</SelectItem>
                <SelectItem value="femenino">Femenino</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Estado Civil y Fecha Nacimiento */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

          <div className="space-y-2">
            <Label>Fecha Nacimiento *</Label>
            <DatePicker
              date={formData.birthDate}
              onSelect={(date) => updateFormData('birthDate', date)}
              placeholder="Seleccionar fecha de nacimiento"
            />
          </div>
        </div>

        {/* Edad y Dependientes */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="age">Edad *</Label>
            <Input 
              id="age"
              type="number"
              value={calculatedAge || formData.age || ''} 
              readOnly
              placeholder="Se calcula automáticamente"
              className="bg-gray-100"
            />
            {calculatedAge && calculatedAge < 18 && (
              <p className="text-sm text-red-500">La edad debe ser mayor a 18 años</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="dependents">Dependientes *</Label>
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

        {/* Etnia y Nivel Educativo */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="ethnicity">Etnia</Label>
            <Select value={formData.ethnicity || ''} onValueChange={(value) => updateFormData('ethnicity', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar etnia" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="maya">Maya</SelectItem>
                <SelectItem value="garifuna">Garífuna</SelectItem>
                <SelectItem value="xinca">Xinca</SelectItem>
                <SelectItem value="mestizo">Mestizo</SelectItem>
                <SelectItem value="ladino">Ladino</SelectItem>
                <SelectItem value="otro">Otro</SelectItem>
              </SelectContent>
            </Select>
          </div>

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
        </div>

        {/* Profesión y Ocupación */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="profession">Profesión *</Label>
            <Select value={formData.profession || ''} onValueChange={(value) => updateFormData('profession', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar profesión" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="medico">Médico</SelectItem>
                <SelectItem value="ingeniero">Ingeniero</SelectItem>
                <SelectItem value="abogado">Abogado</SelectItem>
                <SelectItem value="contador">Contador</SelectItem>
                <SelectItem value="maestro">Maestro</SelectItem>
                <SelectItem value="comerciante">Comerciante</SelectItem>
                <SelectItem value="agricultor">Agricultor</SelectItem>
                <SelectItem value="otro">Otro</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="occupation">Ocupación *</Label>
            <Select value={formData.occupation || ''} onValueChange={(value) => updateFormData('occupation', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar ocupación" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="empleado">Empleado</SelectItem>
                <SelectItem value="independiente">Independiente</SelectItem>
                <SelectItem value="empresario">Empresario</SelectItem>
                <SelectItem value="jubilado">Jubilado</SelectItem>
                <SelectItem value="estudiante">Estudiante</SelectItem>
                <SelectItem value="ama_casa">Ama de casa</SelectItem>
                <SelectItem value="otro">Otro</SelectItem>
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
      </div>
    </div>
  );
};

export default BasicDataForm;
