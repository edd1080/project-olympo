
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useFormContext as useRequestFormContext } from '../RequestFormProvider';
import { useFormContext as useGeneralFormContext } from '@/context/FormContext';

type BalanceSheetSection = Record<string, { before: number; current: number }>;

interface BalanceSheet {
  currentAssets?: BalanceSheetSection;
  nonCurrentAssets?: BalanceSheetSection;
  otherAssets?: BalanceSheetSection;
  shortTermLiabilities?: BalanceSheetSection;
  longTermLiabilities?: BalanceSheetSection;
}

const FinancialSummary = () => {
  // Try to get context from RequestFormProvider
  let formData = {};
  
  try {
    const requestContext = useRequestFormContext();
    if (requestContext) {
      formData = requestContext.formData;
    }
  } catch {
    // If RequestFormContext is not available, we'll use the general FormContext
    try {
      const generalContext = useGeneralFormContext();
      if (generalContext) {
        formData = generalContext.formData;
      }
    } catch (e) {
      console.error("No form context available:", e);
    }
  }
  
  const balanceSheet = (formData.balanceSheet || {}) as BalanceSheet;

  const calculateTotal = (section: keyof BalanceSheet, type: 'before' | 'current'): number => {
    if (!balanceSheet[section]) return 0;
    
    return Object.values(balanceSheet[section] || {}).reduce((acc: number, item) => {
      return acc + (item[type] || 0);
    }, 0);
  };

  const totalAssetsBefore = calculateTotal('currentAssets', 'before') + 
    calculateTotal('nonCurrentAssets', 'before') + 
    calculateTotal('otherAssets', 'before');

  const totalAssetsCurrent = calculateTotal('currentAssets', 'current') + 
    calculateTotal('nonCurrentAssets', 'current') + 
    calculateTotal('otherAssets', 'current');

  const totalLiabilitiesBefore = calculateTotal('shortTermLiabilities', 'before') + 
    calculateTotal('longTermLiabilities', 'before');

  const totalLiabilitiesCurrent = calculateTotal('shortTermLiabilities', 'current') + 
    calculateTotal('longTermLiabilities', 'current');

  const equityBefore = totalAssetsBefore - totalLiabilitiesBefore;
  const equityCurrent = totalAssetsCurrent - totalLiabilitiesCurrent;

  return (
    <Card className="bg-muted/30">
      <CardContent className="p-6">
        <h4 className="font-semibold mb-4">Resumen Financiero</h4>
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Total Activos</p>
              <div className="flex justify-between mt-1">
                <span className="font-medium">Anterior: Q{totalAssetsBefore.toLocaleString()}</span>
                <span className="font-medium">Actual: Q{totalAssetsCurrent.toLocaleString()}</span>
              </div>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Pasivos</p>
              <div className="flex justify-between mt-1">
                <span className="font-medium">Anterior: Q{totalLiabilitiesBefore.toLocaleString()}</span>
                <span className="font-medium">Actual: Q{totalLiabilitiesCurrent.toLocaleString()}</span>
              </div>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Patrimonio</p>
              <div className="flex justify-between mt-1">
                <span className="font-medium">Anterior: Q{equityBefore.toLocaleString()}</span>
                <span className="font-medium">Actual: Q{equityCurrent.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FinancialSummary;
