import { EvidencePhoto, GeoLocation, Investigation } from './invc';

// Campo individual para comparación declarado vs observado
export interface ComparisonField {
  id: string;
  label: string;
  type: 'text' | 'number' | 'currency' | 'date' | 'boolean' | 'select' | 'multiselect';
  declared: any;                   // Valor declarado por el solicitante
  observed?: any;                  // Valor observado por el gerente
  status: 'pending' | 'confirmed' | 'adjusted' | 'blocked';
  comment?: string;                // Comentario obligatorio al ajustar
  evidence?: EvidencePhoto[];      // Evidencia fotográfica
  threshold?: number;              // Umbral de diferencia permitida (para números)
  required: boolean;               // Campo obligatorio
  severity?: 'low' | 'medium' | 'high' | 'critical'; // Severidad de la discrepancia
  timestamp?: Date;                // Momento de la última modificación
}

// Sección que agrupa campos relacionados
export interface INVCSection {
  id: string;
  title: string;
  description?: string;
  fields: ComparisonField[];
  required: boolean;
  order: number;
  status: 'pending' | 'in_progress' | 'completed' | 'blocked';
  progress: {
    completed: number;
    total: number;
    percentage: number;
  };
}

// Configuración de umbrales para validaciones automáticas
export interface FieldThreshold {
  fieldId: string;
  minPercentage?: number;          // Diferencia mínima en % para marcar como diferencia
  maxPercentage?: number;          // Diferencia máxima en % antes de marcar como crítica
  absoluteMin?: number;            // Diferencia absoluta mínima
  absoluteMax?: number;            // Diferencia absoluta máxima
}

// Tipos de razones para ajustes/discrepancias
export interface AdjustmentReason {
  id: string;
  label: string;
  category: 'income' | 'expenses' | 'personal' | 'activity' | 'products' | 'guarantors' | 'other';
  severity: 'low' | 'medium' | 'high' | 'critical';
  requiresEvidence: boolean;
}

// Datos de la aplicación original para comparación
export interface ApplicationData {
  applicationId: string;
  applicantInfo: {
    fullName: string;
    dpi: string;
    phone: string;
    mobile: string;
    photo?: string;
    address: string;
    coordinates?: GeoLocation;
  };
  economicActivity: {
    businessType: string;
    businessName?: string;
    isActive: boolean;
    products: string[];
    businessPhoto?: string;
  };
  financialInfo: {
    monthlyIncome: number;
    monthlyExpenses: number;
    creditAmount: number;
    term: number;
    installment: number;
  };
  guarantors: Array<{
    id: string;
    fullName: string;
    dpi: string;
    relationship: string;
    phone?: string;
  }>;
  metadata: {
    createdAt: Date;
    agentId: string;
    lastModified: Date;
  };
}

// Investigación extendida con capacidades de comparación
export interface ComparisonInvestigation extends Investigation {
  applicationData?: ApplicationData;  // Datos originales de la solicitud
  sections: INVCSection[];           // Secciones organizadas para comparación
  diffs: Record<string, {           // Mapa de diferencias detectadas
    field: string;
    declaredValue: any;
    observedValue: any;
    difference?: number;             // Diferencia numérica o porcentual
    severity: 'low' | 'medium' | 'high' | 'critical';
    autoDetected: boolean;           // Si fue detectada automáticamente
  }>;
  fotometria: {                     // Estado de evidencias fotográficas
    negocio_ok: boolean;
    solicitante_ok: boolean;
    geo_ok: boolean;
    additional_photos: number;
  };
  thresholds: Record<string, FieldThreshold>; // Configuración de umbrales
  validationRules: {                // Reglas de validación
    geoRadiusMeters: number;        // Radio permitido para geolocalización
    incomeThresholdPercent: number;  // Umbral de diferencia en ingresos
    expenseThresholdPercent: number; // Umbral de diferencia en egresos
    productMatchPercent: number;     // Porcentaje mínimo de coincidencia de productos
  };
  summary: {                        // Resumen de la investigación
    totalFields: number;
    completedFields: number;
    adjustedFields: number;
    blockedFields: number;
    overallRisk: 'low' | 'medium' | 'high' | 'critical';
    recommendedAction: 'approve' | 'approve_with_conditions' | 'review' | 'reject';
  };
}

// Estado global del sistema de comparación
export interface ComparisonState {
  [applicationId: string]: ComparisonInvestigation;
}

// Tipos para la calculadora de crédito
export interface CreditCalculation {
  originalAmount: number;
  adjustedAmount: number;
  originalTerm: number;
  adjustedTerm: number;
  originalInstallment: number;
  adjustedInstallment: number;
  observedIncome: number;
  observedExpenses: number;
  debtToIncomeRatio: number;
  adjustmentReason?: string;
  isViable: boolean;
}

// Configuración del sistema de comparación
export interface ComparisonConfig {
  defaultThresholds: Record<string, FieldThreshold>;
  adjustmentReasons: AdjustmentReason[];
  validationRules: ComparisonInvestigation['validationRules'];
  autoSaveInterval: number;         // Intervalo de guardado automático en ms
  geoAccuracyRequired: number;      // Precisión mínima requerida para geotag
}