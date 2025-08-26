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
  onFinalizeINVC: () => void;
}

export const INVCStickySummary: React.FC<INVCStickySummaryProps> = ({ onFinalize, onFinalizeINVC }) => {
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

  // Get person's name (prioritize observed, fallback to declared)
  const personName = invcData.observado.datosPersonales?.nombre || invcData.declarado.datosPersonales.nombre;

  return (
    <Card className="mb-6 border-primary/20 bg-card">
      <div className="p-4 space-y-4">
        {/* Person Name with Status */}
        {personName && (
          <div className="border-b border-border pb-3">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-semibold text-foreground truncate" title={personName}>
                  {personName}
                </h3>
                <p className="text-xs text-muted-foreground">Investigación en progreso</p>
              </div>
              <Badge className={
                invcData.estado === 'completado' 
                  ? "bg-emerald-500 text-white" 
                  : "bg-amber-500 text-white"
              }>
                {invcData.estado === 'completado' ? 'Completado' : 'Pendiente'}
              </Badge>
            </div>
          </div>
        )}

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">Progreso de investigación</span>
            <span className="text-xs font-medium">{progressPercentage}%</span>
          </div>
          <Progress value={progressPercentage} className="h-1" />
        </div>

        {/* Offline Status */}
        {isOffline && (
          <div className="flex justify-center">
            <Badge variant="destructive" className="text-xs">
              <WifiOff className="w-3 h-3 mr-1" />
              Sin conexión
            </Badge>
          </div>
        )}
        
        {/* Finalize INVC Button */}
        <Button 
          onClick={onFinalizeINVC}
          variant="default"
          size="lg"
          disabled={progressPercentage < 100}
          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <CheckCircle className="w-4 h-4 mr-2" />
          Finalizar INVC
        </Button>

        {/* Location and Discrepancies Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Location Panel */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              <span className="text-sm font-medium">Verificación de Ubicación</span>
            </div>
            {geoLoading ? (
              <p className="text-xs text-muted-foreground">Verificando ubicación...</p>
            ) : isAtLocation === true ? (
              <div className="p-2 bg-green-50 dark:bg-green-900/20 rounded border border-green-200 dark:border-green-800">
                <div className="flex items-center gap-2 text-green-800 dark:text-green-200">
                  <CheckCircle className="w-3 h-3" />
                  <span className="text-xs font-medium">
                    Estás en la ubicación registrada del negocio
                  </span>
                </div>
              </div>
            ) : isAtLocation === false ? (
              <p className="text-xs text-muted-foreground">
                No estás en la ubicación del negocio
              </p>
            ) : (
              <p className="text-xs text-muted-foreground">
                Permisos de ubicación denegados
              </p>
            )}
          </div>

          {/* Discrepancies Panel */}
          <div className="space-y-2">
            {invcData.diffs.length > 0 && (
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                <span className="text-sm font-medium">Discrepancias:</span>
                <Badge className="bg-orange-500 text-white text-xs">
                  {invcData.diffs.length}
                </Badge>
              </div>
            )}
          </div>
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