import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase configuration. Please set up your environment variables.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          user_id: string;
          full_name: string | null;
          age: number | null;
          education: string | null;
          timeline: string | null;
          current_skills: string[] | null;
          career_interests: string[] | null;
          profile_completion: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          full_name?: string | null;
          age?: number | null;
          education?: string | null;
          timeline?: string | null;
          current_skills?: string[] | null;
          career_interests?: string[] | null;
          profile_completion?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          full_name?: string | null;
          age?: number | null;
          education?: string | null;
          timeline?: string | null;
          current_skills?: string[] | null;
          career_interests?: string[] | null;
          profile_completion?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      skills: {
        Row: {
          id: string;
          user_id: string;
          skill_name: string;
          mastery_level: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          skill_name: string;
          mastery_level?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          skill_name?: string;
          mastery_level?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      progress_logs: {
        Row: {
          id: string;
          user_id: string;
          skill_name: string;
          progress_amount: number;
          notes: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          skill_name: string;
          progress_amount: number;
          notes?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          skill_name?: string;
          progress_amount?: number;
          notes?: string | null;
          created_at?: string;
        };
      };
    };
  };
};