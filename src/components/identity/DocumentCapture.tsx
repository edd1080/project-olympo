import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Camera, RotateCcw, FlipHorizontal, CheckCircle } from 'lucide-react';
import { useCamera } from '@/hooks/useCamera';
import { validateDPIImage } from '@/utils/dpiExtraction';

interface DocumentCaptureProps {
  documentType: 'front' | 'back';
  onCapture: (imageData: string) => void;
  onRetry: () => void;
  capturedImage?: string;
}

const DocumentCapture: React.FC<DocumentCaptureProps> = ({
  documentType,
  onCapture,
  onRetry,
  capturedImage
}) => {
  const [showPreview, setShowPreview] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [isValidating, setIsValidating] = useState(false);
  const [validationMessage, setValidationMessage] = useState<string>('');

  const {
    isOpen,
    isLoading,
    error,
    hasPermission,
    videoRef,
    requestPermission,
    switchCamera,
    capture,
    closeCamera
  } = useCamera();

  useEffect(() => {
    if (capturedImage) {
      setShowPreview(true);
      setPreviewImage(capturedImage);
    }
  }, [capturedImage]);

  const handleStartCamera = async () => {
    await requestPermission();
  };

  const handleCapture = async () => {
    const imageData = capture();
    if (!imageData) return;

    setPreviewImage(imageData);
    setShowPreview(true);
    setIsValidating(true);

    // Validar imagen
    const validation = validateDPIImage(imageData);
    
    setTimeout(() => {
      setIsValidating(false);
      if (validation.isValid) {
        setValidationMessage('Imagen capturada correctamente');
      } else {
        setValidationMessage(validation.message || 'La imagen no es clara, intenta de nuevo');
      }
    }, 1500);
  };

  const handleConfirm = () => {
    if (previewImage) {
      onCapture(previewImage);
      closeCamera();
    }
  };

  const handleRetry = () => {
    setShowPreview(false);
    setPreviewImage(null);
    setValidationMessage('');
    onRetry();
  };

  const documentTitle = documentType === 'front' ? 'DPI - Frente' : 'DPI - Reverso';
  const instruction = documentType === 'front' 
    ? 'Coloca el frente de tu DPI dentro del marco'
    : 'Ahora coloca el reverso de tu DPI dentro del marco';

  if (showPreview && previewImage) {
    return (
      <div className="max-w-md mx-auto space-y-6">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-lg">{documentTitle}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="relative">
              <img 
                src={previewImage} 
                alt="Preview" 
                className="w-full rounded-lg border"
              />
              {isValidating && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-lg">
                  <div className="text-white text-center">
                    <div className="animate-spin w-6 h-6 border-2 border-white border-t-transparent rounded-full mx-auto mb-2"></div>
                    <p className="text-sm">Validando imagen...</p>
                  </div>
                </div>
              )}
            </div>
            
            {validationMessage && (
              <div className={`flex items-center gap-2 p-3 rounded-lg ${
                validationMessage.includes('correctamente') 
                  ? 'bg-green-50 text-green-700 border border-green-200' 
                  : 'bg-red-50 text-red-700 border border-red-200'
              }`}>
                <CheckCircle className="h-4 w-4" />
                <p className="text-sm">{validationMessage}</p>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="space-y-3">
          <Button 
            onClick={handleConfirm}
            className="w-full"
            size="lg"
            disabled={isValidating || !validationMessage.includes('correctamente')}
          >
            Confirmar Imagen
          </Button>
          
          <Button 
            onClick={handleRetry}
            variant="outline"
            className="w-full"
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            Tomar de Nuevo
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto space-y-6">
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-lg">{documentTitle}</CardTitle>
          <p className="text-sm text-muted-foreground">{instruction}</p>
        </CardHeader>
        <CardContent className="space-y-4">
          {!hasPermission ? (
            <div className="text-center space-y-4">
              <div className="mx-auto h-32 w-full bg-muted rounded-lg flex items-center justify-center">
                <Camera className="h-12 w-12 text-muted-foreground" />
              </div>
              <p className="text-sm text-muted-foreground">
                Necesitamos acceso a tu cámara para continuar
              </p>
              <Button onClick={handleStartCamera} disabled={isLoading}>
                {isLoading ? 'Solicitando permisos...' : 'Activar Cámara'}
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="relative">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full rounded-lg"
                />
                <div className="absolute inset-4 border-2 border-white rounded-lg pointer-events-none">
                  <div className="absolute inset-0 border-2 border-dashed border-primary/50 rounded-lg"></div>
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button
                  onClick={() => switchCamera('environment')}
                  variant="outline"
                  size="sm"
                  className="flex-1"
                >
                  <FlipHorizontal className="h-4 w-4 mr-1" />
                  Trasera
                </Button>
                <Button
                  onClick={() => switchCamera('user')}
                  variant="outline"
                  size="sm"
                  className="flex-1"
                >
                  <FlipHorizontal className="h-4 w-4 mr-1" />
                  Frontal
                </Button>
              </div>
              
              <Button onClick={handleCapture} className="w-full" size="lg">
                <Camera className="h-4 w-4 mr-2" />
                Tomar Foto
              </Button>
            </div>
          )}
          
          {error && (
            <div className="bg-red-50 text-red-700 p-3 rounded-lg text-sm">
              {error}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DocumentCapture;