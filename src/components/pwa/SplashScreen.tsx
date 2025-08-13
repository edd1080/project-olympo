
import React from 'react';

interface SplashScreenProps {
  isVisible: boolean;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ isVisible }) => {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-br from-background to-primary/5">
      {/* Logo Container */}
      <div className="relative">
        <div className="w-24 h-24 bg-white rounded-2xl flex items-center justify-center shadow-lg p-2">
          <img 
            src="https://i.ibb.co/mrQWTRNN/creditoproductivo.png"
            alt="Créditos Productivos Logo"
            className="w-full h-full object-contain"
          />
        </div>
        
        {/* Pulse animation ring */}
        <div className="absolute inset-0 w-24 h-24 border-2 border-primary/30 rounded-2xl animate-ping"></div>
      </div>
    </div>
  );
};

export default SplashScreen;
