
import React, { useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

interface AnalisisFinancieroProps {
  formData: any;
  updateFormData: (field: string, value: any) => void;
}

const AnalisisFinanciero: React.FC<AnalisisFinancieroProps> = ({ formData, updateFormData }) => {
  // Cálculos automáticos
  const ingresoTotal = (parseFloat(formData.ingresoPrincipal || 0) + parseFloat(formData.ingresoSecundario || 0));
  
  const gastoTotal = [
    'gastoAlimentacion', 'gastoVestuario', 'gastoServiciosBasicos', 'gastoComercial',
    'gastoEducacion', 'gastoVivienda', 'gastoTransporte', 'gastoCompromisos',
    'gastoFinancieros', 'gastoDescuentos'
  ].reduce((total, field) => total + parseFloat(formData[field] || 0), 0);

  const disponibilidad = ingresoTotal - gastoTotal;
  const cobertura = formData.cuota ? (disponibilidad / parseFloat(formData.cuota || 1) * 100) : 0;

  const activoTotal = [
    'activoEfectivo', 'activoCuentas', 'activoInventario', 'activoMaquinaria',
    'activoVehiculos', 'activoInmuebles', 'activoOtros'
  ].reduce((total, field) => total + parseFloat(formData[field] || 0), 0);

  const pasivoTotal = [
    'pasivoProveedores', 'pasivoPrestamos', 'pasivoOtros'
  ].reduce((total, field) => total + parseFloat(formData[field] || 0), 0);

  const patrimonio = activoTotal - pasivoTotal;
  const ratioEndeudamiento = activoTotal > 0 ? (pasivoTotal / activoTotal * 100) : 0;

  // Actualizar cálculos automáticamente
  useEffect(() => {
    updateFormData('ingresoTotal', ingresoTotal);
    updateFormData('gastoTotal', gastoTotal);
    updateFormData('disponibilidad', disponibilidad);
    updateFormData('cobertura', cobertura);
    updateFormData('activoTotal', activoTotal);
    updateFormData('pasivoTotal', pasivoTotal);
    updateFormData('patrimonio', patrimonio);
    updateFormData('ratioEndeudamiento', ratioEndeudamiento);
  }, [ingresoTotal, gastoTotal, disponibilidad, cobertura, activoTotal, pasivoTotal, patrimonio, ratioEndeudamiento, updateFormData]);

  return (
    <Card className="border-0 shadow-none">
      <CardContent className="p-0 space-y-6">
        <div>
          <h3 className="font-semibold text-lg">Análisis Financiero</h3>
          <p className="text-muted-foreground text-sm">
            Análisis detallado de ingresos, gastos, activos y pasivos del solicitante.
          </p>
        </div>

        {/* Ingresos */}
        <div className="space-y-4">
          <h4 className="font-medium">Ingresos</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="ingresoPrincipal">2.01 Ingreso Principal Q *</Label>
              <Input 
                id="ingresoPrincipal"
                type="number"
                min="0"
                step="0.01"
                value={formData.ingresoPrincipal || ''} 
                onChange={(e) => updateFormData('ingresoPrincipal', e.target.value)}
                placeholder="0.00"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="ingresoSecundario">2.02 Ingreso Secundario Q (opcional)</Label>
              <Input 
                id="ingresoSecundario"
                type="number"
                min="0"
                step="0.01"
                value={formData.ingresoSecundario || ''} 
                onChange={(e) => updateFormData('ingresoSecundario', e.target.value)}
                placeholder="0.00"
              />
            </div>
          </div>
        </div>

        <Separator />

        {/* Gastos */}
        <div className="space-y-4">
          <h4 className="font-medium">Gastos Mensuales (2.03-2.12)</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="gastoAlimentacion">2.03 Alimentación Q</Label>
              <Input 
                id="gastoAlimentacion"
                type="number"
                min="0"
                step="0.01"
                value={formData.gastoAlimentacion || ''} 
                onChange={(e) => updateFormData('gastoAlimentacion', e.target.value)}
                placeholder="1,200.00"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="gastoVestuario">2.04 Vestuario Q</Label>
              <Input 
                id="gastoVestuario"
                type="number"
                min="0"
                step="0.01"
                value={formData.gastoVestuario || ''} 
                onChange={(e) => updateFormData('gastoVestuario', e.target.value)}
                placeholder="0.00"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="gastoServiciosBasicos">2.05 Servicios Básicos Q</Label>
              <Input 
                id="gastoServiciosBasicos"
                type="number"
                min="0"
                step="0.01"
                value={formData.gastoServiciosBasicos || ''} 
                onChange={(e) => updateFormData('gastoServiciosBasicos', e.target.value)}
                placeholder="200.00"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="gastoComercial">2.06 Comercial (Principal) Q</Label>
              <Input 
                id="gastoComercial"
                type="number"
                min="0"
                step="0.01"
                value={formData.gastoComercial || ''} 
                onChange={(e) => updateFormData('gastoComercial', e.target.value)}
                placeholder="4,280.00"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="gastoEducacion">2.07 Educación Q</Label>
              <Input 
                id="gastoEducacion"
                type="number"
                min="0"
                step="0.01"
                value={formData.gastoEducacion || ''} 
                onChange={(e) => updateFormData('gastoEducacion', e.target.value)}
                placeholder="0.00"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="gastoVivienda">2.08 Vivienda Q</Label>
              <Input 
                id="gastoVivienda"
                type="number"
                min="0"
                step="0.01"
                value={formData.gastoVivienda || ''} 
                onChange={(e) => updateFormData('gastoVivienda', e.target.value)}
                placeholder="0.00"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="gastoTransporte">2.09 Transporte Q</Label>
              <Input 
                id="gastoTransporte"
                type="number"
                min="0"
                step="0.01"
                value={formData.gastoTransporte || ''} 
                onChange={(e) => updateFormData('gastoTransporte', e.target.value)}
                placeholder="200.00"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="gastoCompromisos">2.10 Compromisos Q</Label>
              <Input 
                id="gastoCompromisos"
                type="number"
                min="0"
                step="0.01"
                value={formData.gastoCompromisos || ''} 
                onChange={(e) => updateFormData('gastoCompromisos', e.target.value)}
                placeholder="0.00"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="gastoFinancieros">2.11 Gastos Financieros Q</Label>
              <Input 
                id="gastoFinancieros"
                type="number"
                min="0"
                step="0.01"
                value={formData.gastoFinancieros || ''} 
                onChange={(e) => updateFormData('gastoFinancieros', e.target.value)}
                placeholder="394.00"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="gastoDescuentos">2.12 Descuentos de Planilla Q</Label>
              <Input 
                id="gastoDescuentos"
                type="number"
                min="0"
                step="0.01"
                value={formData.gastoDescuentos || ''} 
                onChange={(e) => updateFormData('gastoDescuentos', e.target.value)}
                placeholder="0.00"
              />
            </div>
          </div>
        </div>

        <Separator />

        {/* Cálculos */}
        <div className="space-y-4">
          <h4 className="font-medium">Cálculos Automáticos (2.13-2.17)</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>2.13 Ingresos Total Q</Label>
              <Input 
                type="number"
                value={ingresoTotal.toFixed(2)}
                readOnly
                className="bg-muted"
              />
            </div>

            <div className="space-y-2">
              <Label>2.14 Gastos Total Q</Label>
              <Input 
                type="number"
                value={gastoTotal.toFixed(2)}
                readOnly
                className="bg-muted"
              />
            </div>

            <div className="space-y-2">
              <Label>2.15 Disponibilidad Q</Label>
              <Input 
                type="number"
                value={disponibilidad.toFixed(2)}
                readOnly
                className="bg-muted"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="cuota">2.16 Cuota Q</Label>
              <Input 
                id="cuota"
                type="number"
                min="0"
                step="0.01"
                value={formData.cuota || ''} 
                onChange={(e) => updateFormData('cuota', e.target.value)}
                placeholder="0.00"
              />
            </div>

            <div className="space-y-2">
              <Label>2.17 Cobertura %</Label>
              <Input 
                type="number"
                value={cobertura.toFixed(2)}
                readOnly
                className="bg-muted"
              />
            </div>
          </div>
        </div>

        <Separator />

        {/* Activos */}
        <div className="space-y-4">
          <h4 className="font-medium">Activos (2.18-2.24)</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="activoEfectivo">2.18 Efectivo y Bancos Q</Label>
              <Input 
                id="activoEfectivo"
                type="number"
                min="0"
                step="0.01"
                value={formData.activoEfectivo || ''} 
                onChange={(e) => updateFormData('activoEfectivo', e.target.value)}
                placeholder="0.00"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="activoCuentas">2.19 Cuentas por Cobrar Q</Label>
              <Input 
                id="activoCuentas"
                type="number"
                min="0"
                step="0.01"
                value={formData.activoCuentas || ''} 
                onChange={(e) => updateFormData('activoCuentas', e.target.value)}
                placeholder="0.00"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="activoInventario">2.20 Inventario Q</Label>
              <Input 
                id="activoInventario"
                type="number"
                min="0"
                step="0.01"
                value={formData.activoInventario || ''} 
                onChange={(e) => updateFormData('activoInventario', e.target.value)}
                placeholder="0.00"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="activoMaquinaria">2.21 Maquinaria y Equipo Q</Label>
              <Input 
                id="activoMaquinaria"
                type="number"
                min="0"
                step="0.01"
                value={formData.activoMaquinaria || ''} 
                onChange={(e) => updateFormData('activoMaquinaria', e.target.value)}
                placeholder="0.00"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="activoVehiculos">2.22 Vehículos Q</Label>
              <Input 
                id="activoVehiculos"
                type="number"
                min="0"
                step="0.01"
                value={formData.activoVehiculos || ''} 
                onChange={(e) => updateFormData('activoVehiculos', e.target.value)}
                placeholder="0.00"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="activoInmuebles">2.23 Inmuebles Q</Label>
              <Input 
                id="activoInmuebles"
                type="number"
                min="0"
                step="0.01"
                value={formData.activoInmuebles || ''} 
                onChange={(e) => updateFormData('activoInmuebles', e.target.value)}
                placeholder="0.00"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="activoOtros">2.24 Otros Activos Q</Label>
              <Input 
                id="activoOtros"
                type="number"
                min="0"
                step="0.01"
                value={formData.activoOtros || ''} 
                onChange={(e) => updateFormData('activoOtros', e.target.value)}
                placeholder="0.00"
              />
            </div>
          </div>
        </div>

        <Separator />

        {/* Pasivos */}
        <div className="space-y-4">
          <h4 className="font-medium">Pasivos (2.25-2.27)</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="pasivoProveedores">2.25 Proveedores Q</Label>
              <Input 
                id="pasivoProveedores"
                type="number"
                min="0"
                step="0.01"
                value={formData.pasivoProveedores || ''} 
                onChange={(e) => updateFormData('pasivoProveedores', e.target.value)}
                placeholder="0.00"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="pasivoPrestamos">2.26 Préstamos Q</Label>
              <Input 
                id="pasivoPrestamos"
                type="number"
                min="0"
                step="0.01"
                value={formData.pasivoPrestamos || ''} 
                onChange={(e) => updateFormData('pasivoPrestamos', e.target.value)}
                placeholder="0.00"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="pasivoOtros">2.27 Otros Pasivos Q</Label>
              <Input 
                id="pasivoOtros"
                type="number"
                min="0"
                step="0.01"
                value={formData.pasivoOtros || ''} 
                onChange={(e) => updateFormData('pasivoOtros', e.target.value)}
                placeholder="0.00"
              />
            </div>
          </div>
        </div>

        <Separator />

        {/* Totales y Ratios */}
        <div className="space-y-4">
          <h4 className="font-medium">Totales y Ratios (2.28-2.30)</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>2.28 Total Activos Q</Label>
              <Input 
                type="number"
                value={activoTotal.toFixed(2)}
                readOnly
                className="bg-muted"
              />
            </div>

            <div className="space-y-2">
              <Label>2.29 Total Pasivos Q</Label>
              <Input 
                type="number"
                value={pasivoTotal.toFixed(2)}
                readOnly
                className="bg-muted"
              />
            </div>

            <div className="space-y-2">
              <Label>2.30 Patrimonio Q</Label>
              <Input 
                type="number"
                value={patrimonio.toFixed(2)}
                readOnly
                className="bg-muted"
              />
            </div>

            <div className="space-y-2">
              <Label>Ratio Endeudamiento %</Label>
              <Input 
                type="number"
                value={ratioEndeudamiento.toFixed(2)}
                readOnly
                className="bg-muted"
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AnalisisFinanciero;
