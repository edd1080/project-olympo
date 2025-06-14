import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '@/components/layout/Header';
import BottomNavigation from '@/components/layout/BottomNavigation';
import BreadcrumbNavigation from '@/components/navigation/BreadcrumbNavigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, Edit, FileText, CheckCircle, Clock, XCircle, AlertCircle, User, Briefcase, DollarSign, FileCheck, Camera, ClipboardList, Calendar, UserCheck, Users, Search, FileSignature, BarChart3, MapPin } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

const applicationStatuses = {
  'pending': {
    label: 'Pendiente',
    color: 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200'
  },
  'reviewing': {
    label: 'En revisión',
    color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
  },
  'approved': {
    label: 'Aprobado',
    color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
  },
  'rejected': {
    label: 'Rechazado',
    color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
  }
};

const formSections = [
  {
    id: 'identification',
    icon: <User size={18} />,
    name: 'Identificación y Contacto'
  },
  {
    id: 'finances',
    icon: <DollarSign size={18} />,
    name: 'Finanzas y Patrimonio'
  },
  {
    id: 'business',
    icon: <MapPin size={18} />,
    name: 'Negocio y Perfil Económico'
  },
  {
    id: 'guarantors',
    icon: <Users size={18} />,
    name: 'Garantías, Fiadores y Referencias'
  },
  {
    id: 'documents',
    icon: <FileCheck size={18} />,
    name: 'Documentos y Cierre'
  },
  {
    id: 'review',
    icon: <CheckCircle size={18} />,
    name: 'Revisión Final'
  }
];

