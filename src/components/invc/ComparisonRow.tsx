import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Check, Edit3, AlertTriangle, Copy, CheckCircle } from 'lucide-react';
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
      <Card className={`bg-white dark:bg-card p-4 transition-all duration-200 ${
        status === 'confirmed' ? 'border-green-500 bg-green-50 dark:bg-green-900/20' :
        status === 'difference' ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/20' :
        status === 'pending-difference' ? 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20' :
        'border-border'
      }`}>
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-center justify-between">
            <h4 className="font-bold text-lg">{label}</h4>
            <div className="flex items-center gap-2">
              {status === 'confirmed' && (
                <Badge className="text-xs bg-green-600 text-white">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Completado
                </Badge>
              )}
              {hasDifference && (
                <Badge className="text-xs bg-orange-500 text-white">
                  <AlertTriangle className="w-3 h-3 mr-1" />
                  Discrepancia
                </Badge>
              )}
              {status === 'pending-difference' && (
                <Badge className="text-xs bg-yellow-500 text-white">
                  Pendiente
                </Badge>
              )}
            </div>
          </div>

          {/* Values Display - Stacked for Mobile */}
          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-wide mb-2 block">
                DECLARADO
              </label>
              <div className="p-3 bg-muted/50 rounded text-sm font-medium">
                {formatValue(declaredValue)}
              </div>
            </div>
            
            <div>
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-wide mb-2 block">
                OBSERVADO
              </label>
              <div>
                {isEditable && !isConfirmed ? (
                  <Input
                    type={type === 'number' || type === 'currency' ? 'number' : 'text'}
                    value={localObserved}
                    onChange={(e) => handleInputChange(e.target.value)}
                    placeholder={`Ingrese ${label.toLowerCase()}`}
                    className="text-sm font-medium"
                  />
                ) : (
                  <div className="p-3 bg-muted/50 rounded text-sm font-medium min-h-[40px] flex items-center">
                    {formatValue(localObserved) || formatValue(declaredValue)}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Comentario de discrepancia existente */}
          {hasDifference && existingDiff?.comentario && (
            <div className="p-2 bg-orange-50 dark:bg-orange-900/20 rounded text-xs border border-orange-200 dark:border-orange-800">
              <span className="font-medium text-orange-700 dark:text-orange-300">Comentario:</span> 
              <span className="ml-1 text-orange-600 dark:text-orange-400">{existingDiff.comentario}</span>
            </div>
          )}

          {/* Actions Below Inputs */}
          <div className="flex gap-3 pt-4">
            <Button
              size="sm"
              onClick={copyDeclaredValue}
              variant="outline"
              className="flex-1 text-primary border-primary hover:bg-primary/10"
            >
              <Copy className="w-4 h-4 mr-2" />
              Copiar
            </Button>
            
            {!isConfirmed && isEditable && (
              <Button
                size="sm"
                onClick={handleConfirm}
                disabled={!localObserved}
                className="flex-1"
              >
                <Check className="w-4 h-4 mr-2" />
                {hasSignificantDifference() ? 'Ajustar' : 'Confirmar'}
              </Button>
            )}
            
            {isConfirmed && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsConfirmed(false)}
                className="flex-1"
              >
                <Edit3 className="w-4 h-4 mr-2" />
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