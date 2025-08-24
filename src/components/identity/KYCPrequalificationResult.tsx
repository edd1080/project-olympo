import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, AlertCircle, XCircle, ArrowRight, UserX, AlertTriangle } from 'lucide-react';
import { PrequalificationResult } from '@/utils/prequalificationEngine';
import { IdentityData } from '@/types/identity';
import { useAppState } from '@/context/AppStateContext';
import { useToast } from '@/hooks/use-toast';

interface KYCPrequalificationResultProps {
  identityData: IdentityData;
  prequalificationResult: PrequalificationResult;
  onContinue: () => void;
  onRetry: () => void;
}

const KYCPrequalificationResult: React.FC<KYCPrequalificationResultProps> = ({
  identityData,
  prequalificationResult,
  onContinue,
  onRetry
}) => {
  const navigate = useNavigate();
  const { addApplicationFromKYC, addCancelledApplicationFromKYC } = useAppState();
  const { toast } = useToast();

  const getStatusIcon = () => {
    switch (prequalificationResult.status) {
      case 'green':
        return <CheckCircle className="h-20 w-20 text-green-500" />;
      case 'yellow':
        return <AlertCircle className="h-20 w-20 text-yellow-500" />;
      case 'red':
        return <XCircle className="h-20 w-20 text-red-500" />;
    }
  };

  const getStatusTitle = () => {
    switch (prequalificationResult.status) {
      case 'green':
        return 'Pre-aprobado';
      case 'yellow':
        return 'Requiere Evaluación Adicional';
      case 'red':
        return 'No Aprobado';
    }
  };

  const getStatusDescription = () => {
    switch (prequalificationResult.status) {
      case 'green':
        return 'El cliente puede continuar con el proceso de solicitud de crédito.';
      case 'yellow':
        return 'Se requiere información adicional. Podrá continuar pero deberá justificar la excepción.';
      case 'red':
        return 'El cliente no cumple con los criterios mínimos. La solicitud será marcada como cancelada.';
    }
  };

  const getStatusColor = () => {
    switch (prequalificationResult.status) {
      case 'green':
        return 'border-green-500 bg-green-50';
      case 'yellow':
        return 'border-yellow-500 bg-yellow-50';
      case 'red':
        return 'border-red-500 bg-red-50';
    }
  };

  const handleContinue = () => {    
    if (prequalificationResult.status === 'green') {
      // Verde: continuar normalmente
      const applicationId = addApplicationFromKYC(identityData);
      navigate('/applications/oficial/new', {
        state: { 
          applicationId,
          identityData,
          prequalificationResult
        }
      });
    } else if (prequalificationResult.status === 'yellow') {
      // Amarillo: continuar con excepción
      const applicationId = addApplicationFromKYC(identityData);
      navigate('/applications/oficial/new', {
        state: { 
          applicationId,
          identityData,
          prequalificationResult,
          requiresException: true
        }
      });
    } else {
      // Rojo: crear aplicación cancelada y volver a aplicaciones
      addCancelledApplicationFromKYC(identityData, prequalificationResult.reason);
      toast({
        title: "Solicitud marcada como cancelada",
        description: "La aplicación ha sido creada con estado cancelado.",
        variant: "destructive"
      });
      navigate('/applications');
    }
  };

  const getActionButton = () => {
    switch (prequalificationResult.status) {
      case 'green':
        return (
          <Button 
            onClick={handleContinue}
            className="w-full bg-green-600 hover:bg-green-700"
            size="lg"
          >
            <ArrowRight className="h-5 w-5 mr-2" />
            Continuar con Solicitud
          </Button>
        );
      case 'yellow':
        return (
          <Button 
            onClick={handleContinue}
            className="w-full bg-yellow-600 hover:bg-yellow-700"
            size="lg"
          >
            <AlertTriangle className="h-5 w-5 mr-2" />
            Continuar con Excepción
          </Button>
        );
      case 'red':
        return (
          <Button 
            onClick={handleContinue}
            variant="destructive"
            className="w-full"
            size="lg"
          >
            <UserX className="h-5 w-5 mr-2" />
            Marcar como Cancelada
          </Button>
        );
    }
  };

  return (
    <div className="max-w-lg mx-auto space-y-6">
      <Card className={`border-2 ${getStatusColor()}`}>
        <CardHeader className="text-center pb-4">
          <div className="flex justify-center mb-4">
            {getStatusIcon()}
          </div>
          <CardTitle className="text-2xl">{getStatusTitle()}</CardTitle>
          <p className="text-muted-foreground mt-2">
            {getStatusDescription()}
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-white/70 p-4 rounded-lg border">
            <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide mb-3">
              Motivo de la Evaluación
            </h4>
            <p className="text-sm font-medium">
              {prequalificationResult.reason}
            </p>
          </div>

          <div className="bg-white/70 p-4 rounded-lg border">
            <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide mb-3">
              Cliente Evaluado
            </h4>
            <div className="space-y-1">
              <p className="font-medium">
                {identityData.firstName} {identityData.lastName}
              </p>
              <p className="text-sm text-muted-foreground font-mono">
                CUI: {identityData.cui}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-3">
        {getActionButton()}
        
        <Button 
          onClick={onRetry}
          variant="outline"
          className="w-full"
        >
          Verificar Identidad de Nuevo
        </Button>
      </div>
    </div>
  );
};

export default KYCPrequalificationResult;