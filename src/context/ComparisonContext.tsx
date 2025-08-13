import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { 
  ComparisonInvestigation, 
  ComparisonState, 
  ComparisonField, 
  INVCSection,
  ApplicationData,
  ComparisonConfig 
} from '@/types/invc-comparison';
import { generateDefaultSections, calculateInvestigationSummary } from '@/utils/comparisonHelpers';
import { getApplicationData } from '@/data/mockApplicationData';

interface ComparisonContextType {
  // State
  comparisons: ComparisonState;
  config: ComparisonConfig;
  
  // Main functions
  initializeComparison: (applicationId: string, applicationData?: ApplicationData) => Promise<ComparisonInvestigation>;
  updateFieldObserved: (applicationId: string, fieldId: string, value: any) => Promise<void>;
  confirmField: (applicationId: string, fieldId: string) => Promise<void>;
  adjustField: (applicationId: string, fieldId: string, reason: string, comment?: string) => Promise<void>;
  blockField: (applicationId: string, fieldId: string, reason: string, comment?: string) => Promise<void>;
  finalizeComparison: (applicationId: string) => Promise<any>;
  
  // Config management
  updateConfig: (newConfig: Partial<ComparisonConfig>) => void;
}

const ComparisonContext = createContext<ComparisonContextType | undefined>(undefined);

// Default configuration
const defaultConfig: ComparisonConfig = {
  defaultThresholds: {},
  adjustmentReasons: [],
  validationRules: {
    geoRadiusMeters: 100,
    incomeThresholdPercent: 15,
    expenseThresholdPercent: 20,
    productMatchPercent: 70
  },
  autoSaveInterval: 5000,
  geoAccuracyRequired: 50
};

export const ComparisonProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [comparisons, setComparisons] = useState<ComparisonState>({});
  const [config, setConfig] = useState<ComparisonConfig>(defaultConfig);

  const initializeComparison = useCallback(async (applicationId: string, providedData?: ApplicationData): Promise<ComparisonInvestigation> => {
    // Get application data
    const applicationData = providedData || getApplicationData(applicationId) || {
      applicationId,
      applicantName: 'Solicitante Desconocido',
      applicantInfo: {
        fullName: 'Nombre no disponible',
        dpi: '0000000000000',
        phone: '',
        mobile: '',
        address: '',
      },
      economicActivity: {
        businessType: '',
        isActive: false,
        products: []
      },
      financialInfo: {
        monthlyIncome: 0,
        monthlyExpenses: 0,
        creditAmount: 0,
        term: 0,
        installment: 0
      },
      guarantors: [],
      metadata: {
        createdAt: new Date(),
        agentId: '',
        lastModified: new Date()
      }
    };

    // Generate sections from application data
    const sections = generateDefaultSections(applicationData);

    // Create investigation object
    const investigation: ComparisonInvestigation = {
      applicationId,
      applicantName: applicationData.applicantName,
      cards: [], // Compatibility with existing Investigation type
      presence: null,
      geoValidation: null,
      progress: { completed: 0, total: sections.reduce((acc, section) => acc + section.fields.length, 0), percentage: 0 },
      discrepancies: [],
      metadata: { createdAt: new Date(), agentId: '', lastModified: new Date() },
      
      // Comparison-specific properties
      applicationData,
      sections,
      detectedDifferences: [],
      diffs: {},
      fotometria: {
        negocio_ok: false,
        solicitante_ok: false,
        geo_ok: false,
        additional_photos: 0
      },
      thresholds: {},
      validationRules: config.validationRules,
      summary: {
        totalFields: sections.reduce((acc, section) => acc + section.fields.length, 0),
        completedFields: 0,
        confirmedFields: 0,
        adjustedFields: 0,
        blockedFields: 0,
        overallStatus: 'pending',
        overallRisk: 'low',
        recommendedAction: 'approve'
      }
    };

    // Update state
    setComparisons(prev => ({
      ...prev,
      [applicationId]: investigation
    }));

    return investigation;
  }, [config]);

  const updateFieldObserved = useCallback(async (applicationId: string, fieldId: string, value: any): Promise<void> => {
    setComparisons(prev => {
      const comparison = prev[applicationId];
      if (!comparison) return prev;

      const updatedSections = comparison.sections.map(section => ({
        ...section,
        fields: section.fields.map(field => 
          field.id === fieldId 
            ? { ...field, observedValue: value }
            : field
        )
      }));

      const updated = {
        ...comparison,
        sections: updatedSections,
        summary: calculateInvestigationSummary({ ...comparison, sections: updatedSections })
      };

      return {
        ...prev,
        [applicationId]: updated
      };
    });
  }, []);

  const confirmField = useCallback(async (applicationId: string, fieldId: string): Promise<void> => {
    setComparisons(prev => {
      const comparison = prev[applicationId];
      if (!comparison) return prev;

      const updatedSections = comparison.sections.map(section => ({
        ...section,
        fields: section.fields.map(field => 
          field.id === fieldId 
            ? { ...field, status: 'confirmed' as const }
            : field
        )
      }));

      const updated = {
        ...comparison,
        sections: updatedSections,
        summary: calculateInvestigationSummary({ ...comparison, sections: updatedSections })
      };

      return {
        ...prev,
        [applicationId]: updated
      };
    });
  }, []);

  const adjustField = useCallback(async (applicationId: string, fieldId: string, reason: string, comment?: string): Promise<void> => {
    setComparisons(prev => {
      const comparison = prev[applicationId];
      if (!comparison) return prev;

      const updatedSections = comparison.sections.map(section => ({
        ...section,
        fields: section.fields.map(field => 
          field.id === fieldId 
            ? { 
                ...field, 
                status: 'adjusted' as const,
                adjustmentReason: reason,
                comment: comment || field.comment
              }
            : field
        )
      }));

      const updated = {
        ...comparison,
        sections: updatedSections,
        summary: calculateInvestigationSummary({ ...comparison, sections: updatedSections })
      };

      return {
        ...prev,
        [applicationId]: updated
      };
    });
  }, []);

  const blockField = useCallback(async (applicationId: string, fieldId: string, reason: string, comment?: string): Promise<void> => {
    setComparisons(prev => {
      const comparison = prev[applicationId];
      if (!comparison) return prev;

      const updatedSections = comparison.sections.map(section => ({
        ...section,
        fields: section.fields.map(field => 
          field.id === fieldId 
            ? { 
                ...field, 
                status: 'blocked' as const,
                adjustmentReason: reason,
                comment: comment || field.comment
              }
            : field
        )
      }));

      const updated = {
        ...comparison,
        sections: updatedSections,
        summary: calculateInvestigationSummary({ ...comparison, sections: updatedSections })
      };

      return {
        ...prev,
        [applicationId]: updated
      };
    });
  }, []);

  const finalizeComparison = useCallback(async (applicationId: string): Promise<any> => {
    const comparison = comparisons[applicationId];
    if (!comparison) throw new Error('Comparison not found');

    // Here you would typically save to backend
    console.log('Finalizing comparison:', comparison);
    
    return comparison;
  }, [comparisons]);

  const updateConfig = useCallback((newConfig: Partial<ComparisonConfig>) => {
    setConfig(prev => ({ ...prev, ...newConfig }));
  }, []);

  return (
    <ComparisonContext.Provider value={{
      comparisons,
      config,
      initializeComparison,
      updateFieldObserved,
      confirmField,
      adjustField,
      blockField,
      finalizeComparison,
      updateConfig
    }}>
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