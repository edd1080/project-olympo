
import React from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface Alert {
  id: number;
  title: string;
  description: string;
  date: string;
  read: boolean;
}

interface AlertGroupProps {
  title: string;
  alerts: Alert[];
}

const AlertGroup = ({ title, alerts }: AlertGroupProps) => {
  const [isOpen, setIsOpen] = React.useState(true);

  return (
    <div className="mb-4">
      <h3 className="text-lg font-medium mb-2">{title}</h3>
      {alerts.map((alert) => (
        <Collapsible
          key={alert.id}
          open={isOpen}
          onOpenChange={setIsOpen}
          className="mb-2 bg-card rounded-lg border"
        >
          <CollapsibleTrigger className="flex items-center justify-between w-full p-3">
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${!alert.read ? 'bg-primary' : 'bg-muted'}`} />
              <span className="font-medium">Trámite BMV_{alert.id}</span>
            </div>
            {isOpen ? (
              <ChevronUp className="h-4 w-4 text-muted-foreground" />
            ) : (
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            )}
          </CollapsibleTrigger>
          <CollapsibleContent>
            <div className="p-4 pt-0">
              <div className="flex justify-between text-sm text-muted-foreground mb-2">
                <span>
                  {format(new Date(alert.date), "d MMM, yyyy", { locale: es })}
                </span>
                <span>{format(new Date(alert.date), "H:mm")}</span>
              </div>
              <h4 className="font-medium mb-1">{alert.title}</h4>
              <p className="text-muted-foreground">{alert.description}</p>
            </div>
          </CollapsibleContent>
        </Collapsible>
      ))}
    </div>
  );
};

export default AlertGroup;
