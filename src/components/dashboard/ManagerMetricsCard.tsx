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
  return <Card className="h-32">
      <CardContent className="p-4">
        <div className="flex flex-col justify-center h-full text-center">
          <Icon className={`h-6 w-6 mx-auto mb-2 ${iconColorClass}`} />
          <p className="text-muted-foreground mb-1 text-base">{title}</p>
          {description && <p className="text-xs text-muted-foreground/80 leading-tight">{description}</p>}
          <p className="font-bold my-1 text-3xl">{value}</p>
        </div>
      </CardContent>
    </Card>;
};
export default ManagerMetricsCard;