-- Enhanced RLS policies for role-based property access

-- Drop existing policies
DROP POLICY IF EXISTS "Admins can manage all properties" ON properties;
DROP POLICY IF EXISTS "Agents can manage assigned properties" ON properties;
DROP POLICY IF EXISTS "Anyone can view active properties" ON properties;
DROP POLICY IF EXISTS "Property creators can manage their properties" ON properties;

-- Super Admin & Admin: Full access to all properties
CREATE POLICY "Super admins and admins can manage all properties"
ON properties
FOR ALL
TO authenticated
USING (
  has_role(auth.uid(), 'super_admin'::app_role) OR 
  has_role(auth.uid(), 'admin'::app_role)
);

-- Manager: Can view and edit all properties, cannot delete
CREATE POLICY "Managers can view and edit properties"
ON properties
FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'manager'::app_role));

CREATE POLICY "Managers can update properties"
ON properties
FOR UPDATE
TO authenticated
USING (has_role(auth.uid(), 'manager'::app_role));

CREATE POLICY "Managers can insert properties"
ON properties
FOR INSERT
TO authenticated
WITH CHECK (has_role(auth.uid(), 'manager'::app_role));

-- Sales Agent: View active/available properties only
CREATE POLICY "Sales agents can view available properties"
ON properties
FOR SELECT
TO authenticated
USING (
  has_role(auth.uid(), 'sales_agent'::app_role) AND
  status IN ('active', 'under_offer')
);

-- Property Owner: View and manage only their own properties
CREATE POLICY "Property owners can manage their properties"
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

-- Tenant: View only properties they have active leases on
CREATE POLICY "Tenants can view their leased properties"
ON properties
FOR SELECT
TO authenticated
USING (
  has_role(auth.uid(), 'tenant'::app_role) AND
  EXISTS (
    SELECT 1 FROM leases
    WHERE leases.property_id = properties.id
    AND leases.tenant_id = auth.uid()
    AND leases.status = 'active'
  )
);

-- Support Staff: View properties with maintenance requests assigned to them
CREATE POLICY "Support staff can view properties with their maintenance tasks"
ON properties
FOR SELECT
TO authenticated
USING (
  has_role(auth.uid(), 'support_staff'::app_role) AND
  EXISTS (
    SELECT 1 FROM maintenance_requests
    WHERE maintenance_requests.property_id = properties.id
    AND maintenance_requests.assigned_to = auth.uid()
  )
);

-- Accountant: View all properties (read-only for financial reporting)
CREATE POLICY "Accountants can view all properties"
ON properties
FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'accountant'::app_role));

-- Public: Anyone can view active properties
CREATE POLICY "Public can view active properties"
ON properties
FOR SELECT
TO authenticated
USING (status IN ('active', 'under_offer'));