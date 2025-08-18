import React, { useState, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Camera, MapPin, RotateCcw } from 'lucide-react';
import { useGeolocation } from '@/hooks/useGeolocation';
import { useINVC } from '@/context/INVCContext';

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
  const [isCapturing, setIsCapturing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const { getCurrentPosition, calculateDistance, isLoading: geoLoading } = useGeolocation();

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

  const handleOpenCamera = () => {
    fileInputRef.current?.click();
  };

  const handleFileCapture = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsCapturing(true);
    
    try {
      // Convertir archivo a dataURL
      const reader = new FileReader();
      const dataURL = await new Promise<string>((resolve, reject) => {
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

      // Obtener ubicación actual
      const coordinates = await getCurrentPosition();
      
      // Crear objeto de foto con geotag
      const newPhoto = {
        url: dataURL,
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

      const currentFotometria = invcData?.fotometria || {};
      const updatedFotometria = {
        ...currentFotometria,
        [`${type}_ok`]: isLocationValid,
        [`distancia_${type}`]: calculatedDistance
      } as any;

      // Actualizar geo_ok basado en ambas fotos
      if (type === 'negocio') {
        updatedFotometria.geo_ok = isLocationValid && ((currentFotometria as any).solicitante_ok || false);
      } else {
        updatedFotometria.geo_ok = ((currentFotometria as any).negocio_ok || false) && isLocationValid;
      }

      updateObservedData('evidencias', updatedEvidencias);
      updateObservedData('fotometria', updatedFotometria);
      
    } catch (error) {
      console.error('Error capturing photo with geolocation:', error);
    } finally {
      setIsCapturing(false);
      // Limpiar el input para permitir seleccionar el mismo archivo de nuevo
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
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

    const currentFotometria = invcData?.fotometria || {};
    const updatedFotometria = {
      ...currentFotometria,
      [`${type}_ok`]: false
    } as any;

    // Actualizar geo_ok basado en la otra foto
    if (type === 'negocio') {
      updatedFotometria.geo_ok = false;
    } else {
      updatedFotometria.geo_ok = (currentFotometria as any).negocio_ok && false;
    }

    updateObservedData('evidencias', updatedEvidencias);
    updateObservedData('fotometria', updatedFotometria);
    
    handleOpenCamera();
  };

  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleFileCapture}
        style={{ display: 'none' }}
      />
      
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
              disabled={isCapturing || geoLoading}
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
            disabled={isCapturing || geoLoading}
          >
            <div className="text-center">
              <Camera className="w-8 h-8 mx-auto mb-2" />
              <span>
                {isCapturing || geoLoading ? 'Capturando...' : `Capturar ${title}`}
              </span>
              <div className="text-xs text-muted-foreground mt-1">
                Con geolocalización
              </div>
            </div>
          </Button>
        )}
      </Card>
    </>
  );
};