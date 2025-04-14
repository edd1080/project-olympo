
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/layout/Header';
import BottomNavigation from '@/components/layout/BottomNavigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileSpreadsheet, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Index = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    // Check if user is authenticated
    const authToken = localStorage.getItem('authToken');
    if (!authToken) {
      navigate('/login');
    }
  }, [navigate]);
  
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1 px-4 py-8 pb-20">
        <div className="mb-8">
          <h1 className="text-2xl font-bold mb-2">¡Bienvenido a CreditFlow!</h1>
          <p className="text-muted-foreground">Sistema de gestión de créditos</p>
        </div>
        
        <div className="grid grid-cols-1 gap-6 mb-6">
          <Card className="card-hover" onClick={() => navigate('/applications/new')}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileSpreadsheet className="h-5 w-5 text-primary" />
                Nueva Solicitud
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Crear una nueva solicitud de crédito</p>
              <Button className="mt-4 w-full">
                <FileSpreadsheet className="mr-2 h-4 w-4" />
                Comenzar solicitud
              </Button>
            </CardContent>
          </Card>
          
          <Card className="card-hover" onClick={() => navigate('/prospects')}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                Nuevo Prospecto
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Registrar un nuevo prospecto en el sistema</p>
              <Button className="mt-4 w-full" variant="outline">
                <Users className="mr-2 h-4 w-4" />
                Crear prospecto
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
      
      <BottomNavigation />
    </div>
  );
};

export default Index;
