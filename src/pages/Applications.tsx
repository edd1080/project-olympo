import React from 'react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/layout/Header';
import BottomNavigation from '@/components/layout/BottomNavigation';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
  Search, SlidersHorizontal, FileSpreadsheet, Clock, Calendar, 
  Edit, FileText, Copy, Trash2, Share2, MoreVertical 
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
      clientName: 'Ana García',
      product: 'Crédito Personal',
      amount: '$25,000',
      status: 'pending',
      date: '2025-04-07',
      progress: 2
    },
    { 
      id: `BVM_${generateRandomId()}`,
      clientName: 'Carlos López',
      product: 'Hipoteca',
      amount: '$1,200,000',
      status: 'approved',
      date: '2025-04-06',
      progress: 4
    },
    { 
      id: `BVM_${generateRandomId()}`,
      clientName: 'María Rodríguez',
      product: 'Crédito Auto',
      amount: '$350,000',
      status: 'pending',
      date: '2025-04-05',
      progress: 3
    },
    { 
      id: `BVM_${generateRandomId()}`,
      clientName: 'José Hernández',
      product: 'Crédito PYME',
      amount: '$500,000',
      status: 'reviewing',
      date: '2025-04-03',
      progress: 3
    },
    { 
      id: `BVM_${generateRandomId()}`,
      clientName: 'Laura Sánchez',
      product: 'Crédito Personal',
      amount: '$30,000',
      status: 'rejected',
      date: '2025-04-02',
      progress: 4
    },
  ];

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'pending':
        return (
          <span className="bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200 text-xs px-2 py-1 rounded-full font-medium">
            Pendiente
          </span>
        );
      case 'reviewing':
        return (
          <span className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 text-xs px-2 py-1 rounded-full font-medium">
            En revisión
          </span>
        );
      case 'approved':
        return (
          <span className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 text-xs px-2 py-1 rounded-full font-medium">
            Aprobado
          </span>
        );
      case 'rejected':
        return (
          <span className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 text-xs px-2 py-1 rounded-full font-medium">
            Rechazado
          </span>
        );
      default:
        return null;
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1 px-4 py-6 pb-20">
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
                    <div className="flex items-start justify-between">
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2">
                          <h3 className="text-section-title">{application.clientName}</h3>
                          {getStatusBadge(application.status)}
                        </div>
                        <p className="text-body">{application.product} - <span className="font-medium">{application.amount}</span></p>
                        <div className="flex items-center gap-3 text-caption pt-1">
                          <div className="flex items-center">
                            <Clock className="mr-1 h-3 w-3" />
                            {application.id}
                          </div>
                          <div className="flex items-center">
                            <Calendar className="mr-1 h-3 w-3" />
                            {application.date}
                          </div>
                        </div>
                        <Progress value={application.progress * 25} className="h-1.5 mt-2" />
                      </div>
                      
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity absolute top-2 right-2"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                          <DropdownMenuItem onClick={(e) => handleViewApplication(application.id)}>
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
