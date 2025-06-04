
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { PrequalificationData, PrequalificationResult } from '@/utils/prequalificationEngine';

type Prequalification = Database['public']['Tables']['prequalifications']['Row'];
type PrequalificationInsert = Database['public']['Tables']['prequalifications']['Insert'];

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

export const usePrequalifications = () => {
  const [prequalifications, setPrequalifications] = useState<StoredPrequalification[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      loadPrequalifications();
    }
  }, [user]);

  const loadPrequalifications = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('prequalifications')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      const formattedData: StoredPrequalification[] = (data || []).map(item => ({
        id: item.id,
        data: item.data as PrequalificationData,
        result: item.result as PrequalificationResult,
        timestamp: item.created_at || '',
        location: item.location_lat && item.location_lng ? {
          lat: item.location_lat,
          lng: item.location_lng
        } : undefined
      }));

      setPrequalifications(formattedData);
    } catch (error: any) {
      console.error('Error loading prequalifications:', error);
      toast({
        title: "Error al cargar precalificaciones",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const savePrequalification = async (
    data: PrequalificationData, 
    result: PrequalificationResult,
    location?: { lat: number; lng: number }
  ): Promise<string> => {
    try {
      if (!user) throw new Error('Usuario no autenticado');

      const insertData: PrequalificationInsert = {
        user_id: user.id,
        data: data as any,
        result: result as any,
        location_lat: location?.lat,
        location_lng: location?.lng,
      };

      const { data: savedData, error } = await supabase
        .from('prequalifications')
        .insert(insertData)
        .select()
        .single();

      if (error) {
        throw error;
      }

      if (savedData) {
        const newPrequalification: StoredPrequalification = {
          id: savedData.id,
          data: savedData.data as PrequalificationData,
          result: savedData.result as PrequalificationResult,
          timestamp: savedData.created_at || '',
          location: location
        };

        setPrequalifications(prev => [newPrequalification, ...prev]);

        toast({
          title: "Precalificación guardada",
          description: "La precalificación ha sido guardada correctamente",
        });

        return savedData.id;
      }
      
      throw new Error('No se pudo guardar la precalificación');
    } catch (error: any) {
      console.error('Error saving prequalification:', error);
      toast({
        title: "Error al guardar precalificación",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    }
  };

  const deletePrequalification = async (id: string) => {
    try {
      const { error } = await supabase
        .from('prequalifications')
        .delete()
        .eq('id', id);

      if (error) {
        throw error;
      }

      setPrequalifications(prev => prev.filter(p => p.id !== id));

      toast({
        title: "Precalificación eliminada",
        description: "La precalificación ha sido eliminada correctamente",
      });
    } catch (error: any) {
      console.error('Error deleting prequalification:', error);
      toast({
        title: "Error al eliminar precalificación",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const getPrequalification = (id: string): StoredPrequalification | undefined => {
    return prequalifications.find(p => p.id === id);
  };

  return {
    prequalifications,
    loading,
    savePrequalification,
    deletePrequalification,
    getPrequalification,
    loadPrequalifications,
  };
};
