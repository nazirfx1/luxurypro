-- Migration: Update profiles table RLS for admin setup
-- Allow anonymous users to insert profiles during admin setup

-- Add RLS policy to allow anonymous users to insert profiles during setup
CREATE POLICY "Allow anonymous to insert profiles during setup" ON public.profiles
  FOR INSERT TO anon
  WITH CHECK (true);

-- Add RLS policy to allow anonymous users to read profiles during setup
CREATE POLICY "Allow anonymous to read profiles during setup" ON public.profiles
  FOR SELECT TO anon
  USING (true);

-- Grant insert permission to anonymous users for admin setup
GRANT INSERT ON public.profiles TO anon;
GRANT SELECT ON public.profiles TO anon;