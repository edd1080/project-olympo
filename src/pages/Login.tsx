
import React from 'react';
import LoginForm from '@/components/auth/LoginForm';
import ThemeToggle from '@/components/ui/ThemeToggle';

const Login = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-b from-background to-background/95">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      
      <div className="w-full max-w-md space-y-8 animate-fade-in">
        <div className="text-center space-y-4">
          <img 
            src="/lovable-uploads/8dd34d0c-75f4-4a26-8704-4969a578b0b4.png" 
            alt="Crédito Productivo" 
            className="h-16 mx-auto"
          />
          <p className="text-muted-foreground">Portal de Agentes</p>
        </div>
        
        <LoginForm />
        
        <div className="text-center text-xs text-muted-foreground">
          <p>© 2025 Crédito Productivo. Todos los derechos reservados.</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
