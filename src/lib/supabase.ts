import { createClient } from '@supabase/supabase-js';

// Get your Supabase credentials from https://app.supabase.com
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Missing Supabase credentials. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in your .env.local file');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types
export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          name: string;
          role: 'teacher' | 'student';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          name: string;
          role: 'teacher' | 'student';
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          name?: string;
          role?: 'teacher' | 'student';
          created_at?: string;
          updated_at?: string;
        };
      };
      classes: {
        Row: {
          id: string;
          name: string;
          code: string;
          teacher_id: string;
          location_latitude: number;
          location_longitude: number;
          location_radius: number;
          location_address: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          code: string;
          teacher_id: string;
          location_latitude: number;
          location_longitude: number;
          location_radius: number;
          location_address: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          code?: string;
          teacher_id?: string;
          location_latitude?: number;
          location_longitude?: number;
          location_radius?: number;
          location_address?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      class_enrollments: {
        Row: {
          id: string;
          class_id: string;
          student_id: string;
          enrolled_at: string;
        };
        Insert: {
          id?: string;
          class_id: string;
          student_id: string;
          enrolled_at?: string;
        };
        Update: {
          id?: string;
          class_id?: string;
          student_id?: string;
          enrolled_at?: string;
        };
      };
      attendance_records: {
        Row: {
          id: string;
          class_id: string;
          student_id: string;
          check_in_time: string;
          check_out_time: string | null;
          check_in_latitude: number;
          check_in_longitude: number;
          check_out_latitude: number | null;
          check_out_longitude: number | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          class_id: string;
          student_id: string;
          check_in_time: string;
          check_out_time?: string | null;
          check_in_latitude: number;
          check_in_longitude: number;
          check_out_latitude?: number | null;
          check_out_longitude?: number | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          class_id?: string;
          student_id?: string;
          check_in_time?: string;
          check_out_time?: string | null;
          check_in_latitude?: number;
          check_in_longitude?: number;
          check_out_latitude?: number | null;
          check_out_longitude?: number | null;
          created_at?: string;
        };
      };
    };
  };
}
