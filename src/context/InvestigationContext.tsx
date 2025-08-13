import React, { createContext, useContext, useEffect, useState } from 'react';
import { Investigation, InvestigationState, InvestigationCardState } from '@/types/invc';
import { useUser } from './UserContext';

interface InvestigationContextType {
  getInvestigation: (applicationId: string) => Investigation | null;
  updateCardStatus: (applicationId: string, cardId: string, status: InvestigationCardState['status']) => void;
  addCardComment: (applicationId: string, cardId: string, comment: string) => void;
  setPresence: (applicationId: string, found: boolean, rescheduleDate?: Date) => void;
  updateGeoValidation: (applicationId: string, currentLocation: any, isValid: boolean) => void;
  initializeInvestigation: (applicationId: string) => void;
  completeInvestigation: (applicationId: string) => void;
  getProgress: (applicationId: string) => { completed: number; total: number; percentage: number };
  getDiscrepancies: (applicationId: string) => { count: number; critical: number };
}

const InvestigationContext = createContext<InvestigationContextType | undefined>(undefined);

const STORAGE_KEY = 'invc_investigations';

const defaultCards: InvestigationCardState[] = [
  { id: 'onsite', title: 'Estoy en sitio', subtitle: 'Confirmar presencia o reprogramar', status: 'pending' },
  { id: 'photo_business', title: 'Foto del negocio/vivienda', subtitle: 'Con geotag', status: 'pending', requiresPhoto: true },
  { id: 'photo_applicant', title: 'Foto del solicitante', subtitle: 'Con geotag', status: 'pending', requiresPhoto: true },
  { id: 'personal_info', title: 'Información personal', subtitle: 'Nombre, DPI y contactos', status: 'pending' },
  { id: 'economic_activity', title: 'Actividad económica', subtitle: '¿Activa?', status: 'pending' },
  { id: 'products', title: 'Productos', subtitle: '¿Concuerdan?', status: 'pending' },
  { id: 'income', title: 'Ingresos', subtitle: 'Observados vs declarados', status: 'pending' },
  { id: 'expenses', title: 'Egresos', subtitle: 'Observados vs declarados', status: 'pending' },
  { id: 'application', title: 'Solicitud', subtitle: 'Tipo/monto/cuota', status: 'pending' },
  { id: 'guarantors', title: 'Fiadores', subtitle: '¿Concuerdan?', status: 'pending' },
  { id: 'additional_comments', title: 'Comentarios adicionales', subtitle: 'Observaciones', status: 'pending' },
  { id: 'documents', title: 'Documentos adicionales', subtitle: 'Subidas múltiples', status: 'pending' }
];

export const InvestigationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [investigations, setInvestigations] = useState<InvestigationState>({});
  const { user } = useUser();

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setInvestigations(parsed);
      }
    } catch (error) {
      console.error('Error loading investigations from localStorage:', error);
    }
  }, []);

  // Save to localStorage whenever investigations change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(investigations));
    } catch (error) {
      console.error('Error saving investigations to localStorage:', error);
    }
  }, [investigations]);

  const getInvestigation = (applicationId: string): Investigation | null => {
    return investigations[applicationId] || null;
  };

  const initializeInvestigation = (applicationId: string) => {
    if (investigations[applicationId]) return;

    const newInvestigation: Investigation = {
      applicationId,
      cards: defaultCards.map(card => ({ ...card })),
      presence: { found: true },
      geoValidation: { isValid: false },
      progress: { completed: 0, total: defaultCards.length, percentage: 0 },
      discrepancies: { count: 0, critical: 0 },
      metadata: {
        startedAt: new Date(),
        investigatorId: user?.email || 'unknown'
      }
    };

    setInvestigations(prev => ({
      ...prev,
      [applicationId]: newInvestigation
    }));
  };

  const updateCardStatus = (applicationId: string, cardId: string, status: InvestigationCardState['status']) => {
    setInvestigations(prev => {
      const investigation = prev[applicationId];
      if (!investigation) return prev;

      const updatedCards = investigation.cards.map(card =>
        card.id === cardId 
          ? { ...card, status, timestamp: new Date() }
          : card
      );

      const completed = updatedCards.filter(card => card.status === 'confirmed').length;
      const mismatches = updatedCards.filter(card => card.status === 'mismatch').length;
      const blocked = updatedCards.filter(card => card.status === 'blocked').length;

      return {
        ...prev,
        [applicationId]: {
          ...investigation,
          cards: updatedCards,
          progress: {
            completed,
            total: updatedCards.length,
            percentage: Math.round((completed / updatedCards.length) * 100)
          },
          discrepancies: {
            count: mismatches,
            critical: blocked
          }
        }
      };
    });
  };

  const addCardComment = (applicationId: string, cardId: string, comment: string) => {
    setInvestigations(prev => {
      const investigation = prev[applicationId];
      if (!investigation) return prev;

      const updatedCards = investigation.cards.map(card =>
        card.id === cardId 
          ? { ...card, comments: comment }
          : card
      );

      return {
        ...prev,
        [applicationId]: {
          ...investigation,
          cards: updatedCards
        }
      };
    });
  };

  const setPresence = (applicationId: string, found: boolean, rescheduleDate?: Date) => {
    setInvestigations(prev => {
      const investigation = prev[applicationId];
      if (!investigation) return prev;

      return {
        ...prev,
        [applicationId]: {
          ...investigation,
          presence: { found, rescheduleDate }
        }
      };
    });
  };

  const updateGeoValidation = (applicationId: string, currentLocation: any, isValid: boolean) => {
    setInvestigations(prev => {
      const investigation = prev[applicationId];
      if (!investigation) return prev;

      return {
        ...prev,
        [applicationId]: {
          ...investigation,
          geoValidation: {
            ...investigation.geoValidation,
            currentLocation,
            isValid
          }
        }
      };
    });
  };

  const completeInvestigation = (applicationId: string) => {
    setInvestigations(prev => {
      const investigation = prev[applicationId];
      if (!investigation) return prev;

      return {
        ...prev,
        [applicationId]: {
          ...investigation,
          metadata: {
            ...investigation.metadata,
            completedAt: new Date()
          }
        }
      };
    });
  };

  const getProgress = (applicationId: string) => {
    const investigation = investigations[applicationId];
    if (!investigation) return { completed: 0, total: 0, percentage: 0 };
    return investigation.progress;
  };

  const getDiscrepancies = (applicationId: string) => {
    const investigation = investigations[applicationId];
    if (!investigation) return { count: 0, critical: 0 };
    return investigation.discrepancies;
  };

  const value: InvestigationContextType = {
    getInvestigation,
    updateCardStatus,
    addCardComment,
    setPresence,
    updateGeoValidation,
    initializeInvestigation,
    completeInvestigation,
    getProgress,
    getDiscrepancies
  };

  return (
    <InvestigationContext.Provider value={value}>
      {children}
    </InvestigationContext.Provider>
  );
};

export const useInvestigation = () => {
  const context = useContext(InvestigationContext);
  if (context === undefined) {
    throw new Error('useInvestigation must be used within an InvestigationProvider');
  }
  return context;
};