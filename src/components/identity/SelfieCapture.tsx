import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Camera, RotateCcw, Check, AlertCircle, Loader2 } from 'lucide-react';
import { useCamera } from '@/hooks/useCamera';
import { validateSelfieImage } from '@/utils/dpiExtraction';

interface SelfieCaptureProps {
  onCapture: (imageData: string) => void;
  onRetry: () => void;
  capturedImage?: string;
}

const SelfieCapture: React.FC<SelfieCaptureProps> = ({ onCapture, onRetry, capturedImage }) => {
  const [showPreview, setShowPreview] = useState(false);
  const [validation, setValidation] = useState<{ isValid: boolean; message?: string; confidence?: number } | null>(null);
  const [countdown, setCountdown] = useState(0);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [isVideoReady, setIsVideoReady] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  
  const { 
    isOpen, 
    isLoading, 
    error, 
    hasPermission, 
    isVideoReady: cameraVideoReady,
    videoRef, 
    requestPermission, 
    capture, 
    closeCamera 
  } = useCamera('user'); // Force front camera

  // Update local isVideoReady state when camera is ready
  useEffect(() => {
    setIsVideoReady(cameraVideoReady);
  }, [cameraVideoReady]);

  const handleStartCamera = async () => {
    try {
      setIsCameraActive(true);
      await requestPermission();
    } catch (error) {
      console.error('Error starting camera:', error);
      setIsCameraActive(false);
    }
  };

  const handleCapture = async () => {
    if (countdown > 0) return;
    
    setCountdown(3);
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          performCapture();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const performCapture = async () => {
    const imageData = capture();
    if (!imageData) return;

    // Close camera
    closeCamera();
    setIsCameraActive(false);
    setIsVideoReady(false);

    // Store captured image locally
    setPreviewImage(imageData);

    // Validate the captured image
    const validationResult = validateSelfieImage(imageData);
    setValidation({
      isValid: validationResult.isValid,
      message: validationResult.message || 'Selfie procesada',
      confidence: 0.8
    });
    
    // Show preview
    setShowPreview(true);
  };

  // Show preview with captured image
  if (showPreview && (previewImage || capturedImage)) {
    const imageToShow = previewImage || capturedImage;
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
            {validation?.isValid ? (
              <Check className="h-8 w-8 text-green-600" />
            ) : (
              <AlertCircle className="h-8 w-8 text-amber-600" />
            )}
          </div>
          <CardTitle>
            {validation?.isValid ? 'Selfie Válida' : 'Verificar Selfie'}
          </CardTitle>
          <CardDescription>
            {validation?.message || 'Revisa la imagen capturada'}
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div className="relative mx-auto max-w-xs">
            <img 
              src={imageToShow} 
              alt="Selfie capturada" 
              className="w-full h-auto rounded-lg border-2 border-border scale-x-[-1]"
            />
          </div>
          
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              className="flex-1"
              onClick={() => {
                setShowPreview(false);
                setValidation(null);
                setPreviewImage(null);
                onRetry();
              }}
            >
              <RotateCcw className="mr-2 h-4 w-4" />
              Repetir
            </Button>
            <Button 
              className="flex-1"
              onClick={() => onCapture(imageToShow!)}
              disabled={validation && !validation.isValid}
            >
              <Check className="mr-2 h-4 w-4" />
              Confirmar
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Initial state - invitation to start scanning
  if (!isCameraActive) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
            <Camera className="h-8 w-8 text-primary" />
          </div>
          <CardTitle>Escaneo Facial</CardTitle>
          <CardDescription>
            Posiciona tu rostro dentro del marco para verificar tu identidad
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Camera placeholder frame */}
          <div 
            className="relative mx-auto w-64 h-80 bg-muted rounded-xl border-2 border-dashed border-muted-foreground/30 flex items-center justify-center cursor-pointer hover:border-primary/50 transition-colors"
            onClick={handleStartCamera}
          >
            <div className="text-center">
              <Camera className="h-12 w-12 text-muted-foreground/50 mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">Toca para activar cámara</p>
            </div>
          </div>
          
          <Button 
            className="w-full" 
            onClick={handleStartCamera}
          >
            <Camera className="mr-2 h-4 w-4" />
            Iniciar escaneo facial
          </Button>
        </CardContent>
      </Card>
    );
  }

  // Camera active state
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
          <Camera className="h-8 w-8 text-primary" />
        </div>
        <CardTitle>Captura tu selfie</CardTitle>
        <CardDescription>
          Centra tu rostro en el óvalo y mantén una buena iluminación
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="relative mx-auto w-64 h-80 rounded-xl overflow-hidden bg-black">
          {/* Video element - always rendered when camera is active */}
          <video
            ref={videoRef}
            className="w-full h-full object-cover scale-x-[-1]"
            autoPlay
            playsInline
            muted
            style={{ display: isCameraActive ? 'block' : 'none' }}
          />
          
          {/* Loading overlay */}
          {(!isVideoReady || isLoading) && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <div className="text-center text-white">
                <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2" />
                <p className="text-sm">Cargando cámara...</p>
              </div>
            </div>
          )}
          
          {/* Oval guide overlay - only show when video is ready */}
          {isVideoReady && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-48 h-60 border-4 border-white border-dashed rounded-full opacity-80"></div>
            </div>
          )}
          
          {/* Error overlay */}
          {error && (
            <div className="absolute inset-0 bg-red-500/50 flex items-center justify-center">
              <div className="text-center text-white">
                <AlertCircle className="h-8 w-8 mx-auto mb-2" />
                <p className="text-sm">Error de cámara</p>
              </div>
            </div>
          )}
        </div>
        
        {/* Action buttons */}
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            className="flex-1"
            onClick={() => {
              closeCamera();
              setIsCameraActive(false);
              setIsVideoReady(false);
            }}
          >
            Cancelar
          </Button>
          <Button 
            className="flex-1"
            onClick={handleCapture}
            disabled={!isVideoReady || countdown > 0}
          >
            {countdown > 0 ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {countdown}
              </>
            ) : (
              <>
                <Camera className="mr-2 h-4 w-4" />
                Capturar
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default SelfieCapture;