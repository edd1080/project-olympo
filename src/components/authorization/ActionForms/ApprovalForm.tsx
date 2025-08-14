import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AuthorizationRequest, AuthorizationAction } from '@/types/authorization';
import { CheckCircle, X } from 'lucide-react';

interface ApprovalFormProps {
  request: AuthorizationRequest;
  onSubmit: (action: AuthorizationAction) => void;
  onCancel: () => void;
}

export const ApprovalForm: React.FC<ApprovalFormProps> = ({
  request,
  onSubmit,
  onCancel
}) => {
  const [justification, setJustification] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!justification.trim()) return;

    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    const action: AuthorizationAction = {
      type: 'approve',
      comment: justification,
      timestamp: new Date().toISOString(),
      userId: 'current-user-id',
      userRole: 'manager'
    };

    onSubmit(action);
  };

  return (
    <Card className="border-green-200">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-green-700">
          <CheckCircle className="h-5 w-5" />
          Aprobar Desembolso Inmediato
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Approval Details */}
        <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <span className="text-muted-foreground">Solicitante:</span>
              <p className="font-medium">{request.applicantName}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Monto:</span>
              <p className="font-medium">Q{request.amount.toLocaleString()}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Producto:</span>
              <p className="font-medium">{request.product}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Plazo:</span>
              <p className="font-medium">{request.term} meses</p>
            </div>
          </div>
        </div>

        {/* Justification */}
        <div className="space-y-2">
          <label className="text-sm font-medium">
            Justificación de la aprobación *
          </label>
          <Textarea
            placeholder="Explique las razones por las cuales aprueba este crédito..."
            value={justification}
            onChange={(e) => setJustification(e.target.value)}
            rows={4}
            className="resize-none"
          />
          <p className="text-xs text-muted-foreground">
            Mínimo 20 caracteres requeridos para auditoría
          </p>
        </div>

        {/* Warning */}
        <div className="p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200">
          <p className="text-sm text-amber-800 dark:text-amber-200">
            ⚠️ <strong>Importante:</strong> Al aprobar, se generará automáticamente la orden de desembolso 
            y el crédito pasará a estado "Aprobado". Esta acción no se puede deshacer.
          </p>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <Button
            onClick={handleSubmit}
            disabled={justification.trim().length < 20 || isSubmitting}
            className="flex-1"
          >
            {isSubmitting ? 'Procesando...' : 'Confirmar Aprobación'}
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