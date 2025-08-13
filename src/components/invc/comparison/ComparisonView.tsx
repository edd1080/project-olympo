import React from 'react';
import { useComparison } from '@/context/ComparisonContext';
import { useInvestigation } from '@/context/InvestigationContext';
import { ComparisonHeader } from './ComparisonHeader';
import { StickyProgressSummary } from './StickyProgressSummary';
import { ComparisonFooter } from './ComparisonFooter';
import { SectionAccordion } from './SectionAccordion';
import { PersonalDataSection } from './sections/PersonalDataSection';
import { EconomicActivitySection } from './sections/EconomicActivitySection';
import { FinancialAnalysisSection } from './sections/FinancialAnalysisSection';

interface ComparisonViewProps {
  applicationId: string;
}

export const ComparisonView: React.FC<ComparisonViewProps> = ({ applicationId }) => {
  const { comparisons } = useComparison();
  const comparison = comparisons[applicationId];

  if (!comparison) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-muted-foreground">Cargando datos de comparación...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="comparison-view space-y-6">
      {/* Header con progreso global */}
      <ComparisonHeader comparison={comparison} />
      
      {/* Resumen pegajoso */}
      <StickyProgressSummary comparison={comparison} />
      
      {/* Secciones en acordeones */}
      <div className="space-y-4">
        {comparison.sections.map((section) => (
          <SectionAccordion key={section.id} section={section}>
            {section.id === 'personal_data' && (
              <PersonalDataSection 
                section={section} 
                applicationId={applicationId} 
              />
            )}
            {section.id === 'economic_activity' && (
              <EconomicActivitySection 
                section={section} 
                applicationId={applicationId} 
              />
            )}
            {section.id === 'financial_analysis' && (
              <FinancialAnalysisSection 
                section={section} 
                applicationId={applicationId} 
              />
            )}
          </SectionAccordion>
        ))}
      </div>
      
      {/* Footer con acción finalizar */}
      <ComparisonFooter 
        comparison={comparison} 
        applicationId={applicationId} 
      />
    </div>
  );
};