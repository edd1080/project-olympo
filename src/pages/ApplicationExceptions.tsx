import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Upload, FileText, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useAppState } from '@/context/AppStateContext';

interface ExceptionData {
  comment: string;
  documents: File[];
}

const ApplicationExceptions: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const { addAlert } = useAppState();
  
  const applicationId = location.state?.applicationId;
  const prequalificationResult = location.state?.prequalificationResult;
  
  const [exceptionData, setExceptionData] = useState<ExceptionData>({
    comment: '',
    documents: []
  });

  const handleDocumentUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setExceptionData(prev => ({
      ...prev,
      documents: [...prev.documents, ...files]
    }));
  };

  const removeDocument = (index: number) => {
    setExceptionData(prev => ({
      ...prev,
      documents: prev.documents.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = () => {
    if (!exceptionData.comment.trim()) {
      toast({
        title: "Comentario requerido",
        description: "Debes agregar un comentario explicando la excepción",
        variant: "destructive"
      });
      return;
    }

    // Simular procesamiento de excepción
    addAlert({
      id: Date.now(),
      title: "Excepción registrada",
      description: `Se ha registrado la excepción para la solicitud ${applicationId}`,
      date: new Date().toISOString(),
      read: false,
      group: 'today'
    });

    toast({
      title: "Excepción registrada",
      description: "La excepción ha sido enviada para revisión"
    });

    // Navegar al formulario principal
    navigate(`/applications/oficial/new`, {
      state: { 
        applicationId,
        exceptionSubmitted: true
      }
    });
  };

  const handleGoBack = () => {
    navigate('/applications');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 bg-background border-b z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleGoBack}
              className="shrink-0"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            
            <div className="flex-1">
              <h1 className="font-semibold">Justificar Excepción</h1>
              <p className="text-sm text-muted-foreground">
                Candidato a revisión
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <main className="container mx-auto px-4 py-6 max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
              Justificación de Excepción
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Resultado de precalificación */}
            {prequalificationResult && (
              <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
                <p className="text-sm font-medium text-amber-800">
                  Motivo de la excepción:
                </p>
                <p className="text-sm text-amber-700 mt-1">
                  {prequalificationResult.reason}
                </p>
              </div>
            )}

            {/* Comentario */}
            <div className="space-y-2">
              <Label htmlFor="comment">
                Comentario de justificación *
              </Label>
              <Textarea
                id="comment"
                placeholder="Explica las razones por las cuales este caso debe ser considerado a pesar de la precalificación amarilla. Incluye información adicional relevante que pueda influir en la decisión final..."
                value={exceptionData.comment}
                onChange={(e) => setExceptionData(prev => ({ 
                  ...prev, 
                  comment: e.target.value 
                }))}
                rows={6}
                className="resize-none"
              />
            </div>

            {/* Documentos de soporte */}
            <div className="space-y-4">
              <Label>Documentos de soporte</Label>
              
              <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
                <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground mb-2">
                  Adjunta documentos adicionales que respalden tu justificación
                </p>
                <Input
                  type="file"
                  multiple
                  accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                  onChange={handleDocumentUpload}
                  className="hidden"
                  id="document-upload"
                />
                <Label htmlFor="document-upload" className="cursor-pointer">
                  <Button variant="outline" type="button">
                    Seleccionar archivos
                  </Button>
                </Label>
              </div>

              {/* Lista de documentos */}
              {exceptionData.documents.length > 0 && (
                <div className="space-y-2">
                  <p className="text-sm font-medium">
                    Documentos seleccionados:
                  </p>
                  {exceptionData.documents.map((file, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        <span className="text-sm">{file.name}</span>
                        <span className="text-xs text-muted-foreground">
                          ({(file.size / 1024 / 1024).toFixed(1)} MB)
                        </span>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeDocument(index)}
                        className="text-destructive hover:text-destructive"
                      >
                        Eliminar
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Botones de acción */}
            <div className="flex gap-3 pt-4">
              <Button
                variant="outline"
                onClick={handleGoBack}
                className="flex-1"
              >
                Cancelar
              </Button>
              <Button
                onClick={handleSubmit}
                className="flex-1"
                disabled={!exceptionData.comment.trim()}
              >
                Enviar Justificación
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default ApplicationExceptions;