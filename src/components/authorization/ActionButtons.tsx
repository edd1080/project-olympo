import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { AuthorizationRequest, ValidationResult, AuthorizationAction } from '@/types/authorization';
import { CheckCircle, XCircle, RotateCcw, ThumbsUp, ThumbsDown, Shield } from 'lucide-react';
import { ApprovalForm } from './ActionForms/ApprovalForm';
import { ReturnForm } from './ActionForms/ReturnForm';
import { RecommendationForm } from './ActionForms/RecommendationForm';
import { CoordinatorActionsForm } from './ActionForms/CoordinatorActionsForm';

interface ActionButtonsProps {
  request: AuthorizationRequest;
  validationResult: ValidationResult;
  userRole: string;
  onActionComplete: (action: AuthorizationAction) => void;
}

export const ActionButtons: React.FC<ActionButtonsProps> = ({
  request,
  validationResult,
  userRole,
  onActionComplete
}) => {
  const [activeForm, setActiveForm] = useState<string | null>(null);

  // Don't show actions if validation is not passed
  if (!validationResult.isValid) {
    return (
      <div className="text-center py-4">
        <p className="text-muted-foreground text-sm">
          Complete las validaciones pendientes para habilitar las acciones de autorización
        </p>
      </div>
    );
  }

  const handleFormSubmit = (action: AuthorizationAction) => {
    setActiveForm(null);
    onActionComplete(action);
  };

  const handleFormCancel = () => {
    setActiveForm(null);
  };

  // Manager actions
  if (userRole === 'manager') {
    const canApproveDirectly = request.amount <= 20000;

    return (
      <div className="space-y-3">
        {/* Action Buttons */}
        <div className="grid gap-2">
          {/* Direct approval for amounts <= 20k */}
          {canApproveDirectly && (
            <Button
              onClick={() => setActiveForm('approve')}
              className="w-full"
              size="lg"
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              Aprobar Desembolso Inmediato
            </Button>
          )}

          {/* Recommendation buttons for amounts > 20k */}
          {!canApproveDirectly && (
            <div className="grid grid-cols-2 gap-2">
              <Button
                onClick={() => setActiveForm('recommend')}
                className="w-full"
                size="lg"
              >
                <ThumbsUp className="h-4 w-4 mr-2" />
                Realizar Recomendación
              </Button>
              <Button
                onClick={() => setActiveForm('not_recommend')}
                variant="destructive"
                className="w-full"
                size="lg"
              >
                <ThumbsDown className="h-4 w-4 mr-2" />
                No Recomendar
              </Button>
            </div>
          )}

          {/* Return expediente - always available */}
          <Button
            onClick={() => setActiveForm('return')}
            variant="outline"
            className="w-full"
            size="lg"
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            Devolver Expediente
          </Button>
        </div>

        {/* Show amount-based message */}
        <div className="text-center text-sm text-muted-foreground">
          {canApproveDirectly ? (
            <p>✓ Monto ≤ Q20,000 - Puede aprobar directamente</p>
          ) : (
            <p>⚠️ Monto &gt; Q20,000 - Requiere recomendación a coordinación</p>
          )}
        </div>

        {/* Forms */}
        {activeForm === 'approve' && (
          <ApprovalForm
            request={request}
            onSubmit={handleFormSubmit}
            onCancel={handleFormCancel}
          />
        )}
        {activeForm === 'return' && (
          <ReturnForm
            request={request}
            onSubmit={handleFormSubmit}
            onCancel={handleFormCancel}
          />
        )}
        {(activeForm === 'recommend' || activeForm === 'not_recommend') && (
          <RecommendationForm
            request={request}
            recommendationType={activeForm as 'recommend' | 'not_recommend'}
            onSubmit={handleFormSubmit}
            onCancel={handleFormCancel}
          />
        )}
      </div>
    );
  }

  // Coordinator actions
  if (userRole === 'coordinator') {
    return (
      <div className="space-y-3">
        {/* Show manager recommendation if exists */}
        {request.managerRecommendation && (
          <div className="p-3 bg-secondary/50 rounded-lg">
            <p className="text-sm font-medium">
              Recomendación del Gerente: 
              <span className={`ml-2 ${request.managerRecommendation.type === 'recommend' ? 'text-green-600' : 'text-red-600'}`}>
                {request.managerRecommendation.type === 'recommend' ? 'Recomendado' : 'No Recomendado'}
              </span>
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              {request.managerRecommendation.reason}
            </p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-2">
          <Button
            onClick={() => setActiveForm('authorize')}
            className="w-full"
            size="lg"
          >
            <Shield className="h-4 w-4 mr-2" />
            Autorizar
          </Button>
          <Button
            onClick={() => setActiveForm('reject')}
            variant="destructive"
            className="w-full"
            size="lg"
          >
            <XCircle className="h-4 w-4 mr-2" />
            Rechazar
          </Button>
        </div>

        <div className="text-center text-sm text-muted-foreground">
          <p>Decisión final de coordinación</p>
        </div>

        {/* Forms */}
        {(activeForm === 'authorize' || activeForm === 'reject') && (
          <CoordinatorActionsForm
            request={request}
            actionType={activeForm as 'authorize' | 'reject'}
            onSubmit={handleFormSubmit}
            onCancel={handleFormCancel}
          />
        )}
      </div>
    );
  }

  return (
    <div className="text-center py-4">
      <p className="text-muted-foreground text-sm">
        No tiene permisos para realizar acciones en este expediente
      </p>
    </div>
  );
};