# Disable Email Confirmation in Supabase (Development Only)

## Steps:

1. Go to your Supabase Dashboard:
   https://app.supabase.com/project/hqsibgdidjpckyuzfmwg/auth/providers

2. Scroll down to **"Email Auth"** section

3. Click on **"Email Auth"** to expand settings

4. Find the toggle for **"Enable email confirmations"**

5. **Turn OFF** "Enable email confirmations"

6. Click **Save**

## Alternative: Manual Confirmation

If you want to keep email confirmations enabled, you can manually confirm users:

1. Go to: https://app.supabase.com/project/hqsibgdidjpckyuzfmwg/auth/users

2. Find the user in the list

3. Click the "..." menu next to the user

4. Select "Confirm Email"

## Or Use SQL to Auto-Confirm All Users:

Run this in SQL Editor:
```sql
-- Auto-confirm all pending users
UPDATE auth.users 
SET email_confirmed_at = NOW(), 
    confirmed_at = NOW()
WHERE email_confirmed_at IS NULL;
```

## After Making Changes:

1. Clear browser cache and cookies for localhost
2. Restart your Next.js dev server
3. Try signing up again

---

**Note:** Email confirmation is important for production. Only disable it during development.
