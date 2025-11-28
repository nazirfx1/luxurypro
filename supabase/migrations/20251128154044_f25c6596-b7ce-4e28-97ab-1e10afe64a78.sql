-- Create property_visits table for booking visits
CREATE TABLE IF NOT EXISTS public.property_visits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID NOT NULL REFERENCES public.properties(id) ON DELETE CASCADE,
  visitor_name TEXT NOT NULL,
  visitor_email TEXT NOT NULL,
  visitor_phone TEXT NOT NULL,
  visit_date DATE NOT NULL,
  visit_time TEXT NOT NULL,
  message TEXT,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT now(),
  created_by UUID REFERENCES auth.users(id)
);

-- Create property_favorites table for wishlist
CREATE TABLE IF NOT EXISTS public.property_favorites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID NOT NULL REFERENCES public.properties(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(property_id, user_id)
);

-- Enable RLS
ALTER TABLE public.property_visits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.property_favorites ENABLE ROW LEVEL SECURITY;

-- RLS Policies for property_visits
CREATE POLICY "Anyone can create visit bookings"
  ON public.property_visits FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Users can view their own bookings"
  ON public.property_visits FOR SELECT
  USING (created_by = auth.uid() OR visitor_email = (SELECT email FROM auth.users WHERE id = auth.uid()));

CREATE POLICY "Admins can view all bookings"
  ON public.property_visits FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM user_roles 
      WHERE user_id = auth.uid() 
      AND role IN ('super_admin', 'admin', 'manager', 'sales_agent')
    )
  );

-- RLS Policies for property_favorites
CREATE POLICY "Users can manage their own favorites"
  ON public.property_favorites FOR ALL
  USING (user_id = auth.uid());

CREATE POLICY "Users can view their favorites"
  ON public.property_favorites FOR SELECT
  USING (user_id = auth.uid());

-- Enable realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.property_visits;
ALTER PUBLICATION supabase_realtime ADD TABLE public.property_favorites;