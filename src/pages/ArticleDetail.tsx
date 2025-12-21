import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Eye, Heart, Share2, Calendar, User, Clock, Tag } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import ReactMarkdown from "react-markdown";

interface Article {
  id: string;
  title: string;
  subtitle: string | null;
  summary: string | null;
  content: string;
  category: string;
  thumbnail_url: string | null;
  author: string | null;
  published_at: string | null;
  view_count: number | null;
  keywords: string[] | null;
}

const ArticleDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { t, language } = useLanguage();
  const { user } = useAuth();
  const { toast } = useToast();
  const [article, setArticle] = useState<Article | null>(null);
  const [similarArticles, setSimilarArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [likeCount, setLikeCount] = useState(0);
  const [userLiked, setUserLiked] = useState(false);

  useEffect(() => {
    if (id) {
      fetchArticle(id);
      incrementViewCount(id);
    }
  }, [id]);

  useEffect(() => {
    if (id) {
      fetchLikes(id);
    }
  }, [id, user]);

  const fetchArticle = async (articleId: string) => {
    setLoading(true);
    const { data, error } = await supabase
      .from("articles")
      .select("*")
      .eq("id", articleId)
      .eq("is_published", true)
      .maybeSingle();

    if (error) {
      console.error("Error fetching article:", error);
    } else if (data) {
      setArticle(data);
      fetchSimilarArticles(data.category, articleId);
    }
    setLoading(false);
  };

  const fetchSimilarArticles = async (category: string, currentId: string) => {
    const { data } = await supabase
      .from("articles")
      .select("*")
      .eq("category", category)
      .eq("is_published", true)
      .neq("id", currentId)
      .order("published_at", { ascending: false })
      .limit(4);

    if (data) {
      setSimilarArticles(data);
    }
  };

  const incrementViewCount = async (articleId: string) => {
    const { data: current } = await supabase
      .from("articles")
      .select("view_count")
      .eq("id", articleId)
      .maybeSingle();

    if (current) {
      await supabase
        .from("articles")
        .update({ view_count: (current.view_count || 0) + 1 })
        .eq("id", articleId);
    }
  };

  const fetchLikes = async (articleId: string) => {
    // Get total likes
    const { data: allLikes } = await supabase
      .from("article_likes")
      .select("id")
      .eq("article_id", articleId);

    setLikeCount(allLikes?.length || 0);

    // Check if user liked
    if (user) {
      const { data: userLike } = await supabase
        .from("article_likes")
        .select("id")
        .eq("article_id", articleId)
        .eq("user_id", user.id)
        .maybeSingle();

      setUserLiked(!!userLike);
    }
  };

  const handleLike = async () => {
    if (!user) {
      toast({
        title: t('articles.loginToLike') || "Login required",
        description: t('articles.loginToLikeDesc') || "Please login to like articles",
        variant: "destructive",
      });
      return;
    }

    if (!id) return;

    if (userLiked) {
      await supabase
        .from("article_likes")
        .delete()
        .eq("article_id", id)
        .eq("user_id", user.id);

      setLikeCount((prev) => Math.max(0, prev - 1));
      setUserLiked(false);
    } else {
      await supabase
        .from("article_likes")
        .insert({ article_id: id, user_id: user.id });

      setLikeCount((prev) => prev + 1);
      setUserLiked(true);
    }
  };

  const handleShare = async () => {
    if (!article) return;

    const shareUrl = window.location.href;

    if (navigator.share) {
      try {
        await navigator.share({
          title: article.title,
          text: article.summary || article.title,
          url: shareUrl,
        });
      } catch (err) {
        console.log("Share cancelled");
      }
    } else {
      await navigator.clipboard.writeText(shareUrl);
      toast({
        title: t('articles.linkCopied') || "Link copied!",
        description: t('articles.shareSuccess') || "Article link copied to clipboard",
      });
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString(language === 'fr' ? 'fr-FR' : language === 'es' ? 'es-ES' : 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const estimateReadTime = (content: string) => {
    const words = content.split(/\s+/).length;
    const minutes = Math.ceil(words / 200);
    return `${minutes} min read`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-28 pb-20">
          <div className="container mx-auto px-4 max-w-4xl">
            <Skeleton className="h-8 w-32 mb-6" />
            <Skeleton className="h-12 w-3/4 mb-4" />
            <Skeleton className="h-6 w-1/2 mb-8" />
            <Skeleton className="h-96 w-full rounded-2xl mb-8" />
            <div className="space-y-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-28 pb-20 text-center">
          <h1 className="text-2xl font-bold mb-4">{t('articles.notFound') || 'Article not found'}</h1>
          <Link to="/articles">
            <Button variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              {t('articles.backToArticles') || 'Back to Articles'}
            </Button>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Article Header */}
      <section className="pt-28 pb-8">
        <div className="container mx-auto px-4 max-w-4xl">
          <Link to="/articles">
            <Button variant="ghost" className="mb-6 -ml-2 text-muted-foreground hover:text-foreground">
              <ArrowLeft className="h-4 w-4 mr-2" />
              {t('articles.backToArticles') || 'Back to Articles'}
            </Button>
          </Link>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Badge variant="secondary" className="mb-4 bg-primary/90 text-primary-foreground">
              {article.category}
            </Badge>

            <h1 className="font-display text-3xl md:text-5xl font-bold text-foreground mb-4 leading-tight">
              {article.title}
            </h1>

            {article.subtitle && (
              <p className="text-xl text-muted-foreground mb-6">{article.subtitle}</p>
            )}

            {/* Meta Info */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-8 pb-8 border-b border-border/50">
              {article.author && (
                <span className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  {article.author}
                </span>
              )}
              <span className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                {formatDate(article.published_at)}
              </span>
              <span className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                {estimateReadTime(article.content)}
              </span>
              <span className="flex items-center gap-2">
                <Eye className="h-4 w-4" />
                {(article.view_count || 0) + 1} {t('articles.views') || 'views'}
              </span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Featured Image */}
      {article.thumbnail_url && (
        <section className="pb-8">
          <div className="container mx-auto px-4 max-w-5xl">
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              className="rounded-2xl overflow-hidden"
            >
              <img
                src={article.thumbnail_url}
                alt={article.title}
                className="w-full h-auto max-h-[600px] object-cover"
              />
            </motion.div>
          </div>
        </section>
      )}

      {/* Article Content */}
      <section className="pb-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="prose prose-lg prose-invert max-w-none prose-p:text-foreground prose-headings:text-foreground prose-strong:text-foreground prose-a:text-primary"
          >
            <ReactMarkdown>{article.content}</ReactMarkdown>
          </motion.div>

          {/* Keywords */}
          {article.keywords && article.keywords.length > 0 && (
            <div className="mt-8 pt-8 border-t border-border/50">
              <div className="flex items-center gap-2 flex-wrap">
                <Tag className="h-4 w-4 text-muted-foreground" />
                {article.keywords.map((keyword) => (
                  <Badge key={keyword} variant="outline" className="text-xs">
                    {keyword}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center gap-4 mt-8 pt-8 border-t border-border/50">
            <Button
              variant={userLiked ? "default" : "outline"}
              onClick={handleLike}
              className={userLiked ? "bg-red-500 hover:bg-red-600" : ""}
            >
              <Heart className={`h-4 w-4 mr-2 ${userLiked ? "fill-current" : ""}`} />
              {likeCount} {t('articles.likes') || 'Likes'}
            </Button>
            <Button variant="outline" onClick={handleShare}>
              <Share2 className="h-4 w-4 mr-2" />
              {t('articles.share') || 'Share'}
            </Button>
          </div>
        </div>
      </section>

      {/* Similar Articles */}
      {similarArticles.length > 0 && (
        <section className="py-12 bg-surface-elevated/50">
          <div className="container mx-auto px-4">
            <h2 className="font-display text-2xl font-bold text-foreground mb-8">
              {t('articles.similarArticles') || 'Similar Articles'}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {similarArticles.map((similar) => (
                <Link to={`/articles/${similar.id}`} key={similar.id}>
                  <motion.article
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="group rounded-xl overflow-hidden bg-background hover:shadow-lg transition-all"
                  >
                    <div
                      className="h-40 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                      style={{
                        backgroundImage: similar.thumbnail_url
                          ? `url(${similar.thumbnail_url})`
                          : 'linear-gradient(135deg, hsl(var(--primary)), hsl(var(--primary)/0.5))',
                      }}
                    />
                    <div className="p-4">
                      <Badge variant="outline" className="mb-2 text-xs">
                        {similar.category}
                      </Badge>
                      <h3 className="font-semibold text-foreground line-clamp-2 group-hover:text-primary transition-colors">
                        {similar.title}
                      </h3>
                      <p className="text-xs text-muted-foreground mt-2">
                        {formatDate(similar.published_at)}
                      </p>
                    </div>
                  </motion.article>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <Footer />
    </div>
  );
};

export default ArticleDetail;
