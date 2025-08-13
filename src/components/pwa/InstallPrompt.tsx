import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Download, X, Smartphone } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

interface InstallPromptProps {
  onDismiss?: () => void;
}

const InstallPrompt: React.FC<InstallPromptProps> = ({ onDismiss }) => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    // Check if app is already installed (standalone mode)
    const checkStandalone = () => {
      return window.matchMedia('(display-mode: standalone)').matches || 
             (window.navigator as any).standalone === true;
    };

    // Check if it's iOS
    const checkIOS = () => {
      return /iPad|iPhone|iPod/.test(navigator.userAgent);
    };

    setIsStandalone(checkStandalone());
    setIsIOS(checkIOS());

    // Only show prompt if not already installed
    if (!checkStandalone()) {
      if (checkIOS()) {
        // For iOS, show manual install instructions after a delay
        const timer = setTimeout(() => {
          const dismissed = localStorage.getItem('pwa-install-dismissed');
          if (!dismissed) {
            setShowPrompt(true);
          }
        }, 5000);
        return () => clearTimeout(timer);
      } else {
        // For Android/Chrome, listen for beforeinstallprompt
        const handleBeforeInstallPrompt = (e: Event) => {
          e.preventDefault();
          setDeferredPrompt(e as BeforeInstallPromptEvent);
          
          const dismissed = localStorage.getItem('pwa-install-dismissed');
          if (!dismissed) {
            setShowPrompt(true);
          }
        };

        window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      }
    }
  }, []);

  const handleInstall = async () => {
    if (!isIOS && deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      
      if (outcome === 'accepted') {
        setDeferredPrompt(null);
        setShowPrompt(false);
      }
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    localStorage.setItem('pwa-install-dismissed', 'true');
    onDismiss?.();
  };

  // Don't show if already installed or dismissed
  if (!showPrompt || isStandalone) {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 animate-fade-in">
      <Card className="border-primary/20 shadow-lg bg-background/95 backdrop-blur">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
              {isIOS ? (
                <Smartphone size={20} className="text-primary" />
              ) : (
                <Download size={20} className="text-primary" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-sm text-foreground">
                Instalar Créditos Productivos
              </h3>
              {isIOS ? (
                <div className="space-y-2 mt-2">
                  <p className="text-xs text-muted-foreground">
                    Para instalar la aplicación en tu iPhone:
                  </p>
                  <ol className="text-xs text-muted-foreground space-y-1 list-decimal list-inside">
                    <li>Toca el botón de compartir en Safari</li>
                    <li>Selecciona "Añadir a pantalla de inicio"</li>
                    <li>Toca "Añadir" para confirmar</li>
                  </ol>
                </div>
              ) : (
                <p className="text-xs text-muted-foreground mt-1">
                  Instala la aplicación para acceso rápido y experiencia mejorada
                </p>
              )}
            </div>
            <div className="flex gap-2 flex-shrink-0">
              {!isIOS && (
                <Button size="sm" onClick={handleInstall} className="h-8 text-xs">
                  Instalar
                </Button>
              )}
              <Button 
                size="sm" 
                variant="ghost" 
                onClick={handleDismiss} 
                className="h-8 w-8 p-0"
              >
                <X size={14} />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default InstallPrompt;