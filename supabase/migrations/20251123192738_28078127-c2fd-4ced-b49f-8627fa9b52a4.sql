-- ============================================
-- PHASE 2: COMPLETE DATABASE SCHEMA
-- Properties, Clients, Leases, Maintenance, Messages, Financials
-- ============================================

-- 1. PROPERTIES TABLE
CREATE TABLE public.properties (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_by UUID REFERENCES public.profiles(id) NOT NULL,
  owner_id UUID REFERENCES public.profiles(id),
  title TEXT NOT NULL,
  description TEXT,
  address TEXT NOT NULL,
  city TEXT,
  state TEXT,
  zip_code TEXT,
  country TEXT DEFAULT 'USA',
  property_type TEXT, -- residential, commercial, industrial, land
  listing_type TEXT DEFAULT 'sale', -- sale, rent, lease
  price NUMERIC NOT NULL,
  bedrooms INTEGER,
  bathrooms NUMERIC,
  square_feet INTEGER,
  lot_size INTEGER,
  year_built INTEGER,
  status TEXT DEFAULT 'draft', -- draft, active, under_offer, under_review, sold, leased
  features JSONB DEFAULT '[]'::jsonb,
  virtual_tour_url TEXT,
  assigned_agent_id UUID REFERENCES public.profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. PROPERTY MEDIA
CREATE TABLE public.property_media (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID REFERENCES public.properties(id) ON DELETE CASCADE NOT NULL,
  media_url TEXT NOT NULL,
  media_type TEXT DEFAULT 'image', -- image, video, virtual_tour, document
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. CLIENTS (SALES LEADS & PROSPECTS)
CREATE TABLE public.clients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  budget NUMERIC,
  preferred_property_type TEXT,
  preferred_location TEXT,
  status TEXT DEFAULT 'new', -- new, contacted, viewing, negotiating, closed, lost
  notes TEXT,
  created_by UUID REFERENCES public.profiles(id) NOT NULL,
  assigned_agent_id UUID REFERENCES public.profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. CLIENT INTERACTIONS
CREATE TABLE public.client_interactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID REFERENCES public.clients(id) ON DELETE CASCADE NOT NULL,
  interaction_type TEXT NOT NULL, -- call, email, meeting, viewing, offer
  notes TEXT,
  scheduled_date TIMESTAMPTZ,
  completed BOOLEAN DEFAULT false,
  created_by UUID REFERENCES public.profiles(id) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. LEASES
CREATE TABLE public.leases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID REFERENCES public.properties(id) NOT NULL,
  tenant_id UUID REFERENCES public.profiles(id) NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  monthly_rent NUMERIC NOT NULL,
  security_deposit NUMERIC,
  payment_day INTEGER DEFAULT 1,
  status TEXT DEFAULT 'active', -- active, expired, terminated, pending
  terms TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. LEASE DOCUMENTS
CREATE TABLE public.lease_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lease_id UUID REFERENCES public.leases(id) ON DELETE CASCADE NOT NULL,
  file_url TEXT NOT NULL,
  file_name TEXT NOT NULL,
  file_type TEXT,
  version INTEGER DEFAULT 1,
  uploaded_by UUID REFERENCES public.profiles(id) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. MAINTENANCE REQUESTS
CREATE TABLE public.maintenance_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES public.profiles(id) NOT NULL,
  property_id UUID REFERENCES public.properties(id) NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  priority TEXT DEFAULT 'medium', -- low, medium, high, urgent
  status TEXT DEFAULT 'pending', -- pending, scheduled, in_progress, completed, cancelled
  category TEXT, -- plumbing, electrical, hvac, appliance, structural, other
  scheduled_date DATE,
  completed_date DATE,
  assigned_to UUID REFERENCES public.profiles(id),
  estimated_cost NUMERIC,
  actual_cost NUMERIC,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. MAINTENANCE REQUEST MEDIA
CREATE TABLE public.maintenance_media (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id UUID REFERENCES public.maintenance_requests(id) ON DELETE CASCADE NOT NULL,
  media_url TEXT NOT NULL,
  media_type TEXT DEFAULT 'image',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. MESSAGES (SECURE INTERNAL MESSAGING)
CREATE TABLE public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id UUID REFERENCES public.profiles(id) NOT NULL,
  recipient_id UUID REFERENCES public.profiles(id) NOT NULL,
  subject TEXT,
  content TEXT NOT NULL,
  read BOOLEAN DEFAULT false,
  parent_message_id UUID REFERENCES public.messages(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. MESSAGE ATTACHMENTS
CREATE TABLE public.message_attachments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  message_id UUID REFERENCES public.messages(id) ON DELETE CASCADE NOT NULL,
  file_url TEXT NOT NULL,
  file_name TEXT NOT NULL,
  file_type TEXT,
  file_size INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. FINANCIAL RECORDS
CREATE TABLE public.financial_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID REFERENCES public.properties(id),
  type TEXT NOT NULL, -- revenue, expense
  category TEXT NOT NULL, -- rent, tax, maintenance, utilities, insurance, mortgage, repairs, etc.
  amount NUMERIC NOT NULL,
  record_date DATE NOT NULL,
  description TEXT,
  receipt_url TEXT,
  created_by UUID REFERENCES public.profiles(id) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 12. ANALYTICS - PROPERTY METRICS
CREATE TABLE public.analytics_property_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID REFERENCES public.properties(id) NOT NULL,
  metric_date DATE NOT NULL,
  views INTEGER DEFAULT 0,
  inquiries INTEGER DEFAULT 0,
  offers INTEGER DEFAULT 0,
  showings INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(property_id, metric_date)
);

-- ============================================
-- TRIGGERS FOR UPDATED_AT
-- ============================================

CREATE TRIGGER update_properties_updated_at
  BEFORE UPDATE ON public.properties
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_clients_updated_at
  BEFORE UPDATE ON public.clients
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_leases_updated_at
  BEFORE UPDATE ON public.leases
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_maintenance_requests_updated_at
  BEFORE UPDATE ON public.maintenance_requests
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================
-- ROW LEVEL SECURITY POLICIES
-- ============================================

-- PROPERTIES
ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active properties"
  ON public.properties FOR SELECT
  USING (status IN ('active', 'under_offer'));

CREATE POLICY "Property creators can manage their properties"
  ON public.properties FOR ALL
  USING (created_by = auth.uid());

CREATE POLICY "Agents can manage assigned properties"
  ON public.properties FOR ALL
  USING (assigned_agent_id = auth.uid());

CREATE POLICY "Admins can manage all properties"
  ON public.properties FOR ALL
  USING (
    public.has_role(auth.uid(), 'super_admin') OR
    public.has_role(auth.uid(), 'admin') OR
    public.has_role(auth.uid(), 'manager')
  );

-- PROPERTY MEDIA
ALTER TABLE public.property_media ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view property media"
  ON public.property_media FOR SELECT
  USING (true);

CREATE POLICY "Property owners can manage media"
  ON public.property_media FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.properties
      WHERE id = property_media.property_id
      AND (created_by = auth.uid() OR assigned_agent_id = auth.uid())
    )
  );

-- CLIENTS
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their created clients"
  ON public.clients FOR SELECT
  USING (created_by = auth.uid() OR assigned_agent_id = auth.uid());

CREATE POLICY "Users can manage their clients"
  ON public.clients FOR ALL
  USING (created_by = auth.uid() OR assigned_agent_id = auth.uid());

CREATE POLICY "Admins can view all clients"
  ON public.clients FOR SELECT
  USING (
    public.has_role(auth.uid(), 'super_admin') OR
    public.has_role(auth.uid(), 'admin') OR
    public.has_role(auth.uid(), 'manager')
  );

-- CLIENT INTERACTIONS
ALTER TABLE public.client_interactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view interactions for their clients"
  ON public.client_interactions FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.clients
      WHERE id = client_interactions.client_id
      AND (created_by = auth.uid() OR assigned_agent_id = auth.uid())
    )
  );

