import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { AuthorizationRequest, AuthorizationAction } from '@/types/authorization';
import { RotateCcw, X, Upload } from 'lucide-react';

interface ReturnFormProps {
  request: AuthorizationRequest;
  onSubmit: (action: AuthorizationAction) => void;
  onCancel: () => void;
}

export const ReturnForm: React.FC<ReturnFormProps> = ({
  request,
  onSubmit,
  onCancel
}) => {
  const [reason, setReason] = useState('');
  const [attachments, setAttachments] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setAttachments(Array.from(e.target.files));
    }
  };

  const handleSubmit = async () => {
    if (!reason.trim()) return;

    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    const action: AuthorizationAction = {
      type: 'return',
      comment: reason,
      attachments: attachments.length > 0 ? attachments : undefined,
      timestamp: new Date().toISOString(),
      userId: 'current-user-id',
      userRole: 'manager'
    };

    onSubmit(action);
  };

  return (
    <Card className="border-amber-200">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-amber-700">
          <RotateCcw className="h-5 w-5" />
          Devolver Expediente
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Request Info */}
        <div className="p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <span className="text-muted-foreground">Solicitante:</span>
              <p className="font-medium">{request.applicantName}</p>
            </div>
            <div>
              <span className="text-muted-foreground">ID:</span>
              <p className="font-medium">{request.id}</p>
            </div>
          </div>
        </div>

        {/* Reason */}
        <div className="space-y-2">
          <label className="text-sm font-medium">
            Motivo de devolución *
          </label>
          <Textarea
            placeholder="Especifique claramente qué debe corregir el agente antes de reenviar la solicitud..."
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            rows={4}
            className="resize-none"
          />
          <p className="text-xs text-muted-foreground">
            Sea específico para facilitar las correcciones del agente
          </p>
        </div>

        {/* Attachments */}
        <div className="space-y-2">
          <label className="text-sm font-medium">
            Adjuntos de soporte (opcional)
          </label>
          <div className="border-2 border-dashed rounded-lg p-4">
            <Input
              type="file"
              multiple
              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
              onChange={handleFileChange}
              className="hidden"
              id="attachments"
            />
            <label
              htmlFor="attachments"
              className="cursor-pointer flex flex-col items-center gap-2"
            >
              <Upload className="h-8 w-8 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                Click para adjuntar archivos
              </span>
            </label>
          </div>
          
          {attachments.length > 0 && (
            <div className="space-y-1">
              <p className="text-sm font-medium">Archivos seleccionados:</p>
              {attachments.map((file, index) => (
                <p key={index} className="text-xs text-muted-foreground">
                  • {file.name} ({(file.size / 1024).toFixed(1)} KB)
                </p>
              ))}
            </div>
          )}
        </div>

        {/* Warning */}
        <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200">
          <p className="text-sm text-red-800 dark:text-red-200">
            ⚠️ <strong>Importante:</strong> Al devolver, el expediente regresará al agente con estado 
            "Devuelta para corrección". El agente deberá hacer las correcciones y reenviar.
          </p>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <Button
            onClick={handleSubmit}
            disabled={reason.trim().length < 10 || isSubmitting}
            variant="destructive"
            className="flex-1"
          >
            {isSubmitting ? 'Procesando...' : 'Confirmar Devolución'}
          </Button>
          <Button
            onClick={onCancel}
            variant="outline"
            disabled={isSubmitting}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};