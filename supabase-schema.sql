-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('teacher', 'student')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Create classes table
CREATE TABLE IF NOT EXISTS classes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  code TEXT UNIQUE NOT NULL,
  teacher_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  location_latitude DOUBLE PRECISION NOT NULL,
  location_longitude DOUBLE PRECISION NOT NULL,
  location_radius INTEGER NOT NULL DEFAULT 100,
  location_address TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Create class_enrollments table
CREATE TABLE IF NOT EXISTS class_enrollments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  class_id UUID NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  enrolled_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  UNIQUE(class_id, student_id)
);

-- Create attendance_records table
CREATE TABLE IF NOT EXISTS attendance_records (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  class_id UUID NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  check_in_time TIMESTAMP WITH TIME ZONE NOT NULL,
  check_out_time TIMESTAMP WITH TIME ZONE,
  check_in_latitude DOUBLE PRECISION NOT NULL,
  check_in_longitude DOUBLE PRECISION NOT NULL,
  check_out_latitude DOUBLE PRECISION,
  check_out_longitude DOUBLE PRECISION,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_classes_teacher_id ON classes(teacher_id);
CREATE INDEX IF NOT EXISTS idx_class_enrollments_class_id ON class_enrollments(class_id);
CREATE INDEX IF NOT EXISTS idx_class_enrollments_student_id ON class_enrollments(student_id);
CREATE INDEX IF NOT EXISTS idx_attendance_records_class_id ON attendance_records(class_id);
CREATE INDEX IF NOT EXISTS idx_attendance_records_student_id ON attendance_records(student_id);
CREATE INDEX IF NOT EXISTS idx_attendance_records_check_in_time ON attendance_records(check_in_time);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc', NOW());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_classes_updated_at BEFORE UPDATE ON classes
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS) Policies
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE class_enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance_records ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view their own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- Classes policies
CREATE POLICY "Teachers can create classes" ON classes
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role = 'teacher'
    )
  );

CREATE POLICY "Teachers can view their own classes" ON classes
  FOR SELECT USING (teacher_id = auth.uid());

CREATE POLICY "Students can view enrolled classes" ON classes
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM class_enrollments 
      WHERE class_id = classes.id AND student_id = auth.uid()
    )
  );

CREATE POLICY "Teachers can update their own classes" ON classes
  FOR UPDATE USING (teacher_id = auth.uid());

CREATE POLICY "Teachers can delete their own classes" ON classes
  FOR DELETE USING (teacher_id = auth.uid());

-- Class enrollments policies
CREATE POLICY "Students can enroll in classes" ON class_enrollments
  FOR INSERT WITH CHECK (student_id = auth.uid());

CREATE POLICY "Teachers can view enrollments for their classes" ON class_enrollments
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM classes 
      WHERE classes.id = class_enrollments.class_id 
      AND classes.teacher_id = auth.uid()
    )
  );

CREATE POLICY "Students can view their own enrollments" ON class_enrollments
  FOR SELECT USING (student_id = auth.uid());

CREATE POLICY "Students can unenroll from classes" ON class_enrollments
  FOR DELETE USING (student_id = auth.uid());

-- Attendance records policies
CREATE POLICY "Students can create attendance records" ON attendance_records
  FOR INSERT WITH CHECK (
    student_id = auth.uid() AND
    EXISTS (
      SELECT 1 FROM class_enrollments 
      WHERE class_id = attendance_records.class_id 
      AND student_id = auth.uid()
    )
  );

CREATE POLICY "Students can update their own attendance records" ON attendance_records
  FOR UPDATE USING (student_id = auth.uid());

CREATE POLICY "Teachers can view attendance for their classes" ON attendance_records
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM classes 
      WHERE classes.id = attendance_records.class_id 
      AND classes.teacher_id = auth.uid()
    )
  );

CREATE POLICY "Students can view their own attendance records" ON attendance_records
  FOR SELECT USING (student_id = auth.uid());

-- Function to generate unique class code
CREATE OR REPLACE FUNCTION generate_class_code()
RETURNS TEXT AS $$
DECLARE
  chars TEXT := 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  result TEXT := '';
  i INTEGER := 0;
BEGIN
  FOR i IN 1..6 LOOP
    result := result || substr(chars, floor(random() * length(chars) + 1)::integer, 1);
  END LOOP;
  RETURN result;
END;
$$ LANGUAGE plpgsql;
