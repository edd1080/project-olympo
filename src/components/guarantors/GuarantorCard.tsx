
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { User, FileText, CheckCircle, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface GuarantorCardProps {
  id: string;
  applicationId: string;
  name: string;
  relationship: string;
  progress: number;
  status: 'pending' | 'complete' | 'in-progress';
}

const GuarantorCard = ({ id, applicationId, name, relationship, progress, status }: GuarantorCardProps) => {
  const navigate = useNavigate();

  const getStatusBadge = () => {
    switch (status) {
      case 'complete':
        return (
          <Badge variant="outline" className="bg-green-100 text-green-800 flex items-center gap-1">
            <CheckCircle className="h-3 w-3" />
            Completado
          </Badge>
        );
      case 'in-progress':
        return (
          <Badge variant="outline" className="bg-blue-100 text-blue-800 flex items-center gap-1">
            <FileText className="h-3 w-3" />
            En progreso
          </Badge>
        );
      case 'pending':
      default:
        return (
          <Badge variant="outline" className="bg-amber-100 text-amber-800 flex items-center gap-1">
            <Clock className="h-3 w-3" />
            Pendiente
          </Badge>
        );
    }
  };

  const handleEditGuarantor = () => {
    navigate(`/applications/${applicationId}/guarantors/${id}/edit`);
  };

  const handleViewGuarantor = () => {
    navigate(`/applications/${applicationId}/guarantors/${id}`);
  };

  return (
    <Card className="transition-all hover:shadow-md">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <User className="h-5 w-5 text-primary" />
            </div>
            <div className="text-left">
              <CardTitle className="text-base">{name}</CardTitle>
              <p className="text-xs text-muted-foreground">{relationship}</p>
            </div>
          </div>
          {getStatusBadge()}
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-2">
          <div className="flex justify-between text-xs text-muted-foreground mb-1">
            <span>Progreso</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-1.5" />
        </div>
        <div className="flex justify-between gap-2 mt-4">
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleViewGuarantor}
            className="w-full"
          >
            Ver detalles
          </Button>
          <Button
            size="sm"
            onClick={handleEditGuarantor}
            className="w-full"
          >
            {status === 'pending' ? 'Llenar información' : 'Editar'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default GuarantorCard;
