
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Slider } from '@/components/ui/slider';
import { Progress } from '@/components/ui/progress';
import { 
  Plus, Trash2, User, AlertCircle, CheckCircle, UserPlus, Briefcase, BadgeDollarSign
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
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
import { useFormContext, GuarantorData } from './RequestFormProvider';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';

const GuarantorsSection: React.FC<{ formData: any; updateFormData: (field: string, value: any) => void }> = () => {
  const { toast } = useToast();
  const { 
    formData, 
    updateFormData, 
    setShowNonSalariedGuarantorForm, 
    setCurrentGuarantor,
    calculateCoveragePercentage,
    requiredCoveragePercentage
  } = useFormContext();
  
  const [activeGuarantor, setActiveGuarantor] = useState<string>('guarantor-1');
  const [showDeleteDialog, setShowDeleteDialog] = useState<boolean>(false);
  const [guarantorToDelete, setGuarantorToDelete] = useState<string>('');
  const [showTypeSelector, setShowTypeSelector] = useState<boolean>(false);
  
  // Initialize guarantors from formData or create default
  const initialGuarantors: GuarantorData[] = formData.guarantors || [
    {
      id: 'guarantor-1',
      name: '',
      identification: '',
      coveragePercentage: 33,
      status: 'pending' as const,
      type: 'salaried' as const
    }
  ];
  
  const [guarantors, setGuarantors] = useState<GuarantorData[]>(initialGuarantors);
  
  const handleUpdateGuarantors = (updatedGuarantors: GuarantorData[]) => {
    setGuarantors(updatedGuarantors);
    updateFormData('guarantors', updatedGuarantors);
  };
  
  const addNewGuarantor = (type: 'salaried' | 'non-salaried') => {
    if (guarantors.length >= 3) {
      toast({
        title: 'Límite alcanzado',
        description: 'No se pueden agregar más de 3 fiadores.',
        variant: 'destructive'
      });
      return;
    }
    
    setShowTypeSelector(false);
    
    if (type === 'non-salaried') {
      // Create a temporary guarantor object with a unique ID
      const tempId = `temp-${Date.now()}`;
      const newGuarantor: GuarantorData = {
        id: `guarantor-${guarantors.length + 1}`,
        name: '',
        identification: '',
        coveragePercentage: Math.floor(100 / (guarantors.length + 1)),
        status: 'pending',
        type: 'non-salaried',
        tempId,
        personalInfo: {
          firstName: '',
          lastName: '',
          cui: '',
          email: '',
          phone: '',
          education: '',
          profession: '',
          housingType: '',
          maritalStatus: '',
          dependents: 0,
          address: ''
        },
        documentsStatus: {
          dpi: 'pending',
          residenceProof: 'pending',
          businessPhotos: 'pending',
          financialStatement: 'pending',
          taxDeclaration: 'pending'
        }
      };
      
      // Set the current guarantor and show the non-salaried guarantor form
      setCurrentGuarantor(newGuarantor);
      setShowNonSalariedGuarantorForm(true);
    } else {
      const newId = `guarantor-${guarantors.length + 1}`;
      const updatedGuarantors: GuarantorData[] = [
        ...guarantors,
        {
          id: newId,
          name: '',
          identification: '',
          coveragePercentage: Math.floor(100 / (guarantors.length + 1)),
          status: 'pending',
          type: 'salaried'
        }
      ];
      
      // Recalculate percentages to distribute evenly
      updatedGuarantors.forEach((guarantor, index) => {
        guarantor.coveragePercentage = Math.floor(100 / updatedGuarantors.length);
        // Add remaining percentage to the last guarantor
        if (index === updatedGuarantors.length - 1) {
          guarantor.coveragePercentage += 100 - (Math.floor(100 / updatedGuarantors.length) * updatedGuarantors.length);
        }
      });
      
      handleUpdateGuarantors(updatedGuarantors);
      setActiveGuarantor(newId);
    }
  };
  
  const handleRequestDeleteGuarantor = (id: string) => {
    if (guarantors.length <= 1) {
      toast({
        title: 'No se puede eliminar',
        description: 'Debe haber al menos un fiador.',
        variant: 'destructive'
      });
      return;
    }
    
    setGuarantorToDelete(id);
    setShowDeleteDialog(true);
  };
  
  const handleConfirmDeleteGuarantor = () => {
    const updatedGuarantors = guarantors.filter(g => g.id !== guarantorToDelete);
    
    // Recalculate percentages to distribute evenly
    updatedGuarantors.forEach((guarantor, index) => {
      guarantor.coveragePercentage = Math.floor(100 / updatedGuarantors.length);
      // Add remaining percentage to the last guarantor
      if (index === updatedGuarantors.length - 1) {
        guarantor.coveragePercentage += 100 - (Math.floor(100 / updatedGuarantors.length) * updatedGuarantors.length);
      }
    });
    
    handleUpdateGuarantors(updatedGuarantors);
    setActiveGuarantor(updatedGuarantors[0].id);
    setShowDeleteDialog(false);
    
    toast({
      title: 'Fiador eliminado',
      description: 'El fiador ha sido eliminado correctamente',
    });
  };
  
  const handleUpdateGuarantorField = (id: string, field: string, value: string | number) => {
    const updatedGuarantors = guarantors.map(guarantor => {
      if (guarantor.id === id) {
        return { ...guarantor, [field]: value };
      }
      return guarantor;
    });
    
    handleUpdateGuarantors(updatedGuarantors);
  };
  
  const handleEditNonSalariedGuarantor = (guarantor: GuarantorData) => {
    setCurrentGuarantor(guarantor);
    setShowNonSalariedGuarantorForm(true);
  };
  
  const handleUpdateCoveragePercentage = (id: string, value: number) => {
    // Calculate the total percentage of other guarantors
    const totalOthersPercentage = guarantors.reduce((total, g) => {
      return g.id !== id ? total + g.coveragePercentage : total;
    }, 0);
    
    // Maximum allowed percentage for this guarantor
    const maxAllowed = 100 - (guarantors.length - 1) * 10;  // Each guarantor must have at least 10%
    
    // Ensure value is between 10 and maxAllowed
    const validValue = Math.min(Math.max(10, value), maxAllowed);
    
    // Calculate how much to adjust other guarantors
    const adjustment = (validValue + totalOthersPercentage) - 100;
    
    if (adjustment !== 0) {
      const updatedGuarantors = guarantors.map(guarantor => {
        if (guarantor.id === id) {
          return { ...guarantor, coveragePercentage: validValue };
        } else {
          // Distribute the adjustment proportionally
          const currentPercentage = guarantor.coveragePercentage;
          const proportionalAdjustment = (currentPercentage / totalOthersPercentage) * adjustment;
          const newPercentage = Math.max(10, currentPercentage - proportionalAdjustment);
          return { ...guarantor, coveragePercentage: newPercentage };
        }
      });
      
      // Ensure total is exactly 100%
      let total = updatedGuarantors.reduce((sum, g) => sum + g.coveragePercentage, 0);
      if (total !== 100) {
        // Add or subtract the difference from the last guarantor
        const lastGuarantor = updatedGuarantors.find(g => g.id !== id);
        if (lastGuarantor) {
          lastGuarantor.coveragePercentage += 100 - total;
        }
      }
      
      handleUpdateGuarantors(updatedGuarantors);
    } else {
      handleUpdateGuarantorField(id, 'coveragePercentage', validValue);
    }
  };
  
  const handleCompleteGuarantor = (id: string) => {
    const updatedGuarantors = guarantors.map(guarantor => {
      if (guarantor.id === id) {
        return { 
          ...guarantor, 
          status: guarantor.status === 'pending' ? 'complete' as const : 'pending' as const 
        };
      }
      return guarantor;
    });
    
    handleUpdateGuarantors(updatedGuarantors);
    
    toast({
      title: 'Sección actualizada',
      description: 'El estado del fiador ha sido actualizado',
    });
  };
  
  const getGuarantorTabTitle = (guarantor: GuarantorData, index: number) => {
    const hasData = guarantor.name.trim() !== '';
    const displayName = hasData ? guarantor.name.split(' ')[0] : `Fiador ${index + 1}`;
    return (
      <div className="flex items-center gap-2">
        {guarantor.status === 'complete' ? (
          <CheckCircle className="h-3 w-3 text-green-500" />
        ) : (
          <User className="h-3 w-3" />
        )}
        <span>{displayName}</span>
        {guarantor.type === 'non-salaried' && (
          <span className="text-xs text-muted-foreground ml-1">(No Asalariado)</span>
        )}
      </div>
    );
  };
  
  // Calculate total coverage percentage
  const totalCoveragePercentage = calculateCoveragePercentage();
  const coverageColor = totalCoveragePercentage >= requiredCoveragePercentage 
    ? "bg-green-500" 
    : totalCoveragePercentage >= requiredCoveragePercentage * 0.8
      ? "bg-amber-500"
      : "bg-red-500";
  
  return (
    <Card className="border-0 shadow-none">
      <CardContent className="p-0 space-y-6">
        <div>
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="font-semibold text-lg">Fiadores</h3>
              <p className="text-muted-foreground text-sm">
                Gestiona los fiadores de esta solicitud. Máximo 3 fiadores.
              </p>
            </div>
            <Sheet open={showTypeSelector} onOpenChange={setShowTypeSelector}>
              <SheetTrigger asChild>
                <Button variant="outline" size="sm" disabled={guarantors.length >= 3}>
                  <Plus className="mr-1 h-4 w-4" />
                  Agregar fiador
                </Button>
              </SheetTrigger>
              <SheetContent side="bottom" className="h-auto pb-8">
                <SheetHeader className="mb-6">
                  <SheetTitle>Selecciona el tipo de fiador</SheetTitle>
                  <SheetDescription>
                    Elige el tipo de fiador que deseas agregar según su fuente de ingresos
                  </SheetDescription>
                </SheetHeader>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Button 
                    variant="outline"
                    size="lg"
                    className="h-auto p-6 flex flex-col items-center"
                    onClick={() => addNewGuarantor('salaried')}
                  >
                    <User className="h-8 w-8 mb-2" />
                    <span className="font-semibold">Asalariado</span>
                    <span className="text-xs text-muted-foreground text-center mt-1">
                      Fiador con ingresos por salario de una empresa
                    </span>
                  </Button>
                  <Button 
                    variant="outline"
                    size="lg"
                    className="h-auto p-6 flex flex-col items-center"
                    onClick={() => addNewGuarantor('non-salaried')}
                  >
                    <Briefcase className="h-8 w-8 mb-2" />
                    <span className="font-semibold">No Asalariado</span>
                    <span className="text-xs text-muted-foreground text-center mt-1">
                      Fiador con negocio propio o ingresos independientes
                    </span>
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
          
          <div className="mb-6">
            <div className="flex justify-between text-sm mb-1">
              <span className="font-medium">Cobertura total: {totalCoveragePercentage}%</span>
              <span className="font-medium">{totalCoveragePercentage >= requiredCoveragePercentage ? 'Completo' : 'Incompleto'}</span>
            </div>
            <Progress value={totalCoveragePercentage} className={`h-2 ${coverageColor}`} />
            <p className="text-xs text-muted-foreground mt-1">
              Se necesita una cobertura del {requiredCoveragePercentage}% para proceder con la solicitud.
            </p>
          </div>
        </div>
        
        <Tabs value={activeGuarantor} onValueChange={setActiveGuarantor} className="w-full">
          <TabsList className="mb-2">
            {guarantors.map((guarantor, index) => (
              <TabsTrigger key={guarantor.id} value={guarantor.id}>
                {getGuarantorTabTitle(guarantor, index)}
              </TabsTrigger>
            ))}
          </TabsList>
          
          {guarantors.map((guarantor, index) => (
            <TabsContent key={guarantor.id} value={guarantor.id} className="space-y-6">
              <div className="flex justify-between items-center">
                <h4 className="text-base font-medium">
                  Datos del fiador {index + 1}
                  {guarantor.type === 'non-salaried' && (
                    <span className="text-xs bg-blue-100 text-blue-800 rounded px-2 py-0.5 ml-2">
                      No Asalariado
                    </span>
                  )}
                </h4>
                <div className="flex gap-2">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => handleCompleteGuarantor(guarantor.id)}
                  >
                    {guarantor.status === 'complete' ? (
                      <>
                        <AlertCircle className="mr-1 h-4 w-4" />
                        Marcar como pendiente
                      </>
                    ) : (
                      <>
                        <CheckCircle className="mr-1 h-4 w-4" />
                        Marcar como completo
                      </>
                    )}
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className="text-destructive hover:bg-destructive/10"
                    onClick={() => handleRequestDeleteGuarantor(guarantor.id)}
                  >
                    <Trash2 className="mr-1 h-4 w-4" />
                    Eliminar
                  </Button>
                </div>
              </div>
              
              {guarantor.type === 'non-salaried' ? (
                <div className="space-y-4">
                  <div className="p-4 border rounded-md bg-blue-50">
                    <h5 className="flex items-center gap-2 mb-2 font-medium">
                      <BadgeDollarSign className="h-4 w-4" />
                      Fiador No Asalariado
                    </h5>
                    <p className="text-sm mb-4">
                      Este fiador tiene un flujo de ingresos independiente. Para completar su información,
                      utilice el formulario especializado para fiadores no asalariados.
                    </p>
                    <Button 
                      onClick={() => handleEditNonSalariedGuarantor(guarantor)}
                      className="w-full sm:w-auto"
                    >
                      {guarantor.personalInfo?.firstName ? 'Editar información' : 'Completar información'}
                    </Button>
                  </div>
                  
                  {guarantor.personalInfo?.firstName && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border rounded-md p-4">
                      <div>
                        <p className="text-sm font-medium">Información personal</p>
                        <p className="text-xs">
                          {guarantor.personalInfo.firstName} {guarantor.personalInfo.lastName}
                        </p>
                        <p className="text-xs">CUI: {guarantor.personalInfo.cui}</p>
                        <p className="text-xs">
                          Profesión: {guarantor.personalInfo.profession || 'No especificado'}
                        </p>
                      </div>
                      
                      {guarantor.businessInfo && (
                        <div>
                          <p className="text-sm font-medium">Información de negocio</p>
                          <p className="text-xs">
                            Ventas mensuales: Q{guarantor.businessInfo.monthlySales.toLocaleString()}
                          </p>
                          <p className="text-xs">
                            Utilidad neta: Q{guarantor.businessInfo.netProfit.toLocaleString()}
                          </p>
                          <p className="text-xs">
                            Margen: {guarantor.businessInfo.profitMargin.toFixed(2)}%
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor={`${guarantor.id}-name`}>Nombre completo</Label>
                      <Input 
                        id={`${guarantor.id}-name`}
                        value={guarantor.name} 
                        onChange={(e) => handleUpdateGuarantorField(guarantor.id, 'name', e.target.value)}
                        placeholder="Nombre del fiador"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`${guarantor.id}-identification`}>DPI / Identificación</Label>
                      <Input 
                        id={`${guarantor.id}-identification`}
                        value={guarantor.identification} 
                        onChange={(e) => handleUpdateGuarantorField(guarantor.id, 'identification', e.target.value)}
                        placeholder="Número de DPI"
                      />
                    </div>
                  </div>
                </>
              )}
              
              <div className="space-y-2">
                <Label>Porcentaje de cobertura: {Math.round(guarantor.coveragePercentage)}%</Label>
                <Slider 
                  value={[guarantor.coveragePercentage]} 
                  onValueChange={(values) => handleUpdateCoveragePercentage(guarantor.id, values[0])}
                  min={10} 
                  max={100} 
                  step={1}
                  className="py-4"
                />
                <p className="text-xs text-muted-foreground">
                  Define qué porcentaje de la deuda cubrirá este fiador. El total entre todos los fiadores debe sumar 100%.
                </p>
              </div>
              
              <Separator />
              
              <div className="space-y-2">
                <p className="text-sm font-medium">
                  Resumen del formulario del fiador
                </p>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border rounded-md p-4 bg-muted/10">
                  <div>
                    <p className="text-sm font-medium">Información personal</p>
                    <p className="text-xs text-muted-foreground">
                      {guarantor.name ? 'Completado' : 'Pendiente'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Documentos personales</p>
                    <p className="text-xs text-muted-foreground">Pendiente</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Información financiera</p>
                    <p className="text-xs text-muted-foreground">Pendiente</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Consentimiento</p>
                    <p className="text-xs text-muted-foreground">Pendiente</p>
                  </div>
                </div>
                
                {guarantor.type === 'non-salaried' ? (
                  <Button 
                    variant="secondary" 
                    className="w-full mt-2"
                    onClick={() => handleEditNonSalariedGuarantor(guarantor)}
                  >
                    Ver formulario completo del fiador no asalariado
                  </Button>
                ) : (
                  <Button variant="secondary" className="w-full mt-2">
                    Ver formulario completo del fiador
                  </Button>
                )}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
      
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar fiador?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Esto eliminará permanentemente al fiador
              y todos sus datos asociados.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmDeleteGuarantor}>Eliminar</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
};

export default GuarantorsSection;
