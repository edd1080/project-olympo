import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { 
  ComparisonInvestigation, 
  ComparisonState, 
  ComparisonField, 
  INVCSection,
  ApplicationData,
  ComparisonConfig 
} from '@/types/invc-comparison';
import { useInvestigation } from './InvestigationContext';
import { useUser } from './UserContext';
import { calculateFieldDifference, validateThreshold, generateDefaultSections } from '@/utils/comparisonHelpers';

interface ComparisonContextType {
  // Gestión de investigaciones de comparación
  getComparison: (applicationId: string) => ComparisonInvestigation | null;
  initializeComparison: (applicationId: string, applicationData: ApplicationData) => void;
  
  // Gestión de campos
  updateFieldObserved: (applicationId: string, sectionId: string, fieldId: string, value: any) => void;
  confirmField: (applicationId: string, sectionId: string, fieldId: string) => void;
  adjustField: (applicationId: string, sectionId: string, fieldId: string, value: any, comment: string, evidence?: any[]) => void;
  blockField: (applicationId: string, sectionId: string, fieldId: string, reason: string) => void;
  
  // Gestión de secciones
  getSectionProgress: (applicationId: string, sectionId: string) => { completed: number; total: number; percentage: number };
  isSectionComplete: (applicationId: string, sectionId: string) => boolean;
  
  // Validaciones y umbrales
  validateField: (applicationId: string, sectionId: string, fieldId: string) => void;
  getFieldDifference: (field: ComparisonField) => number | null;
  
  // Resumen y finalización
  getSummary: (applicationId: string) => ComparisonInvestigation['summary'] | null;
  canFinalize: (applicationId: string) => boolean;
  finalizeComparison: (applicationId: string) => void;
  
  // Configuración
  config: ComparisonConfig;
  updateConfig: (newConfig: Partial<ComparisonConfig>) => void;
}

const ComparisonContext = createContext<ComparisonContextType | undefined>(undefined);

const STORAGE_KEY = 'invc_comparisons';
const CONFIG_STORAGE_KEY = 'invc_comparison_config';

// Configuración por defecto
const defaultConfig: ComparisonConfig = {
  defaultThresholds: {
    income: { fieldId: 'monthly_income', minPercentage: 10, maxPercentage: 25 },
    expenses: { fieldId: 'monthly_expenses', minPercentage: 15, maxPercentage: 30 },
    creditAmount: { fieldId: 'credit_amount', minPercentage: 5, maxPercentage: 20 }
  },
  adjustmentReasons: [
    { id: 'income_overestimated', label: 'Ingresos sobreestimados', category: 'income', severity: 'medium', requiresEvidence: true },
    { id: 'expenses_underestimated', label: 'Gastos subestimados', category: 'expenses', severity: 'medium', requiresEvidence: true },
    { id: 'no_economic_activity', label: 'Sin actividad económica activa', category: 'activity', severity: 'critical', requiresEvidence: true },
    { id: 'different_products', label: 'Productos diferentes a los declarados', category: 'products', severity: 'low', requiresEvidence: true },
    { id: 'incorrect_personal_info', label: 'Información personal incorrecta', category: 'personal', severity: 'high', requiresEvidence: false }
  ],
  validationRules: {
    geoRadiusMeters: 500,
    incomeThresholdPercent: 15,
    expenseThresholdPercent: 20,
    productMatchPercent: 70
  },
  autoSaveInterval: 500,
  geoAccuracyRequired: 50
};

