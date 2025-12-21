-- Create article_likes table to track user likes
CREATE TABLE public.article_likes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  article_id UUID NOT NULL REFERENCES public.articles(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(article_id, user_id)
);

-- Enable RLS
ALTER TABLE public.article_likes ENABLE ROW LEVEL SECURITY;

-- Anyone can view likes count (for display)
CREATE POLICY "Anyone can view article likes"
ON public.article_likes
FOR SELECT
USING (true);

-- Authenticated users can like articles
CREATE POLICY "Authenticated users can like articles"
ON public.article_likes
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Users can unlike their own likes
CREATE POLICY "Users can remove their own likes"
ON public.article_likes
FOR DELETE
USING (auth.uid() = user_id);

-- Create index for faster queries
CREATE INDEX idx_article_likes_article_id ON public.article_likes(article_id);
CREATE INDEX idx_article_likes_user_id ON public.article_likes(user_id);