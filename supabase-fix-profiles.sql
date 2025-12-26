-- =====================================================
-- FIX SCRIPT - Run this to create missing profiles
-- =====================================================
-- https://app.supabase.com/project/hqsibgdidjpckyuzfmwg/sql

-- =====================================================
-- Create profiles for users who don't have one
-- =====================================================
-- This will create a profile for each auth user who is missing one
-- You'll need to update the role manually or use the app

INSERT INTO profiles (id, email, name, role)
SELECT 
  u.id,
  u.email,
  COALESCE(u.raw_user_meta_data->>'name', SPLIT_PART(u.email, '@', 1)) as name,
  COALESCE(u.raw_user_meta_data->>'role', 'student') as role
FROM auth.users u
LEFT JOIN profiles p ON u.id = p.id
WHERE p.id IS NULL
ON CONFLICT (id) DO NOTHING;

-- =====================================================
-- Verify all users now have profiles
-- =====================================================
SELECT 
  u.id as user_id,
  u.email,
  p.name,
  p.role
FROM auth.users u
LEFT JOIN profiles p ON u.id = p.id
ORDER BY u.created_at DESC;
