-- =====================================================
-- DIAGNOSTIC SCRIPT - Run this to diagnose issues
-- =====================================================
-- https://app.supabase.com/project/hqsibgdidjpckyuzfmwg/sql

-- =====================================================
-- 1. Check if profiles table exists
-- =====================================================
SELECT EXISTS (
  SELECT FROM information_schema.tables 
  WHERE table_schema = 'public' 
  AND table_name = 'profiles'
);

-- =====================================================
-- 2. Check profiles table structure
-- =====================================================
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'profiles'
ORDER BY ordinal_position;

-- =====================================================
-- 3. View all profiles
-- =====================================================
SELECT id, email, name, role, created_at
FROM profiles
ORDER BY created_at DESC;

-- =====================================================
-- 4. Check auth.users (users who can log in)
-- =====================================================
SELECT id, email, created_at, confirmed_at
FROM auth.users
ORDER BY created_at DESC;

-- =====================================================
-- 5. Find users who are missing profiles
-- =====================================================
SELECT u.id, u.email
FROM auth.users u
LEFT JOIN profiles p ON u.id = p.id
WHERE p.id IS NULL;

-- =====================================================
-- 6. Check RLS policies on profiles table
-- =====================================================
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
FROM pg_policies
WHERE tablename = 'profiles';

-- =====================================================
-- 7. Check if RLS is enabled
-- =====================================================
SELECT tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public'
AND tablename = 'profiles';

-- =====================================================
-- 8. Test if current user can read profiles
-- =====================================================
-- Run this after logging in with your account
-- SELECT * FROM profiles WHERE id = auth.uid();
