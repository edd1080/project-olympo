import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Users, DollarSign, FileText, Camera, MessageCircle, Building, CheckCircle } from 'lucide-react';
import Header from '@/components/layout/Header';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { INVCProvider, useINVC } from '@/context/INVCContext';
import { INVCStickySummary } from '@/components/invc/INVCStickySummary';
import { ComparisonRow } from '@/components/invc/ComparisonRow';
import { INVCCalculator } from '@/components/invc/INVCCalculator';
import { GeolocationCapture } from '@/components/invc/GeolocationCapture';
import { PhotoViewerModal } from '@/components/invc/PhotoViewerModal';

const INVCComparisonContent: React.FC = () => {
  const navigate = useNavigate();
  const { invcData, updateObservedData, addDifference, setINVCData } = useINVC();
  const [showCalculator, setShowCalculator] = useState(false);
  const [generalComment, setGeneralComment] = useState('');
  const [selectedPhoto, setSelectedPhoto] = useState<{ url: string; title: string; geotag?: any; timestamp?: string } | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const [activeTab, setActiveTab] = useState('personal');

  useEffect(() => {
    const handleInvcExit = () => {
      setShowExitConfirm(true);
    };

    window.addEventListener('invcExit', handleInvcExit);
    return () => window.removeEventListener('invcExit', handleInvcExit);
  }, []);

  if (!invcData) {
    return <div>Cargando datos...</div>;
  }

  const handleFinalize = () => {
    if (!invcData) return;
    
    // Update INVC status to completed
    const updatedData = {
      ...invcData,
      estado: 'completado' as const,
      comentarioGeneral: generalComment,
      fechaActualizacion: new Date().toISOString()
    };
    
    setINVCData(updatedData);
    setShowConfirmModal(false);
    
    // Navigate back to details page
    navigate(`/manager/invc/${invcData.solicitudId}`);
  };

  const handleExitInvestigation = () => {
    navigate(`/manager/invc/${invcData.solicitudId}`);
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

  const tabs = ['personal', 'financial', 'evidence'];
  const currentTabIndex = tabs.indexOf(activeTab);

  const goPrev = () => {
    if (currentTabIndex > 0) {
      setActiveTab(tabs[currentTabIndex - 1]);
    }
  };

  const goNext = () => {
    if (currentTabIndex < tabs.length - 1) {
      setActiveTab(tabs[currentTabIndex + 1]);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="p-4 pb-20">
        <INVCStickySummary 
          onFinalize={handleFinalize} 
          onFinalizeINVC={() => setShowConfirmModal(true)} 
        />

        {/* Calculator Section */}
        <Card className="p-4 mb-6">
          <div className="flex justify-center">
            <Button
              variant="outline"
              onClick={() => setShowCalculator(true)}
              className="w-full max-w-md"
            >
              <DollarSign className="w-4 h-4 mr-2" />
              Usar Calculadora para Ajustar Monto
            </Button>
          </div>
        </Card>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="personal" className="text-sm">
              Datos
            </TabsTrigger>
            <TabsTrigger value="financial" className="text-sm">
              Financiero
            </TabsTrigger>
            <TabsTrigger value="evidence" className="text-sm">
              Evidencia
            </TabsTrigger>
          </TabsList>

          <TabsContent value="personal" className="space-y-6">
            <Card className="p-6">
              <h3 className="font-semibold mb-6 flex items-center gap-2">
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

              <Separator className="my-6" />

              <h3 className="font-semibold mb-6 flex items-center gap-2">
                <Building className="w-5 h-5" />
                Actividad y Productos
              </h3>
              
              <div className="space-y-6">
                {/* Actividad Activa */}
                <div className="flex items-center justify-between p-4 border rounded-lg bg-muted/30">
                  <div className="space-y-1">
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
                <div className="space-y-4">
                  <div className="font-medium">Productos del negocio</div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                        Declarados
                      </div>
                      <div className="p-3 bg-muted/30 rounded-lg min-h-[60px] flex flex-wrap items-center gap-2">
                        {invcData.declarado.actividad.productos.map((producto, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {producto}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                        Observados
                      </div>
                      <div className="p-3 bg-muted/30 rounded-lg min-h-[60px] flex items-center">
                        <div className="flex items-center gap-3">
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
              </div>

              <Separator className="my-6" />

              <h3 className="font-semibold mb-6 flex items-center gap-2">
                <Users className="w-5 h-5" />
                Fiadores
              </h3>
              
              <div className="space-y-6">
                {invcData.declarado.fiadores.map((fiador) => (
                  <Card key={fiador.id} className="p-4 border-muted bg-muted/20">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <div className="font-medium text-lg">{fiador.nombre}</div>
                        <div className="text-sm text-muted-foreground">
                          DPI: {fiador.dpi} • {fiador.relacion}
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="flex items-center gap-3 p-3 bg-background rounded-lg">
                          <Checkbox />
                          <span className="text-sm font-medium">Encontrado</span>
                        </div>
                        <div className="flex items-center gap-3 p-3 bg-background rounded-lg">
                          <Checkbox />
                          <span className="text-sm font-medium">Coincide datos</span>
                        </div>
                      </div>
                      
                      <Textarea
                        placeholder="Comentario obligatorio si no coincide o no se encontró..."
                        className="text-sm bg-background"
                        rows={3}
                      />
                    </div>
                  </Card>
                ))}
              </div>
            </Card>

            {/* Navigation Buttons */}
            <div className="flex justify-between items-center pt-4">
              <Button 
                variant="outline" 
                onClick={goPrev}
                disabled={currentTabIndex === 0}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Anterior
              </Button>
              <Button 
                onClick={goNext}
                disabled={currentTabIndex === tabs.length - 1}
                className="flex items-center gap-2"
              >
                Siguiente
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="financial" className="space-y-6">
            <Card className="p-6">
              <h3 className="font-semibold mb-6 flex items-center gap-2">
                <DollarSign className="w-5 h-5" />
                Ingresos y Egresos
              </h3>
              <div className="space-y-6">
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

              <Separator className="my-6" />

              <h3 className="font-semibold mb-6 flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Producto Solicitado
              </h3>
              
              <div className="space-y-6">
                <ComparisonRow
                  label="Tipo de Crédito"
                  fieldPath="producto.tipo"
                  declaredValue={invcData.declarado.producto.tipo}
                  observedValue={invcData.observado.producto?.tipo}
                />
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
              </div>
            </Card>

            {/* Navigation Buttons */}
            <div className="flex justify-between items-center pt-4">
              <Button 
                variant="outline" 
                onClick={goPrev}
                disabled={currentTabIndex === 0}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Anterior
              </Button>
              <Button 
                onClick={goNext}
                disabled={currentTabIndex === tabs.length - 1}
                className="flex items-center gap-2"
              >
                Siguiente
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="evidence" className="space-y-6">
            <Card className="p-6">
              <h3 className="font-bold text-lg mb-6 flex items-center gap-2">
                <Camera className="w-5 h-5" />
                Fotos de Referencia (Agente)
              </h3>
              
              <div className="grid grid-cols-2 gap-4">
                {invcData.evidencias.fotosPrevias.map((foto, index) => (
                  <div
                    key={index}
                    onClick={() => setSelectedPhoto({ url: foto, title: `Referencia ${index + 1}` })}
                    className="aspect-square cursor-pointer overflow-hidden rounded-lg border-2 border-border hover:border-primary transition-colors"
                  >
                    <img
                      src={foto}
                      alt={`Referencia ${index + 1}`}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
                    />
                  </div>
                ))}
              </div>
              
              <div className="mt-4 p-3 bg-muted/30 rounded-lg">
                <p className="text-sm text-muted-foreground">
                  Estas fotos fueron tomadas por el agente durante el llenado de la solicitud. 
                  Úsalas como referencia para comparar con las nuevas capturas.
                </p>
              </div>
            </Card>

            {/* Comentarios */}
            <Card className="p-6">
              <h3 className="font-semibold mb-6 flex items-center gap-2">
                <MessageCircle className="w-5 h-5" />
                Comentarios Generales
              </h3>
              
              <Textarea
                placeholder="Comentarios adicionales sobre la investigación..."
                value={generalComment}
                onChange={(e) => setGeneralComment(e.target.value)}
                rows={4}
                className="bg-muted/30"
              />
              
              {/* Finalizar INVC Button in Evidence Tab */}
              <div className="pt-4">
                <AlertDialog open={showConfirmModal} onOpenChange={setShowConfirmModal}>
                  <AlertDialogTrigger asChild>
                    <Button className="w-full" size="lg">
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Finalizar INVC
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Confirmar finalización</AlertDialogTitle>
                      <AlertDialogDescription>
                        ¿Estás seguro de que deseas finalizar esta investigación INVC? 
                        Una vez completada, se marcará como finalizada y no podrá modificarse.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                      <AlertDialogAction onClick={handleFinalize}>
                        Sí, finalizar investigación
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </Card>

            {/* Lista de Discrepancias */}
            {invcData.diffs.length > 0 && (
              <Card className="p-6">
                <h3 className="font-semibold mb-6">Discrepancias Encontradas</h3>
                
                <div className="space-y-4">
                  {invcData.diffs.map((diff, index) => (
                    <div key={index} className="p-4 border rounded-lg bg-orange-50 dark:bg-orange-900/20">
                      <div className="flex justify-between items-start mb-3">
                        <span className="font-medium text-lg">{diff.campo}</span>
                        {diff.delta !== 0 && (
                          <Badge variant="secondary">
                            {diff.delta > 0 ? '+' : ''}{diff.delta}%
                          </Badge>
                        )}
                      </div>
                      <div className="text-sm text-muted-foreground mb-3 space-y-1">
                        <div>
                          <span className="font-medium">Declarado:</span> {diff.valor_declarado}
                        </div>
                        <div>
                          <span className="font-medium">Observado:</span> {diff.valor_observado}
                        </div>
                      </div>
                      <div className="text-sm">
                        <span className="font-medium">Comentario:</span> {diff.comentario}
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between items-center pt-4">
              <Button 
                variant="outline" 
                onClick={goPrev}
                disabled={currentTabIndex === 0}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Anterior
              </Button>
              <Button 
                onClick={goNext}
                disabled={currentTabIndex === tabs.length - 1}
                className="flex items-center gap-2"
              >
                Siguiente
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
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

      <PhotoViewerModal
        isOpen={!!selectedPhoto}
        onClose={() => setSelectedPhoto(null)}
        photoUrl={selectedPhoto?.url || ''}
        title={selectedPhoto?.title || ''}
        geotag={selectedPhoto?.geotag}
        timestamp={selectedPhoto?.timestamp}
      />

      {/* Exit Confirmation Modal */}
      <AlertDialog open={showExitConfirm} onOpenChange={setShowExitConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar salida</AlertDialogTitle>
            <AlertDialogDescription>
              ¿Deseas salir de la investigación? Se perderá cualquier progreso no guardado.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleExitInvestigation}>
              Salir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
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