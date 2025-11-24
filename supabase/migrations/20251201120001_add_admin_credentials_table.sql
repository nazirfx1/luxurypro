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
  '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', -- bcrypt hash for 'hacksom-1212'
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