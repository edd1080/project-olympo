import React, { useState, useEffect } from 'react';
import { ComparisonField } from '@/types/invc-comparison';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Check, AlertTriangle, Edit3, Lock, Camera } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ComparisonRowProps {
  field: ComparisonField;
  onObservedChange: (value: any) => void;
  onConfirm: () => void;
  onAdjust: (reason: string) => void;
  onBlock: (reason: string) => void;
  className?: string;
  showDifference?: boolean;
}

export const ComparisonRow: React.FC<ComparisonRowProps> = ({
  field,
  onObservedChange,
  onConfirm,
  onAdjust,
  onBlock,
  className,
  showDifference = true
}) => {
  const [observedValue, setObservedValue] = useState(field.observedValue || '');
  const [isEditing, setIsEditing] = useState(false);
  const [comment, setComment] = useState(field.comment || '');

  useEffect(() => {
    setObservedValue(field.observedValue || '');
  }, [field.observedValue]);

  const handleObservedChange = (value: any) => {
    setObservedValue(value);
    onObservedChange(value);
  };

  const handleConfirm = () => {
    if (field.status === 'pending' && observedValue !== '') {
      onConfirm();
    }
  };

  const handleAdjust = () => {
    if (comment.trim() === '') {
      alert('El comentario es obligatorio al realizar un ajuste');
      return;
    }
    onAdjust(comment);
    setIsEditing(false);
  };

  const getStatusBadge = () => {
    switch (field.status) {
      case 'confirmed':
        return <Badge variant="default" className="bg-emerald-500/10 text-emerald-700 border-emerald-200"><Check className="w-3 h-3 mr-1" />Confirmado</Badge>;
      case 'adjusted':
        return <Badge variant="secondary" className="bg-amber-500/10 text-amber-700 border-amber-200"><Edit3 className="w-3 h-3 mr-1" />Ajustado</Badge>;
      case 'blocked':
        return <Badge variant="destructive" className="bg-red-500/10 text-red-700 border-red-200"><Lock className="w-3 h-3 mr-1" />Bloqueado</Badge>;
      default:
        return <Badge variant="outline" className="text-muted-foreground">Pendiente</Badge>;
    }
  };

  const getDifferenceInfo = () => {
    if (!showDifference || field.type === 'boolean' || field.type === 'text') return null;
    
    const declared = parseFloat(field.declaredValue);
    const observed = parseFloat(observedValue);
    
    if (isNaN(declared) || isNaN(observed)) return null;
    
    const difference = ((observed - declared) / declared) * 100;
    const isSignificant = Math.abs(difference) > (field.threshold || 10);
    
    return (
      <div className={cn(
        "flex items-center text-xs px-2 py-1 rounded-md",
        isSignificant 
          ? "bg-amber-50 text-amber-700 border border-amber-200" 
          : "bg-gray-50 text-gray-600"
      )}>
        {difference > 0 ? '+' : ''}{difference.toFixed(1)}%
        {isSignificant && <AlertTriangle className="w-3 h-3 ml-1" />}
      </div>
    );
  };

  const formatValue = (value: any) => {
    if (field.type === 'currency') {
      return new Intl.NumberFormat('es-GT', { 
        style: 'currency', 
        currency: 'GTQ' 
      }).format(value);
    }
    if (field.type === 'number') {
      return new Intl.NumberFormat('es-GT').format(value);
    }
    if (field.type === 'boolean') {
      return value ? 'Sí' : 'No';
    }
    return value;
  };

  const renderInputField = () => {
    switch (field.type) {
      case 'number':
      case 'currency':
        return (
          <Input
            type="number"
            value={observedValue}
            onChange={(e) => handleObservedChange(parseFloat(e.target.value) || 0)}
            placeholder="Ingrese el valor observado"
            className="w-full"
            disabled={field.status === 'confirmed' || field.status === 'blocked'}
          />
        );
      case 'boolean':
        return (
          <div className="flex gap-2">
            <Button
              variant={observedValue === true ? "default" : "outline"}
              size="sm"
              onClick={() => handleObservedChange(true)}
              disabled={field.status === 'confirmed' || field.status === 'blocked'}
            >
              Sí
            </Button>
            <Button
              variant={observedValue === false ? "default" : "outline"}
              size="sm"
              onClick={() => handleObservedChange(false)}
              disabled={field.status === 'confirmed' || field.status === 'blocked'}
            >
              No
            </Button>
          </div>
        );
      default:
        return (
          <Input
            type="text"
            value={observedValue}
            onChange={(e) => handleObservedChange(e.target.value)}
            placeholder="Ingrese el valor observado"
            className="w-full"
            disabled={field.status === 'confirmed' || field.status === 'blocked'}
          />
        );
    }
  };

  return (
    <Card className={cn("transition-all duration-200", className)}>
      <CardContent className="p-4">
        <div className="space-y-4">
          {/* Header con label y status */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h4 className="font-medium text-sm">{field.label}</h4>
              {field.isRequired && <Badge variant="outline" className="text-xs">Requerido</Badge>}
            </div>
            {getStatusBadge()}
          </div>

          {/* Contenido de comparación */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Columna Declarado */}
            <div className="space-y-2">
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Declarado
              </label>
              <div className="p-3 bg-muted/50 rounded-md border">
                <span className="text-sm font-medium">
                  {formatValue(field.declaredValue)}
                </span>
              </div>
            </div>

            {/* Columna Observado */}
            <div className="space-y-2">
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Observado hoy
              </label>
              <div className="space-y-2">
                {renderInputField()}
                {getDifferenceInfo()}
              </div>
            </div>
          </div>

          {/* Comentario si está en modo edición o si ya tiene comentario */}
          {(isEditing || field.comment) && (
            <div className="space-y-2">
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Comentario {isEditing && <span className="text-red-500">*</span>}
              </label>
              {isEditing ? (
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Explicar la razón del ajuste..."
                  className="w-full p-2 border rounded-md text-sm min-h-[60px] resize-none"
                  disabled={field.status === 'blocked'}
                />
              ) : (
                <div className="p-2 bg-muted/30 rounded-md text-sm text-muted-foreground">
                  {field.comment}
                </div>
              )}
            </div>
          )}

          {/* Evidencia fotográfica */}
          {field.evidence && field.evidence.length > 0 && (
            <div className="space-y-2">
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Evidencia
              </label>
              <div className="flex gap-2">
                {field.evidence.map((photo, index) => (
                  <div key={photo.id} className="relative">
                    <img
                      src={photo.url}
                      alt={`Evidencia ${index + 1}`}
                      className="w-16 h-16 object-cover rounded-md border"
                    />
                    <Camera className="w-3 h-3 absolute -top-1 -right-1 bg-primary text-white rounded-full p-0.5" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Acciones */}
          {field.status === 'pending' && observedValue !== '' && (
            <div className="flex gap-2 pt-2 border-t">
              <Button
                onClick={handleConfirm}
                size="sm"
                variant="default"
                className="flex-1"
              >
                <Check className="w-4 h-4 mr-1" />
                Confirmar
              </Button>
              <Button
                onClick={() => setIsEditing(true)}
                size="sm"
                variant="secondary"
                className="flex-1"
              >
                <Edit3 className="w-4 h-4 mr-1" />
                Ajustar
              </Button>
            </div>
          )}

          {/* Botones de ajuste cuando está editando */}
          {isEditing && (
            <div className="flex gap-2 pt-2 border-t">
              <Button
                onClick={handleAdjust}
                size="sm"
                variant="default"
                disabled={comment.trim() === ''}
              >
                Guardar Ajuste
              </Button>
              <Button
                onClick={() => {
                  setIsEditing(false);
                  setComment(field.comment || '');
                }}
                size="sm"
                variant="outline"
              >
                Cancelar
              </Button>
            </div>
          )}

          {/* Timestamp */}
          {field.timestamp && (
            <div className="text-xs text-muted-foreground">
              Última actualización: {field.timestamp.toLocaleString('es-GT')}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};