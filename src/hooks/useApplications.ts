
import { useState, useEffect } from 'react';
import { supabase, Database } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';

type Application = Database['public']['Tables']['applications']['Row'];
type ApplicationInsert = Database['public']['Tables']['applications']['Insert'];
type ApplicationUpdate = Database['public']['Tables']['applications']['Update'];

type Guarantor = Database['public']['Tables']['guarantors']['Row'];
type GuarantorInsert = Database['public']['Tables']['guarantors']['Insert'];

export const useApplications = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      fetchApplications();
    }
  }, [user]);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('applications')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      setApplications(data || []);
    } catch (error: any) {
      console.error('Error fetching applications:', error);
      toast({
        title: "Error al cargar solicitudes",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createApplication = async (applicationData: Omit<ApplicationInsert, 'user_id'>) => {
    try {
      if (!user) throw new Error('Usuario no autenticado');

      const { data, error } = await supabase
        .from('applications')
        .insert({
          ...applicationData,
          user_id: user.id,
        })
        .select()
        .single();

      if (error) {
        throw error;
      }

      setApplications(prev => [data, ...prev]);
      
      toast({
        title: "Solicitud creada",
        description: "La solicitud ha sido creada correctamente",
      });

      return data;
    } catch (error: any) {
      console.error('Error creating application:', error);
      toast({
        title: "Error al crear solicitud",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    }
  };

  const updateApplication = async (id: string, updates: ApplicationUpdate) => {
    try {
      const { data, error } = await supabase
        .from('applications')
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        throw error;
      }

      setApplications(prev => 
        prev.map(app => app.id === id ? data : app)
      );

      return data;
    } catch (error: any) {
      console.error('Error updating application:', error);
      toast({
        title: "Error al actualizar solicitud",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    }
  };

  const getApplication = async (id: string) => {
    try {
      const { data, error } = await supabase
        .from('applications')
        .select(`
          *,
          guarantors (*)
        `)
        .eq('id', id)
        .single();

      if (error) {
        throw error;
      }

      return data;
    } catch (error: any) {
      console.error('Error fetching application:', error);
      toast({
        title: "Error al cargar solicitud",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    }
  };

  const createGuarantor = async (guarantorData: GuarantorInsert) => {
    try {
      const { data, error } = await supabase
        .from('guarantors')
        .insert(guarantorData)
        .select()
        .single();

      if (error) {
        throw error;
      }

      toast({
        title: "Fiador agregado",
        description: "El fiador ha sido agregado correctamente",
      });

      return data;
    } catch (error: any) {
      console.error('Error creating guarantor:', error);
      toast({
        title: "Error al crear fiador",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    }
  };

  const updateGuarantor = async (id: string, updates: Partial<Guarantor>) => {
    try {
      const { data, error } = await supabase
        .from('guarantors')
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        throw error;
      }

      return data;
    } catch (error: any) {
      console.error('Error updating guarantor:', error);
      toast({
        title: "Error al actualizar fiador",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    }
  };

  return {
    applications,
    loading,
    createApplication,
    updateApplication,
    getApplication,
    createGuarantor,
    updateGuarantor,
    refetch: fetchApplications,
  };
};
