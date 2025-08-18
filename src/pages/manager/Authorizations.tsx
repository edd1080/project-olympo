import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/layout/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, CheckCircle, XCircle, DollarSign, User, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
const Authorizations = () => {
  const {
    toast
  } = useToast();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  // Mock data for authorizations
  const authorizations = [{
    id: 'AUTH-001',
    applicationId: 'APP-2024-001',
    applicantName: 'María García Pérez',
    amount: 15000,
    status: 'pending',
    completedDate: '2025-01-14',
    investigator: 'Gerente Pérez',
    creditScore: 720,
    riskLevel: 'medium',
    businessType: 'Tienda de Abarrotes',
    recommendedAction: 'approve',
    invcResult: 'verified'
  }, {
    id: 'AUTH-002',
    applicationId: 'APP-2024-002',
    applicantName: 'Carlos Rodríguez López',
    amount: 25000,
    status: 'pending',
    completedDate: '2025-01-13',
    investigator: 'Gerente Morales',
    creditScore: 680,
    riskLevel: 'high',
    businessType: 'Panadería',
    recommendedAction: 'approve_with_conditions',
    invcResult: 'partial_verified'
  }, {
    id: 'AUTH-003',
    applicationId: 'APP-2024-003',
    applicantName: 'Ana López Rivera',
    amount: 10000,
    status: 'approved',
    completedDate: '2025-01-12',
    investigator: 'Gerente González',
    creditScore: 750,
    riskLevel: 'low',
    businessType: 'Ferretería',
    recommendedAction: 'approve',
    invcResult: 'verified',
    approvedDate: '2025-01-14',
    approvedAmount: 10000
  }, {
    id: 'AUTH-004',
    applicationId: 'APP-2024-004',
    applicantName: 'Luis Martínez Soto',
    amount: 30000,
    status: 'rejected',
    completedDate: '2025-01-11',
    investigator: 'Gerente Ruiz',
    creditScore: 580,
    riskLevel: 'high',
    businessType: 'Restaurante',
    recommendedAction: 'reject',
    invcResult: 'discrepancies_found',
    rejectedDate: '2025-01-13',
    rejectionReason: 'Discrepancias en información financiera'
  }];
  const getStatusBadge = (status: string) => {
    const variants = {
      pending: {
        variant: 'secondary' as const,
        label: 'Pendiente',
        icon: null,
        className: 'bg-orange-100 text-orange-800 hover:bg-orange-100'
      },
      approved: {
        variant: 'secondary' as const,
        label: 'Aprobada',
        icon: CheckCircle,
        className: 'bg-green-100 text-green-800 hover:bg-green-100'
      },
      rejected: {
        variant: 'destructive' as const,
        label: 'Rechazada',
        icon: XCircle,
        className: ''
      }
    };
    return variants[status as keyof typeof variants] || variants.pending;
  };
  const handleApprove = (id: string, amount: number) => {
    toast({
      title: "Crédito Aprobado",
      description: `Se ha aprobado el crédito por Q${amount.toLocaleString()}`
    });
  };
  const handleReject = (id: string) => {
    toast({
      title: "Crédito Rechazado",
      description: "Se ha rechazado la solicitud de crédito",
      variant: "destructive"
    });
  };
  const filterAuthorizations = (status: string) => {
    return authorizations.filter(auth => {
      const matchesStatus = status === 'all' || auth.status === status;
      const matchesSearch = auth.applicantName.toLowerCase().includes(searchTerm.toLowerCase()) || auth.id.toLowerCase().includes(searchTerm.toLowerCase()) || auth.businessType.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesStatus && matchesSearch;
    });
  };
  const pendingCount = authorizations.filter(auth => auth.status === 'pending').length;
  const approvedCount = authorizations.filter(auth => auth.status === 'approved').length;
  const rejectedCount = authorizations.filter(auth => auth.status === 'rejected').length;
  return <div className="min-h-screen bg-background">
      <Header />
      
      <main className="mobile-container pt-4 space-y-6">
        {/* Header */}
        <div className="space-y-4">
          <div>
            <h1 className="text-title">Autorizaciones de Crédito</h1>
            <p className="text-muted-foreground">
              Aprobación y gestión de solicitudes completadas
            </p>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Buscar por nombre, ID o negocio..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="pl-10" />
          </div>
        </div>

        {/* Status Tabs */}
        <Tabs defaultValue="all">
          <TabsList className="flex sm:grid w-full sm:grid-cols-4 gap-2 overflow-x-auto">
            <TabsTrigger value="all" className="whitespace-nowrap flex-shrink-0 sm:whitespace-normal text-sm">
              Todas ({authorizations.length})
            </TabsTrigger>
            <TabsTrigger value="pending" className="whitespace-nowrap flex-shrink-0 sm:whitespace-normal text-sm">
              Pendientes ({pendingCount})
            </TabsTrigger>
            <TabsTrigger value="approved" className="whitespace-nowrap flex-shrink-0 sm:whitespace-normal text-sm">
              Aprobadas ({approvedCount})
            </TabsTrigger>
            <TabsTrigger value="rejected" className="whitespace-nowrap flex-shrink-0 sm:whitespace-normal text-sm">
              Rechazadas ({rejectedCount})
            </TabsTrigger>
          </TabsList>

          {['all', 'pending', 'approved', 'rejected'].map(status => <TabsContent key={status} value={status} className="mt-4 space-y-3">
              {filterAuthorizations(status).map(authorization => {
            const statusBadge = getStatusBadge(authorization.status);
            const StatusIcon = statusBadge.icon;
            return <Card key={authorization.id} className="card-hover">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="space-y-1 flex-1">
                          <CardTitle className="text-base">{authorization.applicantName}</CardTitle>
                          <p className="text-sm text-muted-foreground">
                            {authorization.id} • {authorization.businessType}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          {StatusIcon && <StatusIcon className="h-4 w-4" />}
                          <Badge {...statusBadge} className={statusBadge.className}>{statusBadge.label}</Badge>
                        </div>
                      </div>
                    </CardHeader>

                    <CardContent className="space-y-4">
                      {/* Financial Info */}
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div className="flex items-center gap-2">
                          <DollarSign className="h-4 w-4 text-muted-foreground" />
                          <span>Q{authorization.amount.toLocaleString()}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-muted-foreground" />
                          <span>{authorization.investigator}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                          <span>INVC: {authorization.invcResult}</span>
                        </div>
                      </div>


                      {/* Additional Info for Completed */}
                      {authorization.status === 'approved' && <div className="p-3 bg-secondary/50 rounded-lg">
                          <p className="text-sm font-medium text-secondary-foreground">
                            ✓ Aprobado el {authorization.approvedDate}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Monto autorizado: Q{authorization.approvedAmount?.toLocaleString()}
                          </p>
                        </div>}

                      {authorization.status === 'rejected' && <div className="p-3 bg-destructive/10 rounded-lg">
                          <p className="text-sm font-medium text-destructive">
                            ✗ Rechazado el {authorization.rejectedDate}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Motivo: {authorization.rejectionReason}
                          </p>
                        </div>}

                      {/* Action Button for Pending - Navigate to Details */}
                      {authorization.status === 'pending' && <div className="flex gap-2">
                          <Button onClick={() => navigate(`/manager/authorizations/${authorization.id}`)} className="flex-1" size="sm">
                            Iniciar Autorización
                          </Button>
                        </div>}
                    </CardContent>
                  </Card>;
          })}

              {filterAuthorizations(status).length === 0 && <div className="text-center py-8">
                  <p className="text-muted-foreground">
                    No se encontraron autorizaciones
                    {searchTerm && ` que coincidan con "${searchTerm}"`}
                  </p>
                </div>}
            </TabsContent>)}
        </Tabs>
      </main>

      
    </div>;
};
export default Authorizations;