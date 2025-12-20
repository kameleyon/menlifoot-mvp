import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { motion } from "framer-motion";
import { Newspaper, Calendar, Share2, Bookmark, BookmarkCheck, Tag, Loader2, Filter, User, TrendingUp, Clock, X, ChevronDown } from "lucide-react";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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
  author: string | null;
  view_count: number;
}

interface TranslatedArticle extends Article {
  translated?: boolean;
}

// Cache for translated articles
const translationCache: Map<string, TranslatedArticle> = new Map();

// Available categories including Haiti World Cup 26
const CATEGORIES = [
  'All',
  'Haiti World Cup 26',
  'Transfers',
  'Champions League',
  'Ligue 1',
  'Premier League',
  'La Liga',
  'Serie A',
  'World Cup',
  'Analysis'
];

type SortOption = 'latest' | 'oldest' | 'popular';

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
  
  // Filter states
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [authorFilter, setAuthorFilter] = useState<string>('All');
  const [sortBy, setSortBy] = useState<SortOption>('latest');
  const [showFilters, setShowFilters] = useState(false);

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
        .order('published_at', { ascending: false });

      if (error) throw error;
      const fetchedArticles = (data || []).map(article => ({
        ...article,
        original_language: article.original_language || 'en',
        author: article.author || null,
        view_count: article.view_count || 0
      }));
      setArticles(fetchedArticles);
    } catch (error) {
      console.error('Error fetching articles:', error);
    } finally {
      setLoading(false);
    }
  };

  // Get unique authors from articles
  const uniqueAuthors = useMemo(() => {
    const authors = articles
      .map(a => a.author)
      .filter((author): author is string => !!author);
    return ['All', ...Array.from(new Set(authors))];
  }, [articles]);

  // Filter and sort articles
  const filteredAndSortedArticles = useMemo(() => {
    let result = translatedArticles.length > 0 
      ? translatedArticles 
      : articles.map(a => ({ ...a, translated: false }));

    // Apply category filter
    if (categoryFilter !== 'All') {
      result = result.filter(a => a.category.toLowerCase() === categoryFilter.toLowerCase());
    }

    // Apply author filter
    if (authorFilter !== 'All') {
      result = result.filter(a => a.author === authorFilter);
    }

    // Apply sorting
    result = [...result].sort((a, b) => {
      switch (sortBy) {
        case 'latest':
          return new Date(b.published_at || b.created_at).getTime() - new Date(a.published_at || a.created_at).getTime();
        case 'oldest':
          return new Date(a.published_at || a.created_at).getTime() - new Date(b.published_at || b.created_at).getTime();
        case 'popular':
          return (b.view_count || 0) - (a.view_count || 0);
        default:
          return 0;
      }
    });

    return result;
  }, [articles, translatedArticles, categoryFilter, authorFilter, sortBy]);

  const activeFiltersCount = (categoryFilter !== 'All' ? 1 : 0) + (authorFilter !== 'All' ? 1 : 0);

  const clearFilters = () => {
    setCategoryFilter('All');
    setAuthorFilter('All');
    setSortBy('latest');
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
    const siteUrl = window.location.origin;
    const shareUrl = `${siteUrl}/#articles`;
    const shareTextWithUrl = `${article.title} - ${shareUrl}`;

    // Always try clipboard first as it's more reliable
    try {
      await navigator.clipboard.writeText(shareTextWithUrl);
      toast({ title: t('articles.copied'), description: t('articles.linkCopied') });
    } catch (error) {
      // Clipboard failed, try Web Share API as fallback
      if (navigator.share) {
        try {
          await navigator.share({
            title: article.title,
            text: article.summary || article.title,
            url: shareUrl,
          });
        } catch (shareError) {
          if ((shareError as Error).name !== 'AbortError') {
            console.error('Error sharing:', shareError);
          }
        }
      } else {
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
          className="text-center mb-12"
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

        {/* Filters Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-8"
        >
          <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
            {/* Filter Toggle & Active Filters */}
            <div className="flex items-center gap-3">
              <Button
                variant={showFilters ? "default" : "outline"}
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
                className="gap-2"
              >
                <Filter className="h-4 w-4" />
                Filters
                {activeFiltersCount > 0 && (
                  <span className="ml-1 px-1.5 py-0.5 text-xs bg-primary-foreground text-primary rounded-full">
                    {activeFiltersCount}
                  </span>
                )}
              </Button>

              {activeFiltersCount > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearFilters}
                  className="text-muted-foreground hover:text-foreground gap-1"
                >
                  <X className="h-3 w-3" />
                  Clear all
                </Button>
              )}
            </div>

            {/* Sort Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2">
                  {sortBy === 'latest' && <Clock className="h-4 w-4" />}
                  {sortBy === 'oldest' && <Calendar className="h-4 w-4" />}
                  {sortBy === 'popular' && <TrendingUp className="h-4 w-4" />}
                  {sortBy === 'latest' ? 'Latest' : sortBy === 'oldest' ? 'Oldest' : 'Popular'}
                  <ChevronDown className="h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-background border border-border z-50">
                <DropdownMenuItem onClick={() => setSortBy('latest')} className="gap-2 cursor-pointer">
                  <Clock className="h-4 w-4" />
                  Latest First
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy('oldest')} className="gap-2 cursor-pointer">
                  <Calendar className="h-4 w-4" />
                  Oldest First
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy('popular')} className="gap-2 cursor-pointer">
                  <TrendingUp className="h-4 w-4" />
                  Most Popular
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Expanded Filters */}
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="glass-card p-4 space-y-4"
            >
              {/* Category Filter */}
              <div>
                <label className="text-sm font-medium text-muted-foreground mb-2 block">Category</label>
                <div className="flex flex-wrap gap-2">
                  {CATEGORIES.map((category) => (
                    <button
                      key={category}
                      onClick={() => setCategoryFilter(category)}
                      className={`px-3 py-1.5 text-xs font-medium rounded-full transition-all ${
                        categoryFilter === category
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-surface text-muted-foreground hover:text-foreground hover:bg-muted'
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>

              {/* Author Filter */}
              {uniqueAuthors.length > 1 && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground mb-2 block">Author</label>
                  <div className="flex flex-wrap gap-2">
                    {uniqueAuthors.map((author) => (
                      <button
                        key={author}
                        onClick={() => setAuthorFilter(author)}
                        className={`px-3 py-1.5 text-xs font-medium rounded-full transition-all flex items-center gap-1 ${
                          authorFilter === author
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-surface text-muted-foreground hover:text-foreground hover:bg-muted'
                        }`}
                      >
                        <User className="h-3 w-3" />
                        {author}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {/* Results count */}
          <div className="text-sm text-muted-foreground mt-4">
            Showing {filteredAndSortedArticles.length} of {articles.length} articles
          </div>
        </motion.div>

        {/* Articles Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAndSortedArticles.map((article, index) => (
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
                {/* Category, Author & Date */}
                <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-primary font-medium uppercase tracking-wider px-2 py-1 bg-primary/10 rounded">
                      {article.category}
                    </span>
                    {article.author && (
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <User className="h-3 w-3" />
                        {article.author}
                      </span>
                    )}
                  </div>
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
