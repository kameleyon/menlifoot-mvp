-- Create article_translations table to store pre-translated content
CREATE TABLE public.article_translations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  article_id UUID NOT NULL REFERENCES public.articles(id) ON DELETE CASCADE,
  language TEXT NOT NULL,
  title TEXT NOT NULL,
  subtitle TEXT,
  summary TEXT,
  content TEXT NOT NULL,
  keywords TEXT[] DEFAULT '{}'::text[],
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(article_id, language)
);

-- Enable Row Level Security
ALTER TABLE public.article_translations ENABLE ROW LEVEL SECURITY;

-- Create policies - anyone can read translations for published articles
CREATE POLICY "Anyone can view translations for published articles"
ON public.article_translations
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.articles 
    WHERE articles.id = article_translations.article_id 
    AND articles.is_published = true
  )
);

-- Admins and editors can manage translations
CREATE POLICY "Admins and editors can manage translations"
ON public.article_translations
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'editor'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'editor'::app_role));

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_article_translations_updated_at
BEFORE UPDATE ON public.article_translations
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create index for faster lookups
CREATE INDEX idx_article_translations_article_language 
ON public.article_translations(article_id, language);