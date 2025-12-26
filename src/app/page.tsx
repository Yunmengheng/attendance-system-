'use client';

import { useEffect, useState } from 'react';
import { LandingPage } from '@/components/LandingPage';
import { LoginPage } from '@/components/LoginPage';
import { SignupPage } from '@/components/SignupPage';
import { TeacherDashboard } from '@/components/TeacherDashboard';
import { StudentDashboard } from '@/components/StudentDashboard';
import { Toaster } from 'sonner';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'teacher' | 'student';
}

export interface Class {
  id: string;
  name: string;
  code: string;
  teacherId: string;
  location: {
    latitude: number;
    longitude: number;
    radius: number;
    address: string;
  };
  createdAt: string;
}

export interface AttendanceRecord {
  id: string;
  studentId: string;
  studentName: string;
  classId: string;
  checkInTime: string;
  checkOutTime?: string;
  checkInLocation: {
    latitude: number;
    longitude: number;
  };
  checkOutLocation?: {
    latitude: number;
    longitude: number;
  };
}

function HomeContent() {
  const { profile, loading, signOut } = useAuth();
  const [currentPage, setCurrentPage] = useState<'landing' | 'login' | 'signup' | 'dashboard'>('landing');
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    // Check for saved dark mode preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  useEffect(() => {
    // Auto-navigate to dashboard if user is logged in
    if (profile) {
      console.log('User profile loaded:', profile);
      setCurrentPage('dashboard');
    } else if (!loading) {
      console.log('No profile, showing landing page');
      setCurrentPage('landing');
    }
  }, [profile, loading]);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    if (!isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  const handleLogout = async () => {
    await signOut();
    setCurrentPage('landing');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  // If user is authenticated, show appropriate dashboard
  if (profile) {
    const user: User = {
      id: profile.id,
      name: profile.name,
      email: profile.email,
      role: profile.role,
    };

    if (profile.role === 'teacher') {
      return (
        <TeacherDashboard 
          user={user} 
          onLogout={handleLogout}
          isDarkMode={isDarkMode}
          toggleDarkMode={toggleDarkMode}
        />
      );
    }

    if (profile.role === 'student') {
      return (
        <StudentDashboard 
          user={user} 
          onLogout={handleLogout}
          isDarkMode={isDarkMode}
          toggleDarkMode={toggleDarkMode}
        />
      );
    }
  }

  return (
    <>
      {currentPage === 'landing' && (
        <LandingPage
          onLogin={() => setCurrentPage('login')}
          onSignup={() => setCurrentPage('signup')}
          isDarkMode={isDarkMode}
          toggleDarkMode={toggleDarkMode}
        />
      )}

      {currentPage === 'login' && (
        <LoginPage
          onBack={() => setCurrentPage('landing')}
          onSignup={() => setCurrentPage('signup')}
          isDarkMode={isDarkMode}
          toggleDarkMode={toggleDarkMode}
        />
      )}

      {currentPage === 'signup' && (
        <SignupPage
          onBack={() => setCurrentPage('landing')}
          onLogin={() => setCurrentPage('login')}
          isDarkMode={isDarkMode}
          toggleDarkMode={toggleDarkMode}
        />
      )}
    </>
  );
}

export default function Home() {
  return (
    <AuthProvider>
      <Toaster position="top-right" />
      <HomeContent />
    </AuthProvider>
  );
}

