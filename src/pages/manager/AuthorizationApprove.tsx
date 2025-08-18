import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '@/components/layout/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { AuthorizationRequest, AuthorizationAction } from '@/types/authorization';
import { DollarSign, Calendar, FileText, CheckCircle, User } from 'lucide-react';

const AuthorizationApprove = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [authorizationRequest, setAuthorizationRequest] = useState<AuthorizationRequest | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    comments: '',
    disbursementDate: '',
    conditions: ''
  });

  // Mock data - same as AuthorizationDetails
  useEffect(() => {
    const loadAuthorizationRequest = async () => {
      setIsLoading(true);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const mockRequest: AuthorizationRequest = {
        id: id || 'AUTH-001',
        applicationId: 'APP-2024-001',
        applicantName: 'María García Pérez',
        dpi: '1234567891234',
        amount: 15000,
        product: 'Crédito Comercial',
        term: 12,
        status: 'pending',
        businessType: 'Tienda de Abarrotes',
        creditScore: 720,
        riskLevel: 'medium',
        invcResult: 'verified',
        completionPercentage: 85,
        createdDate: '2025-01-14',
        assignedManager: 'Gerente Pérez',
        sections: [],
        dictamen: {
          creditAmount: 15000,
          product: 'Crédito Comercial',
          term: 12,
          rate: 18.5,
          guarantee: 'Fiador solidario',
          paymentMethod: 'Mensual',
          evaluations: {
            sib: { score: 720, status: 'approved', details: 'Sin morosidad actual', date: '2025-01-14' },
            internal: { score: 750, status: 'approved', details: 'Cliente recurrente con buen historial', date: '2025-01-14' },
            prequalifier: { score: 780, status: 'approved', details: 'Cumple todos los criterios', date: '2025-01-14' }
          },
          paymentCapacity: {
            monthlyIncome: 8500,
            monthlyExpenses: 5200,
            availableCapacity: 3300,
            recommendedPayment: 1650,
            debtToIncomeRatio: 0.19,
            liquidity: 1.8,
            profitability: 0.25,
            currentRatio: 2.1,
            acidRatio: 1.4
          },
          signatures: {
            agent: { name: 'Agente López', role: 'Agente de Crédito', date: '2025-01-14', digitallySigned: true },
            manager: { name: 'Gerente Pérez', role: 'Gerente de Sucursal', date: '2025-01-14', digitallySigned: false }
          }
        }
      };
      
      setAuthorizationRequest(mockRequest);
      setIsLoading(false);
    };

    loadAuthorizationRequest();
  }, [id]);

  const handleSubmit = async () => {
    if (!authorizationRequest) return;

    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const action: AuthorizationAction = {
      type: 'approve',
      comment: formData.comments,
      timestamp: new Date().toISOString(),
      userId: user?.id || '',
      userRole: user?.role || 'manager'
    };

    toast({
      title: "Desembolso Aprobado",
      description: `Crédito aprobado por Q${authorizationRequest.amount.toLocaleString()}`,
      variant: "success"
    });

    // Navigate back to authorizations list
    setTimeout(() => {
      navigate('/manager/authorizations');
    }, 1500);
  };

  const handleCancel = () => {
    navigate(`/manager/authorizations/${id}`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="mobile-container pt-4">
          <div className="animate-pulse space-y-4">
            <div className="h-32 bg-muted rounded"></div>
            <div className="h-64 bg-muted rounded"></div>
          </div>
        </main>
      </div>
    );
  }

  if (!authorizationRequest) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="mobile-container pt-4">
          <div className="text-center py-8">
            <p className="text-muted-foreground">Expediente no encontrado</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="mobile-container pt-4 space-y-4">
        {/* Request Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              Aprobar Desembolso
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Applicant Info */}
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-lg">{authorizationRequest.applicantName}</h3>
                <p className="text-sm text-muted-foreground">
                  {authorizationRequest.id} • DPI: {authorizationRequest.dpi}
                </p>
              </div>
              <Badge className="border-green-500 text-green-700 bg-green-50 dark:border-green-700 dark:text-green-300 dark:bg-green-950/20">
                Para Aprobación
              </Badge>
            </div>

            {/* Credit Details */}
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="font-medium">Q{authorizationRequest.amount.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">{authorizationRequest.product}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="font-medium">{authorizationRequest.term} meses</p>
                  <p className="text-xs text-muted-foreground">Plazo</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="font-medium">Recomendacion: Aprobar.</p>
                  <p className="text-xs text-muted-foreground">{authorizationRequest.businessType}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="font-medium">INVC: {authorizationRequest.invcResult}</p>
                  <p className="text-xs text-muted-foreground">Verificación</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Approval Form */}
        <Card>
          <CardHeader>
            <CardTitle>Detalles de Aprobación</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="disbursementDate">Fecha de Desembolso</Label>
              <Input
                id="disbursementDate"
                type="date"
                value={formData.disbursementDate}
                onChange={(e) => setFormData(prev => ({ ...prev, disbursementDate: e.target.value }))}
                min={new Date().toISOString().split('T')[0]}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="conditions">Condiciones Especiales (Opcional)</Label>
              <Textarea
                id="conditions"
                placeholder="Ingrese cualquier condición especial para el desembolso..."
                value={formData.conditions}
                onChange={(e) => setFormData(prev => ({ ...prev, conditions: e.target.value }))}
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="comments">Comentarios Adicionales</Label>
              <Textarea
                id="comments"
                placeholder="Comentarios sobre la aprobación..."
                value={formData.comments}
                onChange={(e) => setFormData(prev => ({ ...prev, comments: e.target.value }))}
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="sticky bottom-0 z-10 bg-background/95 backdrop-blur-sm border-t pt-4 pb-4">
          <div className="grid grid-cols-2 gap-3">
            <Button
              variant="outline"
              onClick={handleCancel}
              disabled={isSubmitting}
              size="lg"
            >
              Cancelar
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting}
              size="lg"
            >
              {isSubmitting ? 'Procesando...' : 'Confirmar Aprobación'}
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AuthorizationApprove;