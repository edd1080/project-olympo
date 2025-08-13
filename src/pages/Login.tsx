import React from 'react';
import { useNavigate } from 'react-router-dom';
import LoginForm from '@/components/auth/LoginForm';
import ThemeToggle from '@/components/ui/ThemeToggle';
import { Button } from '@/components/ui/button';
import { Zap, User, UserCheck } from 'lucide-react';
import { useUser } from '@/context/UserContext';
const Login = () => {
  const navigate = useNavigate();
  const { loginAsAgent, loginAsManager } = useUser();

  const handleAgentAccess = () => {
    loginAsAgent();
    navigate('/');
  };

  const handleManagerAccess = () => {
    loginAsManager();
    navigate('/manager/invc');
  };

  return <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-b from-background to-background/95">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      
      <div className="w-full max-w-md space-y-8 animate-fade-in">
        <div className="text-center space-y-4">
          <img src="https://i.ibb.co/mrQWTRNN/creditoproductivo.png" alt="Crédito Productivo" className="h-28 mx-auto" />
          
        </div>
        
        <LoginForm />
        
        {/* Development Access Buttons */}
        <div className="space-y-2">
          <Button 
            variant="outline" 
            className="w-full flex items-center justify-center gap-2 border-dashed" 
            onClick={handleAgentAccess}
          >
            <User className="h-4 w-4" />
            Acceso Agente (Dev)
          </Button>
          <Button 
            variant="outline" 
            className="w-full flex items-center justify-center gap-2 border-dashed" 
            onClick={handleManagerAccess}
          >
            <UserCheck className="h-4 w-4" />
            Acceso Gerente (Dev)
          </Button>
        </div>
        
        <div className="text-center text-xs text-muted-foreground">
          <p>© 2025 Crédito Productivo. Todos los derechos reservados.</p>
        </div>
      </div>
    </div>;
};
export default Login;