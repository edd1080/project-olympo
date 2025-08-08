import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface FinancialRatiosViewProps {
  formData: any;
}

const formatNumber = (v: number) => (isFinite(v) && !isNaN(v) ? v.toFixed(2) : '—');

const numberVal = (v: any) => {
  const n = parseFloat(v);
  return isNaN(n) ? 0 : n;
};

const sum = (obj: Record<string, number | ''> = {}) =>
  Object.values(obj).reduce<number>((a, v) => a + numberVal(v), 0);

const FinancialRatiosView: React.FC<FinancialRatiosViewProps> = ({ formData }) => {
  const fa = formData.financialAdditional || {};

  const currentAssets = sum(fa.currentAssets?.curr);
  const nonCurrentAssets = sum(fa.nonCurrentAssets?.curr);
  const otherAssets = sum(fa.otherAssets?.curr);
  const totalAssets = currentAssets + nonCurrentAssets + otherAssets;

  const stLiab = sum(fa.shortTermLiabilities?.curr);
  const ltLiab = sum(fa.longTermLiabilities?.curr);
  const totalLiab = stLiab + ltLiab;

  const equity = totalAssets - totalLiab;

  const currentRatio = stLiab > 0 ? currentAssets / stLiab : NaN;
  const debtToEquity = equity !== 0 ? totalLiab / equity : NaN;
  const debtRatio = totalAssets > 0 ? totalLiab / totalAssets : NaN;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Ratios financieros</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-muted/20 p-4 rounded-md">
            <div className="text-sm text-muted-foreground">Razón circulante (AC / PC)</div>
            <div className="text-2xl font-bold">{formatNumber(currentRatio)}</div>
          </div>
          <div className="bg-muted/20 p-4 rounded-md">
            <div className="text-sm text-muted-foreground">Endeudamiento (Pasivo / Patrimonio)</div>
            <div className="text-2xl font-bold">{formatNumber(debtToEquity)}</div>
          </div>
          <div className="bg-muted/20 p-4 rounded-md">
            <div className="text-sm text-muted-foreground">Deuda sobre activos (Pasivo / Activo)</div>
            <div className="text-2xl font-bold">{formatNumber(debtRatio)}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FinancialRatiosView;
