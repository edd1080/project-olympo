import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Check, Clock, Edit, Trash2 } from 'lucide-react';
import { useFormContext } from './RequestFormProvider';
import GuarantorBasicInfo from './guarantors/GuarantorBasicInfo';
import GuarantorFinancialInfo from './guarantors/GuarantorFinancialInfo';
import CircularProgress from './CircularProgress';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import NewGuarantorSheet from './guarantors/NewGuarantorSheet';

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
    updateGuarantor,
    removeGuarantor,
    isInGuarantorForm,
    setIsInGuarantorForm
  } = useFormContext();

  const [newSheetOpen, setNewSheetOpen] = React.useState(false);
  const pendingNewIndexRef = React.useRef<number | null>(null);


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

  const handleAddNewGuarantor = () => {
    if (guarantors.length >= 2) return; // Maximum 2 guarantors
    const newIndex = guarantors.length;
    pendingNewIndexRef.current = newIndex;
    addGuarantor();
    setNewSheetOpen(true);
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

  const handleSheetDiscard = () => {
    const idx = pendingNewIndexRef.current;
    if (idx !== null) {
      removeGuarantor(idx);
      pendingNewIndexRef.current = null;
    }
    setNewSheetOpen(false);
  };

  const handleSheetCreate = (data: { fullName: string; birthDate: string; age: number; employmentType: 'asalariado' | 'negocio' }) => {
    const idx = pendingNewIndexRef.current;
    if (idx !== null) {
      updateGuarantor(idx, 'fullName', data.fullName);
      updateGuarantor(idx, 'birthDate', data.birthDate);
      updateGuarantor(idx, 'age', data.age);
      updateGuarantor(idx, 'employmentType', data.employmentType);
      pendingNewIndexRef.current = null;
      
      // If business owner, redirect to full form
      if (data.employmentType === 'negocio') {
        // TODO: Navigate to full guarantor form
        console.log('Redirecting to full guarantor form for business owner');
      }
    }
    setNewSheetOpen(false);
  };

const computeGuarantorProgress = (g: any) => {
  if (!g) return 0;
  const basicFields = [
    !!g.fullName?.trim(),
    !!g.cui?.trim(),
    !!g.email?.trim(),
    !!g.phone?.trim(),
    !!g.address?.trim(),
  ];
  const basicFilled = basicFields.filter(Boolean).length;
  const basicPct = basicFields.length ? basicFilled / basicFields.length : 0;

  const isAsalariado = g.employmentType === 'asalariado';
  
  let financialChecks = [];
  if (isAsalariado) {
    // For salaried guarantors, only check income and expenses
    financialChecks = [
      (g.monthlyIncome ?? 0) > 0,
      (g.monthlyExpenses ?? 0) >= 0,
    ];
  } else {
    // For business owners, check all financial fields
    financialChecks = [
      (g.monthlyIncome ?? 0) > 0,
      (g.monthlyExpenses ?? 0) >= 0,
      !!g.bankAccounts?.toString().trim(),
      g.hasProperty ? (g.propertyValue ?? 0) > 0 : true,
      g.hasVehicle ? (g.vehicleValue ?? 0) > 0 : true,
    ];
  }
  
  const financialFilled = financialChecks.filter(Boolean).length;
  const financialPct = financialChecks.length ? financialFilled / financialChecks.length : 0;

  return Math.round((basicPct * 0.5 + financialPct * 0.5) * 100);
};

  const currentGuarantor = guarantors[currentGuarantorIndex];
  const canProceedToFinancial = currentGuarantor?.basicInfoCompleted;
  const isFormComplete = currentGuarantor?.basicInfoCompleted && currentGuarantor?.financialInfoCompleted;
  const completedGuarantors = guarantors.filter(g => getGuarantorStatus(g) === 'complete').length;

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
<div className="border-b pb-4 flex items-start justify-between">
  <div>
    <h2 className="text-xl font-semibold">Garantías, Fiadores y Referencias</h2>
    <p className="text-muted-foreground">Máximo 2 fiadores en este demo</p>
  </div>
  <Badge className={`${completedGuarantors >= 2 ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100' : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100'}`}>
    {guarantors.length} de 2 máximo
  </Badge>
</div>

      {/* Guarantors List */}
      <div className="space-y-4">
        {guarantors.map((guarantor, index) => {
          const status = getGuarantorStatus(guarantor);
          
          return (
            <div
              key={guarantor.id}
              className="group relative rounded-xl border bg-gradient-to-r from-primary/5 to-accent/5 p-4 shadow-sm transition hover:shadow-md"
            >
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10 shadow-sm">
                    <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                      {(guarantor.fullName || `F${index + 1}`).charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">
                      {guarantor.fullName || `Fiador ${index + 1}`}
                      <span className="ml-2 text-sm text-muted-foreground">DPI: {guarantor.cui || '—'}</span>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Tel: {guarantor.phone || '—'} · Email: {guarantor.email || '—'}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <CircularProgress progress={computeGuarantorProgress(guarantor)} size={28} strokeWidth={3} />
                  {getStatusBadge(status)}
                  {guarantors.length > 2 && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeGuarantor(index)}
                      className="text-red-600 hover:text-red-800"
                      aria-label="Eliminar fiador"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>

              <div className="mt-3 grid grid-cols-1 gap-3 text-sm md:grid-cols-3">
                <div>
                  <span className="font-medium">Ingresos:</span>{' '}
                  {guarantor.monthlyIncome > 0 ? `Q${guarantor.monthlyIncome.toLocaleString()}` : '—'}
                </div>
                <div>
                  <span className="font-medium">Gastos:</span>{' '}
                  {guarantor.monthlyExpenses > 0 ? `Q${guarantor.monthlyExpenses.toLocaleString()}` : '—'}
                </div>
                <div>
                  <span className="font-medium">Cuentas bancarias:</span>{' '}
                  {guarantor.bankAccounts?.toString() || '—'}
                </div>
              </div>

              <div className="mt-3 flex flex-wrap gap-2">
                <Button variant="outline" size="sm" onClick={() => handleEditGuarantor(index, 0)}>
                  <Edit className="mr-1 h-4 w-4" /> Información Básica
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEditGuarantor(index, 1)}
                  disabled={!guarantor.basicInfoCompleted}
                >
                  <Edit className="mr-1 h-4 w-4" /> Análisis Financiero
                </Button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Guarantor Button */}
      {guarantors.length < 2 && (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-8">
            <Plus className="h-8 w-8 text-muted-foreground mb-2" />
            <p className="text-muted-foreground mb-4">
              Agregar nuevo fiador
            </p>
            <Button onClick={handleAddNewGuarantor} variant="outline">
              <Plus className="h-4 w-4 mr-2" />
              Agregar Fiador
            </Button>
          </CardContent>
        </Card>
      )}

      <NewGuarantorSheet
        open={newSheetOpen}
        onOpenChange={setNewSheetOpen}
        onCreate={handleSheetCreate}
        onDiscard={handleSheetDiscard}
      />

      {/* Status Summary */}
      <Card className="bg-gradient-to-r from-primary/5 to-accent/5 border shadow-sm">
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
