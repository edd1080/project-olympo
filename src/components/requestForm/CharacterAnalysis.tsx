import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, User, Building2, FileText } from 'lucide-react';

interface CharacterAnalysisProps {
  formData: any;
  updateFormData: (field: string, value: any) => void;
}

const CharacterAnalysis: React.FC<CharacterAnalysisProps> = ({ formData, updateFormData }) => {
  const handleSwitchChange = (field: string, checked: boolean) => {
    updateFormData(field, checked);
  };

  const getSwitchIndicator = (isPositive: boolean, checked: boolean) => {
    const isGood = isPositive ? checked : !checked;
    return (
      <div className="flex items-center gap-2">
        {isGood ? (
          <CheckCircle className="h-4 w-4 text-green-600" />
        ) : (
          <XCircle className="h-4 w-4 text-red-600" />
        )}
        <Badge variant={isGood ? "secondary" : "destructive"} className="text-xs">
          {isGood ? "Positivo" : "Negativo"}
        </Badge>
      </div>
    );
  };

  const CharacterSection = ({ 
    title, 
    icon: Icon, 
    children 
  }: { 
    title: string; 
    icon: React.ElementType; 
    children: React.ReactNode;
  }) => (
    <Card className="border border-border/50 shadow-sm hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-lg bg-primary/10">
            <Icon className="h-5 w-5 text-primary" />
          </div>
          <h4 className="font-semibold text-lg text-foreground">{title}</h4>
        </div>
        <div className="space-y-6">
          {children}
        </div>
      </CardContent>
    </Card>
  );

  const SwitchItem = ({ 
    id, 
    label, 
    checked, 
    isPositive = true,
    onChange 
  }: {
    id: string;
    label: string;
    checked: boolean;
    isPositive?: boolean;
    onChange: (checked: boolean) => void;
  }) => (
    <div className="flex items-start justify-between gap-4 p-4 rounded-lg bg-card/50 border border-border/30 hover:bg-accent/20 transition-colors">
      <div className="flex-1 space-y-2">
        <Label htmlFor={id} className="text-sm font-medium leading-5 cursor-pointer">
          {label}
        </Label>
        {getSwitchIndicator(isPositive, checked)}
      </div>
      <Switch 
        id={id}
        checked={checked}
        onCheckedChange={onChange}
        className="shrink-0"
      />
    </div>
  );

  return (
    <div className="space-y-8">
      <div className="space-y-3">
        <h3 className="font-bold text-2xl text-foreground">Análisis de carácter</h3>
        <p className="text-muted-foreground">
          Evalúa las características del solicitante marcando cada aspecto. Los indicadores muestran si la respuesta es positiva o negativa para la evaluación crediticia.
        </p>
      </div>

      <div className="space-y-6">
        {/* Personal aspects section */}
        <CharacterSection title="Aspectos personales" icon={User}>
          <SwitchItem
            id="hasAlcoholismOrViolence"
            label="¿El solicitante tiene antecedentes de alcoholismo y/o violencia?"
            checked={formData.hasAlcoholismOrViolence || false}
            isPositive={false}
            onChange={(checked) => handleSwitchChange('hasAlcoholismOrViolence', checked)}
          />
          
          <SwitchItem
            id="livesInHighRiskZone"
            label="¿El solicitante vive en una zona de alto riesgo?"
            checked={formData.livesInHighRiskZone || false}
            isPositive={false}
            onChange={(checked) => handleSwitchChange('livesInHighRiskZone', checked)}
          />
          
          <SwitchItem
            id="livesInSamePlaceTwoYears"
            label="¿El solicitante reside en el mismo lugar hace más de dos años?"
            checked={formData.livesInSamePlaceTwoYears || false}
            isPositive={true}
            onChange={(checked) => handleSwitchChange('livesInSamePlaceTwoYears', checked)}
          />
          
          <SwitchItem
            id="informedSpouseAboutFinancing"
            label="¿El solicitante informó a su cónyuge/encargado sobre el financiamiento?"
            checked={formData.informedSpouseAboutFinancing || false}
            isPositive={true}
            onChange={(checked) => handleSwitchChange('informedSpouseAboutFinancing', checked)}
          />
          
          <SwitchItem
            id="hasGoodNeighborReferences"
            label="¿El solicitante cuenta con buenas referencias de sus vecinos?"
            checked={formData.hasGoodNeighborReferences || false}
            isPositive={true}
            onChange={(checked) => handleSwitchChange('hasGoodNeighborReferences', checked)}
          />
        </CharacterSection>

        {/* Project aspects section */}
        <CharacterSection title="Sobre el proyecto" icon={Building2}>
          <SwitchItem
            id="hasCreditPurposeClarity"
            label="¿El solicitante tiene claridad del destino del crédito?"
            checked={formData.hasCreditPurposeClarity || false}
            isPositive={true}
            onChange={(checked) => handleSwitchChange('hasCreditPurposeClarity', checked)}
          />
          
          <SwitchItem
            id="businessInHighRiskArea"
            label="¿El negocio se encuentra en un sector geográfico de alto riesgo?"
            checked={formData.businessInHighRiskArea || false}
            isPositive={false}
            onChange={(checked) => handleSwitchChange('businessInHighRiskArea', checked)}
          />
          
          <SwitchItem
            id="businessOlderThanOneYear"
            label="¿La antigüedad del negocio es mayor a un año?"
            checked={formData.businessOlderThanOneYear || false}
            isPositive={true}
            onChange={(checked) => handleSwitchChange('businessOlderThanOneYear', checked)}
          />
          
          <SwitchItem
            id="hasOtherEconomicActivities"
            label="¿El solicitante cuenta con otras actividades económicas?"
            checked={formData.hasOtherEconomicActivities || false}
            isPositive={true}
            onChange={(checked) => handleSwitchChange('hasOtherEconomicActivities', checked)}
          />
          
          <SwitchItem
            id="keepsWrittenRecords"
            label="¿El solicitante lleva registros escritos de sus compras y ventas?"
            checked={formData.keepsWrittenRecords || false}
            isPositive={true}
            onChange={(checked) => handleSwitchChange('keepsWrittenRecords', checked)}
          />
        </CharacterSection>

        {/* References and payment record section */}
        <CharacterSection title="Referencias y récord de pago" icon={FileText}>
          <SwitchItem
            id="hasSatisfactorySIBReferences"
            label="¿El solicitante posee referencias satisfactorias en la SIB?"
            checked={formData.hasSatisfactorySIBReferences || false}
            isPositive={true}
            onChange={(checked) => handleSwitchChange('hasSatisfactorySIBReferences', checked)}
          />
          
          <SwitchItem
            id="hasInternalRatingAB"
            label="¿El solicitante tiene calificación interna de pago A o B?"
            checked={formData.hasInternalRatingAB || false}
            isPositive={true}
            onChange={(checked) => handleSwitchChange('hasInternalRatingAB', checked)}
          />
        </CharacterSection>
      </div>
    </div>
  );
};

export default CharacterAnalysis;