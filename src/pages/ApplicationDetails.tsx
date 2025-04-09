
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '@/components/layout/Header';
import BottomNavigation from '@/components/layout/BottomNavigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  ArrowLeft, Edit, FileText, CheckCircle, Clock, XCircle, AlertTriangle,
  User, Briefcase, DollarSign, FileCheck, Camera, ClipboardList, Calendar
} from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

// Mock data - in a real app, this would come from an API or database
const applicationStatuses = {
  'pending': { label: 'Pendiente', color: 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200' },
  'reviewing': { label: 'En revisión', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' },
  'approved': { label: 'Aprobado', color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' },
  'rejected': { label: 'Rechazado', color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' },
};

const ApplicationDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [application, setApplication] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock API call - in a real app, this would fetch data from an API
    const fetchApplicationData = () => {
      // Simulate API call delay
      setTimeout(() => {
        // Mock data for the application
        const mockApplication = {
          id: id,
          status: 'reviewing',
          progress: 4,
          createdAt: '2025-04-05',
          updatedAt: '2025-04-07',
          personalInfo: {
            fullName: 'María Rodríguez',
            email: 'maria.rodriguez@example.com',
            phone: '502-5555-1234',
            dpi: '3456789012345',
            address: 'Zona 10, Ciudad de Guatemala',
            birthDate: '1990-05-15'
          },
          workInfo: {
            occupation: 'Comerciante',
            businessName: 'Abarrotes María',
            businessAddress: 'Mercado Central, Local 45, Zona 1',
            businessPhone: '502-2222-5678',
            businessType: 'Comercio minorista'
          },
          financialInfo: {
            monthlySales: 25000,
            cashSales: 15000,
            creditSales: 10000,
            mainProducts: [
              { name: 'Granos básicos', unitMeasure: 'Quintal', quantity: 10, unitPrice: 500, totalSales: 5000, profit: 1500 },
              { name: 'Productos enlatados', unitMeasure: 'Caja', quantity: 20, unitPrice: 300, totalSales: 6000, profit: 1800 }
            ],
            bestMonths: ['Noviembre', 'Diciembre'],
            worstMonths: ['Febrero', 'Septiembre'],
            bestMonthsAmount: 35000,
            worstMonthsAmount: 18000,
            expenses: {
              rent: 2000,
              electricity: 500,
              phone: 300,
              water: 150,
              transport: 800,
              other: 500,
              total: 4250
            }
          },
          creditEvaluation: {
            approvedAmount: 8500,
            months: 18,
            monthlyPayment: 630,
            interestRate: 15
          },
          documents: {
            personalPhoto: { status: 'complete', url: '/placeholder.svg' },
            agentPhoto: { status: 'complete', url: '/placeholder.svg' },
            businessPhoto: { status: 'complete', url: '/placeholder.svg' },
            utilityBill: { status: 'pending', url: null },
            additionalDocs: { status: 'pending', url: null }
          },
          notes: [
            { date: '2025-04-05', author: 'Juan Pérez', content: 'Solicitud creada y documentos básicos cargados.' },
            { date: '2025-04-06', author: 'Ana López', content: 'Se requiere verificación adicional de ingresos.' },
            { date: '2025-04-07', author: 'Carlos Gómez', content: 'Evaluación crediticia completada. Pendiente de aprobación final.' }
          ]
        };

        setApplication(mockApplication);
        setLoading(false);
      }, 500);
    };

    fetchApplicationData();
  }, [id]);

  const handleEditApplication = () => {
    navigate(`/applications/${id}/edit`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
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
      </div>
    );
  }

  if (!application) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-8 pb-20">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-xl font-medium">Solicitud no encontrada</h1>
          </div>
          <div className="flex flex-col items-center justify-center h-[70vh] space-y-4">
            <AlertTriangle className="h-16 w-16 text-muted-foreground" />
            <p className="text-lg text-muted-foreground">No se pudo encontrar la solicitud solicitada.</p>
            <Button onClick={() => navigate('/applications')}>
              Volver a Solicitudes
            </Button>
          </div>
        </main>
        <BottomNavigation />
      </div>
    );
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

  const getProgressState = () => {
    return `${(application.progress / 7) * 100}%`;
  };

  const getStatusClass = () => {
    return applicationStatuses[application.status as keyof typeof applicationStatuses]?.color || '';
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-4 pb-20">
        {/* Header with status */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon" onClick={() => navigate('/applications')}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-xl font-medium">{application.personalInfo.fullName}</h1>
              <div className="flex items-center text-sm text-muted-foreground">
                <span>{application.id}</span>
                <span className="mx-2">•</span>
                <span>{application.createdAt}</span>
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

        {/* Progress bar */}
        <div className="mb-6">
          <div className="flex justify-between text-sm mb-2">
            <span className="font-medium">Progreso de la solicitud</span>
            <span>{application.progress}/7 secciones completadas</span>
          </div>
          <Progress value={(application.progress / 7) * 100} className="h-2" />
        </div>

        {/* Main content tabs */}
        <Tabs defaultValue="summary" className="mb-6">
          <TabsList className="mb-4">
            <TabsTrigger value="summary">Resumen</TabsTrigger>
            <TabsTrigger value="details">Detalles</TabsTrigger>
            <TabsTrigger value="docs">Documentos</TabsTrigger>
            <TabsTrigger value="notes">Notas</TabsTrigger>
          </TabsList>
          
          {/* Summary Tab */}
          <TabsContent value="summary">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center">
                    <User className="h-4 w-4 mr-2 text-primary" />
                    Información Personal
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <dl className="space-y-2 text-sm">
                    <div>
                      <dt className="text-muted-foreground">Nombre</dt>
                      <dd className="font-medium">{application.personalInfo.fullName}</dd>
                    </div>
                    <div>
                      <dt className="text-muted-foreground">DPI</dt>
                      <dd className="font-medium">{application.personalInfo.dpi}</dd>
                    </div>
                    <div>
                      <dt className="text-muted-foreground">Contacto</dt>
                      <dd className="font-medium">{application.personalInfo.phone}</dd>
                    </div>
                  </dl>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center">
                    <Briefcase className="h-4 w-4 mr-2 text-primary" />
                    Información Laboral
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <dl className="space-y-2 text-sm">
                    <div>
                      <dt className="text-muted-foreground">Ocupación</dt>
                      <dd className="font-medium">{application.workInfo.occupation}</dd>
                    </div>
                    <div>
                      <dt className="text-muted-foreground">Negocio</dt>
                      <dd className="font-medium">{application.workInfo.businessName}</dd>
                    </div>
                    <div>
                      <dt className="text-muted-foreground">Tipo</dt>
                      <dd className="font-medium">{application.workInfo.businessType}</dd>
                    </div>
                  </dl>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center">
                    <DollarSign className="h-4 w-4 mr-2 text-primary" />
                    Información Financiera
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <dl className="space-y-2 text-sm">
                    <div>
                      <dt className="text-muted-foreground">Ventas Mensuales</dt>
                      <dd className="font-medium">Q{application.financialInfo.monthlySales.toLocaleString()}</dd>
                    </div>
                    <div>
                      <dt className="text-muted-foreground">Gastos Mensuales</dt>
                      <dd className="font-medium">Q{application.financialInfo.expenses.total.toLocaleString()}</dd>
                    </div>
                    <div>
                      <dt className="text-muted-foreground">Productos Principales</dt>
                      <dd className="font-medium">{application.financialInfo.mainProducts.length}</dd>
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
                    <p className="text-xl font-bold">Q{application.creditEvaluation.approvedAmount.toLocaleString()}</p>
                  </div>
                  <div className="text-center p-3 bg-background rounded-md">
                    <p className="text-xs text-muted-foreground mb-1">Plazo</p>
                    <p className="text-xl font-bold">{application.creditEvaluation.months} meses</p>
                  </div>
                  <div className="text-center p-3 bg-background rounded-md">
                    <p className="text-xs text-muted-foreground mb-1">Pago Mensual</p>
                    <p className="text-xl font-bold">Q{application.creditEvaluation.monthlyPayment.toLocaleString()}</p>
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
                  {Object.entries(application.documents).map(([key, value]: [string, any]) => (
                    <div key={key} className="flex flex-col items-center p-2 rounded-md border">
                      {value.status === 'complete' ? (
                        <div className="w-12 h-12 rounded-full bg-green-100 text-green-600 flex items-center justify-center mb-2">
                          <CheckCircle className="h-5 w-5" />
                        </div>
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mb-2">
                          <Clock className="h-5 w-5" />
                        </div>
                      )}
                      <span className="text-xs text-center">
                        {key === 'personalPhoto' && 'Foto Personal'}
                        {key === 'agentPhoto' && 'Foto con Agente'}
                        {key === 'businessPhoto' && 'Foto Negocio'}
                        {key === 'utilityBill' && 'Recibo Servicios'}
                        {key === 'additionalDocs' && 'Docs. Adicionales'}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Details Tab */}
          <TabsContent value="details">
            <div className="space-y-6">
              {/* Personal Information Section */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-lg">
                    <User className="h-5 w-5 mr-2 text-primary" />
                    Información Personal
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Nombre Completo</p>
                      <p className="font-medium">{application.personalInfo.fullName}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">DPI</p>
                      <p className="font-medium">{application.personalInfo.dpi}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Correo Electrónico</p>
                      <p className="font-medium">{application.personalInfo.email}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Teléfono</p>
                      <p className="font-medium">{application.personalInfo.phone}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Dirección</p>
                      <p className="font-medium">{application.personalInfo.address}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Fecha de Nacimiento</p>
                      <p className="font-medium">{application.personalInfo.birthDate}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Work Information Section */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-lg">
                    <Briefcase className="h-5 w-5 mr-2 text-primary" />
                    Información Laboral
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Ocupación</p>
                      <p className="font-medium">{application.workInfo.occupation}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Nombre del Negocio</p>
                      <p className="font-medium">{application.workInfo.businessName}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Dirección del Negocio</p>
                      <p className="font-medium">{application.workInfo.businessAddress}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Teléfono del Negocio</p>
                      <p className="font-medium">{application.workInfo.businessPhone}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Tipo de Negocio</p>
                      <p className="font-medium">{application.workInfo.businessType}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Financial Information Section */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-lg">
                    <DollarSign className="h-5 w-5 mr-2 text-primary" />
                    Información Financiera
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Ventas Mensuales Totales</p>
                      <p className="font-medium">Q{application.financialInfo.monthlySales.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Ventas al Contado</p>
                      <p className="font-medium">Q{application.financialInfo.cashSales.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Ventas al Crédito</p>
                      <p className="font-medium">Q{application.financialInfo.creditSales.toLocaleString()}</p>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium mb-2">Productos Principales</h4>
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
                        {application.financialInfo.mainProducts.map((product: any, index: number) => (
                          <TableRow key={index}>
                            <TableCell>{product.name}</TableCell>
                            <TableCell>{product.unitMeasure}</TableCell>
                            <TableCell className="text-right">{product.quantity}</TableCell>
                            <TableCell className="text-right">Q{product.unitPrice.toLocaleString()}</TableCell>
                            <TableCell className="text-right">Q{product.totalSales.toLocaleString()}</TableCell>
                            <TableCell className="text-right">Q{product.profit.toLocaleString()}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <h4 className="text-sm font-medium mb-2">Estacionalidad</h4>
                      <div className="space-y-3">
                        <div>
                          <p className="text-sm text-muted-foreground">Mejores Meses</p>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {application.financialInfo.bestMonths.map((month: string) => (
                              <Badge key={month} variant="outline" className="bg-green-50">{month}</Badge>
                            ))}
                          </div>
                          <p className="text-sm mt-1">
                            <span className="text-muted-foreground">Monto: </span>
                            <span className="font-medium">Q{application.financialInfo.bestMonthsAmount.toLocaleString()}</span>
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Peores Meses</p>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {application.financialInfo.worstMonths.map((month: string) => (
                              <Badge key={month} variant="outline" className="bg-red-50">{month}</Badge>
                            ))}
                          </div>
                          <p className="text-sm mt-1">
                            <span className="text-muted-foreground">Monto: </span>
                            <span className="font-medium">Q{application.financialInfo.worstMonthsAmount.toLocaleString()}</span>
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium mb-2">Gastos Administrativos</h4>
                      <Table>
                        <TableBody>
                          <TableRow>
                            <TableCell className="text-muted-foreground">Alquiler</TableCell>
                            <TableCell className="text-right">Q{application.financialInfo.expenses.rent.toLocaleString()}</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell className="text-muted-foreground">Electricidad</TableCell>
                            <TableCell className="text-right">Q{application.financialInfo.expenses.electricity.toLocaleString()}</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell className="text-muted-foreground">Teléfono/Internet</TableCell>
                            <TableCell className="text-right">Q{application.financialInfo.expenses.phone.toLocaleString()}</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell className="text-muted-foreground">Agua</TableCell>
                            <TableCell className="text-right">Q{application.financialInfo.expenses.water.toLocaleString()}</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell className="text-muted-foreground">Transporte/Combustible</TableCell>
                            <TableCell className="text-right">Q{application.financialInfo.expenses.transport.toLocaleString()}</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell className="text-muted-foreground">Otros</TableCell>
                            <TableCell className="text-right">Q{application.financialInfo.expenses.other.toLocaleString()}</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell className="font-medium">Total</TableCell>
                            <TableCell className="text-right font-bold">Q{application.financialInfo.expenses.total.toLocaleString()}</TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          {/* Documents Tab */}
          <TabsContent value="docs">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {Object.entries(application.documents).map(([key, value]: [string, any]) => (
                <Card key={key} className={value.status === 'complete' ? 'border-green-200' : 'border-amber-200'}>
                  <CardContent className="p-4">
                    <div className="flex flex-col items-center">
                      {value.status === 'complete' ? (
                        <>
                          <div className="relative aspect-square w-full max-w-[180px] rounded-md overflow-hidden mb-3">
                            <img 
                              src={value.url} 
                              alt={`Document ${key}`}
                              className="object-cover w-full h-full"
                            />
                            <div className="absolute top-2 right-2">
                              <Badge className="bg-green-500">
                                <CheckCircle className="h-3 w-3 mr-1" />
                                Completo
                              </Badge>
                            </div>
                          </div>
                        </>
                      ) : (
                        <div className="aspect-square w-full max-w-[180px] rounded-md bg-muted flex items-center justify-center mb-3">
                          <div className="text-center p-4">
                            <Camera className="h-10 w-10 text-muted-foreground mx-auto mb-2" />
                            <Badge variant="outline" className="bg-amber-100 text-amber-800 border-amber-200">
                              <Clock className="h-3 w-3 mr-1" />
                              Pendiente
                            </Badge>
                          </div>
                        </div>
                      )}
                      <p className="font-medium text-center">
                        {key === 'personalPhoto' && 'Foto Personal'}
                        {key === 'agentPhoto' && 'Foto con Agente'}
                        {key === 'businessPhoto' && 'Foto Negocio'}
                        {key === 'utilityBill' && 'Recibo Servicios'}
                        {key === 'additionalDocs' && 'Docs. Adicionales'}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
          
          {/* Notes Tab */}
          <TabsContent value="notes">
            <Card>
              <CardContent className="p-4">
                <div className="space-y-4">
                  {application.notes.map((note: any, index: number) => (
                    <div key={index} className="flex gap-4">
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
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
      
      <BottomNavigation />
    </div>
  );
};

export default ApplicationDetails;
