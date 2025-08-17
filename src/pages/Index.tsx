
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/layout/Header';
import BottomNavigation from '@/components/layout/BottomNavigation';
import PrequalificationModal from '@/components/prequalification/PrequalificationModal';
import FormTypeSelectionModal from '@/components/modals/FormTypeSelectionModal';
import MonthlyGoalCard from '@/components/dashboard/MonthlyGoalCard';
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
        
        {/* Monthly Goal Section */}
        <MonthlyGoalCard />
        
        {/* Metrics Grid 2x2 */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          {/* Active Applications */}
          <Card className="h-24">
            <CardContent className="p-4">
              <div className="flex items-center gap-3 h-full">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                  <TrendingUp className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-muted-foreground font-medium">Activas</p>
                  <p className="text-xl font-bold leading-none">24</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Approved Applications */}
          <Card className="h-24">
            <CardContent className="p-4">
              <div className="flex items-center gap-3 h-full">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-500/10">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-muted-foreground font-medium">Aprobadas</p>
                  <p className="text-xl font-bold leading-none">12</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Pending Applications */}
          <Card className="h-24">
            <CardContent className="p-4">
              <div className="flex items-center gap-3 h-full">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-500/10">
                  <Clock className="h-5 w-5 text-amber-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-muted-foreground font-medium">Pendientes</p>
                  <p className="text-xl font-bold leading-none">8</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Observed Applications */}
          <Card className="h-24">
            <CardContent className="p-4">
              <div className="flex items-center gap-3 h-full">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-500/10">
                  <AlertCircle className="h-5 w-5 text-red-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-muted-foreground font-medium">Observadas</p>
                  <p className="text-xl font-bold leading-none">4</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="bg-background rounded-lg p-6 hover:bg-accent/50 transition-colors cursor-pointer" onClick={handleCreateNewApplication}>
          <div className="text-center mb-4">
            <h3 className="text-2xl font-bold mb-2">Nueva Solicitud</h3>
            <p className="text-muted-foreground">Crear una nueva solicitud de crédito</p>
          </div>
          <Button className="w-full" size="lg">
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
