import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/layout/Header';
import BottomNavigation from '@/components/layout/BottomNavigation';
import FloatingPrequalificationButton from '@/components/prequalification/FloatingPrequalificationButton';
import PrequalificationModal from '@/components/prequalification/PrequalificationModal';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, FileSpreadsheet, Edit, Trash2, CheckCircle, AlertCircle, XCircle, Calendar, User, Banknote } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { usePrequalifications } from '@/hooks/usePrequalifications';
import { formatCurrency } from '@/utils/prequalificationEngine';
import { useToast } from '@/hooks/use-toast';
const Prequalifications = () => {
  const navigate = useNavigate();
  const {
    toast
  } = useToast();
  const [showPrequalificationModal, setShowPrequalificationModal] = useState(false);
  const {
    prequalifications,
    deletePrequalification
  } = usePrequalifications();
  useEffect(() => {
    const authToken = localStorage.getItem('authToken');
    if (!authToken) {
      navigate('/login');
    }
  }, [navigate]);
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'green':
        return <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200 flex items-center gap-1 text-sm px-3 py-1">
            <CheckCircle className="h-4 w-4" />
            <span>Aprobada</span>
          </Badge>;
      case 'yellow':
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-200 flex items-center gap-1 text-sm px-3 py-1">
            <AlertCircle className="h-4 w-4" />
            <span>Condicional</span>
          </Badge>;
      case 'red':
        return <Badge variant="outline" className="bg-red-100 text-red-800 border-red-200 flex items-center gap-1 text-sm px-3 py-1">
            <XCircle className="h-4 w-4" />
            <span>Rechazada</span>
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
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };
  const handleStartApplication = (id: string) => {
    // TODO: Integrar con formulario principal pasando datos de precalificación
    toast({
      title: "Iniciando solicitud",
      description: "Redirigiendo al formulario de solicitud completa...",
      duration: 3000
    });
    navigate('/applications/new');
  };
  const handleEdit = (id: string) => {
    // TODO: Implementar edición de precalificación
    toast({
      title: "Función pendiente",
      description: "La edición de precalificaciones estará disponible próximamente",
      duration: 3000
    });
  };
  const handleDelete = (id: string, clientName: string) => {
    deletePrequalification(id);
    toast({
      title: "Precalificación eliminada",
      description: `Se ha eliminado la precalificación de ${clientName}`,
      duration: 3000
    });
  };
  return <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 px-4 py-4 pb-20 space-y-6">
        <div>
          <h1 className="text-title mb-1">Precalificaciones</h1>
          <p className="text-muted-foreground">Historial de evaluaciones rápidas de elegibilidad</p>
        </div>

        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Buscar precalificaciones..." className="pl-10" />
        </div>

        {prequalifications.length === 0 ? <Card>
            <CardContent className="p-8 text-center">
              <div className="text-muted-foreground mb-4">
                <FileSpreadsheet className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>No hay precalificaciones registradas</p>
                <p className="text-sm">Usa el botón + para crear una nueva precalificación</p>
              </div>
            </CardContent>
          </Card> : <div className="space-y-4">
            {prequalifications.map(prequalification => <Card key={prequalification.id} className="card-hover group">
                <CardContent className="p-4">
                  <div className="flex flex-col space-y-3">
                    {/* Header con nombre, fecha y monto */}
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold flex items-center gap-2 mb-2 text-base">
                          <User className="h-4 w-4 text-muted-foreground" />
                          {prequalification.data.nombre_completo}
                        </h3>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          {formatDate(prequalification.timestamp)}
                        </div>
                      </div>
                      
                      <div className="flex flex-col items-end gap-2">
                        <div className="flex items-center gap-1 text-lg font-semibold text-primary">
                          <Banknote className="h-5 w-5" />
                          {formatCurrency(prequalification.data.monto_solicitado)}
                        </div>
                        
                        <div className="flex items-center gap-2">
                          {getStatusBadge(prequalification.result.status)}

                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                                ⋮
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48">
                              {prequalification.result.canProceed && <DropdownMenuItem onClick={() => handleStartApplication(prequalification.id)}>
                                  <FileSpreadsheet className="mr-2 h-4 w-4" />
                                  <span>Iniciar solicitud</span>
                                </DropdownMenuItem>}
                              {prequalification.result.status === 'yellow' && <DropdownMenuItem onClick={() => handleEdit(prequalification.id)}>
                                  <Edit className="mr-2 h-4 w-4" />
                                  <span>Editar/Completar</span>
                                </DropdownMenuItem>}
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => handleDelete(prequalification.id, prequalification.data.nombre_completo)}>
                                <Trash2 className="mr-2 h-4 w-4" />
                                <span>Eliminar</span>
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    </div>

                    {/* Evaluación */}
                    <div className="text-sm bg-muted/50 p-3 rounded-md">
                      <p className="font-medium text-muted-foreground mb-1">Evaluación:</p>
                      <p className="font-medium">{prequalification.result.reason}</p>
                    </div>

                    {/* Información adicional */}
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Ingreso mensual:</span>
                        <p className="font-bold">{formatCurrency(prequalification.data.ingreso_mensual)}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Destino:</span>
                        <p className="capitalize font-bold">{prequalification.data.destino_credito}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>)}
          </div>}
      </main>

      <BottomNavigation />
      
      <FloatingPrequalificationButton onClick={() => setShowPrequalificationModal(true)} />
      
      <PrequalificationModal open={showPrequalificationModal} onOpenChange={setShowPrequalificationModal} />
    </div>;
};
export default Prequalifications;