import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { CheckCircle } from 'lucide-react';

const ApplicationSubmitted = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const applicationId = location.state?.applicationId;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Confetti Animation */}
      <div className="confetti-container">
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="confetti-piece"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              backgroundColor: `hsl(${Math.random() * 360}, 70%, 60%)`
            }}
          />
        ))}
      </div>

      {/* Main Content */}
      <div className="text-center space-y-6 z-10 max-w-md">
        <div className="animate-scale-in">
          <CheckCircle className="h-20 w-20 text-green-500 mx-auto mb-4" />
        </div>
        
        <div className="animate-fade-in space-y-2">
          <h1 className="text-3xl font-bold text-foreground">
            ¡Solicitud enviada!
          </h1>
          <p className="text-lg text-muted-foreground">
            Felicidades! Has completado y enviado la solicitud correctamente.
          </p>
          {applicationId && (
            <p className="text-sm text-muted-foreground mt-2">
              Código: {applicationId}
            </p>
          )}
        </div>

        <div className="animate-fade-in pt-4">
          <Button 
            onClick={() => navigate('/applications')}
            size="lg"
            className="w-full"
          >
            Regresar a solicitudes
          </Button>
        </div>
      </div>

      {/* Global styles for confetti animation */}
      <div
        className="absolute inset-0"
        style={{
          background: `
            linear-gradient(135deg, 
              hsl(var(--background)) 0%, 
              hsl(var(--secondary) / 0.2) 100%
            )
          `
        }}
      />
    </div>
  );
};

export default ApplicationSubmitted;