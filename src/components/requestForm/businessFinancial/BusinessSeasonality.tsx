import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

interface BusinessSeasonalityProps {
  formData: any;
  updateFormData: (field: string, value: any) => void;
}

const BusinessSeasonality: React.FC<BusinessSeasonalityProps> = ({ formData, updateFormData }) => {
  const seasonality = formData.businessSeasonality || {
    highSeasonMonths: '',
    lowSeasonMonths: '',
    notes: '',
  };

  const handleChange = (field: keyof typeof seasonality, value: string) => {
    updateFormData('businessSeasonality', {
      ...seasonality,
      [field]: value,
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Estacionalidad del negocio</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="highSeasonMonths">Meses de alta demanda</Label>
            <Input
              id="highSeasonMonths"
              placeholder="Ene, Feb, Mar"
              value={seasonality.highSeasonMonths}
              onChange={(e) => handleChange('highSeasonMonths', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="lowSeasonMonths">Meses de baja demanda</Label>
            <Input
              id="lowSeasonMonths"
              placeholder="Ago, Sep"
              value={seasonality.lowSeasonMonths}
              onChange={(e) => handleChange('lowSeasonMonths', e.target.value)}
            />
          </div>

          <div className="md:col-span-2 space-y-2">
            <Label htmlFor="notes">Observaciones</Label>
            <Textarea
              id="notes"
              placeholder="Describe cómo varían las ventas a lo largo del año"
              value={seasonality.notes}
              onChange={(e) => handleChange('notes', e.target.value)}
              rows={4}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BusinessSeasonality;
