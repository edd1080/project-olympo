import { ComparisonField, INVCSection, ApplicationData, ComparisonInvestigation } from '@/types/invc-comparison';

/**
 * Calcula la diferencia porcentual entre valores declarados y observados
 */
export function calculateFieldDifference(field: ComparisonField): number | null {
  if (field.type !== 'number' && field.type !== 'currency') return null;
  if (field.observedValue === undefined || field.observedValue === null) return null;
  
  const declared = parseFloat(field.declaredValue) || 0;
  const observed = parseFloat(field.observedValue) || 0;
  
  if (declared === 0) return observed === 0 ? 0 : 100;
  
  return Math.abs(((observed - declared) / declared) * 100);
}

/**
 * Valida si una diferencia está dentro del umbral permitido
 */
export function validateThreshold(difference: number, threshold: { minPercentage?: number; maxPercentage?: number }): boolean {
  if (threshold.maxPercentage && difference > threshold.maxPercentage) return false;
  if (threshold.minPercentage && difference < threshold.minPercentage) return false;
  return true;
}

/**
 * Calcula la severidad de una discrepancia basada en la diferencia
 */
export function calculateSeverity(difference: number, fieldType: string): ComparisonField['severity'] {
  if (fieldType === 'currency') {
    if (difference > 30) return 'critical';
    if (difference > 20) return 'high';
    if (difference > 10) return 'medium';
    return 'low';
  }
  
  if (difference > 50) return 'critical';
  if (difference > 25) return 'high';
  if (difference > 10) return 'medium';
  return 'low';
}

/**
 * Formatea un valor según su tipo para mostrar en UI
 */
export function formatFieldValue(value: any, type: ComparisonField['type']): string {
  if (value === null || value === undefined) return 'No especificado';
  
  switch (type) {
    case 'currency':
      return new Intl.NumberFormat('es-GT', { 
        style: 'currency', 
        currency: 'GTQ',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      }).format(value);
    case 'number':
      return new Intl.NumberFormat('es-GT').format(value);
    case 'boolean':
      return value ? 'Sí' : 'No';
    case 'date':
      return new Date(value).toLocaleDateString('es-GT');
    default:
      return String(value);
  }
}

/**
 * Genera las secciones por defecto basadas en los datos de la aplicación
 */
export function generateDefaultSections(applicationData: ApplicationData): INVCSection[] {
  return [
    {
      id: 'personal_data',
      title: 'Datos Personales',
      description: 'Información personal del solicitante',
      required: true,
      order: 1,
      status: 'pending',
      progress: { completed: 0, total: 5, percentage: 0 },
      fields: [
        {
          id: 'fullName',
          sectionId: 'personal_data',
          fieldName: 'fullName',
          label: 'Nombre completo',
          type: 'text',
          declaredValue: applicationData.applicantInfo.fullName,
          status: 'pending',
          isRequired: true
        },
        {
          id: 'dpi',
          sectionId: 'personal_data',
          fieldName: 'dpi',
          label: 'Número de DPI',
          type: 'text',
          declaredValue: applicationData.applicantInfo.dpi,
          status: 'pending',
          isRequired: true
        },
        {
          id: 'phone',
          sectionId: 'personal_data',
          fieldName: 'phone',
          label: 'Teléfono',
          type: 'text',
          declaredValue: applicationData.applicantInfo.phone,
          status: 'pending',
          isRequired: false
        },
        {
          id: 'mobile',
          sectionId: 'personal_data',
          fieldName: 'mobile',
          label: 'Celular',
          type: 'text',
          declaredValue: applicationData.applicantInfo.mobile,
          status: 'pending',
          isRequired: true
        },
        {
          id: 'address',
          sectionId: 'personal_data',
          fieldName: 'address',
          label: 'Dirección',
          type: 'text',
          declaredValue: applicationData.applicantInfo.address,
          status: 'pending',
          isRequired: true
        }
      ]
    },
    {
      id: 'economic_activity',
      title: 'Actividad Económica',
      description: 'Información sobre el negocio y productos',
      required: true,
      order: 2,
      status: 'pending',
      progress: { completed: 0, total: 4, percentage: 0 },
      fields: [
        {
          id: 'businessType',
          sectionId: 'economic_activity',
          fieldName: 'businessType',
          label: 'Tipo de negocio',
          type: 'text',
          declaredValue: applicationData.economicActivity.businessType,
          status: 'pending',
          isRequired: true
        },
        {
          id: 'businessName',
          sectionId: 'economic_activity',
          fieldName: 'businessName',
          label: 'Nombre del negocio',
          type: 'text',
          declaredValue: applicationData.economicActivity.businessName || '',
          status: 'pending',
          isRequired: false
        },
        {
          id: 'isActive',
          sectionId: 'economic_activity',
          fieldName: 'isActive',
          label: 'Negocio activo',
          type: 'boolean',
          declaredValue: applicationData.economicActivity.isActive,
          status: 'pending',
          isRequired: true
        },
        {
          id: 'products',
          sectionId: 'economic_activity',
          fieldName: 'products',
          label: 'Productos/Servicios',
          type: 'multiselect',
          declaredValue: applicationData.economicActivity.products,
          status: 'pending',
          isRequired: true
        }
      ]
    },
    {
      id: 'financial_analysis',
      title: 'Análisis Financiero',
      description: 'Ingresos, egresos y capacidad de pago',
      required: true,
      order: 3,
      status: 'pending',
      progress: { completed: 0, total: 2, percentage: 0 },
      fields: [
        {
          id: 'monthly_income',
          sectionId: 'financial_analysis',
          fieldName: 'monthly_income',
          label: 'Ingresos mensuales',
          type: 'currency',
          declaredValue: applicationData.financialInfo.monthlyIncome,
          status: 'pending',
          isRequired: true,
          threshold: 15
        },
        {
          id: 'monthly_expenses',
          sectionId: 'financial_analysis',
          fieldName: 'monthly_expenses',
          label: 'Egresos mensuales',
          type: 'currency',
          declaredValue: applicationData.financialInfo.monthlyExpenses,
          status: 'pending',
          isRequired: true,
          threshold: 20
        }
      ]
    }
  ];
}

