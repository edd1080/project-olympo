
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, User, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';

const PersonalInfo = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: 'Carlos',
    lastName: 'López',
    email: 'carlos.lopez@coopsama.com',
    phone: '+502 1234-5678',
    position: 'Asesor de créditos',
    branch: 'Sucursal Central'
  });

  return (
    <div className="min-h-screen bg-background">
      <div className="sticky top-0 z-10 bg-background border-b border-border px-4 py-3">
        <div className="flex items-center gap-3">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => navigate('/settings')}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-lg font-semibold">Información Personal</h1>
        </div>
      </div>

      <main className="px-4 py-6 space-y-6">
        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription>
            La información personal es de solo consulta. Para realizar cambios, contacta al administrador del sistema.
          </AlertDescription>
        </Alert>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5 text-primary" />
              Datos Personales
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">Nombre</Label>
                <Input
                  id="firstName"
                  value={formData.firstName}
                  readOnly
                  className="bg-muted"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Apellido</Label>
                <Input
                  id="lastName"
                  value={formData.lastName}
                  readOnly
                  className="bg-muted"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Correo electrónico</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                readOnly
                className="bg-muted"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="phone">Teléfono</Label>
              <Input
                id="phone"
                value={formData.phone}
                readOnly
                className="bg-muted"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="position">Puesto</Label>
              <Input
                id="position"
                value={formData.position}
                readOnly
                className="bg-muted"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="branch">Sucursal</Label>
              <Input
                id="branch"
                value={formData.branch}
                readOnly
                className="bg-muted"
              />
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default PersonalInfo;
