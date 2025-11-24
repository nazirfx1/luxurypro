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