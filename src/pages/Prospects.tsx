
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/layout/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Phone, Mail, Plus, UserPlus, SlidersHorizontal } from 'lucide-react';

const Prospects = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    // Check if user is authenticated
    const authToken = localStorage.getItem('authToken');
    if (!authToken) {
      navigate('/login');
    }
  }, [navigate]);
  
  const prospects = [
    { 
      id: 1, 
      name: 'Juan Pérez', 
      phone: '+52 5512345678', 
      email: 'juan.perez@mail.com', 
      source: 'Sitio Web',
      status: 'new',
      date: '2025-04-05'
    },
    { 
      id: 2, 
      name: 'Laura Martínez', 
      phone: '+52 5587654321', 
      email: 'laura.martinez@mail.com', 
      source: 'Sucursal',
      status: 'contacted',
      date: '2025-04-03'
    },
    { 
      id: 3, 
      name: 'Roberto Díaz', 
      phone: '+52 5598761234', 
      email: 'roberto.diaz@mail.com', 
      source: 'Referencia',
      status: 'interested',
      date: '2025-04-02'
    },
    { 
      id: 4, 
      name: 'Ana García', 
      phone: '+52 5543219876', 
      email: 'ana.garcia@mail.com', 
      source: 'Campaña',
      status: 'not_interested',
      date: '2025-03-28'
    },
    { 
      id: 5, 
      name: 'Carlos López', 
      phone: '+52 5567891234', 
      email: 'carlos.lopez@mail.com', 
      source: 'Sitio Web',
      status: 'new',
      date: '2025-03-25'
    },
  ];

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'new':
        return (
          <span className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 text-xs px-2 py-1 rounded-full">
            Nuevo
          </span>
        );
      case 'contacted':
        return (
          <span className="bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200 text-xs px-2 py-1 rounded-full">
            Contactado
          </span>
        );
      case 'interested':
        return (
          <span className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 text-xs px-2 py-1 rounded-full">
            Interesado
          </span>
        );
      case 'not_interested':
        return (
          <span className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 text-xs px-2 py-1 rounded-full">
            No interesado
          </span>
        );
      default:
        return null;
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 container py-6 space-y-6">
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar prospectos..."
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
            <Button className="flex-1 sm:flex-none">
              <UserPlus className="mr-2 h-4 w-4" />
              Nuevo Prospecto
            </Button>
          </div>
        </div>
        
        <div className="space-y-4">
          {prospects.map((prospect) => (
            <Card key={prospect.id} className="card-hover cursor-pointer">
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <h3 className="font-medium">{prospect.name}</h3>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 text-sm text-muted-foreground">
                      <div className="flex items-center">
                        <Phone className="mr-1 h-3 w-3" />
                        {prospect.phone}
                      </div>
                      <div className="flex items-center">
                        <Mail className="mr-1 h-3 w-3" />
                        {prospect.email}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 pt-1">
                      <span className="text-xs text-muted-foreground">
                        Fuente: {prospect.source}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        Fecha: {prospect.date}
                      </span>
                    </div>
                  </div>
                  <div>
                    {getStatusBadge(prospect.status)}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="flex justify-center py-4">
          <Button variant="outline">Cargar más</Button>
        </div>
      </main>
    </div>
  );
};

export default Prospects;
