import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { CalendarIcon, Check, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PresenceCardProps {
  onPresenceUpdate: (found: boolean, rescheduleDate?: Date) => void;
  initialFound?: boolean;
  initialRescheduleDate?: Date;
  className?: string;
}

export default function PresenceCard({
  onPresenceUpdate,
  initialFound = true,
  initialRescheduleDate,
  className
}: PresenceCardProps) {
  const [found, setFound] = useState(initialFound);
  const [rescheduleDate, setRescheduleDate] = useState<Date | undefined>(initialRescheduleDate);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  const handleFoundChange = (newFound: boolean) => {
    setFound(newFound);
    if (newFound) {
      setRescheduleDate(undefined);
      onPresenceUpdate(newFound);
    } else {
      onPresenceUpdate(newFound, rescheduleDate);
    }
  };

  const handleRescheduleChange = (date: Date | undefined) => {
    setRescheduleDate(date);
    setIsCalendarOpen(false);
    onPresenceUpdate(found, date);
  };

  const getStatusBadge = () => {
    if (found) {
      return (
        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400">
          <Check className="h-3 w-3 mr-1" />
          Presente
        </Badge>
      );
    } else if (rescheduleDate) {
      return (
        <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-900/20 dark:text-orange-400">
          <Clock className="h-3 w-3 mr-1" />
          Reprogramado
        </Badge>
      );
    } else {
      return (
        <Badge variant="outline" className="bg-orange-50 text-orange-600 border-orange-200 dark:bg-orange-900/20 dark:text-orange-400">
          Ausente
        </Badge>
      );
    }
  };

  const isComplete = found || (!found && rescheduleDate);

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-base">Estoy en sitio</CardTitle>
            <p className="text-sm text-muted-foreground">
              Confirmar presencia o reprogramar
            </p>
          </div>
          {getStatusBadge()}
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="space-y-4">
          {/* Found toggle */}
          <div className="flex items-center justify-between">
            <Label htmlFor="found-toggle" className="text-sm">
              ¿Encontró a la persona?
            </Label>
            <Switch
              id="found-toggle"
              checked={found}
              onCheckedChange={handleFoundChange}
            />
          </div>

          {/* Reschedule section - only show if not found */}
          {!found && (
            <div className="space-y-2">
              <Label className="text-sm text-muted-foreground">
                Fecha de reprogramación:
              </Label>
              <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !rescheduleDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {rescheduleDate ? (
                      format(rescheduleDate, "PPP", { locale: es })
                    ) : (
                      "Seleccionar fecha"
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={rescheduleDate}
                    onSelect={handleRescheduleChange}
                    disabled={(date) => date < new Date()}
                    initialFocus
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
              
              {!rescheduleDate && (
                <p className="text-xs text-destructive">
                  Debe seleccionar una fecha de reprogramación
                </p>
              )}
            </div>
          )}

          {/* Status indicator */}
          <div className="pt-2 border-t">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>Estado:</span>
              <span className={cn(
                "font-medium",
                isComplete ? "text-success" : "text-destructive"
              )}>
                {isComplete ? "Completo" : "Pendiente"}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}