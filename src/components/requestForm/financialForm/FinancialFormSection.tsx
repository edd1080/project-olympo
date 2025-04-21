
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown, Upload, FileText, Camera } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import BalanceSheet from './BalanceSheet';
import AssetLiabilityTables from './AssetLiabilityTables';
import FinancialSummary from './FinancialSummary';
import { useFormContext as useRequestFormContext } from '../RequestFormProvider';
import { useFormContext as useGeneralFormContext } from '@/context/FormContext';

// To handle both contexts, we'll check which one we can access
const FinancialFormSection = () => {
  const [isProcessingOCR, setIsProcessingOCR] = useState(false);
  const { toast } = useToast();
  
  // Try to get context from RequestFormProvider
  let requestContext = null;
  let formData = {};
  let updateFormData = (field: string, value: any) => {};
  let creditAmount = 0;
  
  try {
    requestContext = useRequestFormContext();
    if (requestContext) {
      formData = requestContext.formData;
      updateFormData = requestContext.updateFormData;
      creditAmount = formData.creditAmount || 0;
    }
  } catch {
    // If RequestFormContext is not available, we'll use the general FormContext
    try {
      const generalContext = useGeneralFormContext();
      if (generalContext) {
        formData = generalContext.formData;
        updateFormData = generalContext.updateFormData;
        creditAmount = formData.creditAmount || 0;
      }
    } catch (e) {
      console.error("No form context available:", e);
    }
  }
  
  // Only show if credit amount is greater than 20,000
  if (creditAmount <= 20000) {
    return null;
  }

  const handleFileUpload = () => {
    toast({
      title: "Importación de Excel",
      description: "Funcionalidad de importación de Excel en desarrollo",
      duration: 3000,
    });
  };

  const handleImageCapture = () => {
    setIsProcessingOCR(true);
    
    // Simulate OCR processing
    setTimeout(() => {
      // Mock OCR result data
      const ocrData = {
        currentAssets: {
          cash: { before: 22000, current: 25000 },
          accounts_receivable: { before: 28000, current: 30000 },
          inventory: { before: 40000, current: 55000 }
        },
        nonCurrentAssets: {
          fixed_assets: { before: 70000, current: 75000 },
          investments: { before: 15000, current: 15000 }
        },
        otherAssets: {
          other_assets: { before: 5000, current: 5000 }
        },
        shortTermLiabilities: {
          accounts_payable: { before: 20000, current: 22000 },
          short_term_loans: { before: 15000, current: 35000 }
        },
        longTermLiabilities: {
          long_term_loans: { before: 30000, current: 52000 },
          mortgages: { before: 0, current: 0 }
        }
      };
      
      updateFormData('balanceSheet', ocrData);
      setIsProcessingOCR(false);
      
      toast({
        title: "OCR Completado",
        description: "Se han extraído los datos financieros del documento correctamente.",
        duration: 3000,
        className: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100",
      });
    }, 2000);
  };

  const handlePdfUpload = () => {
    toast({
      title: "Carga de PDF",
      description: "Funcionalidad de procesamiento de PDF en desarrollo",
      duration: 3000,
    });
  };

  return (
    <Card className="border-0 shadow-none">
      <CardContent className="p-0 space-y-4">
        <h3 className="font-semibold text-lg">Estado Financiero</h3>
        <p className="text-muted-foreground text-sm">
          Complete la información del estado financiero actual y proyectado.
        </p>

        <div className="space-y-4">
          <div className="flex gap-3 mb-4">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleFileUpload} 
              disabled={isProcessingOCR}
            >
              <Upload className="mr-2 h-4 w-4" />
              Importar Excel
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleImageCapture}
              disabled={isProcessingOCR}
              className={isProcessingOCR ? "animate-pulse" : ""}
            >
              <Camera className="mr-2 h-4 w-4" />
              {isProcessingOCR ? "Procesando..." : "Capturar imagen"}
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handlePdfUpload}
              disabled={isProcessingOCR}
            >
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
