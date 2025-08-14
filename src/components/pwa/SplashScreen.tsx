
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
            className="w-full h-full object-cover"
          />
        </div>
        
        {/* Pulse animation ring */}
        <div className="absolute inset-0 w-24 h-24 border-2 border-primary/30 rounded-2xl animate-ping"></div>
      </div>

    </div>
  );
};

export default SplashScreen;
