import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';

interface CreditInfoSectionProps {
  formData: any;
  updateFormData: (field: string, value: any) => void;
}

const CreditInfoSection: React.FC<CreditInfoSectionProps> = ({ formData, updateFormData }) => {
  return (
    <div className="space-y-6">
      {/* Información del Crédito */}
      <Card>
        <CardHeader>
          <CardTitle>Información del crédito</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="productType">Tipo de producto</Label>
              <Select onValueChange={(value) => updateFormData('productType', value)} value={formData.productType || ''}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="individual">Individual</SelectItem>
                  <SelectItem value="miamiga">MIAMIGA</SelectItem>
                  <SelectItem value="grupal">Grupal</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="modality">Modalidad</Label>
              <Select onValueChange={(value) => updateFormData('modality', value)} value={formData.modality || ''}>
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
              <Label htmlFor="product">Producto</Label>
              <Select onValueChange={(value) => updateFormData('product', value)} value={formData.product || ''}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar producto" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="credito-comercial">Crédito Comercial</SelectItem>
                  <SelectItem value="credito-personal">Crédito Personal</SelectItem>
                  <SelectItem value="microcrédito">Microcrédito</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="requestedAmount">Monto solicitado (Q)</Label>
              <Input
                id="requestedAmount"
                type="number"
                value={formData.requestedAmount || ''}
                onChange={(e) => updateFormData('requestedAmount', e.target.value)}
                placeholder="0.00"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="interestRate">Tasa de interés (%)</Label>
              <Input
                id="interestRate"
                type="number"
                value={formData.interestRate || ''}
                onChange={(e) => updateFormData('interestRate', e.target.value)}
                placeholder="0.00"
                readOnly
                className="bg-muted"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="term">Plazo (meses)</Label>
              <Input
                id="term"
                type="number"
                value={formData.term || ''}
                onChange={(e) => updateFormData('term', e.target.value)}
                placeholder="12"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="purpose">Destino</Label>
              <Select onValueChange={(value) => updateFormData('purpose', value)} value={formData.purpose || ''}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar destino" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="capital-trabajo">Capital de trabajo</SelectItem>
                  <SelectItem value="inversion-fija">Inversión fija</SelectItem>
                  <SelectItem value="consolidacion">Consolidación de deudas</SelectItem>
                  <SelectItem value="otros">Otros</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="guarantee">Garantía</Label>
              <Select onValueChange={(value) => updateFormData('guarantee', value)} value={formData.guarantee || ''}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar garantía" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="fiduciaria">Fiduciaria</SelectItem>
                  <SelectItem value="hipotecaria">Hipotecaria</SelectItem>
                  <SelectItem value="prendaria">Prendaria</SelectItem>
                  <SelectItem value="mixta">Mixta</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="investmentLocation">Lugar de inversión</Label>
              <Input
                id="investmentLocation"
                value={formData.investmentLocation || ''}
                onChange={(e) => updateFormData('investmentLocation', e.target.value)}
                placeholder="Ubicación de la inversión"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Separator />

      {/* Información del Solicitante */}
      <Card>
        <CardHeader>
          <CardTitle>Información del solicitante</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Datos personales prellenados */}
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

          <div className="space-y-2">
            <Label htmlFor="address">Dirección completa</Label>
            <Textarea
              id="address"
              value={formData.personalInfo?.direccion?.direccionCompleta || ''}
              readOnly
              className="bg-muted"
            />
          </div>

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

          {/* Información adicional editable */}
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="profession">Profesión u oficio</Label>
              <Input
                id="profession"
                value={formData.profession || ''}
                onChange={(e) => updateFormData('profession', e.target.value)}
                placeholder="Profesión u oficio"
              />
            </div>

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

          {/* Datos del cónyuge - condicionales */}
          {(formData.maritalStatus === 'casado' || formData.maritalStatus === 'unido') && (
            <div className="mt-6 space-y-4 p-4 border rounded-lg bg-muted/50">
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
        </CardContent>
      </Card>
    </div>
  );
};

export default CreditInfoSection;