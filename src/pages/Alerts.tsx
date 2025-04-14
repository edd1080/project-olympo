
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/layout/Header';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle2, AlertCircle, Calendar, Clock, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Alerts = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [alerts, setAlerts] = useState([
    { 
      id: 1, 
      title: 'Solicitud requiere documentación adicional', 
      description: 'La solicitud SOL-2025-001 requiere comprobantes adicionales de ingresos.',
      type: 'warning',
      date: '2025-04-08 10:23',
      read: false
    },
    { 
      id: 2, 
      title: 'Solicitud SOL-2025-002 aprobada', 
      description: 'La solicitud de crédito hipotecario para Carlos López ha sido aprobada.',
      type: 'success',
      date: '2025-04-07 16:45',
      read: false
    },
    { 
      id: 3, 
      title: 'Revisión urgente requerida', 
      description: 'La solicitud SOL-2025-003 está pendiente de tu revisión hace más de 48 horas.',
      type: 'urgent',
      date: '2025-04-06 09:12',
      read: false
    },
    { 
      id: 4, 
      title: 'Nuevo prospecto asignado', 
      description: 'Se te ha asignado un nuevo prospecto: Roberto Díaz.',
      type: 'info',
      date: '2025-04-05 14:30',
      read: true
    },
    { 
      id: 5, 
      title: 'Cambio en políticas de crédito', 
      description: 'Se han actualizado las políticas de aprobación para créditos personales.',
      type: 'info',
      date: '2025-04-03 11:05',
      read: true
    },
  ]);
  
  useEffect(() => {
    // Check if user is authenticated
    const authToken = localStorage.getItem('authToken');
    if (!authToken) {
      navigate('/login');
    }
  }, [navigate]);
  
  const markAsRead = (id: number) => {
    setAlerts(alerts.map(alert => 
      alert.id === id ? { ...alert, read: true } : alert
    ));
    toast({
      title: "Alerta marcada como leída",
    });
  };

  const markAllAsRead = () => {
    setAlerts(alerts.map(alert => ({ ...alert, read: true })));
    toast({
      title: "Todas las alertas marcadas como leídas",
    });
  };

  const getAlertIcon = (type: string) => {
    switch(type) {
      case 'success':
        return <CheckCircle2 className="h-6 w-6 text-green-500" />;
      case 'warning':
        return <AlertCircle className="h-6 w-6 text-amber-500" />;
      case 'urgent':
        return <AlertTriangle className="h-6 w-6 text-red-500" />;
      default:
        return <AlertCircle className="h-6 w-6 text-blue-500" />;
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 container py-6 space-y-6">
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
          <div>
            <h2 className="text-2xl font-bold">Alertas</h2>
            <p className="text-muted-foreground">
              {alerts.filter(a => !a.read).length} alertas sin leer
            </p>
          </div>
          
          <Button 
            variant="outline" 
            onClick={markAllAsRead}
            disabled={!alerts.some(a => !a.read)}
          >
            Marcar todas como leídas
          </Button>
        </div>
        
        <div className="space-y-4">
          {alerts.map((alert) => (
            <Card 
              key={alert.id} 
              className={`overflow-hidden transition-colors ${
                !alert.read 
                  ? 'border-l-4 border-l-primary' 
                  : ''
              }`}
            >
              <CardContent className="p-0">
                <div className="p-4 flex gap-4">
                  <div className="pt-1">
                    {getAlertIcon(alert.type)}
                  </div>
                  <div className="flex-1">
                    <h3 className={`font-medium ${!alert.read ? 'text-primary' : ''}`}>
                      {alert.title}
                    </h3>
                    <p className="text-sm mt-1">
                      {alert.description}
                    </p>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground mt-2">
                      <div className="flex items-center">
                        <Calendar className="mr-1 h-3 w-3" />
                        {alert.date.split(' ')[0]}
                      </div>
                      <div className="flex items-center">
                        <Clock className="mr-1 h-3 w-3" />
                        {alert.date.split(' ')[1]}
                      </div>
                    </div>
                  </div>
                  {!alert.read && (
                    <Button 
                      size="sm" 
                      variant="ghost"
                      onClick={() => markAsRead(alert.id)}
                    >
                      Marcar como leída
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Alerts;
