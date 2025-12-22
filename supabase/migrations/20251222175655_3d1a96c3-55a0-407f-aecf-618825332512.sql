-- Create a function to increment view count (security definer to bypass RLS)
CREATE OR REPLACE FUNCTION public.increment_article_view(article_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.articles
  SET view_count = COALESCE(view_count, 0) + 1
  WHERE id = article_id AND is_published = true;
END;
$$;