
import React from 'react';
// Using public folder image directly

interface SplashScreenProps {
  isVisible: boolean;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ isVisible }) => {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-br from-background to-primary/5">
      {/* Logo/Icon Container */}
      <div className="relative mb-8">
        <div className="w-24 h-24 bg-white rounded-2xl flex items-center justify-center shadow-lg overflow-hidden">
          <img 
            src="/creprologo.jpg" 
            alt="Créditos Productivos Logo" 
            className="w-20 h-20 object-contain"
          />
        </div>
        
        {/* Pulse animation ring */}
        <div className="absolute inset-0 w-24 h-24 border-2 border-primary/30 rounded-2xl animate-ping"></div>
      </div>

      {/* App Name */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Crédito Productivo
        </h1>
      </div>

      {/* Animated Loader */}
      <div className="flex flex-col items-center gap-4">
        <div className="flex space-x-1">
          <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
          <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
        </div>
        <p className="text-sm text-muted-foreground animate-pulse">
          Cargando aplicación...
        </p>
      </div>
    </div>
  );
};

export default SplashScreen;