/**
 * Calcula el progreso de una sección
 */
export function calculateSectionProgress(section: INVCSection): INVCSection['progress'] {
  const completedFields = section.fields.filter(field => 
    field.status === 'confirmed' || field.status === 'adjusted'
  ).length;
  
  return {
    completed: completedFields,
    total: section.fields.length,
    percentage: section.fields.length > 0 ? Math.round((completedFields / section.fields.length) * 100) : 0
  };
}

/**
 * Determina el estado de una sección basado en sus campos
 */
export function calculateSectionStatus(section: INVCSection): INVCSection['status'] {
  const { fields } = section;
  
  if (fields.some(field => field.status === 'blocked')) return 'blocked';
  
  const completedFields = fields.filter(field => 
    field.status === 'confirmed' || field.status === 'adjusted'
  ).length;
  
  if (completedFields === fields.length) return 'completed';
  if (completedFields > 0) return 'in_progress';
  return 'pending';
}

/**
 * Actualiza el progreso y estado de todas las secciones
 */
export function updateSectionsProgress(sections: INVCSection[]): INVCSection[] {
  return sections.map(section => ({
    ...section,
    progress: calculateSectionProgress(section),
    status: calculateSectionStatus(section)
  }));
}

/**
 * Calcula un resumen general de la investigación
 */
export function calculateInvestigationSummary(comparison: ComparisonInvestigation): ComparisonInvestigation['summary'] {
  const allFields = comparison.sections.flatMap(section => section.fields);
  
  const totalFields = allFields.length;
  const completedFields = allFields.filter(field => 
    field.status === 'confirmed' || field.status === 'adjusted'
  ).length;
  const confirmedFields = allFields.filter(field => field.status === 'confirmed').length;
  const adjustedFields = allFields.filter(field => field.status === 'adjusted').length;
  const blockedFields = allFields.filter(field => field.status === 'blocked').length;
  
  // Determinar estado general
  let overallStatus: 'pending' | 'in_progress' | 'completed' | 'blocked' = 'pending';
  if (blockedFields > 0) {
    overallStatus = 'blocked';
  } else if (completedFields === totalFields) {
    overallStatus = 'completed';
  } else if (completedFields > 0) {
    overallStatus = 'in_progress';
  }
  
  // Determinar riesgo general
  const criticalFields = allFields.filter(field => field.severity === 'critical').length;
  const highFields = allFields.filter(field => field.severity === 'high').length;
  
  let overallRisk: 'low' | 'medium' | 'high' | 'critical' = 'low';
  if (criticalFields > 0) {
    overallRisk = 'critical';
  } else if (highFields > 0) {
    overallRisk = 'high';
  } else if (adjustedFields > totalFields * 0.3) {
    overallRisk = 'medium';
  }
  
  // Determinar acción recomendada
  let recommendedAction: 'approve' | 'approve_with_conditions' | 'review' | 'reject' | 'adjust_credit' | 'additional_verification' = 'approve';
  if (overallRisk === 'critical' || blockedFields > 0) {
    recommendedAction = 'reject';
  } else if (overallRisk === 'high') {
    recommendedAction = 'additional_verification';
  } else if (adjustedFields > 0) {
    recommendedAction = 'approve_with_conditions';
  }
  
  return {
    totalFields,
    completedFields,
    confirmedFields,
    adjustedFields,
    blockedFields,
    overallStatus,
    overallRisk,
    recommendedAction
  };
}

/**
 * Verifica si una investigación puede ser finalizada
 */
export function canFinalizeInvestigation(comparison: ComparisonInvestigation): boolean {
  const allFields = comparison.sections.flatMap(section => section.fields);
  const requiredFields = allFields.filter(field => field.isRequired);
  const completedRequiredFields = requiredFields.filter(field => 
    field.status === 'confirmed' || field.status === 'adjusted'
  );
  
  // No debe haber campos críticos bloqueados
  const criticalBlockedFields = allFields.filter(field => 
    field.status === 'blocked' && field.severity === 'critical'
  );
  
  return completedRequiredFields.length === requiredFields.length && criticalBlockedFields.length === 0;
}

/**
 * Genera un reporte de discrepancias
 */
export function generateDiscrepancyReport(comparison: ComparisonInvestigation) {
  const allFields = comparison.sections.flatMap(section => section.fields);
  const adjustedFields = allFields.filter(field => field.status === 'adjusted');
  
  return {
    totalDiscrepancies: adjustedFields.length,
    bySeverity: {
      low: adjustedFields.filter(field => field.severity === 'low').length,
      medium: adjustedFields.filter(field => field.severity === 'medium').length,
      high: adjustedFields.filter(field => field.severity === 'high').length,
      critical: adjustedFields.filter(field => field.severity === 'critical').length,
    },
    autoDetected: adjustedFields.filter(field => {
      const difference = calculateFieldDifference(field);
      return difference !== null && difference > 10;
    }).length,
    manualAdjustments: adjustedFields.filter(field => field.comment).length
  };
}