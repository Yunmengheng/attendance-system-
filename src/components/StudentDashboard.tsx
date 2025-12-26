'use client';

import { useState, useEffect } from 'react';
import { User } from '@/app/page';
import { MapPin, LogOut, Clock, CheckCircle, XCircle, Plus, Award, BookOpen, Moon, Sun } from 'lucide-react';
import { JoinClassModal } from './JoinClassModal';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';

interface StudentDashboardProps {
  user: User;
  onLogout: () => void;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

interface EnrolledClass {
  id: string;
  name: string;
  code: string;
  teacherName: string;
  location: {
    latitude: number;
    longitude: number;
    radius: number;
    address: string;
  };
  isCheckedIn: boolean;
  checkInTime?: string;
}

interface AttendanceHistory {
  id: string;
  className: string;
  date: string;
  checkInTime: string;
  checkOutTime?: string;
  status: 'present' | 'late' | 'absent';
}

export function StudentDashboard({ user, onLogout, isDarkMode, toggleDarkMode }: StudentDashboardProps) {
  const { signOut } = useAuth();
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [currentLocation, setCurrentLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [enrolledClasses, setEnrolledClasses] = useState<EnrolledClass[]>([
    {
      id: '1',
      name: 'Computer Science 101',
      code: 'CS101A',
      teacherName: 'Dr. Smith',
      location: {
        latitude: 40.7128,
        longitude: -74.0060,
        radius: 100,
        address: 'New York University, New York, NY'
      },
      isCheckedIn: false
    },
    {
      id: '2',
      name: 'Data Structures',
      code: 'DS202B',
      teacherName: 'Prof. Johnson',
      location: {
        latitude: 40.7489,
        longitude: -73.9680,
        radius: 150,
        address: 'Hunter College, New York, NY'
      },
      isCheckedIn: false
    }
  ]);

  const [attendanceHistory, setAttendanceHistory] = useState<AttendanceHistory[]>([
    {
      id: '1',
      className: 'Computer Science 101',
      date: '2024-12-16',
      checkInTime: '09:00 AM',
      checkOutTime: '10:30 AM',
      status: 'present'
    },
    {
      id: '2',
      className: 'Data Structures',
      date: '2024-12-16',
      checkInTime: '11:15 AM',
      checkOutTime: '12:45 PM',
      status: 'present'
    },
    {
      id: '3',
      className: 'Computer Science 101',
      date: '2024-12-15',
      checkInTime: '09:10 AM',
      checkOutTime: '10:35 AM',
      status: 'late'
    }
  ]);

  useEffect(() => {
    // Get current location
    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by your browser');
      toast.error('Geolocation is not supported by your browser');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCurrentLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        });
        setLocationError(null);
        toast.success('Location services enabled');
      },
      (error) => {
        let errorMessage = 'Unable to get your location';
        
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Location permission denied. Please enable location services.';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Location information is unavailable.';
            break;
          case error.TIMEOUT:
            errorMessage = 'Location request timed out.';
            break;
          default:
            errorMessage = 'An unknown error occurred while getting location.';
        }
        
        console.error('Geolocation error:', error);
        setLocationError(errorMessage);
        toast.error(errorMessage);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  }, []);

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371e3; // Earth's radius in meters
    const φ1 = (lat1 * Math.PI) / 180;
    const φ2 = (lat2 * Math.PI) / 180;
    const Δφ = ((lat2 - lat1) * Math.PI) / 180;
    const Δλ = ((lon2 - lon1) * Math.PI) / 180;

    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
  };

  const isWithinRange = (classLocation: { latitude: number; longitude: number; radius: number }) => {
    if (!currentLocation) return false;
    const distance = calculateDistance(
      currentLocation.latitude,
      currentLocation.longitude,
      classLocation.latitude,
      classLocation.longitude
    );
    return distance <= classLocation.radius;
  };

  const handleCheckIn = (classId: string) => {
    const classItem = enrolledClasses.find(c => c.id === classId);
    if (!classItem) return;

    if (!currentLocation) {
      toast.error('Unable to get your location. Please enable location services.');
      return;
    }

    if (!isWithinRange(classItem.location)) {
      toast.error('You are not within the allowed location to check in.');
      return;
    }

    setEnrolledClasses(classes =>
      classes.map(c =>
        c.id === classId
          ? { ...c, isCheckedIn: true, checkInTime: new Date().toISOString() }
          : c
      )
    );
    toast.success('Checked in successfully!');
  };

  const handleCheckOut = (classId: string) => {
    const classItem = enrolledClasses.find(c => c.id === classId);
    if (!classItem || !classItem.isCheckedIn) return;

    setEnrolledClasses(classes =>
      classes.map(c =>
        c.id === classId ? { ...c, isCheckedIn: false, checkInTime: undefined } : c
      )
    );

    // Add to history
    const newHistory: AttendanceHistory = {
      id: Math.random().toString(36).substr(2, 9),
      className: classItem.name,
      date: new Date().toLocaleDateString(),
      checkInTime: classItem.checkInTime
        ? new Date(classItem.checkInTime).toLocaleTimeString()
        : '',
      checkOutTime: new Date().toLocaleTimeString(),
      status: 'present'
    };
    setAttendanceHistory([newHistory, ...attendanceHistory]);
    toast.success('Checked out successfully!');
  };

  const handleJoinClass = (code: string) => {
    // Mock join class
    const mockClass: EnrolledClass = {
      id: Math.random().toString(36).substr(2, 9),
      name: 'New Class',
      code: code,
      teacherName: 'Teacher',
      location: {
        latitude: 40.7128,
        longitude: -74.0060,
        radius: 100,
        address: 'Sample Location'
      },
      isCheckedIn: false
    };
    setEnrolledClasses([...enrolledClasses, mockClass]);
    setShowJoinModal(false);
    toast.success('Joined class successfully!');
  };

  const presentCount = attendanceHistory.filter(h => h.status === 'present').length;
  const attendanceRate = attendanceHistory.length > 0
    ? Math.round((presentCount / attendanceHistory.length) * 100)
    : 0;

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
              <div className="text-xs text-muted-foreground">Student</div>
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
          <h1 className="text-4xl mb-3">Hello, {user.name.split(' ')[0]}</h1>
          <p className="text-xl text-muted-foreground">
            {enrolledClasses.length > 0 
              ? `You're enrolled in ${enrolledClasses.length} ${enrolledClasses.length === 1 ? 'class' : 'classes'} with ${attendanceRate}% attendance rate`
              : 'Join your first class to get started'
            }
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          <button
            onClick={() => setShowJoinModal(true)}
            className="bg-white dark:bg-card p-8 rounded-2xl border-2 border-border hover:border-primary hover:shadow-lg transition-all text-left group"
          >
            <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
              <Plus className="w-7 h-7 text-primary" />
            </div>
            <h3 className="text-xl mb-2">Join Class</h3>
            <p className="text-muted-foreground">
              Enter a class code from your teacher
            </p>
          </button>

          <div className="bg-white dark:bg-card p-8 rounded-2xl border-2 border-border">
            <div className="w-14 h-14 bg-green-50 dark:bg-green-500/10 rounded-xl flex items-center justify-center mb-4">
              <Award className="w-7 h-7 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="text-xl mb-2">Attendance Rate</h3>
            <p className="text-3xl text-primary">{attendanceRate}%</p>
          </div>

          <div className="bg-white dark:bg-card p-8 rounded-2xl border-2 border-border">
            <div className="w-14 h-14 bg-purple-50 dark:bg-purple-500/10 rounded-xl flex items-center justify-center mb-4">
              <CheckCircle className="w-7 h-7 text-purple-600 dark:text-purple-400" />
            </div>
            <h3 className="text-xl mb-2">Days Present</h3>
            <p className="text-3xl text-primary">{presentCount}</p>
          </div>
        </div>

        {/* My Classes */}
        <div className="mb-16">
          <h2 className="text-3xl mb-8">My Classes</h2>

          {enrolledClasses.length === 0 ? (
            <div className="bg-white dark:bg-card rounded-2xl border-2 border-dashed border-border p-20 text-center">
              <div className="w-20 h-20 bg-secondary rounded-2xl flex items-center justify-center mx-auto mb-6">
                <BookOpen className="w-10 h-10 text-muted-foreground" />
              </div>
              <h3 className="text-2xl mb-3">No classes yet</h3>
              <p className="text-lg text-muted-foreground mb-8 max-w-md mx-auto">
                Join your first class using an invite code from your teacher
              </p>
              <button
                onClick={() => setShowJoinModal(true)}
                className="px-8 py-3.5 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
              >
                Join Your First Class
              </button>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
              {enrolledClasses.map((classItem) => {
                const inRange = isWithinRange(classItem.location);
                return (
                  <div
                    key={classItem.id}
                    className="bg-white dark:bg-card rounded-2xl border-2 border-border p-6 hover:shadow-lg transition-all"
                  >
                    <div className="mb-4">
                      <h3 className="text-xl mb-1">{classItem.name}</h3>
                      <p className="text-sm text-muted-foreground">{classItem.teacherName}</p>
                    </div>

                    <div className="space-y-2 mb-6">
                      <div className="flex items-start gap-2 text-sm">
                        <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0 text-muted-foreground" />
                        <span className="text-muted-foreground">{classItem.location.address}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-2 h-2 rounded-full ${
                            inRange ? 'bg-green-500' : 'bg-red-500'
                          }`}
                        />
                        <span className="text-sm text-muted-foreground">
                          {inRange ? 'Within range' : 'Out of range'}
                        </span>
                      </div>
                    </div>

                    {classItem.isCheckedIn ? (
                      <div className="space-y-3">
                        <div className="flex items-center gap-2 text-sm text-green-700 dark:text-green-300 bg-green-50 dark:bg-green-500/10 px-4 py-3 rounded-lg border border-green-200 dark:border-green-500/20">
                          <CheckCircle className="w-4 h-4" />
                          <span>Checked in at {new Date(classItem.checkInTime!).toLocaleTimeString()}</span>
                        </div>
                        <button
                          onClick={() => handleCheckOut(classItem.id)}
                          className="w-full px-4 py-3 bg-secondary text-foreground rounded-lg hover:bg-secondary/80 border-2 border-border transition-all"
                        >
                          Check Out
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleCheckIn(classItem.id)}
                        disabled={!inRange}
                        className={`w-full px-4 py-3 rounded-lg transition-all ${
                          inRange
                            ? 'bg-primary text-white hover:bg-primary/90'
                            : 'bg-secondary text-muted-foreground cursor-not-allowed border-2 border-border'
                        }`}
                      >
                        Check In
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Recent Attendance */}
        {attendanceHistory.length > 0 && (
          <div>
            <h2 className="text-3xl mb-8">Recent Attendance</h2>
            <div className="bg-white dark:bg-card rounded-2xl border-2 border-border overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-secondary">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm text-muted-foreground">Class</th>
                      <th className="px-6 py-4 text-left text-sm text-muted-foreground">Date</th>
                      <th className="px-6 py-4 text-left text-sm text-muted-foreground">Check In</th>
                      <th className="px-6 py-4 text-left text-sm text-muted-foreground">Check Out</th>
                      <th className="px-6 py-4 text-left text-sm text-muted-foreground">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {attendanceHistory.slice(0, 5).map((record) => (
                      <tr key={record.id} className="hover:bg-secondary/30 transition-colors">
                        <td className="px-6 py-4">{record.className}</td>
                        <td className="px-6 py-4 text-muted-foreground">{record.date}</td>
                        <td className="px-6 py-4 text-muted-foreground">{record.checkInTime}</td>
                        <td className="px-6 py-4 text-muted-foreground">
                          {record.checkOutTime || '-'}
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs ${
                              record.status === 'present'
                                ? 'bg-green-50 dark:bg-green-500/10 text-green-700 dark:text-green-300 border border-green-200 dark:border-green-500/20'
                                : record.status === 'late'
                                ? 'bg-yellow-50 dark:bg-yellow-500/10 text-yellow-700 dark:text-yellow-300 border border-yellow-200 dark:border-yellow-500/20'
                                : 'bg-red-50 dark:bg-red-500/10 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-500/20'
                            }`}
                          >
                            {record.status === 'present' && <CheckCircle className="w-3 h-3" />}
                            {record.status === 'late' && <Clock className="w-3 h-3" />}
                            {record.status === 'absent' && <XCircle className="w-3 h-3" />}
                            {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Join Class Modal */}
      {showJoinModal && (
        <JoinClassModal
          onClose={() => setShowJoinModal(false)}
          onJoin={handleJoinClass}
        />
      )}
    </div>
  );
}
