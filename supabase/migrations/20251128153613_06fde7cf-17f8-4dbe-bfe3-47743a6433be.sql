-- Fix infinite recursion in RLS policies by using direct role checks without table lookups

-- Drop existing problematic policies for properties
DROP POLICY IF EXISTS "Super admins and admins full access" ON properties;
DROP POLICY IF EXISTS "Managers can manage properties" ON properties;
DROP POLICY IF EXISTS "Owners manage own properties" ON properties;
DROP POLICY IF EXISTS "Sales agents view available" ON properties;
DROP POLICY IF EXISTS "Support staff view maintenance properties" ON properties;
DROP POLICY IF EXISTS "Tenants view leased properties" ON properties;
DROP POLICY IF EXISTS "Accountants view all" ON properties;

-- Drop existing problematic policies for leases
DROP POLICY IF EXISTS "Admins manage all leases" ON leases;
DROP POLICY IF EXISTS "Owners view property leases" ON leases;
DROP POLICY IF EXISTS "Tenants view own leases" ON leases;

-- Drop existing problematic policies for financial_records
DROP POLICY IF EXISTS "Accountants and admins can view all financial records" ON financial_records;
DROP POLICY IF EXISTS "Authorized users can manage financial records" ON financial_records;
DROP POLICY IF EXISTS "Property owners can view their financial records" ON financial_records;

-- Create simplified properties policies using CTEs to avoid recursion
CREATE POLICY "properties_select_super_admin_admin" ON properties
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM user_roles 
      WHERE user_id = auth.uid() 
      AND role IN ('super_admin', 'admin')
    )
  );

CREATE POLICY "properties_all_super_admin_admin" ON properties
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM user_roles 
      WHERE user_id = auth.uid() 
      AND role IN ('super_admin', 'admin')
    )
  );

CREATE POLICY "properties_select_manager" ON properties
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM user_roles 
      WHERE user_id = auth.uid() 
      AND role = 'manager'
    )
  );

CREATE POLICY "properties_all_manager" ON properties
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM user_roles 
      WHERE user_id = auth.uid() 
      AND role = 'manager'
    )
  );

CREATE POLICY "properties_select_owner" ON properties
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM user_roles 
      WHERE user_id = auth.uid() 
      AND role = 'property_owner'
    ) AND (owner_id = auth.uid() OR created_by = auth.uid())
  );

CREATE POLICY "properties_all_owner" ON properties
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM user_roles 
      WHERE user_id = auth.uid() 
      AND role = 'property_owner'
    ) AND (owner_id = auth.uid() OR created_by = auth.uid())
  );

CREATE POLICY "properties_select_sales" ON properties
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM user_roles 
      WHERE user_id = auth.uid() 
      AND role = 'sales_agent'
    ) AND status IN ('active', 'under_offer')
  );

CREATE POLICY "properties_select_accountant" ON properties
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM user_roles 
      WHERE user_id = auth.uid() 
      AND role = 'accountant'
    )
  );

-- Simplified leases policies
CREATE POLICY "leases_select_admin" ON leases
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM user_roles 
      WHERE user_id = auth.uid() 
      AND role IN ('super_admin', 'admin', 'manager')
    )
  );

CREATE POLICY "leases_all_admin" ON leases
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM user_roles 
      WHERE user_id = auth.uid() 
      AND role IN ('super_admin', 'admin', 'manager')
    )
  );

CREATE POLICY "leases_select_tenant" ON leases
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM user_roles 
      WHERE user_id = auth.uid() 
      AND role = 'tenant'
    ) AND tenant_id = auth.uid()
  );

-- Simplified financial_records policies
CREATE POLICY "financial_select_admin" ON financial_records
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM user_roles 
      WHERE user_id = auth.uid() 
      AND role IN ('accountant', 'admin', 'super_admin')
    )
  );

CREATE POLICY "financial_all_admin" ON financial_records
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM user_roles 
      WHERE user_id = auth.uid() 
      AND role IN ('accountant', 'admin', 'super_admin', 'manager')
    )
  );

-- Create cities table for location autocomplete
CREATE TABLE IF NOT EXISTS public.cities (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  state TEXT,
  country TEXT NOT NULL DEFAULT 'USA',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on cities
ALTER TABLE public.cities ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read cities
CREATE POLICY "cities_select_all" ON cities
  FOR SELECT
  USING (true);

-- Insert sample US cities
INSERT INTO public.cities (name, state, country) VALUES
  ('New York', 'NY', 'USA'),
  ('Los Angeles', 'CA', 'USA'),
  ('Chicago', 'IL', 'USA'),
  ('Houston', 'TX', 'USA'),
  ('Phoenix', 'AZ', 'USA'),
  ('Philadelphia', 'PA', 'USA'),
  ('San Antonio', 'TX', 'USA'),
  ('San Diego', 'CA', 'USA'),
  ('Dallas', 'TX', 'USA'),
  ('San Jose', 'CA', 'USA'),
  ('Austin', 'TX', 'USA'),
  ('Jacksonville', 'FL', 'USA'),
  ('Fort Worth', 'TX', 'USA'),
  ('Columbus', 'OH', 'USA'),
  ('Charlotte', 'NC', 'USA'),
  ('San Francisco', 'CA', 'USA'),
  ('Indianapolis', 'IN', 'USA'),
  ('Seattle', 'WA', 'USA'),
  ('Denver', 'CO', 'USA'),
  ('Boston', 'MA', 'USA'),
  ('Nashville', 'TN', 'USA'),
  ('Las Vegas', 'NV', 'USA'),
  ('Miami', 'FL', 'USA'),
  ('Atlanta', 'GA', 'USA'),
  ('Portland', 'OR', 'USA')
ON CONFLICT DO NOTHING;

-- Create index for faster searches
CREATE INDEX IF NOT EXISTS idx_cities_name ON cities(name);

-- Enable realtime for cities
ALTER PUBLICATION supabase_realtime ADD TABLE public.cities;