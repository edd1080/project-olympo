import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/layout/Header';
import BottomNavigation from '@/components/layout/BottomNavigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, Clock, User, Phone } from 'lucide-react';

interface Investigation {
  id: string;
  applicationId: string;
  clientName: string;
  amount: string;
  address: string;
  assignedAgent: string;
  status: 'pending' | 'in-progress' | 'completed';
  requestDate: string;
  dueDate: string;
  phone: string;
}

const INVC = () => {
  const navigate = useNavigate();
  const [investigations, setInvestigations] = useState<Investigation[]>([]);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      navigate('/login');
      return;
    }

    // Mock data for investigations
    const mockInvestigations: Investigation[] = [
      {
        id: 'INV_001',
        applicationId: 'SCO_789012',
        clientName: 'Ana García Méndez',
        amount: 'Q25,000',
        address: 'Zona 10, Guatemala, Guatemala',
        assignedAgent: 'Carlos Morales',
        status: 'pending',
        requestDate: '2025-01-13',
        dueDate: '2025-01-16',
        phone: '+502 5555-1234'
      },
      {
        id: 'INV_002',
        applicationId: 'SCO_789013',
        clientName: 'Juan Carlos Pérez',
        amount: 'Q15,000',
        address: 'Mixco, Guatemala',
        assignedAgent: 'María López',
        status: 'in-progress',
        requestDate: '2025-01-12',
        dueDate: '2025-01-15',
        phone: '+502 5555-5678'
      },
      {
        id: 'INV_003',
        applicationId: 'SCO_789014',
        clientName: 'Sofia Hernández',
        amount: 'Q35,000',
        address: 'Villa Nueva, Guatemala',
        assignedAgent: 'Roberto Castro',
        status: 'completed',
        requestDate: '2025-01-10',
        dueDate: '2025-01-13',
        phone: '+502 5555-9012'
      }
    ];

    setInvestigations(mockInvestigations);
  }, [navigate]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="secondary">Pendiente</Badge>;
      case 'in-progress':
        return <Badge variant="default">En Progreso</Badge>;
      case 'completed':
        return <Badge variant="outline" className="bg-success/10 text-success border-success">Completada</Badge>;
      default:
        return <Badge variant="secondary">Desconocido</Badge>;
    }
  };

  const handleViewDetails = (applicationId: string) => {
    navigate(`/applications/${applicationId}`);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="mobile-container py-6">
        <div className="mb-6">
          <h1 className="text-title mb-2">Investigación de Campo</h1>
          <p className="text-muted-foreground">
            Gestiona y supervisa las investigaciones de campo asignadas a los agentes.
          </p>
        </div>

        <div className="space-y-4">
          {investigations.map((investigation) => (
            <Card key={investigation.id} className="request-card">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{investigation.clientName}</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      Solicitud: {investigation.applicationId}
                    </p>
                  </div>
                  {getStatusBadge(investigation.status)}
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 gap-3">
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span>{investigation.address}</span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span>{investigation.phone}</span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span>Agente: {investigation.assignedAgent}</span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span>Vence: {new Date(investigation.dueDate).toLocaleDateString('es-GT')}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t">
                  <div className="text-lg font-semibold text-primary">
                    {investigation.amount}
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleViewDetails(investigation.applicationId)}
                  >
                    Ver Detalles
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {investigations.length === 0 && (
          <div className="text-center py-12">
            <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No hay investigaciones pendientes</h3>
            <p className="text-muted-foreground">
              Las nuevas investigaciones de campo aparecerán aquí.
            </p>
          </div>
        )}
      </main>
      
      <BottomNavigation />
    </div>
  );
};

export default INVC;