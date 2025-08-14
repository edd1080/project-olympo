import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/layout/Header';
import BottomNavigationManager from '@/components/layout/BottomNavigationManager';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, Filter, MapPin, Clock, User, DollarSign } from 'lucide-react';

const INVCList = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Mock data for INVC investigations
  const investigations = [
    {
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
    },
    {
      id: 'INVC-002',
      applicationId: 'APP-2024-002',
      applicantName: 'Carlos Rodríguez López',
      amount: 25000,
      status: 'in_progress',
      priority: 'medium',
      assignedDate: '2025-01-13',
      dueDate: '2025-01-15',
      agent: 'Ana Morales',
      location: 'Zona 10, Guatemala',
      businessType: 'Panadería',
      riskLevel: 'low',
    },
    {
      id: 'INVC-003',
      applicationId: 'APP-2024-003',
      applicantName: 'Ana López Rivera',
      amount: 10000,
      status: 'pending',
      priority: 'high',
      assignedDate: '2025-01-14',
      dueDate: '2025-01-16',
      agent: 'José Hernández',
      location: 'Mixco, Guatemala',
      businessType: 'Ferretería',
      riskLevel: 'high',
    },
    {
      id: 'INVC-004',
      applicationId: 'APP-2024-004',
      applicantName: 'Luis Martínez Soto',
      amount: 30000,
      status: 'completed',
      priority: 'low',
      assignedDate: '2025-01-12',
      dueDate: '2025-01-14',
      agent: 'Carmen Ruiz',
      location: 'Villa Nueva',
      businessType: 'Restaurante',
      riskLevel: 'medium',
    },
  ];

  const getStatusBadge = (status: string) => {
    const variants = {
      pending: { variant: 'destructive' as const, label: 'Pendiente' },
      in_progress: { variant: 'default' as const, label: 'En Proceso' },
      completed: { variant: 'secondary' as const, label: 'Completada' },
      overdue: { variant: 'destructive' as const, label: 'Vencida' },
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
      high: { variant: 'destructive' as const, label: 'Alto' },
      medium: { variant: 'default' as const, label: 'Medio' },
      low: { variant: 'secondary' as const, label: 'Bajo' },
    };
    
    return variants[risk as keyof typeof variants] || variants.medium;
  };

  const filterInvestigations = (status: string) => {
    return investigations.filter(inv => {
      const matchesStatus = status === 'all' || inv.status === status;
      const matchesSearch = inv.applicantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           inv.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           inv.businessType.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesStatus && matchesSearch;
    });
  };

  const pendingCount = investigations.filter(inv => inv.status === 'pending').length;
  const inProgressCount = investigations.filter(inv => inv.status === 'in_progress').length;
  const completedCount = investigations.filter(inv => inv.status === 'completed').length;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="mobile-container pt-4 space-y-6">
        {/* Header */}
        <div className="space-y-4">
          <div>
            <h1 className="text-title">Investigaciones INVC</h1>
            <p className="text-muted-foreground">
              Gestión de investigaciones de campo
            </p>
          </div>

          {/* Search and Filters */}
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por nombre, ID o negocio..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Status Tabs */}
        <Tabs defaultValue="all" onValueChange={setStatusFilter}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="all">
              Todas ({investigations.length})
            </TabsTrigger>
            <TabsTrigger value="pending">
              Pendientes ({pendingCount})
            </TabsTrigger>
            <TabsTrigger value="in_progress">
              En Proceso ({inProgressCount})
            </TabsTrigger>
            <TabsTrigger value="completed">
              Completadas ({completedCount})
            </TabsTrigger>
          </TabsList>

          <TabsContent value={statusFilter} className="mt-4 space-y-3">
            {filterInvestigations(statusFilter).map((investigation) => {
              const statusBadge = getStatusBadge(investigation.status);
              const priorityBadge = getPriorityBadge(investigation.priority);
              const riskBadge = getRiskBadge(investigation.riskLevel);
              
              return (
                <Card key={investigation.id} className="card-hover">
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      {/* Header */}
                      <div className="flex items-start justify-between">
                        <div className="space-y-1 flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="font-semibold">{investigation.applicantName}</h3>
                            <Badge {...priorityBadge}>{priorityBadge.label}</Badge>
                            <Badge {...riskBadge}>{riskBadge.label}</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {investigation.id} • {investigation.businessType}
                          </p>
                        </div>
                        <Badge {...statusBadge}>{statusBadge.label}</Badge>
                      </div>

                      {/* Details */}
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div className="flex items-center gap-2">
                          <DollarSign className="h-4 w-4 text-muted-foreground" />
                          <span>Q{investigation.amount.toLocaleString()}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span>Vence {investigation.dueDate}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-muted-foreground" />
                          <span>{investigation.agent}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <span>{investigation.location}</span>
                        </div>
                      </div>

                      {/* Action Button */}
                      <Button 
                        onClick={() => navigate(`/manager/invc/${investigation.id}`)}
                        className="w-full"
                        variant={investigation.status === 'pending' ? 'default' : 'outline'}
                      >
                        {investigation.status === 'pending' && 'Iniciar Investigación'}
                        {investigation.status === 'in_progress' && 'Continuar Investigación'}
                        {investigation.status === 'completed' && 'Ver Detalles'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}

            {filterInvestigations(statusFilter).length === 0 && (
              <div className="text-center py-8">
                <p className="text-muted-foreground">
                  No se encontraron investigaciones
                  {searchTerm && ` que coincidan con "${searchTerm}"`}
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>

      <BottomNavigationManager />
    </div>
  );
};

export default INVCList;