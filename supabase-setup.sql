-- =====================================================
-- Supabase Database Setup for Attendance System
-- =====================================================
-- Run this in your Supabase SQL Editor:
-- https://app.supabase.com/project/hqsibgdidjpckyuzfmwg/sql

-- =====================================================
-- 1. CREATE PROFILES TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT NOT NULL,
  name TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('teacher', 'student')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 2. CREATE CLASSES TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS classes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  code TEXT UNIQUE NOT NULL,
  teacher_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  location_latitude DOUBLE PRECISION NOT NULL,
  location_longitude DOUBLE PRECISION NOT NULL,
  location_radius INTEGER NOT NULL DEFAULT 100,
  location_address TEXT NOT NULL,
  check_in_time TIME,
  check_out_time TIME,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 3. CREATE CLASS ENROLLMENTS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS class_enrollments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  class_id UUID REFERENCES classes(id) ON DELETE CASCADE NOT NULL,
  student_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  enrolled_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(class_id, student_id)
);

-- =====================================================
-- 4. CREATE ATTENDANCE RECORDS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS attendance_records (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  class_id UUID REFERENCES classes(id) ON DELETE CASCADE NOT NULL,
  student_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  check_in_time TIMESTAMP WITH TIME ZONE NOT NULL,
  check_out_time TIMESTAMP WITH TIME ZONE,
  check_in_latitude DOUBLE PRECISION NOT NULL,
  check_in_longitude DOUBLE PRECISION NOT NULL,
  check_out_latitude DOUBLE PRECISION,
  check_out_longitude DOUBLE PRECISION,
  status TEXT NOT NULL CHECK (status IN ('present', 'late', 'absent')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 5. ENABLE ROW LEVEL SECURITY (RLS)
-- =====================================================
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE class_enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance_records ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- 6. CREATE RLS POLICIES FOR PROFILES
-- =====================================================
-- Users can view their own profile
CREATE POLICY "Users can view their own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- Allow profile creation during signup
CREATE POLICY "Users can insert their own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- =====================================================
-- 7. CREATE RLS POLICIES FOR CLASSES
-- =====================================================
-- Anyone can view classes
CREATE POLICY "Anyone can view classes"
  ON classes FOR SELECT
  TO authenticated
  USING (true);

-- Teachers can create classes
CREATE POLICY "Teachers can create classes"
  ON classes FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'teacher'
    )
  );

-- Teachers can update their own classes
CREATE POLICY "Teachers can update their own classes"
  ON classes FOR UPDATE
  USING (teacher_id = auth.uid());

-- Teachers can delete their own classes
CREATE POLICY "Teachers can delete their own classes"
  ON classes FOR DELETE
  USING (teacher_id = auth.uid());

-- =====================================================
-- 8. CREATE RLS POLICIES FOR CLASS ENROLLMENTS
-- =====================================================
-- Students can view their own enrollments
CREATE POLICY "Students can view their own enrollments"
  ON class_enrollments FOR SELECT
  USING (student_id = auth.uid());

-- Teachers can view enrollments for their classes
CREATE POLICY "Teachers can view enrollments for their classes"
  ON class_enrollments FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM classes
      WHERE classes.id = class_enrollments.class_id
      AND classes.teacher_id = auth.uid()
    )
  );

-- Students can enroll themselves
CREATE POLICY "Students can enroll themselves"
  ON class_enrollments FOR INSERT
  WITH CHECK (student_id = auth.uid());

-- Students can unenroll themselves
CREATE POLICY "Students can unenroll themselves"
  ON class_enrollments FOR DELETE
  USING (student_id = auth.uid());

-- =====================================================
-- 9. CREATE RLS POLICIES FOR ATTENDANCE RECORDS
-- =====================================================
-- Students can view their own attendance
CREATE POLICY "Students can view their own attendance"
  ON attendance_records FOR SELECT
  USING (student_id = auth.uid());

-- Teachers can view attendance for their classes
CREATE POLICY "Teachers can view attendance for their classes"
  ON attendance_records FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM classes
      WHERE classes.id = attendance_records.class_id
      AND classes.teacher_id = auth.uid()
    )
  );

-- Students can create their own attendance records
CREATE POLICY "Students can create their own attendance records"
  ON attendance_records FOR INSERT
  WITH CHECK (student_id = auth.uid());

-- Students can update their own attendance records
CREATE POLICY "Students can update their own attendance records"
  ON attendance_records FOR UPDATE
  USING (student_id = auth.uid());

-- =====================================================
-- 10. CREATE INDEXES FOR BETTER PERFORMANCE
-- =====================================================
CREATE INDEX IF NOT EXISTS idx_classes_teacher_id ON classes(teacher_id);
CREATE INDEX IF NOT EXISTS idx_classes_code ON classes(code);
CREATE INDEX IF NOT EXISTS idx_enrollments_class_id ON class_enrollments(class_id);
CREATE INDEX IF NOT EXISTS idx_enrollments_student_id ON class_enrollments(student_id);
CREATE INDEX IF NOT EXISTS idx_attendance_class_id ON attendance_records(class_id);
CREATE INDEX IF NOT EXISTS idx_attendance_student_id ON attendance_records(student_id);
CREATE INDEX IF NOT EXISTS idx_attendance_check_in_time ON attendance_records(check_in_time);

-- =====================================================
-- 11. CREATE FUNCTION TO AUTO-UPDATE updated_at
-- =====================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- 12. CREATE TRIGGERS FOR AUTO-UPDATE
-- =====================================================
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_classes_updated_at
  BEFORE UPDATE ON classes
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- SETUP COMPLETE!
-- =====================================================
-- Your database is now ready for the Attendance System.
-- Make sure to restart your Next.js dev server after running this.
