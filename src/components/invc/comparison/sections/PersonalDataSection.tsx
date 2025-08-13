import React from 'react';
import { ComparisonRow } from '../ComparisonRow';
import { PhotoComparison } from '../components/PhotoComparison';
import type { INVCSection } from '@/types/invc-comparison';

interface PersonalDataSectionProps {
  section: INVCSection;
  applicationId: string;
}

export const PersonalDataSection: React.FC<PersonalDataSectionProps> = ({ 
  section, 
  applicationId 
}) => {
  const getFieldComponent = (field: any) => {
    if (field.fieldName === 'applicant_photo') {
      return (
        <PhotoComparison
          field={field}
          applicationId={applicationId}
          photoType="applicant"
        />
      );
    }

    return (
      <ComparisonRow
        key={field.id}
        field={field}
        onObservedChange={(value) => {
          // Handle observed value change
          console.log('Observed change:', field.fieldName, value);
        }}
        onConfirm={() => {
          // Handle confirmation
          console.log('Confirmed:', field.fieldName);
        }}
        onAdjust={(reason, comment) => {
          // Handle adjustment
          console.log('Adjusted:', field.fieldName, reason, comment);
        }}
        onBlock={(reason, comment) => {
          // Handle blocking
          console.log('Blocked:', field.fieldName, reason, comment);
        }}
        showDifference={field.type === 'text'}
      />
    );
  };

  return (
    <div className="space-y-4">
      <div className="text-sm text-muted-foreground mb-4">
        Verificar que los datos personales declarados coincidan con la información observada.
      </div>
      
      {section.fields.map((field) => getFieldComponent(field))}
      
      <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <h4 className="font-medium text-blue-900 mb-2">Validaciones Importantes</h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Verificar que el DPI tenga formato válido guatemalteco</li>
          <li>• Confirmar que los teléfonos estén activos</li>
          <li>• Validar dirección con geolocalización actual</li>
          <li>• Comparar foto del solicitante con documento de identidad</li>
        </ul>
      </div>
    </div>
  );
};