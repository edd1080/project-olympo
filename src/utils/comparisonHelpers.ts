import { 
  ComparisonField, 
  INVCSection, 
  ApplicationData, 
  FieldThreshold,
  ComparisonInvestigation 
} from '@/types/invc-comparison';

/**
 * Calcula la diferencia entre el valor declarado y observado
 */
export const calculateFieldDifference = (field: ComparisonField): number | null => {
  if (field.type === 'boolean' || field.type === 'text') return null;
  if (field.observed === undefined || field.observed === null) return null;
  
  const declared = parseFloat(field.declared);
  const observed = parseFloat(field.observed);
  
  if (isNaN(declared) || isNaN(observed)) return null;
  if (declared === 0) return observed === 0 ? 0 : 100;
  
  return Math.abs(((observed - declared) / declared) * 100);
};

/**
 * Valida si una diferencia está dentro del umbral permitido
 */
export const validateThreshold = (difference: number, threshold: FieldThreshold): boolean => {
  if (threshold.maxPercentage && difference > threshold.maxPercentage) return false;
  if (threshold.minPercentage && difference < threshold.minPercentage) return false;
  return true;
};

/**
 * Determina la severidad de una discrepancia basada en la diferencia
 */
export const calculateSeverity = (difference: number, fieldType: string): ComparisonField['severity'] => {
  if (fieldType === 'currency' || fieldType === 'number') {
    if (difference > 50) return 'critical';
    if (difference > 25) return 'high';
    if (difference > 10) return 'medium';
    return 'low';
  }
  
  // Para otros tipos, evaluar caso por caso
  return 'medium';
};

/**
 * Formatea valores según su tipo
 */
export const formatFieldValue = (value: any, type: ComparisonField['type']): string => {
  if (value === null || value === undefined) return 'N/A';
  
  switch (type) {
    case 'currency':
      return new Intl.NumberFormat('es-GT', { 
        style: 'currency', 
        currency: 'GTQ',
        minimumFractionDigits: 0
      }).format(value);
      
    case 'number':
      return new Intl.NumberFormat('es-GT').format(value);
      
    case 'boolean':
      return value ? 'Sí' : 'No';
      
    case 'date':
      if (value instanceof Date) {
        return value.toLocaleDateString('es-GT');
      }
      return new Date(value).toLocaleDateString('es-GT');
      
    default:
      return String(value);
  }
};

/**
 * Genera las secciones por defecto basadas en los datos de la aplicación
 */
export const generateDefaultSections = (applicationData: ApplicationData): INVCSection[] => {
  const sections: INVCSection[] = [
    {
      id: 'personal_data',
      title: 'Datos Personales',
      description: 'Verificación de información personal del solicitante',
      required: true,
      order: 1,
      status: 'pending',
      progress: { completed: 0, total: 5, percentage: 0 },
      fields: [
        {
          id: 'fullName',
          label: 'Nombre completo',
          type: 'text',
          declared: applicationData.applicantInfo.fullName,
          status: 'pending',
          required: true
        },
        {
          id: 'dpi',
          label: 'Número de DPI',
          type: 'text',
          declared: applicationData.applicantInfo.dpi,
          status: 'pending',
          required: true
        },
        {
          id: 'phone',
          label: 'Teléfono',
          type: 'text',
          declared: applicationData.applicantInfo.phone,
          status: 'pending',
          required: false
        },
        {
          id: 'mobile',
          label: 'Celular',
          type: 'text',
          declared: applicationData.applicantInfo.mobile,
          status: 'pending',
          required: true
        },
        {
          id: 'address',
          label: 'Dirección',
          type: 'text',
          declared: applicationData.applicantInfo.address,
          status: 'pending',
          required: true
        }
      ]
    },

    {
      id: 'location_presence',
      title: 'Ubicación y Presencia',
      description: 'Confirmación de presencia y validación de ubicación',
      required: true,
      order: 2,
      status: 'pending',
      progress: { completed: 0, total: 2, percentage: 0 },
      fields: [
        {
          id: 'person_found',
          label: '¿Encontró a la persona?',
          type: 'boolean',
          declared: true, // Se asume que debería estar
          status: 'pending',
          required: true
        },
        {
          id: 'location_valid',
          label: 'Ubicación válida',
          type: 'boolean',
          declared: true, // Se asume que la dirección es correcta
          status: 'pending',
          required: true
        }
      ]
    },

    {
      id: 'economic_activity',
      title: 'Actividad Económica',
      description: 'Verificación del negocio y actividad comercial',
      required: true,
      order: 3,
      status: 'pending',
      progress: { completed: 0, total: 4, percentage: 0 },
      fields: [
        {
          id: 'business_type',
          label: 'Tipo de negocio',
          type: 'text',
          declared: applicationData.economicActivity.businessType,
          status: 'pending',
          required: true
        },
        {
          id: 'business_active',
          label: '¿Negocio activo?',
          type: 'boolean',
          declared: applicationData.economicActivity.isActive,
          status: 'pending',
          required: true
        },
        {
          id: 'business_name',
          label: 'Nombre del negocio',
          type: 'text',
          declared: applicationData.economicActivity.businessName || 'Sin nombre',
          status: 'pending',
          required: false
        },
        {
          id: 'products_match',
          label: '¿Productos concuerdan?',
          type: 'boolean',
          declared: true, // Se asume que los productos declarados son correctos
          status: 'pending',
          required: true
        }
      ]
    },

    {
      id: 'financial_analysis',
      title: 'Análisis Financiero',
      description: 'Verificación de ingresos y egresos declarados',
      required: true,
      order: 4,
      status: 'pending',
      progress: { completed: 0, total: 2, percentage: 0 },
      fields: [
        {
          id: 'monthly_income',
          label: 'Ingresos mensuales',
          type: 'currency',
          declared: applicationData.financialInfo.monthlyIncome,
          status: 'pending',
          required: true,
          threshold: 15 // ±15% permitido
        },
        {
          id: 'monthly_expenses',
          label: 'Egresos mensuales',
          type: 'currency',
          declared: applicationData.financialInfo.monthlyExpenses,
          status: 'pending',
          required: true,
          threshold: 20 // ±20% permitido
        }
      ]
    },

    {
      id: 'credit_request',
      title: 'Solicitud de Crédito',
      description: 'Verificación de monto y términos solicitados',
      required: true,
      order: 5,
      status: 'pending',
      progress: { completed: 0, total: 3, percentage: 0 },
      fields: [
        {
          id: 'credit_amount',
          label: 'Monto solicitado',
          type: 'currency',
          declared: applicationData.financialInfo.creditAmount,
          status: 'pending',
          required: true,
          threshold: 10 // ±10% permitido
        },
        {
          id: 'term',
          label: 'Plazo (meses)',
          type: 'number',
          declared: applicationData.financialInfo.term,
          status: 'pending',
          required: true
        },
        {
          id: 'installment',
          label: 'Cuota mensual',
          type: 'currency',
          declared: applicationData.financialInfo.installment,
          status: 'pending',
          required: true
        }
      ]
    },

    {
      id: 'guarantors',
      title: 'Fiadores',
      description: 'Verificación de fiadores declarados',
      required: false,
      order: 6,
      status: 'pending',
      progress: { completed: 0, total: applicationData.guarantors.length, percentage: 0 },
      fields: applicationData.guarantors.map((guarantor, index) => ({
        id: `guarantor_${guarantor.id}`,
        label: `Fiador ${index + 1}: ${guarantor.fullName}`,
        type: 'boolean' as const,
        declared: true, // Se asume que el fiador está disponible
        status: 'pending' as const,
        required: index === 0 // Primer fiador es requerido
      }))
    }
  ];

  return sections;
};

/**
 * Calcula el progreso de una sección
 */
