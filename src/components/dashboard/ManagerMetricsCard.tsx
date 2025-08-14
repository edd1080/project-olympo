import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';

interface ManagerMetricsCardProps {
  icon: LucideIcon;
  title: string;
  value: number;
  description?: string;
  colorClass: string;
  iconColorClass: string;
}

const ManagerMetricsCard = ({ 
  icon: Icon, 
  title, 
  value, 
  description, 
  colorClass, 
  iconColorClass 
}: ManagerMetricsCardProps) => {
  return (
    <Card className="card-hover h-24">
      <CardContent className="p-4">
        <div className="flex items-center gap-3 h-full">
          <div className={`flex h-12 w-12 items-center justify-center rounded-full ${colorClass}`}>
            <Icon className={`h-6 w-6 ${iconColorClass}`} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm text-muted-foreground leading-tight">{title}</p>
            {description && (
              <p className="text-xs text-muted-foreground/80 leading-tight">{description}</p>
            )}
            <p className="text-2xl font-bold leading-none mt-1">{value}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ManagerMetricsCard;