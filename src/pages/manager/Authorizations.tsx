import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/layout/Header';
import BottomNavigation from '@/components/layout/BottomNavigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, Clock, DollarSign, User } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Authorization {
  id: string;
  applicationId: string;
  clientName: string;
  requestedAmount: number;
  recommendedAmount: number;
  status: 'pending' | 'approved' | 'rejected';
  submissionDate: string;
  riskLevel: 'low' | 'medium' | 'high';
  agentNotes: string;
}

const Authorizations = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [authorizations, setAuthorizations] = useState<Authorization[]>([]);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      navigate('/login');
      return;
    }

    // Mock data for authorizations
    const mockAuthorizations: Authorization[] = [
      {
        id: 'AUTH_001',
        applicationId: 'SCO_789012',
        clientName: 'Ana García Méndez',
        requestedAmount: 25000,
        recommendedAmount: 22000,
        status: 'pending',
        submissionDate: '2025-01-13',
        riskLevel: 'low',
        agentNotes: 'Cliente con buen historial crediticio. Negocio estable con 3 años de operación.'
      },
      {
        id: 'AUTH_002',
        applicationId: 'SCO_789013',
        clientName: 'Juan Carlos Pérez',
        requestedAmount: 15000,
        recommendedAmount: 15000,
        status: 'pending',
        submissionDate: '2025-01-13',
        riskLevel: 'medium',
        agentNotes: 'Nuevo cliente con referencias comerciales verificadas. Ingresos comprobables.'
      },
      {
        id: 'AUTH_003',
        applicationId: 'SCO_789014',
        clientName: 'Sofia Hernández',
        requestedAmount: 35000,
        recommendedAmount: 30000,
        status: 'approved',
        submissionDate: '2025-01-12',
        riskLevel: 'low',
        agentNotes: 'Excelente perfil. Cliente recurrente con historial de pagos impecable.'
      }
    ];

    setAuthorizations(mockAuthorizations);
  }, [navigate]);

  const getRiskBadge = (risk: string) => {
    switch (risk) {
      case 'low':
        return <Badge variant="outline" className="bg-success/10 text-success border-success">Riesgo Bajo</Badge>;
      case 'medium':
        return <Badge variant="default">Riesgo Medio</Badge>;
      case 'high':
        return <Badge variant="destructive">Riesgo Alto</Badge>;
      default:
        return <Badge variant="secondary">Desconocido</Badge>;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="secondary">Pendiente</Badge>;
      case 'approved':
        return <Badge variant="outline" className="bg-success/10 text-success border-success">Aprobado</Badge>;
      case 'rejected':
        return <Badge variant="destructive">Rechazado</Badge>;
      default:
        return <Badge variant="secondary">Desconocido</Badge>;
    }
  };

  const handleApprove = (authId: string, amount: number) => {
    setAuthorizations(prev => 
      prev.map(auth => 
        auth.id === authId 
          ? { ...auth, status: 'approved' as const }
          : auth
      )
    );
    
    toast({
      title: "Crédito Aprobado",
      description: `Se ha aprobado el crédito por Q${amount.toLocaleString()}`,
    });
  };

  const handleReject = (authId: string) => {
    setAuthorizations(prev => 
      prev.map(auth => 
        auth.id === authId 
          ? { ...auth, status: 'rejected' as const }
          : auth
      )
    );
    
    toast({
      title: "Crédito Rechazado",
      description: "La solicitud ha sido rechazada",
      variant: "destructive"
    });
  };

  const handleViewDetails = (applicationId: string) => {
    navigate(`/applications/${applicationId}`);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="mobile-container py-6">
        <div className="mb-6">
          <h1 className="text-title mb-2">Autorizaciones</h1>
          <p className="text-muted-foreground">
            Revisa y autoriza las solicitudes de crédito enviadas por los agentes.
          </p>
        </div>

        <div className="space-y-4">
          {authorizations.map((auth) => (
            <Card key={auth.id} className="request-card">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{auth.clientName}</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      Solicitud: {auth.applicationId}
                    </p>
                  </div>
                  <div className="flex flex-col gap-2">
                    {getStatusBadge(auth.status)}
                    {getRiskBadge(auth.riskLevel)}
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Monto Solicitado</p>
                    <p className="text-lg text-primary font-semibold">
                      Q{auth.requestedAmount.toLocaleString()}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Monto Recomendado</p>
                    <p className="text-lg text-success font-semibold">
                      Q{auth.recommendedAmount.toLocaleString()}
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-sm font-medium">Notas del Agente:</p>
                  <p className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-md">
                    {auth.agentNotes}
                  </p>
                </div>

                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>Enviado: {new Date(auth.submissionDate).toLocaleDateString('es-GT')}</span>
                </div>

                {auth.status === 'pending' ? (
                  <div className="flex gap-2 pt-2 border-t">
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="flex-1"
                      onClick={() => handleViewDetails(auth.applicationId)}
                    >
                      Ver Detalles
                    </Button>
                    <Button 
                      variant="destructive" 
                      size="sm"
                      onClick={() => handleReject(auth.id)}
                      className="flex items-center gap-1"
                    >
                      <XCircle className="h-4 w-4" />
                      Rechazar
                    </Button>
                    <Button 
                      size="sm"
                      onClick={() => handleApprove(auth.id, auth.recommendedAmount)}
                      className="flex items-center gap-1"
                    >
                      <CheckCircle className="h-4 w-4" />
                      Aprobar
                    </Button>
                  </div>
                ) : (
                  <div className="flex justify-center pt-2 border-t">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleViewDetails(auth.applicationId)}
                    >
                      Ver Detalles
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {authorizations.length === 0 && (
          <div className="text-center py-12">
            <DollarSign className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No hay autorizaciones pendientes</h3>
            <p className="text-muted-foreground">
              Las nuevas solicitudes de autorización aparecerán aquí.
            </p>
          </div>
        )}
      </main>
      
      <BottomNavigation />
    </div>
  );
};

export default Authorizations;