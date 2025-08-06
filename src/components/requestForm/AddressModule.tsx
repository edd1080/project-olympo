import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';

interface AddressData {
  pais: string;
  departamento: string;
  municipio: string;
  tieneZona: boolean;
  zona: string;
  tieneAvenida: boolean;
  avenida: string;
  tieneNumero: boolean;
  numero: string;
  tieneApartamento: boolean;
  apartamento: string;
  tieneColonia: boolean;
  colonia: string;
  tieneAldea: boolean;
  aldea: string;
  tieneOtrasIndicaciones: boolean;
  otrasIndicaciones: string;
  direccionCompleta: string;
}

interface AddressModuleProps {
  initialData?: Partial<AddressData>;
  onSave: (data: AddressData) => void;
  onCancel: () => void;
}

const departamentos = [
  'Guatemala', 'El Progreso', 'Sacatepéquez', 'Chimaltenango', 'Escuintla',
  'Santa Rosa', 'Sololá', 'Totonicapán', 'Quetzaltenango', 'Suchitepéquez',
  'Retalhuleu', 'San Marcos', 'Huehuetenango', 'Quiché', 'Baja Verapaz',
  'Alta Verapaz', 'Petén', 'Izabal', 'Zacapa', 'Chiquimula', 'Jalapa', 'Jutiapa'
];

const municipiosPorDepartamento: { [key: string]: string[] } = {
  'Guatemala': ['Guatemala', 'Santa Catarina Pinula', 'San José Pinula', 'San José del Golfo', 'Palencia', 'Chinautla', 'San Pedro Ayampuc', 'Mixco', 'San Pedro Sacatepéquez', 'San Juan Sacatepéquez', 'San Raymundo', 'Chuarrancho', 'Fraijanes', 'Amatitlán', 'Villa Nueva', 'Villa Canales', 'Petapa'],
  'El Progreso': ['Guastatoya', 'Morazán', 'San Agustín Acasaguastlán', 'San Cristóbal Acasaguastlán', 'El Jícaro', 'Sansare', 'Sanarate', 'San Antonio La Paz'],
  // Agregar más municipios según se necesite
};

const zonas = Array.from({ length: 25 }, (_, i) => `Zona ${i + 1}`);

