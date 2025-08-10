import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Bot, ChevronDown, Lightbulb, Eye } from 'lucide-react';

interface AIAnalysisCardProps {
  formData: any;
  financialData: any;
  totals: {
    currentAssetsPrev: number; currentAssetsCurr: number;
    totalAssetsPrev: number; totalAssetsCurr: number;
    shortTermLiabPrev: number; shortTermLiabCurr: number;
    longTermLiabPrev: number; longTermLiabCurr: number;
    totalLiabPrev: number; totalLiabCurr: number;
    equityPrev: number; equityCurr: number;
  };
}

// Helpers
const numberVal = (v: any) => {
  const n = parseFloat(v);
  return isNaN(n) ? 0 : n;
};
const safeDiv = (a: number, b: number) => (b && isFinite(b) && b !== 0 ? a / b : NaN);
const sum = (obj: Record<string, number | ''> = {}) => Object.values(obj).reduce<number>((acc, v) => acc + numberVal(v), 0);
const currency = (v: number) => new Intl.NumberFormat('es-GT', { style: 'currency', currency: 'GTQ', maximumFractionDigits: 2 }).format(isFinite(v) ? v || 0 : 0);

// Thresholds (overridable)
const getThresholds = (override?: any) => ({
  liq_ok: 1.5,
  liq_warn_min: 1.0,
  acida_ok: 1.2,
  acida_warn_min: 1.0,
  endeuda_ok_max: 0.5,
  endeuda_warn_max: 0.7,
  gap_pago_warn_min: 0.0,
  ...(override || {}),
});

// Engine
type Risk = 'bajo' | 'medio' | 'alto';
interface AIReturn {
  resumen: string;
  riesgo: Risk;
  drivers: string[];
  acciones: string[];
  confianza: number;
  explicacion: {
    reglas_disparadas: string[];
    umbrales: Record<string, number>;
    metricas: {
      anterior: Record<string, number>;
      actual: Record<string, number>;
    };
  };
}

const riskBadgeClasses = (r: Risk) =>
  r === 'bajo'
    ? 'bg-green-100 text-green-700 border-green-300'
    : r === 'medio'
    ? 'bg-yellow-100 text-yellow-700 border-yellow-300'
    : 'bg-red-100 text-red-700 border-red-300';

