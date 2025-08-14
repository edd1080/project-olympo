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
import { Search, Filter, User, Banknote } from 'lucide-react';

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
      assignedDate: '2025-01-14',
      agent: 'Carlos Mendez',
      businessType: 'Tienda de Abarrotes',
    },
    {
      id: 'INVC-002',
      applicationId: 'APP-2024-002',
      applicantName: 'Carlos Rodríguez López',
      amount: 25000,
      status: 'in_progress',
      assignedDate: '2025-01-13',
      agent: 'Ana Morales',
      businessType: 'Panadería',
    },
    {
      id: 'INVC-003',
      applicationId: 'APP-2024-003',
      applicantName: 'Ana López Rivera',
      amount: 10000,
      status: 'pending',
      assignedDate: '2025-01-14',
      agent: 'José Hernández',
      businessType: 'Ferretería',
    },
    {
      id: 'INVC-004',
      applicationId: 'APP-2024-004',
      applicantName: 'Luis Martínez Soto',
      amount: 30000,
      status: 'completed',
      assignedDate: '2025-01-12',
      agent: 'Carmen Ruiz',
      businessType: 'Restaurante',
    },
  ];

  const getStatusBadge = (status: string) => {
    const variants = {
      pending: { className: 'bg-orange-100 text-orange-700 text-xs px-2 py-1', label: 'Pendiente' },
      in_progress: { className: 'bg-blue-100 text-blue-700 text-xs px-2 py-1', label: 'En Proceso' },
      completed: { className: 'bg-green-100 text-green-700 text-xs px-2 py-1', label: 'Completada' },
      overdue: { className: 'bg-red-100 text-red-700 text-xs px-2 py-1', label: 'Vencida' },
    };
    
    return variants[status as keyof typeof variants] || variants.pending;
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
              
              return (
                <Card 
                  key={investigation.id} 
                  className="card-hover cursor-pointer"
                  onClick={() => navigate(`/manager/invc/${investigation.id}`)}
                >
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      {/* Header */}
                      <div className="flex items-start justify-between">
                        <div className="space-y-1 flex-1">
                          <h3 className="font-semibold">{investigation.applicantName}</h3>
                          <p className="text-sm text-muted-foreground">
                            {investigation.id} • {investigation.businessType}
                          </p>
                        </div>
                        <div className={statusBadge.className}>
                          {statusBadge.label}
                        </div>
                      </div>

                      {/* Details */}
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-muted-foreground" />
                          <span>{investigation.agent}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Banknote className="h-4 w-4 text-muted-foreground" />
                          <span>Q{investigation.amount.toLocaleString()}</span>
                        </div>
                      </div>
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