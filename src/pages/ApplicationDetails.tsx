import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '@/components/layout/Header';
import BottomNavigation from '@/components/layout/BottomNavigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  User, Phone, Mail, Home, Calendar, FileText, 
  CreditCard, DollarSign, CheckCircle, XCircle, 
  AlertCircle, Clock, ChevronRight, Edit, UserPlus 
} from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

const ApplicationDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('details');
  const [applicantName, setApplicantName] = useState('Solicitante');
  
  // Mock data - in a real app, fetch this from an API
  const applicationData = {
    id: id,
    status: 'En revisión',
    applicant: {
      name: 'Juan Carlos Pérez Rodríguez',
      phone: '+52 555 123 4567',
      email: 'juan.perez@example.com',
      address: 'Calle Reforma 123, Col. Centro, CDMX',
      birthdate: '15/05/1985',
      occupation: 'Ingeniero de Software',
    },
    application: {
      type: 'Préstamo Personal',
      amount: 50000,
      term: '24 meses',
      purpose: 'Remodelación de vivienda',
      date: '10/06/2023',
      interestRate: '18%',
      monthlyPayment: 2500,
      totalPayment: 60000,
    },
    documents: [
      { name: 'Identificación oficial', status: 'Verificado' },
      { name: 'Comprobante de domicilio', status: 'Verificado' },
      { name: 'Comprobante de ingresos', status: 'Pendiente' },
      { name: 'Estado de cuenta bancario', status: 'Pendiente' },
    ],
    guarantors: [
      { name: 'María González', relationship: 'Cónyuge', status: 'Verificado' }
    ],
    history: [
      { date: '10/06/2023', action: 'Solicitud creada', user: 'Juan Pérez' },
      { date: '11/06/2023', action: 'Documentos subidos', user: 'Juan Pérez' },
      { date: '12/06/2023', action: 'Verificación iniciada', user: 'Ana Martínez' },
      { date: '14/06/2023', action: 'Solicitud en revisión', user: 'Carlos López' },
    ]
  };

  useEffect(() => {
    // In a real app, fetch application data here
    setApplicantName(applicationData.applicant.name);
  }, [id]);

  const getStatusBadge = (status) => {
    switch(status) {
      case 'Aprobado':
        return <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">Aprobado</Badge>;
      case 'Rechazado':
        return <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300">Rechazado</Badge>;
      case 'En revisión':
        return <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300">En revisión</Badge>;
      case 'Pendiente':
        return <Badge className="bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300">Pendiente</Badge>;
      case 'Verificado':
        return <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">Verificado</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const getDocumentStatusIcon = (status) => {
    switch(status) {
      case 'Verificado':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'Rechazado':
        return <XCircle className="h-5 w-5 text-red-500" />;
      case 'Pendiente':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      default:
        return <AlertCircle className="h-5 w-5 text-gray-500" />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header personName={applicantName} />
      
      <main className="flex-1 px-4 py-6 pb-20">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold">{applicationData.application.type}</h1>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-sm text-muted-foreground">Solicitud #{applicationData.id}</span>
              {getStatusBadge(applicationData.status)}
            </div>
          </div>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => navigate(`/applications/${id}/edit`)}
          >
            <Edit className="h-4 w-4 mr-1" />
            Editar
          </Button>
        </div>

        <Tabs defaultValue="details" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-4 mb-4">
            <TabsTrigger value="details">Detalles</TabsTrigger>
            <TabsTrigger value="documents">Documentos</TabsTrigger>
            <TabsTrigger value="guarantors">Avales</TabsTrigger>
            <TabsTrigger value="history">Historial</TabsTrigger>
          </TabsList>
          
          <TabsContent value="details" className="space-y-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-medium">Información del solicitante</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center">
                  <User className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span>{applicationData.applicant.name}</span>
                </div>
                <div className="flex items-center">
                  <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span>{applicationData.applicant.phone}</span>
                </div>
                <div className="flex items-center">
                  <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span>{applicationData.applicant.email}</span>
                </div>
                <div className="flex items-center">
                  <Home className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span>{applicationData.applicant.address}</span>
                </div>
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span>Fecha de nacimiento: {applicationData.applicant.birthdate}</span>
                </div>
                <div className="flex items-center">
                  <FileText className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span>Ocupación: {applicationData.applicant.occupation}</span>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-medium">Detalles del préstamo</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center">
                  <CreditCard className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span>Tipo: {applicationData.application.type}</span>
                </div>
                <div className="flex items-center">
                  <DollarSign className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span>Monto: ${applicationData.application.amount.toLocaleString()}</span>
                </div>
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span>Plazo: {applicationData.application.term}</span>
                </div>
                <div className="flex items-center">
                  <FileText className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span>Propósito: {applicationData.application.purpose}</span>
                </div>
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span>Fecha de solicitud: {applicationData.application.date}</span>
                </div>
                <Separator />
                <div className="flex items-center">
                  <span className="text-muted-foreground">Tasa de interés:</span>
                  <span className="ml-auto font-medium">{applicationData.application.interestRate}</span>
                </div>
                <div className="flex items-center">
                  <span className="text-muted-foreground">Pago mensual:</span>
                  <span className="ml-auto font-medium">${applicationData.application.monthlyPayment.toLocaleString()}</span>
                </div>
                <div className="flex items-center">
                  <span className="text-muted-foreground">Pago total:</span>
                  <span className="ml-auto font-medium">${applicationData.application.totalPayment.toLocaleString()}</span>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="documents" className="space-y-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-medium">Documentos requeridos</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {applicationData.documents.map((doc, index) => (
                  <div key={index} className="flex items-center justify-between py-2 border-b last:border-0">
                    <div className="flex items-center">
                      <FileText className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>{doc.name}</span>
                    </div>
                    <div className="flex items-center">
                      {getDocumentStatusIcon(doc.status)}
                      <span className="ml-2 text-sm">{doc.status}</span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
            
            <div className="flex justify-center">
              <Button variant="outline" className="w-full">
                <FileText className="h-4 w-4 mr-2" />
                Subir documento
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="guarantors" className="space-y-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-medium">Avales registrados</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {applicationData.guarantors.map((guarantor, index) => (
                  <div 
                    key={index} 
                    className="flex items-center justify-between py-2 border-b last:border-0"
                    onClick={() => navigate(`/applications/${id}/guarantors/${index+1}`)}
                  >
                    <div className="flex items-center">
                      <User className="h-4 w-4 mr-2 text-muted-foreground" />
                      <div>
                        <p>{guarantor.name}</p>
                        <p className="text-xs text-muted-foreground">{guarantor.relationship}</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      {getStatusBadge(guarantor.status)}
                      <ChevronRight className="h-4 w-4 ml-2 text-muted-foreground" />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
            
            <div className="flex justify-center">
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => navigate(`/applications/${id}/guarantors/new`)}
              >
                <UserPlus className="h-4 w-4 mr-2" />
                Agregar aval
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="history" className="space-y-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-medium">Historial de la solicitud</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative pl-6 border-l border-border">
                  {applicationData.history.map((item, index) => (
                    <div key={index} className="mb-4 relative">
                      <div className="absolute -left-[21px] w-4 h-4 rounded-full bg-primary"></div>
                      <p className="text-xs text-muted-foreground">{item.date}</p>
                      <p className="font-medium">{item.action}</p>
                      <p className="text-sm text-muted-foreground">Por: {item.user}</p>
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
