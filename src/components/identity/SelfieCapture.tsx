import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Camera, RotateCcw, User, Loader2 } from 'lucide-react';
import { useCamera } from '@/hooks/useCamera';
import { validateSelfieImage } from '@/utils/dpiExtraction';

interface SelfieCaptureProps {
  onCapture: (imageData: string) => void;
  onRetry: () => void;
  capturedImage?: string;
}

const SelfieCapture: React.FC<SelfieCaptureProps> = ({
  onCapture,
  onRetry,
  capturedImage
}) => {
  const [showPreview, setShowPreview] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [isValidating, setIsValidating] = useState(false);
  const [validationMessage, setValidationMessage] = useState<string>('');
  const [countdown, setCountdown] = useState<number | null>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);

  const {
    isOpen,
    isLoading,
    error,
    hasPermission,
    isVideoReady,
    videoRef,
    requestPermission,
    capture,
    closeCamera
  } = useCamera('user');

  useEffect(() => {
    if (capturedImage) {
      setShowPreview(true);
      setPreviewImage(capturedImage);
    }
  }, [capturedImage]);

  const handleStartCamera = async () => {
    setIsCameraActive(true);
    const success = await requestPermission();
    if (!success) {
      setIsCameraActive(false);
    }
  };

  const handleStartCountdown = () => {
    setCountdown(3);
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev === 1) {
          clearInterval(timer);
          handleCapture();
          return null;
        }
        return prev ? prev - 1 : null;
      });
    }, 1000);
  };

  const handleCapture = async () => {
    const imageData = capture();
    if (!imageData) return;

    setPreviewImage(imageData);
    setShowPreview(true);
    setIsValidating(true);

    // Validar selfie
    const validation = validateSelfieImage(imageData);
    
    setTimeout(() => {
      setIsValidating(false);
      if (validation.isValid) {
        setValidationMessage('Escaneo facial completado correctamente');
      } else {
        setValidationMessage(validation.message || 'No se detectó tu rostro claramente, intenta de nuevo');
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
    setCountdown(null);
    onRetry();
  };

  if (showPreview && previewImage) {
    return (
      <div className="max-w-md mx-auto space-y-6">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-lg">Escaneo Facial</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="relative">
              <img 
                src={previewImage} 
                alt="Selfie Preview" 
                className="w-full rounded-lg border"
              />
              {isValidating && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-lg">
                  <div className="text-white text-center">
                    <div className="animate-spin w-6 h-6 border-2 border-white border-t-transparent rounded-full mx-auto mb-2"></div>
                    <p className="text-sm">Validando rostro...</p>
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
                <User className="h-4 w-4" />
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
              Confirmar Escaneo
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
          <CardTitle className="text-lg">Escaneo Facial</CardTitle>
          <p className="text-sm text-muted-foreground">
            {!isCameraActive 
              ? "Prepárate para tomar tu selfie de verificación" 
              : "Coloca tu rostro dentro del óvalo y mantente quieto"
            }
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          {!isCameraActive ? (
            <div className="text-center space-y-4">
              <div 
                className="mx-auto aspect-[3/4] w-full max-w-xs bg-muted rounded-lg flex items-center justify-center border-2 border-dashed border-muted-foreground/30 cursor-pointer hover:border-primary/50 transition-colors"
                onClick={handleStartCamera}
              >
                <div className="text-center">
                  <User className="h-16 w-16 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">Toca para activar cámara</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                Usaremos tu cámara frontal para verificar tu identidad
              </p>
              <Button onClick={handleStartCamera} disabled={isLoading} size="lg" className="w-full">
                <Camera className="h-4 w-4 mr-2" />
                {isLoading ? 'Activando cámara...' : 'Iniciar Escaneo Facial'}
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {isLoading || !isVideoReady ? (
                <div className="aspect-[3/4] w-full bg-muted rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">Cargando cámara...</p>
                  </div>
                </div>
              ) : (
                <div className="relative">
                  <div className="aspect-[3/4] w-full overflow-hidden rounded-lg bg-black">
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      muted
                      className="w-full h-full object-cover scale-x-[-1]"
                    />
                  </div>
                  
                  {/* Óvalo guía para selfie - solo se muestra cuando la cámara está lista */}
                  {isVideoReady && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div className="w-56 h-72 border-4 border-white rounded-full opacity-90 shadow-lg">
                        <div className="w-full h-full border-4 border-dashed border-primary/80 rounded-full animate-pulse"></div>
                      </div>
                    </div>
                  )}
                  
                  {countdown && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-56 h-72 rounded-full bg-black/60 flex items-center justify-center">
                        <div className="text-white text-6xl font-bold animate-pulse">
                          {countdown}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
              
              <div className="text-center space-y-2">
                <p className="text-sm text-muted-foreground">
                  {isVideoReady 
                    ? "Centra tu rostro en el óvalo y presiona el botón" 
                    : "Preparando cámara frontal..."
                  }
                </p>
                
                <Button 
                  onClick={handleStartCountdown} 
                  className="w-full" 
                  size="lg"
                  disabled={countdown !== null || !isVideoReady}
                >
                  <Camera className="h-4 w-4 mr-2" />
                  {countdown ? `Escaneando en ${countdown}...` : 'Capturar Rostro'}
                </Button>
              </div>
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

export default SelfieCapture;