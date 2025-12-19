-- Add original_language column to articles table
ALTER TABLE public.articles 
ADD COLUMN original_language text NOT NULL DEFAULT 'en';

-- Add comment for clarity
COMMENT ON COLUMN public.articles.original_language IS 'The language the article was originally written in (en, fr, es, ht)';