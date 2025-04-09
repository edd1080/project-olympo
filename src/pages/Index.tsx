
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/layout/Header';
import BottomNavigation from '@/components/layout/BottomNavigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, FileSpreadsheet, Users, AlertCircle } from 'lucide-react';
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
      
      <main className="flex-1 container py-4 pb-20 space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <Card className="card-hover" onClick={() => navigate('/prospects')}>
            <CardHeader className="pb-1 p-3">
              <CardTitle className="text-base flex items-center gap-1.5">
                <Users className="h-4 w-4 text-primary" />
                Prospectos
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0 p-3">
              <p className="text-xl font-bold">48</p>
              <p className="text-muted-foreground text-xs">Prospectos activos</p>
            </CardContent>
          </Card>
          
          <Card className="card-hover" onClick={() => navigate('/applications')}>
            <CardHeader className="pb-1 p-3">
              <CardTitle className="text-base flex items-center gap-1.5">
                <FileSpreadsheet className="h-4 w-4 text-primary" />
                Solicitudes
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0 p-3">
              <p className="text-xl font-bold">23</p>
              <p className="text-muted-foreground text-xs">Solicitudes pendientes</p>
            </CardContent>
          </Card>
          
          <Card className="card-hover" onClick={() => navigate('/alerts')}>
            <CardHeader className="pb-1 p-3">
              <CardTitle className="text-base flex items-center gap-1.5">
                <AlertCircle className="h-4 w-4 text-primary" />
                Alertas
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0 p-3">
              <p className="text-xl font-bold">7</p>
              <p className="text-muted-foreground text-xs">Alertas sin revisar</p>
            </CardContent>
          </Card>
          
          <Card className="card-hover">
            <CardHeader className="pb-1 p-3">
              <CardTitle className="text-base flex items-center gap-1.5">
                <BarChart className="h-4 w-4 text-primary" />
                Rendimiento
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0 p-3">
              <p className="text-xl font-bold">85%</p>
              <p className="text-muted-foreground text-xs">Tasa de aprobación</p>
            </CardContent>
          </Card>
        </div>
        
        <Card className="mt-3">
          <CardHeader className="pb-2 p-4">
            <CardTitle className="text-lg">Solicitudes recientes</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-border">
              {[
                { 
                  id: "BVM_80517963",
                  name: "FERNANDO GOMEZ", 
                  task: "Aceptar contrato", 
                  progress: 36, 
                  status: "active",
                  date: "02/04/2024"
                },
                { 
                  id: "BVM_80517845",
                  name: "MARÍA RODRÍGUEZ", 
                  task: "Verificar identidad", 
                  progress: 65, 
                  status: "pending",
                  date: "01/04/2024"  
                },
                { 
                  id: "BVM_80517722",
                  name: "CARLOS LÓPEZ", 
                  task: "Firmar documentos", 
                  progress: 89, 
                  status: "active",
                  date: "31/03/2024"  
                }
              ].map((item, index) => (
                <div 
                  key={index} 
                  className="p-4 flex flex-col"
                  onClick={() => navigate('/applications')}
                >
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <div className="bg-primary/10 p-3 rounded-full">
                        <div className="h-4 w-4 text-primary">💡</div>
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-semibold">{item.id}</p>
                          <div className="h-2 w-2 rounded-full bg-red-500"></div>
                        </div>
                        <p className="text-primary font-medium">{item.task}</p>
                      </div>
                    </div>
                    <div>
                      <span 
                        className={`text-xs px-3 py-1.5 rounded-md ${
                          item.status === 'active' 
                            ? 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200' 
                            : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                        }`}
                      >
                        {item.status === 'active' ? 'ACTIVO' : 'PENDIENTE'}
                      </span>
                    </div>
                  </div>
                  
                  <div className="mt-3">
                    <div className="flex justify-between mb-1">
                      <span className="text-lg font-semibold">{item.progress}%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2.5">
                      <div 
                        className="bg-green-500 h-2.5 rounded-full" 
                        style={{ width: `${item.progress}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div className="flex justify-between mt-3">
                    <span className="text-base font-bold">{item.name}</span>
                    <span className="text-sm text-muted-foreground">Creado {item.date}</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="px-4 pb-4 pt-2">
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => navigate('/applications')}
              >
                Ver todas las solicitudes
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
      
      <BottomNavigation />
    </div>
  );
};

export default Index;
