import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Check, Edit3, AlertTriangle } from 'lucide-react';
import { useINVC } from '@/context/INVCContext';
import { DifferenceBottomSheet } from './DifferenceBottomSheet';

interface ComparisonRowProps {
  label: string;
  fieldPath: string;
  declaredValue: any;
  observedValue?: any;
  type?: 'text' | 'number' | 'currency';
  isEditable?: boolean;
  onConfirm?: () => void;
  onAdjust?: (value: any, comment: string, evidence?: string) => void;
  threshold?: number; // Para valores numéricos con umbral de diferencia
}

export const ComparisonRow: React.FC<ComparisonRowProps> = ({
  label,
  fieldPath,
  declaredValue,
  observedValue,
  type = 'text',
  isEditable = true,
  onConfirm,
  onAdjust,
  threshold = 0.1 // 10% por defecto
}) => {
  const { invcData, updateObservedData, addDifference, removeDifference } = useINVC();
  const [localObserved, setLocalObserved] = useState(observedValue || '');
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [showDifferenceSheet, setShowDifferenceSheet] = useState(false);

  // Buscar si existe una discrepancia para este campo
  const existingDiff = invcData?.diffs.find(d => d.campo === fieldPath);
  const hasDifference = existingDiff !== undefined;

  // Calcular si hay diferencia significativa
  const hasSignificantDifference = () => {
    if (!localObserved || localObserved === declaredValue) return false;
    
    if (type === 'number' || type === 'currency') {
      const declared = parseFloat(declaredValue.toString());
      const observed = parseFloat(localObserved.toString());
      
      if (isNaN(declared) || isNaN(observed)) return false;
      
      const delta = Math.abs(observed - declared) / declared;
      return delta > threshold;
    }
    
    return localObserved !== declaredValue;
  };

  const getDifferencePercentage = () => {
    if (type !== 'number' && type !== 'currency') return 0;
    
    const declared = parseFloat(declaredValue.toString());
    const observed = parseFloat(localObserved.toString());
    
    if (isNaN(declared) || isNaN(observed)) return 0;
    
    return Math.round(((observed - declared) / declared) * 100);
  };

  const formatValue = (value: any) => {
    if (type === 'currency') {
      const numValue = parseFloat(value.toString());
      return isNaN(numValue) ? 'Q0.00' : `Q${numValue.toLocaleString('es-GT', { minimumFractionDigits: 2 })}`;
    }
    return value?.toString() || '';
  };

  const handleConfirm = () => {
    if (localObserved && localObserved !== declaredValue) {
      // Si hay diferencia, abrir bottom sheet
      setShowDifferenceSheet(true);
    } else {
      // Si no hay diferencia, confirmar directamente
      updateObservedData(fieldPath, localObserved || declaredValue);
      removeDifference(fieldPath);
      setIsConfirmed(true);
      onConfirm?.();
    }
  };

  const handleDifferenceSubmit = (comment: string, evidence?: string) => {
    const difference = {
      campo: fieldPath,
      valor_declarado: declaredValue,
      valor_observado: localObserved,
      delta: getDifferencePercentage(),
      severidad: 'media' as const,
      comentario: comment,
      evidencia: evidence
    };

    updateObservedData(fieldPath, localObserved);
    addDifference(difference);
    setIsConfirmed(true);
    setShowDifferenceSheet(false);
    onAdjust?.(localObserved, comment, evidence);
  };

  const handleInputChange = (value: string) => {
    setLocalObserved(value);
    setIsConfirmed(false);
  };

  const copyDeclaredValue = () => {
    setLocalObserved(declaredValue);
    setIsConfirmed(false);
  };

  const getRowStatus = () => {
    if (isConfirmed) return 'confirmed';
    if (hasDifference) return 'difference';
    if (hasSignificantDifference()) return 'pending-difference';
    return 'pending';
  };

  const status = getRowStatus();

  return (
    <>
      <Card className={`p-4 transition-all duration-200 ${
        status === 'confirmed' ? 'border-primary bg-primary/5' :
        status === 'difference' ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/20' :
        status === 'pending-difference' ? 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20' :
        'border-border'
      }`}>
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3">
              <h4 className="font-medium text-sm">{label}</h4>
              {status === 'confirmed' && (
                <Badge variant="default" className="text-xs">
                  <Check className="w-3 h-3 mr-1" />
                  Confirmado
                </Badge>
              )}
              {hasDifference && (
                <Badge variant="secondary" className="text-xs">
                  <AlertTriangle className="w-3 h-3 mr-1" />
                  Discrepancia {getDifferencePercentage() !== 0 && `(${getDifferencePercentage() > 0 ? '+' : ''}${getDifferencePercentage()}%)`}
                </Badge>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Declarado */}
              <div>
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  Declarado
                </label>
                <div className="mt-1 p-2 bg-muted rounded text-sm">
                  {formatValue(declaredValue)}
                </div>
              </div>

              {/* Observado */}
              <div>
                <div className="flex items-center justify-between">
                  <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    Observado
                  </label>
                  {!localObserved && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={copyDeclaredValue}
                      className="text-xs h-auto p-1"
                    >
                      Copiar
                    </Button>
                  )}
                </div>
                <div className="mt-1">
                  {isEditable && !isConfirmed ? (
                    <Input
                      type={type === 'number' || type === 'currency' ? 'number' : 'text'}
                      value={localObserved}
                      onChange={(e) => handleInputChange(e.target.value)}
                      placeholder={`Ingrese ${label.toLowerCase()}`}
                      className="text-sm"
                    />
                  ) : (
                    <div className="p-2 bg-muted rounded text-sm">
                      {formatValue(localObserved) || formatValue(declaredValue)}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Comentario de discrepancia existente */}
            {hasDifference && existingDiff?.comentario && (
              <div className="mt-3 p-2 bg-muted rounded text-xs">
                <span className="font-medium">Comentario:</span> {existingDiff.comentario}
              </div>
            )}
          </div>

          {/* Acciones */}
          <div className="ml-4 flex flex-col gap-2">
            {!isConfirmed && isEditable && (
              <Button
                size="sm"
                onClick={handleConfirm}
                disabled={!localObserved}
                className="min-w-[80px]"
              >
                <Check className="w-4 h-4 mr-1" />
                {hasSignificantDifference() ? 'Ajustar' : 'Confirmar'}
              </Button>
            )}
            
            {isConfirmed && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsConfirmed(false)}
                className="min-w-[80px]"
              >
                <Edit3 className="w-4 h-4 mr-1" />
                Editar
              </Button>
            )}
          </div>
        </div>
      </Card>

      <DifferenceBottomSheet
        isOpen={showDifferenceSheet}
        onClose={() => setShowDifferenceSheet(false)}
        onSubmit={handleDifferenceSubmit}
        fieldLabel={label}
        declaredValue={formatValue(declaredValue)}
        observedValue={formatValue(localObserved)}
        differencePercentage={getDifferencePercentage()}
      />
    </>
  );
};