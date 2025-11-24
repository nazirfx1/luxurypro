-- Migration: Update user_roles table RLS for admin setup
-- Allow anonymous users to insert user roles during admin setup

-- Add RLS policy to allow anonymous users to insert user roles during setup
CREATE POLICY "Allow anonymous to insert user roles during setup" ON public.user_roles
  FOR INSERT TO anon
  WITH CHECK (true);

-- Add RLS policy to allow anonymous users to read user roles
CREATE POLICY "Allow anonymous to read user roles" ON public.user_roles
  FOR SELECT TO anon
  USING (true);

-- Grant insert and select permissions to anonymous users for admin setup
GRANT INSERT ON public.user_roles TO anon;
GRANT SELECT ON public.user_roles TO anon;