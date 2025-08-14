import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, Camera, CheckCircle, AlertCircle, Wifi, WifiOff } from 'lucide-react';
import { useINVC } from '@/context/INVCContext';

interface INVCStickySummaryProps {
  onFinalize: () => void;
}

export const INVCStickySummary: React.FC<INVCStickySummaryProps> = ({ onFinalize }) => {
  const { invcData, validateForFinish, isOffline } = useINVC();

  if (!invcData) return null;

  const validation = validateForFinish();
  const totalSections = 6; // Datos personales, actividad, ingresos, solicitud, fiadores, evidencias
  const completedSections = calculateCompletedSections();
  const progressPercentage = Math.round((completedSections / totalSections) * 100);

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
    <Card className="sticky top-0 z-50 mb-6 border-primary/20 bg-card/95 backdrop-blur-sm">
      <div className="p-3 space-y-3">
        {/* Row 1: Progress and Finalize Button */}
        <div className="flex items-center justify-between">
          {/* Large Progress Badge */}
          <div className="flex items-center gap-3">
            <Badge className="bg-primary text-primary-foreground text-base px-3 py-1.5 font-semibold">
              {progressPercentage}% completado
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

        {/* Row 2: Status Details */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            {/* Geotag Status */}
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              <span className="text-sm font-medium">Geotag:</span>
              <div className="flex gap-1">
                <Badge variant={invcData.fotometria.negocio_ok ? "default" : "secondary"} className="text-xs bg-green-600 text-white">
                  Negocio {invcData.fotometria.negocio_ok ? 'OK' : 'Pendiente'}
                </Badge>
                <Badge variant={invcData.fotometria.solicitante_ok ? "default" : "secondary"} className="text-xs bg-green-600 text-white">
                  Solicitante {invcData.fotometria.solicitante_ok ? 'OK' : 'Pendiente'}
                </Badge>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Photos Status */}
            <div className="flex items-center gap-2">
              <Camera className="w-4 h-4" />
              <span className="text-sm font-medium">Fotos:</span>
              <Badge variant="outline" className="text-xs">
                {Object.keys(invcData.evidencias.fotosNuevas).filter(k => invcData.evidencias.fotosNuevas[k as keyof typeof invcData.evidencias.fotosNuevas]).length}/2
              </Badge>
            </div>
            
            {/* Discrepancies */}
            {invcData.diffs.length > 0 && (
              <Badge className="bg-orange-500 text-white text-xs">
                {invcData.diffs.length} discrepancia{invcData.diffs.length !== 1 ? 's' : ''}
              </Badge>
            )}
          </div>
        </div>

        {/* Validation Errors */}
        {!validation.isValid && validation.blockedReasons.length > 0 && (
          <div className="text-xs text-muted-foreground bg-yellow-50 dark:bg-yellow-900/20 p-2 rounded border border-yellow-200 dark:border-yellow-800">
            <div className="font-medium mb-1 text-yellow-800 dark:text-yellow-200">Pendiente:</div>
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