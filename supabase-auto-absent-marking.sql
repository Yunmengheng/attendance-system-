-- =====================================================
-- Auto-mark Absent Students
-- =====================================================
-- This function marks students as absent if they didn't check in for a class
-- Run this in your Supabase SQL Editor
-- https://app.supabase.com/project/hqsibgdidjpckyuzfmwg/sql

-- Function to auto-mark absent students for a specific class and date
CREATE OR REPLACE FUNCTION mark_absent_students(
  p_class_id UUID,
  p_date DATE DEFAULT CURRENT_DATE
)
RETURNS void AS $$
BEGIN
  -- Insert absent records for enrolled students who didn't check in
  INSERT INTO attendance_records (
    class_id,
    student_id,
    check_in_time,
    check_in_latitude,
    check_in_longitude,
    status
  )
  SELECT 
    p_class_id,
    ce.student_id,
    (p_date + INTERVAL '23 hours 59 minutes')::timestamp,  -- End of day
    0,  -- Dummy latitude
    0,  -- Dummy longitude
    'absent'::text
  FROM class_enrollments ce
  WHERE ce.class_id = p_class_id
    AND NOT EXISTS (
      SELECT 1 
      FROM attendance_records ar
      WHERE ar.class_id = p_class_id
        AND ar.student_id = ce.student_id
        AND DATE(ar.check_in_time) = p_date
    );
END;
$$ LANGUAGE plpgsql;

-- Function to auto-mark absent students for all classes for a specific date
CREATE OR REPLACE FUNCTION mark_all_absent_students(
  p_date DATE DEFAULT CURRENT_DATE
)
RETURNS void AS $$
DECLARE
  class_record RECORD;
BEGIN
  -- Loop through all classes
  FOR class_record IN 
    SELECT id FROM classes
  LOOP
    PERFORM mark_absent_students(class_record.id, p_date);
  END LOOP;
END;
$$ LANGUAGE plpgsql;

-- Optional: Create a cron job to run this daily at 11:59 PM
-- This requires the pg_cron extension (available in Supabase Pro)
-- Uncomment the lines below if you have pg_cron enabled:

-- SELECT cron.schedule(
--   'mark-absent-students-daily',
--   '59 23 * * *',  -- Every day at 11:59 PM
--   $$SELECT mark_all_absent_students(CURRENT_DATE);$$
-- );

-- Manual usage examples:
-- Mark absent for a specific class today:
-- SELECT mark_absent_students('class-uuid-here');

-- Mark absent for a specific class on a specific date:
-- SELECT mark_absent_students('class-uuid-here', '2024-12-26');

-- Mark absent for all classes today:
-- SELECT mark_all_absent_students();

-- Mark absent for all classes on a specific date:
-- SELECT mark_all_absent_students('2024-12-26');
