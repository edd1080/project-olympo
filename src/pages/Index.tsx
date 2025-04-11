
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/layout/Header';
import BottomNavigation from '@/components/layout/BottomNavigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileSpreadsheet, Users, TrendingUp, AlertTriangle, Wallet } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Index = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState('Usuario');
  
  useEffect(() => {
    // Check if user is authenticated
    const authToken = localStorage.getItem('authToken');
    if (!authToken) {
      navigate('/login');
    } else {
      // En una aplicación real, obtendrías el nombre del usuario del token o de una API
      const storedUserName = localStorage.getItem('userName');
      if (storedUserName) {
        setUserName(storedUserName);
      } else {
        // Solo para demostración, guardamos un nombre por defecto
        localStorage.setItem('userName', 'Carlos Méndez');
        setUserName('Carlos Méndez');
      }
    }
  }, [navigate]);
  
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1 px-4 py-8 pb-20">
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-1">¡Bienvenido, {userName}!</h1>
          <p className="text-muted-foreground">Gestiona tus solicitudes de crédito de manera eficiente</p>
        </div>
        
        {/* Métricas del Dashboard */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-blue-200 dark:border-blue-800">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
                <TrendingUp className="h-4 w-4 mr-2 text-blue-600 dark:text-blue-400" />
                Solicitudes activas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">24</p>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border-green-200 dark:border-green-800">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
                <Wallet className="h-4 w-4 mr-2 text-green-600 dark:text-green-400" />
                Solicitudes aprobadas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">18</p>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20 border-yellow-200 dark:border-yellow-800">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
                <AlertTriangle className="h-4 w-4 mr-2 text-yellow-600 dark:text-yellow-400" />
                Pendientes de revisión
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">6</p>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 border-purple-200 dark:border-purple-800">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
                <Users className="h-4 w-4 mr-2 text-purple-600 dark:text-purple-400" />
                Prospectos registrados
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">42</p>
            </CardContent>
          </Card>
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
