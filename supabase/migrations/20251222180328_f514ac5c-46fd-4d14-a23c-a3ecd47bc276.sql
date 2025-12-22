-- Allow calling the view-count function from the client (anon + authenticated)
GRANT EXECUTE ON FUNCTION public.increment_article_view(uuid) TO anon, authenticated;