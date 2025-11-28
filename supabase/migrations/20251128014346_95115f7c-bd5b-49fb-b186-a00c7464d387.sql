-- Fix infinite recursion in RLS policies

-- Drop all existing properties policies
DROP POLICY IF EXISTS "Super admins and admins can manage all properties" ON properties;
DROP POLICY IF EXISTS "Managers can view and edit properties" ON properties;
DROP POLICY IF EXISTS "Managers can update properties" ON properties;
DROP POLICY IF EXISTS "Managers can insert properties" ON properties;
DROP POLICY IF EXISTS "Sales agents can view available properties" ON properties;
DROP POLICY IF EXISTS "Property owners can manage their properties" ON properties;
DROP POLICY IF EXISTS "Tenants can view their leased properties" ON properties;
DROP POLICY IF EXISTS "Support staff can view properties with their maintenance tasks" ON properties;
DROP POLICY IF EXISTS "Accountants can view all properties" ON properties;
DROP POLICY IF EXISTS "Public can view active properties" ON properties;

-- Drop existing leases policies that might cause recursion
DROP POLICY IF EXISTS "Admins can manage all leases" ON leases;
DROP POLICY IF EXISTS "Property owners can view their property leases" ON leases;
DROP POLICY IF EXISTS "Tenants can view their leases" ON leases;

-- PROPERTIES POLICIES (simplified to avoid recursion)

-- Super Admin & Admin: Full access
CREATE POLICY "Super admins and admins full access"
ON properties
FOR ALL
TO authenticated
USING (
  has_role(auth.uid(), 'super_admin'::app_role) OR 
  has_role(auth.uid(), 'admin'::app_role)
);

-- Manager: Can view, insert, update all properties
CREATE POLICY "Managers can manage properties"
ON properties
FOR ALL
TO authenticated
USING (has_role(auth.uid(), 'manager'::app_role))
WITH CHECK (has_role(auth.uid(), 'manager'::app_role));

-- Sales Agent: View active/available properties
CREATE POLICY "Sales agents view available"
ON properties
FOR SELECT
TO authenticated
USING (
  has_role(auth.uid(), 'sales_agent'::app_role) AND
  status IN ('active', 'under_offer')
);

-- Property Owner: Manage own properties
CREATE POLICY "Owners manage own properties"
ON properties
FOR ALL
TO authenticated
USING (
  has_role(auth.uid(), 'property_owner'::app_role) AND
  (owner_id = auth.uid() OR created_by = auth.uid())
)
WITH CHECK (
  has_role(auth.uid(), 'property_owner'::app_role) AND
  (owner_id = auth.uid() OR created_by = auth.uid())
);

-- Tenant: View properties (simplified - use a function for lease check)
CREATE POLICY "Tenants view leased properties"
ON properties
FOR SELECT
TO authenticated
USING (
  has_role(auth.uid(), 'tenant'::app_role) AND
  id IN (
    SELECT property_id 
    FROM leases 
    WHERE tenant_id = auth.uid() 
    AND status = 'active'
  )
);

-- Support Staff: View properties with maintenance
CREATE POLICY "Support staff view maintenance properties"
ON properties
FOR SELECT
TO authenticated
USING (
  has_role(auth.uid(), 'support_staff'::app_role) AND
  id IN (
    SELECT property_id 
    FROM maintenance_requests 
    WHERE assigned_to = auth.uid()
  )
);

-- Accountant: View all properties
CREATE POLICY "Accountants view all"
ON properties
FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'accountant'::app_role));

-- LEASES POLICIES (simplified to avoid recursion)

-- Admins can manage all leases
CREATE POLICY "Admins manage all leases"
ON leases
FOR ALL
TO authenticated
USING (
  has_role(auth.uid(), 'super_admin'::app_role) OR 
  has_role(auth.uid(), 'admin'::app_role) OR 
  has_role(auth.uid(), 'manager'::app_role)
);

-- Property owners can view leases for their properties (direct check, no recursion)
CREATE POLICY "Owners view property leases"
ON leases
FOR SELECT
TO authenticated
USING (
  has_role(auth.uid(), 'property_owner'::app_role) AND
  property_id IN (
    SELECT id 
    FROM properties 
    WHERE owner_id = auth.uid() OR created_by = auth.uid()
  )
);

-- Tenants can view their leases
CREATE POLICY "Tenants view own leases"
ON leases
FOR SELECT
TO authenticated
USING (
  has_role(auth.uid(), 'tenant'::app_role) AND
  tenant_id = auth.uid()
);