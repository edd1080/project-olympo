
import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Header from '@/components/layout/Header';

import { Button } from '@/components/ui/button';
import { ArrowLeft, FileSpreadsheet, Pencil, Phone, Mail, Calendar, FileText } from 'lucide-react';

const ProspectDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  
  useEffect(() => {
    console.log(`ProspectDetails mounted for prospect ID: ${id}`);
  }, [id]);
  
  const prospectData = {
    id: 1, 
    name: 'Juan Pérez', 
    identification: 'PERJ850513HDFRZN09',
    phone: '+52 5512345678', 
    email: 'juan.perez@mail.com', 
    source: 'Sitio Web',
    status: 'new',
    date: '2025-04-05',
    notes: 'Cliente interesado en crédito hipotecario, tiene documentos listos.'
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 px-4 py-4 pb-20">
        <div className="flex items-center gap-2 mb-4">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => navigate('/prospects')}
            className="h-9 w-9"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h2 className="text-lg font-medium">Detalles del Prospecto</h2>
        </div>
        
        <div className="space-y-6">
          <div className="space-y-2">
            <h1 className="text-2xl font-bold">{prospectData.name}</h1>
            <div className="inline-block bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 text-xs px-2 py-1 rounded-full">
              Nuevo
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Identificación</p>
              <p>{prospectData.identification}</p>
            </div>
            
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Fuente</p>
              <p>{prospectData.source}</p>
            </div>
            
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Fecha de registro</p>
              <div className="flex items-center">
                <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                <p>{prospectData.date}</p>
              </div>
            </div>
          </div>
          
          <div className="space-y-3">
            <h3 className="font-semibold">Información de contacto</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Teléfono</p>
                <div className="flex items-center">
                  <Phone className="mr-2 h-4 w-4 text-primary" />
                  <p>{prospectData.phone}</p>
                </div>
              </div>
              
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Email</p>
                <div className="flex items-center">
                  <Mail className="mr-2 h-4 w-4 text-primary" />
                  <p>{prospectData.email}</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            <h3 className="font-semibold">Notas</h3>
            <div className="p-3 bg-muted/30 rounded-md">
              <div className="flex gap-2 items-start">
                <FileText className="h-4 w-4 text-muted-foreground mt-0.5" />
                <p className="text-sm">{prospectData.notes}</p>
              </div>
            </div>
          </div>
          
          <div className="pt-4 flex gap-3 justify-center sm:justify-end">
            <Button variant="outline" className="flex-1 sm:flex-none">
              <Pencil className="mr-2 h-4 w-4" />
              Editar
            </Button>
            <Button className="flex-1 sm:flex-none">
              <FileSpreadsheet className="mr-2 h-4 w-4" />
              Iniciar Solicitud
            </Button>
          </div>
        </div>
      </main>
      
      
    </div>
  );
};

export default ProspectDetails;
