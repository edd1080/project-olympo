
import prequalificationRules from '@/data/prequalificationRules.json';

export interface PrequalificationData {
  nombre_completo: string;
  dpi: string;
  telefono: string;
  actividad_economica: string;
  ingreso_mensual: number;
  destino_credito: string;
  monto_solicitado: number;
  historial: string;
}

export interface PrequalificationResult {
  status: 'green' | 'yellow' | 'red';
  reason: string;
  canProceed: boolean;
  requiresAdditionalData: boolean;
}

interface Rule {
  condition: Record<string, any>;
  result: {
    status: 'green' | 'yellow' | 'red';
    reason: string;
  };
}

export const evaluatePrequalification = (data: PrequalificationData): PrequalificationResult => {
  // Calcular relación monto/ingreso
  const enhancedData = {
    ...data,
    relacion_monto_ingreso: data.monto_solicitado / data.ingreso_mensual
  };

  const rules = prequalificationRules.logic as Rule[];
  
  // Evaluar reglas en orden de prioridad (rojo → amarillo → verde)
  const redRules = rules.filter(rule => rule.result.status === 'red');
  const yellowRules = rules.filter(rule => rule.result.status === 'yellow');
  const greenRules = rules.filter(rule => rule.result.status === 'green');

  // Verificar reglas rojas primero
  for (const rule of redRules) {
    if (evaluateCondition(rule.condition, enhancedData)) {
      return {
        status: 'red',
        reason: rule.result.reason,
        canProceed: false,
        requiresAdditionalData: false
      };
    }
  }

  // Verificar reglas amarillas
  for (const rule of yellowRules) {
    if (evaluateCondition(rule.condition, enhancedData)) {
      return {
        status: 'yellow',
        reason: rule.result.reason,
        canProceed: true,
        requiresAdditionalData: true
      };
    }
  }

  // Verificar reglas verdes
  for (const rule of greenRules) {
    if (evaluateCondition(rule.condition, enhancedData)) {
      return {
        status: 'green',
        reason: rule.result.reason,
        canProceed: true,
        requiresAdditionalData: false
      };
    }
  }

  // Default a amarillo si no se cumple ninguna condición específica
  return {
    status: 'yellow',
    reason: 'Requiere evaluación adicional',
    canProceed: true,
    requiresAdditionalData: true
  };
};

const evaluateCondition = (condition: Record<string, any>, data: Record<string, any>): boolean => {
  for (const [field, criteria] of Object.entries(condition)) {
    const value = data[field];
    
    if (criteria.lt !== undefined && value >= criteria.lt) return false;
    if (criteria.gt !== undefined && value <= criteria.gt) return false;
    if (criteria.lte !== undefined && value > criteria.lte) return false;
    if (criteria.gte !== undefined && value < criteria.gte) return false;
    if (criteria.eq !== undefined && value !== criteria.eq) return false;
    if (criteria.in !== undefined && !criteria.in.includes(value)) return false;
    if (criteria.between !== undefined) {
      const [min, max] = criteria.between;
      if (value < min || value > max) return false;
    }
  }
  
  return true;
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('es-GT', {
    style: 'currency',
    currency: 'GTQ',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
};

export const generateUUID = (): string => {
  return 'xxxx-xxxx-4xxx-yxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};
