import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { AuthorizationSection } from '@/types/authorization';
import { ChevronRight, CheckCircle, Clock, AlertTriangle } from 'lucide-react';

interface SectionNavigationProps {
  sections: AuthorizationSection[];
  currentSection: number;
  onSectionChange: (sectionIndex: number) => void;
  onContinue: () => void;
}

export const SectionNavigation: React.FC<SectionNavigationProps> = ({
  sections,
  currentSection,
  onSectionChange,
  onContinue
}) => {
  const getSectionIcon = (section: AuthorizationSection) => {
    switch (section.status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'blocked':
        return <AlertTriangle className="h-4 w-4 text-red-600" />;
      default:
        return <Clock className="h-4 w-4 text-amber-600" />;
    }
  };

  const getSectionBadge = (section: AuthorizationSection) => {
    const variants = {
      completed: { variant: 'secondary' as const, label: 'Completada' },
      blocked: { variant: 'destructive' as const, label: 'Bloqueada' },
      pending: { variant: 'default' as const, label: 'Pendiente' },
    };
    
    return variants[section.status] || variants.pending;
  };

  const currentSectionData = sections[currentSection];
  const isLastSection = currentSection === sections.length - 1;

  return (
    <div className="space-y-4">
      {/* Integrated Section Header and Navigation */}
      <div className="space-y-4">
        {/* Current Section Info */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {getSectionIcon(currentSectionData)}
            <div>
              <h3 className="font-medium">{currentSectionData.name}</h3>
              <p className="text-sm text-muted-foreground">
                Sección {currentSection + 1} de {sections.length}
                {currentSectionData.required && ' (Requerida)'}
              </p>
            </div>
          </div>
          <Badge {...getSectionBadge(currentSectionData)}>
            {getSectionBadge(currentSectionData).label}
          </Badge>
        </div>

        {/* Section Tabs - Horizontal scroll */}
        <div className="overflow-x-auto">
          <div className="flex gap-2 pb-2" style={{ width: 'max-content' }}>
            {sections.map((section, index) => (
              <Button
                key={section.id}
                variant={index === currentSection ? 'default' : 'outline'}
                size="sm"
                onClick={() => onSectionChange(index)}
                className="shrink-0"
              >
                <span className="mr-2">{index + 1}</span>
                {getSectionIcon(section)}
                <span className="ml-2 hidden sm:inline">{section.name}</span>
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Navigation Controls */}
      <div className="flex justify-between">
        <Button
          variant="outline"
          disabled={currentSection === 0}
          onClick={() => onSectionChange(currentSection - 1)}
        >
          Anterior
        </Button>
        
        <div className="flex gap-2">
          {!isLastSection && (
            <Button
              variant="outline"
              onClick={() => onSectionChange(currentSection + 1)}
            >
              Siguiente
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};