import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle, AlertTriangle, Camera, FileText, Users, DollarSign } from 'lucide-react';
import Header from '@/components/layout/Header';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { INVCProvider, useINVC } from '@/context/INVCContext';
import { useToast } from '@/hooks/use-toast';

const INVCFinalReviewContent: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { invcData, validateForFinish } = useINVC();
  const [cancellationReason, setCancellationReason] = useState('');
  const [showCancellation, setShowCancellation] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  if (!invcData) {
    return <div>Cargando datos...</div>;
  }

  const validation = validateForFinish();

  const handleConfirm = async () => {
    if (!validation.isValid) {
      toast({
        title: "No se puede confirmar",
        description: "Hay elementos pendientes que deben completarse",
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);
    
    try {
      // Simular proceso de confirmación
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "INVC Completada",
        description: "La investigación de campo ha sido completada exitosamente",
      });
      
      // Navegar de vuelta a la lista con el estado actualizado
      navigate('/manager/invc', { replace: true });
      
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo completar la investigación",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCancel = async () => {
    if (!cancellationReason.trim()) {
      toast({
        title: "Motivo requerido",
        description: "Debe especificar el motivo de cancelación",
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);
    
    try {
      // Simular proceso de cancelación
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast({
        title: "Solicitud Cancelada",
        description: "La solicitud ha sido cancelada con el motivo especificado",
      });
      
      navigate('/manager/invc', { replace: true });
      
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo cancelar la solicitud",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const getSectionStatus = (sectionId: string) => {
    switch (sectionId) {
      case 'personal':
        return invcData.observado.datosPersonales ? 'completed' : 'pending';
      case 'financial':
        return (invcData.observado.ingresos || invcData.observado.egresos) ? 'completed' : 'pending';
      case 'product':
        return invcData.observado.producto ? 'completed' : 'pending';
      case 'guarantors':
        return invcData.observado.fiadores?.length ? 'completed' : 'pending';
      case 'evidence':
        return (invcData.evidencias.fotosNuevas.negocio && invcData.evidencias.fotosNuevas.solicitante) ? 'completed' : 'pending';
      default:
        return 'pending';
    }
  };

  const sections = [
    { id: 'personal', title: 'Datos Personales', icon: Users },
    { id: 'financial', title: 'Ingresos y Egresos', icon: DollarSign },
    { id: 'product', title: 'Producto Solicitado', icon: FileText },
    { id: 'guarantors', title: 'Fiadores', icon: Users },
    { id: 'evidence', title: 'Evidencias', icon: Camera }
  ];

  const completedSections = sections.filter(s => getSectionStatus(s.id) === 'completed').length;
  const totalSections = sections.length;

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="p-4 pb-20 space-y-6">
        {/* Resumen General */}
        <Card className="p-6 border-primary/20">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
              {validation.isValid ? (
                <CheckCircle className="w-8 h-8 text-primary" />
              ) : (
                <AlertTriangle className="w-8 h-8 text-orange-500" />
              )}
            </div>
            
            <div>
              <h2 className="text-xl font-semibold mb-2">
                Investigación de Campo
              </h2>
              <p className="text-muted-foreground">
                Solicitud #{invcData.solicitudId}
              </p>
            </div>

            <div className="flex justify-center gap-4">
              <Badge variant={validation.isValid ? "default" : "secondary"} className="text-sm px-3 py-1">
                {completedSections}/{totalSections} secciones completadas
              </Badge>
              {invcData.diffs.length > 0 && (
                <Badge variant="secondary" className="text-sm px-3 py-1">
                  {invcData.diffs.length} discrepancia{invcData.diffs.length !== 1 ? 's' : ''}
                </Badge>
              )}
            </div>
          </div>
        </Card>

        {/* Validaciones */}
        {!validation.isValid && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <div className="font-medium mb-2">Elementos pendientes:</div>
              <ul className="list-disc list-inside space-y-1">
                {validation.blockedReasons.map((reason, index) => (
                  <li key={index} className="text-sm">{reason}</li>
                ))}
              </ul>
            </AlertDescription>
          </Alert>
        )}

        {/* Estado de Secciones */}
        <Card className="p-4">
          <h3 className="font-semibold mb-4">Estado de Verificación</h3>
          
          <div className="space-y-3">
            {sections.map((section) => {
              const status = getSectionStatus(section.id);
              const Icon = section.icon;
              
              return (
                <div key={section.id} className="flex items-center justify-between p-3 border rounded">
                  <div className="flex items-center gap-3">
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{section.title}</span>
                  </div>
                  
                  <Badge variant={status === 'completed' ? "default" : "secondary"}>
                    {status === 'completed' ? (
                      <>
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Completado
                      </>
                    ) : (
                      'Pendiente'
                    )}
                  </Badge>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Resumen de Geolocalización */}
        <Card className="p-4">
          <h3 className="font-semibold mb-4">Estado de Geolocalización</h3>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 border rounded">
              <div className="font-medium mb-1">Negocio</div>
              <Badge variant={invcData.fotometria.negocio_ok ? "default" : "secondary"}>
                {invcData.fotometria.negocio_ok ? 'Verificado' : 'Pendiente'}
              </Badge>
              {invcData.fotometria.distancia_negocio !== undefined && (
                <div className="text-xs text-muted-foreground mt-1">
                  {Math.round(invcData.fotometria.distancia_negocio)}m del objetivo
                </div>
              )}
            </div>
            
            <div className="text-center p-3 border rounded">
              <div className="font-medium mb-1">Solicitante</div>
              <Badge variant={invcData.fotometria.solicitante_ok ? "default" : "secondary"}>
                {invcData.fotometria.solicitante_ok ? 'Verificado' : 'Pendiente'}
              </Badge>
              {invcData.fotometria.distancia_solicitante !== undefined && (
                <div className="text-xs text-muted-foreground mt-1">
                  {Math.round(invcData.fotometria.distancia_solicitante)}m del objetivo
                </div>
              )}
            </div>
          </div>
        </Card>

        {/* Discrepancias */}
        {invcData.diffs.length > 0 && (
          <Card className="p-4">
            <h3 className="font-semibold mb-4">Resumen de Discrepancias</h3>
            
            <div className="space-y-3">
              {invcData.diffs.map((diff, index) => (
                <div key={index} className="p-3 border rounded bg-orange-50 dark:bg-orange-900/20">
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-medium">{diff.campo}</span>
                    {diff.delta !== 0 && (
                      <Badge variant="secondary" className="text-xs">
                        {diff.delta > 0 ? '+' : ''}{diff.delta}%
                      </Badge>
                    )}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {diff.valor_declarado} → {diff.valor_observado}
                  </div>
                  <div className="text-sm mt-1">
                    <span className="font-medium">Justificación:</span> {diff.comentario}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Warnings */}
        {validation.warnings.length > 0 && (
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <div className="font-medium mb-2">Observaciones:</div>
              <ul className="list-disc list-inside space-y-1">
                {validation.warnings.map((warning, index) => (
                  <li key={index} className="text-sm">{warning}</li>
                ))}
              </ul>
            </AlertDescription>
          </Alert>
        )}

        <Separator />

        {/* Acciones */}
        <div className="space-y-4">
          {validation.isValid ? (
            <Button
              onClick={handleConfirm}
              disabled={isProcessing}
              className="w-full h-12"
              size="lg"
            >
              {isProcessing ? (
                'Procesando...'
              ) : (
                <>
                  <CheckCircle className="w-5 h-5 mr-2" />
                  Confirmar Investigación
                </>
              )}
            </Button>
          ) : (
            <Button
              variant="outline"
              onClick={() => navigate(`/manager/invc/${invcData.solicitudId}/comparison`)}
              className="w-full h-12"
            >
              Volver a Completar Pendientes
            </Button>
          )}

          <Button
            variant="destructive"
            onClick={() => setShowCancellation(!showCancellation)}
            className="w-full"
            disabled={isProcessing}
          >
            Cancelar Solicitud
          </Button>

          {showCancellation && (
            <Card className="p-4 border-destructive">
              <div className="space-y-3">
                <label className="block text-sm font-medium">
                  Motivo de cancelación *
                </label>
                <Textarea
                  placeholder="Especifique el motivo por el cual se cancela la solicitud..."
                  value={cancellationReason}
                  onChange={(e) => setCancellationReason(e.target.value)}
                  rows={3}
                />
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={() => setShowCancellation(false)}
                    className="flex-1"
                    disabled={isProcessing}
                  >
                    Cancelar
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={handleCancel}
                    disabled={!cancellationReason.trim() || isProcessing}
                    className="flex-1"
                  >
                    {isProcessing ? 'Cancelando...' : 'Confirmar Cancelación'}
                  </Button>
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>

      
    </div>
  );
};

const INVCFinalReview: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  
  if (!id) {
    return <div>ID de solicitud no encontrado</div>;
  }

  return (
    <INVCProvider solicitudId={id}>
      <INVCFinalReviewContent />
    </INVCProvider>
  );
};

export default INVCFinalReview;