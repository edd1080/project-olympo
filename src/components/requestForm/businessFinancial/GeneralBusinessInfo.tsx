import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface GeneralBusinessInfoProps {
  formData: any;
  updateFormData: (field: string, value: any) => void;
}

const GeneralBusinessInfo: React.FC<GeneralBusinessInfoProps> = ({ formData, updateFormData }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Información General del Negocio</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="businessName">Nombre del Negocio *</Label>
            <Input
              id="businessName"
              value={formData.businessName || ''}
              onChange={(e) => updateFormData('businessName', e.target.value)}
              placeholder="Nombre comercial"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="businessType">Tipo de Negocio *</Label>
            <Select value={formData.businessType || ''} onValueChange={(value) => updateFormData('businessType', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="retail">Comercio al por menor</SelectItem>
                <SelectItem value="wholesale">Comercio al por mayor</SelectItem>
                <SelectItem value="services">Servicios</SelectItem>
                <SelectItem value="manufacturing">Manufactura</SelectItem>
                <SelectItem value="agriculture">Agricultura</SelectItem>
                <SelectItem value="food">Comida</SelectItem>
                <SelectItem value="other">Otro</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="yearsInBusiness">Años en el Negocio *</Label>
            <Input
              id="yearsInBusiness"
              type="number"
              min="0"
              value={formData.yearsInBusiness || ''}
              onChange={(e) => updateFormData('yearsInBusiness', e.target.value)}
              placeholder="0"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="numberOfEmployees">Número de Empleados</Label>
            <Input
              id="numberOfEmployees"
              type="number"
              min="0"
              value={formData.numberOfEmployees || ''}
              onChange={(e) => updateFormData('numberOfEmployees', e.target.value)}
              placeholder="0"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default GeneralBusinessInfo;
