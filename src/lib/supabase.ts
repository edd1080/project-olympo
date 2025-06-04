
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types
export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          full_name: string;
          role: 'agent' | 'admin';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name: string;
          role?: 'agent' | 'admin';
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string;
          role?: 'agent' | 'admin';
          updated_at?: string;
        };
      };
      applications: {
        Row: {
          id: string;
          user_id: string;
          application_code: string;
          status: 'draft' | 'submitted' | 'approved' | 'rejected';
          full_name: string;
          cui: string;
          email: string;
          phone: string;
          credit_amount: number;
          credit_purpose: string;
          monthly_income: number;
          form_data: any;
          agent_comments: string;
          has_fatca: boolean;
          is_pep: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          application_code: string;
          status?: 'draft' | 'submitted' | 'approved' | 'rejected';
          full_name: string;
          cui: string;
          email: string;
          phone: string;
          credit_amount: number;
          credit_purpose: string;
          monthly_income: number;
          form_data?: any;
          agent_comments?: string;
          has_fatca?: boolean;
          is_pep?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          status?: 'draft' | 'submitted' | 'approved' | 'rejected';
          full_name?: string;
          cui?: string;
          email?: string;
          phone?: string;
          credit_amount?: number;
          credit_purpose?: string;
          monthly_income?: number;
          form_data?: any;
          agent_comments?: string;
          has_fatca?: boolean;
          is_pep?: boolean;
          updated_at?: string;
        };
      };
      guarantors: {
        Row: {
          id: string;
          application_id: string;
          full_name: string;
          cui: string;
          email: string;
          phone: string;
          address: string;
          monthly_income: number;
          monthly_expenses: number;
          has_property: boolean;
          property_value: number;
          has_vehicle: boolean;
          vehicle_value: number;
          bank_accounts: string;
          other_income: number;
          basic_info_completed: boolean;
          financial_info_completed: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          application_id: string;
          full_name: string;
          cui: string;
          email: string;
          phone: string;
          address: string;
          monthly_income?: number;
          monthly_expenses?: number;
          has_property?: boolean;
          property_value?: number;
          has_vehicle?: boolean;
          vehicle_value?: number;
          bank_accounts?: string;
          other_income?: number;
          basic_info_completed?: boolean;
          financial_info_completed?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          full_name?: string;
          cui?: string;
          email?: string;
          phone?: string;
          address?: string;
          monthly_income?: number;
          monthly_expenses?: number;
          has_property?: boolean;
          property_value?: number;
          has_vehicle?: boolean;
          vehicle_value?: number;
          bank_accounts?: string;
          other_income?: number;
          basic_info_completed?: boolean;
          financial_info_completed?: boolean;
          updated_at?: string;
        };
      };
      prequalifications: {
        Row: {
          id: string;
          user_id: string;
          data: any;
          result: any;
          location_lat: number;
          location_lng: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          data: any;
          result: any;
          location_lat?: number;
          location_lng?: number;
          created_at?: string;
        };
        Update: {
          data?: any;
          result?: any;
          location_lat?: number;
          location_lng?: number;
        };
      };
    };
  };
}
