
import React from 'react';
import { Button } from '@/components/ui/button';
import { UserPlus } from 'lucide-react';
import GuarantorCard from './GuarantorCard';
import { useNavigate } from 'react-router-dom';

interface Guarantor {
  id: string;
  name: string;
  relationship: string;
  progress: number;
  status: 'pending' | 'complete' | 'in-progress';
}

interface GuarantorsListProps {
  applicationId: string;
  guarantors: Guarantor[];
  maxGuarantors?: number;
}

const GuarantorsList = ({ applicationId, guarantors, maxGuarantors = 3 }: GuarantorsListProps) => {
  const navigate = useNavigate();

  const handleAddGuarantor = () => {
    navigate(`/applications/${applicationId}/guarantors/new`);
  };

  // Calculate total progress across all guarantors
  const calculateTotalProgress = () => {
    if (guarantors.length === 0) return 0;
    
    const totalProgress = guarantors.reduce((sum, guarantor) => {
      return sum + guarantor.progress;
    }, 0);
    
    return Math.min(100, Math.round(totalProgress / maxGuarantors));
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-medium">Fiadores</h3>
          <p className="text-sm text-muted-foreground">
            Progreso total: {calculateTotalProgress()}%
          </p>
        </div>
        {guarantors.length < maxGuarantors && (
          <Button 
            onClick={handleAddGuarantor}
            size="sm"
            className="gap-1"
          >
            <UserPlus className="h-4 w-4" />
            Agregar Fiador
          </Button>
        )}
      </div>
      
      {guarantors.length === 0 ? (
        <div className="text-center p-6 border border-dashed rounded-lg bg-muted/40">
          <UserPlus className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
          <p className="text-muted-foreground">No hay fiadores registrados</p>
          <Button 
            onClick={handleAddGuarantor}
            variant="outline"
            className="mt-4"
          >
            Agregar Fiador
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {guarantors.map((guarantor) => (
            <GuarantorCard
              key={guarantor.id}
              id={guarantor.id}
              applicationId={applicationId}
              name={guarantor.name}
              relationship={guarantor.relationship}
              progress={guarantor.progress}
              status={guarantor.status}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default GuarantorsList;
