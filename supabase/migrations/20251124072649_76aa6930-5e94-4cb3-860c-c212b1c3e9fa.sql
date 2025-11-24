-- Migration: Add admin setup tracking table
-- This table tracks whether initial admin setup has been completed

-- Create admin_setup table to track setup status
CREATE TABLE IF NOT EXISTS public.admin_setup (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  is_setup_complete boolean DEFAULT false,
  setup_completed_at timestamptz,
  setup_completed_by uuid REFERENCES auth.users(id),
  created_at timestamptz DEFAULT NOW(),
  updated_at timestamptz DEFAULT NOW()
);

-- Insert initial setup record (not complete)
INSERT INTO public.admin_setup (is_setup_complete)
SELECT false
WHERE NOT EXISTS (SELECT 1 FROM public.admin_setup);

-- Enable RLS on admin_setup table
ALTER TABLE public.admin_setup ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Allow anonymous users to read setup status
CREATE POLICY "Allow anonymous to read setup status" ON public.admin_setup
  FOR SELECT TO anon
  USING (true);

-- RLS Policy: Allow authenticated users to read setup status
CREATE POLICY "Allow authenticated to read setup status" ON public.admin_setup
  FOR SELECT TO authenticated
  USING (true);

-- RLS Policy: Allow authenticated users to update setup status
CREATE POLICY "Allow authenticated to update setup status" ON public.admin_setup
  FOR UPDATE TO authenticated
  USING (true)
  WITH CHECK (true);

-- Grant permissions
GRANT SELECT ON public.admin_setup TO anon;
GRANT SELECT ON public.admin_setup TO authenticated;
GRANT UPDATE ON public.admin_setup TO authenticated;

-- Migration: Add admin credentials table
-- This table stores default admin credentials for initial setup

-- Create admin_credentials table for storing default admin info
CREATE TABLE IF NOT EXISTS public.admin_credentials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL,
  password_hash text NOT NULL,
  full_name text NOT NULL,
  role text NOT NULL DEFAULT 'super_admin',
  is_used boolean DEFAULT false,
  created_at timestamptz DEFAULT NOW(),
  used_at timestamptz
);

-- Insert default admin credentials
INSERT INTO public.admin_credentials (email, password_hash, full_name, role)
SELECT 
  'nazirfxone@gmail.com',
  '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
  'Nazir Ismail',
  'super_admin'
WHERE NOT EXISTS (
  SELECT 1 FROM public.admin_credentials WHERE email = 'nazirfxone@gmail.com'
);

-- Enable RLS on admin_credentials table
ALTER TABLE public.admin_credentials ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Allow anonymous users to read unused credentials for setup
CREATE POLICY "Allow anonymous to read unused credentials" ON public.admin_credentials
  FOR SELECT TO anon
  USING (is_used = false);

-- RLS Policy: Allow authenticated users to read credentials
CREATE POLICY "Allow authenticated to read credentials" ON public.admin_credentials
  FOR SELECT TO authenticated
  USING (true);

-- RLS Policy: Allow authenticated users to mark credentials as used
CREATE POLICY "Allow authenticated to update credentials usage" ON public.admin_credentials
  FOR UPDATE TO authenticated
  USING (true)
  WITH CHECK (true);

-- Grant permissions
GRANT SELECT ON public.admin_credentials TO anon;
GRANT SELECT ON public.admin_credentials TO authenticated;
GRANT UPDATE ON public.admin_credentials TO authenticated;

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