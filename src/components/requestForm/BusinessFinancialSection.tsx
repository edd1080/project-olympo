import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import AddressModule from './AddressModule';
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
  { id: 'info', label: 'Info General', icon: Building2 },
  { id: 'products', label: 'Productos', icon: Package },
  { id: 'seasonality', label: 'Estacionalidad', icon: CalendarRange },
  { id: 'expenses', label: 'Gastos', icon: Receipt },
  // { id: 'analysis', label: 'Análisis Financiero', icon: BarChart3 },
  // { id: 'statement', label: 'Estado Patrimonial', icon: Scale },
] as const;

type ScreenId = typeof screens[number]['id'];

const BusinessFinancialSection: React.FC<BusinessFinancialSectionProps> = ({ formData, updateFormData }) => {
  const [activeScreen, setActiveScreen] = React.useState<ScreenId>('info');
  const [addressOpen, setAddressOpen] = React.useState(false);

  const chipRefs = React.useRef<Record<string, HTMLButtonElement | null>>({});
  React.useEffect(() => {
    const el = chipRefs.current[activeScreen];
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
    }
  }, [activeScreen]);

  const handleAddProduct = React.useCallback(() => {
    const current = Array.isArray(formData.products) ? formData.products : [];
    if (current.length >= 10) {
      // You can add toast notification here if available
      console.warn('Máximo 10 productos permitidos');
      return;
    }
    
    const newProduct = {
      id: Date.now(),
      type: '',
      unit: '',
      quantity: '',
      unitCost: '',
      sellingPrice: '',
      margin: '',
      bestMonth: '',
      worstMonth: '',
      bestAmount: '',
      worstAmount: '',
      photo: null,
    };
    updateFormData('products', [...current, newProduct]);
  }, [formData.products, updateFormData]);

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
                ref={(el) => { if (el) chipRefs.current[id] = el; }}
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
      <header className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <CurrentIcon className="h-5 w-5" />
          <h2 className="text-xl font-semibold">{screens[currentIndex].label}</h2>
        </div>
        {activeScreen === 'products' && (
          <Button size="sm" onClick={handleAddProduct}>Agregar Producto</Button>
        )}
      </header>

      {/* Screen content */}
      <section className="space-y-4">
        {/* Commented out - moved to separate FinancialInfoSection
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
        */}

        {activeScreen === 'info' && (
          <Card>
            <CardContent>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="businessName">Nombre del negocio</Label>
                  <Input
                    id="businessName"
                    value={formData.businessName ?? ''}
                    onChange={(e) => updateFormData('businessName', e.target.value)}
                    placeholder="Ej. Tienda La Esperanza"
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="businessAddress">Dirección completa del negocio</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      id="businessAddress"
                      value={formData.businessAddress ?? ''}
                      readOnly
                      placeholder="No registrada"
                    />
                    <Sheet open={addressOpen} onOpenChange={setAddressOpen}>
                      <SheetTrigger asChild>
                        <Button variant="outline">Agregar/Editar</Button>
                      </SheetTrigger>
                      <SheetContent side="bottom" className="h-[90vh] overflow-y-auto">
                        <SheetHeader>
                          <SheetTitle>Dirección del negocio</SheetTitle>
                        </SheetHeader>
                        <div className="p-2 md:p-4">
                          <AddressModule
                            initialData={formData.businessAddressDetails}
                            onSave={(data) => {
                              updateFormData('businessAddressDetails', data);
                              updateFormData('businessAddress', (data as any).direccionCompleta);
                              setAddressOpen(false);
                            }}
                            onCancel={() => setAddressOpen(false)}
                          />
                        </div>
                      </SheetContent>
                    </Sheet>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cashSales">Ventas totales a contado</Label>
                  <div className="relative">
                    <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">Q</span>
                    <Input
                      id="cashSales"
                      type="number"
                      min={0}
                      step="0.01"
                      className="pl-7"
                      value={formData.cashSales ?? ''}
                      onChange={(e) => updateFormData('cashSales', parseFloat(e.target.value || '0'))}
                      placeholder="0.00"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="creditSales">Ventas totales a crédito</Label>
                  <div className="relative">
                    <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">Q</span>
                    <Input
                      id="creditSales"
                      type="number"
                      min={0}
                      step="0.01"
                      className="pl-7"
                      value={formData.creditSales ?? ''}
                      onChange={(e) => updateFormData('creditSales', parseFloat(e.target.value || '0'))}
                      placeholder="0.00"
                    />
                  </div>
                </div>
              </div>
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
              <Button variant="outline" size="sm" onClick={() => setActiveScreen(prev.id)}>
                Atrás {prev.label}
              </Button>
            )}
          </div>
          <div>
            {next && (
              <Button size="sm" onClick={() => setActiveScreen(next.id)}>
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
