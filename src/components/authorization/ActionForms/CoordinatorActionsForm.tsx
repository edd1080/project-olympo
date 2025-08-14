import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AuthorizationRequest, AuthorizationAction } from '@/types/authorization';
import { Shield, XCircle, X } from 'lucide-react';
import { ConfirmationModal } from '../ConfirmationModal';

interface CoordinatorActionsFormProps {
  request: AuthorizationRequest;
  actionType: 'authorize' | 'reject';
  onSubmit: (action: AuthorizationAction) => void;
  onCancel: () => void;
}

export const CoordinatorActionsForm: React.FC<CoordinatorActionsFormProps> = ({
  request,
  actionType,
  onSubmit,
  onCancel
}) => {
  const [justification, setJustification] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isAuthorizing = actionType === 'authorize';
  const icon = isAuthorizing ? Shield : XCircle;
  const colorClass = isAuthorizing ? 'text-green-700' : 'text-red-700';
  const bgClass = isAuthorizing ? 'bg-green-50 dark:bg-green-900/20' : 'bg-red-50 dark:bg-red-900/20';

  const handleSubmit = () => {
    if (!justification.trim()) return;
    setShowConfirmation(true);
  };

  const handleConfirm = async () => {
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    const action: AuthorizationAction = {
      type: actionType,
      comment: justification,
      timestamp: new Date().toISOString(),
      userId: 'current-user-id',
      userRole: 'coordinator'
    };

    onSubmit(action);
  };

  return (
    <>
      <Card className={isAuthorizing ? 'border-green-200' : 'border-red-200'}>
        <CardHeader className="pb-3">
          <CardTitle className={`flex items-center gap-2 ${colorClass}`}>
            {React.createElement(icon, { className: 'h-5 w-5' })}
            {isAuthorizing ? 'Autorizar Crédito' : 'Rechazar Crédito'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Request Summary */}
          <div className={`p-3 rounded-lg ${bgClass}`}>
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

          {/* Manager Recommendation */}
          {request.managerRecommendation && (
            <div className="p-3 bg-secondary/50 rounded-lg">
              <p className="text-sm font-medium">Recomendación del Gerente:</p>
              <p className={`text-sm ${request.managerRecommendation.type === 'recommend' ? 'text-green-600' : 'text-red-600'}`}>
                {request.managerRecommendation.type === 'recommend' ? '✓ Recomendado' : '✗ No Recomendado'}
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                {request.managerRecommendation.reason}
              </p>
            </div>
          )}

          {/* Justification */}
          <div className="space-y-2">
            <label className="text-sm font-medium">
              Justificación de la decisión *
            </label>
            <Textarea
              placeholder={`Explique las razones por las cuales ${isAuthorizing ? 'autoriza' : 'rechaza'} este crédito...`}
              value={justification}
              onChange={(e) => setJustification(e.target.value)}
              rows={4}
              className="resize-none"
            />
            <p className="text-xs text-muted-foreground">
              Esta justificación será registrada para auditoría
            </p>
          </div>

          {/* Warning */}
          <div className={`p-3 rounded-lg border ${isAuthorizing ? 'bg-green-50 dark:bg-green-900/20 border-green-200' : 'bg-red-50 dark:bg-red-900/20 border-red-200'}`}>
            <p className={`text-sm ${isAuthorizing ? 'text-green-800 dark:text-green-200' : 'text-red-800 dark:text-red-200'}`}>
              <strong>Decisión final:</strong> {isAuthorizing 
                ? 'Al autorizar, se generará la orden de desembolso y el crédito será aprobado definitivamente.' 
                : 'Al rechazar, el crédito será marcado como rechazado definitivamente y no podrá ser procesado.'
              }
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <Button
              onClick={handleSubmit}
              disabled={justification.trim().length < 20}
              className="flex-1"
              variant={isAuthorizing ? 'default' : 'destructive'}
            >
              {isAuthorizing ? 'Autorizar' : 'Rechazar'}
            </Button>
            <Button
              onClick={onCancel}
              variant="outline"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Confirmation Modal */}
      {showConfirmation && (
        <ConfirmationModal
          title={`Confirmar ${isAuthorizing ? 'Autorización' : 'Rechazo'}`}
          message={`¿Confirma que desea ${isAuthorizing ? 'autorizar' : 'rechazar'} el crédito de Q${request.amount.toLocaleString()} para ${request.applicantName}?`}
          confirmText={isAuthorizing ? 'Autorizar' : 'Rechazar'}
          confirmVariant={isAuthorizing ? 'default' : 'destructive'}
          isLoading={isSubmitting}
          onConfirm={handleConfirm}
          onCancel={() => setShowConfirmation(false)}
        />
      )}
    </>
  );
};