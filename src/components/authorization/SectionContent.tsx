import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AuthorizationSection, AuthorizationRequest } from '@/types/authorization';
import { DictamenView } from './DictamenView';
import { FinancialAnalysis } from './FinancialAnalysis';

interface SectionContentProps {
  section: AuthorizationSection;
  request: AuthorizationRequest;
}

export const SectionContent: React.FC<SectionContentProps> = ({
  section,
  request
}) => {
  const renderSectionContent = () => {
    switch (section.id) {
      case 'personal':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Nombre completo</label>
                <p className="font-medium">{request.applicantName}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">DPI</label>
                <p className="font-medium">{request.dpi}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Tipo de negocio</label>
                <p className="font-medium">{request.businessType}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Score crediticio</label>
                <p className="font-medium">{request.creditScore}</p>
              </div>
            </div>
          </div>
        );

      case 'character':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Evaluación SIB</label>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">{request.dictamen.evaluations.sib.status}</Badge>
                  <span className="font-medium">{request.dictamen.evaluations.sib.score}</span>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  {request.dictamen.evaluations.sib.details}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Evaluación interna</label>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">{request.dictamen.evaluations.internal.status}</Badge>
                  <span className="font-medium">{request.dictamen.evaluations.internal.score}</span>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  {request.dictamen.evaluations.internal.details}
                </p>
              </div>
            </div>
          </div>
        );

      case 'financial':
        return <FinancialAnalysis request={request} />;

      case 'additional_financial':
        return (
          <div className="space-y-4">
            <p className="text-muted-foreground">
              Información financiera adicional del solicitante.
            </p>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Ratio de liquidez</label>
                <p className="font-medium">{request.dictamen.paymentCapacity.liquidity}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Ratio ácido</label>
                <p className="font-medium">{request.dictamen.paymentCapacity.acidRatio}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Rentabilidad</label>
                <p className="font-medium">{(request.dictamen.paymentCapacity.profitability * 100).toFixed(1)}%</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Ratio corriente</label>
                <p className="font-medium">{request.dictamen.paymentCapacity.currentRatio}</p>
              </div>
            </div>
          </div>
        );

      case 'documents':
        return (
          <div className="space-y-4">
            <p className="text-muted-foreground">
              Documentos e imágenes validados para la solicitud.
            </p>
            <div className="grid grid-cols-1 gap-3">
              {[
                'DPI del solicitante',
                'RTU o patente de comercio',
                'Estados financieros',
                'Comprobantes de ingresos',
                'Fotos del negocio',
                'Referencias comerciales'
              ].map((doc, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <span className="text-sm">{doc}</span>
                  <Badge variant="secondary">Validado</Badge>
                </div>
              ))}
            </div>
          </div>
        );

      case 'signature':
        return (
          <div className="space-y-4">
            <p className="text-muted-foreground">
              Cláusulas contractuales y firmas digitales.
            </p>
            <div className="space-y-3">
              <div className="p-3 border rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Firma del Agente</span>
                  <Badge variant="secondary">Firmado</Badge>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {request.dictamen.signatures.agent.name} - {request.dictamen.signatures.agent.date}
                </p>
              </div>
              <div className="p-3 border rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Firma del Gerente</span>
                  <Badge variant={request.dictamen.signatures.manager?.digitallySigned ? "secondary" : "outline"}>
                    {request.dictamen.signatures.manager?.digitallySigned ? "Firmado" : "Pendiente"}
                  </Badge>
                </div>
                {request.dictamen.signatures.manager && (
                  <p className="text-xs text-muted-foreground mt-1">
                    {request.dictamen.signatures.manager.name} - {request.dictamen.signatures.manager.date}
                  </p>
                )}
              </div>
            </div>
          </div>
        );

      case 'invc':
        return (
          <div className="space-y-4">
            <p className="text-muted-foreground">
              Resultados de la investigación y verificación en campo.
            </p>
            <div className="p-4 bg-secondary/50 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="font-medium">Estado INVC</span>
                <Badge variant="secondary">{request.invcResult}</Badge>
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                Verificación completada satisfactoriamente. No se encontraron discrepancias significativas.
              </p>
            </div>
          </div>
        );

      case 'dictamen':
        return <DictamenView dictamen={request.dictamen} />;

      default:
        return (
          <div className="text-center py-8">
            <p className="text-muted-foreground">Contenido de la sección en desarrollo</p>
          </div>
        );
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          {section.name}
          <Badge variant={section.status === 'completed' ? 'secondary' : 'default'}>
            {section.status === 'completed' ? 'Completada' : 'Pendiente'}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {renderSectionContent()}
      </CardContent>
    </Card>
  );
};