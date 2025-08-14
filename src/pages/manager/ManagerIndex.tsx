import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import Header from '@/components/layout/Header';
import BottomNavigationManager from '@/components/layout/BottomNavigationManager';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ClipboardList, CheckCircle, AlertTriangle, Clock, TrendingUp, Users } from 'lucide-react';

const ManagerIndex = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Mock data for dashboard
  const stats = {
    pendingINVC: 12,
    completedToday: 8,
    pendingAuthorizations: 5,
    criticalAlerts: 2,
  };

  const recentINVC = [
    {
      id: 'INVC-001',
      applicantName: 'María García',
      amount: 15000,
      status: 'pending',
      priority: 'high',
      assignedDate: '2025-01-14',
    },
    {
      id: 'INVC-002',
      applicantName: 'Carlos Rodríguez',
      amount: 25000,
      status: 'in_progress',
      priority: 'medium',
      assignedDate: '2025-01-13',
    },
    {
      id: 'INVC-003',
      applicantName: 'Ana López',
      amount: 10000,
      status: 'pending',
      priority: 'high',
      assignedDate: '2025-01-14',
    },
  ];

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

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="mobile-container pt-4 space-y-6">
        {/* Welcome Section */}
        <div className="space-y-2">
          <h1 className="text-title">
            Bienvenido, {user?.fullName}
          </h1>
          <p className="text-muted-foreground">
            Panel de control para gestión de investigaciones y autorizaciones
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 gap-4">
          <Card className="card-hover">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <ClipboardList className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">INVC Pendientes</p>
                  <p className="text-2xl font-semibold">{stats.pendingINVC}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="card-hover">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-success/10 rounded-lg">
                  <CheckCircle className="h-5 w-5 text-success" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Completadas Hoy</p>
                  <p className="text-2xl font-semibold">{stats.completedToday}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="card-hover">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-warning/10 rounded-lg">
                  <Clock className="h-5 w-5 text-warning" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Autorizaciones</p>
                  <p className="text-2xl font-semibold">{stats.pendingAuthorizations}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="card-hover">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-error/10 rounded-lg">
                  <AlertTriangle className="h-5 w-5 text-error" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Alertas Críticas</p>
                  <p className="text-2xl font-semibold">{stats.criticalAlerts}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="space-y-4">
          <h3 className="text-section-title">Acciones Rápidas</h3>
          <div className="grid gap-3">
            <Button 
              onClick={() => navigate('/manager/invc')}
              className="w-full justify-start h-auto p-4"
              variant="outline"
            >
              <div className="flex items-center gap-3 w-full">
                <ClipboardList className="h-5 w-5" />
                <div className="text-left">
                  <p className="font-medium">Ver Investigaciones INVC</p>
                  <p className="text-sm text-muted-foreground">
                    {stats.pendingINVC} investigaciones pendientes
                  </p>
                </div>
              </div>
            </Button>

            <Button 
              onClick={() => navigate('/manager/authorizations')}
              className="w-full justify-start h-auto p-4"
              variant="outline"
            >
              <div className="flex items-center gap-3 w-full">
                <CheckCircle className="h-5 w-5" />
                <div className="text-left">
                  <p className="font-medium">Autorizar Créditos</p>
                  <p className="text-sm text-muted-foreground">
                    {stats.pendingAuthorizations} solicitudes esperando aprobación
                  </p>
                </div>
              </div>
            </Button>
          </div>
        </div>

        {/* Recent INVC Activities */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-section-title">Investigaciones Recientes</h3>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => navigate('/manager/invc')}
            >
              Ver todas
            </Button>
          </div>
          
          <div className="space-y-3">
            {recentINVC.map((invc) => {
              const statusBadge = getStatusBadge(invc.status);
              const priorityBadge = getPriorityBadge(invc.priority);
              
              return (
                <Card key={invc.id} className="card-hover">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1 flex-1">
                        <div className="flex items-center gap-2">
                          <p className="font-medium">{invc.applicantName}</p>
                          <Badge {...priorityBadge}>{priorityBadge.label}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Q{invc.amount.toLocaleString()} • {invc.id}
                        </p>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <Badge {...statusBadge}>{statusBadge.label}</Badge>
                        <p className="text-xs text-muted-foreground">{invc.assignedDate}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </main>

      <BottomNavigationManager />
    </div>
  );
};

export default ManagerIndex;