const AIAnalysisCard: React.FC<AIAnalysisCardProps> = ({ formData, financialData, totals }) => {
  const [open, setOpen] = React.useState(false);
  const [result, setResult] = React.useState<AIReturn | null>(null);

  const thresholds = React.useMemo(() => getThresholds(formData?.financialAdditional?.aiThresholds), [formData]);

  // Build input metrics prev/actual
  const metrics = React.useMemo(() => {
    const invPrev = sum({
      invMateriaPrima: financialData?.currentAssets?.prev?.invMateriaPrima,
      invEnProceso: financialData?.currentAssets?.prev?.invEnProceso,
      invTerminados: financialData?.currentAssets?.prev?.invTerminados,
    });
    const invCurr = sum({
      invMateriaPrima: financialData?.currentAssets?.curr?.invMateriaPrima,
      invEnProceso: financialData?.currentAssets?.curr?.invEnProceso,
      invTerminados: financialData?.currentAssets?.curr?.invTerminados,
    });

    const liqCorrientePrev = safeDiv(totals.currentAssetsPrev, totals.shortTermLiabPrev);
    const liqCorrienteAct = safeDiv(totals.currentAssetsCurr, totals.shortTermLiabCurr);
    const liqAcidaPrev = safeDiv(totals.currentAssetsPrev - invPrev, totals.shortTermLiabPrev);
    const liqAcidaAct = safeDiv(totals.currentAssetsCurr - invCurr, totals.shortTermLiabCurr);

    const endeudaPrev = safeDiv(totals.totalLiabPrev, totals.totalAssetsPrev);
    const endeudaAct = safeDiv(totals.totalLiabCurr, totals.totalAssetsCurr);

    const ventasAct = numberVal(formData?.cashSales) + numberVal(formData?.creditSales);
    const ventasPrev = ventasAct; // si no hay histórico
    const utilidadAct = ventasAct - numberVal(formData?.costOfSales) - numberVal(formData?.operatingExpenses);
    const utilidadPrev = utilidadAct; // si no hay histórico

    const capPagoAct =
      numberVal(formData?.financialAdditional?.paymentCapacity?.monthCritical) ||
      (isFinite(utilidadAct) ? utilidadAct : 0);
    const capPagoPrev = capPagoAct;
    const cuota = numberVal(formData?.cuotaSolicitada);

    return {
      anterior: {
        liquidez_corriente: liqCorrientePrev,
        liquidez_acida: liqAcidaPrev,
        endeudamiento: endeudaPrev,
        ventas: ventasPrev,
        utilidad_liquida: utilidadPrev,
        capacidad_pago_mes_critico: capPagoPrev,
        cuota_este_prestamo: cuota,
      },
      actual: {
        liquidez_corriente: liqCorrienteAct,
        liquidez_acida: liqAcidaAct,
        endeudamiento: endeudaAct,
        ventas: ventasAct,
        utilidad_liquida: utilidadAct,
        capacidad_pago_mes_critico: capPagoAct,
        cuota_este_prestamo: cuota,
      },
    };
  }, [formData, financialData, totals]);

  // Debounced compute (300ms)
  React.useEffect(() => {
    const t = setTimeout(() => {
      const r = computeAI(metrics, thresholds);
      setResult(r);
    }, 300);
    return () => clearTimeout(t);
  }, [metrics, thresholds]);

  if (!result) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bot className="h-5 w-5" /> Comentario AI
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">Analizando métricas...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="card-hover">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Bot className="h-5 w-5" /> Comentario AI
          </CardTitle>
          <Badge className={`border ${riskBadgeClasses(result.riesgo)}`}>{result.riesgo.toUpperCase()}</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm font-medium">
          <span className="mr-1">Comentario:</span>
          <span>{typeof result.resumen === 'string' ? result.resumen.charAt(0).toUpperCase() + result.resumen.slice(1) : ''}</span>
        </p>

        <div className="flex flex-wrap gap-2">
          {result.drivers.slice(0, 3).map((d, i) => (
            <span key={i} className="inline-flex items-center rounded-full border-2 border-primary text-primary px-2.5 py-1 text-xs">
              <Lightbulb className="mr-1 h-3.5 w-3.5" /> {d}
            </span>
          ))}
        </div>

        <div>
          <h4 className="text-sm font-medium mb-2">Acciones recomendadas</h4>
          <ul className="list-disc pl-5 text-sm space-y-1">
            {result.acciones.slice(0, 2).map((a, i) => (
              <li key={i}>{a}</li>
            ))}
          </ul>
        </div>

        <div className="text-xs text-muted-foreground">Confianza: {result.confianza.toFixed(2)}</div>

        <Collapsible open={open} onOpenChange={setOpen}>
          <div className="flex items-center justify-between">
            <CollapsibleTrigger asChild>
              <Button variant="outline" className="border-2 border-primary text-primary hover:bg-primary/5">
                <Eye className="mr-2 h-4 w-4" /> Ver explicación
                <ChevronDown className={`ml-2 h-4 w-4 transition-transform ${open ? 'rotate-180' : ''}`} />
              </Button>
            </CollapsibleTrigger>
          </div>
          <CollapsibleContent className="mt-4 space-y-4">
            <div>
              <h5 className="text-sm font-medium mb-1">Reglas disparadas</h5>
              <ul className="list-disc pl-5 text-sm space-y-1">
                {result.explicacion.reglas_disparadas.map((r, i) => (
                  <li key={i}>{r}</li>
                ))}
              </ul>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-3 rounded-lg border bg-card/50">
                <h6 className="text-xs font-medium mb-2">Umbrales</h6>
                <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-xs">
                  {Object.entries(result.explicacion.umbrales).map(([k, v]) => (
                    <React.Fragment key={k}>
                      <span className="text-muted-foreground">{k}</span>
                      <span className="text-right">{typeof v === 'number' ? v.toFixed(2) : String(v)}</span>
                    </React.Fragment>
                  ))}
                </div>
              </div>
              <div className="p-3 rounded-lg border bg-card/50">
                <h6 className="text-xs font-medium mb-2">Métricas clave</h6>
                <div className="text-xs space-y-1">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Liq. corriente (ant/act)</span>
                    <span>{fmt(metrics.anterior.liquidez_corriente)} / {fmt(metrics.actual.liquidez_corriente)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Liq. ácida (ant/act)</span>
                    <span>{fmt(metrics.anterior.liquidez_acida)} / {fmt(metrics.actual.liquidez_acida)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Endeudamiento (ant/act)</span>
                    <span>{fmt(metrics.anterior.endeudamiento)} / {fmt(metrics.actual.endeudamiento)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Ventas (ant/act)</span>
                    <span>{currency(metrics.anterior.ventas)} / {currency(metrics.actual.ventas)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Utilidad líquida (ant/act)</span>
                    <span>{currency(metrics.anterior.utilidad_liquida)} / {currency(metrics.actual.utilidad_liquida)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Capacidad pago (act)</span>
                    <span>{currency(metrics.actual.capacidad_pago_mes_critico)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Cuota</span>
                    <span>{currency(metrics.actual.cuota_este_prestamo)}</span>
                  </div>
                </div>
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>
      </CardContent>
    </Card>
  );
};

function fmt(v: number) {
  return isFinite(v) ? v.toFixed(2) : '—';
}

function computeAI(metrics: { anterior: any; actual: any }, th: ReturnType<typeof getThresholds>): AIReturn {
  const act = metrics.actual;
  const ant = metrics.anterior;

  const reglas: string[] = [];
  let ok = 0, warn = 0, bad = 0;

  // Liquidez corriente
  if (isFinite(act.liquidez_corriente)) {
    if (act.liquidez_corriente >= th.liq_ok) { ok++; reglas.push('liq_corriente_actual>=liq_ok'); }
    else if (act.liquidez_corriente >= th.liq_warn_min) { warn++; reglas.push('liq_corriente_actual>=liq_warn_min'); }
    else { bad++; reglas.push('liq_corriente_actual<liq_warn_min'); }
  }

  // Liquidez ácida
  if (isFinite(act.liquidez_acida)) {
    if (act.liquidez_acida >= th.acida_ok) { ok++; reglas.push('liq_acida_actual>=acida_ok'); }
    else if (act.liquidez_acida >= th.acida_warn_min) { warn++; reglas.push('liq_acida_actual>=acida_warn_min'); }
    else { bad++; reglas.push('liq_acida_actual<acida_warn_min'); }
  }

  // Endeudamiento (deuda/activo)
  if (isFinite(act.endeudamiento)) {
    if (act.endeudamiento <= th.endeuda_ok_max) { ok++; reglas.push('endeudamiento<=endeuda_ok_max'); }
    else if (act.endeudamiento <= th.endeuda_warn_max) { warn++; reglas.push('endeudamiento<=endeuda_warn_max'); }
    else { bad++; reglas.push('endeudamiento>endeuda_warn_max'); }
  }

  // Capacidad de pago vs cuota
  if (isFinite(act.capacidad_pago_mes_critico) && isFinite(act.cuota_este_prestamo)) {
    const gap = act.capacidad_pago_mes_critico - act.cuota_este_prestamo;
    if (gap >= th.gap_pago_warn_min) { ok++; reglas.push('capacidad_pago>=cuota'); }
    else { bad++; reglas.push('capacidad_pago<cuota'); }
  }

  // Tendencias
  if (isFinite(act.liquidez_corriente) && isFinite(ant.liquidez_corriente) && act.liquidez_corriente > ant.liquidez_corriente) {
    reglas.push('tendencia_liq_corriente_mejora');
  }
  if (isFinite(act.ventas) && isFinite(ant.ventas) && act.ventas > ant.ventas) {
    reglas.push('tendencia_ventas_mejora');
  }
  if (isFinite(act.utilidad_liquida) && isFinite(ant.utilidad_liquida) && act.utilidad_liquida > ant.utilidad_liquida) {
    reglas.push('tendencia_utilidad_mejora');
  }

  // Riesgo
  let riesgo: Risk = 'medio';
  if (bad >= 2) riesgo = 'alto';
  else if (bad === 0 && ok >= 3) riesgo = 'bajo';

  // Drivers
  const drivers: string[] = [];
  if (reglas.includes('tendencia_liq_corriente_mejora')) drivers.push('Mejora de liquidez actual vs. anterior');
  if (reglas.includes('endeudamiento<=endeuda_ok_max')) drivers.push('Endeudamiento controlado');
  if (reglas.includes('capacidad_pago>=cuota')) drivers.push('Cobertura de cuota adecuada');
  if (reglas.includes('tendencia_ventas_mejora')) drivers.push('Crecimiento de ventas');
  if (reglas.includes('tendencia_utilidad_mejora')) drivers.push('Utilidad en expansión');
  if (reglas.includes('liq_acida_actual<acida_warn_min') || reglas.includes('liq_corriente_actual<liq_warn_min')) drivers.push('Liquidez débil en el corto plazo');
  if (reglas.includes('capacidad_pago<cuota')) drivers.push('Capacidad de pago insuficiente');

  // Acciones
  const acciones: string[] = [];
  if (reglas.includes('liq_corriente_actual<liq_warn_min') || reglas.includes('liq_acida_actual<acida_warn_min')) {
    acciones.push('Mejorar capital de trabajo y rotación de cuentas por cobrar');
  }
  if (reglas.includes('endeudamiento>endeuda_warn_max')) {
    acciones.push('Reducir pasivos o reestructurar deuda para bajar apalancamiento');
  }
  if (reglas.includes('capacidad_pago<cuota')) {
    acciones.push('Revisar monto/plazo de la cuota para mejorar cobertura');
  }
  if (acciones.length < 2) {
    acciones.push('Verificar estacionalidad de ventas y ajustar gastos operativos');
  }

  // Confianza
  let confianza = 0.9;
  const missing = [act.liquidez_corriente, act.liquidez_acida, act.endeudamiento, act.capacidad_pago_mes_critico, act.cuota_este_prestamo]
    .filter((v) => !isFinite(v as number)).length;
  confianza = Math.max(0.5, confianza - missing * 0.08);
  const hasPairs = [
    isFinite(act.liquidez_corriente) && isFinite(ant.liquidez_corriente),
    isFinite(act.ventas) && isFinite(ant.ventas),
    isFinite(act.utilidad_liquida) && isFinite(ant.utilidad_liquida),
  ].filter(Boolean).length;
  if (hasPairs >= 2) confianza = Math.min(1, confianza + 0.03);

  // Resumen
  const partes: string[] = [];
  if (reglas.includes('liq_corriente_actual>=liq_ok') || reglas.includes('liq_corriente_actual>=liq_warn_min')) {
    partes.push('Liquidez ' + (reglas.includes('liq_corriente_actual>=liq_ok') ? 'sólida' : 'justa'));
  } else if (reglas.includes('liq_corriente_actual<liq_warn_min')) {
    partes.push('Liquidez débil');
  }
  if (reglas.includes('capacidad_pago>=cuota')) partes.push('capacidad de pago cubre la cuota');
  else if (reglas.includes('capacidad_pago<cuota')) partes.push('capacidad de pago no cubre la cuota');
  if (reglas.includes('endeudamiento<=endeuda_ok_max')) partes.push('endeudamiento controlado');
  else if (reglas.includes('endeudamiento>endeuda_warn_max')) partes.push('alto apalancamiento');
  if (reglas.includes('tendencia_liq_corriente_mejora')) partes.push('mejorando');

  const resumen = partes.length
    ? partes.slice(0, 3).join('; ') + '.'
    : 'Datos limitados; se requieren métricas clave para un diagnóstico robusto.';

  return {
    resumen,
    riesgo,
    drivers: drivers.slice(0, 3),
    acciones: acciones.slice(0, 2),
    confianza,
    explicacion: {
      reglas_disparadas: reglas,
      umbrales: th as Record<string, number>,
      metricas: metrics,
    },
  };
}

export default AIAnalysisCard;
