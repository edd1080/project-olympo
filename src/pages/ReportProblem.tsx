
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Send, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

const ReportProblem = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    problemType: '',
    subject: '',
    description: '',
    urgency: ''
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    if (!formData.problemType || !formData.subject || !formData.description) {
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
      await new Promise(resolve => setTimeout(resolve, 2000));
      toast({
        title: "Reporte enviado",
        description: "Tu reporte ha sido enviado exitosamente. Te contactaremos pronto.",
      });
      setFormData({ problemType: '', subject: '', description: '', urgency: '' });
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
    <div className="min-h-screen bg-background">
      <div className="sticky top-0 z-10 bg-background border-b border-border px-4 py-3">
        <div className="flex items-center gap-3">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => navigate('/settings')}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-lg font-semibold">Reportar Problema</h1>
        </div>
      </div>

      <main className="px-4 py-6 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-primary" />
              Información del Problema
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="problemType">Tipo de problema *</Label>
              <Select value={formData.problemType} onValueChange={(value) => handleInputChange('problemType', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona el tipo de problema" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bug">Error en la aplicación</SelectItem>
                  <SelectItem value="performance">Problema de rendimiento</SelectItem>
                  <SelectItem value="feature">Solicitud de funcionalidad</SelectItem>
                  <SelectItem value="ui">Problema de interfaz</SelectItem>
                  <SelectItem value="data">Problema con datos</SelectItem>
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
                  <SelectItem value="critical">Crítica</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="subject">Asunto *</Label>
              <Input
                id="subject"
                value={formData.subject}
                onChange={(e) => handleInputChange('subject', e.target.value)}
                placeholder="Resumen breve del problema"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Descripción detallada *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Describe el problema en detalle, incluyendo los pasos para reproducirlo..."
                rows={6}
              />
            </div>
            
            <div className="text-sm text-muted-foreground">
              <p>* Campos obligatorios</p>
              <p className="mt-2">
                Recibirás una respuesta dentro de 24-48 horas hábiles.
              </p>
            </div>

            <Button onClick={handleSubmit} disabled={isLoading} className="w-full">
              <Send className="h-4 w-4 mr-2" />
              {isLoading ? 'Enviando...' : 'Enviar'}
            </Button>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default ReportProblem;
