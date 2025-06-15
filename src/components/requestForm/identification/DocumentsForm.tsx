
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface DocumentsFormProps {
  formData: any;
  updateFormData: (field: string, value: any) => void;
}

const DocumentsForm: React.FC<DocumentsFormProps> = ({ formData, updateFormData }) => {
  // Validation functions
  const validateDPIField = (dpi: string) => {
    if (dpi.length !== 13) return false;
    return /^\d{13}$/.test(dpi);
  };

  const validateCUA = (cua: string) => {
    return /^\d+$/.test(cua) && cua.length > 0;
  };

  const validateCIF = (cif: string) => {
    return /^\d+$/.test(cif) && cif.length > 0;
  };

  const validateNIT = (nit: string) => {
    return /^\d{8}-?\d$/.test(nit);
  };

  return (
    <>
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

      {/* NIT */}
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
        <div></div>
      </div>
    </>
  );
};

export default DocumentsForm;
