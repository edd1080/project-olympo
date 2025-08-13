import React from 'react';
import { Badge } from '@/components/ui/badge';
import { MapPin, Camera, Flag, Check, X, AlertTriangle } from 'lucide-react';

export type ChipType = 'geotag' | 'photos' | 'discrepancies';
export type ChipStatus = 'pending' | 'progress' | 'completed' | 'error';

interface DynamicStatusChipProps {
  type: ChipType;
  status: ChipStatus;
  value?: number;
  maxValue?: number;
  className?: string;
}

const DynamicStatusChip: React.FC<DynamicStatusChipProps> = ({
  type,
  status,
  value = 0,
  maxValue = 1,
  className
}) => {
  const getChipConfig = () => {
    switch (type) {
      case 'geotag':
        switch (status) {
          case 'pending':
            return {
              variant: 'secondary' as const,
              icon: MapPin,
              text: 'Geotag',
              className: ''
            };
          case 'completed':
            return {
              variant: 'outline' as const,
              icon: MapPin,
              text: 'Geotag',
              className: 'bg-success/10 text-success border-success'
            };
          case 'error':
            return {
              variant: 'outline' as const,
              icon: MapPin,
              text: 'Geotag',
              className: 'bg-error/10 text-error border-error'
            };
          default:
            return {
              variant: 'secondary' as const,
              icon: MapPin,
              text: 'Geotag',
              className: ''
            };
        }

      case 'photos':
        const isCompleted = value >= maxValue;
        const isInProgress = value > 0 && value < maxValue;
        
        if (isCompleted) {
          return {
            variant: 'outline' as const,
            icon: Camera,
            text: `Fotos ${value}/${maxValue}`,
            className: 'bg-success/10 text-success border-success'
          };
        } else if (isInProgress) {
          return {
            variant: 'outline' as const,
            icon: Camera,
            text: `Fotos ${value}/${maxValue}`,
            className: 'bg-info/10 text-info border-info'
          };
        } else {
          return {
            variant: 'secondary' as const,
            icon: Camera,
            text: `Fotos ${value}/${maxValue}`,
            className: ''
          };
        }

      case 'discrepancies':
        if (value === 0) {
          return {
            variant: 'outline' as const,
            icon: Check,
            text: 'Sin discrepancias',
            className: 'bg-success/10 text-success border-success'
          };
        } else if (value <= 2) {
          return {
            variant: 'outline' as const,
            icon: AlertTriangle,
            text: `${value} discrepancia${value > 1 ? 's' : ''}`,
            className: 'bg-warning/10 text-warning border-warning'
          };
        } else {
          return {
            variant: 'outline' as const,
            icon: X,
            text: `${value} discrepancias`,
            className: 'bg-error/10 text-error border-error'
          };
        }

      default:
        return {
          variant: 'secondary' as const,
          icon: Flag,
          text: 'Estado',
          className: ''
        };
    }
  };

  const config = getChipConfig();
  const Icon = config.icon;

  return (
    <Badge 
      variant={config.variant} 
      className={`text-xs inline-flex items-center gap-1 ${config.className} ${className}`}
    >
      <Icon className="h-3 w-3" />
      {config.text}
    </Badge>
  );
};

export default DynamicStatusChip;