import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ValidationResult } from '@/types/authorization';
import { AlertTriangle, CheckCircle, XCircle } from 'lucide-react';

interface ValidationChecklistProps {
  validationResult: ValidationResult;
}

export const ValidationChecklist: React.FC<ValidationChecklistProps> = ({ validationResult }) => {
  if (validationResult.isValid) {
    return (
      <Card className="border-green-200 bg-green-50 dark:bg-green-900/20">
        <CardContent className="p-4">
          <div className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <span className="font-medium text-green-800 dark:text-green-200">
              ✓ Expediente listo para autorización
            </span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-amber-200 bg-amber-50 dark:bg-amber-900/20">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-amber-800 dark:text-amber-200">
          <AlertTriangle className="h-5 w-5" />
          Validaciones Pendientes
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Blocked Reasons */}
        {validationResult.blockedReasons.length > 0 && (
          <div className="space-y-2">
            <p className="text-sm font-medium text-amber-800 dark:text-amber-200">
              Requisitos obligatorios:
            </p>
            <div className="space-y-1">
              {validationResult.blockedReasons.map((reason, index) => (
                <div key={index} className="flex items-start gap-2">
                  <XCircle className="h-4 w-4 text-red-600 mt-0.5 shrink-0" />
                  <span className="text-sm text-amber-700 dark:text-amber-300">{reason}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Warnings */}
        {validationResult.warnings.length > 0 && (
          <div className="space-y-2">
            <p className="text-sm font-medium text-amber-800 dark:text-amber-200">
              Advertencias:
            </p>
            <div className="space-y-1">
              {validationResult.warnings.map((warning, index) => (
                <div key={index} className="flex items-start gap-2">
                  <AlertTriangle className="h-4 w-4 text-amber-600 mt-0.5 shrink-0" />
                  <span className="text-sm text-amber-700 dark:text-amber-300">{warning}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="pt-2 border-t border-amber-200">
          <Badge variant="outline" className="border-amber-300 text-amber-700">
            Las acciones de autorización estarán disponibles una vez completados todos los requisitos
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
};