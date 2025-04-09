
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/layout/Header';
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
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 container py-6 space-y-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="card-hover" onClick={() => navigate('/prospects')}>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                Prospectos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">48</p>
              <p className="text-muted-foreground text-sm">Prospectos activos</p>
            </CardContent>
          </Card>
          
          <Card className="card-hover" onClick={() => navigate('/applications')}>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <FileSpreadsheet className="h-5 w-5 text-primary" />
                Solicitudes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">23</p>
              <p className="text-muted-foreground text-sm">Solicitudes pendientes</p>
            </CardContent>
          </Card>
          
          <Card className="card-hover" onClick={() => navigate('/alerts')}>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-primary" />
                Alertas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">7</p>
              <p className="text-muted-foreground text-sm">Alertas sin revisar</p>
            </CardContent>
          </Card>
          
          <Card className="card-hover">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <BarChart className="h-5 w-5 text-primary" />
                Rendimiento
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">85%</p>
              <p className="text-muted-foreground text-sm">Tasa de aprobación</p>
            </CardContent>
          </Card>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Solicitudes recientes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {[
                  { name: 'Ana García', product: 'Crédito Personal', status: 'pending' },
                  { name: 'Carlos López', product: 'Hipoteca', status: 'approved' },
                  { name: 'María Rodríguez', product: 'Crédito Auto', status: 'pending' }
                ].map((item, index) => (
                  <div 
                    key={index} 
                    className="flex justify-between items-center p-3 border rounded-md"
                  >
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-muted-foreground">{item.product}</p>
                    </div>
                    <div>
                      <span 
                        className={`text-xs px-2 py-1 rounded-full ${
                          item.status === 'approved' 
                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                            : 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200'
                        }`}
                      >
                        {item.status === 'approved' ? 'Aprobado' : 'Pendiente'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              <Button 
                variant="outline" 
                className="w-full mt-4"
                onClick={() => navigate('/applications')}
              >
                Ver todas las solicitudes
              </Button>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Prospectos por contactar</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {[
                  { name: 'Juan Pérez', source: 'Sitio Web', priority: 'high' },
                  { name: 'Laura Martínez', source: 'Sucursal', priority: 'medium' },
                  { name: 'Roberto Díaz', source: 'Referencia', priority: 'high' }
                ].map((item, index) => (
                  <div 
                    key={index} 
                    className="flex justify-between items-center p-3 border rounded-md"
                  >
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-muted-foreground">{item.source}</p>
                    </div>
                    <div>
                      <span 
                        className={`text-xs px-2 py-1 rounded-full ${
                          item.priority === 'high' 
                            ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' 
                            : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                        }`}
                      >
                        {item.priority === 'high' ? 'Alta' : 'Media'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              <Button 
                variant="outline" 
                className="w-full mt-4"
                onClick={() => navigate('/prospects')}
              >
                Ver todos los prospectos
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
      
      <footer className="border-t py-6">
        <div className="container flex flex-col sm:flex-row justify-between items-center">
          <p className="text-sm text-muted-foreground">© 2025 CreditFlow</p>
          <div className="flex items-center gap-4 mt-4 sm:mt-0">
            <Button variant="ghost" size="sm">Ayuda</Button>
            <Button variant="ghost" size="sm">Términos</Button>
            <Button variant="ghost" size="sm">Privacidad</Button>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
