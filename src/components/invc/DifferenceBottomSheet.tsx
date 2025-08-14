import React, { useState } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Camera, AlertTriangle } from 'lucide-react';
import { useCamera } from '@/hooks/useCamera';

interface DifferenceBottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (comment: string, evidence?: string) => void;
  fieldLabel: string;
  declaredValue: string;
  observedValue: string;
  differencePercentage?: number;
}

export const DifferenceBottomSheet: React.FC<DifferenceBottomSheetProps> = ({
  isOpen,
  onClose,
  onSubmit,
  fieldLabel,
  declaredValue,
  observedValue,
  differencePercentage
}) => {
  const [comment, setComment] = useState('');
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);
  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);
  
  const { videoRef, requestPermission, capture, closeCamera, isOpen: isCameraOpen } = useCamera('environment');

  const handleSubmit = () => {
    if (!comment.trim()) return;
    
    onSubmit(comment.trim(), capturedPhoto || undefined);
    
    // Reset form
    setComment('');
    setCapturedPhoto(null);
    closeCamera();
    onClose();
  };

  const handleTakePhoto = async () => {
    try {
      await requestPermission();
      setIsPhotoModalOpen(true);
    } catch (error) {
      console.error('Error accessing camera:', error);
    }
  };

  const handleCapturePhoto = () => {
    const photo = capture();
    if (photo) {
      setCapturedPhoto(photo);
      closeCamera();
      setIsPhotoModalOpen(false);
    }
  };

  const handleClosePhotoModal = () => {
    setIsPhotoModalOpen(false);
    closeCamera();
  };

  return (
    <>
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent side="bottom" className="h-[90vh]">
          <SheetHeader>
            <SheetTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-orange-500" />
              Discrepancia en {fieldLabel}
            </SheetTitle>
          </SheetHeader>

          <div className="mt-6 space-y-6">
            {/* Comparison Values */}
            <Card className="p-4 bg-orange-50 dark:bg-orange-900/20 border-orange-200">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    Declarado
                  </div>
                  <div className="mt-1 text-lg font-semibold">
                    {declaredValue}
                  </div>
                </div>
                <div>
                  <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    Observado
                  </div>
                  <div className="mt-1 text-lg font-semibold">
                    {observedValue}
                  </div>
                </div>
              </div>
              
              {differencePercentage !== undefined && differencePercentage !== 0 && (
                <div className="mt-3 pt-3 border-t border-orange-200">
                  <Badge variant="secondary" className="text-sm">
                    Diferencia: {differencePercentage > 0 ? '+' : ''}{differencePercentage}%
                  </Badge>
                </div>
              )}
            </Card>

            {/* Comment */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Comentario explicativo *
              </label>
              <Textarea
                placeholder={`Explique la diferencia encontrada en ${fieldLabel.toLowerCase()}...`}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={4}
                className="resize-none"
              />
              <div className="text-xs text-muted-foreground mt-1">
                Requerido para documentar la discrepancia
              </div>
            </div>

            {/* Evidence Photo */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Evidencia fotográfica (opcional)
              </label>
              
              {capturedPhoto ? (
                <div className="space-y-3">
                  <img 
                    src={capturedPhoto} 
                    alt="Evidencia capturada" 
                    className="w-full h-48 object-cover rounded-lg border"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setCapturedPhoto(null)}
                    className="w-full"
                  >
                    Tomar nueva foto
                  </Button>
                </div>
              ) : (
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleTakePhoto}
                  className="w-full h-12"
                >
                  <Camera className="w-4 h-4 mr-2" />
                  Tomar foto de evidencia
                </Button>
              )}
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-4">
              <Button
                variant="outline"
                onClick={onClose}
                className="flex-1"
              >
                Cancelar
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={!comment.trim()}
                className="flex-1"
              >
                Guardar Discrepancia
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Camera Modal */}
      <Sheet open={isPhotoModalOpen} onOpenChange={handleClosePhotoModal}>
        <SheetContent side="bottom" className="h-[90vh]">
          <SheetHeader>
            <SheetTitle>Capturar Evidencia</SheetTitle>
          </SheetHeader>

          <div className="mt-6 space-y-4">
            {isCameraOpen && (
              <div className="relative">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  className="w-full h-64 object-cover rounded-lg bg-black"
                />
                <div className="absolute inset-0 border-2 border-white/50 rounded-lg pointer-events-none"></div>
              </div>
            )}

            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={handleClosePhotoModal}
                className="flex-1"
              >
                Cancelar
              </Button>
              <Button
                onClick={handleCapturePhoto}
                disabled={!isCameraOpen}
                className="flex-1"
              >
                <Camera className="w-4 h-4 mr-2" />
                Capturar
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
};