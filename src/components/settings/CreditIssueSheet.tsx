import React, { useState } from 'react';
import { Send, CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { useToast } from '@/hooks/use-toast';

interface CreditIssueSheetProps {
  isOpen: boolean;
  onClose: () => void;
}

const CreditIssueSheet = ({ isOpen, onClose }: CreditIssueSheetProps) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    requestId: '',
    issueType: '',
    subject: '',
    description: '',
    urgency: ''
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    if (!formData.requestId || !formData.issueType || !formData.subject || !formData.description) {
      toast({
        title: "Error",
        description: "Por favor completa todos los campos requeridos",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      // Simular envío de reporte
      await new Promise(resolve => setTimeout(resolve, 1500));
      toast({
        title: "Reporte enviado",
        description: "Tu consulta ha sido enviada exitosamente.",
        variant: "success"
      });
      setFormData({ requestId: '', issueType: '', subject: '', description: '', urgency: '' });
      onClose();
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo enviar el reporte",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="bottom" className="h-[85vh]">
        <SheetHeader className="mb-6">
          <SheetTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-primary" />
            Reportar problema con solicitud de crédito
          </SheetTitle>
          <SheetDescription>
            Recibe soporte para alguna solicitud de crédito en específico
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-4 overflow-y-auto max-h-[65vh] pr-2">
          <div className="space-y-2">
            <Label htmlFor="requestId">ID de la solicitud *</Label>
            <Input
              id="requestId"
              value={formData.requestId}
              onChange={(e) => handleInputChange('requestId', e.target.value)}
              placeholder="Ej: SOL-2024-001234"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="issueType">Tipo de consulta *</Label>
            <Select value={formData.issueType} onValueChange={(value) => handleInputChange('issueType', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Selecciona el tipo de consulta" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="status">Estado de la solicitud</SelectItem>
                <SelectItem value="documentation">Documentación requerida</SelectItem>
                <SelectItem value="approval">Proceso de aprobación</SelectItem>
                <SelectItem value="disbursement">Desembolso</SelectItem>
                <SelectItem value="requirements">Requisitos adicionales</SelectItem>
                <SelectItem value="modification">Modificación de solicitud</SelectItem>
                <SelectItem value="cancellation">Cancelación</SelectItem>
                <SelectItem value="other">Otro</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="urgency">Prioridad</Label>
            <Select value={formData.urgency} onValueChange={(value) => handleInputChange('urgency', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Selecciona la prioridad" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Baja</SelectItem>
                <SelectItem value="medium">Media</SelectItem>
                <SelectItem value="high">Alta</SelectItem>
                <SelectItem value="urgent">Urgente</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="subject">Asunto *</Label>
            <Input
              id="subject"
              value={formData.subject}
              onChange={(e) => handleInputChange('subject', e.target.value)}
              placeholder="Resumen breve de tu consulta"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Descripción detallada *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Describe tu consulta o problema con la solicitud en detalle..."
              rows={4}
            />
          </div>
          
          <div className="text-sm text-muted-foreground">
            <p>* Campos obligatorios</p>
            <p className="mt-2">
              Un especialista en créditos se contactará contigo dentro de 12-24 horas hábiles.
            </p>
          </div>

          <Button onClick={handleSubmit} disabled={isLoading} className="w-full">
            <Send className="h-4 w-4 mr-2" />
            {isLoading ? 'Enviando...' : 'Enviar consulta'}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default CreditIssueSheet;