export const calculateSectionProgress = (section: INVCSection): INVCSection['progress'] => {
  const completedFields = section.fields.filter(field => 
    field.status === 'confirmed' || field.status === 'adjusted'
  ).length;
  
  const totalFields = section.fields.length;
  const percentage = totalFields > 0 ? Math.round((completedFields / totalFields) * 100) : 0;
  
  return {
    completed: completedFields,
    total: totalFields,
    percentage
  };
};

/**
 * Determina el estado de una sección basado en sus campos
 */
export const calculateSectionStatus = (section: INVCSection): INVCSection['status'] => {
  const hasBlocked = section.fields.some(field => field.status === 'blocked');
  if (hasBlocked) return 'blocked';
  
  const allCompleted = section.fields.every(field => 
    field.status === 'confirmed' || field.status === 'adjusted' || !field.required
  );
  if (allCompleted) return 'completed';
  
  const hasStarted = section.fields.some(field => field.status !== 'pending');
  return hasStarted ? 'in_progress' : 'pending';
};

/**
 * Actualiza el progreso y estado de todas las secciones
 */
export const updateSectionsProgress = (sections: INVCSection[]): INVCSection[] => {
  return sections.map(section => ({
    ...section,
    progress: calculateSectionProgress(section),
    status: calculateSectionStatus(section)
  }));
};

/**
 * Calcula el resumen general de la investigación
 */
export const calculateInvestigationSummary = (comparison: ComparisonInvestigation): ComparisonInvestigation['summary'] => {
  const allFields = comparison.sections.flatMap(section => section.fields);
  
  const totalFields = allFields.length;
  const completedFields = allFields.filter(field => field.status === 'confirmed').length;
  const adjustedFields = allFields.filter(field => field.status === 'adjusted').length;
  const blockedFields = allFields.filter(field => field.status === 'blocked').length;
  
  // Determinar riesgo general
  let overallRisk: ComparisonInvestigation['summary']['overallRisk'] = 'low';
  if (blockedFields > 0) overallRisk = 'critical';
  else if (adjustedFields > totalFields * 0.3) overallRisk = 'high';
  else if (adjustedFields > totalFields * 0.1) overallRisk = 'medium';
  
  // Determinar acción recomendada
  let recommendedAction: ComparisonInvestigation['summary']['recommendedAction'] = 'approve';
  if (overallRisk === 'critical') recommendedAction = 'reject';
  else if (overallRisk === 'high') recommendedAction = 'review';
  else if (overallRisk === 'medium') recommendedAction = 'approve_with_conditions';
  
  return {
    totalFields,
    completedFields,
    adjustedFields,
    blockedFields,
    overallRisk,
    recommendedAction
  };
};

/**
 * Valida si una investigación puede ser finalizada
 */
export const canFinalizeInvestigation = (comparison: ComparisonInvestigation): boolean => {
  // Verificar que no hay campos bloqueados críticos
  const criticalBlocked = comparison.sections.some(section => 
    section.required && section.status === 'blocked'
  );
  
  // Verificar que la geolocalización es válida
  const geoValid = comparison.fotometria.geo_ok;
  
  // Verificar que todos los campos requeridos están completados
  const requiredCompleted = comparison.sections.every(section => {
    if (!section.required) return true;
    return section.fields.filter(field => field.required).every(field => 
      field.status === 'confirmed' || field.status === 'adjusted'
    );
  });
  
  return !criticalBlocked && geoValid && requiredCompleted;
};

/**
 * Genera un reporte de discrepancias
 */
export const generateDiscrepancyReport = (comparison: ComparisonInvestigation) => {
  const discrepancies = Object.values(comparison.diffs);
  
  return {
    total: discrepancies.length,
    bySeverity: {
      low: discrepancies.filter(d => d.severity === 'low').length,
      medium: discrepancies.filter(d => d.severity === 'medium').length,
      high: discrepancies.filter(d => d.severity === 'high').length,
      critical: discrepancies.filter(d => d.severity === 'critical').length
    },
    autoDetected: discrepancies.filter(d => d.autoDetected).length,
    manuallyAdjusted: discrepancies.filter(d => !d.autoDetected).length
  };
};