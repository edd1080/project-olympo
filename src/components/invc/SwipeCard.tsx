import React, { useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Check, X, Lock } from "lucide-react";

export type SwipeStatus = "pending" | "confirmed" | "mismatch" | "blocked";

interface SwipeCardProps {
  title: string;
  subtitle?: string;
  status: SwipeStatus;
  onSwipeRight: () => void;
  onSwipeLeft: () => void;
  children?: React.ReactNode;
  disabledRight?: boolean;
}

const statusBadge = (status: SwipeStatus) => {
  switch (status) {
    case "confirmed":
      return (
        <Badge variant="outline" className="bg-success/10 text-success border-success inline-flex items-center gap-1">
          <Check className="h-3 w-3" /> Confirmado
        </Badge>
      );
    case "mismatch":
      return (
        <Badge variant="outline" className="bg-warning/10 text-warning border-warning inline-flex items-center gap-1">
          <X className="h-3 w-3" /> No coincide
        </Badge>
      );
    case "blocked":
      return (
        <Badge variant="outline" className="bg-warning/10 text-warning border-warning inline-flex items-center gap-1">
          <Lock className="h-3 w-3" /> Bloqueado
        </Badge>
      );
    default:
      return (
        <Badge variant="outline" className="bg-warning/10 text-warning border-warning">
          Pendiente
        </Badge>
      );
  }
};

export default function SwipeCard({ title, subtitle, status, onSwipeLeft, onSwipeRight, children, disabledRight }: SwipeCardProps) {
  const startX = useRef<number | null>(null);
  const [deltaX, setDeltaX] = useState(0);

  const handleTouchStart = (e: React.TouchEvent) => {
    startX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (startX.current === null) return;
    const currentX = e.touches[0].clientX;
    const dX = currentX - startX.current;
    setDeltaX(dX);
  };

  const reset = () => setDeltaX(0);

  const handleTouchEnd = () => {
    const threshold = 60; // px
    if (deltaX > threshold && !disabledRight && status !== "blocked") {
      onSwipeRight();
    } else if (deltaX < -threshold) {
      onSwipeLeft();
    }
    reset();
    startX.current = null;
  };

  return (
    <Card
      className={cn(
        "overflow-hidden transition-shadow request-card",
        deltaX > 0 ? "ring-1 ring-success/40" : deltaX < 0 ? "ring-1 ring-destructive/40" : ""
      )}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-base">{title}</CardTitle>
            {subtitle && (
              <p className="text-sm text-muted-foreground">{subtitle}</p>
            )}
          </div>
          {statusBadge(status)}
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        {children}
      </CardContent>
    </Card>
  );
}
