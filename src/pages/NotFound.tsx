
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import Header from '@/components/layout/Header';
import BottomNavigation from '@/components/layout/BottomNavigation';

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">404</h1>
          <p className="text-xl text-gray-600 mb-4">Oops! Página no encontrada</p>
          <a href="/" className="text-blue-500 hover:text-blue-700 underline">
            Regresar al Inicio
          </a>
        </div>
      </main>
      
      <BottomNavigation />
    </div>
  );
};

export default NotFound;
