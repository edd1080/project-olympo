
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users } from 'lucide-react';

interface GuarantorsSectionProps {
  formData: Record<string, any>;
  updateFormData: (field: string, value: any) => void;
}

const GuarantorsSection: React.FC<GuarantorsSectionProps> = ({
  formData,
  updateFormData
}) => {
  return (
    <div className="space-y-6">
      <div className="border-b pb-4">
        <h2 className="text-xl font-semibold">Garantías, Fiadores y Referencias</h2>
        <p className="text-muted-foreground">
          Información sobre fiadores y garantías para la solicitud de crédito
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            Sección de Fiadores
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">
              Esta sección será implementada próximamente con la nueva lógica de fiadores.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default GuarantorsSection;
