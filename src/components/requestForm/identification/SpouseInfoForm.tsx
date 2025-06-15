
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

interface SpouseInfoFormProps {
  formData: any;
  updateFormData: (field: string, value: any) => void;
}

const SpouseInfoForm: React.FC<SpouseInfoFormProps> = ({ formData, updateFormData }) => {
  return (
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
  );
};

export default SpouseInfoForm;
