-- =====================================================
-- Clean up duplicate profiles and fix data issues
-- =====================================================
-- Run this in your Supabase SQL Editor if you have issues
-- https://app.supabase.com/project/hqsibgdidjpckyuzfmwg/sql

-- =====================================================
-- 1. First, check for duplicate profiles
-- =====================================================
SELECT id, email, name, role, created_at, COUNT(*) as count
FROM profiles
GROUP BY id, email, name, role, created_at
HAVING COUNT(*) > 1;

-- =====================================================
-- 2. View all profiles to see duplicates
-- =====================================================
SELECT id, email, name, role, created_at
FROM profiles
ORDER BY id, created_at;

-- =====================================================
-- 3. Delete duplicate profiles (keep only the first one)
-- =====================================================
-- This uses the ctid (physical row identifier) to keep only the oldest row
DELETE FROM profiles
WHERE ctid NOT IN (
  SELECT MIN(ctid)
  FROM profiles
  GROUP BY id
);

-- =====================================================
-- 4. Verify cleanup - this should return no rows
-- =====================================================
SELECT id, email, COUNT(*) as count
FROM profiles
GROUP BY id, email
HAVING COUNT(*) > 1;

-- =====================================================
-- 5. Check final profiles table
-- =====================================================
SELECT * FROM profiles ORDER BY created_at DESC;
