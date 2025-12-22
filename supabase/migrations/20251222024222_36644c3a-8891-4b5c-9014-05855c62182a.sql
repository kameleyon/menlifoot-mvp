-- Allow anyone to view editor and admin roles for the Editorial feature
CREATE POLICY "Anyone can view editor and admin roles"
ON public.user_roles
FOR SELECT
USING (role IN ('editor', 'admin'));