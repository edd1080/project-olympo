import React, { useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { MapPin, Camera, CheckCircle, AlertCircle, WifiOff } from 'lucide-react';
import { useINVC } from '@/context/INVCContext';
import { useGeolocation } from '@/hooks/useGeolocation';

interface INVCStickySummaryProps {
  onFinalize: () => void;
}

export const INVCStickySummary: React.FC<INVCStickySummaryProps> = ({ onFinalize }) => {
  const { invcData, validateForFinish, isOffline } = useINVC();
  const { getCurrentPosition, isWithinTolerance, isLoading: geoLoading } = useGeolocation();
  const [isAtLocation, setIsAtLocation] = React.useState<boolean | null>(null);

  if (!invcData) return null;

  const validation = validateForFinish();
  const totalSections = 6; // Datos personales, actividad, ingresos, solicitud, fiadores, evidencias
  const completedSections = calculateCompletedSections();
  const progressPercentage = Math.round((completedSections / totalSections) * 100);

  // Check geolocation on component mount
  useEffect(() => {
    const checkLocation = async () => {
      try {
        const currentPos = await getCurrentPosition();
        const targetLocation = invcData.declarado.direccionNegocio;
        
        if (targetLocation && targetLocation.lat && targetLocation.lng) {
          const withinTolerance = isWithinTolerance(
            currentPos.lat,
            currentPos.lng,
            targetLocation.lat,
            targetLocation.lng,
            50 // 50 meters tolerance
          );
          setIsAtLocation(withinTolerance);
        }
      } catch (error) {
        console.error('Error checking location:', error);
        setIsAtLocation(false);
      }
    };

    checkLocation();
  }, [getCurrentPosition, isWithinTolerance, invcData.declarado.direccionNegocio]);

  function calculateCompletedSections(): number {
    let completed = 0;
    
    // Datos personales completados si hay datos observados
    if (invcData.observado.datosPersonales) completed++;
    
    // Actividad completada si se verificó
    if (invcData.observado.actividad) completed++;
    
    // Ingresos/egresos completados si están verificados
    if (invcData.observado.ingresos || invcData.observado.egresos) completed++;
    
    // Solicitud completada si está verificada
    if (invcData.observado.producto) completed++;
    
    // Fiadores completados si todos están verificados
    if (invcData.observado.fiadores && invcData.observado.fiadores.length > 0) completed++;
    
    // Evidencias completadas si hay fotos nuevas
    if (invcData.evidencias.fotosNuevas.negocio && invcData.evidencias.fotosNuevas.solicitante) completed++;
    
    return completed;
  }

  return (
    <Card className="mb-6 border-primary/20 bg-card">
      <div className="p-4 space-y-4">
        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Progreso de investigación</span>
            <span className="text-sm font-semibold">{progressPercentage}%</span>
          </div>
          <Progress value={progressPercentage} className="h-2" />
        </div>

        {/* Status and Actions */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Investigation Status */}
            <Badge className={
              invcData.estado === 'completado' 
                ? "bg-emerald-500 text-white" 
                : "bg-amber-500 text-white"
            }>
              {invcData.estado === 'completado' ? 'Completado' : 'Pendiente'}
            </Badge>
            
            {isOffline && (
              <Badge variant="destructive" className="text-xs">
                <WifiOff className="w-3 h-3 mr-1" />
                Sin conexión
              </Badge>
            )}
          </div>
          
          {/* Finalize Button */}
          <Button 
            onClick={onFinalize}
            disabled={!validation.isValid}
            variant={validation.isValid ? "default" : "secondary"}
            size="sm"
            className="min-w-[100px]"
          >
            {validation.isValid ? (
              <>
                <CheckCircle className="w-4 h-4 mr-2" />
                Finalizar
              </>
            ) : (
              <>
                <AlertCircle className="w-4 h-4 mr-2" />
                Pendiente
              </>
            )}
          </Button>
        </div>

        {/* Location Check */}
        {isAtLocation === true && (
          <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
            <div className="flex items-center gap-2 text-green-800 dark:text-green-200">
              <CheckCircle className="w-4 h-4" />
              <span className="text-sm font-medium">
                Se encuentra en la ubicación del negocio registrada por el agente
              </span>
            </div>
          </div>
        )}

        {/* Details Row */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <Camera className="w-4 h-4" />
            <span className="font-medium">Fotos:</span>
            <Badge variant="outline" className="text-xs">
              {Object.keys(invcData.evidencias.fotosNuevas).filter(k => invcData.evidencias.fotosNuevas[k as keyof typeof invcData.evidencias.fotosNuevas]).length}/2
            </Badge>
          </div>
          
          {/* Discrepancies */}
          {invcData.diffs.length > 0 && (
            <div className="flex items-center gap-2">
              <span className="font-medium">Discrepancias:</span>
              <Badge className="bg-orange-500 text-white text-xs">
                {invcData.diffs.length}
              </Badge>
            </div>
          )}
        </div>

        {/* Validation Errors */}
        {!validation.isValid && validation.blockedReasons.length > 0 && (
          <div className="text-xs text-muted-foreground bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded border border-yellow-200 dark:border-yellow-800">
            <div className="font-medium mb-2 text-yellow-800 dark:text-yellow-200">Pendiente:</div>
            <ul className="list-disc list-inside space-y-1">
              {validation.blockedReasons.map((reason, index) => (
                <li key={index}>{reason}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </Card>
  );
};