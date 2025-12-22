-- Add is_editorial column to articles table for editorial content
ALTER TABLE public.articles ADD COLUMN is_editorial boolean NOT NULL DEFAULT false;