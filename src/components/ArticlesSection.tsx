import { useState, useEffect, useCallback, useRef } from "react";
import { motion } from "framer-motion";
import { Newspaper, Calendar, Share2, Bookmark, BookmarkCheck, Tag, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface Article {
  id: string;
  title: string;
  subtitle: string | null;
  summary: string | null;
  content: string;
  category: string;
  keywords: string[];
  thumbnail_url: string | null;
  published_at: string | null;
  original_language: string;
  created_at: string;
}

interface TranslatedArticle extends Article {
  translated?: boolean;
}

// Cache for translated articles
const translationCache: Map<string, TranslatedArticle> = new Map();

const ArticlesSection = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [translatedArticles, setTranslatedArticles] = useState<TranslatedArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [translating, setTranslating] = useState(false);
  const [savedArticles, setSavedArticles] = useState<string[]>([]);
  const [selectedArticle, setSelectedArticle] = useState<TranslatedArticle | null>(null);
  const { t, language } = useLanguage();
  const { toast } = useToast();
  const translationInProgress = useRef(false);

  // Map language codes to locales for date formatting
  const localeMap: Record<string, string> = {
    en: 'en-US',
    fr: 'fr-FR',
    es: 'es-ES',
    ht: 'ht-HT'
  };

  const getCacheKey = (articleId: string, targetLang: string) => `${articleId}_${targetLang}`;

  const translateArticle = useCallback(async (article: Article, targetLanguage: string): Promise<TranslatedArticle> => {
    // If article is already in target language, return as-is
    if (article.original_language === targetLanguage) {
      return { ...article, translated: false };
    }

    // Check cache first
    const cacheKey = getCacheKey(article.id, targetLanguage);
    const cached = translationCache.get(cacheKey);
    if (cached) {
      return cached;
    }

    try {
      const { data, error } = await supabase.functions.invoke('translate-article', {
        body: {
          title: article.title,
          subtitle: article.subtitle,
          summary: article.summary,
          content: article.content,
          keywords: article.keywords,
          fromLanguage: article.original_language,
          toLanguage: targetLanguage
        }
      });

      if (error) throw error;

      const translated: TranslatedArticle = {
        ...article,
        title: data.title || article.title,
        subtitle: data.subtitle || article.subtitle,
        summary: data.summary || article.summary,
        content: data.content || article.content,
        keywords: data.keywords || article.keywords,
        translated: true
      };

      // Cache the result
      translationCache.set(cacheKey, translated);
      return translated;
    } catch (error) {
      console.error('Translation error:', error);
      return { ...article, translated: false };
    }
  }, []);

  const translateAllArticles = useCallback(async (articlesToTranslate: Article[], targetLanguage: string) => {
    if (translationInProgress.current) return;
    translationInProgress.current = true;
    
    // Check if any article needs translation
    const needsTranslation = articlesToTranslate.some(
      article => article.original_language !== targetLanguage && 
                 !translationCache.has(getCacheKey(article.id, targetLanguage))
    );

    if (needsTranslation) {
      setTranslating(true);
    }

    try {
      const translated = await Promise.all(
        articlesToTranslate.map(article => translateArticle(article, targetLanguage))
      );
      setTranslatedArticles(translated);
    } catch (error) {
      console.error('Translation batch error:', error);
      setTranslatedArticles(articlesToTranslate.map(a => ({ ...a, translated: false })));
    } finally {
      setTranslating(false);
      translationInProgress.current = false;
    }
  }, [translateArticle]);

  useEffect(() => {
    fetchArticles();
    // Load saved articles from localStorage
    const saved = localStorage.getItem('savedArticles');
    if (saved) {
      setSavedArticles(JSON.parse(saved));
    }
  }, []);

  // Translate articles when language changes
  useEffect(() => {
    if (articles.length > 0) {
      translateAllArticles(articles, language);
    }
  }, [language, articles, translateAllArticles]);

  const fetchArticles = async () => {
    try {
      const { data, error } = await supabase
        .from('articles')
        .select('*')
        .eq('is_published', true)
        .order('published_at', { ascending: false })
        .limit(6);

      if (error) throw error;
      const fetchedArticles = (data || []).map(article => ({
        ...article,
        original_language: article.original_language || 'en'
      }));
      setArticles(fetchedArticles);
    } catch (error) {
      console.error('Error fetching articles:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = (articleId: string) => {
    let newSaved: string[];
    if (savedArticles.includes(articleId)) {
      newSaved = savedArticles.filter(id => id !== articleId);
      toast({ title: t('articles.removed'), description: t('articles.removedFromSaved') });
    } else {
      newSaved = [...savedArticles, articleId];
      toast({ title: t('articles.saved'), description: t('articles.addedToSaved') });
    }
    setSavedArticles(newSaved);
    localStorage.setItem('savedArticles', JSON.stringify(newSaved));
  };

  const handleShare = async (article: TranslatedArticle) => {
    const shareData = {
      title: article.title,
      text: article.summary || article.title,
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
        toast({ title: t('articles.shared'), description: t('articles.sharedSuccess') });
      } else {
        await navigator.clipboard.writeText(`${article.title} - ${window.location.href}`);
        toast({ title: t('articles.copied'), description: t('articles.linkCopied') });
      }
    } catch (error) {
      if (!navigator.share) {
        console.error('Error sharing:', error);
        toast({ title: t('articles.shareError'), description: t('articles.shareErrorDesc'), variant: 'destructive' });
      }
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString(localeMap[language] || 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <section className="py-20 md:py-32 relative overflow-hidden">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </div>
      </section>
    );
  }

  if (articles.length === 0) {
    return null;
  }

  const displayArticles = translatedArticles.length > 0 ? translatedArticles : articles.map(a => ({ ...a, translated: false }));

  return (
    <section id="articles" className="py-20 md:py-32 relative overflow-hidden bg-background">
      {/* Solid black background - gradient removed */}
      
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/30 bg-primary/5 text-primary text-xs uppercase tracking-wider mb-4">
            <Newspaper className="h-3 w-3" />
            {t('articles.badge')}
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-light tracking-wider mb-4 text-gradient-gold uppercase" style={{ fontFamily: "'Oswald', sans-serif" }}>
            {t('articles.title')} <span>{t('articles.titleHighlight')}</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            {t('articles.description')}
          </p>
          {translating && (
            <div className="flex items-center justify-center gap-2 mt-4 text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span className="text-sm">{t('articles.translating')}</span>
            </div>
          )}
        </motion.div>

        {/* Articles Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayArticles.map((article, index) => (
            <motion.article
              key={article.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 * index }}
              className="glass-card overflow-hidden hover-lift group cursor-pointer"
              onClick={() => setSelectedArticle(article)}
            >
              {/* Thumbnail */}
              {article.thumbnail_url && (
                <div className="aspect-video overflow-hidden">
                  <img
                    src={article.thumbnail_url}
                    alt={article.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
              )}
              
              <div className="p-5">
                {/* Category & Date */}
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs text-primary font-medium uppercase tracking-wider px-2 py-1 bg-primary/10 rounded">
                    {article.category}
                  </span>
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {formatDate(article.published_at)}
                  </span>
                </div>

                {/* Title */}
                <h3 className="font-display text-xl font-semibold text-foreground mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                  {article.title}
                </h3>

                {/* Subtitle */}
                {article.subtitle && (
                  <p className="text-muted-foreground text-sm font-medium mb-2 line-clamp-1">
                    {article.subtitle}
                  </p>
                )}

                {/* Summary */}
                {article.summary && (
                  <p className="text-muted-foreground text-sm line-clamp-2 mb-4">
                    {article.summary}
                  </p>
                )}

                {/* Keywords */}
                {article.keywords && article.keywords.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-4">
                    {article.keywords.slice(0, 3).map((keyword, i) => (
                      <span key={i} className="text-xs text-muted-foreground bg-muted/50 px-2 py-0.5 rounded flex items-center gap-1">
                        <Tag className="h-2.5 w-2.5" />
                        {keyword}
                      </span>
                    ))}
                  </div>
                )}

                {/* Actions */}
                <div className="flex items-center gap-2 pt-3 border-t border-border/50">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex-1"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSave(article.id);
                    }}
                  >
                    {savedArticles.includes(article.id) ? (
                      <BookmarkCheck className="h-4 w-4 mr-1 text-primary" />
                    ) : (
                      <Bookmark className="h-4 w-4 mr-1" />
                    )}
                    {t('articles.save')}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex-1"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleShare(article);
                    }}
                  >
                    <Share2 className="h-4 w-4 mr-1" />
                    {t('articles.share')}
                  </Button>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>

      {/* Article Detail Dialog */}
      <Dialog open={!!selectedArticle} onOpenChange={() => setSelectedArticle(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto bg-background">
          {selectedArticle && (
            <div className="space-y-4">
              {selectedArticle.thumbnail_url && (
                <div className="aspect-video overflow-hidden rounded-lg -mx-6 -mt-6">
                  <img
                    src={selectedArticle.thumbnail_url}
                    alt={selectedArticle.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              
              <DialogHeader className="pt-2">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs text-primary font-medium uppercase tracking-wider px-2 py-1 bg-primary/10 rounded">
                    {selectedArticle.category}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {formatDate(selectedArticle.published_at)}
                  </span>
                </div>
                <DialogTitle className="text-2xl font-display">
                  {selectedArticle.title}
                </DialogTitle>
                {selectedArticle.subtitle && (
                  <p className="text-muted-foreground font-medium">
                    {selectedArticle.subtitle}
                  </p>
                )}
              </DialogHeader>

              {selectedArticle.summary && (
                <p className="text-muted-foreground italic border-l-2 border-primary pl-4">
                  {selectedArticle.summary}
                </p>
              )}

              <div className="prose prose-invert max-w-none">
                {selectedArticle.content.split('\n').map((paragraph, i) => (
                  <p key={i} className="text-foreground mb-4">
                    {paragraph}
                  </p>
                ))}
              </div>

              {selectedArticle.keywords && selectedArticle.keywords.length > 0 && (
                <div className="pt-4 border-t border-border/50">
                  <p className="text-xs text-muted-foreground mb-2">{t('articles.keywords')}</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedArticle.keywords.map((keyword, i) => (
                      <span key={i} className="text-xs text-muted-foreground bg-muted/50 px-3 py-1 rounded-full flex items-center gap-1">
                        <Tag className="h-3 w-3" />
                        {keyword}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex items-center gap-3 pt-4 border-t border-border/50">
                <Button
                  variant="outline"
                  onClick={() => handleSave(selectedArticle.id)}
                >
                  {savedArticles.includes(selectedArticle.id) ? (
                    <BookmarkCheck className="h-4 w-4 mr-2 text-primary" />
                  ) : (
                    <Bookmark className="h-4 w-4 mr-2" />
                  )}
                  {savedArticles.includes(selectedArticle.id) ? t('articles.saved') : t('articles.save')}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleShare(selectedArticle)}
                >
                  <Share2 className="h-4 w-4 mr-2" />
                  {t('articles.share')}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default ArticlesSection;
