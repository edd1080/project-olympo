import React, { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { MapPin, Edit3 } from 'lucide-react';
import AddressModule from '../AddressModule';
import { validatePhone } from '@/utils/dpiValidation';
interface ContactDataFormProps {
  formData: any;
  updateFormData: (field: string, value: any) => void;
}
const ContactDataForm: React.FC<ContactDataFormProps> = ({
  formData,
  updateFormData
}) => {
  const [isAddressOpen, setIsAddressOpen] = useState(false);
  const [mobileError, setMobileError] = useState<string>('');
  const [homePhoneError, setHomePhoneError] = useState<string>('');
  const handleAddressUpdate = (addressData: any) => {
    updateFormData('completeAddress', addressData);
    setIsAddressOpen(false);
  };
  const handleMobileChange = (value: string) => {
    const validation = validatePhone(value);
    if (!validation.isValid) {
      setMobileError(validation.error || '');
    } else {
      setMobileError('');
    }
    updateFormData('mobilePhone', value);
  };
  const handleHomePhoneChange = (value: string) => {
    if (value) {
      const validation = validatePhone(value);
      if (!validation.isValid) {
        setHomePhoneError(validation.error || '');
      } else {
        setHomePhoneError('');
      }
    } else {
      setHomePhoneError('');
    }
    updateFormData('homePhone', value);
  };
  return <div className="space-y-6">
      {/* Subtitle */}
      <h3 className="text-subtitle text-secondary-foreground">Datos de contacto</h3>
      
      {/* Address */}
      <div className="space-y-2">
        <Label className="text-label">
          Dirección completa *
        </Label>
        <div className="flex gap-2">
          <Input value={formData.completeAddress?.direccionCompleta || 'No registrada'} readOnly className="bg-muted flex-1" />
          <Sheet open={isAddressOpen} onOpenChange={setIsAddressOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon">
                <Edit3 className="h-4 w-4" />
              </Button>
            </SheetTrigger>
            <SheetContent side="bottom" className="h-[90vh]">
              <SheetHeader>
                <SheetTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Completar Dirección
                </SheetTitle>
                <SheetDescription>
                  Completa la información de tu dirección de residencia
                </SheetDescription>
              </SheetHeader>
              <AddressModule initialData={formData.completeAddress} onSave={handleAddressUpdate} onCancel={() => setIsAddressOpen(false)} />
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Phone numbers */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="homePhone" className="text-label">
            Teléfono casa
          </Label>
          <Input id="homePhone" value={formData.homePhone || ''} onChange={e => handleHomePhoneChange(e.target.value)} placeholder="0000-0000" />
          {homePhoneError && <p className="text-sm text-destructive">{homePhoneError}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="mobilePhone" className="text-label">
            Número celular *
          </Label>
          <Input id="mobilePhone" value={formData.mobilePhone || ''} onChange={e => handleMobileChange(e.target.value)} placeholder="0000-0000" />
          {mobileError && <p className="text-sm text-destructive">{mobileError}</p>}
        </div>
      </div>

      {/* Nationality section */}
      
    </div>;
};
export default ContactDataForm;