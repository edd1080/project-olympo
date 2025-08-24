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
        {[...Array(100)].map((_, i) => {
          const colors = [
            'hsl(var(--primary))',
            'hsl(var(--accent))', 
            'hsl(330, 70%, 60%)', // Pink
            'hsl(270, 70%, 60%)', // Purple
            'hsl(200, 70%, 60%)', // Blue
            'hsl(120, 70%, 60%)', // Green
            'hsl(45, 70%, 60%)',  // Yellow
            'hsl(15, 70%, 60%)',  // Orange
          ];
          
          const shapes = ['confetti-rectangle', 'confetti-circle', 'confetti-triangle'];
          const shape = shapes[Math.floor(Math.random() * shapes.length)];
          const color = colors[Math.floor(Math.random() * colors.length)];
          const size = 4 + Math.random() * 8; // 4px to 12px
          const duration = 2 + Math.random() * 4; // 2s to 6s
          const delay = Math.random() * 3; // 0s to 3s delay
          const driftStart = (Math.random() - 0.5) * 100; // -50px to 50px
          const driftMid = (Math.random() - 0.5) * 150;
          const driftCenter = (Math.random() - 0.5) * 100;
          const driftEnd = (Math.random() - 0.5) * 120;
          const driftFinal = (Math.random() - 0.5) * 80;
          
          return (
            <div
              key={i}
              className={`confetti-piece ${shape}`}
              style={{
                left: `${Math.random() * 100}%`,
                '--confetti-size': `${size}px`,
                '--confetti-height': `${shape === 'confetti-triangle' ? size * 1.2 : size}px`,
                '--confetti-color': color,
                '--triangle-size': `${size * 0.6}px`,
                '--duration': `${duration}s`,
                '--delay': `${delay}s`,
                '--drift-start': `${driftStart}px`,
                '--drift-mid': `${driftMid}px`,
                '--drift-center': `${driftCenter}px`,
                '--drift-end': `${driftEnd}px`,
                '--drift-final': `${driftFinal}px`,
                backgroundColor: shape !== 'confetti-triangle' ? color : 'transparent',
                borderBottomColor: shape === 'confetti-triangle' ? color : 'transparent',
              } as React.CSSProperties}
            />
          );
        })}
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

        <div className="animate-fade-in pt-4 space-y-3">
          {applicationId && (
            <Button 
              onClick={() => navigate(`/applications/${applicationId}/guarantors/new`)}
              size="lg"
              className="w-full"
              variant="outline"
            >
              Agregar fiadores ahora
            </Button>
          )}
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