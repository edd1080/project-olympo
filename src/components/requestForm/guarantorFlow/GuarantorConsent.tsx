
import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { GuarantorData } from '../RequestFormProvider';
import { Separator } from '@/components/ui/separator';
import { AlertCircle, CheckCircle, FileCheck } from 'lucide-react';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from '@/hooks/use-toast';

interface GuarantorConsentProps {
  guarantor: GuarantorData;
  updateGuarantorData: (field: keyof GuarantorData, value: any) => void;
  setStepComplete: (isComplete: boolean) => void;
}

const GuarantorConsent: React.FC<GuarantorConsentProps> = ({
  guarantor,
  updateGuarantorData,
  setStepComplete
}) => {
  const { toast } = useToast();
  const [signatureMode, setSignatureMode] = useState<'guarantor' | 'witness'>('guarantor');
  const [showEvaluationDialog, setShowEvaluationDialog] = useState(false);
  
  // Initialize consent info if it doesn't exist
  const consentInfo = guarantor.consentInfo || {
    hasSignedConsent: false,
    witnessName: '',
    witnessId: '',
    signatureUrl: ''
  };
  
  // Initialize evaluation result if it doesn't exist
  const evaluationResult = guarantor.evaluationResult || {
    isApproved: false,
    suggestedCoveragePercentage: 0,
    evaluationScore: 0,
    evaluationNotes: ''
  };
  
  // Update consent info
  const updateConsentInfo = (field: keyof typeof consentInfo, value: any) => {
    const updatedInfo = {
      ...consentInfo,
      [field]: value
    };
    
    updateGuarantorData('consentInfo', updatedInfo);
  };
  
  // Handle consent signed
  const handleConsentSigned = () => {
    updateConsentInfo('hasSignedConsent', true);
    updateConsentInfo('signatureUrl', 'signature_placeholder.png');
    
    toast({
      title: "Consentimiento firmado",
      description: "El consentimiento ha sido firmado correctamente",
      variant: "default",
      className: "bg-green-100 text-green-800"
    });
  };
  
  // Evaluate guarantor
  const evaluateGuarantor = () => {
    // Simulate evaluation process
    setTimeout(() => {
      const approved = Math.random() > 0.2;
      const coveragePercentage = approved ? Math.floor(Math.random() * 40) + 20 : 0;
      const score = approved ? Math.floor(Math.random() * 50) + 50 : Math.floor(Math.random() * 30) + 10;
      
      const result = {
        isApproved: approved,
        suggestedCoveragePercentage: coveragePercentage,
        evaluationScore: score,
        evaluationNotes: approved
          ? 'El fiador cumple con los requisitos para garantizar el crédito.'
          : 'El fiador no cumple con los requisitos mínimos para garantizar el crédito.'
      };
      
      updateGuarantorData('evaluationResult', result);
      
      if (approved) {
        updateGuarantorData('coveragePercentage', coveragePercentage);
        updateGuarantorData('status', 'complete');
      }
      
      setShowEvaluationDialog(true);
    }, 2000);
  };
  
  // Check if the form is complete
  useEffect(() => {
    const isComplete = 
      consentInfo.hasSignedConsent ||
      (signatureMode === 'witness' && 
       consentInfo.witnessName?.trim() !== '' && 
       consentInfo.witnessId?.trim() !== '');
    
    setStepComplete(isComplete);
  }, [consentInfo, signatureMode, setStepComplete]);
  
  return (
    <div className="space-y-6">
      <div className="border-b pb-4">
        <h3 className="text-lg font-medium">Consentimiento y Evaluación</h3>
        <p className="text-muted-foreground text-sm">
          Revise y firme el consentimiento para proceder con la evaluación
        </p>
      </div>
      
      <Card className="border shadow-sm">
        <CardContent className="p-4 space-y-4">
          <div className="space-y-4">
            <h4 className="font-medium">Cláusula de Consentimiento</h4>
            
            <div className="border p-4 rounded-md bg-muted/10 text-sm space-y-2">
              <p>
                Por medio de la presente, yo {guarantor.personalInfo?.firstName} {guarantor.personalInfo?.lastName}, 
                con DPI {guarantor.personalInfo?.cui}, acepto voluntariamente participar como fiador en el crédito 
                solicitado, entendiendo y aceptando las siguientes condiciones:
              </p>
              
              <ol className="list-decimal pl-4 space-y-1">
                <li>Asumo responsabilidad de garantía sobre el monto del crédito en el porcentaje acordado.</li>
                <li>Autorizo la verificación de mis antecedentes crediticios en cualquier bureau de crédito.</li>
                <li>Comprendo que en caso de incumplimiento del deudor principal, se procederá al cobro del monto garantizado.</li>
                <li>Confirmo que la información proporcionada es verídica y puede ser verificada por la entidad financiera.</li>
                <li>Acepto recibir notificaciones relacionadas con este crédito en la información de contacto proporcionada.</li>
              </ol>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="signatureOption1" 
                  checked={signatureMode === 'guarantor'}
                  onCheckedChange={() => setSignatureMode('guarantor')}
                />
                <Label htmlFor="signatureOption1">El fiador firma en tablet</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="signatureOption2" 
                  checked={signatureMode === 'witness'}
                  onCheckedChange={() => setSignatureMode('witness')}
                />
                <Label htmlFor="signatureOption2">Firmado por testigo</Label>
              </div>
            </div>
          </div>
          
          <Separator />
          
          {signatureMode === 'guarantor' ? (
            <div className="space-y-4">
              <div className="border-2 border-dashed rounded-md p-8 bg-muted/10 flex flex-col items-center justify-center min-h-[150px]">
                {consentInfo.hasSignedConsent ? (
                  <div className="text-center space-y-2">
                    <CheckCircle className="h-10 w-10 text-green-500 mx-auto" />
                    <p className="font-medium text-green-600">Consentimiento firmado</p>
                    <p className="text-sm text-muted-foreground">
                      La firma ha sido registrada correctamente
                    </p>
                  </div>
                ) : (
                  <Button onClick={handleConsentSigned}>
                    Firmar Consentimiento
                  </Button>
                )}
              </div>
              
              <p className="text-xs text-muted-foreground text-center">
                Al firmar, el fiador reconoce haber leído y aceptado las condiciones anteriores.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="witnessName">Nombre del testigo</Label>
                  <Input
                    id="witnessName"
                    placeholder="Nombre completo del testigo"
                    value={consentInfo.witnessName}
                    onChange={(e) => updateConsentInfo('witnessName', e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="witnessId">DPI del testigo</Label>
                  <Input
                    id="witnessId"
                    placeholder="DPI del testigo"
                    value={consentInfo.witnessId}
                    onChange={(e) => updateConsentInfo('witnessId', e.target.value)}
                  />
                </div>
              </div>
              
              <div className="border p-4 rounded-md bg-amber-50 text-amber-800 text-sm flex items-start gap-3">
                <AlertCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium">Firma por testigo</p>
                  <p>
                    Al completar esta información, usted certifica que el testigo ha presenciado
                    el consentimiento verbal del fiador y firma en su representación.
                  </p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
      
      {(consentInfo.hasSignedConsent || 
        (signatureMode === 'witness' && consentInfo.witnessName && consentInfo.witnessId)) && (
        <div className="pt-4">
          <h4 className="font-medium mb-4">Evaluación del fiador</h4>
          
          {evaluationResult.isApproved ? (
            <Card className="border-green-200 bg-green-50">
              <CardContent className="p-4 space-y-4">
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                  <div>
                    <h5 className="font-medium text-green-700">Fiador Aprobado</h5>
                    <p className="text-sm text-green-600">
                      El fiador ha sido aprobado para garantizar hasta el {evaluationResult.suggestedCoveragePercentage}% del crédito.
                    </p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                  <div>
                    <p className="text-sm font-medium">Puntuación</p>
                    <p className="text-xl font-bold text-green-700">{evaluationResult.evaluationScore}/100</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Cobertura recomendada</p>
                    <p className="text-xl font-bold text-green-700">{evaluationResult.suggestedCoveragePercentage}%</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Estado</p>
                    <p className="text-md font-medium flex items-center gap-1 text-green-700">
                      <FileCheck className="h-4 w-4" />
                      Aprobado
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : evaluationResult.evaluationScore > 0 ? (
            <Card className="border-red-200 bg-red-50">
              <CardContent className="p-4 space-y-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-red-500 mt-0.5" />
                  <div>
                    <h5 className="font-medium text-red-700">Fiador No Aprobado</h5>
                    <p className="text-sm text-red-600">
                      El fiador no cumple con los requisitos mínimos para garantizar el crédito.
                    </p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div>
                    <p className="text-sm font-medium">Puntuación</p>
                    <p className="text-xl font-bold text-red-700">{evaluationResult.evaluationScore}/100</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Estado</p>
                    <p className="text-md font-medium flex items-center gap-1 text-red-700">
                      <AlertCircle className="h-4 w-4" />
                      No Aprobado
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Button 
              onClick={evaluateGuarantor} 
              variant="default"
              className="w-full"
            >
              Evaluar Fiador
            </Button>
          )}
        </div>
      )}
      
      <AlertDialog open={showEvaluationDialog} onOpenChange={setShowEvaluationDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {evaluationResult.isApproved 
                ? "¡Fiador Aprobado!"
                : "Fiador No Aprobado"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {evaluationResult.isApproved
                ? `El fiador ha sido aprobado y puede cubrir hasta el ${evaluationResult.suggestedCoveragePercentage}% del crédito.`
                : "El fiador no cumple con los requisitos para garantizar el crédito. Se recomienda buscar un fiador alternativo."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction>Aceptar</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default GuarantorConsent;
