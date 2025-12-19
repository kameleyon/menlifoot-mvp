-- Add author column to articles table
ALTER TABLE public.articles ADD COLUMN IF NOT EXISTS author TEXT;

-- Add view_count for popularity tracking
ALTER TABLE public.articles ADD COLUMN IF NOT EXISTS view_count INTEGER DEFAULT 0;