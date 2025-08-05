import React, { createContext, useContext, useState, ReactNode } from 'react';

export type AppTab = 'prospectos' | 'solicitudes' | 'alertas' | 'ajustes';

export interface Prospect {
  id: string;
  name: string;
  phone: string;
  location: string;
  status: 'nuevo' | 'contactado' | 'calificado' | 'convertido';
  lastContact: string;
  notes?: string;
}

export interface Application {
  id: string;
  clientName: string;
  product: string;
  amount: string;
  status: 'draft' | 'active' | 'pending' | 'approved' | 'rejected';
  date: string;
  progress: number;
  stage: string;
  type?: 'legacy' | 'oficial';
  kycData?: {
    cui: string;
    firstName: string;
    lastName: string;
    birthDate: string;
    gender: string;
    address: string;
  };
}

export interface Alert {
  id: number;
  title: string;
  description: string;
  date: string;
  read: boolean;
  group: 'today' | 'yesterday' | 'earlier';
  applicationId?: string;
}

interface AppStateContextType {
  // Current app state
  currentTab: AppTab;
  setCurrentTab: (tab: AppTab) => void;
  currentRoute: string;
  setCurrentRoute: (route: string) => void;
  
  // Data collections
  prospects: Prospect[];
  setProspects: (prospects: Prospect[]) => void;
  applications: Application[];
  setApplications: (applications: Application[]) => void;
  alerts: Alert[];
  setAlerts: (alerts: Alert[]) => void;
  
  // Actions
  addProspect: (prospect: Prospect) => void;
  addApplication: (application: Application) => void;
  addApplicationFromKYC: (kycData: { cui: string; firstName: string; lastName: string; birthDate: string; gender: string; address: string; }) => string;
  addAlert: (alert: Alert) => void;
  markAlertAsRead: (alertId: number) => void;
  navigateToApplication: (applicationId: string) => void;
}

const AppStateContext = createContext<AppStateContextType | undefined>(undefined);

export const useAppState = () => {
  const context = useContext(AppStateContext);
  if (context === undefined) {
    throw new Error('useAppState must be used within an AppStateProvider');
  }
  return context;
};

interface AppStateProviderProps {
  children: ReactNode;
}

export const AppStateProvider: React.FC<AppStateProviderProps> = ({ children }) => {
  const [currentTab, setCurrentTab] = useState<AppTab>('solicitudes');
  const [currentRoute, setCurrentRoute] = useState<string>('/applications');
  
  // Mock initial data
  const [prospects, setProspects] = useState<Prospect[]>([
    {
      id: 'PROS_001',
      name: 'Juan Carlos Pérez',
      phone: '+502 1234-5678',
      location: 'Guatemala, Guatemala',
      status: 'nuevo',
      lastContact: '2025-01-15',
      notes: 'Interesado en crédito personal'
    }
  ]);

  const [applications, setApplications] = useState<Application[]>([
    {
      id: 'SCO_789012',
      clientName: 'Ana García Méndez',
      product: 'Crédito Personal',
      amount: '$25,000',
      status: 'active',
      date: '2025-04-07',
      progress: 2,
      stage: 'Información Financiera'
    }
  ]);

  const [alerts, setAlerts] = useState<Alert[]>([
    {
      id: 845520,
      title: 'Rechazo de Documento',
      description: 'Trámite: BVM_845520 de EDGAR CALDERON ha sido rechazado por verificación de documentos.',
      date: '2025-04-08 14:23',
      read: false,
      group: 'today',
      applicationId: 'BVM_845520'
    },
    {
      id: 845521,
      title: 'Aprobación de Documentos',
      description: 'Trámite: BVM_845521 de CARLOS LÓPEZ ha sido aprobado por verificación de documentos.',
      date: '2025-04-08 10:45',
      read: false,
      group: 'today',
      applicationId: 'BVM_845521'
    }
  ]);

  const addProspect = (prospect: Prospect) => {
    setProspects(prev => [...prev, prospect]);
  };

  const addApplication = (application: Application) => {
    setApplications(prev => [...prev, application]);
  };

  const addApplicationFromKYC = (kycData: { cui: string; firstName: string; lastName: string; birthDate: string; gender: string; address: string; }) => {
    const newId = `SCO_${Date.now().toString().slice(-6)}`;
    const newApplication: Application = {
      id: newId,
      clientName: `${kycData.firstName} ${kycData.lastName}`,
      product: 'Crédito Oficial',
      amount: 'Por definir',
      status: 'draft',
      date: new Date().toISOString().split('T')[0],
      progress: 1,
      stage: 'Identificación y Contacto',
      type: 'oficial',
      kycData
    };
    setApplications(prev => [...prev, newApplication]);
    return newId;
  };

  const addAlert = (alert: Alert) => {
    setAlerts(prev => [alert, ...prev]);
  };

  const markAlertAsRead = (alertId: number) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === alertId ? { ...alert, read: true } : alert
    ));
  };

  const navigateToApplication = (applicationId: string) => {
    setCurrentRoute(`/applications/${applicationId}`);
    setCurrentTab('solicitudes');
  };

  const value: AppStateContextType = {
    currentTab,
    setCurrentTab,
    currentRoute,
    setCurrentRoute,
    prospects,
    setProspects,
    applications,
    setApplications,
    alerts,
    setAlerts,
    addProspect,
    addApplication,
    addApplicationFromKYC,
    addAlert,
    markAlertAsRead,
    navigateToApplication
  };

  return (
    <AppStateContext.Provider value={value}>
      {children}
    </AppStateContext.Provider>
  );
};