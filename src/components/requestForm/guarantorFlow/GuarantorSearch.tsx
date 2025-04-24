
import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent 
} from '@/components/ui/card';
import { 
  Input 
} from '@/components/ui/input';
import { 
  Label 
} from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertCircle,
  CheckCircle,
  Loader2
} from 'lucide-react';
import { 
  Badge 
} from '@/components/ui/badge';
import { 
  useToast 
} from '@/hooks/use-toast';
import { 
  GuarantorData 
} from '../RequestFormProvider';

interface GuarantorSearchProps {
  guarantor: GuarantorData;
  updateGuarantorData: (field: keyof GuarantorData, value: any) => void;
  setStepComplete: (isComplete: boolean) => void;
}

const GuarantorSearch: React.FC<GuarantorSearchProps> = ({ 
  guarantor, 
  updateGuarantorData,
  setStepComplete
}) => {
  const { toast } = useToast();
  const [isSearching, setIsSearching] = useState(false);
  const [searchComplete, setSearchComplete] = useState(false);
  
  // Check if we have an existing guarantor
  const isExistingGuarantor = guarantor.isExistingGuarantor || false;
  
  // Initialize personal info
  const personalInfo = guarantor.personalInfo || {
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
  };
  
  // Handle CUI search
  const handleSearch = async () => {
    if (!personalInfo.cui || personalInfo.cui.trim().length < 8) {
      toast({
        title: "CUI inválido",
        description: "Ingrese un CUI válido para buscar",
        variant: "destructive"
      });
      return;
    }
    
    setIsSearching(true);
    
    // Simulate API call to search for the guarantor
    setTimeout(() => {
      // Random result - found or not found
      const found = Math.random() > 0.7;
      
      if (found) {
        // Simulate finding an existing guarantor
        const mockExistingGuarantor = {
          firstName: 'Carlos',
          lastName: 'Méndez',
          cui: personalInfo.cui,
          email: 'carlosmendez@example.com',
          phone: '5555-1234',
          education: 'universidad',
          profession: 'Comerciante',
          housingType: 'propia',
          maritalStatus: 'casado',
          dependents: 2,
          address: '3ra Calle 5-23 Zona 10, Guatemala'
        };
        
        updateGuarantorData('personalInfo', mockExistingGuarantor);
        updateGuarantorData('isExistingGuarantor', true);
        updateGuarantorData('name', `${mockExistingGuarantor.firstName} ${mockExistingGuarantor.lastName}`);
        updateGuarantorData('identification', mockExistingGuarantor.cui);
        
        toast({
          title: "Fiador encontrado",
          description: "Se han cargado los datos del fiador",
          className: "bg-green-100 text-green-800"
        });
      } else {
        toast({
          title: "Fiador no encontrado",
          description: "Complete el formulario con los datos del nuevo fiador",
          variant: "default"
        });
        
        updateGuarantorData('isExistingGuarantor', false);
      }
      
      setIsSearching(false);
      setSearchComplete(true);
    }, 1500);
  };
  
  // Update personal info field
  const updatePersonalInfo = (field: keyof typeof personalInfo, value: string | number) => {
    const updatedInfo = {
      ...personalInfo,
      [field]: value
    };
    
    updateGuarantorData('personalInfo', updatedInfo);
    
    // If we're updating first or last name, also update the name field
    if (field === 'firstName' || field === 'lastName') {
      updateGuarantorData('name', `${updatedInfo.firstName} ${updatedInfo.lastName}`);
    }
    
    // If we're updating CUI, also update identification
    if (field === 'cui') {
      updateGuarantorData('identification', value);
    }
  };
  
  // Check if the form is complete
  useEffect(() => {
    const { firstName, lastName, cui, email, phone, maritalStatus, address } = personalInfo;
    const isValid = 
      firstName?.trim() !== '' && 
      lastName?.trim() !== '' && 
      cui?.trim() !== '' &&
      cui?.trim().length >= 8 &&
      email?.trim() !== '' &&
      phone?.trim() !== '' &&
      maritalStatus?.trim() !== '' &&
      address?.trim() !== '';
    
    setStepComplete(isValid);
  }, [personalInfo, setStepComplete]);
  
  return (
    <div className="space-y-6">
      <div className="border-b pb-4">
        <h3 className="text-lg font-medium">Información Personal del Fiador</h3>
        <p className="text-muted-foreground text-sm">
          Ingrese el CUI para buscar o registrar un nuevo fiador
        </p>
      </div>
      
      <Card className="border shadow-sm">
        <CardContent className="p-4 space-y-4">
          <div className="flex flex-col md:flex-row gap-4 items-end">
            <div className="flex-1 space-y-2">
              <Label htmlFor="cui">CUI/DPI</Label>
              <div className="flex gap-2 items-center">
                <Input
                  id="cui"
                  placeholder="Ej. 1234567890101"
                  value={personalInfo.cui}
                  onChange={(e) => updatePersonalInfo('cui', e.target.value)}
                  disabled={isSearching || isExistingGuarantor}
                  className="flex-1"
                />
              </div>
              <p className="text-xs text-muted-foreground">Ingrese el CUI sin guiones</p>
            </div>
            {searchComplete && !isSearching && (
              isExistingGuarantor ? (
                <Badge variant="outline" className="bg-green-100 text-green-800 flex items-center gap-1">
                  <CheckCircle className="h-3 w-3" />
                  Datos precargados
                </Badge>
              ) : (
                <Badge variant="outline" className="bg-blue-100 text-blue-800 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  Nuevo registro
                </Badge>
              )
            )}
          </div>
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="firstName">Nombres</Label>
          <Input
            id="firstName"
            placeholder="Nombres del fiador"
            value={personalInfo.firstName}
            onChange={(e) => updatePersonalInfo('firstName', e.target.value)}
            disabled={isExistingGuarantor}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="lastName">Apellidos</Label>
          <Input
            id="lastName"
            placeholder="Apellidos del fiador"
            value={personalInfo.lastName}
            onChange={(e) => updatePersonalInfo('lastName', e.target.value)}
            disabled={isExistingGuarantor}
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="email">Correo Electrónico</Label>
          <Input
            id="email"
            type="email"
            placeholder="correo@ejemplo.com"
            value={personalInfo.email}
            onChange={(e) => updatePersonalInfo('email', e.target.value)}
            disabled={isExistingGuarantor}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone">Teléfono</Label>
          <Input
            id="phone"
            placeholder="Ej. 5555-1234"
            value={personalInfo.phone}
            onChange={(e) => updatePersonalInfo('phone', e.target.value)}
            disabled={isExistingGuarantor}
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="education">Nivel de Educación</Label>
          <Select
            value={personalInfo.education}
            onValueChange={(value) => updatePersonalInfo('education', value)}
            disabled={isExistingGuarantor}
          >
            <SelectTrigger>
              <SelectValue placeholder="Seleccione nivel educativo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="primaria">Primaria</SelectItem>
              <SelectItem value="secundaria">Secundaria</SelectItem>
              <SelectItem value="diversificado">Diversificado</SelectItem>
              <SelectItem value="universidad">Universidad</SelectItem>
              <SelectItem value="postgrado">Postgrado</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="profession">Profesión / Ocupación</Label>
          <Input
            id="profession"
            placeholder="Ej. Comerciante"
            value={personalInfo.profession}
            onChange={(e) => updatePersonalInfo('profession', e.target.value)}
            disabled={isExistingGuarantor}
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="housingType">Tipo de Vivienda</Label>
          <Select
            value={personalInfo.housingType}
            onValueChange={(value) => updatePersonalInfo('housingType', value)}
            disabled={isExistingGuarantor}
          >
            <SelectTrigger>
              <SelectValue placeholder="Seleccione tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="propia">Propia</SelectItem>
              <SelectItem value="alquilada">Alquilada</SelectItem>
              <SelectItem value="familiar">Familiar</SelectItem>
              <SelectItem value="prestada">Prestada</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="maritalStatus">Estado Civil</Label>
          <Select
            value={personalInfo.maritalStatus}
            onValueChange={(value) => updatePersonalInfo('maritalStatus', value)}
            disabled={isExistingGuarantor}
          >
            <SelectTrigger>
              <SelectValue placeholder="Seleccione estado civil" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="soltero">Soltero/a</SelectItem>
              <SelectItem value="casado">Casado/a</SelectItem>
              <SelectItem value="unido">Unido/a</SelectItem>
              <SelectItem value="divorciado">Divorciado/a</SelectItem>
              <SelectItem value="viudo">Viudo/a</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="dependents">Dependientes</Label>
          <Input
            id="dependents"
            type="number"
            min={0}
            placeholder="Número de dependientes"
            value={personalInfo.dependents.toString()}
            onChange={(e) => updatePersonalInfo('dependents', parseInt(e.target.value) || 0)}
            disabled={isExistingGuarantor}
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="address">Dirección de Residencia</Label>
        <Input
          id="address"
          placeholder="Dirección completa"
          value={personalInfo.address}
          onChange={(e) => updatePersonalInfo('address', e.target.value)}
          disabled={isExistingGuarantor}
        />
      </div>
    </div>
  );
};

export default GuarantorSearch;
