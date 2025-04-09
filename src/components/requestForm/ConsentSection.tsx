
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

interface ConsentSectionProps {
  formData: any;
  updateFormData: (field: string, value: any) => void;
}

const ConsentSection: React.FC<ConsentSectionProps> = ({ formData, updateFormData }) => {
  return (
    <Card className="border-0 shadow-none">
      <CardContent className="p-0 space-y-6">
        <h3 className="text-subtitle">Consentimiento</h3>
        <p className="text-muted-foreground text-sm">
          Antes de enviar tu solicitud, por favor revisa y acepta los siguientes términos.
        </p>
        
        <div className="border rounded-md p-4 bg-muted/20">
          <h4 className="font-medium mb-2 text-section-title">Términos y Condiciones</h4>
          <div className="text-sm text-muted-foreground max-h-56 overflow-y-auto p-2 border rounded-md bg-background">
            <p className="mb-2 text-body">
              Al enviar esta solicitud, usted acepta que toda la información proporcionada es verdadera y correcta según su conocimiento.
            </p>
            <p className="mb-2 text-body">
              Usted autoriza a CreditFlow y sus socios comerciales a verificar toda la información proporcionada, incluyendo pero no limitado a: historial crediticio, historial laboral, referencias personales y cualquier otra información relevante para el proceso de evaluación crediticia.
            </p>
            <p className="mb-2 text-body">
              Usted entiende que la aprobación de su solicitud está sujeta a evaluación y puede ser rechazada sin obligación de proporcionar explicaciones detalladas.
            </p>
            <p className="mb-2 text-body">
              Usted acepta recibir comunicaciones relacionadas con su solicitud a través de los canales proporcionados, incluyendo correo electrónico, teléfono o mensajes de texto.
            </p>
            <p className="mb-2 text-body">
              Usted reconoce que ha leído y entendido nuestra política de privacidad y cómo sus datos personales serán procesados y protegidos.
            </p>
            <p className="text-body">
              Usted puede revocar este consentimiento en cualquier momento, entendiendo que esto puede afectar nuestra capacidad de procesar su solicitud o mantener una relación comercial con usted.
            </p>
          </div>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-start space-x-3">
            <Checkbox 
              id="terms" 
              checked={formData.termsAccepted || false}
              onCheckedChange={(checked) => updateFormData('termsAccepted', checked)}
            />
            <div className="grid gap-1.5 leading-none">
              <Label htmlFor="terms" className="text-body">
                He leído y acepto los <span className="font-medium">Términos y Condiciones</span> y la <span className="font-medium">Política de Privacidad</span>.
              </Label>
            </div>
          </div>
          
          <div className="flex items-start space-x-3">
            <Checkbox 
              id="dataProcessing" 
              checked={formData.dataProcessingAccepted || false}
              onCheckedChange={(checked) => updateFormData('dataProcessingAccepted', checked)}
            />
            <div className="grid gap-1.5 leading-none">
              <Label htmlFor="dataProcessing" className="text-body">
                Autorizo el procesamiento de mis datos personales con fines de evaluación crediticia.
              </Label>
            </div>
          </div>
          
          <div className="flex items-start space-x-3">
            <Checkbox 
              id="creditCheck" 
              checked={formData.creditCheckAccepted || false}
              onCheckedChange={(checked) => updateFormData('creditCheckAccepted', checked)}
            />
            <div className="grid gap-1.5 leading-none">
              <Label htmlFor="creditCheck" className="text-body">
                Autorizo la consulta de mi historial crediticio en las sociedades de información crediticia.
              </Label>
            </div>
          </div>
          
          <div className="flex items-start space-x-3">
            <Checkbox 
              id="marketing" 
              checked={formData.marketingAccepted || false}
              onCheckedChange={(checked) => updateFormData('marketingAccepted', checked)}
            />
            <div className="grid gap-1.5 leading-none">
              <Label htmlFor="marketing" className="text-body">
                Deseo recibir información sobre ofertas y productos relacionados <span className="text-muted-foreground">(opcional)</span>.
              </Label>
            </div>
          </div>
          
          <div className="border-t pt-4 mt-4">
            <p className="text-label">
              Al hacer clic en "Enviar Solicitud", confirmas que has revisado tu solicitud y que toda la información es correcta.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ConsentSection;
