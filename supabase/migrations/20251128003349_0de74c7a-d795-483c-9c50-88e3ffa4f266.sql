-- Create permissions table
CREATE TABLE IF NOT EXISTS public.permissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  module TEXT NOT NULL, -- Dashboard, Users, Analytics, Settings, etc.
  action TEXT NOT NULL, -- create, read, update, delete, manage
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create role_permissions mapping table
CREATE TABLE IF NOT EXISTS public.role_permissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  role app_role NOT NULL,
  permission_id UUID NOT NULL REFERENCES public.permissions(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(role, permission_id)
);

-- Create activity_logs table for audit tracking
CREATE TABLE IF NOT EXISTS public.activity_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  action TEXT NOT NULL, -- login, logout, create_user, update_user, delete_user, etc.
  entity_type TEXT, -- user, role, permission, etc.
  entity_id UUID,
  details JSONB, -- Store before/after values, metadata
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create login_history table
CREATE TABLE IF NOT EXISTS public.login_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  success BOOLEAN NOT NULL DEFAULT true,
  ip_address TEXT,
  user_agent TEXT,
  device_info JSONB,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Add additional columns to profiles table for user management
ALTER TABLE public.profiles 
  ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended')),
  ADD COLUMN IF NOT EXISTS department TEXT,
  ADD COLUMN IF NOT EXISTS last_login_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ; -- For soft delete

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_activity_logs_user_id ON public.activity_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_activity_logs_created_at ON public.activity_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_login_history_user_id ON public.login_history(user_id);
CREATE INDEX IF NOT EXISTS idx_login_history_created_at ON public.login_history(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_profiles_status ON public.profiles(status);
CREATE INDEX IF NOT EXISTS idx_profiles_deleted_at ON public.profiles(deleted_at) WHERE deleted_at IS NULL;

-- Enable Row Level Security
ALTER TABLE public.permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.role_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.login_history ENABLE ROW LEVEL SECURITY;

-- RLS Policies for permissions table
CREATE POLICY "Anyone can view permissions"
  ON public.permissions FOR SELECT
  USING (true);

CREATE POLICY "Super admins can manage permissions"
  ON public.permissions FOR ALL
  USING (has_role(auth.uid(), 'super_admin'::app_role));

-- RLS Policies for role_permissions table
CREATE POLICY "Anyone can view role permissions"
  ON public.role_permissions FOR SELECT
  USING (true);

CREATE POLICY "Super admins can manage role permissions"
  ON public.role_permissions FOR ALL
  USING (has_role(auth.uid(), 'super_admin'::app_role));

-- RLS Policies for activity_logs
CREATE POLICY "Admins can view all activity logs"
  ON public.activity_logs FOR SELECT
  USING (has_role(auth.uid(), 'super_admin'::app_role) OR has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Users can view their own activity logs"
  ON public.activity_logs FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "System can insert activity logs"
  ON public.activity_logs FOR INSERT
  WITH CHECK (true);

-- RLS Policies for login_history
CREATE POLICY "Admins can view all login history"
  ON public.login_history FOR SELECT
  USING (has_role(auth.uid(), 'super_admin'::app_role) OR has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Users can view their own login history"
  ON public.login_history FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "System can insert login history"
  ON public.login_history FOR INSERT
  WITH CHECK (true);

-- Insert default permissions
INSERT INTO public.permissions (name, description, module, action) VALUES
  -- User Management
  ('users.create', 'Create new users', 'Users', 'create'),
  ('users.read', 'View users', 'Users', 'read'),
  ('users.update', 'Update user details', 'Users', 'update'),
  ('users.delete', 'Delete users', 'Users', 'delete'),
  ('users.manage_roles', 'Assign/remove roles', 'Users', 'manage'),
  ('users.activate', 'Activate/deactivate users', 'Users', 'manage'),
  ('users.suspend', 'Suspend/unsuspend users', 'Users', 'manage'),
  
  -- Role Management
  ('roles.create', 'Create new roles', 'Roles', 'create'),
  ('roles.read', 'View roles', 'Roles', 'read'),
  ('roles.update', 'Update roles', 'Roles', 'update'),
  ('roles.delete', 'Delete roles', 'Roles', 'delete'),
  ('roles.manage_permissions', 'Manage role permissions', 'Roles', 'manage'),
  
  -- Analytics
  ('analytics.read', 'View analytics', 'Analytics', 'read'),
  ('analytics.export', 'Export analytics data', 'Analytics', 'export'),
  
  -- Activity Logs
  ('logs.read', 'View activity logs', 'Logs', 'read'),
  ('logs.export', 'Export activity logs', 'Logs', 'export'),
  
  -- Settings
  ('settings.read', 'View settings', 'Settings', 'read'),
  ('settings.update', 'Update settings', 'Settings', 'update'),
  
  -- Dashboard
  ('dashboard.read', 'View dashboard', 'Dashboard', 'read')
ON CONFLICT (name) DO NOTHING;

-- Function to check if user has permission
CREATE OR REPLACE FUNCTION public.has_permission(_user_id UUID, _permission_name TEXT)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles ur
    JOIN public.role_permissions rp ON rp.role = ur.role
    JOIN public.permissions p ON p.id = rp.permission_id
    WHERE ur.user_id = _user_id
      AND p.name = _permission_name
  )
$$;

-- Function to get user permissions
CREATE OR REPLACE FUNCTION public.get_user_permissions(_user_id UUID)
RETURNS TABLE (
  permission_name TEXT,
  permission_description TEXT,
  module TEXT,
  action TEXT
)
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT DISTINCT p.name, p.description, p.module, p.action
  FROM public.user_roles ur
  JOIN public.role_permissions rp ON rp.role = ur.role
  JOIN public.permissions p ON p.id = rp.permission_id
  WHERE ur.user_id = _user_id
  ORDER BY p.module, p.action
$$;

-- Function to log activity
CREATE OR REPLACE FUNCTION public.log_activity(
  _user_id UUID,
  _action TEXT,
  _entity_type TEXT DEFAULT NULL,
  _entity_id UUID DEFAULT NULL,
  _details JSONB DEFAULT NULL,
  _ip_address TEXT DEFAULT NULL,
  _user_agent TEXT DEFAULT NULL
)
RETURNS UUID
LANGUAGE PLPGSQL
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  log_id UUID;
BEGIN
  INSERT INTO public.activity_logs (
    user_id, action, entity_type, entity_id, details, ip_address, user_agent
  )
  VALUES (
    _user_id, _action, _entity_type, _entity_id, _details, _ip_address, _user_agent
  )
  RETURNING id INTO log_id;
  
  RETURN log_id;
END;
$$;