import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Users, DollarSign, FileText, Camera, MessageCircle, Building } from 'lucide-react';
import Header from '@/components/layout/Header';
import BottomNavigationManager from '@/components/layout/BottomNavigationManager';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';
import { INVCProvider, useINVC } from '@/context/INVCContext';
import { INVCStickySummary } from '@/components/invc/INVCStickySummary';
import { ComparisonRow } from '@/components/invc/ComparisonRow';
import { INVCCalculator } from '@/components/invc/INVCCalculator';
import { GeolocationCapture } from '@/components/invc/GeolocationCapture';

const INVCComparisonContent: React.FC = () => {
  const navigate = useNavigate();
  const { invcData, updateObservedData, addDifference } = useINVC();
  const [showCalculator, setShowCalculator] = useState(false);
  const [generalComment, setGeneralComment] = useState('');

  if (!invcData) {
    return <div>Cargando datos...</div>;
  }

  const handleFinalize = () => {
    navigate(`/manager/invc/${invcData.solicitudId}/review`);
  };

  const handleCalculatorConfirm = (newAmount: number, term: number, newQuota: number) => {
    const difference = {
      campo: 'producto.monto',
      valor_declarado: invcData.declarado.producto.monto,
      valor_observado: newAmount,
      delta: Math.round(((newAmount - invcData.declarado.producto.monto) / invcData.declarado.producto.monto) * 100),
      severidad: 'media' as const,
      comentario: `Monto ajustado con calculadora: Q${newAmount.toLocaleString()} en ${term} cuotas de Q${newQuota.toLocaleString()}`
    };

    updateObservedData('producto', {
      ...invcData.observado.producto,
      monto: newAmount,
      cuota: newQuota,
      plazo: term
    });

    addDifference(difference);
    setShowCalculator(false);
  };

  const handleBusinessActivityChange = (isActive: boolean) => {
    updateObservedData('actividad', {
      ...invcData.observado.actividad,
      activa: isActive
    });
  };

  const handleProductMatchChange = (matches: boolean) => {
    if (!matches) {
      // Si no coinciden, abrir modal para comentario
      // Por ahora solo actualizar el estado
      updateObservedData('actividad', {
        ...invcData.observado.actividad,
        productos: invcData.declarado.actividad.productos,
        comentario: matches ? undefined : 'Productos no coinciden con lo declarado'
      });
    }
  };

  const handleGuarantorVerification = (guarantorId: string, found: boolean, matches: boolean, comment: string) => {
    const existingGuarantors = invcData.observado.fiadores || [];
    const updatedGuarantors = existingGuarantors.filter(g => g.id !== guarantorId);
    
    updatedGuarantors.push({
      id: guarantorId,
      encontrado: found,
      coincide: matches,
      comentario: comment
    });

    updateObservedData('fiadores', updatedGuarantors);

    if (!found || !matches) {
      const guarantor = invcData.declarado.fiadores.find(g => g.id === guarantorId);
      addDifference({
        campo: `fiador.${guarantorId}`,
        valor_declarado: guarantor?.nombre || 'Declarado',
        valor_observado: found ? 'Encontrado pero no coincide' : 'No encontrado',
        delta: 0,
        severidad: 'media',
        comentario: comment
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header 
        title={`INVC - Solicitud #${invcData.solicitudId}`}
        showBack
        onBack={() => navigate(`/manager/invc/${invcData.solicitudId}`)}
      />

      <div className="p-4 pb-20">
        <INVCStickySummary onFinalize={handleFinalize} />

        <Tabs defaultValue="personal" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="personal" className="text-xs">
              <Users className="w-4 h-4 mr-1" />
              Datos
            </TabsTrigger>
            <TabsTrigger value="financial" className="text-xs">
              <DollarSign className="w-4 h-4 mr-1" />
              Financiero
            </TabsTrigger>
            <TabsTrigger value="evidence" className="text-xs">
              <Camera className="w-4 h-4 mr-1" />
              Evidencia
            </TabsTrigger>
          </TabsList>

          <TabsContent value="personal" className="space-y-6">
            {/* Datos Personales */}
            <Card className="p-4">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Users className="w-5 h-5" />
                Datos Personales
              </h3>
              <div className="space-y-4">
                <ComparisonRow
                  label="Nombre Completo"
                  fieldPath="datosPersonales.nombre"
                  declaredValue={invcData.declarado.datosPersonales.nombre}
                  observedValue={invcData.observado.datosPersonales?.nombre}
                />
                <ComparisonRow
                  label="DPI"
                  fieldPath="datosPersonales.dpi"
                  declaredValue={invcData.declarado.datosPersonales.dpi}
                  observedValue={invcData.observado.datosPersonales?.dpi}
                />
                <ComparisonRow
                  label="Celular"
                  fieldPath="datosPersonales.celular"
                  declaredValue={invcData.declarado.datosPersonales.celular}
                  observedValue={invcData.observado.datosPersonales?.celular}
                />
                <ComparisonRow
                  label="Teléfono"
                  fieldPath="datosPersonales.telefono"
                  declaredValue={invcData.declarado.datosPersonales.telefono}
                  observedValue={invcData.observado.datosPersonales?.telefono}
                />
              </div>
            </Card>

            {/* Actividad y Productos */}
            <Card className="p-4">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Building className="w-5 h-5" />
                Actividad y Productos
              </h3>
              
              <div className="space-y-4">
                {/* Actividad Activa */}
                <div className="flex items-center justify-between p-3 border rounded">
                  <div>
                    <div className="font-medium">¿La actividad está activa?</div>
                    <div className="text-sm text-muted-foreground">
                      Declarado: {invcData.declarado.actividad.activa ? 'Sí' : 'No'}
                    </div>
                  </div>
                  <Switch
                    checked={invcData.observado.actividad?.activa ?? invcData.declarado.actividad.activa}
                    onCheckedChange={handleBusinessActivityChange}
                  />
                </div>

                {/* Productos */}
                <div className="space-y-3">
                  <div className="font-medium">Productos del negocio</div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">
                        Declarados
                      </div>
                      <div className="space-y-1">
                        {invcData.declarado.actividad.productos.map((producto, index) => (
                          <Badge key={index} variant="outline" className="mr-1 mb-1">
                            {producto}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">
                        Observados
                      </div>
                      <div className="flex items-center gap-2">
                        <Checkbox
                          checked={invcData.observado.actividad?.productos !== undefined}
                          onCheckedChange={(checked) => handleProductMatchChange(!!checked)}
                        />
                        <span className="text-sm">¿Concuerdan los productos?</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Fiadores */}
            <Card className="p-4">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Users className="w-5 h-5" />
                Fiadores
              </h3>
              
              <div className="space-y-4">
                {invcData.declarado.fiadores.map((fiador) => (
                  <Card key={fiador.id} className="p-3 border-muted">
                    <div className="space-y-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="font-medium">{fiador.nombre}</div>
                          <div className="text-sm text-muted-foreground">
                            DPI: {fiador.dpi} • {fiador.relacion}
                          </div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-3">
                        <div className="flex items-center gap-2">
                          <Checkbox />
                          <span className="text-sm">Encontrado</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Checkbox />
                          <span className="text-sm">Coincide datos</span>
                        </div>
                      </div>
                      
                      <Textarea
                        placeholder="Comentario obligatorio si no coincide o no se encontró..."
                        className="text-sm"
                        rows={2}
                      />
                    </div>
                  </Card>
                ))}
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="financial" className="space-y-6">
            {/* Ingresos y Egresos */}
            <Card className="p-4">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <DollarSign className="w-5 h-5" />
                Ingresos y Egresos
              </h3>
              <div className="space-y-4">
                <ComparisonRow
                  label="Ingresos Mensuales"
                  fieldPath="ingresos"
                  declaredValue={invcData.declarado.ingresos}
                  observedValue={invcData.observado.ingresos}
                  type="currency"
                  threshold={0.1}
                />
                <ComparisonRow
                  label="Egresos Mensuales"
                  fieldPath="egresos"
                  declaredValue={invcData.declarado.egresos}
                  observedValue={invcData.observado.egresos}
                  type="currency"
                  threshold={0.1}
                />
              </div>
            </Card>

            {/* Producto Financiero */}
            <Card className="p-4">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Producto Solicitado
              </h3>
              
              <div className="space-y-4">
                <ComparisonRow
                  label="Tipo de Crédito"
                  fieldPath="producto.tipo"
                  declaredValue={invcData.declarado.producto.tipo}
                  observedValue={invcData.observado.producto?.tipo}
                />
                
                <div className="grid grid-cols-2 gap-4">
                  <ComparisonRow
                    label="Monto"
                    fieldPath="producto.monto"
                    declaredValue={invcData.declarado.producto.monto}
                    observedValue={invcData.observado.producto?.monto}
                    type="currency"
                  />
                  <ComparisonRow
                    label="Cuota"
                    fieldPath="producto.cuota"
                    declaredValue={invcData.declarado.producto.cuota}
                    observedValue={invcData.observado.producto?.cuota}
                    type="currency"
                  />
                </div>

                <Separator />

                <div className="flex justify-center">
                  <Button
                    variant="outline"
                    onClick={() => setShowCalculator(true)}
                    className="w-full"
                  >
                    <DollarSign className="w-4 h-4 mr-2" />
                    Usar Calculadora para Ajustar Monto
                  </Button>
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="evidence" className="space-y-6">
            {/* Fotos de Referencia */}
            <Card className="p-4">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Camera className="w-5 h-5" />
                Fotos de Referencia (Agente)
              </h3>
              
              <div className="grid grid-cols-2 gap-2">
                {invcData.evidencias.fotosPrevias.map((foto, index) => (
                  <img
                    key={index}
                    src={foto}
                    alt={`Referencia ${index + 1}`}
                    className="w-full h-24 object-cover rounded border"
                  />
                ))}
              </div>
            </Card>

            {/* Nuevas Capturas */}
            <Card className="p-4">
              <h3 className="font-semibold mb-4">Nuevas Capturas (Gerente)</h3>
              
              <div className="space-y-4">
                <GeolocationCapture
                  type="negocio"
                  title="Foto del Negocio"
                  targetLocation={invcData.declarado.direccionNegocio}
                  toleranceMeters={10}
                />
                
                <GeolocationCapture
                  type="solicitante"
                  title="Foto del Solicitante"
                  toleranceMeters={10}
                />
              </div>
            </Card>

            {/* Comentarios */}
            <Card className="p-4">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <MessageCircle className="w-5 h-5" />
                Comentarios Generales
              </h3>
              
              <Textarea
                placeholder="Comentarios adicionales sobre la investigación..."
                value={generalComment}
                onChange={(e) => setGeneralComment(e.target.value)}
                rows={4}
              />
            </Card>

            {/* Lista de Discrepancias */}
            {invcData.diffs.length > 0 && (
              <Card className="p-4">
                <h3 className="font-semibold mb-4">Discrepancias Encontradas</h3>
                
                <div className="space-y-3">
                  {invcData.diffs.map((diff, index) => (
                    <div key={index} className="p-3 border rounded bg-orange-50 dark:bg-orange-900/20">
                      <div className="flex justify-between items-start mb-2">
                        <span className="font-medium">{diff.campo}</span>
                        {diff.delta !== 0 && (
                          <Badge variant="secondary">
                            {diff.delta > 0 ? '+' : ''}{diff.delta}%
                          </Badge>
                        )}
                      </div>
                      <div className="text-sm text-muted-foreground mb-2">
                        <span className="font-medium">Declarado:</span> {diff.valor_declarado} → 
                        <span className="font-medium ml-1">Observado:</span> {diff.valor_observado}
                      </div>
                      <div className="text-sm">
                        <span className="font-medium">Comentario:</span> {diff.comentario}
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>

      <INVCCalculator
        isOpen={showCalculator}
        onClose={() => setShowCalculator(false)}
        onConfirm={handleCalculatorConfirm}
        currentAmount={invcData.declarado.producto.monto}
        currentTerm={invcData.declarado.producto.plazo}
        currentQuota={invcData.declarado.producto.cuota}
      />

      <BottomNavigationManager />
    </div>
  );
};

const INVCComparison: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  
  if (!id) {
    return <div>ID de solicitud no encontrado</div>;
  }

  return (
    <INVCProvider solicitudId={id}>
      <INVCComparisonContent />
    </INVCProvider>
  );
};

export default INVCComparison;