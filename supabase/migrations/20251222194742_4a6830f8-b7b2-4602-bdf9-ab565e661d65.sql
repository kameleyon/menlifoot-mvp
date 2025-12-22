-- Enable REPLICA IDENTITY FULL for realtime updates
ALTER TABLE public.articles REPLICA IDENTITY FULL;
ALTER TABLE public.article_likes REPLICA IDENTITY FULL;

-- Add tables to supabase_realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE public.articles;
ALTER PUBLICATION supabase_realtime ADD TABLE public.article_likes;