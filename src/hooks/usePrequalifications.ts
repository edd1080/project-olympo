
import { useState, useEffect } from 'react';
import { PrequalificationData, PrequalificationResult, generateUUID } from '@/utils/prequalificationEngine';

export interface StoredPrequalification {
  id: string;
  data: PrequalificationData;
  result: PrequalificationResult;
  timestamp: string;
  location?: {
    lat: number;
    lng: number;
  };
}

const STORAGE_KEY = 'prequalifications';

export const usePrequalifications = () => {
  const [prequalifications, setPrequalifications] = useState<StoredPrequalification[]>([]);

  useEffect(() => {
    loadPrequalifications();
  }, []);

  const loadPrequalifications = () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setPrequalifications(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Error loading prequalifications:', error);
    }
  };

  const savePrequalification = (
    data: PrequalificationData, 
    result: PrequalificationResult,
    location?: { lat: number; lng: number }
  ): string => {
    const id = generateUUID();
    const newPrequalification: StoredPrequalification = {
      id,
      data,
      result,
      timestamp: new Date().toISOString(),
      location
    };

    const updated = [newPrequalification, ...prequalifications];
    setPrequalifications(updated);
    
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (error) {
      console.error('Error saving prequalification:', error);
    }

    return id;
  };

  const deletePrequalification = (id: string) => {
    const updated = prequalifications.filter(p => p.id !== id);
    setPrequalifications(updated);
    
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (error) {
      console.error('Error deleting prequalification:', error);
    }
  };

  const getPrequalification = (id: string): StoredPrequalification | undefined => {
    return prequalifications.find(p => p.id === id);
  };

  return {
    prequalifications,
    savePrequalification,
    deletePrequalification,
    getPrequalification,
    loadPrequalifications
  };
};