CREATE POLICY "Users can manage interactions for their clients"
  ON public.client_interactions FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.clients
      WHERE id = client_interactions.client_id
      AND (created_by = auth.uid() OR assigned_agent_id = auth.uid())
    )
  );

-- LEASES
ALTER TABLE public.leases ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Tenants can view their leases"
  ON public.leases FOR SELECT
  USING (tenant_id = auth.uid());

CREATE POLICY "Property owners can view their property leases"
  ON public.leases FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.properties
      WHERE id = leases.property_id
      AND created_by = auth.uid()
    )
  );

CREATE POLICY "Admins can manage all leases"
  ON public.leases FOR ALL
  USING (
    public.has_role(auth.uid(), 'super_admin') OR
    public.has_role(auth.uid(), 'admin') OR
    public.has_role(auth.uid(), 'manager')
  );

-- LEASE DOCUMENTS
ALTER TABLE public.lease_documents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Lease parties can view documents"
  ON public.lease_documents FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.leases
      WHERE id = lease_documents.lease_id
      AND tenant_id = auth.uid()
    ) OR
    EXISTS (
      SELECT 1 FROM public.leases
      JOIN public.properties ON properties.id = leases.property_id
      WHERE leases.id = lease_documents.lease_id
      AND properties.created_by = auth.uid()
    )
  );

