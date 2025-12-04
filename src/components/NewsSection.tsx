import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Calendar, MapPin, Trophy, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import worldcupImage from "@/assets/worldcup-2026-hero.png";

interface NewsItem {
  id: string;
  category: string;
  title: string;
  excerpt: string;
  date: string;
  image?: string;
  type: string;
}

const NewsSection = () => {
  const [worldCupNews, setWorldCupNews] = useState<NewsItem[]>([]);
  const [otherNews, setOtherNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/football-news?category=all&limit=20`,
        {
          headers: {
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
            'Content-Type': 'application/json'
          }
        }
      );

      const result = await response.json();
      
      if (result.success && result.news) {
        // Split news into World Cup and other categories
        const wcNews = result.news.filter((item: NewsItem) => 
          item.category === 'World Cup 2026' || item.type === 'worldcup'
        );
        const other = result.news.filter((item: NewsItem) => 
          item.category !== 'World Cup 2026' && item.type !== 'worldcup'
        );
        
        setWorldCupNews(wcNews.slice(0, 3));
        setOtherNews(other.slice(0, 3));
      }
    } catch (error) {
      console.error('Error fetching news:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="news" className="py-20 md:py-32 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent" />
      
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
            <Trophy className="h-3 w-3" />
            Live Updates
          </span>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-4">
            Latest <span className="text-gradient-gold">News</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Stay updated with the latest soccer news from around the world
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8 items-start">
          {/* Left: World Cup 2026 Section */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-4"
          >
            {/* Featured World Cup Card */}
            <div className="glass-card overflow-hidden hover-lift group">
              <div className="relative aspect-[16/10] overflow-hidden">
                <img
                  src={worldcupImage}
                  alt="World Cup 2026"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <span className="inline-block px-3 py-1 rounded-full bg-primary text-primary-foreground text-xs font-medium mb-2">
                    World Cup 2026
                  </span>
                  <h3 className="font-display text-2xl md:text-3xl font-bold text-foreground">
                    The Road to 2026
                  </h3>
                </div>
              </div>
              <div className="p-6">
                <p className="text-muted-foreground mb-4">
                  Everything you need to know about the upcoming FIFA World Cup hosted across USA, Mexico, and Canada.
                </p>
                <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-6">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="h-4 w-4 text-primary" />
                    June - July 2026
                  </span>
                  <span className="flex items-center gap-1.5">
                    <MapPin className="h-4 w-4 text-primary" />
                    USA • Mexico • Canada
                  </span>
                </div>
                <Link to="/news?category=worldcup">
                  <Button variant="gold" className="w-full">
                    Explore Coverage
                  </Button>
                </Link>
              </div>
            </div>

            {/* World Cup Qualifier Results */}
            {loading ? (
              <div className="glass-card p-8 flex items-center justify-center">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
              </div>
            ) : worldCupNews.length > 0 ? (
              <div className="space-y-3">
                <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wider px-1">
                  Latest Qualifier Results
                </h4>
                {worldCupNews.map((item, index) => (
                  <motion.article
                    key={item.id}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: 0.1 * index }}
                    className="glass-card p-4 hover-lift cursor-pointer group"
                  >
                    <span className="text-xs text-primary font-medium uppercase tracking-wider">
                      {item.category}
                    </span>
                    <h5 className="font-display text-base font-semibold text-foreground mt-1 group-hover:text-primary transition-colors">
                      {item.title}
                    </h5>
                    <p className="text-muted-foreground text-sm line-clamp-1 mt-1">
                      {item.excerpt}
                    </p>
                  </motion.article>
                ))}
              </div>
            ) : null}
          </motion.div>

          {/* Right: Other News by Category */}
          <div className="space-y-4">
            <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wider px-1">
              Latest Updates
            </h4>
            
            {loading ? (
              <div className="glass-card p-8 flex items-center justify-center">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
              </div>
            ) : otherNews.length > 0 ? (
              otherNews.map((item, index) => (
                <motion.article
                  key={item.id}
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.1 * index }}
                  className="glass-card p-5 hover-lift group cursor-pointer"
                >
                  <div className="flex items-start gap-4">
                    {item.image && (
                      <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <span className="text-xs text-primary font-medium uppercase tracking-wider">
                        {item.category}
                      </span>
                      <h4 className="font-display text-lg md:text-xl font-semibold text-foreground mt-1 mb-2 group-hover:text-primary transition-colors line-clamp-2">
                        {item.title}
                      </h4>
                      <p className="text-muted-foreground text-sm line-clamp-2">
                        {item.excerpt}
                      </p>
                      <span className="text-xs text-muted-foreground mt-3 block">
                        {new Date(item.date).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </motion.article>
              ))
            ) : (
              // Fallback static content if API fails
              <div className="space-y-4">
                {[
                  {
                    category: "Transfer News",
                    title: "Winter Window: Top 10 Deals to Watch",
                    excerpt: "From transfer rumors to Premier League targets.",
                    date: "Dec 2, 2024",
                  },
                  {
                    category: "Champions League",
                    title: "Knockout Stage Draw Preview",
                    excerpt: "Who will face whom? Breaking down the potential matchups.",
                    date: "Dec 1, 2024",
                  },
                  {
                    category: "Premier League",
                    title: "Weekend Match Preview",
                    excerpt: "Key fixtures and predictions for the upcoming round.",
                    date: "Nov 30, 2024",
                  },
                ].map((item, index) => (
                  <motion.article
                    key={index}
                    initial={{ opacity: 0, x: 30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.1 * index }}
                    className="glass-card p-5 hover-lift group cursor-pointer"
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex-1 min-w-0">
                        <span className="text-xs text-primary font-medium uppercase tracking-wider">
                          {item.category}
                        </span>
                        <h4 className="font-display text-lg md:text-xl font-semibold text-foreground mt-1 mb-2 group-hover:text-primary transition-colors">
                          {item.title}
                        </h4>
                        <p className="text-muted-foreground text-sm line-clamp-2">
                          {item.excerpt}
                        </p>
                        <span className="text-xs text-muted-foreground mt-3 block">
                          {item.date}
                        </span>
                      </div>
                    </div>
                  </motion.article>
                ))}
              </div>
            )}

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Link to="/news">
                <Button variant="outline" className="w-full mt-4">
                  View All News
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NewsSection;
