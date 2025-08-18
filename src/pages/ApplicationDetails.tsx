import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '@/components/layout/Header';

import BreadcrumbNavigation from '@/components/navigation/BreadcrumbNavigation';
import { useAppState } from '@/context/AppStateContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { ArrowLeft, Edit, FileText, CheckCircle, Clock, XCircle, AlertCircle, User, Briefcase, DollarSign, FileCheck, Camera, ClipboardList, Calendar, UserCheck, Users, Search, FileSignature, BarChart3, MapPin, Plus, Send, PartyPopper, ChevronRight } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import CircularProgress from "@/components/requestForm/CircularProgress";
import NewGuarantorSheet from "@/components/requestForm/guarantors/NewGuarantorSheet";

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
// Dynamic form sections based on application type
const getFormSections = (applicationType: string) => {
  if (applicationType === 'oficial') {
    // Official application sections (5 steps)
    return [{
      id: 'credit-details',
      icon: <DollarSign size={18} />,
      name: 'Detalles del Crédito'
    }, {
      id: 'character',
      icon: <Users size={18} />,
      name: 'Análisis de Carácter'
    }, {
      id: 'business-financial',
      icon: <BarChart3 size={18} />,
      name: 'Información Financiera'
    }, {
      id: 'documents',
      icon: <FileSignature size={18} />,
      name: 'Documentos e Imágenes'
    }, {
      id: 'signature',
      icon: <FileCheck size={18} />,
      name: 'Cláusula y Firma'
    }];
  } else {
    // Legacy application sections (6 steps)
    return [{
      id: 'identification',
      icon: <User size={18} />,
      name: 'Identificación y Contacto'
    }, {
      id: 'finances',
      icon: <DollarSign size={18} />,
      name: 'Finanzas y Patrimonio'
    }, {
      id: 'business',
      icon: <Briefcase size={18} />,
      name: 'Negocio y Perfil Económico'
    }, {
      id: 'guarantors',
      icon: <Users size={18} />,
      name: 'Garantías, Fiadores y Referencias'
    }, {
      id: 'documents',
      icon: <FileSignature size={18} />,
      name: 'Documentos y Cierre'
    }, {
      id: 'review',
      icon: <CheckCircle size={18} />,
      name: 'Revisión Final'
    }];
  }
};

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
  const { applications } = useAppState();
  const [application, setApplication] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [toastShown, setToastShown] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newSheetOpen, setNewSheetOpen] = useState(false);

  const getFieldDisplayValue = (value: any, fieldName?: string) => {
    if (value === undefined || value === null || value === '') {
      return <span className="text-muted-foreground italic">Por ingresar</span>;
    }
    return value;
  };

  useEffect(() => {
    const fetchApplicationData = () => {
      setTimeout(() => {
        // First check if application exists in context (from KYC)
        const contextApp = applications.find(app => app.id === id);
        
        if (contextApp && contextApp.type === 'oficial') {
          // Create application data using KYC data
          const kycData = contextApp.kycData!;
          const oficialApplication = {
            id: contextApp.id,
            status: 'draft',
            progress: 1,
            type: 'oficial',
            createdAt: contextApp.date,
            updatedAt: contextApp.date,
            identification: {
              agencia: getFieldDisplayValue(null),
              cui: kycData.cui,
              nit: getFieldDisplayValue(null),
              tipoSocio: getFieldDisplayValue(null),
              fullName: `${kycData.firstName} ${kycData.lastName}`,
              email: getFieldDisplayValue(null),
              phone: getFieldDisplayValue(null),
              estadoCivil: getFieldDisplayValue(null),
              address: kycData.address,
              birthDate: kycData.birthDate,
              nacionalidad: getFieldDisplayValue(null),
              genero: kycData.gender,
              profesion: getFieldDisplayValue(null),
              educationLevel: getFieldDisplayValue(null),
              housingType: getFieldDisplayValue(null),
              housingYears: getFieldDisplayValue(null),
              dependents: getFieldDisplayValue(null),
              conyuge: null
            },
            work: {
              employmentStatus: getFieldDisplayValue(null),
              companyName: getFieldDisplayValue(null),
              position: getFieldDisplayValue(null),
              yearsEmployed: getFieldDisplayValue(null),
              monthsEmployed: getFieldDisplayValue(null),
              workAddress: getFieldDisplayValue(null),
              workPhone: getFieldDisplayValue(null),
              workType: getFieldDisplayValue(null),
              incomeStability: getFieldDisplayValue(null)
            },
            finances: {
              primaryIncome: getFieldDisplayValue(null),
              secondaryIncome: getFieldDisplayValue(null),
              incomeSource: getFieldDisplayValue(null),
              rent: getFieldDisplayValue(null),
              utilities: getFieldDisplayValue(null),
              food: getFieldDisplayValue(null),
              transportation: getFieldDisplayValue(null),
              otherExpenses: getFieldDisplayValue(null),
              totalExpenses: getFieldDisplayValue(null),
              currentLoans: getFieldDisplayValue(null),
              creditCards: getFieldDisplayValue(null),
              totalDebts: getFieldDisplayValue(null),
              netIncome: getFieldDisplayValue(null),
              debtToIncomeRatio: getFieldDisplayValue(null),
              paymentCapacity: getFieldDisplayValue(null),
              assets: {
                cash: getFieldDisplayValue(null),
                inventory: getFieldDisplayValue(null),
                equipment: getFieldDisplayValue(null),
                realEstate: getFieldDisplayValue(null),
                vehicles: getFieldDisplayValue(null),
                total: getFieldDisplayValue(null)
              },
              liabilities: {
                loans: getFieldDisplayValue(null),
                creditCards: getFieldDisplayValue(null),
                suppliers: getFieldDisplayValue(null),
                total: getFieldDisplayValue(null)
              },
              netWorth: getFieldDisplayValue(null)
            },
            creditRequest: {
              loanAmount: getFieldDisplayValue(null),
              termMonths: getFieldDisplayValue(null),
              creditType: getFieldDisplayValue(null),
              purpose: getFieldDisplayValue(null),
              collateral: getFieldDisplayValue(null)
            },
            guarantors: [],
            documents: {
              dpiFrontal: {
                status: 'pending',
                url: null
              },
              dpiTrasero: {
                status: 'pending',
                url: null
              },
              fotoSolicitante: {
                status: 'pending',
                url: null
              },
              recibosServicios: {
                status: 'pending',
                url: null
              },
              firmaCanvas: {
                status: 'pending',
                url: null
              }
            }
          };
          setApplication(oficialApplication);
          setLoading(false);
          return;
        }

        // Default legacy application
        const mockApplication = {
          id: 'SCO_459034',
          status: 'reviewing',
          progress: 4,
          type: 'legacy',
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
            educationLevel: 'Diversificado',
            housingType: 'Propia',
            housingYears: 5,
            dependents: 2,
            conyuge: {
              nombre: 'Carlos Martínez',
              dpi: '2345 67890 1234',
              telefono: '502-5555-5678',
              trabajo: 'Albañil'
            }
          },
          work: {
            employmentStatus: 'Independiente',
            companyName: 'Abarrotes María (Negocio Propio)',
            position: 'Propietaria',
            yearsEmployed: 8,
            monthsEmployed: 0,
            workAddress: 'Mercado Central, Local 45, Zona 1',
            workPhone: '502-2222-5678',
            workType: 'Comercio',
            incomeStability: 'Estable'
          },
          finances: {
            primaryIncome: 20000,
            secondaryIncome: 5000,
            incomeSource: 'Ventas del negocio',
            rent: 3500,
            utilities: 800,
            food: 2500,
            transportation: 1200,
            otherExpenses: 2000,
            totalExpenses: 10000,
            currentLoans: 15000,
            creditCards: 5000,
            totalDebts: 20000,
            // Evaluación financiera
            netIncome: 15000,
            debtToIncomeRatio: 0.8,
            paymentCapacity: 12000,
            // Estado patrimonial
            assets: {
              cash: 5000,
              inventory: 50000,
              equipment: 30000,
              realEstate: 200000,
              vehicles: 45000,
              total: 330000
            },
            liabilities: {
              loans: 45000,
              creditCards: 5000,
              suppliers: 15000,
              total: 65000
            },
            netWorth: 265000
          },
          creditRequest: {
            loanAmount: 25000,
            termMonths: 18,
            creditType: 'Crédito Comercial',
            purpose: 'Ampliación de inventario',
            collateral: 'Inventario del negocio'
          },
          guarantors: [{
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
          }],
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
          }
        };
        setApplication(mockApplication);
        setLoading(false);
      }, 500);
    };
    fetchApplicationData();
  }, [id, applications]);
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
    // Determine the correct route based on application type
    const editRoute = application?.type === 'oficial' 
      ? `/applications/${id}/edit-oficial` 
      : `/applications/${id}/edit`;
      
    navigate(editRoute, {
      state: {
        sectionId,
        identityData: application?.type === 'oficial' ? application?.kycData : undefined,
        applicationId: id
      }
    });
    toast({
      title: "Navegación a sección",
      description: `Navegando a la sección: ${sectionId}`,
      duration: 2000
    });
  };

  const navigateToDocuments = () => {
    // Determine the correct route based on application type
    const editRoute = application?.type === 'oficial' 
      ? `/applications/${id}/edit-oficial` 
      : `/applications/${id}/edit`;
      
    navigate(editRoute, {
      state: {
        sectionId: 'documents',
        identityData: application?.type === 'oficial' ? application?.kycData : undefined,
        applicationId: id
      }
    });
    toast({
      title: "Agregar Documentos",
      description: "Navegando a la sección de documentos",
      duration: 2000
    });
  };

  const handleAddGuarantor = () => {
    setNewSheetOpen(true);
  };

  const handleSheetCreate = (data: { fullName: string; birthDate: string; age: number; employmentType: 'asalariado' | 'negocio' }) => {
    if (!application) return;
    const newGuarantor = {
      id: `G${Date.now()}`,
      nombre: data.fullName,
      dpi: '—',
      telefono: '—',
      parentesco: '—',
      salario: 0,
      tipoEmpleo: data.employmentType === 'asalariado' ? 'Asalariado' : 'Negocio propio',
      empresa: '—',
      porcentajeCobertura: 0,
      status: 'in-progress',
      progress: 0,
    };
    setApplication((prev: any) => ({ ...prev, guarantors: [...(prev?.guarantors || []), newGuarantor] }));
    setNewSheetOpen(false);
    toast({ title: "Fiador agregado", description: "Se creó el nuevo fiador.", duration: 2000 });
  };

  const handleSheetDiscard = () => {
    setNewSheetOpen(false);
  };

  const isApplicationReadyToSubmit = () => {
    if (!application) return false;

    // Check if all sections are completed (5 for oficial, 6 for legacy)
    const maxSections = application.type === 'oficial' ? 5 : 6;
    const allSectionsComplete = application.progress >= maxSections;

    // Check if required documents are uploaded
    const requiredDocs = ['dpiFrontal', 'dpiTrasero', 'fotoSolicitante'];
    const requiredDocsComplete = requiredDocs.every(doc => application.documents[doc]?.status === 'complete');

    // Check if at least one guarantor is registered
    const hasGuarantors = application.guarantors && application.guarantors.length > 0;
    return allSectionsComplete && requiredDocsComplete && hasGuarantors;
  };

  const handleSubmitApplication = async () => {
    // Check if application is ready first
    if (!isApplicationReadyToSubmit()) {
      toast({
        title: "Solicitud incompleta",
        description: "Para enviar la solicitud, completa todas las secciones, sube los documentos requeridos y registra al menos un fiador.",
        variant: "destructive",
        duration: 5000
      });
      return;
    }
    setShowConfirmDialog(true);
  };

  const confirmSubmitApplication = async () => {
    setIsSubmitting(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      setShowConfirmDialog(false);
      setShowSuccessDialog(true);
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo enviar la solicitud. Intenta nuevamente.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSuccessClose = () => {
    setShowSuccessDialog(false);
    navigate('/applications');
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
      <Header personName={application?.identification?.fullName?.split(' ')[0] || ''} applicationStatus={application?.status} applicationId={application?.id} />
      
      <main className="flex-1 container mx-auto px-4 py-0 pb-20">
        <BreadcrumbNavigation />
        
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-6">
          <div className="flex-1">
            <h1 className="text-xl font-medium">{application.identification.fullName}</h1>
          </div>
          
          <div className="flex items-center gap-2">
            <Button size="sm" variant="outline" onClick={handleEditApplication}>
              <Edit className="h-4 w-4 mr-1" />
              Editar
            </Button>
            <Button size="sm" onClick={handleSubmitApplication} disabled={!isApplicationReadyToSubmit()} className={!isApplicationReadyToSubmit() ? 'opacity-50 cursor-not-allowed' : ''}>
              <Send className="mr-2 h-4 w-4" />
              Enviar Solicitud
            </Button>
          </div>
        </div>

        <div className="mb-6">
          <div className="flex justify-between text-sm mb-2">
            <span className="font-medium">Progreso:</span>
            <span>{application.progress}/{application.type === 'oficial' ? 5 : 6} secciones completadas</span>
          </div>
          <Progress value={application.progress / (application.type === 'oficial' ? 5 : 6) * 100} className="h-2" />
        </div>

        <Card className="mb-6 border-primary/20 bg-primary/5">
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center">
              <FileText className="h-4 w-4 mr-2 text-primary" />
              Acceso Rápido
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-3 pb-6">
            <div className={`grid grid-cols-2 sm:grid-cols-3 gap-2 ${application.type === 'oficial' ? 'md:grid-cols-5' : 'md:grid-cols-6'}`}>
              {getFormSections(application.type).map(section => <Button key={section.id} variant="outline" className="h-auto py-2 flex flex-col items-center text-xs gap-1 flex-1 min-h-[5rem] sm:min-h-[4.5rem]" onClick={() => navigateToFormSection(section.id)}>
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mb-1">
                    {section.icon}
                  </div>
                  <span className="text-center leading-tight px-1 whitespace-normal sm:whitespace-nowrap overflow-hidden">
                    {section.name}
                  </span>
                </Button>)}
            </div>
          </CardContent>
        </Card>

        {/* Fiadores Section */}
        <Card className="mb-6 border-primary/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center justify-between">
              <div className="flex items-center">
                <Users className="h-4 w-4 mr-2 text-primary" />
                Fiadores
              </div>
<Badge className={`${application.guarantors.length >= 2 ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100' : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100'} text-xs`}>
  {application.guarantors.length} de 2 mínimo
</Badge>
            </CardTitle>
            <CardDescription className="text-sm">
              Gestiona los fiadores de la solicitud
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-3 pb-6">
            {application.guarantors.length === 0 ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                  <Users className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="font-medium mb-2">No hay fiadores registrados</h3>
                <p className="text-muted-foreground text-sm mb-4">
                  Se requieren mínimo 2 fiadores para procesar la solicitud
                </p>
                <Button 
                  size="sm"
                  onClick={handleAddGuarantor}
                  className="bg-[#E18E33] hover:bg-[#E18E33]/90 text-white"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Agregar Primer Fiador
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="grid gap-3">
                  {application.guarantors.map((guarantor: any, index: number) => (
                    <div key={guarantor.id} className="group flex items-center justify-between p-4 rounded-xl border bg-gradient-to-r from-primary/5 to-accent/5 hover:shadow-md transition">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <UserCheck className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">{guarantor.nombre}</p>
                          <p className="text-sm text-muted-foreground">
                            {guarantor.parentesco} • {guarantor.dpi}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-right hidden sm:block">
                          <p className="text-sm font-medium">Q{guarantor.salario.toLocaleString()}</p>
                          <p className="text-xs text-muted-foreground">{guarantor.progress}% completo</p>
                        </div>
                        <CircularProgress progress={guarantor.progress || 0} size={36} strokeWidth={4} />
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex justify-center pt-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={handleAddGuarantor}
                    className="border-[#E18E33] text-[#E18E33] hover:bg-[#E18E33]/10"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Agregar Otro Fiador
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <NewGuarantorSheet
          open={newSheetOpen}
          onOpenChange={setNewSheetOpen}
          onCreate={handleSheetCreate}
          onDiscard={handleSheetDiscard}
        />

        <Tabs defaultValue="summary" className="mb-6">
          <TabsList className="mb-4">
            <TabsTrigger value="summary" className="font-semibold">Resumen</TabsTrigger>
            <TabsTrigger value="details">Detalles</TabsTrigger>
            <TabsTrigger value="docs">Documentos</TabsTrigger>
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
                      <dt className="text-muted-foreground">Ingresos Principales</dt>
                      <dd className="font-medium">Q{application.finances.primaryIncome.toLocaleString()}</dd>
                    </div>
                    <div>
                      <dt className="text-muted-foreground">Gastos Mensuales</dt>
                      <dd className="font-medium">Q{application.finances.totalExpenses.toLocaleString()}</dd>
                    </div>
                    <div>
                      <dt className="text-muted-foreground">Patrimonio Neto</dt>
                      <dd className="font-medium">Q{application.finances.netWorth.toLocaleString()}</dd>
                    </div>
                  </dl>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center">
                    <Briefcase className="h-4 w-4 mr-2 text-primary" />
                    Trabajo
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <dl className="space-y-2 text-sm">
                    <div>
                      <dt className="text-muted-foreground">Situación Laboral</dt>
                      <dd className="font-medium">{application.work.employmentStatus}</dd>
                    </div>
                    <div>
                      <dt className="text-muted-foreground">Empresa/Negocio</dt>
                      <dd className="font-medium">{application.work.companyName}</dd>
                    </div>
                    <div>
                      <dt className="text-muted-foreground">Experiencia</dt>
                      <dd className="font-medium">{application.work.yearsEmployed} años</dd>
                    </div>
                  </dl>
                </CardContent>
              </Card>
            </div>
            
            <Card className="mb-4 border-primary/20 bg-primary/5">
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center">
                  <FileText className="h-4 w-4 mr-2 text-primary" />
                  Solicitud de Crédito
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-3 bg-background rounded-md">
                    <p className="text-xs text-muted-foreground mb-1">Monto Solicitado</p>
                    <p className="font-bold text-lg">Q{application.creditRequest.loanAmount.toLocaleString()}</p>
                  </div>
                  <div className="text-center p-3 bg-background rounded-md">
                    <p className="text-xs text-muted-foreground mb-1">Plazo</p>
                    <p className="font-bold text-lg">{application.creditRequest.termMonths} meses</p>
                  </div>
                  <div className="text-center p-3 bg-background rounded-md">
                    <p className="text-xs text-muted-foreground mb-1">Tipo de Crédito</p>
                    <p className="font-bold text-sm">{application.creditRequest.creditType}</p>
                  </div>
                  <div className="text-center p-3 bg-background rounded-md">
                    <p className="text-xs text-muted-foreground mb-1">Propósito</p>
                    <p className="font-bold text-sm">{application.creditRequest.purpose}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="cursor-pointer hover:shadow-md transition-shadow duration-200" onClick={navigateToDocuments}>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center justify-between">
                  <div className="flex items-center">
                    <FileCheck className="h-4 w-4 mr-2 text-primary" />
                    Estado de Documentos
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
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
                    Información Personal Detallada
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
                      <p className="text-sm text-muted-foreground">Fecha de Nacimiento</p>
                      <p className="font-medium">{application.identification.birthDate}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Nacionalidad</p>
                      <p className="font-medium">{application.identification.nacionalidad}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Género</p>
                      <p className="font-medium">{application.identification.genero}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Profesión</p>
                      <p className="font-medium">{application.identification.profesion}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Nivel Educativo</p>
                      <p className="font-medium">{application.identification.educationLevel}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Tipo de Vivienda</p>
                      <p className="font-medium">{application.identification.housingType}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Años en Vivienda</p>
                      <p className="font-medium">{application.identification.housingYears} años</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Dependientes</p>
                      <p className="font-medium">{application.identification.dependents}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Correo Electrónico</p>
                      <p className="font-medium">{application.identification.email}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Teléfono</p>
                      <p className="font-medium">{application.identification.phone}</p>
                    </div>
                    <div className="sm:col-span-2">
                      <p className="text-sm text-muted-foreground">Dirección</p>
                      <p className="font-medium">{application.identification.address}</p>
                    </div>
                  </div>
                  
                  {application.identification.conyuge && <div className="mt-6">
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
                        <div>
                          <p className="text-sm text-muted-foreground">Trabajo</p>
                          <p className="font-medium">{application.identification.conyuge.trabajo}</p>
                        </div>
                      </div>
                    </div>}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-lg">
                    <Briefcase className="h-5 w-5 mr-2 text-primary" />
                    Información Laboral Detallada
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Situación Laboral</p>
                      <p className="font-medium">{application.work.employmentStatus}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Empresa/Negocio</p>
                      <p className="font-medium">{application.work.companyName}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Puesto/Posición</p>
                      <p className="font-medium">{application.work.position}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Años de Experiencia</p>
                      <p className="font-medium">{application.work.yearsEmployed} años</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Tipo de Trabajo</p>
                      <p className="font-medium">{application.work.workType}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Estabilidad de Ingresos</p>
                      <p className="font-medium">{application.work.incomeStability}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Teléfono del Trabajo</p>
                      <p className="font-medium">{application.work.workPhone}</p>
                    </div>
                    <div className="sm:col-span-2">
                      <p className="text-sm text-muted-foreground">Dirección del Trabajo</p>
                      <p className="font-medium">{application.work.workAddress}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-lg">
                    <DollarSign className="h-5 w-5 mr-2 text-primary" />
                    Análisis Financiero Detallado
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h4 className="text-sm font-medium mb-3">Ingresos</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Ingresos Principales</p>
                        <p className="font-medium">Q{application.finances.primaryIncome.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Ingresos Secundarios</p>
                        <p className="font-medium">Q{application.finances.secondaryIncome.toLocaleString()}</p>
                      </div>
                      <div className="sm:col-span-2">
                        <p className="text-sm text-muted-foreground">Fuente de Ingresos</p>
                        <p className="font-medium">{application.finances.incomeSource}</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium mb-3">Gastos Mensuales</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Renta/Vivienda</p>
                        <p className="font-medium">Q{application.finances.rent.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Servicios</p>
                        <p className="font-medium">Q{application.finances.utilities.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Alimentación</p>
                        <p className="font-medium">Q{application.finances.food.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Transporte</p>
                        <p className="font-medium">Q{application.finances.transportation.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Otros Gastos</p>
                        <p className="font-medium">Q{application.finances.otherExpenses.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground font-bold">Total Gastos</p>
                        <p className="font-bold">Q{application.finances.totalExpenses.toLocaleString()}</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium mb-3">Deudas Actuales</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Préstamos Actuales</p>
                        <p className="font-medium">Q{application.finances.currentLoans.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Tarjetas de Crédito</p>
                        <p className="font-medium">Q{application.finances.creditCards.toLocaleString()}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-md">
                    <h4 className="text-sm font-medium mb-3">Evaluación Financiera</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Ingreso Neto</p>
                        <p className="font-bold text-green-600">Q{application.finances.netIncome.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Ratio Deuda/Ingreso</p>
                        <p className="font-bold">{(application.finances.debtToIncomeRatio * 100).toFixed(1)}%</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Capacidad de Pago</p>
                        <p className="font-bold text-blue-600">Q{application.finances.paymentCapacity.toLocaleString()}</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium mb-3">Estado Patrimonial</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h5 className="text-sm font-medium mb-2">Activos</h5>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm text-muted-foreground">Efectivo</span>
                            <span className="text-sm">Q{application.finances.assets.cash.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-muted-foreground">Inventario</span>
                            <span className="text-sm">Q{application.finances.assets.inventory.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-muted-foreground">Equipos</span>
                            <span className="text-sm">Q{application.finances.assets.equipment.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-muted-foreground">Bienes Inmuebles</span>
                            <span className="text-sm">Q{application.finances.assets.realEstate.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-muted-foreground">Vehículos</span>
                            <span className="text-sm">Q{application.finances.assets.vehicles.toLocaleString()}</span>
                          </div>
                          <Separator />
                          <div className="flex justify-between font-bold">
                            <span className="text-sm">Total Activos</span>
                            <span className="text-sm">Q{application.finances.assets.total.toLocaleString()}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h5 className="text-sm font-medium mb-2">Pasivos</h5>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm text-muted-foreground">Préstamos</span>
                            <span className="text-sm">Q{application.finances.liabilities.loans.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-muted-foreground">Tarjetas de Crédito</span>
                            <span className="text-sm">Q{application.finances.liabilities.creditCards.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-muted-foreground">Proveedores</span>
                            <span className="text-sm">Q{application.finances.liabilities.suppliers.toLocaleString()}</span>
                          </div>
                          <Separator />
                          <div className="flex justify-between font-bold">
                            <span className="text-sm">Total Pasivos</span>
                            <span className="text-sm">Q{application.finances.liabilities.total.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between font-bold text-primary">
                            <span className="text-sm">Patrimonio Neto</span>
                            <span className="text-sm">Q{application.finances.netWorth.toLocaleString()}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
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
        </Tabs>
      </main>
      
      

      {/* Confirmation Dialog */}
      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar Envío</DialogTitle>
            <DialogDescription>
              ¿Estás seguro de que deseas enviar esta solicitud? Una vez enviada no podrás realizar cambios.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowConfirmDialog(false)}>
              Cancelar
            </Button>
            <Button onClick={confirmSubmitApplication} disabled={isSubmitting}>
              {isSubmitting ? 'Enviando...' : 'Confirmar Envío'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Success Dialog */}
      <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <DialogContent>
          <DialogHeader>
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <PartyPopper className="h-8 w-8 text-green-600" />
              </div>
              <DialogTitle className="text-xl">¡Solicitud Enviada!</DialogTitle>
              <DialogDescription className="text-center">
                Tu solicitud ha sido enviada exitosamente. Recibirás una notificación cuando sea revisada.
              </DialogDescription>
            </div>
          </DialogHeader>
          <DialogFooter>
            <Button onClick={handleSuccessClose} className="w-full">
              Continuar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>;
};
export default ApplicationDetails;
