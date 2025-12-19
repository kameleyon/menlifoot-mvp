import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Newspaper, Calendar, Share2, Bookmark, BookmarkCheck, ExternalLink, Tag } from "lucide-react";
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
  created_at: string;
}

const ArticlesSection = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [savedArticles, setSavedArticles] = useState<string[]>([]);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const { t } = useLanguage();
  const { toast } = useToast();

  useEffect(() => {
    fetchArticles();
    // Load saved articles from localStorage
    const saved = localStorage.getItem('savedArticles');
    if (saved) {
      setSavedArticles(JSON.parse(saved));
    }
  }, []);

  const fetchArticles = async () => {
    try {
      const { data, error } = await supabase
        .from('articles')
        .select('*')
        .eq('is_published', true)
        .order('published_at', { ascending: false })
        .limit(6);

      if (error) throw error;
      setArticles(data || []);
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

  const handleShare = async (article: Article) => {
    const shareData = {
      title: article.title,
      text: article.summary || article.title,
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(`${article.title} - ${window.location.href}`);
        toast({ title: t('articles.copied'), description: t('articles.linkCopied') });
      }
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString(undefined, {
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
    <section id="articles" className="py-20 md:py-32 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent" />
      
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
        </motion.div>

        {/* Articles Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((article, index) => (
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
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          {selectedArticle && (
            <>
              <DialogHeader>
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
              
              {selectedArticle.thumbnail_url && (
                <div className="aspect-video overflow-hidden rounded-lg my-4">
                  <img
                    src={selectedArticle.thumbnail_url}
                    alt={selectedArticle.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              {selectedArticle.summary && (
                <p className="text-muted-foreground italic border-l-2 border-primary pl-4 mb-4">
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
                <div className="flex flex-wrap gap-2 mt-6 pt-4 border-t border-border/50">
                  {selectedArticle.keywords.map((keyword, i) => (
                    <span key={i} className="text-xs text-muted-foreground bg-muted/50 px-3 py-1 rounded-full flex items-center gap-1">
                      <Tag className="h-3 w-3" />
                      {keyword}
                    </span>
                  ))}
                </div>
              )}

              <div className="flex items-center gap-3 mt-6 pt-4 border-t border-border/50">
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
            </>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default ArticlesSection;
