import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/layout/Header';
import BottomNavigation from '@/components/layout/BottomNavigation';
import AlertGroup from '@/components/alerts/AlertGroup';
import { Button } from '@/components/ui/button';
import { CheckCheck } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ManagerAlert {
  id: number;
  title: string;
  description: string;
  date: string;
  read: boolean;
  group: 'today' | 'yesterday' | 'earlier';
  applicationId?: string;
  priority: 'high' | 'medium' | 'low';
  type: 'authorization' | 'investigation' | 'system' | 'agent';
}

const ManagerAlerts = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [alerts, setAlerts] = useState<ManagerAlert[]>([]);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      navigate('/login');
      return;
    }

    // Mock manager-specific alerts
    const mockAlerts: ManagerAlert[] = [
      {
        id: 1001,
        title: 'Autorización Pendiente',
        description: 'Solicitud SCO_789012 de Ana García requiere autorización gerencial por monto elevado (Q25,000).',
        date: '2025-01-13 16:45',
        read: false,
        group: 'today',
        applicationId: 'SCO_789012',
        priority: 'high',
        type: 'authorization'
      },
      {
        id: 1002,
        title: 'Investigación Completada',
        description: 'El agente Carlos Morales completó la investigación de campo para Juan Carlos Pérez.',
        date: '2025-01-13 14:30',
        read: false,
        group: 'today',
        applicationId: 'SCO_789013',
        priority: 'medium',
        type: 'investigation'
      },
      {
        id: 1003,
        title: 'Límite de Autorización Alcanzado',
        description: 'Ha alcanzado el 80% de su límite de autorización mensual. Considere revisar las políticas.',
        date: '2025-01-13 09:15',
        read: false,
        group: 'today',
        priority: 'medium',
        type: 'system'
      },
      {
        id: 1004,
        title: 'Agente Solicita Supervisión',
        description: 'María López requiere supervisión para caso complejo en Zona 18.',
        date: '2025-01-12 17:20',
        read: true,
        group: 'yesterday',
        priority: 'medium',
        type: 'agent'
      },
      {
        id: 1005,
        title: 'Meta Mensual Alcanzada',
        description: 'Felicitaciones! Su equipo ha alcanzado la meta de autorizaciones del mes.',
        date: '2025-01-12 10:00',
        read: true,
        group: 'yesterday',
        priority: 'low',
        type: 'system'
      }
    ];

    setAlerts(mockAlerts);
  }, [navigate]);

  const markAllAsRead = () => {
    setAlerts(prevAlerts => 
      prevAlerts.map(alert => ({ ...alert, read: true }))
    );
    
    toast({
      title: "Alertas marcadas como leídas",
      description: "Todas las alertas han sido marcadas como leídas.",
    });
  };

  const getTodayAlerts = () => alerts.filter(alert => alert.group === 'today');
  const getYesterdayAlerts = () => alerts.filter(alert => alert.group === 'yesterday');

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="mobile-container py-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-title mb-2">Alertas Gerenciales</h1>
            <p className="text-muted-foreground">
              Notificaciones importantes para la gestión de créditos.
            </p>
          </div>
          
          <Button 
            variant="outline" 
            size="sm"
            onClick={markAllAsRead}
            className="flex items-center gap-2"
          >
            <CheckCheck className="h-4 w-4" />
            Marcar todas
          </Button>
        </div>

        <div className="space-y-6">
          {getTodayAlerts().length > 0 && (
            <AlertGroup 
              title="Hoy" 
              alerts={getTodayAlerts().map(alert => ({
                id: alert.id,
                title: alert.title,
                description: alert.description,
                date: alert.date,
                read: alert.read,
                group: alert.group,
                applicationId: alert.applicationId
              }))}
            />
          )}
          
          {getYesterdayAlerts().length > 0 && (
            <AlertGroup 
              title="Ayer" 
              alerts={getYesterdayAlerts().map(alert => ({
                id: alert.id,
                title: alert.title,
                description: alert.description,
                date: alert.date,
                read: alert.read,
                group: alert.group,
                applicationId: alert.applicationId
              }))}
            />
          )}
        </div>

        {alerts.length === 0 && (
          <div className="text-center py-12">
            <CheckCheck className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No hay alertas</h3>
            <p className="text-muted-foreground">
              Las nuevas notificaciones aparecerán aquí.
            </p>
          </div>
        )}
      </main>
      
      <BottomNavigation />
    </div>
  );
};

export default ManagerAlerts;