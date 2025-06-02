
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Users, Plus, Check, Clock, Edit, Trash2 } from 'lucide-react';
import { useFormContext } from './RequestFormProvider';
import GuarantorBasicInfo from './guarantors/GuarantorBasicInfo';
import GuarantorFinancialInfo from './guarantors/GuarantorFinancialInfo';

interface GuarantorsSectionProps {
  formData: Record<string, any>;
  updateFormData: (field: string, value: any) => void;
}

const GuarantorsSection: React.FC<GuarantorsSectionProps> = ({
  formData,
  updateFormData
}) => {
  const { 
    guarantors, 
    currentGuarantorIndex, 
    setCurrentGuarantorIndex,
    guarantorFormStep,
    setGuarantorFormStep,
    addGuarantor,
    removeGuarantor,
    isInGuarantorForm,
    setIsInGuarantorForm
  } = useFormContext();

  const handleEditGuarantor = (index: number, step: number = 0) => {
    setCurrentGuarantorIndex(index);
    setGuarantorFormStep(step);
    setIsInGuarantorForm(true);
  };

  const handleBackToList = () => {
    setIsInGuarantorForm(false);
    setGuarantorFormStep(0);
  };

  const handleNextStep = () => {
    if (guarantorFormStep === 0) {
      setGuarantorFormStep(1);
    } else {
      // Form completed, go back to list
      handleBackToList();
    }
  };

  const handlePreviousStep = () => {
    if (guarantorFormStep === 1) {
      setGuarantorFormStep(0);
    } else {
      handleBackToList();
    }
  };

  const getGuarantorStatus = (guarantor: any) => {
    if (guarantor.basicInfoCompleted && guarantor.financialInfoCompleted) {
      return 'complete';
    } else if (guarantor.basicInfoCompleted || guarantor.financialInfoCompleted) {
      return 'partial';
    }
    return 'pending';
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'complete':
        return <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"><Check className="h-3 w-3 mr-1" />Completo</Badge>;
      case 'partial':
        return <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100"><Clock className="h-3 w-3 mr-1" />Parcial</Badge>;
      default:
        return <Badge variant="secondary"><Clock className="h-3 w-3 mr-1" />Pendiente</Badge>;
    }
  };

  const currentGuarantor = guarantors[currentGuarantorIndex];
  const canProceedToFinancial = currentGuarantor?.basicInfoCompleted;
  const isFormComplete = currentGuarantor?.basicInfoCompleted && currentGuarantor?.financialInfoCompleted;

  if (isInGuarantorForm) {
    return (
      <div className="space-y-6">
        {/* Form Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold">
              {guarantorFormStep === 0 ? 'Información Básica' : 'Análisis Financiero'} - Fiador {currentGuarantorIndex + 1}
            </h2>
            <p className="text-muted-foreground">
              Paso {guarantorFormStep + 1} de 2
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline">
              {guarantorFormStep === 0 ? 'Datos Personales' : 'Información Financiera'}
            </Badge>
          </div>
        </div>

        {/* Progress indicator */}
        <div className="flex items-center space-x-2">
          <div className={`h-2 w-full rounded ${guarantorFormStep >= 0 ? 'bg-primary' : 'bg-gray-200'}`}></div>
          <div className={`h-2 w-full rounded ${guarantorFormStep >= 1 ? 'bg-primary' : 'bg-gray-200'}`}></div>
        </div>

        {/* Form Content */}
        {guarantorFormStep === 0 && (
          <GuarantorBasicInfo guarantorIndex={currentGuarantorIndex} />
        )}
        
        {guarantorFormStep === 1 && (
          <GuarantorFinancialInfo guarantorIndex={currentGuarantorIndex} />
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between pt-6">
          <Button 
            variant="outline" 
            onClick={handlePreviousStep}
          >
            {guarantorFormStep === 0 ? 'Volver a Lista' : 'Anterior'}
          </Button>
          
          <div className="flex gap-2">
            {guarantorFormStep === 0 && (
              <Button 
                onClick={handleNextStep}
                disabled={!canProceedToFinancial}
              >
                Continuar a Finanzas
              </Button>
            )}
            
            {guarantorFormStep === 1 && (
              <Button 
                onClick={handleNextStep}
                className="bg-green-600 hover:bg-green-700"
              >
                {isFormComplete ? 'Completar Fiador' : 'Guardar y Continuar'}
              </Button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="border-b pb-4">
        <h2 className="text-xl font-semibold">Garantías, Fiadores y Referencias</h2>
        <p className="text-muted-foreground">
          Se requieren mínimo 2 fiadores para la solicitud de crédito
        </p>
      </div>

      {/* Guarantors List */}
      <div className="space-y-4">
        {guarantors.map((guarantor, index) => {
          const status = getGuarantorStatus(guarantor);
          
          return (
            <Card key={guarantor.id} className="relative">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-primary" />
                    Fiador {index + 1}
                    {guarantor.fullName && (
                      <span className="text-base font-normal text-muted-foreground">
                        - {guarantor.fullName}
                      </span>
                    )}
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    {getStatusBadge(status)}
                    {guarantors.length > 2 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeGuarantor(index)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {guarantor.fullName ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-medium">DPI:</span> {guarantor.cui || 'No proporcionado'}
                      </div>
                      <div>
                        <span className="font-medium">Email:</span> {guarantor.email || 'No proporcionado'}
                      </div>
                      <div>
                        <span className="font-medium">Teléfono:</span> {guarantor.phone || 'No proporcionado'}
                      </div>
                      <div>
                        <span className="font-medium">Ingresos:</span> {
                          guarantor.monthlyIncome > 0 
                            ? `Q${guarantor.monthlyIncome.toLocaleString()}`
                            : 'No proporcionado'
                        }
                      </div>
                    </div>
                  ) : (
                    <p className="text-muted-foreground">Sin información completada</p>
                  )}
                  
                  <div className="flex gap-2 pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditGuarantor(index, 0)}
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      Información Básica
                    </Button>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditGuarantor(index, 1)}
                      disabled={!guarantor.basicInfoCompleted}
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      Análisis Financiero
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Add Guarantor Button */}
      <Card className="border-dashed">
        <CardContent className="flex flex-col items-center justify-center py-8">
          <Plus className="h-8 w-8 text-muted-foreground mb-2" />
          <p className="text-muted-foreground mb-4">
            {guarantors.length === 2 ? 'Agregar fiador adicional (opcional)' : 'Agregar nuevo fiador'}
          </p>
          <Button onClick={addGuarantor} variant="outline">
            <Plus className="h-4 w-4 mr-2" />
            Agregar Fiador
          </Button>
        </CardContent>
      </Card>

      {/* Status Summary */}
      <Card className="bg-blue-50 dark:bg-blue-950">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Estado de Fiadores</h4>
              <p className="text-sm text-muted-foreground">
                {guarantors.filter(g => getGuarantorStatus(g) === 'complete').length} de {guarantors.length} fiadores completados
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Requeridos: 2 mínimo</p>
              <p className="text-sm text-muted-foreground">Actuales: {guarantors.length}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default GuarantorsSection;
