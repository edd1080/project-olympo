import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';

const ManagerPersonalInfo = () => {
  const navigate = useNavigate();
  
  // Manager-specific personal information
  const [formData] = useState({
    firstName: 'María Elena',
    lastName: 'Rodríguez Morales',
    email: 'maria.rodriguez@crep.gt',
    phone: '+502 5555-1234',
    position: 'Gerente Regional',
    branch: 'Región Central',
    employeeId: 'MGR-001',
    department: 'Operaciones Crediticias',
    supervisionArea: 'Guatemala Centro',
    yearsOfExperience: '8 años'
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-background border-b p-4">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/manager/settings')}
            className="shrink-0"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-lg font-semibold">Información Personal</h1>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-6">
        <Alert>
          <AlertDescription>
            Esta información es solo de consulta. Para modificaciones contacta al departamento de Recursos Humanos.
          </AlertDescription>
        </Alert>

        <Card>
          <CardContent className="p-6 space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                Información Básica
              </h3>
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">Nombres</Label>
                  <Input
                    id="firstName"
                    value={formData.firstName}
                    readOnly
                    className="bg-muted"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Apellidos</Label>
                  <Input
                    id="lastName"
                    value={formData.lastName}
                    readOnly
                    className="bg-muted"
                  />
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
              </div>
            </div>

            {/* Professional Information */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                Información Profesional
              </h3>
              <div className="grid grid-cols-1 gap-4">
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
                  <Label htmlFor="employeeId">ID de Empleado</Label>
                  <Input
                    id="employeeId"
                    value={formData.employeeId}
                    readOnly
                    className="bg-muted"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="department">Departamento</Label>
                  <Input
                    id="department"
                    value={formData.department}
                    readOnly
                    className="bg-muted"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="branch">Región/Sucursal</Label>
                  <Input
                    id="branch"
                    value={formData.branch}
                    readOnly
                    className="bg-muted"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="supervisionArea">Área de Supervisión</Label>
                  <Input
                    id="supervisionArea"
                    value={formData.supervisionArea}
                    readOnly
                    className="bg-muted"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="yearsOfExperience">Años de Experiencia</Label>
                  <Input
                    id="yearsOfExperience"
                    value={formData.yearsOfExperience}
                    readOnly
                    className="bg-muted"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ManagerPersonalInfo;