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
import { useInvestigation } from "@/context/InvestigationContext";
import { useUser } from "@/context/UserContext";
import SwipeCard, { SwipeStatus } from "@/components/invc/SwipeCard";
import PhotoEvidenceCard from "@/components/invc/PhotoEvidenceCard";
import PresenceCard from "@/components/invc/PresenceCard";
import TutorialModal from "@/components/invc/TutorialModal";
import DynamicStatusChip from "@/components/invc/DynamicStatusChip";
import { ComparisonView } from "@/components/invc/comparison/ComparisonView";
import { ComparisonProvider } from "@/context/ComparisonContext";
import { Camera, Check, FileWarning, Flag, MapPin, X, AlertTriangle, ArrowLeft } from "lucide-react";

export default function InvestigationFlow() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useUser();
  const {
    getInvestigation,
    updateCardStatus,
    addCardComment,
    initializeInvestigation,
    completeInvestigation,
    getProgress,
    getDiscrepancies,
    setPresence
  } = useInvestigation();

  const [openSheet, setOpenSheet] = useState<null | string>(null);
  const [mismatchComment, setMismatchComment] = useState("");
  const [reviewOpen, setReviewOpen] = useState(false);
  const [showTutorial, setShowTutorial] = useState(false);
  const [showExitDialog, setShowExitDialog] = useState(false);

  // Initialize investigation on mount
  useEffect(() => {
    if (id) {
      initializeInvestigation(id);
      // Show tutorial if first time
      const tutorialCompleted = localStorage.getItem('invc_tutorial_completed');
      if (!tutorialCompleted) {
        setShowTutorial(true);
      }
    }
  }, [id, initializeInvestigation]);

  const investigation = id ? getInvestigation(id) : null;
  const progress = id ? getProgress(id) : { completed: 0, total: 0, percentage: 0 };
  const discrepancies = id ? getDiscrepancies(id) : { count: 0, critical: 0 };

  const currentDiscrepancies = useMemo(
    () => investigation?.cards.filter((s) => s.status === "mismatch" || s.status === "blocked") || [],
    [investigation?.cards]
  );

  const handleOpenSheet = (cardId: string) => {
    setOpenSheet(cardId);
    setMismatchComment("");
  };

  const saveMismatch = () => {
    if (!openSheet || !mismatchComment.trim() || !id) {
      toast({ variant: "warning", title: "Comentario requerido", description: "Agrega un comentario para registrar la discrepancia." });
      return;
    }
    updateCardStatus(id, openSheet, "mismatch");
    addCardComment(id, openSheet, mismatchComment);
    setOpenSheet(null);
    toast({ variant: "default", title: "Discrepancia registrada", description: "Puedes revisarla en la revisión final." });
  };

  const confirmFinal = () => {
    if (!id) return;
    completeInvestigation(id);
    setReviewOpen(false);
    toast({ variant: "success", title: "INVC completado", description: `Se registró la investigación para ${id}.` });
    navigate(`/applications/${id}`);
  };

  const handlePresenceUpdate = (found: boolean, rescheduleDate?: Date) => {
    if (!id) return;
    setPresence(id, found, rescheduleDate);
    updateCardStatus(id, "onsite", found ? "confirmed" : "mismatch");
  };

  const handlePhotoCapture = (cardId: string, photoUrl: string, geoTag?: any) => {
    if (!id) return;
    updateCardStatus(id, cardId, "confirmed");
    toast({ variant: "success", title: "Foto capturada", description: "Evidencia guardada correctamente" });
  };

  const handleExitInvestigation = () => {
    setShowExitDialog(false);
    navigate('/manager/invc');
  };

  const confirmExit = () => {
    setShowExitDialog(true);
  };

  // Calculate geotag status
  const geotagStatus = useMemo(() => {
    if (!investigation) return 'pending';
    const geoValid = investigation.geoValidation?.isValid;
    return geoValid ? 'completed' : 'pending';
  }, [investigation?.geoValidation]);

  // Calculate photo status  
  const photoStatus = useMemo(() => {
    if (!investigation) return { completed: 0, total: 2 };
    const photoCards = investigation.cards.filter(card => card.requiresPhoto);
    const completedPhotos = photoCards.filter(card => card.status === 'confirmed').length;
    return { completed: completedPhotos, total: photoCards.length };
  }, [investigation?.cards]);

  // Si el usuario es manager, mostrar vista de comparación
  const isManager = user?.role === 'manager';

  if (isManager) {
    return (
      <ComparisonProvider>
        <div className="min-h-screen bg-background">
          {/* Header */}
          <div className="bg-background/80 backdrop-blur-sm border-b sticky top-0 z-50">
            <div className="container mx-auto px-4 py-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigate('/manager/invc')}
                    className="gap-2"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Volver
                  </Button>
                  <div>
                    <h1 className="font-semibold">INVC - {id}</h1>
                    <p className="text-sm text-muted-foreground">
                      {investigation?.applicantName || 'Cargando...'}
                    </p>
                  </div>
                </div>
                {investigation && <DynamicStatusChip investigation={investigation} />}
              </div>
            </div>
          </div>

          {/* Comparison View */}
          <div className="container mx-auto px-4 py-6 max-w-6xl">
            <ComparisonView applicationId={id!} />
          </div>
        </div>
      </ComparisonProvider>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Exit button overlay */}
      <div className="absolute top-4 right-4 z-10">
        <Button 
          variant="ghost" 
          size="sm"
          onClick={confirmExit}
          className="rounded-full h-8 w-8 p-0 bg-background/80 backdrop-blur-sm border border-border"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      <main className="mobile-container py-4">
        <header className="mb-4">
          <h1 className="text-title">Investigación de Campo</h1>
          <p className="text-muted-foreground">Solicitud {id}</p>
        </header>

        <Card className="mb-4">
          <CardContent className="pt-4">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 flex-wrap">
                <DynamicStatusChip 
                  type="geotag" 
                  status={geotagStatus}
                />
                <DynamicStatusChip 
                  type="photos" 
                  status={photoStatus.completed === photoStatus.total ? 'completed' : photoStatus.completed > 0 ? 'progress' : 'pending'}
                  value={photoStatus.completed}
                  maxValue={photoStatus.total}
                />
                <DynamicStatusChip 
                  type="discrepancies" 
                  status='pending'
                  value={discrepancies.count}
                />
              </div>
              <div className="flex-1 max-w-[40%]">
                <Progress value={progress.percentage} className="h-2" />
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-3">
          {investigation?.cards.map((card) => {
            // Special handling for specific card types
            if (card.id === "onsite") {
              return (
                <PresenceCard
                  key={card.id}
                  onPresenceUpdate={handlePresenceUpdate}
                  className="mb-3"
                />
              );
            }

            if (card.requiresPhoto) {
              return (
                <PhotoEvidenceCard
                  key={card.id}
                  title={card.title}
                  subtitle={card.subtitle}
                  onPhotoCapture={(photoUrl, geoTag) => handlePhotoCapture(card.id, photoUrl, geoTag)}
                  isRequired={true}
                  className="mb-3"
                />
              );
            }

            // Regular swipe cards for other types
            return (
              <SwipeCard
                key={card.id}
                title={card.title}
                subtitle={card.subtitle}
                status={card.status}
                disabledRight={card.status === "blocked"}
                onSwipeRight={() => {
                  if (!id) return;
                  updateCardStatus(id, card.id, "confirmed");
                  toast({ variant: "success", title: "Confirmado", description: `${card.title} confirmado` });
                }}
                onSwipeLeft={() => handleOpenSheet(card.id)}
              >
                <div className="flex items-center justify-between py-2">
                  <span className="text-sm text-muted-foreground">Desliza para confirmar o marcar discrepancia</span>
                  <Badge variant="outline">Swipe</Badge>
                </div>
              </SwipeCard>
            );
          })}
        </div>

        {/* Sticky footer */}
        <div className="h-20" />
        <div className="fixed inset-x-0 bottom-0 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 p-3">
          <div className="mobile-container flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="bg-info/10 text-info border-info inline-flex items-center gap-1"><Check className="h-3 w-3" /> {progress.completed}/{progress.total}</Badge>
              {discrepancies.count > 0 && (
                <Badge variant="outline" className="inline-flex items-center gap-1"><FileWarning className="h-3 w-3" /> {discrepancies.count} discrep.</Badge>
              )}
            </div>
            <Button onClick={() => setReviewOpen(true)} disabled={progress.completed === 0}>Finalizar INVC</Button>
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

      {/* Exit confirmation dialog */}
      <Dialog open={showExitDialog} onOpenChange={setShowExitDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-warning" />
              ¿Salir de la investigación?
            </DialogTitle>
            <DialogDescription>
              Si sales ahora, el progreso actual se guardará automáticamente y podrás continuar más tarde.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowExitDialog(false)}>
              Continuar investigación
            </Button>
            <Button onClick={handleExitInvestigation} variant="destructive">
              Salir
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Tutorial Modal */}
      <TutorialModal 
        open={showTutorial} 
        onOpenChange={setShowTutorial}
      />
    </div>
  );
}
