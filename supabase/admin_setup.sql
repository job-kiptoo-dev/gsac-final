-- ============================================================
-- GSAC Admin Setup & Troubleshooting SQL
-- Run these commands ONE AT A TIME in the Supabase SQL Editor
-- ============================================================

-- ─────────────────────────────────────────────────────────────────
-- STEP 1: After creating your admin user via Auth > Users dashboard,
-- promote them to admin role. Replace the email below.
-- ─────────────────────────────────────────────────────────────────
UPDATE profiles SET role = 'admin' WHERE email = 'admin@gsac.org';

-- Verify it worked:
SELECT id, email, name, role FROM profiles WHERE email = 'admin@gsac.org';


-- ─────────────────────────────────────────────────────────────────
-- STEP 2: If login button hangs/spins forever, check if the profile
-- row was created. If missing, insert it manually:
-- ─────────────────────────────────────────────────────────────────
-- First check if profile exists:
SELECT * FROM profiles WHERE email = 'admin@gsac.org';

-- If no row, insert manually using the user's UUID from auth.users:
-- INSERT INTO profiles (id, email, name, role)
-- SELECT id, email, COALESCE(raw_user_meta_data->>'name', split_part(email,'@',1)), 'admin'
-- FROM auth.users WHERE email = 'admin@gsac.org'
-- ON CONFLICT (id) DO UPDATE SET role = 'admin';


-- ─────────────────────────────────────────────────────────────────
-- STEP 3: "Failed to create user: {}" (or a blank/generic error) when
-- adding a user via Auth > Users, or signUp() failing with a 500 —
-- this is almost always the same root cause:
--
-- The on_auth_user_created trigger runs as the supabase_auth_admin
-- role, and that role's default search_path does NOT include "public".
-- So the trigger's unqualified "profiles" reference fails to resolve,
-- the trigger throws, and Postgres rolls back the ENTIRE auth.users
-- insert — which is why the dashboard shows an empty/near-empty error.
--
-- Fix: recreate the function schema-qualified with search_path pinned.
-- (schema.sql already has this fix baked in if you're running it fresh —
-- this block is here for existing projects that need to patch in place.)
-- ─────────────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'role', 'user')
  )
  ON CONFLICT (id) DO NOTHING;  -- Safe: skip if profile already exists
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Also worth checking: Authentication > Providers > Email > "Confirm email"
-- setting, and whether a profile row already exists for that email
-- (a leftover row from a previously-failed attempt can also cause this).


-- ─────────────────────────────────────────────────────────────────
-- STEP 4: Check all RLS policies are in place
-- ─────────────────────────────────────────────────────────────────
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname;

-- ─────────────────────────────────────────────────────────────────
-- STEP 5: Verify is_admin() function works for your admin user
-- (Replace the UUID with your admin's actual UUID from auth.users)
-- ─────────────────────────────────────────────────────────────────
-- SELECT is_admin();  -- run this while logged in as admin via Supabase SQL Editor


-- ─────────────────────────────────────────────────────────────────
-- STEP 6: Check existing users and their roles
-- ─────────────────────────────────────────────────────────────────
SELECT 
  p.id, 
  p.email, 
  p.name, 
  p.role, 
  p.created_at,
  u.email_confirmed_at IS NOT NULL AS email_confirmed
FROM profiles p
JOIN auth.users u ON u.id = p.id
ORDER BY p.created_at DESC;


-- ─────────────────────────────────────────────────────────────────
-- STEP 7: Full reset — drop ALL policies and recreate (if needed)
-- Only run this if you need to completely reset RLS
-- ─────────────────────────────────────────────────────────────────
/*
DO $$
DECLARE
  r RECORD;
BEGIN
  FOR r IN (SELECT policyname, tablename FROM pg_policies WHERE schemaname = 'public') LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON %I', r.policyname, r.tablename);
  END LOOP;
END $$;
*/
-- Then re-run the RLS section from schema.sql
