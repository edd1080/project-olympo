import React from 'react';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { User, Building2, FileText, CheckCircle } from 'lucide-react';

interface CharacterAnalysisProps {
  formData: any;
  updateFormData: (field: string, value: any) => void;
}

const CharacterAnalysis: React.FC<CharacterAnalysisProps> = ({ formData, updateFormData }) => {
  // Helpers to keep backward compatibility while introducing nuanced fields
  const setAreaRiskLevel = (value: 'bajo' | 'medio' | 'alto') => {
    updateFormData('areaRiskLevel', value);
    // Derive legacy boolean for compatibility
    updateFormData('livesInHighRiskZone', value === 'alto');
  };

  const setNeighborReferences = (value: 'ninguna' | 'mixtas' | 'positivas') => {
    updateFormData('neighborReferences', value);
    updateFormData('hasGoodNeighborReferences', value === 'positivas');
  };

  const setCreditPurposeClarityLevel = (value: 'alta' | 'media' | 'baja') => {
    updateFormData('creditPurposeClarityLevel', value);
    updateFormData('hasCreditPurposeClarity', value === 'alta');
  };

  const setBusinessAntiquity = (value: 'menos_6m' | '6_12m' | 'mas_1a') => {
    updateFormData('businessAntiquity', value);
    updateFormData('businessOlderThanOneYear', value === 'mas_1a');
  };

  const setRecordKeepingLevel = (value: 'ninguno' | 'informal' | 'formal') => {
    updateFormData('recordKeepingLevel', value);
    updateFormData('keepsWrittenRecords', value !== 'ninguno');
  };

  // Current values with legacy fallbacks
  const areaRiskLevel: 'bajo' | 'medio' | 'alto' | undefined =
    formData.areaRiskLevel ?? (formData.livesInHighRiskZone === true ? 'alto' : formData.livesInHighRiskZone === false ? 'bajo' : undefined);

  const neighborReferences: 'ninguna' | 'mixtas' | 'positivas' | undefined =
    formData.neighborReferences ?? (formData.hasGoodNeighborReferences === true ? 'positivas' : formData.hasGoodNeighborReferences === false ? 'ninguna' : undefined);

  const creditPurposeClarityLevel: 'alta' | 'media' | 'baja' | undefined =
    formData.creditPurposeClarityLevel ?? (formData.hasCreditPurposeClarity === true ? 'alta' : formData.hasCreditPurposeClarity === false ? 'baja' : undefined);

  const businessAntiquity: 'menos_6m' | '6_12m' | 'mas_1a' | undefined =
    formData.businessAntiquity ?? (formData.businessOlderThanOneYear === true ? 'mas_1a' : undefined);

  const recordKeepingLevel: 'ninguno' | 'informal' | 'formal' | undefined =
    formData.recordKeepingLevel ?? (typeof formData.keepsWrittenRecords === 'boolean' ? (formData.keepsWrittenRecords ? 'informal' : 'ninguno') : undefined);

// Section completion helpers
const isBool = (v: any) => typeof v === 'boolean';

const personalComplete =
  isBool(formData.hasAlcoholismOrViolence) &&
  !!areaRiskLevel &&
  isBool(formData.livesInSamePlaceTwoYears) &&
  isBool(formData.informedSpouseAboutFinancing) &&
  !!neighborReferences;

const projectComplete =
  !!creditPurposeClarityLevel &&
  isBool(formData.businessInHighRiskArea) &&
  !!businessAntiquity &&
  isBool(formData.hasOtherEconomicActivities) &&
  !!recordKeepingLevel;

const referencesComplete =
  isBool(formData.hasSatisfactorySIBReferences) &&
  isBool(formData.hasInternalRatingAB);

const CharacterSection = ({
  title, 
  icon: Icon, 
  complete = false,
  children 
}: { 
  title: string; 
  icon: React.ElementType; 
  complete?: boolean;
  children: React.ReactNode;
}) => (
  <div className="px-4 sm:px-6">
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-3">
        <div className="p-1.5 rounded-lg bg-primary/10">
          <Icon className="h-4 w-4 text-primary" />
        </div>
        <h4 className="font-semibold text-base text-foreground">{title}</h4>
      </div>
      {complete && (
        <CheckCircle className="h-4 w-4 text-[hsl(var(--success))]" aria-label="Subformulario completo" />
      )}
    </div>
    <div className="space-y-3">
      {children}
    </div>
  </div>
);

  const ToggleRow = ({ 
    id,
    label,
    checked,
    onChange
  }: {
    id: string;
    label: string;
    checked: boolean;
    onChange: (checked: boolean) => void;
  }) => (
    <div className="py-3 flex items-start justify-between gap-3">
      <Label htmlFor={id} className="text-sm font-medium leading-tight cursor-pointer flex-1 pr-2">
        {label}
      </Label>
      <div className="flex items-center gap-2 shrink-0">
        <span className="text-xs text-muted-foreground hidden sm:inline-block min-w-[20px]">{checked ? 'Sí' : 'No'}</span>
        <Switch id={id} checked={checked} onCheckedChange={onChange} className="scale-90 sm:scale-100" />
      </div>
    </div>
  );

const RadioRow = ({
  id,
  label,
  value,
  onChange,
  options
}: {
  id: string;
  label: string;
  value?: string;
  onChange: (val: string) => void;
  options: { value: string; label: string }[];
}) => (
  <div className="py-3">
    <Label htmlFor={id} className="block text-sm font-medium leading-tight mb-3">
      {label}
    </Label>
    <RadioGroup value={value} onValueChange={onChange} className="grid grid-cols-2 sm:grid-cols-3 gap-2">
      {options.map((opt) => {
        const isSelected = value === opt.value;
        const isDimmed = value !== undefined && !isSelected;
        return (
          <div
            key={opt.value}
            className={`flex items-center gap-1.5 rounded-md border px-2 py-1.5 transition-colors text-center ${isSelected ? 'border-primary bg-primary/10' : 'border-border'} ${isDimmed ? 'opacity-50' : ''}`}
          >
            <RadioGroupItem id={`${id}-${opt.value}`} value={opt.value} className="shrink-0" />
            <Label htmlFor={`${id}-${opt.value}`} className="text-xs sm:text-sm cursor-pointer leading-tight text-center flex-1 break-words">
              {opt.label}
            </Label>
          </div>
        );
      })}
    </RadioGroup>
  </div>
);


  return (
    <div className="space-y-6 sm:space-y-8 px-2 sm:px-0">
      <div className="space-y-3 px-2 sm:px-0">
        <h3 className="font-bold text-xl sm:text-2xl text-foreground">Análisis de carácter</h3>
        <p className="text-muted-foreground text-sm sm:text-base">
          Responde cada pregunta con Sí/No o selecciona el nivel correspondiente. No se requiere escritura en esta sección.
        </p>
      </div>

      <div className="space-y-6 bg-card/30 rounded-lg border border-border/30">
        {/* Aspectos personales */}
        <CharacterSection title="Aspectos personales" icon={User} complete={personalComplete}>
          <ToggleRow
            id="hasAlcoholismOrViolence"
            label="¿El solicitante tiene antecedentes de alcoholismo y/o violencia?"
            checked={!!formData.hasAlcoholismOrViolence}
            onChange={(checked) => updateFormData('hasAlcoholismOrViolence', checked)}
          />

          <RadioRow
            id="areaRiskLevel"
            label="Nivel de riesgo de la zona donde vive el solicitante"
            value={areaRiskLevel}
            onChange={(val) => setAreaRiskLevel(val as 'bajo' | 'medio' | 'alto')}
            options={[
              { value: 'bajo', label: 'Bajo' },
              { value: 'medio', label: 'Medio' },
              { value: 'alto', label: 'Alto' },
            ]}
          />

          <ToggleRow
            id="livesInSamePlaceTwoYears"
            label="¿El solicitante reside en el mismo lugar hace más de dos años?"
            checked={!!formData.livesInSamePlaceTwoYears}
            onChange={(checked) => updateFormData('livesInSamePlaceTwoYears', checked)}
          />

          <ToggleRow
            id="informedSpouseAboutFinancing"
            label="¿El solicitante informó a su cónyuge/encargado sobre el financiamiento?"
            checked={!!formData.informedSpouseAboutFinancing}
            onChange={(checked) => updateFormData('informedSpouseAboutFinancing', checked)}
          />

          <RadioRow
            id="neighborReferences"
            label="Calidad de referencias de vecinos"
            value={neighborReferences}
            onChange={(val) => setNeighborReferences(val as 'ninguna' | 'mixtas' | 'positivas')}
            options={[
              { value: 'ninguna', label: 'No tiene referencias' },
              { value: 'mixtas', label: 'Referencias mixtas' },
              { value: 'positivas', label: 'Referencias positivas' },
            ]}
          />
        </CharacterSection>

        <div className="border-t border-border/30"></div>

        {/* Sobre el proyecto */}
        <CharacterSection title="Sobre el proyecto" icon={Building2} complete={projectComplete}>
          <RadioRow
            id="creditPurposeClarityLevel"
            label="Claridad del destino del crédito"
            value={creditPurposeClarityLevel}
            onChange={(val) => setCreditPurposeClarityLevel(val as 'alta' | 'media' | 'baja')}
            options={[
              { value: 'alta', label: 'Claridad total' },
              { value: 'media', label: 'Idea general' },
              { value: 'baja', label: 'No tiene claridad' },
            ]}
          />

          <ToggleRow
            id="businessInHighRiskArea"
            label="¿El negocio se encuentra en un sector geográfico de alto riesgo?"
            checked={!!formData.businessInHighRiskArea}
            onChange={(checked) => updateFormData('businessInHighRiskArea', checked)}
          />

          <RadioRow
            id="businessAntiquity"
            label="Antigüedad del negocio"
            value={businessAntiquity}
            onChange={(val) => setBusinessAntiquity(val as 'menos_6m' | '6_12m' | 'mas_1a')}
            options={[
              { value: 'menos_6m', label: 'Menos de 6 meses' },
              { value: '6_12m', label: '6 a 12 meses' },
              { value: 'mas_1a', label: 'Más de un año' },
            ]}
          />

          <ToggleRow
            id="hasOtherEconomicActivities"
            label="¿El solicitante cuenta con otras actividades económicas?"
            checked={!!formData.hasOtherEconomicActivities}
            onChange={(checked) => updateFormData('hasOtherEconomicActivities', checked)}
          />

          <RadioRow
            id="recordKeepingLevel"
            label="Nivel de registros de compras y ventas"
            value={recordKeepingLevel}
            onChange={(val) => setRecordKeepingLevel(val as 'ninguno' | 'informal' | 'formal')}
            options={[
              { value: 'ninguno', label: 'No lleva registros' },
              { value: 'informal', label: 'Lleva registros informales' },
              { value: 'formal', label: 'Lleva registros formales' },
            ]}
          />
        </CharacterSection>

        <div className="border-t border-border/30"></div>

        {/* Referencias y récord de pago */}
        <CharacterSection title="Referencias y récord de pago" icon={FileText} complete={referencesComplete}>
          <ToggleRow
            id="hasSatisfactorySIBReferences"
            label="¿El solicitante posee referencias satisfactorias en la SIB?"
            checked={!!formData.hasSatisfactorySIBReferences}
            onChange={(checked) => updateFormData('hasSatisfactorySIBReferences', checked)}
          />

          <ToggleRow
            id="hasInternalRatingAB"
            label="¿El solicitante tiene calificación interna de pago A o B?"
            checked={!!formData.hasInternalRatingAB}
            onChange={(checked) => updateFormData('hasInternalRatingAB', checked)}
          />
        </CharacterSection>
      </div>
    </div>
  );
};

export default CharacterAnalysis;
