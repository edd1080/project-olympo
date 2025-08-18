import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '@/components/layout/Header';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, MapPin, User, Phone, DollarSign, Building, Calendar, AlertTriangle } from 'lucide-react';

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
      pending: { variant: 'destructive' as const, label: 'Pendiente' },
      in_progress: { variant: 'default' as const, label: 'En Proceso' },
      completed: { variant: 'secondary' as const, label: 'Completada' },
    };
    
    return variants[status as keyof typeof variants] || variants.pending;
  };

  const getPriorityBadge = (priority: string) => {
    const variants = {
      high: { variant: 'destructive' as const, label: 'Alta' },
      medium: { variant: 'default' as const, label: 'Media' },
      low: { variant: 'secondary' as const, label: 'Baja' },
    };
    
    return variants[priority as keyof typeof variants] || variants.medium;
  };

  const getRiskBadge = (risk: string) => {
    const variants = {
      high: { variant: 'destructive' as const, label: 'Alto Riesgo' },
      medium: { variant: 'default' as const, label: 'Riesgo Medio' },
      low: { variant: 'secondary' as const, label: 'Bajo Riesgo' },
    };
    
    return variants[risk as keyof typeof variants] || variants.medium;
  };

  const handleStartInvestigation = () => {
    // Navigate to the comparison view (will be implemented next)
    navigate(`/manager/invc/${id}/comparison`);
  };

  const statusBadge = getStatusBadge(investigation.status);
  const priorityBadge = getPriorityBadge(investigation.priority);
  const riskBadge = getRiskBadge(investigation.riskLevel);

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

        {/* Status Overview */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <CardTitle className="text-lg">{investigation.applicantName}</CardTitle>
                <p className="text-sm text-muted-foreground">{investigation.businessType}</p>
              </div>
              <div className="flex flex-col gap-2">
                <Badge {...statusBadge}>{statusBadge.label}</Badge>
                <Badge {...priorityBadge}>{priorityBadge.label}</Badge>
                <Badge {...riskBadge}>{riskBadge.label}</Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-muted-foreground" />
                <span>Q{investigation.amount.toLocaleString()}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>Vence: {investigation.dueDate}</span>
              </div>
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <span>{investigation.agent}</span>
              </div>
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                <span>Score: {investigation.creditScore}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Applicant Information */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Información del Solicitante</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">{investigation.applicantName}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span>{investigation.phone}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span>{investigation.address}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Business Information */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Información del Negocio</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Building className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">{investigation.businessType}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span>{investigation.businessAddress}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>{investigation.businessYears} años de operación</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Financial Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Resumen Financiero</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Ingresos Declarados</p>
                <p className="font-semibold">Q{investigation.declaredIncome.toLocaleString()}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Monto Solicitado</p>
                <p className="font-semibold">Q{investigation.requestedAmount.toLocaleString()}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Credit Score</p>
                <p className="font-semibold">{investigation.creditScore}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Nivel de Riesgo</p>
                <Badge {...riskBadge}>{riskBadge.label}</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="space-y-3">
          {investigation.status === 'pending' && (
            <Button 
              onClick={handleStartInvestigation}
              className="w-full"
            >
              Iniciar Investigación de Campo
            </Button>
          )}
          
          {investigation.status === 'in_progress' && (
            <Button 
              onClick={handleStartInvestigation}
              className="w-full"
            >
              Continuar Investigación
            </Button>
          )}

          {investigation.status === 'completed' && (
            <Button 
              onClick={handleStartInvestigation}
              variant="outline"
              className="w-full"
            >
              Ver Resultados de Investigación
            </Button>
          )}

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