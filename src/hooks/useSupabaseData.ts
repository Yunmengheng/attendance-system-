'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

export interface Class {
  id: string;
  name: string;
  code: string;
  teacher_id: string;
  location_latitude: number;
  location_longitude: number;
  location_radius: number;
  location_address: string;
  check_in_time?: string;
  check_out_time?: string;
  created_at: string;
  student_count?: number;
}

export interface EnrolledClass extends Class {
  teacher_name?: string;
}

export interface AttendanceRecord {
  id: string;
  class_id: string;
  student_id: string;
  check_in_time: string;
  check_out_time?: string;
  check_in_latitude: number;
  check_in_longitude: number;
  check_out_latitude?: number;
  check_out_longitude?: number;
  status: 'present' | 'late' | 'absent';
  student_name?: string;
  student_email?: string;
  class_name?: string;
}

// Hook for teacher to manage their classes
export function useTeacherClasses(teacherId: string) {
  const [classes, setClasses] = useState<Class[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchClasses = async () => {
    try {
      const { data, error } = await supabase
        .from('classes')
        .select(`
          *,
          class_enrollments(count)
        `)
        .eq('teacher_id', teacherId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const classesWithCount = data?.map(cls => ({
        ...cls,
        student_count: cls.class_enrollments?.[0]?.count || 0
      })) || [];

      setClasses(classesWithCount);
    } catch (error: any) {
      console.error('Error fetching classes:', error);
      toast.error('Failed to load classes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClasses();
  }, [teacherId]);

  const createClass = async (classData: {
    name: string;
    code: string;
    location_latitude: number;
    location_longitude: number;
    location_radius: number;
    location_address: string;
    check_in_time?: string;
    check_out_time?: string;
  }) => {
    try {
      const { data, error } = await supabase
        .from('classes')
        .insert([{
          ...classData,
          teacher_id: teacherId,
        }])
        .select()
        .single();

      if (error) throw error;

      setClasses([data, ...classes]);
      toast.success('Class created successfully!');
      return data;
    } catch (error: any) {
      console.error('Error creating class:', error);
      toast.error(error.message || 'Failed to create class');
      throw error;
    }
  };

  return { classes, loading, createClass, refetch: fetchClasses };
}

// Hook for students to manage their enrollments
export function useStudentClasses(studentId: string) {
  const [enrolledClasses, setEnrolledClasses] = useState<EnrolledClass[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchEnrolledClasses = async () => {
    try {
      const { data, error } = await supabase
        .from('class_enrollments')
        .select(`
          *,
          classes (
            *,
            profiles!classes_teacher_id_fkey (name)
          )
        `)
        .eq('student_id', studentId);

      if (error) throw error;

      const classes = data?.map(enrollment => ({
        ...enrollment.classes,
        teacher_name: enrollment.classes.profiles?.name || 'Unknown',
      })) || [];

      setEnrolledClasses(classes);
    } catch (error: any) {
      console.error('Error fetching enrolled classes:', error);
      toast.error('Failed to load classes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEnrolledClasses();
  }, [studentId]);

  const joinClass = async (code: string) => {
    try {
      // Find class by code
      const { data: classData, error: classError } = await supabase
        .from('classes')
        .select('*')
        .eq('code', code)
        .single();

      if (classError) throw new Error('Class not found');

      // Enroll student
      const { error: enrollError } = await supabase
        .from('class_enrollments')
        .insert([{
          class_id: classData.id,
          student_id: studentId,
        }]);

      if (enrollError) {
        if (enrollError.code === '23505') {
          throw new Error('You are already enrolled in this class');
        }
        throw enrollError;
      }

      await fetchEnrolledClasses();
      toast.success('Successfully joined class!');
      return classData;
    } catch (error: any) {
      console.error('Error joining class:', error);
      toast.error(error.message || 'Failed to join class');
      throw error;
    }
  };

  return { enrolledClasses, loading, joinClass, refetch: fetchEnrolledClasses };
}

// Hook for attendance records
export function useAttendance(classId?: string, studentId?: string) {
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAttendance = async () => {
    try {
      let query = supabase
        .from('attendance_records')
        .select(`
          *,
          profiles!attendance_records_student_id_fkey (name, email),
          classes!attendance_records_class_id_fkey (name)
        `)
        .order('check_in_time', { ascending: false });

      if (classId) {
        query = query.eq('class_id', classId);
      }
      if (studentId) {
        query = query.eq('student_id', studentId);
      }

      const { data, error } = await query;

      if (error) throw error;

      const recordsWithDetails = data?.map(record => ({
        ...record,
        student_name: record.profiles?.name,
        student_email: record.profiles?.email,
        class_name: record.classes?.name,
      })) || [];

      setRecords(recordsWithDetails);
    } catch (error: any) {
      console.error('Error fetching attendance:', error);
      toast.error('Failed to load attendance records');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttendance();
  }, [classId, studentId]);

  const checkIn = async (
    classId: string,
    studentId: string,
    latitude: number,
    longitude: number
  ) => {
    try {
      // Fetch class details to check if late
      const { data: classData, error: classError } = await supabase
        .from('classes')
        .select('check_in_time')
        .eq('id', classId)
        .single();

      if (classError) throw classError;

      // Determine status based on check-in time
      let status: 'present' | 'late' | 'absent' = 'present';
      
      if (classData?.check_in_time) {
        const now = new Date();
        const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
        
        // Compare current time with scheduled check-in time
        if (currentTime > classData.check_in_time) {
          status = 'late';
        }
      }

      const { data, error } = await supabase
        .from('attendance_records')
        .insert([{
          class_id: classId,
          student_id: studentId,
          check_in_time: new Date().toISOString(),
          check_in_latitude: latitude,
          check_in_longitude: longitude,
          status: status,
        }])
        .select()
        .single();

      if (error) throw error;

      await fetchAttendance();
      
      if (status === 'late') {
        toast.warning('Checked in - Marked as late');
      } else {
        toast.success('Checked in successfully!');
      }
      
      return data;
    } catch (error: any) {
      console.error('Error checking in:', error);
      toast.error(error.message || 'Failed to check in');
      throw error;
    }
  };

  const checkOut = async (recordId: string, latitude: number, longitude: number) => {
    try {
      // Fetch the attendance record to get the class_id and current status
      const { data: attendanceRecord, error: recordError } = await supabase
        .from('attendance_records')
        .select('class_id, status')
        .eq('id', recordId)
        .single();

      if (recordError) throw recordError;

      // Fetch class details to check checkout time
      const { data: classData, error: classError } = await supabase
        .from('classes')
        .select('check_out_time')
        .eq('id', attendanceRecord.class_id)
        .single();

      if (classError) throw classError;

      // Determine if checkout is late
      let finalStatus = attendanceRecord.status;
      let isLateCheckout = false;

      if (classData?.check_out_time) {
        const now = new Date();
        const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
        
        // If checking out after the deadline, mark as absent
        if (currentTime > classData.check_out_time) {
          finalStatus = 'absent';
          isLateCheckout = true;
        }
      }

      const { error } = await supabase
        .from('attendance_records')
        .update({
          check_out_time: new Date().toISOString(),
          check_out_latitude: latitude,
          check_out_longitude: longitude,
          status: finalStatus,
        })
        .eq('id', recordId);

      if (error) throw error;

      await fetchAttendance();
      
      if (isLateCheckout) {
        toast.error('Checked out too late - Marked as absent');
      } else {
        toast.success('Checked out successfully!');
      }
    } catch (error: any) {
      console.error('Error checking out:', error);
      toast.error(error.message || 'Failed to check out');
      throw error;
    }
  };

  return { records, loading, checkIn, checkOut, refetch: fetchAttendance };
}
