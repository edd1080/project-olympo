
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

interface CharacterAnalysisProps {
  formData: any;
  updateFormData: (field: string, value: any) => void;
}

const CharacterAnalysis: React.FC<CharacterAnalysisProps> = ({ formData, updateFormData }) => {
  // Helper function to handle switch changes
  const handleSwitchChange = (field: string, checked: boolean) => {
    updateFormData(field, checked);
  };

  return (
    <Card className="border-0 shadow-none">
      <CardContent className="p-0 space-y-6">
        <div>
          <h3 className="font-semibold text-lg">Análisis de carácter</h3>
          <p className="text-muted-foreground text-sm">
            Por favor responde las siguientes preguntas sobre el solicitante.
          </p>
        </div>

        {/* Personal aspects section */}
        <div className="space-y-4">
          <h4 className="font-medium text-primary">Aspectos a considerar</h4>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b pb-2">
              <Label htmlFor="hasAlcoholismOrViolence" className="flex-1">
                ¿El solicitante tiene antecedentes de alcoholismo y/o violencia?
              </Label>
              <Switch 
                id="hasAlcoholismOrViolence"
                checked={formData.hasAlcoholismOrViolence || false}
                onCheckedChange={(checked) => handleSwitchChange('hasAlcoholismOrViolence', checked)}
              />
            </div>
            
            <div className="flex items-center justify-between border-b pb-2">
              <Label htmlFor="livesInHighRiskZone" className="flex-1">
                ¿El solicitante vive en una zona de alto riesgo?
              </Label>
              <Switch 
                id="livesInHighRiskZone"
                checked={formData.livesInHighRiskZone || false}
                onCheckedChange={(checked) => handleSwitchChange('livesInHighRiskZone', checked)}
              />
            </div>
            
            <div className="flex items-center justify-between border-b pb-2">
              <Label htmlFor="livesInSamePlaceTwoYears" className="flex-1">
                ¿El solicitante reside en el mismo lugar hace más de dos años?
              </Label>
              <Switch 
                id="livesInSamePlaceTwoYears"
                checked={formData.livesInSamePlaceTwoYears || false}
                onCheckedChange={(checked) => handleSwitchChange('livesInSamePlaceTwoYears', checked)}
              />
            </div>
            
            <div className="flex items-center justify-between border-b pb-2">
              <Label htmlFor="informedSpouseAboutFinancing" className="flex-1">
                ¿El solicitante informó a su cónyuge/encargado sobre el financiamiento?
              </Label>
              <Switch 
                id="informedSpouseAboutFinancing"
                checked={formData.informedSpouseAboutFinancing || false}
                onCheckedChange={(checked) => handleSwitchChange('informedSpouseAboutFinancing', checked)}
              />
            </div>
            
            <div className="flex items-center justify-between border-b pb-2">
              <Label htmlFor="hasGoodNeighborReferences" className="flex-1">
                ¿El solicitante cuenta con buenas referencias de sus vecinos?
              </Label>
              <Switch 
                id="hasGoodNeighborReferences"
                checked={formData.hasGoodNeighborReferences || false}
                onCheckedChange={(checked) => handleSwitchChange('hasGoodNeighborReferences', checked)}
              />
            </div>
          </div>
        </div>

        {/* Project aspects section */}
        <div className="space-y-4">
          <h4 className="font-medium text-primary">Sobre el proyecto</h4>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b pb-2">
              <Label htmlFor="hasCreditPurposeClarity" className="flex-1">
                ¿El solicitante tiene claridad del destino del crédito?
              </Label>
              <Switch 
                id="hasCreditPurposeClarity"
                checked={formData.hasCreditPurposeClarity || false}
                onCheckedChange={(checked) => handleSwitchChange('hasCreditPurposeClarity', checked)}
              />
            </div>
            
            <div className="flex items-center justify-between border-b pb-2">
              <Label htmlFor="businessInHighRiskArea" className="flex-1">
                ¿El negocio se encuentra en un sector geográfico de alto riesgo?
              </Label>
              <Switch 
                id="businessInHighRiskArea"
                checked={formData.businessInHighRiskArea || false}
                onCheckedChange={(checked) => handleSwitchChange('businessInHighRiskArea', checked)}
              />
            </div>
            
            <div className="flex items-center justify-between border-b pb-2">
              <Label htmlFor="businessOlderThanOneYear" className="flex-1">
                ¿La antigüedad del negocio es mayor a un año?
              </Label>
              <Switch 
                id="businessOlderThanOneYear"
                checked={formData.businessOlderThanOneYear || false}
                onCheckedChange={(checked) => handleSwitchChange('businessOlderThanOneYear', checked)}
              />
            </div>
            
            <div className="flex items-center justify-between border-b pb-2">
              <Label htmlFor="hasOtherEconomicActivities" className="flex-1">
                ¿El solicitante cuenta con otras actividades económicas?
              </Label>
              <Switch 
                id="hasOtherEconomicActivities"
                checked={formData.hasOtherEconomicActivities || false}
                onCheckedChange={(checked) => handleSwitchChange('hasOtherEconomicActivities', checked)}
              />
            </div>
            
            <div className="flex items-center justify-between border-b pb-2">
              <Label htmlFor="keepsWrittenRecords" className="flex-1">
                ¿El solicitante lleva registros escritos de sus compras y ventas?
              </Label>
              <Switch 
                id="keepsWrittenRecords"
                checked={formData.keepsWrittenRecords || false}
                onCheckedChange={(checked) => handleSwitchChange('keepsWrittenRecords', checked)}
              />
            </div>
          </div>
        </div>

        {/* References and payment record section */}
        <div className="space-y-4">
          <h4 className="font-medium text-primary">Sobre referencia y récord de pago</h4>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b pb-2">
              <Label htmlFor="hasSatisfactorySIBReferences" className="flex-1">
                ¿El solicitante posee referencias satisfactorias en la SIB?
              </Label>
              <Switch 
                id="hasSatisfactorySIBReferences"
                checked={formData.hasSatisfactorySIBReferences || false}
                onCheckedChange={(checked) => handleSwitchChange('hasSatisfactorySIBReferences', checked)}
              />
            </div>
            
            <div className="flex items-center justify-between border-b pb-2">
              <Label htmlFor="hasInternalRatingAB" className="flex-1">
                ¿El solicitante tiene calificación interna de pago A o B?
              </Label>
              <Switch 
                id="hasInternalRatingAB"
                checked={formData.hasInternalRatingAB || false}
                onCheckedChange={(checked) => handleSwitchChange('hasInternalRatingAB', checked)}
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CharacterAnalysis;
