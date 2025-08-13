import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Camera, Check, X, AlertTriangle } from 'lucide-react';
import { useCamera } from '@/hooks/useCamera';
import type { ComparisonField } from '@/types/invc-comparison';

interface PhotoComparisonProps {
  field: ComparisonField;
  applicationId: string;
  photoType: 'applicant' | 'business' | 'document';
  allowMultiple?: boolean;
}

export const PhotoComparison: React.FC<PhotoComparisonProps> = ({ 
  field, 
  applicationId,
  photoType,
  allowMultiple = false
}) => {
  const [capturedPhotos, setCapturedPhotos] = useState<string[]>([]);
  const { capturePhoto, isCapturing } = useCamera();

  const handleCapturePhoto = async () => {
    try {
      const photoUrl = await capturePhoto();
      if (allowMultiple) {
        setCapturedPhotos(prev => [...prev, photoUrl]);
      } else {
        setCapturedPhotos([photoUrl]);
      }
    } catch (error) {
      console.error('Error capturing photo:', error);
    }
  };

  const getPhotoTypeLabel = () => {
    switch (photoType) {
      case 'applicant': return 'Foto del Solicitante';
      case 'business': return 'Fotos del Negocio';
      case 'document': return 'Foto del Documento';
      default: return 'Fotografía';
    }
  };

  const getDeclaredPhotos = () => {
    // En un caso real, esto vendría de los datos declarados
    if (photoType === 'applicant') {
      return field.declaredValue ? [field.declaredValue] : [];
    }
    return field.declaredValue || [];
  };

  const declaredPhotos = getDeclaredPhotos();
  const hasRequiredPhotos = photoType === 'applicant' ? capturedPhotos.length >= 1 : capturedPhotos.length >= 2;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="text-base">{getPhotoTypeLabel()}</span>
          <Badge variant={field.status === 'pending' ? 'secondary' : 
                        field.status === 'confirmed' ? 'default' : 
                        field.status === 'adjusted' ? 'secondary' : 'destructive'}>
            {field.status === 'pending' && 'Pendiente'}
            {field.status === 'confirmed' && 'Confirmado'}
            {field.status === 'adjusted' && 'Ajustado'}
            {field.status === 'blocked' && 'Bloqueado'}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Fotos Declaradas */}
          <div>
            <h4 className="font-medium text-sm mb-2">Declarado</h4>
            <div className="space-y-2">
              {declaredPhotos.length > 0 ? (
                declaredPhotos.map((photo, index) => (
                  <div key={index} className="border rounded-lg p-2">
                    <img 
                      src={photo} 
                      alt={`Declarada ${index + 1}`}
                      className="w-full h-32 object-cover rounded"
                    />
                  </div>
                ))
              ) : (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                  <p className="text-sm text-muted-foreground">
                    No hay fotos declaradas
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Fotos Observadas */}
          <div>
            <h4 className="font-medium text-sm mb-2">Observado Hoy</h4>
            <div className="space-y-2">
              {capturedPhotos.map((photo, index) => (
                <div key={index} className="border rounded-lg p-2">
                  <img 
                    src={photo} 
                    alt={`Capturada ${index + 1}`}
                    className="w-full h-32 object-cover rounded"
                  />
                </div>
              ))}
              
              <Button
                onClick={handleCapturePhoto}
                disabled={isCapturing}
                variant="outline"
                className="w-full"
              >
                <Camera className="h-4 w-4 mr-2" />
                {isCapturing ? 'Capturando...' : 
                 allowMultiple ? 'Agregar Foto' : 'Capturar Foto'}
              </Button>
            </div>
          </div>
        </div>

        {/* Validaciones */}
        {photoType === 'business' && (
          <div className="text-xs text-muted-foreground">
            Mínimo 2 fotos requeridas: exterior del negocio y productos/servicios
          </div>
        )}

        {/* Estado y Acciones */}
        {capturedPhotos.length > 0 && (
          <div className="flex items-center justify-between pt-4 border-t">
            <div className="flex items-center gap-2">
              {hasRequiredPhotos ? (
                <Check className="h-4 w-4 text-green-600" />
              ) : (
                <AlertTriangle className="h-4 w-4 text-orange-600" />
              )}
              <span className="text-sm">
                {hasRequiredPhotos ? 'Fotos suficientes capturadas' : 'Se requieren más fotos'}
              </span>
            </div>

            {hasRequiredPhotos && field.status === 'pending' && (
              <div className="flex gap-2">
                <Button size="sm" variant="outline">
                  <Check className="h-3 w-3 mr-1" />
                  Confirmar
                </Button>
                <Button size="sm" variant="outline">
                  <X className="h-3 w-3 mr-1" />
                  Ajustar
                </Button>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};