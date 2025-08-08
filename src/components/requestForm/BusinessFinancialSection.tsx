import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import GeneralBusinessInfo from './businessFinancial/GeneralBusinessInfo';
import BusinessProducts from './businessFinancial/BusinessProducts';
import FinancialAnalysis from './FinancialAnalysis';
import PatrimonialStatement from './PatrimonialStatement';
import BusinessSeasonality from './businessFinancial/BusinessSeasonality';
import BusinessExpenses from './businessFinancial/BusinessExpenses';
import {
  BarChart3,
  Scale,
  Building2,
  Package,
  CalendarRange,
  Receipt,
} from 'lucide-react';

interface BusinessFinancialSectionProps {
  formData: any;
  updateFormData: (field: string, value: any) => void;
}

const screens = [
  { id: 'analysis', label: 'Análisis Financiero', icon: BarChart3 },
  { id: 'statement', label: 'Estado Patrimonial', icon: Scale },
  { id: 'info', label: 'Información del Negocio', icon: Building2 },
  { id: 'products', label: 'Productos', icon: Package },
  { id: 'seasonality', label: 'Estacionalidad', icon: CalendarRange },
  { id: 'expenses', label: 'Gastos', icon: Receipt },
] as const;

type ScreenId = typeof screens[number]['id'];

const BusinessFinancialSection: React.FC<BusinessFinancialSectionProps> = ({ formData, updateFormData }) => {
  const [activeScreen, setActiveScreen] = React.useState<ScreenId>('analysis');

  const currentIndex = screens.findIndex((s) => s.id === activeScreen);
  const prev = currentIndex > 0 ? screens[currentIndex - 1] : null;
  const next = currentIndex < screens.length - 1 ? screens[currentIndex + 1] : null;
  const CurrentIcon = screens[currentIndex].icon;

  return (
    <div className="space-y-6">
      {/* Local CSS to hide horizontal scrollbar */}
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
                onClick={() => setActiveScreen(id)}
                aria-selected={active}
                className={
                  `inline-flex items-center gap-2 rounded-full border px-3 py-2 transition-colors whitespace-nowrap ` +
                  (active
                    ? 'bg-primary/10 text-primary border-primary'
                    : 'bg-background text-foreground hover:bg-muted')
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
        <h2 className="text-xl font-semibold">
          {screens[currentIndex].label}
        </h2>
      </header>

      {/* Screen content */}
      <section className="space-y-4">
        {activeScreen === 'analysis' && (
          <div className="space-y-4">
            <FinancialAnalysis formData={formData} updateFormData={updateFormData} />
          </div>
        )}

        {activeScreen === 'statement' && (
          <div className="space-y-4">
            <PatrimonialStatement formData={formData} updateFormData={updateFormData} />
          </div>
        )}

        {activeScreen === 'info' && (
          <Card>
            <CardHeader>
              <CardTitle>Datos del negocio</CardTitle>
            </CardHeader>
            <CardContent>
              <GeneralBusinessInfo formData={formData} updateFormData={updateFormData} />
            </CardContent>
          </Card>
        )}

        {activeScreen === 'products' && (
          <div className="space-y-4">
            <BusinessProducts formData={formData} updateFormData={updateFormData} />
          </div>
        )}

        {activeScreen === 'seasonality' && (
          <div className="space-y-4">
            <BusinessSeasonality formData={formData} updateFormData={updateFormData} />
          </div>
        )}

        {activeScreen === 'expenses' && (
          <div className="space-y-4">
            <BusinessExpenses formData={formData} updateFormData={updateFormData} />
          </div>
        )}

        {/* Inline nav between sub-screens */}
        <Separator />
        <div className="flex items-center justify-between gap-2">
          <div>
            {prev && (
              <Button variant="outline" onClick={() => setActiveScreen(prev.id)}>
                Atrás {prev.label}
              </Button>
            )}
          </div>
          <div>
            {next && (
              <Button onClick={() => setActiveScreen(next.id)}>
                Siguiente {next.label}
              </Button>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default BusinessFinancialSection;
