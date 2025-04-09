
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';

interface PersonalInfoProps {
  formData: any;
  updateFormData: (field: string, value: any) => void;
}

const PersonalInfo: React.FC<PersonalInfoProps> = ({ formData, updateFormData }) => {
  return (
    <Card className="border-0 shadow-none">
      <CardContent className="p-0 space-y-4">
        <h3 className="font-semibold text-lg">Información Personal</h3>
        <p className="text-muted-foreground text-sm">
          Por favor proporciona tus datos personales para comenzar la solicitud.
        </p>
        
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">Nombre(s)</Label>
              <Input 
                id="firstName" 
                value={formData.firstName || ''} 
                onChange={(e) => updateFormData('firstName', e.target.value)} 
                placeholder="Nombre(s)"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="lastName">Apellidos</Label>
              <Input 
                id="lastName" 
                value={formData.lastName || ''} 
                onChange={(e) => updateFormData('lastName', e.target.value)} 
                placeholder="Apellidos"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="idNumber">Número de Identificación</Label>
            <Input 
              id="idNumber" 
              value={formData.idNumber || ''} 
              onChange={(e) => updateFormData('idNumber', e.target.value)} 
              placeholder="RFC, CURP, o DNI"
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phone">Teléfono</Label>
              <Input 
                id="phone" 
                value={formData.phone || ''} 
                onChange={(e) => updateFormData('phone', e.target.value)} 
                placeholder="Teléfono"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Correo Electrónico</Label>
              <Input 
                id="email" 
                value={formData.email || ''} 
                onChange={(e) => updateFormData('email', e.target.value)} 
                placeholder="correo@ejemplo.com"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="address">Dirección</Label>
            <Input 
              id="address" 
              value={formData.address || ''} 
              onChange={(e) => updateFormData('address', e.target.value)} 
              placeholder="Dirección completa"
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="city">Ciudad</Label>
              <Input 
                id="city" 
                value={formData.city || ''} 
                onChange={(e) => updateFormData('city', e.target.value)} 
                placeholder="Ciudad"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="state">Estado</Label>
              <Input 
                id="state" 
                value={formData.state || ''} 
                onChange={(e) => updateFormData('state', e.target.value)} 
                placeholder="Estado"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="zipCode">Código Postal</Label>
              <Input 
                id="zipCode" 
                value={formData.zipCode || ''} 
                onChange={(e) => updateFormData('zipCode', e.target.value)} 
                placeholder="Código Postal"
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PersonalInfo;
