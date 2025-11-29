-- Allow public (anonymous) users to view active properties
CREATE POLICY "Anyone can view active properties"
ON properties
FOR SELECT
TO anon, authenticated
USING (status = 'active');