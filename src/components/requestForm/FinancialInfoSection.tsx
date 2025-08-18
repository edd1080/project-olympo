import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  BarChart3,
  TrendingUp,
  Building,
  DollarSign,
  Calculator,
  Wallet,
  Receipt,
  FileText,
  Target,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import FixedAssetsDescription from './businessFinancial/FixedAssetsDescription';
import LiabilitiesDescription from './businessFinancial/LiabilitiesDescription';
import AIAnalysisCard from './businessFinancial/AIAnalysisCard';

interface FinancialInfoSectionProps {
  formData: any;
  updateFormData: (field: string, value: any) => void;
}

const screens = [
  { id: 'current-assets', label: 'Activo Corriente', icon: Wallet },
  { id: 'non-current-assets', label: 'Activo No Corriente', icon: Building },
  { id: 'other-assets', label: 'Otros Activos', icon: FileText },
  { id: 'short-term-liabilities', label: 'Pasivo Corto Plazo', icon: Receipt },
  { id: 'long-term-liabilities', label: 'Pasivo Largo Plazo', icon: TrendingUp },
  { id: 'fixed-assets', label: 'Activos Fijos', icon: Building },
  { id: 'liabilities-detail', label: 'Detalle Pasivos', icon: FileText },
  { id: 'results', label: 'Resultados', icon: Target },
] as const;

type ScreenId = typeof screens[number]['id'];

const currency = (v: number) => 
  new Intl.NumberFormat('es-GT', { style: 'currency', currency: 'GTQ', maximumFractionDigits: 2 }).format(v || 0);

const numberVal = (v: any) => {
  const n = parseFloat(v);
  return isNaN(n) ? 0 : n;
};

const sum = (obj: Record<string, number | ''> = {}) =>
  Object.values(obj).reduce<number>((a, v) => a + numberVal(v), 0);

