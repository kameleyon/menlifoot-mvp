-- Update RLS policies for podcasts to allow editors
DROP POLICY IF EXISTS "Admins can create podcasts" ON public.podcasts;
DROP POLICY IF EXISTS "Admins can update podcasts" ON public.podcasts;
DROP POLICY IF EXISTS "Admins can delete podcasts" ON public.podcasts;

CREATE POLICY "Admins and editors can create podcasts" 
ON public.podcasts 
FOR INSERT 
WITH CHECK (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'editor'));

CREATE POLICY "Admins and editors can update podcasts" 
ON public.podcasts 
FOR UPDATE 
USING (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'editor'));

CREATE POLICY "Admins and editors can delete podcasts" 
ON public.podcasts 
FOR DELETE 
USING (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'editor'));

-- Update RLS policies for articles to allow editors
DROP POLICY IF EXISTS "Admins can manage articles" ON public.articles;

CREATE POLICY "Admins and editors can manage articles" 
ON public.articles 
FOR ALL 
USING (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'editor'))
WITH CHECK (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'editor'));