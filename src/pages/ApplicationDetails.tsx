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
import { ArrowLeft, Edit, FileText, CheckCircle, Clock, XCircle, AlertTriangle, User, Briefcase, DollarSign, FileCheck, Camera, ClipboardList, Calendar } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

// Mock data - in a real app, this would come from an API or database
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
            mainProducts: [{
              name: 'Granos básicos',
              unitMeasure: 'Quintal',
              quantity: 10,
              unitPrice: 500,
              totalSales: 5000,
              profit: 1500
            }, {
              name: 'Productos enlatados',
              unitMeasure: 'Caja',
              quantity: 20,
              unitPrice: 300,
              totalSales: 6000,
              profit: 1800
            }],
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
            personalPhoto: {
              status: 'complete',
              url: '/placeholder.svg'
            },
            agentPhoto: {
              status: 'complete',
              url: '/placeholder.svg'
            },
            businessPhoto: {
              status: 'complete',
              url: '/placeholder.svg'
            },
            utilityBill: {
              status: 'pending',
              url: null
            },
            additionalDocs: {
              status: 'pending',
              url: null
            }
          },
          notes: [{
            date: '2025-04-05',
            author: 'Juan Pérez',
            content: 'Solicitud creada y documentos básicos cargados.'
          }, {
            date: '2025-04-06',
            author: 'Ana López',
            content: 'Se requiere verificación adicional de ingresos.'
          }, {
            date: '2025-04-07',
            author: 'Carlos Gómez',
            content: 'Evaluación crediticia completada. Pendiente de aprobación final.'
          }]
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
            <AlertTriangle className="h-16 w-16 text-muted-foreground" />
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
  const getProgressState = () => {
    return `${application.progress / 7 * 100}%`;
  };
  const getStatusClass = () => {
    return applicationStatuses[application.status as keyof typeof applicationStatuses]?.color || '';
  };
  return <div className="min-h-screen flex flex-col">
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
          <Progress value={application.progress / 7 * 100} className="h-2" />
        </div>

        {/* Main content tabs */}
        
      </main>
      
      <BottomNavigation />
    </div>;
};
export default ApplicationDetails;