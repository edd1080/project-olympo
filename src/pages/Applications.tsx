import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/layout/Header';

import PrequalificationModal from '@/components/prequalification/PrequalificationModal';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, SlidersHorizontal, FileSpreadsheet, Clock, Calendar, Edit, FileText, Copy, Trash2, Share2, MoreVertical, CheckCircle, AlertCircle, BarChart3, Banknote, FileSignature, UserCheck, FileImage, Users, Plus } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger, ContextMenuSeparator } from "@/components/ui/context-menu";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { useAppState } from '@/context/AppStateContext';

const generateRandomSCOId = () => {
  return `SCO_${Math.floor(100000 + Math.random() * 900000)}`;
};

const Applications = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { applications } = useAppState();
  const [showPrequalificationModal, setShowPrequalificationModal] = useState(false);
  const [activeStatusFilter, setActiveStatusFilter] = useState('all');

  useEffect(() => {
    // Check if user is authenticated
    const authToken = localStorage.getItem('authToken');
    if (!authToken) {
      navigate('/login');
    }
  }, [navigate]);

  const handleViewApplication = (id: string) => {
    navigate(`/applications/${id}`);
  };

  const handleEditApplication = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    navigate(`/applications/${id}/edit`);
    toast({
      title: "Edición iniciada",
      description: `Editando solicitud ${id}`,
      duration: 3000
    });
  };

  const handleDuplicateApplication = (id: string, clientName: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    toast({
      title: "Solicitud duplicada",
      description: `Se ha creado una copia de la solicitud de ${clientName}`,
      duration: 3000
    });
  };

  const handleDeleteApplication = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    toast({
      title: "Solicitud eliminada",
      description: `La solicitud ${id} ha sido eliminada`,
      variant: "destructive",
      duration: 3000
    });
  };

  const handleShareApplication = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    toast({
      title: "Compartir solicitud",
      description: `Se ha copiado el enlace de la solicitud ${id}`,
      duration: 3000
    });
  };


  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'draft':
        return <Badge variant="outline" className="bg-slate-100 text-slate-700 border-slate-200 flex items-center gap-1 text-sm px-3 py-1">
            <Clock className="h-4 w-4" />
            <span>Borrador</span>
          </Badge>;
      case 'active':
        return <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 flex items-center gap-1 text-sm px-3 py-1">
            <BarChart3 className="h-4 w-4" />
            <span>Activo</span>
          </Badge>;
      case 'verification':
        return <Badge variant="outline" className="bg-amber-100 text-amber-800 border-amber-200 flex items-center gap-1 text-sm px-3 py-1">
            <Clock className="h-4 w-4" />
            <span>Verificación</span>
          </Badge>;
      case 'approved':
        return <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200 flex items-center gap-1 text-sm px-3 py-1">
            <CheckCircle className="h-4 w-4" />
            <span>Aprobado</span>
          </Badge>;
      case 'rejected':
        return <Badge variant="outline" className="bg-red-100 text-red-800 border-red-200 flex items-center gap-1 text-sm px-3 py-1">
            <AlertCircle className="h-4 w-4" />
            <span>Rechazado</span>
          </Badge>;
      case 'cancelled':
        return <Badge variant="outline" className="bg-red-100 text-red-800 border-red-200 flex items-center gap-1 text-sm px-3 py-1">
            <AlertCircle className="h-4 w-4" />
            <span>Cancelada</span>
          </Badge>;
      default:
        return null;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('es-GT', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    }).format(date);
  };

  const filteredApplications = applications.filter(application => {
    if (activeStatusFilter === 'all') return true;
    return application.status === activeStatusFilter;
  });

  const getStatusCounts = () => {
    return {
      all: applications.length,
      active: applications.filter(app => app.status === 'active').length,
      verification: applications.filter(app => app.status === 'verification').length,
      approved: applications.filter(app => app.status === 'approved').length,
      rejected: applications.filter(app => app.status === 'rejected').length,
      cancelled: applications.filter(app => app.status === 'cancelled').length,
    };
  };

  const statusCounts = getStatusCounts();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 px-4 py-4 pb-20 space-y-6">
        <div>
          <h1 className="text-title mb-1">Tus solicitudes asignadas</h1>
          <p className="text-muted-foreground">Gestiona y administra en tiempo real</p>
        </div>
        
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Buscar solicitudes..." className="pl-10" />
        </div>

        <Tabs value={activeStatusFilter} onValueChange={setActiveStatusFilter} className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="all">
              Todas ({statusCounts.all})
            </TabsTrigger>
            <TabsTrigger value="active">
              Activas ({statusCounts.active})
            </TabsTrigger>
            <TabsTrigger value="verification">
              En Verificación ({statusCounts.verification})
            </TabsTrigger>
            <TabsTrigger value="approved">
              Aprobadas ({statusCounts.approved})
            </TabsTrigger>
            <TabsTrigger value="rejected">
              Rechazadas ({statusCounts.rejected})
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value={activeStatusFilter} className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredApplications.map(application => (
                <ContextMenu key={application.id}>
                  <ContextMenuTrigger>
                    <Card className="card-hover cursor-pointer group relative" onClick={() => handleViewApplication(application.id)}>
                      <CardContent className="p-4">
                        <div className="flex flex-col">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h3 className="text-section-title font-semibold">{application.clientName}</h3>
                              <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                                <Calendar className="h-3 w-3" />
                                <span>{formatDate(application.date)}</span>
                                <FileText className="h-3 w-3 ml-2" />
                                <span>{application.id}</span>
                              </div>
                            </div>
                            
                            <div className="flex flex-col items-end gap-2">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon" className="h-8 w-8 ml-auto transition-opacity" onClick={e => e.stopPropagation()}>
                                    <MoreVertical className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-48">
                                  <DropdownMenuItem onClick={() => handleViewApplication(application.id)}>
                                    <FileText className="mr-2 h-4 w-4" />
                                    <span>Ver detalles</span>
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={e => handleEditApplication(application.id, e)}>
                                    <Edit className="mr-2 h-4 w-4" />
                                    <span>Editar</span>
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={e => handleDuplicateApplication(application.id, application.clientName, e)}>
                                    <Copy className="mr-2 h-4 w-4" />
                                    <span>Duplicar</span>
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem onClick={e => handleShareApplication(application.id, e)}>
                                    <Share2 className="mr-2 h-4 w-4" />
                                    <span>Compartir</span>
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={e => handleDeleteApplication(application.id, e)}>
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    <span>Eliminar</span>
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                              
                              {getStatusBadge(application.status)}
                            </div>
                          </div>
                          
                          <div className="mt-1 mb-1">
                            <div className="flex items-center text-base font-medium mb-1">
                              {application.stage === 'Información Financiera' && <Banknote className="h-4 w-4 mr-2" />}
                              {application.stage === 'Firma de Acta' && <FileSignature className="h-4 w-4 mr-2" />}
                              {application.stage === 'Análisis de Carácter' && <UserCheck className="h-4 w-4 mr-2" />}
                              {application.stage === 'Documentos e Imágenes' && <FileImage className="h-4 w-4 mr-2" />}
                              {application.stage === 'Fiadores' && <Users className="h-4 w-4 mr-2" />}
                              <span>{application.stage}</span>
                            </div>
                            <div className="flex justify-between text-sm mb-1">
                              <span className="text-muted-foreground">Progreso</span>
                              <span className="font-medium">{Math.round(application.progress / 6 * 100)}%</span>
                            </div>
                            <Progress value={application.progress / 6 * 100} className="h-1.5" />
                          </div>
                          
                          <div className="flex justify-between items-center mt-2 text-sm">
                            <div className="font-medium">{application.product}</div>
                            <div className="text-primary">{application.amount}</div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </ContextMenuTrigger>
                  <ContextMenuContent className="w-48">
                    <ContextMenuItem onClick={() => handleViewApplication(application.id)}>
                      <FileText className="mr-2 h-4 w-4" />
                      <span>Ver detalles</span>
                    </ContextMenuItem>
                    <ContextMenuItem onClick={e => handleEditApplication(application.id, e)}>
                      <Edit className="mr-2 h-4 w-4" />
                      <span>Editar</span>
                    </ContextMenuItem>
                    <ContextMenuItem onClick={e => handleDuplicateApplication(application.id, application.clientName, e)}>
                      <Copy className="mr-2 h-4 w-4" />
                      <span>Duplicar</span>
                    </ContextMenuItem>
                    <ContextMenuSeparator />
                    <ContextMenuItem onClick={e => handleShareApplication(application.id, e)}>
                      <Share2 className="mr-2 h-4 w-4" />
                      <span>Compartir</span>
                    </ContextMenuItem>
                    <ContextMenuSeparator />
                    <ContextMenuItem className="text-destructive focus:text-destructive" onClick={e => handleDeleteApplication(application.id, e)}>
                      <Trash2 className="mr-2 h-4 w-4" />
                      <span>Eliminar</span>
                    </ContextMenuItem>
                  </ContextMenuContent>
                </ContextMenu>
              ))}
            </div>
            
            {filteredApplications.length === 0 && (
              <div className="text-center py-12">
                <FileText className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No hay solicitudes</h3>
                <p className="text-muted-foreground">
                  No se encontraron solicitudes con el filtro seleccionado.
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>
        
        <div className="flex justify-center py-4">
          <Button variant="outline">Cargar más</Button>
        </div>
      </main>
      
      
      
      {/* Floating Action Button */}
      <Button 
        className="fixed bottom-14 right-4 z-50 w-14 h-14 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-110"
        onClick={() => navigate('/identity-verification')}
        aria-label="Nueva Solicitud"
      >
        <Plus className="h-6 w-6" />
      </Button>
      
      <PrequalificationModal open={showPrequalificationModal} onOpenChange={setShowPrequalificationModal} />
    </div>
  );
};

export default Applications;
