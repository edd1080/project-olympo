import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, FileSignature, AlertCircle } from 'lucide-react';

interface SignatureClauseSectionProps {
  formData: any;
  updateFormData: (field: string, value: any) => void;
}

const SignatureClauseSection: React.FC<SignatureClauseSectionProps> = ({ formData, updateFormData }) => {
  const [readingProgress, setReadingProgress] = useState(0);
  const [hasReadComplete, setHasReadComplete] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const clauses = [
    {
      title: "Cláusula de Veracidad de Información",
      content: "El solicitante declara bajo juramento que toda la información proporcionada en esta solicitud es veraz, completa y exacta. Cualquier falsedad u omisión en los datos proporcionados constituirá causa suficiente para el rechazo de la solicitud o la cancelación del crédito si ya hubiere sido otorgado."
    },
    {
      title: "Autorización para Verificación de Datos",
      content: "El solicitante autoriza expresamente a la institución financiera para verificar la información proporcionada a través de consultas a centrales de riesgo, referencias comerciales, laborales y personales, así como cualquier otra fuente que considere necesaria para evaluar la capacidad crediticia."
    },
    {
      title: "Cláusula de Protección de Datos Personales",
      content: "El solicitante consiente el tratamiento de sus datos personales conforme a la Ley de Protección de Datos Personales, para los fines relacionados con la evaluación, aprobación, administración y cobranza del crédito solicitado. Los datos serán conservados durante el tiempo necesario para cumplir con las obligaciones legales y contractuales."
    },
    {
      title: "Términos y Condiciones del Crédito",
      content: "El otorgamiento del crédito estará sujeto a la aprobación del comité de crédito correspondiente y al cumplimiento de todos los requisitos establecidos por la institución. Las condiciones finales del crédito (monto, plazo, tasa de interés) podrán variar de acuerdo con el resultado de la evaluación crediticia."
    },
    {
      title: "Obligaciones del Deudor",
      content: "En caso de aprobación del crédito, el deudor se compromete a utilizar los recursos únicamente para el destino declarado, mantener actualizada su información de contacto, cumplir puntualmente con los pagos establecidos y permitir las supervisiones que la institución considere necesarias."
    }
  ];

  const handleScroll = () => {
    if (scrollAreaRef.current) {
      const scrollElement = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollElement) {
        const scrollTop = scrollElement.scrollTop;
        const scrollHeight = scrollElement.scrollHeight - scrollElement.clientHeight;
        const progress = Math.min((scrollTop / scrollHeight) * 100, 100);
        
        setReadingProgress(progress);
        
        if (progress >= 90 && !hasReadComplete) {
          setHasReadComplete(true);
          updateFormData('hasReadClauses', true);
        }
      }
    }
  };

  useEffect(() => {
    const scrollElement = scrollAreaRef.current?.querySelector('[data-radix-scroll-area-viewport]');
    if (scrollElement) {
      scrollElement.addEventListener('scroll', handleScroll);
      return () => scrollElement.removeEventListener('scroll', handleScroll);
    }
  }, []);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileSignature className="h-5 w-5" />
            Cláusulas y términos del contrato
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Progress indicator */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>Progreso de lectura</span>
              <span>{Math.round(readingProgress)}%</span>
            </div>
            <Progress value={readingProgress} className="h-2" />
          </div>

          {/* Terms and conditions */}
          <div className="space-y-4">
            <Label className="text-base font-medium">
              Lea cuidadosamente todas las cláusulas antes de proceder a firmar
            </Label>
            
            <ScrollArea 
              ref={scrollAreaRef}
              className="h-96 w-full border rounded-lg p-4"
            >
              <div className="space-y-6">
                {clauses.map((clause, index) => (
                  <div key={index} className="space-y-2">
                    <h4 className="font-semibold text-primary">{index + 1}. {clause.title}</h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {clause.content}
                    </p>
                  </div>
                ))}
                
                <div className="mt-8 p-4 bg-muted/50 rounded-lg">
                  <p className="text-sm text-center text-muted-foreground italic">
                    --- Fin del documento ---
                  </p>
                </div>
              </div>
            </ScrollArea>
          </div>

          {/* Reading confirmation */}
          <div className="flex items-center space-x-2 p-3 rounded-lg bg-muted/50">
            {hasReadComplete ? (
              <CheckCircle className="h-5 w-5 text-green-600" />
            ) : (
              <AlertCircle className="h-5 w-5 text-amber-600" />
            )}
            <span className={`text-sm ${hasReadComplete ? 'text-green-700' : 'text-amber-700'}`}>
              {hasReadComplete 
                ? "Has leído completamente las cláusulas" 
                : "Debes leer completamente las cláusulas para continuar"
              }
            </span>
          </div>

          {/* Acceptance checkboxes */}
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <Checkbox
                id="acceptTerms"
                checked={formData.termsAccepted || false}
                onCheckedChange={(checked) => updateFormData('termsAccepted', checked)}
                disabled={!hasReadComplete}
              />
              <Label 
                htmlFor="acceptTerms" 
                className={`text-sm leading-relaxed ${!hasReadComplete ? 'text-muted-foreground' : ''}`}
              >
                Acepto los términos y condiciones establecidos en las cláusulas del contrato. 
                Declaro haber leído y comprendido todas las disposiciones.
              </Label>
            </div>

            <div className="flex items-start space-x-3">
              <Checkbox
                id="acceptDataProcessing"
                checked={formData.dataProcessingAccepted || false}
                onCheckedChange={(checked) => updateFormData('dataProcessingAccepted', checked)}
                disabled={!hasReadComplete}
              />
              <Label 
                htmlFor="acceptDataProcessing" 
                className={`text-sm leading-relaxed ${!hasReadComplete ? 'text-muted-foreground' : ''}`}
              >
                Autorizo el tratamiento de mis datos personales conforme a la normativa vigente 
                de protección de datos personales.
              </Label>
            </div>

            <div className="flex items-start space-x-3">
              <Checkbox
                id="acceptCreditCheck"
                checked={formData.creditCheckAccepted || false}
                onCheckedChange={(checked) => updateFormData('creditCheckAccepted', checked)}
                disabled={!hasReadComplete}
              />
              <Label 
                htmlFor="acceptCreditCheck" 
                className={`text-sm leading-relaxed ${!hasReadComplete ? 'text-muted-foreground' : ''}`}
              >
                Autorizo la consulta de mi historial crediticio en centrales de riesgo y 
                la verificación de referencias comerciales y laborales.
              </Label>
            </div>
          </div>

          {/* Digital signature section */}
          <div className="mt-8 p-6 border rounded-lg bg-gradient-to-r from-primary/5 to-primary/10">
            <h4 className="font-semibold mb-4 flex items-center gap-2">
              <FileSignature className="h-5 w-5" />
              Firma digital
            </h4>
            
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="signatureName">Nombre completo del firmante</Label>
                  <input
                    id="signatureName"
                    className="w-full p-2 border rounded"
                    value={`${formData.personalInfo?.nombres || ''} ${formData.personalInfo?.apellidos || ''}`}
                    readOnly
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="signatureDate">Fecha de firma</Label>
                  <input
                    id="signatureDate"
                    className="w-full p-2 border rounded bg-muted"
                    value={new Date().toLocaleDateString('es-GT')}
                    readOnly
                  />
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Checkbox
                  id="digitalSignature"
                  checked={formData.digitalSignatureAccepted || false}
                  onCheckedChange={(checked) => updateFormData('digitalSignatureAccepted', checked)}
                  disabled={!formData.termsAccepted || !formData.dataProcessingAccepted || !formData.creditCheckAccepted}
                />
                <Label 
                  htmlFor="digitalSignature" 
                  className={`text-sm font-medium ${(!formData.termsAccepted || !formData.dataProcessingAccepted || !formData.creditCheckAccepted) ? 'text-muted-foreground' : ''}`}
                >
                  Confirmo que esta es mi firma digital y acepto la validez legal de este documento electrónico.
                </Label>
              </div>
            </div>
          </div>

          {/* Final confirmation */}
          {formData.digitalSignatureAccepted && (
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center gap-2 text-green-700">
                <CheckCircle className="h-5 w-5" />
                <span className="font-medium">Firma completada exitosamente</span>
              </div>
              <p className="text-sm text-green-600 mt-1">
                Tu solicitud está lista para ser enviada. Se generará un código de confirmación una vez enviada.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SignatureClauseSection;