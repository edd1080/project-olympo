import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

interface AdditionalDataFormProps {
  formData: any;
  updateFormData: (field: string, value: any) => void;
}

const AdditionalDataForm: React.FC<AdditionalDataFormProps> = ({ formData, updateFormData }) => {
  return (
    <div className="space-y-6">
      {/* Subtitle */}
      <h3 className="text-subtitle text-secondary-foreground">Información adicional</h3>
      
      {/* Placeholder for additional fields */}
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="additionalNotes" className="text-label">
            Observaciones adicionales
          </Label>
          <Textarea
            id="additionalNotes"
            value={formData.additionalNotes || ''}
            onChange={(e) => updateFormData('additionalNotes', e.target.value)}
            placeholder="Información adicional relevante para la solicitud..."
            rows={4}
          />
        </div>
      </div>

      {/* This form can be extended with more fields as needed */}
      <div className="text-center text-muted-foreground">
        <p className="text-sm">
          Este formulario puede expandirse con campos adicionales según sea necesario.
        </p>
      </div>
    </div>
  );
};

export default AdditionalDataForm;