const AddressModule: React.FC<AddressModuleProps> = ({ initialData, onSave, onCancel }) => {
  const [addressData, setAddressData] = useState<AddressData>({
    pais: 'GUATEMALA',
    departamento: '',
    municipio: '',
    tieneZona: false,
    zona: '',
    tieneAvenida: false,
    avenida: '',
    tieneNumero: false,
    numero: '',
    tieneApartamento: false,
    apartamento: '',
    tieneColonia: false,
    colonia: '',
    tieneAldea: false,
    aldea: '',
    tieneOtrasIndicaciones: false,
    otrasIndicaciones: '',
    direccionCompleta: '',
    ...initialData
  });

  const updateField = (field: keyof AddressData, value: any) => {
    setAddressData(prev => ({ ...prev, [field]: value }));
  };

  const generateCompleteAddress = () => {
    const parts = [];
    
    if (addressData.tieneAvenida && addressData.avenida) {
      parts.push(addressData.avenida);
    }
    
    if (addressData.tieneNumero && addressData.numero) {
      parts.push(addressData.numero);
    }
    
    if (addressData.tieneZona && addressData.zona) {
      parts.push(addressData.zona);
    }
    
    if (addressData.tieneApartamento && addressData.apartamento) {
      parts.push(addressData.apartamento);
    }
    
    if (addressData.tieneColonia && addressData.colonia) {
      parts.push(addressData.colonia);
    }
    
    if (addressData.tieneAldea && addressData.aldea) {
      parts.push(addressData.aldea);
    }
    
    if (addressData.municipio) {
      parts.push(addressData.municipio);
    }
    
    if (addressData.departamento) {
      parts.push(addressData.departamento);
    }
    
    if (addressData.tieneOtrasIndicaciones && addressData.otrasIndicaciones) {
      parts.push(`(${addressData.otrasIndicaciones})`);
    }
    
    return parts.join(', ');
  };

  useEffect(() => {
    const completeAddress = generateCompleteAddress();
    setAddressData(prev => ({ ...prev, direccionCompleta: completeAddress }));
  }, [
    addressData.departamento,
    addressData.municipio,
    addressData.tieneZona,
    addressData.zona,
    addressData.tieneAvenida,
    addressData.avenida,
    addressData.tieneNumero,
    addressData.numero,
    addressData.tieneApartamento,
    addressData.apartamento,
    addressData.tieneColonia,
    addressData.colonia,
    addressData.tieneAldea,
    addressData.aldea,
    addressData.tieneOtrasIndicaciones,
    addressData.otrasIndicaciones
  ]);

  const handleSave = () => {
    onSave(addressData);
  };

  const isFormValid = () => {
    return addressData.departamento && addressData.municipio;
  };

  const availableMunicipios = municipiosPorDepartamento[addressData.departamento] || [];

  return (
    <ScrollArea className="h-full pr-4">
      <div className="space-y-6 pb-6">
        {/* País */}
        <div className="space-y-2">
          <Label>País de residencia</Label>
          <Input
            value={addressData.pais}
            readOnly
            className="bg-muted"
          />
        </div>

        {/* Departamento */}
        <div className="space-y-2">
          <Label>Departamento de residencia *</Label>
          <Select 
            value={addressData.departamento} 
            onValueChange={(value) => updateField('departamento', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Seleccionar departamento" />
            </SelectTrigger>
            <SelectContent>
              {departamentos.map(dept => (
                <SelectItem key={dept} value={dept}>{dept}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Municipio */}
        <div className="space-y-2">
          <Label>Municipio de residencia *</Label>
          <Select 
            value={addressData.municipio} 
            onValueChange={(value) => updateField('municipio', value)}
            disabled={!addressData.departamento}
          >
            <SelectTrigger>
              <SelectValue placeholder="Seleccionar municipio" />
            </SelectTrigger>
            <SelectContent>
              {availableMunicipios.map(mun => (
                <SelectItem key={mun} value={mun}>{mun}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Zona */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Switch
              id="tieneZona"
              checked={addressData.tieneZona}
              onCheckedChange={(checked) => updateField('tieneZona', checked)}
            />
            <Label htmlFor="tieneZona">¿La dirección tiene zona?</Label>
          </div>
          
          {addressData.tieneZona && (
            <Select 
              value={addressData.zona} 
              onValueChange={(value) => updateField('zona', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar zona" />
              </SelectTrigger>
              <SelectContent>
                {zonas.map(zona => (
                  <SelectItem key={zona} value={zona}>{zona}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>

        {/* Avenida/Calle */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Switch
              id="tieneAvenida"
              checked={addressData.tieneAvenida}
              onCheckedChange={(checked) => updateField('tieneAvenida', checked)}
            />
            <Label htmlFor="tieneAvenida">¿La dirección tiene avenida, calle, ruta o vía?</Label>
          </div>
          
          {addressData.tieneAvenida && (
            <Input
              placeholder="Nombre de avenida, calle, ruta o vía"
              value={addressData.avenida}
              onChange={(e) => updateField('avenida', e.target.value)}
            />
          )}
        </div>

        {/* Número de casa */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Switch
              id="tieneNumero"
              checked={addressData.tieneNumero}
              onCheckedChange={(checked) => updateField('tieneNumero', checked)}
            />
            <Label htmlFor="tieneNumero">¿La dirección tiene número de casa o lote?</Label>
          </div>
          
          {addressData.tieneNumero && (
            <Input
              placeholder="Número de casa o lote"
              value={addressData.numero}
              onChange={(e) => updateField('numero', e.target.value)}
            />
          )}
        </div>

        {/* Apartamento */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Switch
              id="tieneApartamento"
              checked={addressData.tieneApartamento}
              onCheckedChange={(checked) => updateField('tieneApartamento', checked)}
            />
            <Label htmlFor="tieneApartamento">¿La dirección tiene apartamento, manzana o sector?</Label>
          </div>
          
          {addressData.tieneApartamento && (
            <Input
              placeholder="Apartamento, manzana o sector"
              value={addressData.apartamento}
              onChange={(e) => updateField('apartamento', e.target.value)}
            />
          )}
        </div>

        {/* Colonia */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Switch
              id="tieneColonia"
              checked={addressData.tieneColonia}
              onCheckedChange={(checked) => updateField('tieneColonia', checked)}
            />
            <Label htmlFor="tieneColonia">¿La dirección tiene colonia, condominio o edificio?</Label>
          </div>
          
          {addressData.tieneColonia && (
            <Input
              placeholder="Colonia, condominio o edificio"
              value={addressData.colonia}
              onChange={(e) => updateField('colonia', e.target.value)}
            />
          )}
        </div>

        {/* Aldea */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Switch
              id="tieneAldea"
              checked={addressData.tieneAldea}
              onCheckedChange={(checked) => updateField('tieneAldea', checked)}
            />
            <Label htmlFor="tieneAldea">¿La dirección tiene aldea, caserío, cantón, finca o similar?</Label>
          </div>
          
          {addressData.tieneAldea && (
            <Input
              placeholder="Aldea, caserío, cantón, finca o similar"
              value={addressData.aldea}
              onChange={(e) => updateField('aldea', e.target.value)}
            />
          )}
        </div>

        {/* Otras indicaciones */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Switch
              id="tieneOtrasIndicaciones"
              checked={addressData.tieneOtrasIndicaciones}
              onCheckedChange={(checked) => updateField('tieneOtrasIndicaciones', checked)}
            />
            <Label htmlFor="tieneOtrasIndicaciones">¿Otras indicaciones?</Label>
          </div>
          
          {addressData.tieneOtrasIndicaciones && (
            <Textarea
              placeholder="Descripción adicional de la ubicación"
              value={addressData.otrasIndicaciones}
              onChange={(e) => updateField('otrasIndicaciones', e.target.value)}
              rows={3}
            />
          )}
        </div>

        {/* Dirección completa generada */}
        <div className="space-y-2">
          <Label>Dirección particular completa</Label>
          <Textarea
            value={addressData.direccionCompleta}
            readOnly
            className="bg-muted"
            rows={3}
          />
        </div>

        {/* Botones de acción */}
        <div className="flex gap-3 pt-4">
          <Button
            variant="outline"
            onClick={onCancel}
            className="flex-1"
          >
            Cancelar
          </Button>
          <Button
            onClick={handleSave}
            className="flex-1"
            disabled={!isFormValid()}
          >
            Guardar Dirección
          </Button>
        </div>
      </div>
    </ScrollArea>
  );
};

export default AddressModule;