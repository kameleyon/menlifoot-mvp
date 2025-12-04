import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Calendar, Trophy, Newspaper, Users, Activity, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { Link, useSearchParams, useLocation } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

interface NewsItem {
  id: string;
  category: string;
  title: string;
  excerpt: string;
  content?: string;
  date: string;
  image?: string;
  type: string;
  source?: string;
  url?: string;
  author?: string;
}

const categoryIcons: Record<string, any> = {
  'World Cup 2026': Trophy,
  'Transfer News': Users,
  'Champions League': Star,
  'Premier League': Newspaper,
  'Injury Report': Activity,
};

const News = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState(searchParams.get('category') || 'all');
  const [selectedArticle, setSelectedArticle] = useState<NewsItem | null>(
    location.state?.selectedArticle || null
  );

  const categories = [
    { id: 'all', label: 'All News', icon: Newspaper },
    { id: 'worldcup', label: 'World Cup 2026', icon: Trophy },
    { id: 'transfers', label: 'Transfers', icon: Users },
    { id: 'champions', label: 'Champions League', icon: Star },
    { id: 'matches', label: 'Matches', icon: Calendar },
    { id: 'injuries', label: 'Injuries', icon: Activity },
  ];

  useEffect(() => {
    fetchNews();
  }, [activeCategory]);

  const fetchNews = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('football-news', {
        body: null,
        headers: { 'Content-Type': 'application/json' }
      });

      // Handle the function call differently - use query params via URL
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/football-news?category=${activeCategory}&limit=50`,
        {
          headers: {
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
            'Content-Type': 'application/json'
          }
        }
      );

      const result = await response.json();
      
      if (result.success) {
        setNews(result.news);
      } else {
        console.error('Failed to fetch news:', result.error);
      }
    } catch (error) {
      console.error('Error fetching news:', error);
    } finally {
      setLoading(false);
    }
  };

  const getCategoryIcon = (category: string) => {
    const Icon = categoryIcons[category] || Newspaper;
    return <Icon className="h-4 w-4" />;
  };

  if (selectedArticle) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="pt-24 pb-20">
          <div className="container mx-auto px-4 md:px-6 max-w-4xl">
            <Button
              variant="ghost"
              onClick={() => setSelectedArticle(null)}
              className="mb-6 gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to News
            </Button>

            <motion.article
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card p-8"
            >
              <div className="flex items-center gap-2 mb-4">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
                  {getCategoryIcon(selectedArticle.category)}
                  {selectedArticle.category}
                </span>
                <span className="text-sm text-muted-foreground flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5" />
                  {new Date(selectedArticle.date).toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </span>
              </div>

              <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-6">
                {selectedArticle.title}
              </h1>

              {selectedArticle.image && (
                <div className="relative aspect-video rounded-xl overflow-hidden mb-6">
                  <img
                    src={selectedArticle.image}
                    alt={selectedArticle.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              <div className="prose prose-invert max-w-none">
                <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                  {selectedArticle.excerpt}
                </p>

                {selectedArticle.content && selectedArticle.content !== selectedArticle.excerpt && (
                  <p className="text-muted-foreground leading-relaxed">
                    {selectedArticle.content}
                  </p>
                )}

                {/* Source Info */}
                <div className="mt-8 p-6 rounded-xl bg-surface/50 border border-border/50">
                  <div className="flex items-center justify-between flex-wrap gap-4">
                    <div>
                      {selectedArticle.source && (
                        <p className="text-sm text-muted-foreground">
                          Source: <span className="text-foreground font-medium">{selectedArticle.source}</span>
                        </p>
                      )}
                      {selectedArticle.author && (
                        <p className="text-sm text-muted-foreground mt-1">
                          By: <span className="text-foreground">{selectedArticle.author}</span>
                        </p>
                      )}
                    </div>
                    {selectedArticle.url && (
                      <a
                        href={selectedArticle.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
                      >
                        Read Full Article
                        <ArrowLeft className="h-4 w-4 rotate-180" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </motion.article>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-20">
        <div className="container mx-auto px-4 md:px-6">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-4">
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Link>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-4">
              Football <span className="text-gradient-gold">News</span>
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Your source for the latest football news, transfers, and match updates
            </p>
          </motion.div>

          {/* Category Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex flex-wrap justify-center gap-2 mb-12"
          >
            {categories.map((cat) => (
              <Button
                key={cat.id}
                variant={activeCategory === cat.id ? 'gold' : 'outline'}
                size="sm"
                onClick={() => {
                  setActiveCategory(cat.id);
                  setSearchParams(cat.id === 'all' ? {} : { category: cat.id });
                }}
                className="gap-2"
              >
                <cat.icon className="h-4 w-4" />
                {cat.label}
              </Button>
            ))}
          </motion.div>

          {/* News Grid */}
          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="glass-card p-6 animate-pulse">
                  <div className="h-4 bg-muted rounded w-1/3 mb-4" />
                  <div className="h-6 bg-muted rounded w-full mb-2" />
                  <div className="h-4 bg-muted rounded w-2/3" />
                </div>
              ))}
            </div>
          ) : news.length === 0 ? (
            <div className="text-center py-20">
              <Newspaper className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-2">No news available</h3>
              <p className="text-muted-foreground">Check back later for updates</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {news.map((item, index) => (
                <motion.article
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => setSelectedArticle(item)}
                  className="glass-card overflow-hidden hover-lift cursor-pointer group"
                >
                  {item.image && (
                    <div className="aspect-video overflow-hidden">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                  )}
                  <div className="p-5">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-medium">
                        {getCategoryIcon(item.category)}
                        {item.category}
                      </span>
                    </div>
                    <h3 className="font-display text-lg font-semibold text-foreground mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-muted-foreground text-sm line-clamp-2 mb-3">
                      {item.excerpt}
                    </p>
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {new Date(item.date).toLocaleDateString()}
                    </span>
                  </div>
                </motion.article>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default News;
