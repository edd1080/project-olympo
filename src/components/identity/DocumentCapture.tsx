import React, { useState, useRef } from 'react';
import { Camera, RotateCcw, Check, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { validateDPIImage } from '@/utils/dpiExtraction';

interface DocumentCaptureProps {
  documentType: 'dpi-front' | 'dpi-back';
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
  const [previewImage, setPreviewImage] = useState<string | null>(capturedImage || null);
  const [isValidating, setIsValidating] = useState(false);
  const [validationMessage, setValidationMessage] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleCameraClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileCapture = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Convert file to base64
    const reader = new FileReader();
    reader.onload = async (e) => {
      const imageData = e.target?.result as string;
      if (imageData) {
        setPreviewImage(imageData);
        setIsValidating(true);
        
        // Validar la imagen
        const validation = validateDPIImage(imageData);
        setIsValidating(false);
        
        if (!validation.isValid) {
          setValidationMessage(validation.message || 'La imagen no es válida');
        } else {
          setValidationMessage('');
        }
      }
    };
    reader.readAsDataURL(file);
  };

  const handleConfirm = () => {
    if (previewImage) {
      onCapture(previewImage);
    }
  };

  const handleRetry = () => {
    setPreviewImage(null);
    setValidationMessage('');
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    onRetry();
  };

  const getTitle = () => {
    return documentType === 'dpi-front' 
      ? 'Fotografía del frente del DPI' 
      : 'Fotografía de la parte trasera del DPI';
  };

  const getInstructions = () => {
    return documentType === 'dpi-front' 
      ? 'Toca el área de la cámara para tomar la fotografía del frente de tu DPI'
      : 'Toca el área de la cámara para tomar la fotografía de la parte trasera de tu DPI';
  };

  // Si ya hay imagen capturada, mostrar preview
  if (previewImage) {
    return (
      <div className="flex flex-col h-screen bg-background">
        <div className="flex-1 flex flex-col p-4">
          <h2 className="text-xl font-semibold mb-2 text-center">
            {getTitle()}
          </h2>
          <p className="text-sm text-muted-foreground mb-6 text-center">
            Revisa que la imagen se vea clara y legible
          </p>

          <div className="flex-1 flex items-center justify-center mb-6">
            <div className="relative w-full max-w-sm aspect-[3/2] bg-muted rounded-lg overflow-hidden border-2 border-dashed border-muted-foreground/30">
              <img 
                src={previewImage} 
                alt="Vista previa" 
                className="w-full h-full object-cover"
              />
              
              {isValidating && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <div className="flex flex-col items-center space-y-2">
                    <Loader2 className="h-8 w-8 animate-spin text-white" />
                    <span className="text-white text-sm">Validando imagen...</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {validationMessage && (
            <div className="mb-4 p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
              <p className="text-destructive text-sm text-center">{validationMessage}</p>
            </div>
          )}

          <div className="space-y-3">
            <Button 
              onClick={handleConfirm}
              className="w-full"
              disabled={isValidating || !!validationMessage}
            >
              <Check className="mr-2 h-4 w-4" />
              Siguiente
            </Button>
            
            <Button 
              variant="outline" 
              onClick={handleRetry}
              className="w-full"
              disabled={isValidating}
            >
              <RotateCcw className="mr-2 h-4 w-4" />
              Tomar de nuevo
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-background">
      <div className="flex-1 flex flex-col p-4">
        <h2 className="text-xl font-semibold mb-2 text-center">
          {getTitle()}
        </h2>
        <p className="text-sm text-muted-foreground mb-6 text-center">
          {getInstructions()}
        </p>

        <div className="flex-1 flex items-center justify-center mb-6">
          <div 
            className="relative w-full max-w-sm aspect-[3/2] bg-muted rounded-lg border-2 border-dashed border-primary/30 overflow-hidden cursor-pointer hover:border-primary/50 transition-colors"
            onClick={handleCameraClick}
          >
            <div className="absolute inset-0 flex flex-col items-center justify-center space-y-4 p-4">
              <Camera className="h-12 w-12 text-primary" />
              <div className="text-center space-y-2">
                <p className="text-sm font-medium">Toca para tomar foto</p>
                <p className="text-xs text-muted-foreground">
                  Se activará la cámara de tu dispositivo
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <Button onClick={handleCameraClick} className="w-full">
            <Camera className="mr-2 h-4 w-4" />
            Activar Cámara
          </Button>
        </div>
      </div>

      {/* Hidden file input for camera */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleFileCapture}
        className="hidden"
      />
    </div>
  );
};

export default DocumentCapture;