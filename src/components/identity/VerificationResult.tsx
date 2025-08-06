import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, User, Calendar, MapPin, CreditCard } from 'lucide-react';
import { IdentityData } from '@/types/identity';
import { useAppState } from '@/context/AppStateContext';
import { evaluatePrequalification } from '@/utils/prequalificationEngine';
import { useToast } from '@/hooks/use-toast';

interface VerificationResultProps {
  identityData: IdentityData;
  onContinue: () => void;
  onRetry: () => void;
}

const VerificationResult: React.FC<VerificationResultProps> = ({
  identityData,
  onContinue,
  onRetry
}) => {
  const navigate = useNavigate();
  const { addApplicationFromKYC, addAlert } = useAppState();
  const { toast } = useToast();

  const handleContinueWithApplication = () => {
    // Create application from KYC data
    const applicationId = addApplicationFromKYC(identityData);
    
    // Mock prequalification data based on identity
    const prequalificationData = {
      nombre_completo: `${identityData.firstName} ${identityData.lastName}`,
      dpi: identityData.cui,
      telefono: "50212345678", // Mock phone
      monto_solicitado: 25000, // Mock amount
      ingreso_mensual: 8000,
      destino_credito: "personal",
      historial: "bueno",
      relacion_monto_ingreso: 0.3,
      actividad_economica: "comercio"
    };

    // Run prequalification
    const prequalificationResult = evaluatePrequalification(prequalificationData);
    
    // Add notification about prequalification result
    addAlert({
      id: Date.now(),
      title: "Precalificación completada",
      description: `Estado: ${prequalificationResult.status === 'green' ? 'Aprobado' : 
                           prequalificationResult.status === 'yellow' ? 'Candidato a revisión' : 'Rechazado'}`,
      date: new Date().toISOString(),
      read: false,
      group: 'today'
    });

    // Navigate based on prequalification result
    if (prequalificationResult.status === 'yellow' || prequalificationResult.status === 'green') {
      // Verde y Amarillo: ir directo al formulario oficial
      navigate('/applications/oficial/new', {
        state: { 
          applicationId,
          identityData,
          prequalificationResult
        }
      });
    } else {
      // Rojo: mostrar resultado y regresar a aplicaciones
      toast({
        title: "Solicitud no aprobada",
        description: prequalificationResult.reason,
        variant: "destructive"
      });
      navigate('/applications');
    }
  };

  return (
    <div className="max-w-md mx-auto space-y-6">
      <Card>
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-green-100 flex items-center justify-center">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <CardTitle className="text-xl text-green-700">Verificación Exitosa</CardTitle>
          <p className="text-sm text-muted-foreground">
            Tu identidad ha sido verificada correctamente
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
              Datos Extraídos
            </h3>
            
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                <User className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-medium text-sm">Nombre Completo</p>
                  <p className="text-sm text-muted-foreground">
                    {identityData.firstName} {identityData.lastName}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                <CreditCard className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-medium text-sm">CUI</p>
                  <p className="text-sm text-muted-foreground font-mono">
                    {identityData.cui}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                <Calendar className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-medium text-sm">Fecha de Nacimiento</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(identityData.birthDate).toLocaleDateString('es-GT', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                <MapPin className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-medium text-sm">Dirección</p>
                  <p className="text-sm text-muted-foreground">
                    {identityData.address}
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <p className="text-sm text-blue-700">
              <strong>Información:</strong> Estos datos serán utilizados para prellenar tu solicitud de crédito. Podrás editarlos si es necesario.
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-3">
        <Button 
          onClick={handleContinueWithApplication}
          className="w-full"
          size="lg"
        >
          Continuar con Solicitud
        </Button>
        
        <Button 
          onClick={onRetry}
          variant="outline"
          className="w-full"
        >
          Verificar de Nuevo
        </Button>
      </div>
    </div>
  );
};

export default VerificationResult;