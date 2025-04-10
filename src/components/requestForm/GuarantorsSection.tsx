
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Slider } from '@/components/ui/slider';
import { Plus, Trash2, User, AlertCircle, CheckCircle } from 'lucide-react';
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

interface GuarantorData {
  id: string;
  name: string;
  identification: string;
  coveragePercentage: number;
  status: 'pending' | 'complete';
}

interface GuarantorsSectionProps {
  formData: any;
  updateFormData: (field: string, value: any) => void;
}

const GuarantorsSection: React.FC<GuarantorsSectionProps> = ({ formData, updateFormData }) => {
  const { toast } = useToast();
  const [activeGuarantor, setActiveGuarantor] = useState<string>('guarantor-1');
  const [showDeleteDialog, setShowDeleteDialog] = useState<boolean>(false);
  const [guarantorToDelete, setGuarantorToDelete] = useState<string>('');
  
  // Initialize guarantors from formData or create default
  const initialGuarantors: GuarantorData[] = formData.guarantors || [
    {
      id: 'guarantor-1',
      name: '',
      identification: '',
      coveragePercentage: 33,
      status: 'pending' as const
    }
  ];
  
  const [guarantors, setGuarantors] = useState<GuarantorData[]>(initialGuarantors);
  
  const handleUpdateGuarantors = (updatedGuarantors: GuarantorData[]) => {
    setGuarantors(updatedGuarantors);
    updateFormData('guarantors', updatedGuarantors);
  };
  
  const handleAddGuarantor = () => {
    if (guarantors.length >= 3) {
      toast({
        title: 'Límite alcanzado',
        description: 'No se pueden agregar más de 3 fiadores.',
        variant: 'destructive'
      });
      return;
    }
    
    const newId = `guarantor-${guarantors.length + 1}`;
    const updatedGuarantors: GuarantorData[] = [
      ...guarantors,
      {
        id: newId,
        name: '',
        identification: '',
        coveragePercentage: Math.floor(100 / (guarantors.length + 1)),
        status: 'pending' as const
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
      </div>
    );
  };
  
  return (
    <Card className="border-0 shadow-none">
      <CardContent className="p-0 space-y-6">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-semibold text-lg">Fiadores</h3>
            <p className="text-muted-foreground text-sm">
              Gestiona los fiadores de esta solicitud. Máximo 3 fiadores.
            </p>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleAddGuarantor}
            disabled={guarantors.length >= 3}
          >
            <Plus className="mr-1 h-4 w-4" />
            Agregar fiador
          </Button>
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
                <h4 className="text-base font-medium">Datos del fiador {index + 1}</h4>
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
                
                <Button variant="secondary" className="w-full mt-2">
                  Ver formulario completo del fiador
                </Button>
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
