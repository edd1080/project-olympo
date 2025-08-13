import React from 'react';
import { INVCSection } from '@/types/invc-comparison';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, Clock, AlertCircle, XCircle, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SectionAccordionProps {
  section: INVCSection;
  children: React.ReactNode;
  isOpen?: boolean;
  onToggle?: () => void;
  className?: string;
}

export const SectionAccordion: React.FC<SectionAccordionProps> = ({
  section,
  children,
  isOpen = false,
  onToggle,
  className
}) => {
  const getStatusIcon = () => {
    switch (section.status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-emerald-600" />;
      case 'in_progress':
        return <Clock className="w-5 h-5 text-blue-600" />;
      case 'blocked':
        return <XCircle className="w-5 h-5 text-red-600" />;
      default:
        return <AlertCircle className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusBadge = () => {
    switch (section.status) {
      case 'completed':
        return (
          <Badge variant="default" className="bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-50">
            <CheckCircle className="w-3 h-3 mr-1" />
            Completado
          </Badge>
        );
      case 'in_progress':
        return (
          <Badge variant="secondary" className="bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-50">
            <Clock className="w-3 h-3 mr-1" />
            En progreso
          </Badge>
        );
      case 'blocked':
        return (
          <Badge variant="destructive" className="bg-red-50 text-red-700 border-red-200 hover:bg-red-50">
            <XCircle className="w-3 h-3 mr-1" />
            Bloqueado
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="text-muted-foreground">
            <AlertCircle className="w-3 h-3 mr-1" />
            Pendiente
          </Badge>
        );
    }
  };

  const getProgressColor = () => {
    if (section.progress.percentage === 100) return 'bg-emerald-500';
    if (section.progress.percentage > 0) return 'bg-blue-500';
    return 'bg-gray-300';
  };

  return (
    <Accordion 
      type="single" 
      value={isOpen ? section.id : ''}
      onValueChange={() => onToggle?.()}
      className={cn("w-full", className)}
    >
      <AccordionItem 
        value={section.id}
        className={cn(
          "border rounded-lg px-1 transition-all duration-200",
          section.status === 'completed' && "border-emerald-200 bg-emerald-50/30",
          section.status === 'in_progress' && "border-blue-200 bg-blue-50/30",
          section.status === 'blocked' && "border-red-200 bg-red-50/30",
          section.status === 'pending' && "border-gray-200"
        )}
      >
        <AccordionTrigger 
          className="px-4 py-3 hover:no-underline"
          onClick={(e) => {
            e.preventDefault();
            onToggle?.();
          }}
        >
          <div className="flex items-center justify-between w-full">
            {/* Lado izquierdo - Título y descripción */}
            <div className="flex items-center gap-3">
              {getStatusIcon()}
              <div className="text-left">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-sm">{section.title}</h3>
                  {section.required && (
                    <Badge variant="outline" className="text-xs py-0 px-1">
                      Requerido
                    </Badge>
                  )}
                </div>
                {section.description && (
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {section.description}
                  </p>
                )}
              </div>
            </div>

            {/* Lado derecho - Progreso y status */}
            <div className="flex items-center gap-3">
              {/* Progreso numérico */}
              <div className="text-right">
                <div className="text-xs font-medium">
                  {section.progress.completed}/{section.progress.total}
                </div>
                <div className="text-xs text-muted-foreground">
                  {section.progress.percentage}%
                </div>
              </div>

              {/* Barra de progreso */}
              <div className="w-16">
                <Progress 
                  value={section.progress.percentage} 
                  className="h-2"
                />
              </div>

              {/* Badge de status */}
              {getStatusBadge()}

              {/* Icono de expansión */}
              <ChevronRight 
                className={cn(
                  "w-4 h-4 text-muted-foreground transition-transform duration-200",
                  isOpen && "rotate-90"
                )}
              />
            </div>
          </div>
        </AccordionTrigger>

        <AccordionContent className="px-4 pb-4 pt-2">
          {/* Línea divisoria sutil */}
          <div className="border-t border-gray-100 mb-4" />
          
          {/* Contenido de la sección */}
          <div className="space-y-4">
            {children}
          </div>

          {/* Footer con información adicional si está bloqueada */}
          {section.status === 'blocked' && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
              <div className="flex items-center gap-2">
                <XCircle className="w-4 h-4 text-red-600" />
                <span className="text-sm font-medium text-red-700">
                  Sección bloqueada
                </span>
              </div>
              <p className="text-xs text-red-600 mt-1">
                Esta sección requiere resolución antes de continuar.
              </p>
            </div>
          )}

          {/* Footer con información de completado */}
          {section.status === 'completed' && (
            <div className="mt-4 p-3 bg-emerald-50 border border-emerald-200 rounded-md">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600" />
                <span className="text-sm font-medium text-emerald-700">
                  Sección completada
                </span>
              </div>
              <p className="text-xs text-emerald-600 mt-1">
                Todos los campos han sido verificados y confirmados.
              </p>
            </div>
          )}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};