const FinancialInfoSection: React.FC<FinancialInfoSectionProps> = ({ formData, updateFormData }) => {
  const [activeScreen, setActiveScreen] = React.useState<ScreenId>('current-assets');

  const chipRefs = React.useRef<Record<string, HTMLButtonElement | null>>({});
  
  React.useEffect(() => {
    const el = chipRefs.current[activeScreen];
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
    }
  }, [activeScreen]);

  // Initialize financial data structure
  const financialData = formData.financialAdditional || {
    currentAssets: { prev: {}, curr: {} },
    nonCurrentAssets: { prev: {}, curr: {} },
    otherAssets: { prev: {}, curr: {} },
    shortTermLiabilities: { prev: {}, curr: {} },
    longTermLiabilities: { prev: {}, curr: {} },
    impactVariables: {},
    paymentCapacity: {}
  };

  const updateFinancialData = (path: string, value: any) => {
    updateFormData('financialAdditional', {
      ...financialData,
      [path]: value
    });
  };

  const handleFieldChange = (category: string, period: 'prev' | 'curr', field: string, value: string) => {
    const numValue = value === '' ? '' : parseFloat(value) || 0;
    const updatedCategory = {
      ...financialData[category],
      [period]: {
        ...financialData[category][period],
        [field]: numValue
      }
    };
    updateFinancialData(category, updatedCategory);
  };

  // Calculate totals
  const totals = React.useMemo(() => {
    const currentAssetsPrev = sum(financialData.currentAssets?.prev);
    const currentAssetsCurr = sum(financialData.currentAssets?.curr);
    const nonCurrentAssetsPrev = sum(financialData.nonCurrentAssets?.prev);
    const nonCurrentAssetsCurr = sum(financialData.nonCurrentAssets?.curr);
    const otherAssetsPrev = sum(financialData.otherAssets?.prev);
    const otherAssetsCurr = sum(financialData.otherAssets?.curr);
    
    const totalAssetsPrev = currentAssetsPrev + nonCurrentAssetsPrev + otherAssetsPrev;
    const totalAssetsCurr = currentAssetsCurr + nonCurrentAssetsCurr + otherAssetsCurr;
    
    const shortTermLiabPrev = sum(financialData.shortTermLiabilities?.prev);
    const shortTermLiabCurr = sum(financialData.shortTermLiabilities?.curr);
    const longTermLiabPrev = sum(financialData.longTermLiabilities?.prev);
    const longTermLiabCurr = sum(financialData.longTermLiabilities?.curr);
    
    const totalLiabPrev = shortTermLiabPrev + longTermLiabPrev;
    const totalLiabCurr = shortTermLiabCurr + longTermLiabCurr;
    
    const equityPrev = totalAssetsPrev - totalLiabPrev;
    const equityCurr = totalAssetsCurr - totalLiabCurr;

    return {
      currentAssetsPrev, currentAssetsCurr,
      nonCurrentAssetsPrev, nonCurrentAssetsCurr,
      otherAssetsPrev, otherAssetsCurr,
      totalAssetsPrev, totalAssetsCurr,
      shortTermLiabPrev, shortTermLiabCurr,
      longTermLiabPrev, longTermLiabCurr,
      totalLiabPrev, totalLiabCurr,
      equityPrev, equityCurr
    };
  }, [financialData]);

  const [activePeriod, setActivePeriod] = React.useState<'prev' | 'curr'>('prev');

  const renderAssetForm = (category: string, fields: string[], title: string) => {
    const prevData = financialData[category]?.prev || {};
    const currData = financialData[category]?.curr || {};
    
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Mobile: Period navigation chips */}
          <div className="md:hidden mb-6">
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setActivePeriod('prev')}
                className={`flex-1 px-4 py-2 rounded-lg border transition-colors ${
                  activePeriod === 'prev'
                    ? 'bg-muted border-border'
                    : 'bg-background border-border/50 hover:bg-muted/50'
                }`}
              >
                <span className="text-sm font-medium">Periodo Anterior</span>
              </button>
              <button
                type="button"
                onClick={() => setActivePeriod('curr')}
                className={`flex-1 px-4 py-2 rounded-lg border transition-colors ${
                  activePeriod === 'curr'
                    ? 'bg-[#E18E33]/10 border-[#E18E33] text-[#E18E33]'
                    : 'bg-background border-border/50 hover:bg-[#E18E33]/5'
                }`}
              >
                <span className="text-sm font-medium">Periodo Actual</span>
              </button>
            </div>
          </div>

          {/* Desktop: Column headers */}
          <div className="hidden md:grid grid-cols-2 gap-4 mb-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-muted-foreground">Periodo Anterior</h3>
            </div>
            <div className="text-center">
              <h3 className="text-lg font-semibold text-[#E18E33]">Periodo Actual</h3>
            </div>
          </div>

          {/* Desktop: Fields with dual inputs */}
          <div className="hidden md:block space-y-4">
            {fields.map((field) => (
              <div key={field} className="space-y-2">
                <Label className="text-sm font-medium">
                  {field.charAt(0).toUpperCase() + field.slice(1).replace(/([A-Z])/g, ' $1')}
                </Label>
                <div className="grid grid-cols-2 gap-4">
                  {/* Previous period input */}
                  <div className="relative">
                    <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">Q</span>
                    <Input
                      type="number"
                      min={0}
                      step="0.01"
                      className="pl-7"
                      value={prevData[field] || ''}
                      onChange={(e) => handleFieldChange(category, 'prev', field, e.target.value)}
                      placeholder="0.00"
                    />
                  </div>
                  {/* Current period input */}
                  <div className="relative">
                    <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">Q</span>
                    <Input
                      type="number"
                      min={0}
                      step="0.01"
                      className="pl-7 border-[#E18E33]/20 focus:border-[#E18E33] focus:ring-[#E18E33]/20"
                      value={currData[field] || ''}
                      onChange={(e) => handleFieldChange(category, 'curr', field, e.target.value)}
                      placeholder="0.00"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Mobile: Period-based single column input */}
          <div className="md:hidden space-y-4">
            {fields.map((field) => {
              const data = activePeriod === 'prev' ? prevData : currData;
              return (
                <div key={field} className="space-y-2">
                  <Label className="text-sm font-medium">
                    {field.charAt(0).toUpperCase() + field.slice(1).replace(/([A-Z])/g, ' $1')}
                  </Label>
                  <div className="relative">
                    <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">Q</span>
                    <Input
                      type="number"
                      min={0}
                      step="0.01"
                      className={`pl-7 ${
                        activePeriod === 'curr' 
                          ? 'border-[#E18E33]/20 focus:border-[#E18E33] focus:ring-[#E18E33]/20' 
                          : ''
                      }`}
                      value={data[field] || ''}
                      onChange={(e) => handleFieldChange(category, activePeriod, field, e.target.value)}
                      placeholder="0.00"
                    />
                  </div>
                </div>
              );
            })}
          </div>
          
          {/* Show totals */}
          <div className="mt-6 p-4 bg-muted/50 rounded-lg">
            {/* Desktop: Both totals side by side */}
            <div className="hidden md:grid grid-cols-2 gap-4">
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Total Anterior</p>
                <p className="text-lg font-semibold">
                  {currency(sum(financialData[category]?.prev))}
                </p>
              </div>
              <div className="text-center">
                <p className="text-sm text-[#E18E33]">Total Actual</p>
                <p className="text-lg font-semibold text-[#E18E33]">
                  {currency(sum(financialData[category]?.curr))}
                </p>
              </div>
            </div>
            
            {/* Mobile: Only active period total */}
            <div className="md:hidden text-center">
              <p className={`text-sm ${activePeriod === 'curr' ? 'text-[#E18E33]' : 'text-muted-foreground'}`}>
                Total {activePeriod === 'prev' ? 'Anterior' : 'Actual'}
              </p>
              <p className={`text-lg font-semibold ${activePeriod === 'curr' ? 'text-[#E18E33]' : ''}`}>
                {currency(sum(financialData[category]?.[activePeriod]))}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  const renderResults = () => (
    <div className="space-y-6">
      {/* Sticky KPI Summary */}
      <Card className="bg-gradient-to-r from-primary/10 via-accent/10 to-secondary/10">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Resumen Financiero
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="text-center p-3 bg-background/50 rounded-lg">
              <p className="text-xs text-muted-foreground">Total Activos</p>
              <p className="text-sm font-semibold">{currency(totals.totalAssetsPrev)} / {currency(totals.totalAssetsCurr)}</p>
            </div>
            <div className="text-center p-3 bg-background/50 rounded-lg">
              <p className="text-xs text-muted-foreground">Total Pasivos</p>
              <p className="text-sm font-semibold">{currency(totals.totalLiabPrev)} / {currency(totals.totalLiabCurr)}</p>
            </div>
            <div className="text-center p-3 bg-background/50 rounded-lg">
              <p className="text-xs text-muted-foreground">Patrimonio</p>
              <p className="text-sm font-semibold">{currency(totals.equityPrev)} / {currency(totals.equityCurr)}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Comentario AI (offline) */}
      <AIAnalysisCard formData={formData} financialData={financialData} totals={totals} />

      {/* Financial Ratios */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5" />
            Razones Financieras
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <h4 className="font-medium">Liquidez</h4>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <p className="text-muted-foreground">Corriente (AC/PC)</p>
                  <p className="font-medium">
                    {totals.shortTermLiabCurr > 0 ? (totals.currentAssetsCurr / totals.shortTermLiabCurr).toFixed(2) : '—'}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">Ácida</p>
                  <p className="font-medium">—</p>
                </div>
              </div>
            </div>
            
            <div className="space-y-3">
              <h4 className="font-medium">Endeudamiento</h4>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <p className="text-muted-foreground">Actual (P/Pat)</p>
                  <p className="font-medium">
                    {totals.equityCurr !== 0 ? (totals.totalLiabCurr / totals.equityCurr).toFixed(2) : '—'}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">Deuda/Activo</p>
                  <p className="font-medium">
                    {totals.totalAssetsCurr > 0 ? (totals.totalLiabCurr / totals.totalAssetsCurr).toFixed(2) : '—'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const currentIndex = screens.findIndex((s) => s.id === activeScreen);
  const prev = currentIndex > 0 ? screens[currentIndex - 1] : null;
  const next = currentIndex < screens.length - 1 ? screens[currentIndex + 1] : null;
  const CurrentIcon = screens[currentIndex].icon;

  return (
    <div className="space-y-6">
      {/* CSS for hiding scrollbar */}
      <style>{`
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        .hide-scrollbar::-webkit-scrollbar { display: none; }
      `}</style>

      {/* Chips navigation */}
      <nav className="hide-scrollbar overflow-x-auto">
        <div className="flex items-center gap-2 py-2">
          {screens.map(({ id, label, icon: Icon }) => {
            const active = id === activeScreen;
            return (
              <button
                key={id}
                type="button"
                ref={(el) => { if (el) chipRefs.current[id] = el; }}
                onClick={() => setActiveScreen(id)}
                aria-selected={active}
                className={
                  `inline-flex items-center gap-2 rounded-full border px-3 py-2 transition-colors whitespace-nowrap ` +
                  (active
                    ? 'bg-[#E18E33]/10 text-[#E18E33] border-[#E18E33]'
                    : 'bg-background text-foreground hover:bg-[#E18E33]/5')
                }
              >
                <Icon className="h-4 w-4" />
                <span className="text-sm font-medium">{label}</span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* Screen title */}
      <header className="flex items-center gap-2">
        <CurrentIcon className="h-5 w-5" />
        <h2 className="text-xl font-semibold">{screens[currentIndex].label}</h2>
      </header>

      {/* Screen content */}
      <section className="space-y-4">
        {activeScreen === 'current-assets' && renderAssetForm('currentAssets', [
          'caja', 'cajaChica', 'bancos', 'clientes', 'deudores', 'cuentasPorCobrar',
          'invMateriaPrima', 'invEnProceso', 'invTerminados'
        ], 'Activo Corriente')}

        {activeScreen === 'non-current-assets' && renderAssetForm('nonCurrentAssets', [
          'terrenos', 'edificios', 'inmuebles', 'maquinaria', 'mobiliarioEquipo',
          'vehiculos', 'equipoComputacion', 'herramientas', 'local'
        ], 'Activo No Corriente')}

        {activeScreen === 'other-assets' && renderAssetForm('otherAssets', [
          'inversionesLargoPlazo', 'marcasPatentes', 'derechoLlave',
          'materialEmpaque', 'papeleriaUtiles'
        ], 'Otros Activos')}

        {activeScreen === 'short-term-liabilities' && renderAssetForm('shortTermLiabilities', [
          'proveedores', 'acreedores', 'cuentasPorPagar',
          'creditosOtrosBancos', 'creditosBanrural'
        ], 'Pasivo a Corto Plazo')}

        {activeScreen === 'long-term-liabilities' && renderAssetForm('longTermLiabilities', [
          'cuentasPorPagar', 'creditosOtrosBancos', 'creditosBanrural'
        ], 'Pasivo a Largo Plazo')}

        {activeScreen === 'fixed-assets' && (
          <FixedAssetsDescription formData={formData} updateFormData={updateFormData} />
        )}

        {activeScreen === 'liabilities-detail' && (
          <LiabilitiesDescription formData={formData} updateFormData={updateFormData} />
        )}

        {activeScreen === 'results' && renderResults()}

        {/* Navigation */}
        <Separator />
        <div className="flex items-center justify-between gap-2">
          <div>
            {prev && (
              <Button 
                variant="outline" 
                className="h-8 px-3 text-xs border-[#E18E33] border-2 text-[#E18E33] hover:bg-[#E18E33]/5" 
                onClick={() => setActiveScreen(prev.id)}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
            )}
          </div>
          <div>
            {next && (
              <Button 
                variant="outline"
                className="h-8 px-3 text-xs border-[#E18E33] border-2 text-[#E18E33] hover:bg-[#E18E33]/5" 
                onClick={() => setActiveScreen(next.id)}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default FinancialInfoSection;