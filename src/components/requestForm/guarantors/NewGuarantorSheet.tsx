import React, { useEffect, useMemo, useState } from 'react';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription, DrawerFooter } from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { X } from 'lucide-react';

interface NewGuarantorData {
  fullName: string;
  birthDate: string;
  age: number;
  employmentType: 'asalariado' | 'negocio';
}

interface NewGuarantorSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreate: (data: NewGuarantorData) => void;
  onDiscard: () => void; // Called when closing without data or after confirming discard
}

const computeAge = (birthDate: string) => {
  if (!birthDate) return 0;
  const dob = new Date(birthDate);
  const now = new Date();
  let age = now.getFullYear() - dob.getFullYear();
  const m = now.getMonth() - dob.getMonth();
  if (m < 0 || (m === 0 && now.getDate() < dob.getDate())) {
    age--;
  }
  return age < 0 ? 0 : age;
};

const NewGuarantorSheet: React.FC<NewGuarantorSheetProps> = ({ open, onOpenChange, onCreate, onDiscard }) => {
  const [fullName, setFullName] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [employmentType, setEmploymentType] = useState<'asalariado' | 'negocio' | ''>('');
  const [confirmOpen, setConfirmOpen] = useState(false);

  const age = useMemo(() => computeAge(birthDate), [birthDate]);

  const hasData = fullName.trim() !== '' || birthDate !== '' || employmentType !== '';

  const handleAttemptClose = (nextOpen: boolean) => {
    if (!nextOpen) {
      if (!hasData) {
        onDiscard();
        onOpenChange(false);
        return;
      }
      setConfirmOpen(true);
      return;
    }
    onOpenChange(true);
  };

  const handleConfirmDiscard = () => {
    setConfirmOpen(false);
    onDiscard();
    onOpenChange(false);
  };

  const handleAdd = () => {
    if (!fullName.trim() && !birthDate && !employmentType) {
      // Nothing entered, just discard silently
      onDiscard();
      onOpenChange(false);
      return;
    }
    onCreate({ fullName: fullName.trim(), birthDate, age, employmentType: (employmentType || 'asalariado') as 'asalariado' | 'negocio' });
  };

  useEffect(() => {
    if (!open) {
      // reset when closed
      setFullName('');
      setBirthDate('');
      setEmploymentType('');
      setConfirmOpen(false);
    }
  }, [open]);

  return (
    <>
      <Drawer open={open} onOpenChange={handleAttemptClose}>
        <DrawerContent className="px-4 pb-4">
          <div className="absolute right-3 top-3">
            <Button variant="ghost" size="icon" aria-label="Cerrar" onClick={() => handleAttemptClose(false)}>
              <X className="h-5 w-5" />
            </Button>
          </div>
          <DrawerHeader className="text-left">
            <DrawerTitle>Nuevo Fiador</DrawerTitle>
            <DrawerDescription>Completa los datos mínimos. Puedes terminar más tarde.</DrawerDescription>
          </DrawerHeader>

          <div className="space-y-4 px-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">Nombre completo</Label>
              <Input id="fullName" placeholder="Ej. Juan Pérez" value={fullName} onChange={(e) => setFullName(e.target.value)} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="birthDate">Fecha de nacimiento</Label>
                <Input id="birthDate" type="date" value={birthDate} onChange={(e) => setBirthDate(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="age">Edad</Label>
                <Input id="age" value={age ? `${age}` : ''} placeholder="—" readOnly />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Tipo de empleo</Label>
              <RadioGroup value={employmentType} onValueChange={(v) => setEmploymentType(v as 'asalariado' | 'negocio')} className="grid grid-cols-2 gap-2">
                <div className="flex items-center space-x-2 rounded-md border p-3">
                  <RadioGroupItem value="asalariado" id="asalariado" />
                  <Label htmlFor="asalariado" className="cursor-pointer">Asalariado</Label>
                </div>
                <div className="flex items-center space-x-2 rounded-md border p-3">
                  <RadioGroupItem value="negocio" id="negocio" />
                  <Label htmlFor="negocio" className="cursor-pointer">Negocio propio</Label>
                </div>
              </RadioGroup>
            </div>
          </div>

          <DrawerFooter className="gap-2 px-4">
            <Button onClick={handleAdd} className="w-full">Agregar</Button>
            <Button variant="outline" onClick={() => handleAttemptClose(false)} className="w-full">Cancelar</Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>

      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Descartar cambios?</AlertDialogTitle>
            <AlertDialogDescription>
              Tienes cambios sin guardar en este fiador. Si cierras, se perderán los datos ingresados.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Seguir editando</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmDiscard}>Descartar</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default NewGuarantorSheet;
