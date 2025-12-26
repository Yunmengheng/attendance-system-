-- =====================================================
-- Add Check-in and Check-out Times to Classes Table
-- =====================================================
-- Run this in your Supabase SQL Editor to update existing database:
-- https://app.supabase.com/project/hqsibgdidjpckyuzfmwg/sql

-- Add check-in and check-out time columns to classes table
ALTER TABLE classes
ADD COLUMN IF NOT EXISTS check_in_time TIME,
ADD COLUMN IF NOT EXISTS check_out_time TIME;

-- Optional: Add comment to document the columns
COMMENT ON COLUMN classes.check_in_time IS 'Time when students can start checking in (optional)';
COMMENT ON COLUMN classes.check_out_time IS 'Time when students must check out by (optional)';
