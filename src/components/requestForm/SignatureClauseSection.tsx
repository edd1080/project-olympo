import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Progress } from '@/components/ui/progress';
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { CheckCircle, FileSignature, AlertCircle, Camera, Upload, User, FileText, PenTool } from 'lucide-react';
import SignaturePad from './SignaturePad';
interface SignatureClauseSectionProps {
  formData: any;
  updateFormData: (field: string, value: any) => void;
}
const SignatureClauseSection: React.FC<SignatureClauseSectionProps> = ({
  formData,
  updateFormData
}) => {
  const [readingProgress, setReadingProgress] = useState(0);
  const [hasReadComplete, setHasReadComplete] = useState(false);
  const [isSignatureModalOpen, setIsSignatureModalOpen] = useState(false);
  const [draftSignature, setDraftSignature] = useState<string | null>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const clauses = [{
    title: "Cláusula de Veracidad de Información",
    content: "El solicitante declara bajo juramento que toda la información proporcionada en esta solicitud es veraz, completa y exacta. Cualquier falsedad u omisión en los datos proporcionados constituirá causa suficiente para el rechazo de la solicitud o la cancelación del crédito si ya hubiere sido otorgado."
  }, {
    title: "Autorización para Verificación de Datos",
    content: "El solicitante autoriza expresamente a la institución financiera para verificar la información proporcionada a través de consultas a centrales de riesgo, referencias comerciales, laborales y personales, así como cualquier otra fuente que considere necesaria para evaluar la capacidad crediticia."
  }, {
    title: "Cláusula de Protección de Datos Personales",
    content: "El solicitante consiente el tratamiento de sus datos personales conforme a la Ley de Protección de Datos Personales, para los fines relacionados con la evaluación, aprobación, administración y cobranza del crédito solicitado. Los datos serán conservados durante el tiempo necesario para cumplir con las obligaciones legales y contractuales."
  }, {
    title: "Términos y Condiciones del Crédito",
    content: "El otorgamiento del crédito estará sujeto a la aprobación del comité de crédito correspondiente y al cumplimiento de todos los requisitos establecidos por la institución. Las condiciones finales del crédito (monto, plazo, tasa de interés) podrán variar de acuerdo con el resultado de la evaluación crediticia."
  }, {
    title: "Obligaciones del Deudor",
    content: "En caso de aprobación del crédito, el deudor se compromete a utilizar los recursos únicamente para el destino declarado, mantener actualizada su información de contacto, cumplir puntualmente con los pagos establecidos y permitir las supervisiones que la institución considere necesarias."
  }];
  const handleScroll = () => {
    if (scrollAreaRef.current) {
      const scrollElement = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollElement) {
        const scrollTop = scrollElement.scrollTop;
        const scrollHeight = scrollElement.scrollHeight - scrollElement.clientHeight;
        const progress = Math.min(scrollTop / scrollHeight * 100, 100);
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
  return <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            
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
            
            <ScrollArea ref={scrollAreaRef} className="h-96 w-full border rounded-lg p-4">
              <div className="space-y-6">
                {clauses.map((clause, index) => <div key={index} className="space-y-2">
                    <h4 className="font-semibold text-primary">{index + 1}. {clause.title}</h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {clause.content}
                    </p>
                  </div>)}
                
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
            {hasReadComplete ? <CheckCircle className="h-5 w-5 text-green-600" /> : <AlertCircle className="h-5 w-5 text-amber-600" />}
            <span className={`text-sm ${hasReadComplete ? 'text-green-700' : 'text-amber-700'}`}>
              {hasReadComplete ? "Has leído completamente las cláusulas" : "Debes leer completamente las cláusulas para continuar"}
            </span>
          </div>

          {/* Acceptance checkboxes */}
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <Checkbox id="acceptTerms" checked={formData.termsAccepted || false} onCheckedChange={checked => updateFormData('termsAccepted', checked)} disabled={!hasReadComplete} />
              <Label htmlFor="acceptTerms" className={`text-sm leading-relaxed ${!hasReadComplete ? 'text-muted-foreground' : ''}`}>
                Acepto los términos y condiciones establecidos en las cláusulas del contrato. 
                Declaro haber leído y comprendido todas las disposiciones.
              </Label>
            </div>

            

            <div className="flex items-start space-x-3">
              <Checkbox id="acceptCreditCheck" checked={formData.creditCheckAccepted || false} onCheckedChange={checked => updateFormData('creditCheckAccepted', checked)} disabled={!hasReadComplete} />
              <Label htmlFor="acceptCreditCheck" className={`text-sm leading-relaxed ${!hasReadComplete ? 'text-muted-foreground' : ''}`}>
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
              <div className="space-y-2">
                <Label htmlFor="signatureDate">Fecha de firma</Label>
                <input id="signatureDate" className="w-full p-2 border rounded bg-muted" value={new Date().toLocaleDateString('es-GT')} readOnly />
              </div>

              {/* Signature preview area */}
              <div className="space-y-2">
                <Label>Firma digital</Label>
                <Sheet open={isSignatureModalOpen} onOpenChange={setIsSignatureModalOpen}>
                  <SheetTrigger asChild>
                    <Button
                      variant="outline"
                      className={`w-full h-32 border-2 border-dashed ${
                        !formData.termsAccepted || !formData.creditCheckAccepted 
                          ? 'opacity-50 cursor-not-allowed' 
                          : 'hover:border-primary/50'
                      }`}
                      disabled={!formData.termsAccepted || !formData.creditCheckAccepted}
                    >
                      {formData.signatureDataUrl ? (
                        <img 
                          src={formData.signatureDataUrl} 
                          alt="Firma digital" 
                          className="max-h-24 max-w-full object-contain"
                        />
                      ) : (
                        <div className="flex flex-col items-center gap-2 text-muted-foreground">
                          <PenTool className="h-6 w-6" />
                          <span>Toque para firmar</span>
                        </div>
                      )}
                    </Button>
                  </SheetTrigger>
                  
                  <SheetContent side="bottom" className="h-[80vh] flex flex-col">
                    <SheetHeader>
                      <SheetTitle>Firmar documento</SheetTitle>
                      <SheetDescription>
                        Dibuje su firma en el área a continuación
                      </SheetDescription>
                    </SheetHeader>
                    
                    <div className="flex-1 py-6">
                      <SignaturePad
                        key={draftSignature ? 'with-signature' : 'empty'}
                        value={draftSignature}
                        onChange={setDraftSignature}
                        heightPx={320}
                        showLabel={false}
                        showClearButton={false}
                      />
                    </div>
                    
                    <SheetFooter className="flex-shrink-0">
                      <div className="flex gap-3 w-full">
                        <Button
                          variant="outline"
                          onClick={() => setDraftSignature(null)}
                          disabled={!draftSignature}
                          className="flex-1"
                        >
                          Firmar de nuevo
                        </Button>
                        <Button
                          onClick={() => {
                            if (draftSignature) {
                              updateFormData('signatureDataUrl', draftSignature);
                              setIsSignatureModalOpen(false);
                              setDraftSignature(null);
                            }
                          }}
                          disabled={!draftSignature}
                          className="flex-1"
                        >
                          Continuar
                        </Button>
                      </div>
                    </SheetFooter>
                  </SheetContent>
                </Sheet>
              </div>

              <div className="flex items-center space-x-3">
                <Checkbox 
                  id="digitalSignature" 
                  checked={formData.digitalSignatureAccepted || false} 
                  onCheckedChange={checked => updateFormData('digitalSignatureAccepted', checked)} 
                  disabled={!formData.termsAccepted || !formData.creditCheckAccepted || !formData.signatureDataUrl} 
                />
                <Label htmlFor="digitalSignature" className={`text-sm font-medium ${!formData.termsAccepted || !formData.creditCheckAccepted || !formData.signatureDataUrl ? 'text-muted-foreground' : ''}`}>
                  Confirmo que esta es mi firma digital y acepto la validez legal de este documento electrónico.
                </Label>
              </div>
            </div>
          </div>

          {/* Alternative signing section */}
          <div className="mt-8 p-6 border rounded-lg bg-amber-50/50 dark:bg-amber-950/20">
            <h4 className="font-semibold mb-4 flex items-center gap-2">
              <User className="h-5 w-5" />
              Firma alternativa
            </h4>
            
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Switch id="applicantCannotSign" checked={formData.applicantCannotSign || false} onCheckedChange={checked => updateFormData('applicantCannotSign', checked)} disabled={!formData.termsAccepted || !formData.dataProcessingAccepted || !formData.creditCheckAccepted} />
                <Label htmlFor="applicantCannotSign" className={`text-sm font-medium ${!formData.termsAccepted || !formData.dataProcessingAccepted || !formData.creditCheckAccepted ? 'text-muted-foreground' : ''}`}>
                  El solicitante no firma
                </Label>
              </div>
              
              <p className="text-xs text-muted-foreground">
                Active esta opción si el solicitante no puede firmar. Se requerirá información del testigo.
              </p>

              {/* Witness signature section - only visible when applicant cannot sign */}
              {formData.applicantCannotSign && <div className="mt-6 p-4 border-l-4 border-amber-500 bg-amber-50/30 dark:bg-amber-950/10 space-y-4">
                  <h5 className="font-medium flex items-center gap-2">
                    <FileSignature className="h-4 w-4" />
                    Información del testigo
                  </h5>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="witnessName">Nombre completo del testigo *</Label>
                      <Input id="witnessName" placeholder="Ingrese nombre completo" value={formData.witnessName || ''} onChange={e => updateFormData('witnessName', e.target.value)} />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="witnessDPI">DPI del testigo *</Label>
                      <Input id="witnessDPI" placeholder="1234 56789 0123" value={formData.witnessDPI || ''} onChange={e => updateFormData('witnessDPI', e.target.value)} maxLength={15} />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="witnessNIT">NIT del testigo *</Label>
                    <Input id="witnessNIT" placeholder="12345678-9" value={formData.witnessNIT || ''} onChange={e => updateFormData('witnessNIT', e.target.value)} className="max-w-sm" />
                  </div>

                  {/* Photo with fingerprint upload */}
                  <div className="space-y-2">
                    <Label>Fotografía del solicitante con huella dactilar *</Label>
                    <p className="text-xs text-muted-foreground mb-2">
                      Fotografía donde aparezca el solicitante mostrando su huella dactilar
                    </p>
                    
                    <div className="flex flex-wrap gap-2">
                      <Button variant="outline" size="sm" onClick={() => {
                    // Mock fingerprint photo capture
                    updateFormData('fingerprintPhoto', 'mock_fingerprint_photo.jpg');
                  }}>
                        <Camera className="mr-2 h-4 w-4" />
                        Tomar foto con huella
                      </Button>
                      
                      <Button variant="outline" size="sm" onClick={() => {
                    // Mock file upload
                    const input = document.createElement('input');
                    input.type = 'file';
                    input.accept = 'image/*';
                    input.onchange = e => {
                      const file = (e.target as HTMLInputElement).files?.[0];
                      if (file) {
                        updateFormData('fingerprintPhoto', file.name);
                      }
                    };
                    input.click();
                  }}>
                        <Upload className="mr-2 h-4 w-4" />
                        Subir archivo
                      </Button>
                    </div>
                    
                    {formData.fingerprintPhoto && <div className="flex items-center gap-2 text-sm text-green-600 mt-2">
                        <CheckCircle className="h-4 w-4" />
                        <span>Foto con huella cargada: {formData.fingerprintPhoto}</span>
                      </div>}
                  </div>

                  {/* Witness signature confirmation */}
                  <div className="flex items-center space-x-3">
                    <Checkbox id="witnessSignature" checked={formData.witnessSignatureAccepted || false} onCheckedChange={checked => updateFormData('witnessSignatureAccepted', checked)} disabled={!formData.witnessName || !formData.witnessDPI || !formData.witnessNIT || !formData.fingerprintPhoto} />
                    <Label htmlFor="witnessSignature" className={`text-sm font-medium ${!formData.witnessName || !formData.witnessDPI || !formData.witnessNIT || !formData.fingerprintPhoto ? 'text-muted-foreground' : ''}`}>
                      Confirmo que actúo como testigo de la firma del solicitante y que todos los datos proporcionados son correctos.
                    </Label>
                  </div>
                </div>}
            </div>
          </div>

          {/* Final confirmation */}
          {(formData.digitalSignatureAccepted && !formData.applicantCannotSign || formData.applicantCannotSign && formData.witnessSignatureAccepted) && <div className="p-4 bg-green-50 border border-green-200 rounded-lg dark:bg-green-950/20 dark:border-green-900/30">
              <div className="flex items-center gap-2 text-green-700 dark:text-green-300">
                <CheckCircle className="h-5 w-5" />
                <span className="font-medium">
                  {formData.applicantCannotSign ? 'Firma de testigo completada exitosamente' : 'Firma completada exitosamente'}
                </span>
              </div>
              <p className="text-sm text-green-600 dark:text-green-400 mt-1">
                Tu solicitud está lista para ser enviada. Se generará un código de confirmación una vez enviada.
              </p>
            </div>}
        </CardContent>
      </Card>
    </div>;
};
export default SignatureClauseSection;