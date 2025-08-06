import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { MapPin, Edit3 } from 'lucide-react';
import AddressModule from './AddressModule';

interface ApplicantInfoSectionProps {
  formData: any;
  updateFormData: (field: string, value: any) => void;
}

const ApplicantInfoSection: React.FC<ApplicantInfoSectionProps> = ({ formData, updateFormData }) => {
  const [isAddressOpen, setIsAddressOpen] = useState(false);

  const handleAddressUpdate = (addressData: any) => {
    updateFormData('personalInfo', { 
      ...formData.personalInfo, 
      direccion: addressData 
    });
    setIsAddressOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Datos personales prellenados */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Datos personales</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="cui">CUI</Label>
            <Input
              id="cui"
              value={formData.personalInfo?.numeroDocumento || ''}
              readOnly
              className="bg-muted"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="fullName">Nombres y apellidos</Label>
            <Input
              id="fullName"
              value={`${formData.personalInfo?.nombres || ''} ${formData.personalInfo?.apellidos || ''}`}
              readOnly
              className="bg-muted"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="birthDate">Fecha de nacimiento</Label>
            <Input
              id="birthDate"
              value={formData.personalInfo?.fechaNacimiento || ''}
              readOnly
              className="bg-muted"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="nit">NIT</Label>
            <Input
              id="nit"
              value={formData.personalInfo?.nit || ''}
              readOnly
              className="bg-muted"
            />
          </div>
        </div>

        {/* Dirección con botón para abrir modal */}
        <div className="space-y-2">
          <Label>Dirección completa</Label>
          <div className="flex gap-2">
            <Input
              value={formData.personalInfo?.direccion?.direccionCompleta || 'No registrada'}
              readOnly
              className="bg-muted flex-1"
            />
            <Sheet open={isAddressOpen} onOpenChange={setIsAddressOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon">
                  <Edit3 className="h-4 w-4" />
                </Button>
              </SheetTrigger>
              <SheetContent side="bottom" className="h-[90vh]">
                <SheetHeader>
                  <SheetTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    Actualizar Dirección
                  </SheetTitle>
                  <SheetDescription>
                    Completa la información de tu dirección de residencia
                  </SheetDescription>
                </SheetHeader>
                <AddressModule
                  initialData={formData.personalInfo?.direccion}
                  onSave={handleAddressUpdate}
                  onCancel={() => setIsAddressOpen(false)}
                />
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>

      {/* Información de contacto */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Información de contacto</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="phone">Teléfono principal</Label>
            <Input
              id="phone"
              value={formData.personalInfo?.telefono || ''}
              onChange={(e) => updateFormData('personalInfo', { ...formData.personalInfo, telefono: e.target.value })}
              placeholder="0000-0000"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="altPhone">Teléfono alternativo</Label>
            <Input
              id="altPhone"
              value={formData.personalInfo?.telefonoAlterno || ''}
              onChange={(e) => updateFormData('personalInfo', { ...formData.personalInfo, telefonoAlterno: e.target.value })}
              placeholder="0000-0000"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Correo electrónico</Label>
          <Input
            id="email"
            type="email"
            value={formData.personalInfo?.email || ''}
            onChange={(e) => updateFormData('personalInfo', { ...formData.personalInfo, email: e.target.value })}
            placeholder="correo@ejemplo.com"
          />
        </div>
      </div>

      {/* Información adicional */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Información adicional</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="educationLevel">Nivel de escolaridad</Label>
            <Select onValueChange={(value) => updateFormData('educationLevel', value)} value={formData.educationLevel || ''}>
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

          <div className="space-y-2">
            <Label htmlFor="profession">Profesión u oficio</Label>
            <Input
              id="profession"
              value={formData.profession || ''}
              onChange={(e) => updateFormData('profession', e.target.value)}
              placeholder="Profesión u oficio"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="houseOwnership">Tenencia de vivienda</Label>
            <Select onValueChange={(value) => updateFormData('houseOwnership', value)} value={formData.houseOwnership || ''}>
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

          <div className="space-y-2">
            <Label htmlFor="maritalStatus">Estado civil</Label>
            <Select onValueChange={(value) => updateFormData('maritalStatus', value)} value={formData.maritalStatus || ''}>
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
        </div>
      </div>

      {/* Datos del cónyuge - condicionales */}
      {(formData.maritalStatus === 'casado' || formData.maritalStatus === 'unido') && (
        <div className="space-y-4 p-4 border rounded-lg bg-muted/50">
          <h4 className="font-medium text-primary">Datos del cónyuge</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="spouseName">Nombre completo</Label>
              <Input
                id="spouseName"
                value={formData.spouseName || ''}
                onChange={(e) => updateFormData('spouseName', e.target.value)}
                placeholder="Nombre del cónyuge"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="spouseDPI">DPI</Label>
              <Input
                id="spouseDPI"
                value={formData.spouseDPI || ''}
                onChange={(e) => updateFormData('spouseDPI', e.target.value)}
                placeholder="0000000000000"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="spouseProfession">Profesión</Label>
              <Input
                id="spouseProfession"
                value={formData.spouseProfession || ''}
                onChange={(e) => updateFormData('spouseProfession', e.target.value)}
                placeholder="Profesión del cónyuge"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="spouseIncome">Ingresos mensuales (Q)</Label>
              <Input
                id="spouseIncome"
                type="number"
                value={formData.spouseIncome || ''}
                onChange={(e) => updateFormData('spouseIncome', e.target.value)}
                placeholder="0.00"
              />
            </div>
          </div>
        </div>
      )}

      {/* Dependientes */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Dependientes</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="totalDependents">Total de dependientes</Label>
            <Input
              id="totalDependents"
              type="number"
              value={formData.totalDependents || ''}
              onChange={(e) => updateFormData('totalDependents', e.target.value)}
              placeholder="0"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="studyingDependents">Dependientes estudiando</Label>
            <Input
              id="studyingDependents"
              type="number"
              value={formData.studyingDependents || ''}
              onChange={(e) => updateFormData('studyingDependents', e.target.value)}
              placeholder="0"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplicantInfoSection;