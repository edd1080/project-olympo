import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Header from "@/components/layout/Header";
import BottomNavigation from "@/components/layout/BottomNavigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import SwipeCard, { SwipeStatus } from "@/components/invc/SwipeCard";
import { Camera, Check, FileWarning, Flag, MapPin } from "lucide-react";

interface Step {
  id: string;
  title: string;
  subtitle?: string;
  status: SwipeStatus;
  requiresPhoto?: boolean;
}

const STORAGE_PREFIX = "invc_state_";

export default function InvestigationFlow() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [steps, setSteps] = useState<Step[]>([]);
  const [openSheet, setOpenSheet] = useState<null | string>(null);
  const [mismatchComment, setMismatchComment] = useState("");
  const [reviewOpen, setReviewOpen] = useState(false);

  // Load/Save local state (offline-first)
  useEffect(() => {
    const key = STORAGE_PREFIX + id;
    const raw = localStorage.getItem(key);
    if (raw) {
      try {
        const parsed = JSON.parse(raw) as Step[];
        setSteps(parsed);
        return;
      } catch {}
    }
    // Default steps
    setSteps([
      { id: "onsite", title: "Estoy en sitio", subtitle: "Confirmar presencia o reprogramar", status: "pending" },
      { id: "photo_business", title: "Foto del negocio/vivienda", subtitle: "Con geotag", status: "pending", requiresPhoto: true },
      { id: "photo_applicant", title: "Foto del solicitante", subtitle: "Con geotag", status: "pending", requiresPhoto: true },
      { id: "personal_info", title: "Información personal", subtitle: "Nombre, DPI y contactos", status: "pending" },
      { id: "economic_activity", title: "Actividad económica", subtitle: "¿Activa?", status: "pending" },
    ]);
  }, [id]);

  useEffect(() => {
    const key = STORAGE_PREFIX + id;
    localStorage.setItem(key, JSON.stringify(steps));
  }, [steps, id]);

  const total = steps.length || 1;
  const confirmed = steps.filter((s) => s.status === "confirmed").length;
  const mismatches = steps.filter((s) => s.status === "mismatch").length;
  const progressValue = Math.round((confirmed / total) * 100);

  const setStatus = (stepId: string, status: SwipeStatus) => {
    setSteps((prev) => prev.map((s) => (s.id === stepId ? { ...s, status } : s)));
  };

  const currentDiscrepancies = useMemo(
    () => steps.filter((s) => s.status === "mismatch" || s.status === "blocked"),
    [steps]
  );

  const handleOpenSheet = (stepId: string) => {
    setOpenSheet(stepId);
    setMismatchComment("");
  };

  const saveMismatch = () => {
    if (!openSheet || !mismatchComment.trim()) {
      toast({ variant: "warning", title: "Comentario requerido", description: "Agrega un comentario para registrar la discrepancia." });
      return;
    }
    setStatus(openSheet, "mismatch");
    setOpenSheet(null);
    toast({ variant: "default", title: "Discrepancia registrada", description: "Puedes revisarla en la revisión final." });
  };

  const confirmFinal = () => {
    setReviewOpen(false);
    toast({ variant: "success", title: "INVC completado", description: `Se registró la investigación para ${id}.` });
    navigate(`/applications/${id}`);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="mobile-container py-4">
        <header className="mb-4">
          <h1 className="text-title">Investigación de Campo</h1>
          <p className="text-muted-foreground">Solicitud {id}</p>
        </header>

        <Card className="mb-4">
          <CardContent className="pt-4">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="text-xs inline-flex items-center gap-1">
                  <MapPin className="h-3 w-3" /> Geotag
                </Badge>
                <Badge variant="secondary" className="text-xs inline-flex items-center gap-1">
                  <Camera className="h-3 w-3" /> Fotos {Math.min(2, confirmed)}/2
                </Badge>
                <Badge variant="secondary" className="text-xs inline-flex items-center gap-1">
                  <Flag className="h-3 w-3" /> Discrepancias {mismatches}
                </Badge>
              </div>
              <div className="flex-1 max-w-[40%]">
                <Progress value={progressValue} className="h-2" />
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-3">
          {steps.map((s) => (
            <SwipeCard
              key={s.id}
              title={s.title}
              subtitle={s.subtitle}
              status={s.status}
              disabledRight={s.status === "blocked"}
              onSwipeRight={() => {
                setStatus(s.id, "confirmed");
                toast({ variant: "success", title: "Confirmado", description: `${s.title} confirmado` });
              }}
              onSwipeLeft={() => handleOpenSheet(s.id)}
            >
              {/* Simple content examples */}
              {s.id === "onsite" && (
                <div className="flex items-center justify-between py-2">
                  <span className="text-sm text-muted-foreground">¿Encontró a la persona?</span>
                  <Badge variant="outline">Marcar con swipe</Badge>
                </div>
              )}
              {s.requiresPhoto && (
                <div className="flex items-center justify-between py-2">
                  <Button variant="outline" size="sm"><Camera className="h-4 w-4 mr-2" />Adjuntar foto</Button>
                  <Badge variant="secondary">Geotag pendiente</Badge>
                </div>
              )}
            </SwipeCard>
          ))}
        </div>

        {/* Sticky footer */}
        <div className="h-20" />
        <div className="fixed inset-x-0 bottom-0 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 p-3">
          <div className="mobile-container flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="inline-flex items-center gap-1"><Check className="h-3 w-3" /> {confirmed}/{total}</Badge>
              {mismatches > 0 && (
                <Badge variant="outline" className="inline-flex items-center gap-1"><FileWarning className="h-3 w-3" /> {mismatches} discrep.</Badge>
              )}
            </div>
            <Button onClick={() => setReviewOpen(true)} disabled={confirmed === 0}>Revisión final</Button>
          </div>
        </div>
      </main>

      <BottomNavigation />

      {/* Bottom sheet for mismatches */}
      <Drawer open={!!openSheet} onOpenChange={(o) => !o && setOpenSheet(null)}>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Registrar discrepancia</DrawerTitle>
          </DrawerHeader>
          <div className="px-4 pb-2">
            <Textarea
              value={mismatchComment}
              onChange={(e) => setMismatchComment(e.target.value)}
              placeholder="Describe brevemente la discrepancia"
            />
          </div>
          <DrawerFooter>
            <Button onClick={saveMismatch} variant="destructive">Guardar discrepancia</Button>
            <Button variant="outline" onClick={() => setOpenSheet(null)}>Cancelar</Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>

      {/* Review dialog */}
      <Dialog open={reviewOpen} onOpenChange={setReviewOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Revisión final</DialogTitle>
            <DialogDescription>
              Revisa discrepancias abiertas antes de confirmar.
            </DialogDescription>
          </DialogHeader>

          {currentDiscrepancies.length === 0 ? (
            <p className="text-sm text-muted-foreground">No hay discrepancias. Puedes confirmar.</p>
          ) : (
            <div className="space-y-2">
              {currentDiscrepancies.map((d) => (
                <div key={d.id} className="flex items-center justify-between text-sm">
                  <span>{d.title}</span>
                  <Badge variant="outline">{d.status}</Badge>
                </div>
              ))}
            </div>
          )}

          <DialogFooter>
            <Button onClick={confirmFinal} disabled={currentDiscrepancies.some((d) => d.status === "blocked")}>Confirmar</Button>
            <Button variant="outline" onClick={() => setReviewOpen(false)}>Cerrar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