export const ComparisonProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [comparisons, setComparisons] = useState<ComparisonState>({});
  const [config, setConfig] = useState<ComparisonConfig>(defaultConfig);
  const { user } = useUser();
  const investigation = useInvestigation();

  // Cargar desde localStorage al montar
  useEffect(() => {
    try {
      const storedComparisons = localStorage.getItem(STORAGE_KEY);
      const storedConfig = localStorage.getItem(CONFIG_STORAGE_KEY);
      
      if (storedComparisons) {
        setComparisons(JSON.parse(storedComparisons));
      }
      
      if (storedConfig) {
        setConfig({ ...defaultConfig, ...JSON.parse(storedConfig) });
      }
    } catch (error) {
      console.error('Error loading comparison data from localStorage:', error);
    }
  }, []);

  // Guardar en localStorage cuando cambie el estado
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(comparisons));
    } catch (error) {
      console.error('Error saving comparisons to localStorage:', error);
    }
  }, [comparisons]);

  // Guardar configuración en localStorage
  useEffect(() => {
    try {
      localStorage.setItem(CONFIG_STORAGE_KEY, JSON.stringify(config));
    } catch (error) {
      console.error('Error saving config to localStorage:', error);
    }
  }, [config]);

  // Auto-guardado con debounce
  const debouncedSave = useCallback(
    debounce((applicationId: string, updatedComparison: ComparisonInvestigation) => {
      setComparisons(prev => ({
        ...prev,
        [applicationId]: updatedComparison
      }));
    }, config.autoSaveInterval),
    [config.autoSaveInterval]
  );

  const getComparison = (applicationId: string): ComparisonInvestigation | null => {
    return comparisons[applicationId] || null;
  };

  const initializeComparison = (applicationId: string, applicationData: ApplicationData) => {
    if (comparisons[applicationId]) return;

    const baseInvestigation = investigation.getInvestigation(applicationId);
    if (!baseInvestigation) {
      investigation.initializeInvestigation(applicationId);
    }

    const sections = generateDefaultSections(applicationData);
    
    const newComparison: ComparisonInvestigation = {
      ...(baseInvestigation || investigation.getInvestigation(applicationId)!),
      applicationData,
      sections,
      diffs: {},
      fotometria: {
        negocio_ok: false,
        solicitante_ok: false,
        geo_ok: false,
        additional_photos: 0
      },
      thresholds: config.defaultThresholds,
      validationRules: config.validationRules,
      summary: {
        totalFields: sections.reduce((acc, section) => acc + section.fields.length, 0),
        completedFields: 0,
        adjustedFields: 0,
        blockedFields: 0,
        overallRisk: 'low',
        recommendedAction: 'approve'
      }
    };

    setComparisons(prev => ({
      ...prev,
      [applicationId]: newComparison
    }));
  };

  const updateFieldObserved = (applicationId: string, sectionId: string, fieldId: string, value: any) => {
    const comparison = comparisons[applicationId];
    if (!comparison) return;

    const updatedSections = comparison.sections.map(section => {
      if (section.id !== sectionId) return section;
      
      const updatedFields = section.fields.map(field => {
        if (field.id !== fieldId) return field;
        
        return {
          ...field,
          observed: value,
          status: 'pending' as const,
          timestamp: new Date()
        };
      });

      return { ...section, fields: updatedFields };
    });

    const updatedComparison = { ...comparison, sections: updatedSections };
    debouncedSave(applicationId, updatedComparison);
  };

  const confirmField = (applicationId: string, sectionId: string, fieldId: string) => {
    const comparison = comparisons[applicationId];
    if (!comparison) return;

    const updatedComparison = updateFieldStatus(comparison, sectionId, fieldId, 'confirmed');
    setComparisons(prev => ({ ...prev, [applicationId]: updatedComparison }));
    
    // Actualizar el contexto de investigación base
    const field = findField(updatedComparison, sectionId, fieldId);
    if (field) {
      investigation.updateCardStatus(applicationId, fieldId, 'confirmed');
    }
  };

  const adjustField = (applicationId: string, sectionId: string, fieldId: string, value: any, comment: string, evidence?: any[]) => {
    const comparison = comparisons[applicationId];
    if (!comparison) return;

    const updatedComparison = updateFieldWithAdjustment(comparison, sectionId, fieldId, value, comment, evidence);
    setComparisons(prev => ({ ...prev, [applicationId]: updatedComparison }));
    
    investigation.updateCardStatus(applicationId, fieldId, 'mismatch');
    if (comment) {
      investigation.addCardComment(applicationId, fieldId, comment);
    }
  };

  const blockField = (applicationId: string, sectionId: string, fieldId: string, reason: string) => {
    const comparison = comparisons[applicationId];
    if (!comparison) return;

    const updatedComparison = updateFieldStatus(comparison, sectionId, fieldId, 'blocked', reason);
    setComparisons(prev => ({ ...prev, [applicationId]: updatedComparison }));
    
    investigation.updateCardStatus(applicationId, fieldId, 'blocked');
    investigation.addCardComment(applicationId, fieldId, reason);
  };

  const validateField = (applicationId: string, sectionId: string, fieldId: string) => {
    const comparison = comparisons[applicationId];
    if (!comparison) return;

    const field = findField(comparison, sectionId, fieldId);
    if (!field) return;

    const difference = calculateFieldDifference(field);
    const threshold = comparison.thresholds[fieldId];
    
    if (difference !== null && threshold) {
      const isValid = validateThreshold(difference, threshold);
      if (!isValid && field.status === 'pending') {
        // Auto-marcar como ajustado si excede el umbral
        adjustField(applicationId, sectionId, fieldId, field.observed, 'Diferencia detectada automáticamente');
      }
    }
  };

  const getFieldDifference = (field: ComparisonField): number | null => {
    return calculateFieldDifference(field);
  };

  const getSectionProgress = (applicationId: string, sectionId: string) => {
    const comparison = comparisons[applicationId];
    if (!comparison) return { completed: 0, total: 0, percentage: 0 };

    const section = comparison.sections.find(s => s.id === sectionId);
    if (!section) return { completed: 0, total: 0, percentage: 0 };

    return section.progress;
  };

  const isSectionComplete = (applicationId: string, sectionId: string): boolean => {
    const progress = getSectionProgress(applicationId, sectionId);
    return progress.percentage === 100;
  };

  const getSummary = (applicationId: string) => {
    const comparison = comparisons[applicationId];
    return comparison?.summary || null;
  };

  const canFinalize = (applicationId: string): boolean => {
    const comparison = comparisons[applicationId];
    if (!comparison) return false;

    // No se puede finalizar si hay campos bloqueados críticos
    const criticalBlocked = comparison.summary.blockedFields > 0;
    const geoValid = comparison.fotometria.geo_ok;
    
    return !criticalBlocked && geoValid;
  };

  const finalizeComparison = (applicationId: string) => {
    const comparison = comparisons[applicationId];
    if (!comparison || !canFinalize(applicationId)) return;

    const updatedComparison = {
      ...comparison,
      metadata: {
        ...comparison.metadata,
        completedAt: new Date()
      }
    };

    setComparisons(prev => ({ ...prev, [applicationId]: updatedComparison }));
    investigation.completeInvestigation(applicationId);
  };

  const updateConfig = (newConfig: Partial<ComparisonConfig>) => {
    setConfig(prev => ({ ...prev, ...newConfig }));
  };

  // Funciones auxiliares
  const findField = (comparison: ComparisonInvestigation, sectionId: string, fieldId: string): ComparisonField | null => {
    const section = comparison.sections.find(s => s.id === sectionId);
    return section?.fields.find(f => f.id === fieldId) || null;
  };

  const updateFieldStatus = (
    comparison: ComparisonInvestigation, 
    sectionId: string, 
    fieldId: string, 
    status: ComparisonField['status'],
    comment?: string
  ): ComparisonInvestigation => {
    const updatedSections = comparison.sections.map(section => {
      if (section.id !== sectionId) return section;
      
      const updatedFields = section.fields.map(field => {
        if (field.id !== fieldId) return field;
        
        return {
          ...field,
          status,
          comment: comment || field.comment,
          timestamp: new Date()
        };
      });

      const completed = updatedFields.filter(f => f.status === 'confirmed').length;
      const progress = {
        completed,
        total: updatedFields.length,
        percentage: Math.round((completed / updatedFields.length) * 100)
      };

      return { 
        ...section, 
        fields: updatedFields,
        progress,
        status: progress.percentage === 100 ? 'completed' as const : 'in_progress' as const
      };
    });

    return { ...comparison, sections: updatedSections };
  };

  const updateFieldWithAdjustment = (
    comparison: ComparisonInvestigation,
    sectionId: string,
    fieldId: string,
    value: any,
    comment: string,
    evidence?: any[]
  ): ComparisonInvestigation => {
    const field = findField(comparison, sectionId, fieldId);
    if (!field) return comparison;

    const difference = calculateFieldDifference({ ...field, observed: value });
    
    const updatedComparison = updateFieldStatus(comparison, sectionId, fieldId, 'adjusted', comment);
    
    // Registrar la diferencia
    if (difference !== null) {
      updatedComparison.diffs[fieldId] = {
        field: fieldId,
        declaredValue: field.declared,
        observedValue: value,
        difference,
        severity: difference > 25 ? 'critical' : difference > 15 ? 'high' : 'medium',
        autoDetected: false
      };
    }

    return updatedComparison;
  };

  const value: ComparisonContextType = {
    getComparison,
    initializeComparison,
    updateFieldObserved,
    confirmField,
    adjustField,
    blockField,
    getSectionProgress,
    isSectionComplete,
    validateField,
    getFieldDifference,
    getSummary,
    canFinalize,
    finalizeComparison,
    config,
    updateConfig
  };

  return (
    <ComparisonContext.Provider value={value}>
      {children}
    </ComparisonContext.Provider>
  );
};

export const useComparison = () => {
  const context = useContext(ComparisonContext);
  if (context === undefined) {
    throw new Error('useComparison must be used within a ComparisonProvider');
  }
  return context;
};

// Utility function for debounce
function debounce<T extends (...args: any[]) => any>(func: T, wait: number): T {
  let timeout: NodeJS.Timeout;
  return ((...args: any[]) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  }) as T;
}