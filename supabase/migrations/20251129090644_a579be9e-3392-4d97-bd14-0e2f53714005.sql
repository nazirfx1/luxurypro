-- Add is_featured column to properties table
ALTER TABLE public.properties 
ADD COLUMN IF NOT EXISTS is_featured boolean DEFAULT false;

-- Create bookings table
CREATE TABLE IF NOT EXISTS public.bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id uuid REFERENCES public.properties(id) ON DELETE CASCADE NOT NULL,
  client_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  visitor_name text NOT NULL,
  visitor_email text NOT NULL,
  visitor_phone text NOT NULL,
  status text CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed')) DEFAULT 'pending',
  start_date date NOT NULL,
  end_date date,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS on bookings
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- RLS Policies for bookings
CREATE POLICY "Users can view their own bookings"
  ON public.bookings
  FOR SELECT
  USING (
    client_id = auth.uid() 
    OR visitor_email = (SELECT email FROM auth.users WHERE id = auth.uid())
  );

CREATE POLICY "Anyone can create bookings"
  ON public.bookings
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Admins and managers can view all bookings"
  ON public.bookings
  FOR SELECT
  USING (
    has_role(auth.uid(), 'super_admin'::app_role) 
    OR has_role(auth.uid(), 'admin'::app_role)
    OR has_role(auth.uid(), 'manager'::app_role)
    OR has_role(auth.uid(), 'sales_agent'::app_role)
  );

CREATE POLICY "Admins and managers can update bookings"
  ON public.bookings
  FOR UPDATE
  USING (
    has_role(auth.uid(), 'super_admin'::app_role) 
    OR has_role(auth.uid(), 'admin'::app_role)
    OR has_role(auth.uid(), 'manager'::app_role)
  );

-- Update RLS policy for property creation to include is_featured field
CREATE POLICY "Managers can toggle featured status"
  ON public.properties
  FOR UPDATE
  USING (
    has_role(auth.uid(), 'super_admin'::app_role) 
    OR has_role(auth.uid(), 'admin'::app_role)
    OR has_role(auth.uid(), 'manager'::app_role)
    OR has_role(auth.uid(), 'sales_agent'::app_role)
  );

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_properties_featured ON public.properties(is_featured) WHERE is_featured = true;
CREATE INDEX IF NOT EXISTS idx_properties_status_created ON public.properties(status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_bookings_property ON public.bookings(property_id);
CREATE INDEX IF NOT EXISTS idx_bookings_client ON public.bookings(client_id);

-- Trigger to update updated_at on bookings
CREATE OR REPLACE FUNCTION public.update_bookings_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_bookings_updated_at_trigger
  BEFORE UPDATE ON public.bookings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_bookings_updated_at();