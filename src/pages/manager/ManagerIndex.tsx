import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import Header from '@/components/layout/Header';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ClipboardList, CheckCircle, AlertTriangle, Clock, TrendingUp, Users, ChevronRight } from 'lucide-react';
import ManagerMetricsCard from '@/components/dashboard/ManagerMetricsCard';
const ManagerIndex = () => {
  const {
    user
  } = useAuth();
  const navigate = useNavigate();

  // Mock data for dashboard
  const stats = {
    pendingINVC: 12,
    completedToday: 8,
    pendingAuthorizations: 5,
    criticalAlerts: 2
  };
  const recentINVC = [{
    id: 'INVC-001',
    applicantName: 'María García',
    amount: 15000,
    status: 'pending',
    priority: 'high',
    assignedDate: '2025-01-14'
  }, {
    id: 'INVC-002',
    applicantName: 'Carlos Rodríguez',
    amount: 25000,
    status: 'in_progress',
    priority: 'medium',
    assignedDate: '2025-01-13'
  }, {
    id: 'INVC-003',
    applicantName: 'Ana López',
    amount: 10000,
    status: 'pending',
    priority: 'high',
    assignedDate: '2025-01-14'
  }];
  const getStatusBadge = (status: string) => {
    const variants = {
      pending: {
        variant: 'destructive' as const,
        label: 'Pendiente'
      },
      in_progress: {
        variant: 'default' as const,
        label: 'En Proceso'
      },
      completed: {
        variant: 'secondary' as const,
        label: 'Completada'
      }
    };
    return variants[status as keyof typeof variants] || variants.pending;
  };
  const getPriorityBadge = (priority: string) => {
    const variants = {
      high: {
        variant: 'destructive' as const,
        label: 'Alta'
      },
      medium: {
        variant: 'default' as const,
        label: 'Media'
      },
      low: {
        variant: 'secondary' as const,
        label: 'Baja'
      }
    };
    return variants[priority as keyof typeof variants] || variants.medium;
  };
  return <div className="min-h-screen bg-background">
      <Header />
      
      <main className="mobile-container pt-4 space-y-6">
        {/* Welcome Section */}
        <div className="space-y-2">
          <h1 className="text-title">
            Bienvenido, {user?.fullName}
          </h1>
          <p className="text-muted-foreground text-sm">
            Panel de control para gestión de investigaciones y autorizaciones
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 gap-4">
          <ManagerMetricsCard icon={ClipboardList} title="INVC Pendientes" value={stats.pendingINVC} colorClass="bg-blue-500/10" iconColorClass="text-blue-500" />
          
          <ManagerMetricsCard icon={CheckCircle} title="Completadas Hoy" value={stats.completedToday} colorClass="bg-green-500/10" iconColorClass="text-green-500" />
          
          <ManagerMetricsCard icon={Clock} title="Autorizaciones" description="Pendientes" value={stats.pendingAuthorizations} colorClass="bg-amber-500/10" iconColorClass="text-amber-500" />
          
          <ManagerMetricsCard icon={AlertTriangle} title="Alertas Críticas" value={stats.criticalAlerts} colorClass="bg-red-500/10" iconColorClass="text-red-500" />
        </div>

        {/* Quick Actions */}
        <div className="space-y-4">
          <h3 className="text-section-title">Acciones Rápidas</h3>
          <div className="grid gap-3">
            <Card className="card-hover cursor-pointer" onClick={() => navigate('/manager/invc')}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-blue-500/10 rounded-lg">
                      <ClipboardList className="h-5 w-5 text-blue-500" />
                    </div>
                    <div>
                      <p className="font-semibold">Gestionar INVC</p>
                      <p className="text-sm text-muted-foreground">
                        Investigaciones y validaciones de campo
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="h-5 w-5 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>

            <Card className="card-hover cursor-pointer" onClick={() => navigate('/manager/authorizations')}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-green-500/10 rounded-lg">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    </div>
                    <div>
                      <p className="font-semibold">Autorizar Créditos</p>
                      <p className="text-sm text-muted-foreground">
                        {stats.pendingAuthorizations} solicitudes esperando aprobación
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="h-5 w-5 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>

            <Card className="card-hover cursor-pointer" onClick={() => navigate('/alerts')}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-red-500/10 rounded-lg">
                      <AlertTriangle className="h-5 w-5 text-red-500" />
                    </div>
                    <div>
                      <p className="font-semibold">Ver Alertas</p>
                      <p className="text-sm text-muted-foreground">
                        {stats.criticalAlerts} alertas críticas activas
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="h-5 w-5 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      
    </div>;
};
export default ManagerIndex;