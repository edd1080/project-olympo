
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Camera, Upload, RefreshCw, Save } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface SignatureSectionProps {
  formData: any;
  updateFormData: (field: string, value: any) => void;
}

const SignatureSection: React.FC<SignatureSectionProps> = ({ formData, updateFormData }) => {
  const { toast } = useToast();
  const [isCapturing, setIsCapturing] = useState(false);
  const [signatureImage, setSignatureImage] = useState(formData.signatureImage || null);
  const [meetingPhoto, setMeetingPhoto] = useState(formData.meetingPhoto || null);
  
  const handleCaptureSignature = () => {
    // En una implementación real, esto activaría una captura de firma
    setIsCapturing(true);
    
    // Simulación: después de 1.5 segundos, crear una imagen simulada
    setTimeout(() => {
      const mockSignature = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAASwAAAEsCAYAAAB5fY51AAAACXBIWXMAAA7EAAAOxAGVKw4bAAADmUlEQVR4nO3dMW7bQBRFUdpwkT1k/wsJ2UkKFynSOASCAJmZN++9c7rBBa9+IGl9fn19DYCEX94DAPYSLCAlWEBKsICUYAEpwQJSggWkBAtICRaQEiwgJVhASrCAlGABKcECUoIFpAQLSAkWkBIsICVYQEqwgJRgASnBAlKCBaQEC0gJFpASLCAlWEBKsICUYAEpwQJSggWkBAtICRaQEiwgJVhASrCAlGABKcECUoIFpAQLSAkWkBIsICVYQEqwgJRgASnBAlKCBaQEC0gJFpASLCAlWEBKsICUYAEpwQJSggWkBAtICRaQEiwgJVhASrCAlGABKcECUoIFpAQLSAkWkBIsICVYQEqwgJRgASnBAlKCBaQEC0gJFpASLCAlWEBKsICUYAEpwQJSggWkBAtICRaQEiwgJVhASrCAlGABKcECUoIFpAQLSAkWkBIsICVYQEqwgJRgASnBAlKCBaQEC0gJFpASLCAlWEBKsICUYAEpwQJSggWkBAtICRaQEiwgJVhASrCAlGABKcECUoIFpAQLSAkWkBIsICVYQEqwgJRgASnBAlKCBaQEC0gJFpASLCAlWEBKsICUYAEpwQJSggWkBAtICRaQEiwgJVhASrCA1G/vAZzfx8fHmHPuet7Hx8flnru15zNZ9a5nOBrPYd7GHATL4W54N7sIlnO/vHt/zeCdw6cFy8HPbNVZCZazf7Hu+9GPvxJ+U0c+47rne97tPZ9hjOd9boj4443fY4w/Y4yf3kOAq/lnjHE/7nHZsSVYwOu5V7CAl2ABKcECUoIFpAQLSAkWkBIsICVYQEqwgJRgASnBAlKCBaQEC0gJFpASLCAlWEBKsICUYAEpwQJSggWkBAtICRaQEiwgJVhASrCAlGABKcECUoIFpAQLSAkWkBIsICVYQEqwgJRgASnBAlKCBaQEC0gJFpASLCAlWEBKsICUYAEpwQJSggWkBAtICRaQEiwgJVhASrCAlGABKcECUoIFpAQLSAkWkBIsICVYQEqwgJRgASnBAlKCBaQEC0gJFpASLCAlWEBKsICUYAEpwQJSggWkBAtICRaQEiwgJVhASrCAlGABKcECUoIFpAQLSAkWkBIsICVYQEqwgJRgASnBAlKCBaQEC0gJFpASLCAlWEBKsICUYAEpwQJSggWkBAtICRaQEiwgJVhASrCAlGABKcECUoIFpAQLSAkWkBIsICVYQEqwgJRgASnBAlKCBaQEC0gJFpASLCAlWEBKsICUYAEpwQJS/wFUXge6YRhRugAAAABJRU5ErkJggg==';
      
      setSignatureImage(mockSignature);
      updateFormData('signatureImage', mockSignature);
      setIsCapturing(false);
      
      toast({
        title: 'Firma capturada',
        description: 'La firma ha sido guardada exitosamente',
      });
    }, 1500);
  };
  
  const handleCaptureMeetingPhoto = () => {
    // Simulación de captura de foto
    setTimeout(() => {
      const mockPhoto = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAASwAAAEsCAYAAAB5fY51AAAACXBIWXMAAA7EAAAOxAGVKw4bAAADtklEQVR4nO3dsWrbUBiG4Z+U3kA2T9Lc/5JaD8HQ3EAvIRlKnUTn/O87z7MZDvzDh9CJ9fn5OQB0fnsPANhLsICUYAEpwQJSggWkBAtICRaQEiwgJVhASrCAlGABKcECUoIFpAQLSAkWkBIsICVYQEqwgJRgASnBAlKCBaQEC0gJFpASLCAlWEBKsICUYAEpwQJSggWkBAtICRaQEiwgJVhASrCAlGABKcECUoIFpAQLSAkWkBIsICVYQEqwgJRgASnBAlKCBaQEC0gJFpASLCAlWEBKsICUYAEpwQJSggWkBAtICRaQEiwgJVhASrCAlGABKcECUoIFpAQLSAkWkBIsICVYQEqwgJRgASnBAlKCBaQEC0gJFpASLCAlWEBKsICUYAEpwQJSggWkBAtICRaQEiwgJVhASrCAlGABKcECUoIFpAQLSAkWkBIsICVYQEqwgJRgASnBAlKCBaQEC0gJFpASLCAlWEBKsICUYAEpwQJSggWkBAtICRaQEiwgJVhASrCAlGABKcECUoIFpAQLSAkWkBIsICVYQEqwgJRgASnBAlKCBaQEC0gJFpASLCAlWEDqj/eA6/v4+Bhzzl3P+/j4uNxzt/Z8Jqve9QxH4zncc8SvBcvhbng3uwiWc7+8e3/N4J3DpwXLwc9s1VkJlrN/se772Y/fEn5TRz7juud73u09n2GM53xsiPiXTbCO5wrvZdb5CNbBXOXdzDrvbc55M+c8vIcA1/PLjp9gASnBAlKCBaQEC0gJFpASLCAlWEBKsICUYAEpwQJSggWkBAtICRaQEiwgJVhASrCAlGABKcECUoIFpAQLSAkWkBIsICVYQEqwgJRgASnBAlKCBaQEC0gJFpASLCAlWEBKsICUYAEpwQJSggWkBAtICRaQEiwgJVhASrCAlGABKcECUoIFpAQLSAkWkBIsICVYQEqwgJRgASnBAlKCBaQEC0gJFpASLCAlWEBKsICUYAEpwQJSggWkBAtICRaQEiwgJVhASrCAlGABKcECUoIFpAQLSAkWkBIsICVYQEqwgJRgASnBAlKCBaQEC0gJFpASLCAlWEBKsICUYAEpwQJSggWkBAtICRaQEiwgJVhASrCAlGABKcECUoIFpAQLSAkWkBIsICVYQEqwgJRgASnBAlKCBaQEC0gJFpASLCAlWEBKsICUYAEpwQJSggWkBAtICRaQEiwgJVhASrCAlGABKcECUoIFpAQLSAkWkPoPLqoKoUMaC/QAAAAASUVORK5CYII=';
      
      setMeetingPhoto(mockPhoto);
      updateFormData('meetingPhoto', mockPhoto);
      
      toast({
        title: 'Fotografía capturada',
        description: 'La fotografía de la reunión ha sido guardada exitosamente',
      });
    }, 1500);
  };
  
  const handleSaveActa = () => {
    if (!signatureImage || !meetingPhoto) {
      toast({
        title: 'Información incompleta',
        description: 'Se requiere la firma y la fotografía de la reunión',
        variant: 'destructive'
      });
      return;
    }
    
    toast({
      title: 'Acta guardada',
      description: 'El acta ha sido guardada exitosamente',
    });
  };
  
  return (
    <Card className="border-0 shadow-none">
      <CardContent className="p-0 space-y-6">
        <h3 className="font-semibold text-lg">Firma de Acta</h3>
        <p className="text-muted-foreground text-sm">
          Completa la firma del acta y sube la fotografía de la reunión.
        </p>
        
        <div className="space-y-6">
          <div>
            <h4 className="text-base font-medium mb-2">Firma del Solicitante</h4>
            <div className="border rounded-md p-4 bg-muted/20">
              {signatureImage ? (
                <div className="flex flex-col items-center gap-4">
                  <div className="relative w-full max-w-md h-40 border rounded-md overflow-hidden">
                    <img 
                      src={signatureImage} 
                      alt="Firma" 
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <Button variant="outline" onClick={handleCaptureSignature}>
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Volver a firmar
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-4">
                  <div className="border border-dashed rounded-md p-8 w-full text-center bg-muted/10">
                    <p className="text-muted-foreground mb-4">No hay firma capturada</p>
                    <Button onClick={handleCaptureSignature} disabled={isCapturing}>
                      {isCapturing ? (
                        <>
                          <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                          Capturando...
                        </>
                      ) : (
                        <>
                          <Camera className="mr-2 h-4 w-4" />
                          Capturar firma
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          <Separator />
          
          <div>
            <h4 className="text-base font-medium mb-2">Fotografía de la Reunión</h4>
            <div className="border rounded-md p-4 bg-muted/20">
              {meetingPhoto ? (
                <div className="flex flex-col items-center gap-4">
                  <div className="relative w-full max-w-md h-40 border rounded-md overflow-hidden">
                    <img 
                      src={meetingPhoto} 
                      alt="Reunión" 
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <Button variant="outline" onClick={handleCaptureMeetingPhoto}>
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Capturar otra vez
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-4">
                  <div className="border border-dashed rounded-md p-8 w-full text-center bg-muted/10">
                    <p className="text-muted-foreground mb-4">No hay fotografía capturada</p>
                    <Button onClick={handleCaptureMeetingPhoto}>
                      <Camera className="mr-2 h-4 w-4" />
                      Capturar fotografía
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          <Separator />
          
          <div>
            <h4 className="text-base font-medium mb-2">Comentarios adicionales</h4>
            <div className="space-y-2">
              <Label htmlFor="actaComments">Observaciones</Label>
              <Input 
                id="actaComments" 
                value={formData.actaComments || ''} 
                onChange={(e) => updateFormData('actaComments', e.target.value)} 
                placeholder="Observaciones adicionales sobre el acta..."
              />
            </div>
          </div>
          
          <div className="pt-4">
            <Button onClick={handleSaveActa} className="w-full sm:w-auto">
              <Save className="mr-2 h-4 w-4" />
              Guardar Acta
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SignatureSection;
