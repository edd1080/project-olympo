import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { validateDPI } from '@/utils/dpiValidation';
interface EducationFamilyFormProps {
  formData: any;
  updateFormData: (field: string, value: any) => void;
}
const EducationFamilyForm: React.FC<EducationFamilyFormProps> = ({
  formData,
  updateFormData
}) => {
  const [spouseDpiError, setSpouseDpiError] = React.useState<string>('');
  const handleSpouseDpiChange = (value: string) => {
    const validation = validateDPI(value);
    if (!validation.isValid) {
      setSpouseDpiError(validation.error || '');
    } else {
      setSpouseDpiError('');
    }
    updateFormData('spouseDPI', value);
  };
  const isMarried = formData.maritalStatus === 'casado' || formData.maritalStatus === 'unido';
  return <div className="space-y-6">
      {/* Subtitle */}
      <h3 className="text-subtitle text-secondary-foreground">Información solicitante</h3>
      
      {/* Education and basic info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="educationLevel" className="text-label">
            Nivel de escolaridad *
          </Label>
          <Select onValueChange={value => updateFormData('educationLevel', value)} value={formData.educationLevel || ''}>
            <SelectTrigger>
              <SelectValue placeholder="Seleccionar nivel" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ninguno">Ninguno</SelectItem>
              <SelectItem value="primaria">Primaria</SelectItem>
              <SelectItem value="secundaria">Secundaria</SelectItem>
              <SelectItem value="diversificado">Diversificado</SelectItem>
              <SelectItem value="universitario">Universitario</SelectItem>
              <SelectItem value="postgrado">Postgrado</SelectItem>
            </SelectContent>
          </Select>
        </div>

        
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="profession" className="text-label">
            Profesión u oficio
          </Label>
          <Input id="profession" value={formData.profession || ''} onChange={e => updateFormData('profession', e.target.value)} placeholder="Profesión u oficio" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="houseOwnership" className="text-label">
            Tenencia de la vivienda *
          </Label>
          <Select onValueChange={value => updateFormData('houseOwnership', value)} value={formData.houseOwnership || ''}>
            <SelectTrigger>
              <SelectValue placeholder="Seleccionar tenencia" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="propia">Propia</SelectItem>
              <SelectItem value="alquilada">Alquilada</SelectItem>
              <SelectItem value="familiar">Familiar</SelectItem>
              <SelectItem value="prestada">Prestada</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Marital status */}
      <div className="space-y-2">
        <Label htmlFor="maritalStatus" className="text-label">
          Estado civil *
        </Label>
        <Select onValueChange={value => updateFormData('maritalStatus', value)} value={formData.maritalStatus || ''}>
          <SelectTrigger>
            <SelectValue placeholder="Seleccionar estado civil" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="soltero">Soltero(a)</SelectItem>
            <SelectItem value="casado">Casado(a)</SelectItem>
            <SelectItem value="unido">Unido(a)</SelectItem>
            <SelectItem value="divorciado">Divorciado(a)</SelectItem>
            <SelectItem value="viudo">Viudo(a)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Spouse information - conditional */}
      {isMarried && <div className="space-y-4 p-4 border rounded-lg bg-accent/5 border-accent/20">
          <h4 className="font-medium text-accent-foreground">Datos del cónyuge</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="spouseName" className="text-label">
                Nombre del cónyuge *
              </Label>
              <Input id="spouseName" value={formData.spouseName || ''} onChange={e => updateFormData('spouseName', e.target.value)} placeholder="Nombre completo del cónyuge" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="spouseDPI" className="text-label">
                DPI del cónyuge *
              </Label>
              <Input id="spouseDPI" value={formData.spouseDPI || ''} onChange={e => handleSpouseDpiChange(e.target.value)} placeholder="0000 00000 0000" />
              {spouseDpiError && <p className="text-sm text-destructive">{spouseDpiError}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="spouseProfession" className="text-label">
                Profesión del cónyuge *
              </Label>
              <Input id="spouseProfession" value={formData.spouseProfession || ''} onChange={e => updateFormData('spouseProfession', e.target.value)} placeholder="Profesión del cónyuge" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="spouseIncome" className="text-label">
                Ingresos del cónyuge (Q) *
              </Label>
              <Input id="spouseIncome" type="number" min="0" step="0.01" value={formData.spouseIncome || ''} onChange={e => updateFormData('spouseIncome', e.target.value)} placeholder="0.00" />
            </div>
          </div>
        </div>}

      {/* Dependents */}
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Checkbox id="hasDependents" checked={formData.hasDependents || false} onCheckedChange={checked => updateFormData('hasDependents', checked)} />
          <Label htmlFor="hasDependents" className="text-sm font-normal cursor-pointer">
            ¿Hay personas dependientes económicamente del solicitante?
          </Label>
        </div>

        {formData.hasDependents && <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border rounded-lg bg-muted/30">
            <div className="space-y-2">
              <Label htmlFor="totalDependents" className="text-label">
                No. de dependientes *
              </Label>
              <Input id="totalDependents" type="number" min="1" value={formData.totalDependents || ''} onChange={e => updateFormData('totalDependents', e.target.value)} placeholder="0" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="studyingDependents" className="text-label">
                No. de dependientes estudiando *
              </Label>
              <Input id="studyingDependents" type="number" min="0" max={formData.totalDependents || 0} value={formData.studyingDependents || ''} onChange={e => updateFormData('studyingDependents', e.target.value)} placeholder="0" />
            </div>
          </div>}
      </div>
    </div>;
};
export default EducationFamilyForm;