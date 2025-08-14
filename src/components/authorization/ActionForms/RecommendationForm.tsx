import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { AuthorizationRequest, AuthorizationAction } from '@/types/authorization';
import { ThumbsUp, ThumbsDown, X } from 'lucide-react';
import { ConfirmationModal } from '../ConfirmationModal';

interface RecommendationFormProps {
  request: AuthorizationRequest;
  recommendationType: 'recommend' | 'not_recommend';
  onSubmit: (action: AuthorizationAction) => void;
  onCancel: () => void;
}

export const RecommendationForm: React.FC<RecommendationFormProps> = ({
  request,
  recommendationType,
  onSubmit,
  onCancel
}) => {
  const [decision, setDecision] = useState<'yes' | 'no'>(recommendationType === 'recommend' ? 'yes' : 'no');
  const [reason, setReason] = useState('');
  const [additionalComments, setAdditionalComments] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isRecommending = decision === 'yes';
  const icon = isRecommending ? ThumbsUp : ThumbsDown;
  const colorClass = isRecommending ? 'text-green-700' : 'text-red-700';
  const bgClass = isRecommending ? 'bg-green-50 dark:bg-green-900/20' : 'bg-red-50 dark:bg-red-900/20';

  const handleSubmit = () => {
    if (!reason.trim()) return;
    setShowConfirmation(true);
  };

  const handleConfirm = async () => {
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    const action: AuthorizationAction = {
      type: isRecommending ? 'recommend' : 'not_recommend',
      comment: reason,
      timestamp: new Date().toISOString(),
      userId: 'current-user-id',
      userRole: 'manager'
    };

    onSubmit(action);
  };

  return (
    <>
      <Card className={isRecommending ? 'border-green-200' : 'border-red-200'}>
        <CardHeader className="pb-3">
          <CardTitle className={`flex items-center gap-2 ${colorClass}`}>
            {React.createElement(icon, { className: 'h-5 w-5' })}
            {isRecommending ? 'Realizar Recomendación' : 'No Recomendar'}
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
            </div>
          </div>

          {/* Decision Radio */}
          <div className="space-y-3">
            <label className="text-sm font-medium">
              ¿{isRecommending ? 'Recomienda' : 'No recomienda'} desembolsar el crédito? *
            </label>
            <RadioGroup value={decision} onValueChange={(value) => setDecision(value as 'yes' | 'no')}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="yes" id="yes" />
                <Label htmlFor="yes">Sí, recomiendo aprobar el crédito</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="no" id="no" />
                <Label htmlFor="no">No, no recomiendo aprobar el crédito</Label>
              </div>
            </RadioGroup>
          </div>

          {/* Reason */}
          <div className="space-y-2">
            <label className="text-sm font-medium">
              ¿Por qué {decision === 'yes' ? 'lo recomienda' : 'no lo recomienda'}? *
            </label>
            <Textarea
              placeholder={`Explique las razones por las cuales ${decision === 'yes' ? 'recomienda' : 'no recomienda'} este crédito para coordinación...`}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={4}
              className="resize-none"
            />
          </div>

          {/* Additional Comments */}
          <div className="space-y-2">
            <label className="text-sm font-medium">
              Comentarios adicionales (opcional)
            </label>
            <Textarea
              placeholder="Información adicional para el coordinador..."
              value={additionalComments}
              onChange={(e) => setAdditionalComments(e.target.value)}
              rows={3}
              className="resize-none"
            />
          </div>

          {/* Warning */}
          <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200">
            <p className="text-sm text-blue-800 dark:text-blue-200">
              ℹ️ <strong>Importante:</strong> Su {decision === 'yes' ? 'recomendación' : 'no recomendación'} será 
              enviada al coordinador regional quien tomará la decisión final sobre el crédito.
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <Button
              onClick={handleSubmit}
              disabled={reason.trim().length < 20}
              className="flex-1"
              variant={isRecommending ? 'default' : 'destructive'}
            >
              Continuar
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
          title={`Confirmar ${isRecommending ? 'Recomendación' : 'No Recomendación'}`}
          message={`¿Confirma que ${decision === 'yes' ? 'recomienda' : 'no recomienda'} el crédito de Q${request.amount.toLocaleString()} para ${request.applicantName}?`}
          confirmText={isRecommending ? 'Recomendar' : 'No Recomendar'}
          confirmVariant={isRecommending ? 'default' : 'destructive'}
          isLoading={isSubmitting}
          onConfirm={handleConfirm}
          onCancel={() => setShowConfirmation(false)}
        />
      )}
    </>
  );
};