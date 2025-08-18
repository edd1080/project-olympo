
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/layout/Header';
import AlertGroup from '@/components/alerts/AlertGroup';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';


const Alerts = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [alerts, setAlerts] = useState([
    { 
      id: 845520,
      title: 'Rechazo de Documento',
      description: 'Trámite: BVM_845520 de EDGAR CALDERON ha sido rechazado por verificación de documentos.',
      date: '2025-04-08 14:23',
      read: false,
      group: 'today'
    },
    { 
      id: 845521,
      title: 'Aprobación de Documentos',
      description: 'Trámite: BVM_845521 de CARLOS LÓPEZ ha sido aprobado por verificación de documentos.',
      date: '2025-04-08 10:45',
      read: false,
      group: 'today'
    },
    { 
      id: 845519,
      title: 'Desembolso Aprobado',
      description: 'Trámite: BVM_845519 de MARIA RODRIGUEZ ha sido desembolsado.',
      date: '2025-04-07 16:30',
      read: true,
      group: 'yesterday'
    },
  ]);
  
  useEffect(() => {
    const authToken = localStorage.getItem('authToken');
    if (!authToken) {
      navigate('/login');
    }
  }, [navigate]);
  
  const markAllAsRead = () => {
    setAlerts(alerts.map(alert => ({ ...alert, read: true })));
    toast({
      title: "Todas las alertas marcadas como leídas",
    });
  };

  const todayAlerts = alerts.filter(alert => alert.group === 'today');
  const yesterdayAlerts = alerts.filter(alert => alert.group === 'yesterday');
  
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1 px-4 pb-20">
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center py-4">
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
        
        {todayAlerts.length > 0 && (
          <AlertGroup title="Hoy" alerts={todayAlerts} />
        )}
        
        {yesterdayAlerts.length > 0 && (
          <AlertGroup title="Ayer" alerts={yesterdayAlerts} />
        )}
      </main>
      
      
    </div>
  );
};

export default Alerts;
