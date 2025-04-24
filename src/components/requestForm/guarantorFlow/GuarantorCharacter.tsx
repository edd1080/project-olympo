
import React, { useEffect } from 'react';
import { 
  Card, 
  CardContent 
} from '@/components/ui/card';
import {
  Checkbox
} from "@/components/ui/checkbox";
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { GuarantorData } from '../RequestFormProvider';

interface GuarantorCharacterProps {
  guarantor: GuarantorData;
  updateGuarantorData: (field: keyof GuarantorData, value: any) => void;
  setStepComplete: (isComplete: boolean) => void;
}

const GuarantorCharacter: React.FC<GuarantorCharacterProps> = ({
  guarantor,
  updateGuarantorData,
  setStepComplete
}) => {
  // Initialize character info if it doesn't exist
  const characterInfo = guarantor.characterInfo || {
    isReliable: false,
    isOrganized: false,
    hasStableIncome: false,
    hasGoodReputation: false,
    additionalNotes: ''
  };
  
  // Update character info field
  const updateCharacterInfo = (field: keyof typeof characterInfo, value: boolean | string) => {
    const updatedInfo = {
      ...characterInfo,
      [field]: value
    };
    
    updateGuarantorData('characterInfo', updatedInfo);
  };
  
  // Check if the form is complete
  useEffect(() => {
    const requiredChecks = [
      characterInfo.isReliable,
      characterInfo.hasStableIncome
    ];
    
    const isValid = requiredChecks.every(check => check === true);
    setStepComplete(isValid);
  }, [characterInfo, setStepComplete]);
  
  return (
    <div className="space-y-6">
      <div className="border-b pb-4">
        <h3 className="text-lg font-medium">Análisis de Carácter</h3>
        <p className="text-muted-foreground text-sm">
          Evalúe las cualidades del fiador marcando las opciones que correspondan
        </p>
      </div>
      
      <Card className="border shadow-sm">
        <CardContent className="p-4 space-y-6">
          <div className="space-y-4">
            <div className="flex items-start space-x-2">
              <Checkbox 
                id="isReliable" 
                checked={characterInfo.isReliable}
                onCheckedChange={(checked) => 
                  updateCharacterInfo('isReliable', checked === true)}
                aria-required="true"
              />
              <div className="grid gap-1.5 leading-none">
                <Label 
                  htmlFor="isReliable" 
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  El fiador es una persona confiable y responsable
                </Label>
                <p className="text-muted-foreground text-xs">Requerido</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-2">
              <Checkbox 
                id="isOrganized" 
                checked={characterInfo.isOrganized}
                onCheckedChange={(checked) => 
                  updateCharacterInfo('isOrganized', checked === true)}
              />
              <div className="grid gap-1.5 leading-none">
                <Label 
                  htmlFor="isOrganized" 
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  El fiador mantiene sus finanzas ordenadas
                </Label>
                <p className="text-muted-foreground text-xs">Opcional</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-2">
              <Checkbox 
                id="hasStableIncome" 
                checked={characterInfo.hasStableIncome}
                onCheckedChange={(checked) => 
                  updateCharacterInfo('hasStableIncome', checked === true)}
                aria-required="true"
              />
              <div className="grid gap-1.5 leading-none">
                <Label 
                  htmlFor="hasStableIncome" 
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  El fiador tiene una fuente de ingresos estable
                </Label>
                <p className="text-muted-foreground text-xs">Requerido</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-2">
              <Checkbox 
                id="hasGoodReputation" 
                checked={characterInfo.hasGoodReputation}
                onCheckedChange={(checked) => 
                  updateCharacterInfo('hasGoodReputation', checked === true)}
              />
              <div className="grid gap-1.5 leading-none">
                <Label 
                  htmlFor="hasGoodReputation" 
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  El fiador tiene buena reputación en su comunidad
                </Label>
                <p className="text-muted-foreground text-xs">Opcional</p>
              </div>
            </div>
          </div>
          
          <div className="space-y-2 pt-4 border-t">
            <Label htmlFor="additionalNotes">Notas adicionales</Label>
            <Textarea
              id="additionalNotes"
              placeholder="Escriba notas adicionales sobre el fiador"
              value={characterInfo.additionalNotes}
              onChange={(e) => updateCharacterInfo('additionalNotes', e.target.value)}
              className="min-h-[100px]"
            />
          </div>
        </CardContent>
      </Card>
      
      <div className="border p-4 rounded-md bg-amber-50 text-amber-800 text-sm">
        <p className="font-medium mb-1">Información importante</p>
        <p>Para poder continuar, es necesario que el fiador cumpla con los requisitos marcados como "Requerido".</p>
      </div>
    </div>
  );
};

export default GuarantorCharacter;
