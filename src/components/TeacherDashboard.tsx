'use client';

import { useState } from 'react';
import { User } from '@/app/page';
import { Plus, MapPin, LogOut, Users, BookOpen, BarChart3, Calendar, Moon, Sun } from 'lucide-react';
import { CreateClassModal } from './CreateClassModal';
import { ClassCard } from './ClassCard';
import { AttendanceReportModal } from './AttendanceReportModal';
import { useAuth } from '@/contexts/AuthContext';
import { useTeacherClasses } from '@/hooks/useSupabaseData';

interface TeacherDashboardProps {
  user: User;
  onLogout: () => void;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

interface Class {
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
  studentCount: number;
}

export function TeacherDashboard({ user, onLogout, isDarkMode, toggleDarkMode }: TeacherDashboardProps) {
  const { signOut } = useAuth();
  const { classes, loading, createClass } = useTeacherClasses(user.id);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedClass, setSelectedClass] = useState<Class | null>(null);

  const handleCreateClass = async (classData: {
    name: string;
    code: string;
    location: {
      latitude: number;
      longitude: number;
      radius: number;
      address: string;
    };
  }) => {
    try {
      await createClass({
        name: classData.name,
        code: classData.code,
        location_latitude: classData.location.latitude,
        location_longitude: classData.location.longitude,
        location_radius: classData.location.radius,
        location_address: classData.location.address,
      });
      setShowCreateModal(false);
    } catch (error) {
      // Error already handled in hook
    }
  };

  // Transform classes to match the ClassCard expected format
  const transformedClasses = classes.map(cls => ({
    id: cls.id,
    name: cls.name,
    code: cls.code,
    teacherId: cls.teacher_id,
    location: {
      latitude: cls.location_latitude,
      longitude: cls.location_longitude,
      radius: cls.location_radius,
      address: cls.location_address,
    },
    createdAt: cls.created_at,
    studentCount: cls.student_count || 0,
  }));

  const totalStudents = transformedClasses.reduce((sum, c) => sum + c.studentCount, 0);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b border-border bg-white dark:bg-card">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <MapPin className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl">AttendEase</span>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={toggleDarkMode}
              className="p-2 text-muted-foreground hover:text-foreground hover:bg-secondary rounded-lg transition-colors"
              title={isDarkMode ? 'Light mode' : 'Dark mode'}
            >
              {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <div className="text-right">
              <div className="text-sm">{user.name}</div>
              <div className="text-xs text-muted-foreground">Teacher</div>
            </div>
            <button
              onClick={signOut}
              className="p-2 text-muted-foreground hover:text-foreground hover:bg-secondary rounded-lg transition-colors"
              title="Logout"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-6 py-12 max-w-6xl">
        {/* Welcome Section */}
        <div className="mb-12">
          <h1 className="text-4xl mb-3">Welcome back, {user.name.split(' ')[0]}</h1>
          <p className="text-xl text-muted-foreground">
            You have {transformedClasses.length} {transformedClasses.length === 1 ? 'class' : 'classes'} with {totalStudents} total students
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-white dark:bg-card p-8 rounded-2xl border-2 border-border hover:border-primary hover:shadow-lg transition-all text-left group"
          >
            <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
              <Plus className="w-7 h-7 text-primary" />
            </div>
            <h3 className="text-xl mb-2">Create Class</h3>
            <p className="text-muted-foreground">
              Set up a new class with location boundaries
            </p>
          </button>

          <div className="bg-white dark:bg-card p-8 rounded-2xl border-2 border-border">
            <div className="w-14 h-14 bg-green-50 dark:bg-green-500/10 rounded-xl flex items-center justify-center mb-4">
              <Users className="w-7 h-7 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="text-xl mb-2">Total Students</h3>
            <p className="text-3xl text-primary">{totalStudents}</p>
          </div>

          <div className="bg-white dark:bg-card p-8 rounded-2xl border-2 border-border">
            <div className="w-14 h-14 bg-purple-50 dark:bg-purple-500/10 rounded-xl flex items-center justify-center mb-4">
              <Calendar className="w-7 h-7 text-purple-600 dark:text-purple-400" />
            </div>
            <h3 className="text-xl mb-2">Active Today</h3>
            <p className="text-3xl text-primary">{Math.floor(totalStudents * 0.85)}</p>
          </div>
        </div>

        {/* Classes Section */}
        <div>
          <h2 className="text-3xl mb-8">Your Classes</h2>

          {transformedClasses.length === 0 ? (
            <div className="bg-white dark:bg-card rounded-2xl border-2 border-dashed border-border p-20 text-center">
              <div className="w-20 h-20 bg-secondary rounded-2xl flex items-center justify-center mx-auto mb-6">
                <BookOpen className="w-10 h-10 text-muted-foreground" />
              </div>
              <h3 className="text-2xl mb-3">No classes yet</h3>
              <p className="text-lg text-muted-foreground mb-8 max-w-md mx-auto">
                Create your first class to start tracking attendance
              </p>
              <button
                onClick={() => setShowCreateModal(true)}
                className="px-8 py-3.5 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
              >
                Create Your First Class
              </button>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
              {transformedClasses.map((classItem) => (
                <ClassCard
                  key={classItem.id}
                  classData={classItem}
                  onViewReport={() => setSelectedClass(classItem)}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      {showCreateModal && (
        <CreateClassModal
          onClose={() => setShowCreateModal(false)}
          onCreate={handleCreateClass}
        />
      )}

      {selectedClass && (
        <AttendanceReportModal
          classData={selectedClass}
          onClose={() => setSelectedClass(null)}
        />
      )}
    </div>
  );
}