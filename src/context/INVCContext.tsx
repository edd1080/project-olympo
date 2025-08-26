import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { INVCData, INVCDifference, INVCValidationResult } from '@/types/invc';

interface INVCContextType {
  invcData: INVCData | null;
  setINVCData: (data: INVCData) => void;
  updateObservedData: (field: string, value: any) => void;
  addDifference: (diff: INVCDifference) => void;
  removeDifference: (campo: string) => void;
  validateForFinish: () => INVCValidationResult;
  saveToLocal: () => void;
  loadFromLocal: (solicitudId: string) => INVCData | null;
  isOffline: boolean;
  syncStatus: 'idle' | 'syncing' | 'error' | 'success';
}

const INVCContext = createContext<INVCContextType | undefined>(undefined);

export const INVCProvider: React.FC<{ children: React.ReactNode; solicitudId: string }> = ({ 
  children, 
  solicitudId 
}) => {
  const [invcData, setINVCDataState] = useState<INVCData | null>(null);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'error' | 'success'>('idle');

  // Mock data para desarrollo - en producción vendría de la API
  const initializeMockData = useCallback((): INVCData => ({
    solicitudId,
    declarado: {
      datosPersonales: {
        nombre: "Juan Carlos Pérez",
        dpi: "2547896123",
        celular: "4512-3456",
        telefono: "2234-5678"
      },
      actividad: {
        activa: true,
        productos: ["Venta de ropa", "Calzado"]
      },
      ingresos: 8500,
      egresos: 3200,
      producto: {
        tipo: "Crédito Individual",
        monto: 15000,
        cuota: 950,
        plazo: 18
      },
      fiadores: [
        { id: "1", nombre: "María López", dpi: "1234567890", relacion: "Esposa" },
        { id: "2", nombre: "Carlos Pérez", dpi: "0987654321", relacion: "Hermano" }
      ],
      direccionNegocio: {
        lat: 14.6349,
        lng: -90.5069,
        direccion: "Zona 1, Guatemala"
      }
    },
    observado: {},
    diffs: [],
    fotometria: {
      negocio_ok: false,
      solicitante_ok: false,
      geo_ok: false
    },
    evidencias: {
      fotosPrevias: [
        "/src/assets/reference-person.jpg", // Reference photo of applicant
        "/src/assets/reference-store.jpg"   // Reference photo of business
      ],
      fotosNuevas: {}
    },
    estado: 'iniciado',
    fechaCreacion: new Date().toISOString(),
    fechaActualizacion: new Date().toISOString()
  }), [solicitudId]);

  useEffect(() => {
    // Intentar cargar datos locales primero
    const localData = loadFromLocal(solicitudId);
    if (localData) {
      setINVCDataState(localData);
    } else {
      // Inicializar con datos mock
      const mockData = initializeMockData();
      setINVCDataState(mockData);
      saveToLocal(mockData);
    }

    // Escuchar cambios de conectividad
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [solicitudId, initializeMockData]);

  const setINVCData = useCallback((data: INVCData) => {
    setINVCDataState(data);
    saveToLocal(data);
  }, []);

  const updateObservedData = useCallback((field: string, value: any) => {
    if (!invcData) return;

    const updatedData = {
      ...invcData,
      observado: {
        ...invcData.observado,
        [field]: value
      },
      fechaActualizacion: new Date().toISOString()
    };

    setINVCDataState(updatedData);
    
    // Autosave con debounce
    setTimeout(() => {
      saveToLocal(updatedData);
    }, 500);
  }, [invcData]);

  const addDifference = useCallback((diff: INVCDifference) => {
    if (!invcData) return;

    const existingDiffIndex = invcData.diffs.findIndex(d => d.campo === diff.campo);
    const updatedDiffs = [...invcData.diffs];
    
    if (existingDiffIndex >= 0) {
      updatedDiffs[existingDiffIndex] = diff;
    } else {
      updatedDiffs.push(diff);
    }

    const updatedData = {
      ...invcData,
      diffs: updatedDiffs,
      fechaActualizacion: new Date().toISOString()
    };

    setINVCDataState(updatedData);
    saveToLocal(updatedData);
  }, [invcData]);

  const removeDifference = useCallback((campo: string) => {
    if (!invcData) return;

    const updatedData = {
      ...invcData,
      diffs: invcData.diffs.filter(d => d.campo !== campo),
      fechaActualizacion: new Date().toISOString()
    };

    setINVCDataState(updatedData);
    saveToLocal(updatedData);
  }, [invcData]);

  const validateForFinish = useCallback((): INVCValidationResult => {
    if (!invcData) {
      return { isValid: false, blockedReasons: ['No hay datos cargados'], warnings: [] };
    }

    const blockedReasons: string[] = [];
    const warnings: string[] = [];

    // Validar geotag
    if (!invcData.fotometria.geo_ok) {
      blockedReasons.push('Geolocalización pendiente o fuera de rango');
    }

    // Validar fotos requeridas
    if (!invcData.evidencias.fotosNuevas.negocio || !invcData.evidencias.fotosNuevas.solicitante) {
      blockedReasons.push('Faltan fotos del negocio o solicitante');
    }

    // Validar comentarios en discrepancias
    const diffsWithoutComment = invcData.diffs.filter(d => !d.comentario);
    if (diffsWithoutComment.length > 0) {
      blockedReasons.push('Hay discrepancias sin comentario explicativo');
    }

    // Warnings
    if (invcData.diffs.length > 3) {
      warnings.push('Muchas discrepancias encontradas');
    }

    return {
      isValid: blockedReasons.length === 0,
      blockedReasons,
      warnings
    };
  }, [invcData]);

  const saveToLocal = useCallback((data?: INVCData) => {
    try {
      const dataToSave = data || invcData;
      if (dataToSave) {
        localStorage.setItem(`invc_${solicitudId}`, JSON.stringify(dataToSave));
      }
    } catch (error) {
      console.error('Error saving INVC data locally:', error);
    }
  }, [invcData, solicitudId]);

  const loadFromLocal = useCallback((id: string): INVCData | null => {
    try {
      const stored = localStorage.getItem(`invc_${id}`);
      return stored ? JSON.parse(stored) : null;
    } catch (error) {
      console.error('Error loading INVC data from local storage:', error);
      return null;
    }
  }, []);

  return (
    <INVCContext.Provider value={{
      invcData,
      setINVCData,
      updateObservedData,
      addDifference,
      removeDifference,
      validateForFinish,
      saveToLocal,
      loadFromLocal,
      isOffline,
      syncStatus
    }}>
      {children}
    </INVCContext.Provider>
  );
};

export const useINVC = (): INVCContextType => {
  const context = useContext(INVCContext);
  if (context === undefined) {
    throw new Error('useINVC must be used within an INVCProvider');
  }
  return context;
};