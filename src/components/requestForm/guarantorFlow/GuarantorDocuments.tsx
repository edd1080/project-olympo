
import React, { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { GuarantorData } from '../RequestFormProvider';
import { 
  FileCheck, 
  Camera, 
  FileX, 
  FileQuestion, 
  Image, 
  FileText, 
  File,
  AlertTriangle
} from 'lucide-react';

interface GuarantorDocumentsProps {
  guarantor: GuarantorData;
  updateGuarantorData: (field: keyof GuarantorData, value: any) => void;
  setStepComplete: (isComplete: boolean) => void;
}

type DocumentStatus = 'pending' | 'complete' | 'error';

interface DocumentCard {
  id: string;
  title: string;
  description: string;
  status: DocumentStatus;
  required: boolean;
  icon: React.ReactNode;
}

const GuarantorDocuments: React.FC<GuarantorDocumentsProps> = ({
  guarantor,
  updateGuarantorData,
  setStepComplete
}) => {
  const { toast } = useToast();
  
  // Initialize documents status if it doesn't exist
  const documentsStatus = guarantor.documentsStatus || {
    dpi: 'pending',
    residenceProof: 'pending',
    businessPhotos: 'pending',
    financialStatement: 'pending',
    taxDeclaration: 'pending',
  };
  
  // Update document status
  const updateDocumentStatus = (docId: keyof typeof documentsStatus, status: DocumentStatus) => {
    const updatedStatus = {
      ...documentsStatus,
      [docId]: status
    };
    
    updateGuarantorData('documentsStatus', updatedStatus);
  };
  
  // Prepare document cards
  const documentCards: DocumentCard[] = [
    {
      id: 'dpi',
      title: 'DPI',
      description: 'Ambos lados del Documento Personal de Identificación',
      status: documentsStatus.dpi,
      required: true,
      icon: <FileCheck className="h-6 w-6" />
    },
    {
      id: 'residenceProof',
      title: 'Comprobante de Domicilio',
      description: 'Recibo de servicios básicos a nombre del fiador',
      status: documentsStatus.residenceProof,
      required: true,
      icon: <File className="h-6 w-6" />
    },
    {
      id: 'businessPhotos',
      title: 'Fotografías del Negocio',
      description: 'Al menos 3 fotos del local y productos',
      status: documentsStatus.businessPhotos,
      required: true,
      icon: <Image className="h-6 w-6" />
    },
    {
      id: 'financialStatement',
      title: 'Estado Financiero',
      description: 'Balance general y estado de resultados',
      status: documentsStatus.financialStatement,
      required: true,
      icon: <FileText className="h-6 w-6" />
    },
    {
      id: 'taxDeclaration',
      title: 'Declaración de Impuestos',
      description: 'Última declaración anual de impuestos',
      status: documentsStatus.taxDeclaration,
      required: false,
      icon: <FileText className="h-6 w-6" />
    }
  ];
  
  // Request camera permissions (simulated)
  const requestCameraPermission = async () => {
    try {
      toast({
        title: "Permisos solicitados",
        description: "En una implementación real, esto solicitaría permisos de cámara",
      });
      return true;
    } catch (error) {
      toast({
        title: "Error de permisos",
        description: "No se pudieron obtener los permisos de cámara",
        variant: "destructive"
      });
      return false;
    }
  };
  
  // Handle document upload
  const handleDocumentUpload = async (docId: string) => {
    const hasPermission = await requestCameraPermission();
    
    if (!hasPermission) {
      return;
    }
    
    // Simulate upload process
    toast({
      title: "Procesando documento...",
      description: "Por favor espere mientras se procesa el documento",
    });
    
    setTimeout(() => {
      // Random success/error for demonstration
      const success = Math.random() > 0.2;
      
      if (success) {
        updateDocumentStatus(docId as keyof typeof documentsStatus, 'complete');
        toast({
          title: "Documento subido",
          description: "El documento se ha subido correctamente",
          variant: "default",
          className: "bg-green-100 text-green-800"
        });
      } else {
        updateDocumentStatus(docId as keyof typeof documentsStatus, 'error');
        toast({
          title: "Error al subir",
          description: "Hubo un problema al procesar el documento",
          variant: "destructive"
        });
      }
    }, 2000);
  };
  
  // Get status icon based on document status
  const getStatusIcon = (status: DocumentStatus) => {
    switch (status) {
      case 'complete':
        return <FileCheck className="h-6 w-6 text-green-500" />;
      case 'error':
        return <FileX className="h-6 w-6 text-red-500" />;
      default:
        return <FileQuestion className="h-6 w-6 text-gray-400" />;
    }
  };
  
  // Get status text based on document status
  const getStatusText = (status: DocumentStatus) => {
    switch (status) {
      case 'complete':
        return "Documento completo";
      case 'error':
        return "Error al procesar";
      default:
        return "Pendiente";
    }
  };
  
  // Get status color class based on document status
  const getStatusColorClass = (status: DocumentStatus) => {
    switch (status) {
      case 'complete':
        return "border-green-200 bg-green-50";
      case 'error':
        return "border-red-200 bg-red-50";
      default:
        return "border-gray-200 bg-gray-50";
    }
  };
  
  // Check if the form is complete
  useEffect(() => {
    // Required documents must be complete
    const requiredDocuments = documentCards
      .filter(doc => doc.required)
      .map(doc => doc.id);
    
    const allRequiredComplete = requiredDocuments.every(docId => 
      documentsStatus[docId as keyof typeof documentsStatus] === 'complete'
    );
    
    setStepComplete(allRequiredComplete);
  }, [documentsStatus, documentCards, setStepComplete]);
  
  // Count completed documents
  const completedCount = Object.values(documentsStatus).filter(status => status === 'complete').length;
  const totalCount = Object.keys(documentsStatus).length;
  
  return (
    <div className="space-y-6">
      <div className="border-b pb-4">
        <h3 className="text-lg font-medium">Documentos Requeridos</h3>
        <p className="text-muted-foreground text-sm">
          Suba los documentos requeridos del fiador ({completedCount}/{totalCount} completados)
        </p>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {documentCards.map((doc) => (
          <Card 
            key={doc.id}
            className={`relative border overflow-hidden ${getStatusColorClass(doc.status)}`}
          >
            <div className="p-4 h-full flex flex-col">
              <div className="flex justify-between items-start mb-2">
                <div className="text-muted-foreground">
                  {doc.icon}
                </div>
                <div>
                  {getStatusIcon(doc.status)}
                </div>
              </div>
              
              <h4 className="font-medium mb-1">{doc.title}</h4>
              <p className="text-sm text-muted-foreground mb-2 flex-grow">
                {doc.description}
              </p>
              
              <div className="mt-2 space-y-2">
                <p className="text-xs font-medium">
                  Estado: {getStatusText(doc.status)}
                  {doc.required && doc.status !== 'complete' && (
                    <span className="text-red-500 ml-1">*</span>
                  )}
                </p>
                
                <Button
                  variant={doc.status === 'complete' ? "outline" : "default"}
                  size="sm"
                  className="w-full"
                  onClick={() => handleDocumentUpload(doc.id)}
                >
                  <Camera className="mr-2 h-4 w-4" />
                  {doc.status === 'complete' ? 'Volver a tomar' : 'Tomar foto'}
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
      
      {documentCards.filter(doc => doc.status === 'error').length > 0 && (
        <div className="border border-red-200 p-4 rounded-md bg-red-50 text-red-800 text-sm flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-medium">Error en documentos</p>
            <p>
              Algunos documentos no se pudieron procesar correctamente. 
              Por favor, intente subirlos nuevamente.
            </p>
          </div>
        </div>
      )}
      
      {documentCards.filter(doc => doc.required && doc.status !== 'complete').length > 0 && (
        <div className="border border-amber-200 p-4 rounded-md bg-amber-50 text-amber-800 text-sm">
          <p className="font-medium">Documentos pendientes</p>
          <p>
            Es necesario completar todos los documentos marcados como obligatorios 
            para poder continuar con el proceso.
          </p>
        </div>
      )}
    </div>
  );
};

export default GuarantorDocuments;
