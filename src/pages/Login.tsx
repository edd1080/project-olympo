
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
        <div className="text-center">
          <h1 className="text-4xl font-bold text-primary">CreditFlow</h1>
          <p className="mt-2 text-muted-foreground">Portal de Agentes</p>
        </div>
        
        <div className="bg-card p-6 rounded-lg border border-border shadow-sm">
          <h2 className="text-xl font-semibold mb-6 text-card-foreground">Iniciar Sesión</h2>
          <LoginForm />
        </div>
        
        <div className="text-center text-sm text-muted-foreground">
          <p>© 2025 CreditFlow. Todos los derechos reservados.</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
