
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/layout/Header';
import BottomNavigation from '@/components/layout/BottomNavigation';
import PrequalificationModal from '@/components/prequalification/PrequalificationModal';
import FormTypeSelectionModal from '@/components/modals/FormTypeSelectionModal';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileSpreadsheet, Users, TrendingUp, CheckCircle, AlertCircle, Clock, Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Index = () => {
  const navigate = useNavigate();
  const [showPrequalificationModal, setShowPrequalificationModal] = useState(false);
  const [showFormTypeModal, setShowFormTypeModal] = useState(false);

  useEffect(() => {
    // Check if user is authenticated
    const authToken = localStorage.getItem('authToken');
    if (!authToken) {
      navigate('/login');
    }
  }, [navigate]);

  const handleCreateNewApplication = () => {
    setShowFormTypeModal(true);
  };

  const handleFormTypeSelection = (type: 'legacy' | 'oficial') => {
    setShowFormTypeModal(false);
    if (type === 'legacy') {
      navigate('/applications/new');
    } else {
      navigate('/identity-verification');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1 px-4 py-8 pb-20">
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-2">¡Bienvenido, Carlos!</h1>
          <p className="text-muted-foreground">Asesor de créditos | Agencia Central</p>
        </div>
        
        {/* Metrics Summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col items-center text-center">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 mb-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                </div>
                <p className="text-sm text-muted-foreground">Solicitudes Activas</p>
                <h2 className="text-2xl font-bold">24</h2>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col items-center text-center">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-500/10 mb-2">
                  <Edit className="h-5 w-5 text-blue-500" />
                </div>
                <p className="text-sm text-muted-foreground">Solicitudes en Borrador</p>
                <h2 className="text-2xl font-bold">6</h2>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col items-center text-center">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-500/10 mb-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                </div>
                <p className="text-sm text-muted-foreground">Aprobadas</p>
                <h2 className="text-2xl font-bold">12</h2>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col items-center text-center">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-500/10 mb-2">
                  <Clock className="h-5 w-5 text-amber-500" />
                </div>
                <p className="text-sm text-muted-foreground">Pendientes</p>
                <h2 className="text-2xl font-bold">8</h2>
              </div>
            </CardContent>
          </Card>
          
        </div>
        
        <div className="bg-background rounded-lg p-6 hover:bg-accent/50 transition-colors cursor-pointer" onClick={handleCreateNewApplication}>
          <div className="flex items-center gap-3 mb-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <FileSpreadsheet className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">Nueva Solicitud</h3>
              <p className="text-sm text-muted-foreground">Crear una nueva solicitud de crédito</p>
            </div>
          </div>
          <Button className="w-full">
            <FileSpreadsheet className="mr-2 h-4 w-4" />
            Comenzar solicitud
          </Button>
        </div>
      </main>
      
      <BottomNavigation />
      
      <PrequalificationModal open={showPrequalificationModal} onOpenChange={setShowPrequalificationModal} />
      <FormTypeSelectionModal 
        open={showFormTypeModal} 
        onOpenChange={setShowFormTypeModal}
        onSelectType={handleFormTypeSelection}
      />
    </div>
  );
};

export default Index;
