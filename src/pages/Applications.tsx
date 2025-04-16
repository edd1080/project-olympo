
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/layout/Header';
import BottomNavigation from '@/components/layout/BottomNavigation';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
  Search, SlidersHorizontal, FileSpreadsheet, Clock, Calendar, 
  Edit, FileText, Copy, Trash2, Share2, MoreVertical, 
  CheckCircle, AlertCircle, BarChart3
} from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { 
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
  ContextMenuSeparator
} from "@/components/ui/context-menu";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";

const generateRandomId = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

const Applications = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
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
      duration: 3000,
    });
  };
  
  const handleDuplicateApplication = (id: string, clientName: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    
    toast({
      title: "Solicitud duplicada",
      description: `Se ha creado una copia de la solicitud de ${clientName}`,
      duration: 3000,
    });
  };
  
  const handleDeleteApplication = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    
    toast({
      title: "Solicitud eliminada",
      description: `La solicitud ${id} ha sido eliminada`,
      variant: "destructive",
      duration: 3000,
    });
  };
  
  const handleShareApplication = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    
    toast({
      title: "Compartir solicitud",
      description: `Se ha copiado el enlace de la solicitud ${id}`,
      duration: 3000,
    });
  };
  
  const applications = [
    { 
      id: `BVM_${generateRandomId()}`,
      clientName: 'Ana García Méndez',
      product: 'Crédito Personal',
      amount: '$25,000',
      status: 'active',
      date: '2025-04-07',
      progress: 2,
      stage: 'Información Financiera'
    },
    { 
      id: `BVM_${generateRandomId()}`,
      clientName: 'Carlos López Ramírez',
      product: 'Hipoteca',
      amount: '$1,200,000',
      status: 'approved',
      date: '2025-04-06',
      progress: 4,
      stage: 'Firma de Acta'
    },
    { 
      id: `BVM_${generateRandomId()}`,
      clientName: 'María Rodríguez Sánchez',
      product: 'Crédito Auto',
      amount: '$350,000',
      status: 'verification',
      date: '2025-04-05',
      progress: 3,
      stage: 'Análisis de Carácter'
    },
    { 
      id: `BVM_${generateRandomId()}`,
      clientName: 'José Hernández Torres',
      product: 'Crédito PYME',
      amount: '$500,000',
      status: 'verification',
      date: '2025-04-03',
      progress: 3,
      stage: 'Documentos e Imágenes'
    },
    { 
      id: `BVM_${generateRandomId()}`,
      clientName: 'Laura Sánchez Vega',
      product: 'Crédito Personal',
      amount: '$30,000',
      status: 'rejected',
      date: '2025-04-02',
      progress: 4,
      stage: 'Fiadores'
    },
  ];

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'active':
        return (
          <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 flex items-center gap-1">
            <BarChart3 className="h-3 w-3" />
            <span>Activo</span>
          </Badge>
        );
      case 'verification':
        return (
          <Badge variant="outline" className="bg-amber-100 text-amber-800 border-amber-200 flex items-center gap-1">
            <Clock className="h-3 w-3" />
            <span>En Verificación</span>
          </Badge>
        );
      case 'approved':
        return (
          <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200 flex items-center gap-1">
            <CheckCircle className="h-3 w-3" />
            <span>Aprobado</span>
          </Badge>
        );
      case 'rejected':
        return (
          <Badge variant="outline" className="bg-red-100 text-red-800 border-red-200 flex items-center gap-1">
            <AlertCircle className="h-3 w-3" />
            <span>Rechazado</span>
          </Badge>
        );
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
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 px-4 py-4 pb-20 space-y-6">
        <div>
          <h1 className="text-title mb-1">Solicitudes</h1>
          <p className="text-muted-foreground">Gestiona y visualiza todas las solicitudes de crédito</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar solicitudes..."
              className="pl-10"
            />
          </div>
          
          <div className="flex gap-2 w-full sm:w-auto">
            <Button 
              variant="outline" 
              size="icon"
              className="rounded-full"
              aria-label="Filtrar"
            >
              <SlidersHorizontal className="h-4 w-4" />
            </Button>
            <Button 
              className="flex-1 sm:flex-none"
              onClick={() => navigate('/applications/new')}
            >
              <FileSpreadsheet className="mr-2 h-4 w-4" />
              Nueva Solicitud
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {applications.map((application) => (
            <ContextMenu key={application.id}>
              <ContextMenuTrigger>
                <Card 
                  className="card-hover cursor-pointer group relative"
                  onClick={() => handleViewApplication(application.id)}
                >
                  <CardContent className="p-4">
                    <div className="flex flex-col">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="text-section-title font-semibold">{application.clientName}</h3>
                          <div className="flex items-center gap-2 mt-1">
                            <div className="flex items-center text-xs text-muted-foreground">
                              <Calendar className="mr-1 h-3 w-3" />
                              {formatDate(application.date)}
                            </div>
                            <div className="flex items-center text-xs text-muted-foreground">
                              <FileText className="mr-1 h-3 w-3" />
                              {application.id}
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex flex-col items-end gap-2">
                          {getStatusBadge(application.status)}
                          
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button 
                                variant="ghost" 
                                size="icon"
                                className="h-8 w-8 ml-auto opacity-0 group-hover:opacity-100 transition-opacity"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48">
                              <DropdownMenuItem onClick={() => handleViewApplication(application.id)}>
                                <FileText className="mr-2 h-4 w-4" />
                                <span>Ver detalles</span>
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={(e) => handleEditApplication(application.id, e)}>
                                <Edit className="mr-2 h-4 w-4" />
                                <span>Editar</span>
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={(e) => handleDuplicateApplication(application.id, application.clientName, e)}>
                                <Copy className="mr-2 h-4 w-4" />
                                <span>Duplicar</span>
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem onClick={(e) => handleShareApplication(application.id, e)}>
                                <Share2 className="mr-2 h-4 w-4" />
                                <span>Compartir</span>
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem 
                                className="text-destructive focus:text-destructive"
                                onClick={(e) => handleDeleteApplication(application.id, e)}
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                <span>Eliminar</span>
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                      
                      <div className="mt-3 mb-1">
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-muted-foreground">Etapa: <span className="font-medium">{application.stage}</span></span>
                          <span className="text-muted-foreground">{Math.round((application.progress / 6) * 100)}%</span>
                        </div>
                        <Progress value={(application.progress / 6) * 100} className="h-1.5" />
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
                <ContextMenuItem onClick={(e) => handleEditApplication(application.id, e)}>
                  <Edit className="mr-2 h-4 w-4" />
                  <span>Editar</span>
                </ContextMenuItem>
                <ContextMenuItem onClick={(e) => handleDuplicateApplication(application.id, application.clientName, e)}>
                  <Copy className="mr-2 h-4 w-4" />
                  <span>Duplicar</span>
                </ContextMenuItem>
                <ContextMenuSeparator />
                <ContextMenuItem onClick={(e) => handleShareApplication(application.id, e)}>
                  <Share2 className="mr-2 h-4 w-4" />
                  <span>Compartir</span>
                </ContextMenuItem>
                <ContextMenuSeparator />
                <ContextMenuItem 
                  className="text-destructive focus:text-destructive"
                  onClick={(e) => handleDeleteApplication(application.id, e)}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  <span>Eliminar</span>
                </ContextMenuItem>
              </ContextMenuContent>
            </ContextMenu>
          ))}
        </div>
        
        <div className="flex justify-center py-4">
          <Button variant="outline">Cargar más</Button>
        </div>
      </main>
      
      <BottomNavigation />
    </div>
  );
};

export default Applications;