const ApplicationDetails = () => {
  const {
    id
  } = useParams<{
    id: string;
  }>();
  const navigate = useNavigate();
  const {
    toast
  } = useToast();
  const [application, setApplication] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [toastShown, setToastShown] = useState(false);

  useEffect(() => {
    const fetchApplicationData = () => {
      setTimeout(() => {
        const mockApplication = {
          id: id,
          status: 'reviewing',
          progress: 4,
          createdAt: '2025-04-05',
          updatedAt: '2025-04-07',
          identification: {
            agencia: 'Guatemala Central',
            cui: '3456 78901 2345',
            nit: '1234567-8',
            tipoSocio: 'Nuevo',
            fullName: 'María Elena Rodríguez García',
            email: 'maria.rodriguez@example.com',
            phone: '502-5555-1234',
            estadoCivil: 'Casada',
            address: 'Zona 10, Ciudad de Guatemala',
            birthDate: '1990-05-15',
            nacionalidad: 'Guatemalteca',
            genero: 'Femenino',
            profesion: 'Comerciante',
            conyuge: {
              nombre: 'Carlos Martínez',
              dpi: '2345 67890 1234',
              telefono: '502-5555-5678'
            }
          },
          finances: {
            ingresosMensuales: 25000,
            gastosMensuales: 18000,
            ventasContado: 15000,
            ventasCredito: 10000,
            activos: {
              inventario: 50000,
              cuentasPorCobrar: 25000,
              equipos: 30000,
              inmuebles: 200000,
              total: 305000
            },
            pasivos: {
              proveedores: 15000,
              prestamos: 45000,
              total: 60000
            },
            patrimonio: 245000
          },
          business: {
            tipoActividad: 'Comercio al por menor',
            codigoCNAE: '47.11.01',
            nombreNegocio: 'Abarrotes María',
            direccionNegocio: 'Mercado Central, Local 45, Zona 1',
            telefonoNegocio: '502-2222-5678',
            antiguedadNegocio: '8 años',
            productos: [
              {
                nombre: 'Granos básicos',
                unidadMedida: 'Quintal',
                cantidadVendida: 10,
                precioUnitario: 500,
                totalVentas: 5000,
                utilidad: 1500
              },
              {
                nombre: 'Productos enlatados',
                unidadMedida: 'Caja',
                cantidadVendida: 20,
                precioUnitario: 300,
                totalVentas: 6000,
                utilidad: 1800
              }
            ],
            estacionalidad: {
              mejoresMeses: ['Noviembre', 'Diciembre'],
              peoresMeses: ['Febrero', 'Septiembre'],
              ventasMejoresMeses: 35000,
              ventasPeoresMeses: 18000
            }
          },
          guarantors: [
            {
              id: 'G001',
              nombre: 'Carlos Alberto Martínez',
              dpi: '1234 56789 0123',
              telefono: '502-5555-9876',
              parentesco: 'Esposo',
              salario: 8000,
              tipoEmpleo: 'Asalariado',
              empresa: 'Constructora ABC',
              porcentajeCobertura: 50,
              status: 'in-progress',
              progress: 80
            },
            {
              id: 'G002',
              nombre: 'Ana Patricia López',
              dpi: '2345 67890 1234',
              telefono: '502-5555-4321',
              parentesco: 'Hermana',
              salario: 6500,
              tipoEmpleo: 'Independiente',
              empresa: 'Negocio propio',
              porcentajeCobertura: 50,
              status: 'complete',
              progress: 100
            }
          ],
          documents: {
            dpiFrontal: {
              status: 'complete',
              url: '/placeholder.svg'
            },
            dpiTrasero: {
              status: 'complete',
              url: '/placeholder.svg'
            },
            fotoSolicitante: {
              status: 'complete',
              url: '/placeholder.svg'
            },
            recibosServicios: {
              status: 'pending',
              url: null
            },
            firmaCanvas: {
              status: 'pending',
              url: null
            }
          },
          creditEvaluation: {
            montoSolicitado: 10000,
            montoAprobado: 8500,
            plazoMeses: 18,
            cuotaMensual: 630,
            tasaInteres: 15
          },
          notes: [
            {
              date: '2025-04-05',
              author: 'Juan Pérez',
              content: 'Solicitud creada y documentos básicos cargados.'
            },
            {
              date: '2025-04-06',
              author: 'Ana López',
              content: 'Se requiere verificación adicional de ingresos.'
            },
            {
              date: '2025-04-07',
              author: 'Carlos Gómez',
              content: 'Evaluación crediticia completada. Pendiente de aprobación final.'
            }
          ]
        };
        setApplication(mockApplication);
        setLoading(false);
      }, 500);
    };
    fetchApplicationData();
  }, [id]);

  useEffect(() => {
    if (application && !toastShown) {
      toast({
        title: "Solicitud cargada",
        description: `Solicitud ${id} cargada correctamente`,
        duration: 3000
      });
      setToastShown(true);
    }
  }, [application, toast, id, toastShown]);

  const handleEditApplication = () => {
    navigate(`/applications/${id}/edit`);
  };

  const navigateToFormSection = (sectionId: string) => {
    navigate(`/applications/${id}/edit`, {
      state: {
        sectionId
      }
    });
    toast({
      title: "Navegación a sección",
      description: `Navegando a la sección: ${sectionId}`,
      duration: 2000
    });
  };

  if (loading) {
    return <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-8 pb-20">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-xl font-medium">Cargando solicitud...</h1>
          </div>
          <div className="flex items-center justify-center h-[70vh]">
            <div className="animate-pulse space-y-4 w-full max-w-3xl">
              <div className="h-10 bg-muted rounded-md w-1/3"></div>
              <div className="h-40 bg-muted rounded-md"></div>
              <div className="space-y-2">
                <div className="h-4 bg-muted rounded-md w-5/6"></div>
                <div className="h-4 bg-muted rounded-md w-4/6"></div>
                <div className="h-4 bg-muted rounded-md w-3/6"></div>
              </div>
            </div>
          </div>
        </main>
        <BottomNavigation />
      </div>;
  }

  if (!application) {
    return <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-8 pb-20">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-xl font-medium">Solicitud no encontrada</h1>
          </div>
          <div className="flex flex-col items-center justify-center h-[70vh] space-y-4">
            <AlertCircle className="h-16 w-16 text-muted-foreground" />
            <p className="text-lg text-muted-foreground">No se pudo encontrar la solicitud solicitada.</p>
            <Button onClick={() => navigate('/applications')}>
              Volver a Solicitudes
            </Button>
          </div>
        </main>
        <BottomNavigation />
      </div>;
  }

  const getStatusIcon = () => {
    switch (application.status) {
      case 'pending':
        return <Clock className="h-5 w-5 text-amber-600" />;
      case 'reviewing':
        return <FileText className="h-5 w-5 text-blue-600" />;
      case 'approved':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'rejected':
        return <XCircle className="h-5 w-5 text-destructive" />;
      default:
        return <Clock className="h-5 w-5" />;
    }
  };

  const getStatusClass = () => {
    return applicationStatuses[application.status as keyof typeof applicationStatuses]?.color || '';
  };

  return <div className="min-h-screen flex flex-col">
      <Header personName={application?.identification?.fullName?.split(' ')[0] || ''} />
      
      <main className="flex-1 container mx-auto px-4 py-0 pb-20">
        <BreadcrumbNavigation />
        
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon" onClick={() => navigate('/applications')}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-xl font-medium">{application.identification.fullName}</h1>
              <div className="flex items-center text-sm text-muted-foreground">
                <span>{application.id}</span>
              </div>
            </div>
          </div>
          
          <div className="flex gap-2">
            <div className={`px-3 py-1 rounded-full flex items-center gap-1.5 text-sm font-medium ${getStatusClass()}`}>
              {getStatusIcon()}
              <span>{applicationStatuses[application.status as keyof typeof applicationStatuses]?.label}</span>
            </div>
            <Button size="sm" variant="outline" onClick={handleEditApplication}>
              <Edit className="mr-2 h-4 w-4" />
              Editar
            </Button>
          </div>
        </div>

        <div className="mb-6">
          <div className="flex justify-between text-sm mb-2">
            <span className="font-medium">Progreso:</span>
            <span>{application.progress}/6 secciones completadas</span>
          </div>
          <Progress value={application.progress / 6 * 100} className="h-2" />
        </div>

        <Card className="mb-6 border-primary/20 bg-primary/5">
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center">
              <FileText className="h-4 w-4 mr-2 text-primary" />
              Acceso Rápido
            </CardTitle>
          </CardHeader>
          <CardContent className="py-3">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
              {formSections.map(section => <Button key={section.id} variant="outline" className="h-auto py-2 flex flex-col items-center text-xs gap-1 flex-1 min-h-[4.5rem]" onClick={() => navigateToFormSection(section.id)}>
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mb-1">
                    {section.icon}
                  </div>
                  <span className="text-center leading-tight px-1">{section.name}</span>
                </Button>)}
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="summary" className="mb-6">
          <TabsList className="mb-4">
            <TabsTrigger value="summary" className="font-semibold">Resumen</TabsTrigger>
            <TabsTrigger value="details">Detalles</TabsTrigger>
            <TabsTrigger value="guarantors">
              <div className="flex items-center gap-1">
                <UserCheck className="h-4 w-4" />
                <span>Fiadores</span>
              </div>
            </TabsTrigger>
            <TabsTrigger value="docs">Documentos</TabsTrigger>
            <TabsTrigger value="notes">Notas</TabsTrigger>
          </TabsList>
          
          <TabsContent value="summary">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center">
                    <User className="h-4 w-4 mr-2 text-primary" />
                    Identificación
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <dl className="space-y-2 text-sm">
                    <div>
                      <dt className="text-muted-foreground">Nombre</dt>
                      <dd className="font-medium">{application.identification.fullName}</dd>
                    </div>
                    <div>
                      <dt className="text-muted-foreground">CUI</dt>
                      <dd className="font-medium">{application.identification.cui}</dd>
                    </div>
                    <div>
                      <dt className="text-muted-foreground">NIT</dt>
                      <dd className="font-medium">{application.identification.nit}</dd>
                    </div>
                    <div>
                      <dt className="text-muted-foreground">Teléfono</dt>
                      <dd className="font-medium">{application.identification.phone}</dd>
                    </div>
                  </dl>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center">
                    <DollarSign className="h-4 w-4 mr-2 text-primary" />
                    Finanzas
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <dl className="space-y-2 text-sm">
                    <div>
                      <dt className="text-muted-foreground">Ingresos Mensuales</dt>
                      <dd className="font-medium">Q{application.finances.ingresosMensuales.toLocaleString()}</dd>
                    </div>
                    <div>
                      <dt className="text-muted-foreground">Gastos Mensuales</dt>
                      <dd className="font-medium">Q{application.finances.gastosMensuales.toLocaleString()}</dd>
                    </div>
                    <div>
                      <dt className="text-muted-foreground">Patrimonio</dt>
                      <dd className="font-medium">Q{application.finances.patrimonio.toLocaleString()}</dd>
                    </div>
                  </dl>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center">
                    <MapPin className="h-4 w-4 mr-2 text-primary" />
                    Negocio
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <dl className="space-y-2 text-sm">
                    <div>
                      <dt className="text-muted-foreground">Nombre</dt>
                      <dd className="font-medium">{application.business.nombreNegocio}</dd>
                    </div>
                    <div>
                      <dt className="text-muted-foreground">Actividad</dt>
                      <dd className="font-medium">{application.business.tipoActividad}</dd>
                    </div>
                    <div>
                      <dt className="text-muted-foreground">Antigüedad</dt>
                      <dd className="font-medium">{application.business.antiguedadNegocio}</dd>
                    </div>
                  </dl>
                </CardContent>
              </Card>
            </div>
            
            <Card className="mb-4 border-primary/20 bg-primary/5">
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center">
                  <CheckCircle className="h-4 w-4 mr-2 text-primary" />
                  Evaluación Crediticia
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center p-3 bg-background rounded-md">
                    <p className="text-xs text-muted-foreground mb-1">Monto Aprobado</p>
                    <p className="font-bold text-lg">Q{application.creditEvaluation.montoAprobado.toLocaleString()}</p>
                  </div>
                  <div className="text-center p-3 bg-background rounded-md">
                    <p className="text-xs text-muted-foreground mb-1">Plazo</p>
                    <p className="font-bold text-lg">{application.creditEvaluation.plazoMeses} meses</p>
                  </div>
                  <div className="text-center p-3 bg-background rounded-md">
                    <p className="text-xs text-muted-foreground mb-1">Cuota Mensual</p>
                    <p className="font-bold text-lg">Q{application.creditEvaluation.cuotaMensual.toLocaleString()}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center">
                  <FileCheck className="h-4 w-4 mr-2 text-primary" />
                  Estado de Documentos
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                  {Object.entries(application.documents).map(([key, value]: [string, any]) => <div key={key} className="flex flex-col items-center p-2 rounded-md border">
                      {value.status === 'complete' ? <div className="w-12 h-12 rounded-full bg-green-100 text-green-600 flex items-center justify-center mb-2">
                          <CheckCircle className="h-5 w-5" />
                        </div> : <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mb-2">
                          <Clock className="h-5 w-5" />
                        </div>}
                      <span className="text-xs text-center">
                        {key === 'dpiFrontal' && 'DPI Frontal'}
                        {key === 'dpiTrasero' && 'DPI Trasero'}
                        {key === 'fotoSolicitante' && 'Foto Solicitante'}
                        {key === 'recibosServicios' && 'Recibos Servicios'}
                        {key === 'firmaCanvas' && 'Firma Digital'}
                      </span>
                      {value.status === 'pending' && <p className="text-xs text-amber-600 mt-1">Pendiente</p>}
                    </div>)}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="details">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-lg">
                    <User className="h-5 w-5 mr-2 text-primary" />
                    Identificación y Contacto
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Agencia</p>
                      <p className="font-medium">{application.identification.agencia}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Tipo de Socio</p>
                      <p className="font-medium">{application.identification.tipoSocio}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">CUI</p>
                      <p className="font-medium">{application.identification.cui}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">NIT</p>
                      <p className="font-medium">{application.identification.nit}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Nombre Completo</p>
                      <p className="font-medium">{application.identification.fullName}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Estado Civil</p>
                      <p className="font-medium">{application.identification.estadoCivil}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Correo Electrónico</p>
                      <p className="font-medium">{application.identification.email}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Teléfono</p>
                      <p className="font-medium">{application.identification.phone}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Dirección</p>
                      <p className="font-medium">{application.identification.address}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Fecha de Nacimiento</p>
                      <p className="font-medium">{application.identification.birthDate}</p>
                    </div>
                  </div>
                  
                  {application.identification.conyuge && (
                    <div className="mt-6">
                      <h4 className="text-sm font-medium mb-3">Información del Cónyuge</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-muted-foreground">Nombre</p>
                          <p className="font-medium">{application.identification.conyuge.nombre}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">DPI</p>
                          <p className="font-medium">{application.identification.conyuge.dpi}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Teléfono</p>
                          <p className="font-medium">{application.identification.conyuge.telefono}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-lg">
                    <DollarSign className="h-5 w-5 mr-2 text-primary" />
                    Finanzas y Patrimonio
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Ingresos Mensuales</p>
                      <p className="font-medium">Q{application.finances.ingresosMensuales.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Gastos Mensuales</p>
                      <p className="font-medium">Q{application.finances.gastosMensuales.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Ventas al Contado</p>
                      <p className="font-medium">Q{application.finances.ventasContado.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Ventas al Crédito</p>
                      <p className="font-medium">Q{application.finances.ventasCredito.toLocaleString()}</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="text-sm font-medium mb-3">Activos</h4>
                      <Table>
                        <TableBody>
                          <TableRow>
                            <TableCell className="text-muted-foreground">Inventario</TableCell>
                            <TableCell className="text-right">Q{application.finances.activos.inventario.toLocaleString()}</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell className="text-muted-foreground">Cuentas por Cobrar</TableCell>
                            <TableCell className="text-right">Q{application.finances.activos.cuentasPorCobrar.toLocaleString()}</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell className="text-muted-foreground">Equipos</TableCell>
                            <TableCell className="text-right">Q{application.finances.activos.equipos.toLocaleString()}</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell className="text-muted-foreground">Inmuebles</TableCell>
                            <TableCell className="text-right">Q{application.finances.activos.inmuebles.toLocaleString()}</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell className="font-medium">Total Activos</TableCell>
                            <TableCell className="text-right font-bold">Q{application.finances.activos.total.toLocaleString()}</TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium mb-3">Pasivos</h4>
                      <Table>
                        <TableBody>
                          <TableRow>
                            <TableCell className="text-muted-foreground">Proveedores</TableCell>
                            <TableCell className="text-right">Q{application.finances.pasivos.proveedores.toLocaleString()}</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell className="text-muted-foreground">Préstamos</TableCell>
                            <TableCell className="text-right">Q{application.finances.pasivos.prestamos.toLocaleString()}</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell className="font-medium">Total Pasivos</TableCell>
                            <TableCell className="text-right font-bold">Q{application.finances.pasivos.total.toLocaleString()}</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell className="font-medium text-primary">Patrimonio</TableCell>
                            <TableCell className="text-right font-bold text-primary">Q{application.finances.patrimonio.toLocaleString()}</TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-lg">
                    <MapPin className="h-5 w-5 mr-2 text-primary" />
                    Negocio y Perfil Económico
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Tipo de Actividad</p>
                      <p className="font-medium">{application.business.tipoActividad}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Código CNAE</p>
                      <p className="font-medium">{application.business.codigoCNAE}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Nombre del Negocio</p>
                      <p className="font-medium">{application.business.nombreNegocio}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Antigüedad</p>
                      <p className="font-medium">{application.business.antiguedadNegocio}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Dirección</p>
                      <p className="font-medium">{application.business.direccionNegocio}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Teléfono</p>
                      <p className="font-medium">{application.business.telefonoNegocio}</p>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium mb-3">Productos Principales</h4>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Producto</TableHead>
                          <TableHead>Unidad</TableHead>
                          <TableHead className="text-right">Cantidad</TableHead>
                          <TableHead className="text-right">Precio</TableHead>
                          <TableHead className="text-right">Ventas</TableHead>
                          <TableHead className="text-right">Utilidad</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {application.business.productos.map((product: any, index: number) => <TableRow key={index}>
                            <TableCell>{product.nombre}</TableCell>
                            <TableCell>{product.unidadMedida}</TableCell>
                            <TableCell className="text-right">{product.cantidadVendida}</TableCell>
                            <TableCell className="text-right">Q{product.precioUnitario.toLocaleString()}</TableCell>
                            <TableCell className="text-right">Q{product.totalVentas.toLocaleString()}</TableCell>
                            <TableCell className="text-right">Q{product.utilidad.toLocaleString()}</TableCell>
                          </TableRow>)}
                      </TableBody>
                    </Table>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium mb-3">Estacionalidad</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div>
                        <p className="text-sm text-muted-foreground mb-2">Mejores Meses</p>
                        <div className="flex flex-wrap gap-1 mb-2">
                          {application.business.estacionalidad.mejoresMeses.map((month: string) => <Badge key={month} variant="outline" className="bg-green-50">{month}</Badge>)}
                        </div>
                        <p className="text-sm">
                          <span className="text-muted-foreground">Ventas: </span>
                          <span className="font-medium">Q{application.business.estacionalidad.ventasMejoresMeses.toLocaleString()}</span>
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground mb-2">Peores Meses</p>
                        <div className="flex flex-wrap gap-1 mb-2">
                          {application.business.estacionalidad.peoresMeses.map((month: string) => <Badge key={month} variant="outline" className="bg-red-50">{month}</Badge>)}
                        </div>
                        <p className="text-sm">
                          <span className="text-muted-foreground">Ventas: </span>
                          <span className="font-medium">Q{application.business.estacionalidad.ventasPeoresMeses.toLocaleString()}</span>
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="guarantors">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  <Users className="h-5 w-5 mr-2 text-primary" />
                  Fiadores Registrados
                </CardTitle>
              </CardHeader>
              <CardContent>
                {application.guarantors.length === 0 ? (
                  <div className="text-center p-6">
                    <Users className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                    <p className="text-muted-foreground">Pendiente - No hay fiadores registrados</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {application.guarantors.map((guarantor: any) => (
                      <Card key={guarantor.id} className="p-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm text-muted-foreground">Nombre</p>
                            <p className="font-medium">{guarantor.nombre}</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">DPI</p>
                            <p className="font-medium">{guarantor.dpi}</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Parentesco</p>
                            <p className="font-medium">{guarantor.parentesco}</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Teléfono</p>
                            <p className="font-medium">{guarantor.telefono}</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Salario</p>
                            <p className="font-medium">Q{guarantor.salario.toLocaleString()}</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Tipo de Empleo</p>
                            <p className="font-medium">{guarantor.tipoEmpleo}</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Empresa/Empleador</p>
                            <p className="font-medium">{guarantor.empresa}</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">% Cobertura</p>
                            <p className="font-medium">{guarantor.porcentajeCobertura}%</p>
                          </div>
                        </div>
                        <div className="mt-4">
                          <div className="flex justify-between text-sm mb-2">
                            <span>Progreso:</span>
                            <span>{guarantor.progress}%</span>
                          </div>
                          <Progress value={guarantor.progress} className="h-2" />
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="docs">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {Object.entries(application.documents).map(([key, value]: [string, any]) => <Card key={key} className={value.status === 'complete' ? 'border-green-200' : 'border-amber-200'}>
                  <CardContent className="p-4">
                    <div className="flex flex-col items-center">
                      {value.status === 'complete' ? <>
                          <div className="relative aspect-square w-full max-w-[180px] rounded-md overflow-hidden mb-3">
                            <img src={value.url} alt={`Document ${key}`} className="object-cover w-full h-full" />
                            <div className="absolute top-2 right-2">
                              <Badge className="bg-green-500">
                                <CheckCircle className="h-3 w-3 mr-1" />
                                Completo
                              </Badge>
                            </div>
                          </div>
                        </> : <div className="aspect-square w-full max-w-[180px] rounded-md bg-muted flex items-center justify-center mb-3">
                          <div className="text-center p-4">
                            <Camera className="h-10 w-10 text-muted-foreground mx-auto mb-2" />
                            <Badge variant="outline" className="bg-amber-100 text-amber-800 border-amber-200">
                              <Clock className="h-3 w-3 mr-1" />
                              Pendiente
                            </Badge>
                          </div>
                        </div>}
                      <p className="font-medium text-center">
                        {key === 'dpiFrontal' && 'DPI Frontal'}
                        {key === 'dpiTrasero' && 'DPI Trasero'}
                        {key === 'fotoSolicitante' && 'Foto Solicitante'}
                        {key === 'recibosServicios' && 'Recibos Servicios'}
                        {key === 'firmaCanvas' && 'Firma Digital'}
                      </p>
                    </div>
                  </CardContent>
                </Card>)}
            </div>
          </TabsContent>
          
          <TabsContent value="notes">
            <Card>
              <CardContent className="p-4">
                <div className="space-y-4">
                  {application.notes.map((note: any, index: number) => <div key={index} className="flex gap-4">
                      <div className="min-w-8 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <ClipboardList className="h-4 w-4 text-primary" />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-1">
                          <p className="font-medium">{note.author}</p>
                          <div className="flex items-center text-xs text-muted-foreground">
                            <Calendar className="h-3 w-3 mr-1" />
                            {note.date}
                          </div>
                        </div>
                        <p className="text-sm">{note.content}</p>
                        {index < application.notes.length - 1 && <Separator className="mt-3" />}
                      </div>
                    </div>)}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
      
      <BottomNavigation />
    </div>;
};

export default ApplicationDetails;
