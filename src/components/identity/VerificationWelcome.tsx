import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, Camera, UserCheck, FileText } from 'lucide-react';

interface VerificationWelcomeProps {
  onStartVerification: () => void;
  onCancel: () => void;
}

const VerificationWelcome: React.FC<VerificationWelcomeProps> = ({
  onStartVerification,
  onCancel
}) => {
  return (
    <div className="max-w-md mx-auto space-y-6">
      <Card>
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
            <Shield className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-xl">Verificación de Identidad</CardTitle>
          <CardDescription>
            Para tu seguridad, necesitamos verificar tu identidad antes de continuar
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-3 rounded-lg border">
              <FileText className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="font-medium text-sm">1. Fotografía tu DPI</p>
                <p className="text-xs text-muted-foreground">Frente y reverso</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-3 rounded-lg border">
              <Camera className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="font-medium text-sm">2. Toma tu selfie</p>
                <p className="text-xs text-muted-foreground">Para verificar tu identidad</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-3 rounded-lg border">
              <UserCheck className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="font-medium text-sm">3. Verificación automática</p>
                <p className="text-xs text-muted-foreground">Procesamos tus datos</p>
              </div>
            </div>
          </div>
          
          <div className="bg-muted/50 p-4 rounded-lg">
            <p className="text-sm text-muted-foreground">
              <strong>Importante:</strong> Asegúrate de estar en un lugar bien iluminado y que tu DPI esté limpio y legible.
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-3">
        <Button 
          onClick={onStartVerification}
          className="w-full"
          size="lg"
        >
          Iniciar Verificación
        </Button>
        
        <Button 
          onClick={onCancel}
          variant="outline"
          className="w-full"
        >
          Cancelar
        </Button>
      </div>
    </div>
  );
};

export default VerificationWelcome;