import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface AdditionalFinancialInfoProps {
  formData: any;
  updateFormData: (field: string, value: any) => void;
}

const currency = (v: number) =>
  new Intl.NumberFormat('es-GT', { style: 'currency', currency: 'GTQ', maximumFractionDigits: 2 }).format(v || 0);

const numberVal = (v: any) => {
  const n = parseFloat(v);
  return isNaN(n) ? 0 : n;
};

const fields = {
  currentAssets: ['caja', 'bancos', 'clientes', 'inventario', 'otros'],
  nonCurrentAssets: ['terrenos', 'edificios', 'maquinaria', 'otros'],
  otherAssets: ['inversiones', 'marcas', 'patentes', 'otros'],
  shortTermLiabilities: ['proveedores', 'acreedores', 'creditos'],
  longTermLiabilities: ['proveedores', 'acreedores', 'creditos'],
} as const;

type GroupKey = keyof typeof fields;

type TwoPeriodValues = { prev: Record<string, number | ''>; curr: Record<string, number | ''> };

type FinancialAdditional = Record<GroupKey, TwoPeriodValues>;

const defaultFA: FinancialAdditional = {
  currentAssets: { prev: {}, curr: {} },
  nonCurrentAssets: { prev: {}, curr: {} },
  otherAssets: { prev: {}, curr: {} },
  shortTermLiabilities: { prev: {}, curr: {} },
  longTermLiabilities: { prev: {}, curr: {} },
};

const AdditionalFinancialInfo: React.FC<AdditionalFinancialInfoProps> = ({ formData, updateFormData }) => {
  const fa: FinancialAdditional = formData.financialAdditional || defaultFA;

  const setFA = (next: FinancialAdditional) => updateFormData('financialAdditional', next);

  const handleChange = (group: GroupKey, period: 'prev' | 'curr', key: string, value: string) => {
    const next: FinancialAdditional = {
      ...fa,
      [group]: {
        ...fa[group],
        [period]: { ...fa[group][period], [key]: value === '' ? '' : numberVal(value) },
      },
    };
    setFA(next);
  };

  const sum = (obj: Record<string, number | ''>) =>
    Object.values(obj).reduce<number>((acc, v) => acc + numberVal(v), 0);

  const sumGroup = (group: GroupKey, period: 'prev' | 'curr') => sum(fa[group]?.[period] || {});

  const totalAssetsPrev = sumGroup('currentAssets', 'prev') + sumGroup('nonCurrentAssets', 'prev') + sumGroup('otherAssets', 'prev');
  const totalAssetsCurr = sumGroup('currentAssets', 'curr') + sumGroup('nonCurrentAssets', 'curr') + sumGroup('otherAssets', 'curr');

  const totalLiabPrev = sumGroup('shortTermLiabilities', 'prev') + sumGroup('longTermLiabilities', 'prev');
  const totalLiabCurr = sumGroup('shortTermLiabilities', 'curr') + sumGroup('longTermLiabilities', 'curr');

  const equityPrev = totalAssetsPrev - totalLiabPrev;
  const equityCurr = totalAssetsCurr - totalLiabCurr;

  const GroupCard = ({ title, group }: { title: string; group: GroupKey }) => (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {(['prev', 'curr'] as const).map((period) => (
            <div key={period} className="space-y-3">
              <div className="text-sm font-medium text-muted-foreground">
                {period === 'prev' ? 'Anterior' : 'Actual'}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {fields[group].map((key) => (
                  <div key={key} className="space-y-2">
                    <Label className="capitalize">{key.replace('-', ' ')}</Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={(fa[group]?.[period]?.[key] as any) ?? ''}
                      onChange={(e) => handleChange(group, period, key, e.target.value)}
                      placeholder="0.00"
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <GroupCard title="Activo Corriente" group="currentAssets" />
      <GroupCard title="Activo No Corriente" group="nonCurrentAssets" />
      <GroupCard title="Otros Activos" group="otherAssets" />
      <GroupCard title="Pasivo a Corto Plazo" group="shortTermLiabilities" />
      <GroupCard title="Pasivo a Largo Plazo" group="longTermLiabilities" />

      <Card>
        <CardHeader>
          <CardTitle>Totales calculados</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-muted/20 p-4 rounded-md text-center">
              <div className="text-2xl font-bold text-foreground">{currency(totalAssetsCurr)}</div>
              <div className="text-sm text-muted-foreground">Total Activo (actual)</div>
            </div>
            <div className="bg-muted/20 p-4 rounded-md text-center">
              <div className="text-2xl font-bold text-foreground">{currency(totalLiabCurr)}</div>
              <div className="text-sm text-muted-foreground">Total Pasivo (actual)</div>
            </div>
            <div className="bg-muted/20 p-4 rounded-md text-center">
              <div className="text-2xl font-bold text-foreground">{currency(equityCurr)}</div>
              <div className="text-sm text-muted-foreground">Patrimonio (actual)</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdditionalFinancialInfo;
