import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Camera, MapPin, Check, AlertTriangle } from 'lucide-react';
import { useCamera } from '@/hooks/useCamera';
import { getCurrentPosition, validateGeotag } from '@/utils/geo';
import { useToast } from '@/hooks/use-toast';
import { GeoLocation } from '@/types/invc';

interface PhotoEvidenceCardProps {
  title: string;
  subtitle?: string;
  onPhotoCapture: (photoUrl: string, geoTag?: GeoLocation) => void;
  expectedLocation?: GeoLocation;
  isRequired?: boolean;
  className?: string;
}

export default function PhotoEvidenceCard({
  title,
  subtitle,
  onPhotoCapture,
  expectedLocation,
  isRequired = false,
  className
}: PhotoEvidenceCardProps) {
  const [isCapturing, setIsCapturing] = useState(false);
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);
  const [geoTag, setGeoTag] = useState<GeoLocation | null>(null);
  const [geoValid, setGeoValid] = useState<boolean | null>(null);
  
  const { videoRef, requestPermission, capture, closeCamera } = useCamera();
  const { toast } = useToast();

  const handleStartCapture = async () => {
    try {
      setIsCapturing(true);
      await requestPermission();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error de cámara",
        description: "No se pudo acceder a la cámara. Verifica los permisos."
      });
      setIsCapturing(false);
    }
  };

  const handleTakePhoto = async () => {
    try {
      // Capture photo
      const photoUrl = await capture();
      if (!photoUrl) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "No se pudo capturar la foto"
        });
        return;
      }

      // Get geolocation
      let currentGeoTag: GeoLocation | undefined;
      let isGeoValid = false;

      try {
        const position = await getCurrentPosition();
        currentGeoTag = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy
        };

        // Validate geotag if expected location is provided
        if (expectedLocation) {
          isGeoValid = validateGeotag(currentGeoTag, expectedLocation);
        } else {
          isGeoValid = true; // No validation needed
        }

        setGeoTag(currentGeoTag);
        setGeoValid(isGeoValid);
      } catch (geoError) {
        console.warn('Could not get geolocation:', geoError);
        toast({
          variant: "warning",
          title: "Geolocalización no disponible",
          description: "La foto se guardará sin geotag"
        });
      }

      setCapturedPhoto(photoUrl);
      setIsCapturing(false);
      closeCamera();

      // Notify parent component
      onPhotoCapture(photoUrl, currentGeoTag);

      toast({
        variant: "success",
        title: "Foto capturada",
        description: isGeoValid ? "Con geotag válido" : "Sin validación de ubicación"
      });

    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Error al capturar la foto"
      });
    }
  };

  const handleRetake = () => {
    setCapturedPhoto(null);
    setGeoTag(null);
    setGeoValid(null);
    handleStartCapture();
  };

  const getGeoStatusBadge = () => {
    if (!geoTag) return null;
    
    if (geoValid === true) {
      return (
        <Badge variant="outline" className="bg-success/10 text-success border-success">
          <MapPin className="h-3 w-3 mr-1" />
          Geotag válido
        </Badge>
      );
    } else if (geoValid === false) {
      return (
        <Badge variant="outline" className="bg-destructive/10 text-destructive border-destructive">
          <AlertTriangle className="h-3 w-3 mr-1" />
          Ubicación incorrecta
        </Badge>
      );
    }

    return (
      <Badge variant="secondary">
        <MapPin className="h-3 w-3 mr-1" />
        Sin validar
      </Badge>
    );
  };

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-base">{title}</CardTitle>
            {subtitle && (
              <p className="text-sm text-muted-foreground">{subtitle}</p>
            )}
          </div>
          {capturedPhoto && (
            <Badge variant="outline" className="bg-success/10 text-success border-success">
              <Check className="h-3 w-3 mr-1" />
              Completado
            </Badge>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        {isCapturing ? (
          <div className="space-y-3">
            <video
              ref={videoRef}
              className="w-full aspect-video bg-muted rounded-lg"
              autoPlay
              muted
              playsInline
            />
            <div className="flex gap-2">
              <Button onClick={handleTakePhoto} className="flex-1">
                <Camera className="h-4 w-4 mr-2" />
                Capturar
              </Button>
              <Button variant="outline" onClick={() => {
                setIsCapturing(false);
                closeCamera();
              }}>
                Cancelar
              </Button>
            </div>
          </div>
        ) : capturedPhoto ? (
          <div className="space-y-3">
            <img 
              src={capturedPhoto} 
              alt="Foto capturada" 
              className="w-full aspect-video object-cover rounded-lg"
            />
            <div className="flex items-center justify-between">
              {getGeoStatusBadge()}
              <Button variant="outline" size="sm" onClick={handleRetake}>
                Rehacer
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-between py-2">
            <Button onClick={handleStartCapture} variant="outline" size="sm">
              <Camera className="h-4 w-4 mr-2" />
              Capturar foto
            </Button>
            {isRequired && (
              <Badge variant="secondary" className="text-xs">
                Requerido
              </Badge>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}