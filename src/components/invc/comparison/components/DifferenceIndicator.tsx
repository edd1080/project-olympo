import React from 'react';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, AlertTriangle, CheckCircle } from 'lucide-react';

interface DifferenceIndicatorProps {
  difference: number;
  threshold: number;
  type: 'percentage' | 'absolute';
  showIcon?: boolean;
  className?: string;
}

export const DifferenceIndicator: React.FC<DifferenceIndicatorProps> = ({
  difference,
  threshold,
  type,
  showIcon = true,
  className = ''
}) => {
  const absDifference = Math.abs(difference);
  const exceedsThreshold = absDifference > threshold;
  
  const getSeverityLevel = () => {
    if (absDifference <= threshold * 0.5) return 'low';
    if (absDifference <= threshold) return 'medium';
    if (absDifference <= threshold * 1.5) return 'high';
    return 'critical';
  };

  const severity = getSeverityLevel();

  const getColorClass = () => {
    switch (severity) {
      case 'low': return 'text-green-600';
      case 'medium': return 'text-yellow-600';
      case 'high': return 'text-orange-600';
      case 'critical': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getBadgeVariant = () => {
    switch (severity) {
      case 'low': return 'default';
      case 'medium': return 'secondary';
      case 'high': return 'secondary';
      case 'critical': return 'destructive';
      default: return 'secondary';
    }
  };

  const getIcon = () => {
    if (!showIcon) return null;
    
    if (severity === 'critical') {
      return <AlertTriangle className="h-4 w-4" />;
    }
    
    if (severity === 'low') {
      return <CheckCircle className="h-4 w-4" />;
    }
    
    return difference > 0 ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />;
  };

  const formatDifference = () => {
    if (type === 'percentage') {
      return `${difference > 0 ? '+' : ''}${difference.toFixed(1)}%`;
    }
    return `${difference > 0 ? '+' : ''}${difference.toLocaleString()}`;
  };

  const getProgressValue = () => {
    const maxValue = threshold * 2;
    return Math.min((absDifference / maxValue) * 100, 100);
  };

  const getProgressColor = () => {
    switch (severity) {
      case 'low': return 'bg-green-500';
      case 'medium': return 'bg-yellow-500';
      case 'high': return 'bg-orange-500';
      case 'critical': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex items-center justify-between">
        <div className={`flex items-center gap-2 ${getColorClass()}`}>
          {getIcon()}
          <span className="font-medium">
            Diferencia: {formatDifference()}
          </span>
        </div>
        
        <Badge variant={getBadgeVariant()}>
          {severity === 'low' && 'Aceptable'}
          {severity === 'medium' && 'Moderada'}
          {severity === 'high' && 'Alta'}
          {severity === 'critical' && 'Crítica'}
        </Badge>
      </div>

      <div className="space-y-1">
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>0%</span>
          <span>Umbral: {threshold}%</span>
          <span>Crítico: {threshold * 2}%</span>
        </div>
        
        <div className="relative">
          <Progress 
            value={getProgressValue()} 
            className="h-2"
          />
          <div 
            className="absolute top-0 h-2 border-r-2 border-orange-400"
            style={{ left: `${(threshold / (threshold * 2)) * 100}%` }}
          />
        </div>
      </div>

      {exceedsThreshold && (
        <div className="text-xs text-orange-700 bg-orange-50 p-2 rounded">
          ⚠️ La diferencia excede el umbral permitido de {threshold}%
          {severity === 'critical' && ' - Requiere verificación adicional'}
        </div>
      )}
    </div>
  );
};