-- MAINTENANCE REQUESTS
ALTER TABLE public.maintenance_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Tenants can view and create their requests"
  ON public.maintenance_requests FOR ALL
  USING (tenant_id = auth.uid());

CREATE POLICY "Property managers can view all requests"
  ON public.maintenance_requests FOR SELECT
  USING (
    public.has_role(auth.uid(), 'manager') OR
    public.has_role(auth.uid(), 'admin') OR
    public.has_role(auth.uid(), 'super_admin') OR
    public.has_role(auth.uid(), 'support_staff')
  );

CREATE POLICY "Managers can update requests"
  ON public.maintenance_requests FOR UPDATE
  USING (
    public.has_role(auth.uid(), 'manager') OR
    public.has_role(auth.uid(), 'admin') OR
    public.has_role(auth.uid(), 'super_admin')
  );

-- MAINTENANCE MEDIA
ALTER TABLE public.maintenance_media ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Request creators can view media"
  ON public.maintenance_media FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.maintenance_requests
      WHERE id = maintenance_media.request_id
      AND tenant_id = auth.uid()
    )
  );

CREATE POLICY "Managers can view all maintenance media"
  ON public.maintenance_media FOR SELECT
  USING (
    public.has_role(auth.uid(), 'manager') OR
    public.has_role(auth.uid(), 'admin') OR
    public.has_role(auth.uid(), 'super_admin')
  );

-- MESSAGES
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their messages"
  ON public.messages FOR SELECT
  USING (sender_id = auth.uid() OR recipient_id = auth.uid());

CREATE POLICY "Users can send messages"
  ON public.messages FOR INSERT
  WITH CHECK (sender_id = auth.uid());

-- MESSAGE ATTACHMENTS
ALTER TABLE public.message_attachments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Message parties can view attachments"
  ON public.message_attachments FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.messages
      WHERE id = message_attachments.message_id
      AND (sender_id = auth.uid() OR recipient_id = auth.uid())
    )
  );

-- FINANCIAL RECORDS
ALTER TABLE public.financial_records ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Property owners can view their financial records"
  ON public.financial_records FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.properties
      WHERE id = financial_records.property_id
      AND created_by = auth.uid()
    )
  );

CREATE POLICY "Accountants and admins can view all financial records"
  ON public.financial_records FOR SELECT
  USING (
    public.has_role(auth.uid(), 'accountant') OR
    public.has_role(auth.uid(), 'admin') OR
    public.has_role(auth.uid(), 'super_admin')
  );

CREATE POLICY "Authorized users can manage financial records"
  ON public.financial_records FOR ALL
  USING (
    public.has_role(auth.uid(), 'accountant') OR
    public.has_role(auth.uid(), 'admin') OR
    public.has_role(auth.uid(), 'super_admin') OR
    public.has_role(auth.uid(), 'manager')
  );

-- ANALYTICS
ALTER TABLE public.analytics_property_metrics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Property owners can view their analytics"
  ON public.analytics_property_metrics FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.properties
      WHERE id = analytics_property_metrics.property_id
      AND created_by = auth.uid()
    )
  );

CREATE POLICY "Admins can view all analytics"
  ON public.analytics_property_metrics FOR SELECT
  USING (
    public.has_role(auth.uid(), 'admin') OR
    public.has_role(auth.uid(), 'super_admin') OR
    public.has_role(auth.uid(), 'manager')
  );

-- ============================================
-- INDEXES FOR PERFORMANCE
-- ============================================

CREATE INDEX idx_properties_status ON public.properties(status);
CREATE INDEX idx_properties_assigned_agent ON public.properties(assigned_agent_id);
CREATE INDEX idx_properties_created_by ON public.properties(created_by);
CREATE INDEX idx_property_media_property_id ON public.property_media(property_id);
CREATE INDEX idx_clients_assigned_agent ON public.clients(assigned_agent_id);
CREATE INDEX idx_clients_created_by ON public.clients(created_by);
CREATE INDEX idx_client_interactions_client_id ON public.client_interactions(client_id);
CREATE INDEX idx_leases_property_id ON public.leases(property_id);
CREATE INDEX idx_leases_tenant_id ON public.leases(tenant_id);
CREATE INDEX idx_maintenance_requests_tenant_id ON public.maintenance_requests(tenant_id);
CREATE INDEX idx_maintenance_requests_property_id ON public.maintenance_requests(property_id);
CREATE INDEX idx_messages_sender_id ON public.messages(sender_id);
CREATE INDEX idx_messages_recipient_id ON public.messages(recipient_id);
CREATE INDEX idx_financial_records_property_id ON public.financial_records(property_id);
CREATE INDEX idx_analytics_property_metrics_property_id ON public.analytics_property_metrics(property_id);