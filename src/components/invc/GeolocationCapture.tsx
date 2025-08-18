import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Camera, MapPin, CheckCircle, AlertCircle, RotateCcw } from 'lucide-react';
import { useCamera } from '@/hooks/useCamera';
import { useGeolocation } from '@/hooks/useGeolocation';
import { useINVC } from '@/context/INVCContext';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';

interface GeolocationCaptureProps {
  type: 'negocio' | 'solicitante';
  title: string;
  targetLocation?: { lat: number; lng: number };
  toleranceMeters?: number;
}

export const GeolocationCapture: React.FC<GeolocationCaptureProps> = ({
  type,
  title,
  targetLocation,
  toleranceMeters = 10
}) => {
  const { invcData, updateObservedData } = useINVC();
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);
  
  const { videoRef, requestPermission, capture, closeCamera, isOpen: cameraIsOpen } = useCamera('environment');
  const { getCurrentPosition, isWithinTolerance, calculateDistance, isLoading: geoLoading } = useGeolocation();

  const existingPhoto = invcData?.evidencias.fotosNuevas[type];
  const isPhotoValid = existingPhoto && (
    type === 'negocio' ? invcData?.fotometria.negocio_ok : invcData?.fotometria.solicitante_ok
  );

  const getDistance = () => {
    if (!existingPhoto || !targetLocation) return null;
    return calculateDistance(
      existingPhoto.geotag.lat,
      existingPhoto.geotag.lng,
      targetLocation.lat,
      targetLocation.lng
    );
  };

  const distance = getDistance();

  const handleOpenCamera = async () => {
    try {
      await requestPermission();
      setIsCameraOpen(true);
    } catch (error) {
      console.error('Error accessing camera:', error);
    }
  };

  const handleCapturePhoto = async () => {
    setIsCapturing(true);
    
    try {
      // Capturar foto
      const photoData = capture();
      if (!photoData) {
        throw new Error('No se pudo capturar la foto');
      }

      // Obtener ubicación actual
      const coordinates = await getCurrentPosition();
      
      // Crear objeto de foto con geotag
      const newPhoto = {
        url: photoData,
        geotag: coordinates,
        timestamp: new Date().toISOString()
      };

      // Validar distancia si hay ubicación objetivo
      let isLocationValid = true;
      let calculatedDistance = 0;
      
      if (targetLocation) {
        calculatedDistance = calculateDistance(
          coordinates.lat,
          coordinates.lng,
          targetLocation.lat,
          targetLocation.lng
        );
        isLocationValid = calculatedDistance <= toleranceMeters;
      }

      // Actualizar datos en el contexto
      const updatedEvidencias = {
        ...invcData?.evidencias,
        fotosNuevas: {
          ...invcData?.evidencias.fotosNuevas,
          [type]: newPhoto
        }
      };

      const updatedFotometria = {
        ...invcData?.fotometria,
        [`${type}_ok`]: isLocationValid,
        geo_ok: invcData?.fotometria.negocio_ok && invcData?.fotometria.solicitante_ok && isLocationValid,
        [`distancia_${type}`]: calculatedDistance
      };

      updateObservedData('evidencias', updatedEvidencias);
      updateObservedData('fotometria', updatedFotometria);

      closeCamera();
      setIsCameraOpen(false);
      
    } catch (error) {
      console.error('Error capturing photo with geolocation:', error);
    } finally {
      setIsCapturing(false);
    }
  };

  const handleRetakePhoto = () => {
    // Limpiar foto existente
    const updatedEvidencias = {
      ...invcData?.evidencias,
      fotosNuevas: {
        ...invcData?.evidencias.fotosNuevas,
        [type]: undefined
      }
    };

    const updatedFotometria = {
      ...invcData?.fotometria,
      [`${type}_ok`]: false,
      geo_ok: false
    };

    updateObservedData('evidencias', updatedEvidencias);
    updateObservedData('fotometria', updatedFotometria);
    
    handleOpenCamera();
  };


  return (
    <>
      <Card className={`p-4 ${
        isPhotoValid ? 'border-green-500 bg-green-50 dark:bg-green-900/20' :
        existingPhoto && !isPhotoValid ? 'border-red-500 bg-red-50 dark:bg-red-900/20' :
        'border-border'
      }`}>
        <div className="mb-3">
          <h4 className="font-medium">{title}</h4>
        </div>

        {existingPhoto ? (
          <div className="space-y-3">
            <img 
              src={existingPhoto.url} 
              alt={`Foto de ${type}`}
              className="w-full h-48 object-cover rounded-lg"
            />
            
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <span>
                  Lat: {existingPhoto.geotag.lat.toFixed(6)}, 
                  Lng: {existingPhoto.geotag.lng.toFixed(6)}
                </span>
              </div>
              
              {distance !== null && (
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">Distancia al objetivo:</span>
                  <span className={`font-medium ${distance <= toleranceMeters ? 'text-green-600' : 'text-red-600'}`}>
                    {Math.round(distance)}m
                  </span>
                </div>
              )}
              
              <div className="text-xs text-muted-foreground">
                Precisión: ±{Math.round(existingPhoto.geotag.accuracy)}m
              </div>
            </div>

            <Button
              variant="outline"
              onClick={handleRetakePhoto}
              className="w-full"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Tomar nueva foto
            </Button>
          </div>
        ) : (
          <Button
            onClick={handleOpenCamera}
            className="w-full h-32"
            variant="outline"
          >
            <div className="text-center">
              <Camera className="w-8 h-8 mx-auto mb-2" />
              <span>Capturar {title}</span>
              <div className="text-xs text-muted-foreground mt-1">
                Con geolocalización
              </div>
            </div>
          </Button>
        )}
      </Card>

      {/* Camera Sheet */}
      <Sheet open={isCameraOpen} onOpenChange={() => {
        setIsCameraOpen(false);
        closeCamera();
      }}>
        <SheetContent side="bottom" className="h-[90vh]">
          <SheetHeader>
            <SheetTitle>Capturar {title}</SheetTitle>
          </SheetHeader>

          <div className="mt-6 space-y-4">
            {cameraIsOpen && (
              <div className="relative">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  className="w-full h-80 object-cover rounded-lg bg-black"
                />
                <div className="absolute inset-0 border-2 border-white/50 rounded-lg pointer-events-none">
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <div className="w-20 h-20 border-2 border-white rounded-full"></div>
                  </div>
                </div>
                
                {/* Ubicación requerida */}
                {targetLocation && (
                  <div className="absolute top-4 left-4 right-4">
                    <Card className="p-2 bg-black/70 text-white border-white/20">
                      <div className="flex items-center gap-2 text-sm">
                        <MapPin className="w-4 h-4" />
                        <span>Verificar ubicación (±{toleranceMeters}m)</span>
                      </div>
                    </Card>
                  </div>
                )}
              </div>
            )}

            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => {
                  setIsCameraOpen(false);
                  closeCamera();
                }}
                className="flex-1"
              >
                Cancelar
              </Button>
              <Button
                onClick={handleCapturePhoto}
                disabled={!cameraIsOpen || isCapturing || geoLoading}
                className="flex-1"
              >
                {isCapturing || geoLoading ? (
                  'Capturando...'
                ) : (
                  <>
                    <Camera className="w-4 h-4 mr-2" />
                    Capturar
                  </>
                )}
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
};