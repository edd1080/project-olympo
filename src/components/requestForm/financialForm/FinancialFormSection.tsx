
import React from 'react';
import { useFormContext } from '../RequestFormProvider';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown, Upload, FileText, Camera } from 'lucide-react';
import BalanceSheet from './BalanceSheet';
import AssetLiabilityTables from './AssetLiabilityTables';
import FinancialSummary from './FinancialSummary';

const FinancialFormSection = () => {
  const { formData } = useFormContext();
  const creditAmount = formData.creditAmount || 0;
  
  // Only show if credit amount is greater than 20,000
  if (creditAmount <= 20000) {
    return null;
  }

  return (
    <Card className="border-0 shadow-none">
      <CardContent className="p-0 space-y-4">
        <h3 className="font-semibold text-lg">Estado Financiero</h3>
        <p className="text-muted-foreground text-sm">
          Complete la información del estado financiero actual y proyectado.
        </p>

        <div className="space-y-4">
          <div className="flex gap-3 mb-4">
            <Button variant="outline" size="sm">
              <Upload className="mr-2 h-4 w-4" />
              Importar Excel
            </Button>
            <Button variant="outline" size="sm">
              <Camera className="mr-2 h-4 w-4" />
              Capturar imagen
            </Button>
            <Button variant="outline" size="sm">
              <FileText className="mr-2 h-4 w-4" />
              Cargar PDF
            </Button>
          </div>

          {/* Balance Sheet Sections */}
          <Collapsible>
            <CollapsibleTrigger className="flex items-center justify-between w-full p-4 bg-muted/50 rounded-lg">
              <span className="font-medium">Activo Corriente</span>
              <ChevronDown className="h-4 w-4" />
            </CollapsibleTrigger>
            <CollapsibleContent className="p-4">
              <BalanceSheet section="currentAssets" />
            </CollapsibleContent>
          </Collapsible>

          <Collapsible>
            <CollapsibleTrigger className="flex items-center justify-between w-full p-4 bg-muted/50 rounded-lg">
              <span className="font-medium">Activo No Corriente</span>
              <ChevronDown className="h-4 w-4" />
            </CollapsibleTrigger>
            <CollapsibleContent className="p-4">
              <BalanceSheet section="nonCurrentAssets" />
            </CollapsibleContent>
          </Collapsible>

          <Collapsible>
            <CollapsibleTrigger className="flex items-center justify-between w-full p-4 bg-muted/50 rounded-lg">
              <span className="font-medium">Otros Activos</span>
              <ChevronDown className="h-4 w-4" />
            </CollapsibleTrigger>
            <CollapsibleContent className="p-4">
              <BalanceSheet section="otherAssets" />
            </CollapsibleContent>
          </Collapsible>

          <Collapsible>
            <CollapsibleTrigger className="flex items-center justify-between w-full p-4 bg-muted/50 rounded-lg">
              <span className="font-medium">Pasivo a Corto Plazo</span>
              <ChevronDown className="h-4 w-4" />
            </CollapsibleTrigger>
            <CollapsibleContent className="p-4">
              <BalanceSheet section="shortTermLiabilities" />
            </CollapsibleContent>
          </Collapsible>

          <Collapsible>
            <CollapsibleTrigger className="flex items-center justify-between w-full p-4 bg-muted/50 rounded-lg">
              <span className="font-medium">Pasivo a Largo Plazo</span>
              <ChevronDown className="h-4 w-4" />
            </CollapsibleTrigger>
            <CollapsibleContent className="p-4">
              <BalanceSheet section="longTermLiabilities" />
            </CollapsibleContent>
          </Collapsible>

          {/* Dynamic Tables */}
          <Collapsible>
            <CollapsibleTrigger className="flex items-center justify-between w-full p-4 bg-muted/50 rounded-lg">
              <span className="font-medium">Descripción de Activos y Pasivos</span>
              <ChevronDown className="h-4 w-4" />
            </CollapsibleTrigger>
            <CollapsibleContent className="p-4">
              <AssetLiabilityTables />
            </CollapsibleContent>
          </Collapsible>
        </div>

        {/* Financial Summary */}
        <FinancialSummary />
      </CardContent>
    </Card>
  );
};

export default FinancialFormSection;
