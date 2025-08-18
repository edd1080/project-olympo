import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/layout/Header';

import PrequalificationModal from '@/components/prequalification/PrequalificationModal';

import MonthlyGoalCard from '@/components/dashboard/MonthlyGoalCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileSpreadsheet, TrendingUp, CheckCircle, AlertTriangle, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
const Index = () => {
  const navigate = useNavigate();
  const [showPrequalificationModal, setShowPrequalificationModal] = useState(false);
  
  useEffect(() => {
    // Check if user is authenticated
    const authToken = localStorage.getItem('authToken');
    if (!authToken) {
      navigate('/login');
    }
  }, [navigate]);
  const handleCreateNewApplication = () => {
    navigate('/identity-verification');
  };
  return <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1 px-4 py-8 pb-20">
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-2">¡Bienvenido, Carlos!</h1>
          <p className="text-muted-foreground">Asesor de créditos | Agencia Central</p>
        </div>
        
        {/* Monthly Goal Section */}
        <MonthlyGoalCard />
        
        {/* Symmetric 2x2 Metrics Grid */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          {/* Solicitudes Activas */}
          <Card className="h-32">
            <CardContent className="p-4">
              <div className="flex flex-col justify-center h-full text-center">
                <TrendingUp className="h-6 w-6 text-primary mx-auto mb-2" />
                <p className="text-xs text-muted-foreground mb-1">Activas</p>
                <p className="text-xl font-bold my-1">24</p>
              </div>
            </CardContent>
          </Card>
          
          {/* Solicitudes Aprobadas */}
          <Card className="h-32">
            <CardContent className="p-4">
              <div className="flex flex-col justify-center h-full text-center">
                <CheckCircle className="h-6 w-6 text-green-600 mx-auto mb-2" />
                <p className="text-xs text-muted-foreground mb-1">Aprobadas</p>
                <p className="text-xl font-bold my-1">12</p>
              </div>
            </CardContent>
          </Card>
          
          {/* Solicitudes Pendientes */}
          <Card className="h-32">
            <CardContent className="p-4">
              <div className="flex flex-col justify-center h-full text-center">
                <Clock className="h-6 w-6 text-amber-600 mx-auto mb-2" />
                <p className="text-xs text-muted-foreground mb-1">Pendientes</p>
                <p className="text-xl font-bold my-1">8</p>
              </div>
            </CardContent>
          </Card>
          
          {/* Solicitudes Observadas */}
          <Card className="h-32">
            <CardContent className="p-4">
              <div className="flex flex-col justify-center h-full text-center">
                <AlertTriangle className="h-6 w-6 text-red-600 mx-auto mb-2" />
                <p className="text-xs text-muted-foreground mb-1">Observadas</p>
                <p className="text-xl font-bold my-1">4</p>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="cursor-pointer py-6" onClick={handleCreateNewApplication}>
          <div className="mb-4">
            <h3 className="text-xl font-bold mb-1">Nueva Solicitud</h3>
            <p className="text-muted-foreground">Crear una nueva solicitud de crédito</p>
          </div>
          <Button className="w-full">
            Comenzar solicitud
          </Button>
        </div>
      </main>
      
      
      
      <PrequalificationModal open={showPrequalificationModal} onOpenChange={setShowPrequalificationModal} />
      
    </div>;
};
export default Index;