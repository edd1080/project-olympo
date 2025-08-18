import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '@/components/layout/Header';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, MapPin, User, Phone, DollarSign, Building, Calendar } from 'lucide-react';

const INVCDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Mock data for INVC investigation details
  const investigation = {
    id: 'INVC-001',
    applicationId: 'APP-2024-001',
    applicantName: 'María García Pérez',
    amount: 15000,
    status: 'pending',
    priority: 'high',
    assignedDate: '2025-01-14',
    dueDate: '2025-01-16',
    agent: 'Carlos Mendez',
    location: 'Zona 1, Guatemala',
    businessType: 'Tienda de Abarrotes',
    riskLevel: 'medium',
    phone: '+502 1234-5678',
    address: '1a Avenida 2-34, Zona 1, Guatemala',
    businessAddress: '5ta Calle 8-90, Zona 1, Guatemala',
    creditScore: 720,
    declaredIncome: 8000,
    requestedAmount: 15000,
    businessYears: 3,
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      pending: { variant: 'outline' as const, label: 'Pendiente', className: 'border-amber-300 text-amber-700 bg-amber-50' },
      in_progress: { variant: 'outline' as const, label: 'En Proceso', className: 'border-blue-300 text-blue-700 bg-blue-50' },
      completed: { variant: 'outline' as const, label: 'Completada', className: 'border-emerald-300 text-emerald-700 bg-emerald-50' },
    };
    
    return variants[status as keyof typeof variants] || variants.pending;
  };

  const handleStartInvestigation = () => {
    // Navigate to the comparison view (will be implemented next)
    navigate(`/manager/invc/${id}/comparison`);
  };

  const statusBadge = getStatusBadge(investigation.status);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="mobile-container pt-4 space-y-6">
        {/* Navigation */}
        <div className="flex items-center gap-3">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => navigate('/manager/invc')}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-title">Investigación INVC</h1>
            <p className="text-sm text-muted-foreground">{investigation.id}</p>
          </div>
        </div>

        {/* Action Button */}
        <div className="w-full">
          <Button 
            onClick={handleStartInvestigation}
            className="w-full"
            size="lg"
          >
            Iniciar Investigación
          </Button>
        </div>

        {/* Status Overview */}
        <Card>
          <CardHeader className="pb-6">
            <div className="flex items-start justify-between">
              <div className="space-y-3">
                <CardTitle className="text-xl">{investigation.applicantName}</CardTitle>
                <p className="text-muted-foreground">{investigation.businessType}</p>
              </div>
              <Badge {...statusBadge} className={statusBadge.className}>
                {statusBadge.label}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="grid grid-cols-2 gap-6 text-sm">
              <div className="flex items-center gap-3">
                <DollarSign className="h-5 w-5 text-muted-foreground" />
                <span className="font-medium">Q{investigation.amount.toLocaleString()}</span>
              </div>
              <div className="flex items-center gap-3">
                <User className="h-5 w-5 text-muted-foreground" />
                <span>{investigation.agent}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Applicant Information */}
        <Card>
          <CardHeader className="pb-6">
            <CardTitle className="text-lg">Información del Solicitante</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 pt-0">
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <User className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Nombre</p>
                  <p className="font-medium">{investigation.applicantName}</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <Phone className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Teléfono</p>
                  <p>{investigation.phone}</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Dirección</p>
                  <p>{investigation.address}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Business Information */}
        <Card>
          <CardHeader className="pb-6">
            <CardTitle className="text-lg">Información del Negocio</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 pt-0">
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <Building className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Tipo de Negocio</p>
                  <p className="font-medium">{investigation.businessType}</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Dirección</p>
                  <p>{investigation.businessAddress}</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Tiempo de Operación</p>
                  <p>{investigation.businessYears} años</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Financial Summary */}
        <Card>
          <CardHeader className="pb-6">
            <CardTitle className="text-lg">Resumen Financiero</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="grid grid-cols-1 gap-6">
              <div className="flex items-start gap-4">
                <DollarSign className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Ingresos Declarados</p>
                  <p className="text-lg font-semibold">Q{investigation.declaredIncome.toLocaleString()}</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <DollarSign className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Monto Solicitado</p>
                  <p className="text-lg font-semibold">Q{investigation.requestedAmount.toLocaleString()}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Back Button */}
        <div className="pb-6">
          <Button 
            variant="outline" 
            className="w-full"
            onClick={() => navigate('/manager/invc')}
          >
            Volver a Lista INVC
          </Button>
        </div>
      </main>

      
    </div>
  );
};

export default INVCDetails;