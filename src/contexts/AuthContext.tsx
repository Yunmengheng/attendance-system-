'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { User as SupabaseUser, Session } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  role: 'teacher' | 'student';
}

interface AuthContextType {
  user: SupabaseUser | null;
  profile: UserProfile | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string, role: 'teacher' | 'student') => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id);
      } else {
        setLoading(false);
      }
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id);
      } else {
        setProfile(null);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchProfile = async (userId: string) => {
    try {
      console.log('Fetching profile for user:', userId);
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      console.log('Profile query result:', { data, error });

      if (error) {
        // If it's the "multiple rows" error, try to get just the first one
        if (error.message?.includes('multiple') || error.message?.includes('coerce')) {
          const { data: multiData, error: multiError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', userId)
            .limit(1);
          
          if (multiError) throw multiError;
          
          const profileData = Array.isArray(multiData) && multiData.length > 0 ? multiData[0] : null;
          
          if (profileData) {
            setProfile({
              id: profileData.id,
              email: profileData.email,
              name: profileData.name,
              role: profileData.role as 'teacher' | 'student',
            });
            console.log('Profile set successfully:', profileData);
            toast.warning('Multiple profiles detected. Please contact support to clean up your account.');
          } else {
            console.log('No profile data found after fallback');
          }
          return;
        }
        throw error;
      }
      
      if (data) {
        setProfile({
          id: data.id,
          email: data.email,
          name: data.name,
          role: data.role as 'teacher' | 'student',
        });
        console.log('Profile set successfully:', data);
      } else {
        console.log('No profile data found - user may need to complete signup');
        toast.error('Profile not found. Please sign up again.');
      }
    } catch (error: any) {
      console.error('Error fetching profile:', error);
      toast.error('Failed to load user profile. Please try logging in again.');
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      if (data.user) {
        await fetchProfile(data.user.id);
        toast.success('Successfully signed in!');
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to sign in');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string, name: string, role: 'teacher' | 'student') => {
    try {
      setLoading(true);
      
      // Sign up the user
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            role,
          },
        },
      });

      if (error) throw error;

      if (data.user) {
        // Check if profile already exists
        const { data: existingProfile } = await supabase
          .from('profiles')
          .select('id')
          .eq('id', data.user.id)
          .limit(1);

        // Only create profile if it doesn't exist
        if (!existingProfile || existingProfile.length === 0) {
          const { error: profileError } = await supabase
            .from('profiles')
            .insert([
              {
                id: data.user.id,
                email,
                name,
                role,
              },
            ]);

          if (profileError) throw profileError;
        }

        await fetchProfile(data.user.id);
        toast.success('Account created successfully! Please check your email to verify your account.');
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to sign up');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      setUser(null);
      setProfile(null);
      setSession(null);
      toast.success('Signed out successfully');
    } catch (error: any) {
      toast.error(error.message || 'Failed to sign out');
      throw error;
    }
  };

  const value = {
    user,
    profile,
    session,
    loading,
    signIn,
    signUp,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
