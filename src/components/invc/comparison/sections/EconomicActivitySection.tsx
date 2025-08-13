import React from 'react';
import { ComparisonRow } from '../ComparisonRow';
import { ProductsList } from '../components/ProductsList';
import { PhotoComparison } from '../components/PhotoComparison';
import type { INVCSection } from '@/types/invc-comparison';

interface EconomicActivitySectionProps {
  section: INVCSection;
  applicationId: string;
}

export const EconomicActivitySection: React.FC<EconomicActivitySectionProps> = ({ 
  section, 
  applicationId 
}) => {
  const getFieldComponent = (field: any) => {
    if (field.fieldName === 'products') {
      return (
        <ProductsList
          field={field}
          applicationId={applicationId}
        />
      );
    }

    if (field.fieldName === 'business_photos') {
      return (
        <PhotoComparison
          field={field}
          applicationId={applicationId}
          photoType="business"
          allowMultiple={true}
        />
      );
    }

    return (
      <ComparisonRow
        key={field.id}
        field={field}
        onObservedChange={(value) => {
          console.log('Observed change:', field.fieldName, value);
        }}
        onConfirm={() => {
          console.log('Confirmed:', field.fieldName);
        }}
        onAdjust={(reason) => {
          console.log('Adjusted:', field.fieldName, reason);
        }}
        onBlock={(reason) => {
          console.log('Blocked:', field.fieldName, reason);
        }}
        showDifference={field.type === 'text'}
      />
    );
  };

  return (
    <div className="space-y-4">
      <div className="text-sm text-muted-foreground mb-4">
        Verificar la actividad económica declarada y confirmar los productos o servicios del negocio.
      </div>
      
      {section.fields.map((field) => getFieldComponent(field))}
      
      <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
        <h4 className="font-medium text-green-900 mb-2">Criterios de Evaluación</h4>
        <ul className="text-sm text-green-800 space-y-1">
          <li>• Negocio debe estar activo y operando</li>
          <li>• Mínimo 70% de coincidencia en productos declarados</li>
          <li>• Fotos deben mostrar evidencia clara del negocio</li>
          <li>• Nombre del negocio debe ser visible o verificable</li>
        </ul>
      </div>
    </div>
  );
};