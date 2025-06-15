
import React from 'react';
import Header from '@/components/layout/Header';
import BottomNavigation from '@/components/layout/BottomNavigation';
import BreadcrumbNavigation from '@/components/navigation/BreadcrumbNavigation';

const Prospects = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header personName="Usuario" />
      
      <main className="flex-1 container mx-auto px-4 py-6 max-w-5xl">
        <div className="mb-6">
          <BreadcrumbNavigation />
        </div>
        
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold">Prospectos</h1>
            <p className="text-muted-foreground">
              Gestiona tus prospectos de clientes potenciales.
            </p>
          </div>
          
          <div className="bg-white rounded-lg border p-6">
            <p className="text-center text-muted-foreground">
              Funcionalidad de prospectos en desarrollo...
            </p>
          </div>
        </div>
      </main>
      
      <BottomNavigation />
    </div>
  );
};

export default Prospects;
