import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/layout/Header';
import BottomNavigation from '@/components/layout/BottomNavigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  DollarSign, 
  Settings, 
  Bell, 
  Shield, 
  LogOut,
  TrendingUp,
  Calendar,
  FileText
} from 'lucide-react';
import { useUser } from '@/context/UserContext';

const ManagerSettings = () => {
  const navigate = useNavigate();
  const { user, logout } = useUser();

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      navigate('/login');
      return;
    }
  }, [navigate]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const settingsSections = [
    {
      title: 'Gestión de Equipo',
      items: [
        { 
          icon: Users, 
          label: 'Agentes Asignados', 
          value: '8 agentes activos',
          action: () => console.log('Gestionar agentes')
        },
        { 
          icon: TrendingUp, 
          label: 'Métricas del Equipo', 
          value: 'Ver rendimiento',
          action: () => console.log('Ver métricas')
        }
      ]
    },
    {
      title: 'Límites y Autorizaciones',
      items: [
        { 
          icon: DollarSign, 
          label: 'Límite de Autorización', 
          value: 'Q500,000 mensual',
          action: () => console.log('Configurar límites')
        },
        { 
          icon: Shield, 
          label: 'Políticas de Crédito', 
          value: 'Configurar',
          action: () => console.log('Configurar políticas')
        }
      ]
    },
    {
      title: 'Reportes y Análisis',
      items: [
        { 
          icon: FileText, 
          label: 'Reportes Mensuales', 
          value: 'Generar reporte',
          action: () => console.log('Generar reportes')
        },
        { 
          icon: Calendar, 
          label: 'Programar Reportes', 
          value: 'Automatizar',
          action: () => console.log('Programar reportes')
        }
      ]
    },
    {
      title: 'Configuración Personal',
      items: [
        { 
          icon: Bell, 
          label: 'Notificaciones', 
          value: 'Configurar alertas',
          action: () => console.log('Configurar notificaciones')
        },
        { 
          icon: Settings, 
          label: 'Preferencias', 
          value: 'Personalizar interfaz',
          action: () => console.log('Configurar preferencias')
        }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="mobile-container py-6">
        <div className="mb-6">
          <h1 className="text-title mb-2">Configuración Gerencial</h1>
          <p className="text-muted-foreground">
            Administra tu equipo, límites y configuraciones del sistema.
          </p>
        </div>

        {/* User Info Card */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg">{user?.name}</CardTitle>
                <p className="text-sm text-muted-foreground">{user?.email}</p>
              </div>
              <Badge variant="default">Gerente</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                ID: {user?.id}
              </div>
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleLogout}
                className="flex items-center gap-2"
              >
                <LogOut className="h-4 w-4" />
                Cerrar Sesión
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Settings Sections */}
        <div className="space-y-6">
          {settingsSections.map((section, sectionIndex) => (
            <div key={sectionIndex}>
              <h3 className="text-section-title mb-3">{section.title}</h3>
              <Card>
                <CardContent className="p-0">
                  {section.items.map((item, itemIndex) => (
                    <div 
                      key={itemIndex}
                      className={`
                        flex items-center justify-between p-4 cursor-pointer 
                        hover:bg-muted/50 transition-colors
                        ${itemIndex !== section.items.length - 1 ? 'border-b' : ''}
                      `}
                      onClick={item.action}
                    >
                      <div className="flex items-center gap-3">
                        <item.icon className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <p className="font-medium">{item.label}</p>
                          <p className="text-sm text-muted-foreground">{item.value}</p>
                        </div>
                      </div>
                      <div className="text-muted-foreground">
                        →
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-lg">Acciones Rápidas</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button 
              variant="outline" 
              className="w-full justify-start"
              onClick={() => navigate('/manager/authorizations')}
            >
              <DollarSign className="h-4 w-4 mr-2" />
              Ver Autorizaciones Pendientes
            </Button>
            <Button 
              variant="outline" 
              className="w-full justify-start"
              onClick={() => navigate('/manager/invc')}
            >
              <Users className="h-4 w-4 mr-2" />
              Supervisar Investigaciones
            </Button>
            <Button 
              variant="outline" 
              className="w-full justify-start"
              onClick={() => console.log('Generar reporte rápido')}
            >
              <FileText className="h-4 w-4 mr-2" />
              Generar Reporte del Día
            </Button>
          </CardContent>
        </Card>
      </main>
      
      <BottomNavigation />
    </div>
  );
};

export default ManagerSettings;