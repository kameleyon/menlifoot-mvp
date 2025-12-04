import { motion } from "framer-motion";
import { Calendar, MapPin, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import worldcupImage from "@/assets/worldcup-2026.png";

const newsItems = [
  {
    id: 1,
    category: "World Cup 2026",
    title: "USA, Mexico & Canada Prepare for Historic Tournament",
    excerpt: "The first-ever 48-team World Cup will be the biggest in history, spanning three nations.",
    date: "Dec 3, 2024",
    isHighlighted: true,
  },
  {
    id: 2,
    category: "Transfer News",
    title: "Winter Window: Top 10 Deals to Watch",
    excerpt: "From Mbappé rumors to Premier League targets, here's what to expect in January.",
    date: "Dec 2, 2024",
    isHighlighted: false,
  },
  {
    id: 3,
    category: "Champions League",
    title: "Knockout Stage Draw Preview",
    excerpt: "Who will face whom? Breaking down the potential matchups for the UCL last 16.",
    date: "Dec 1, 2024",
    isHighlighted: false,
  },
];

const NewsSection = () => {
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
            World Cup 2026
          </span>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-4">
            Latest <span className="text-gradient-gold">News</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Stay updated with the latest soccer news from around the world
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Featured World Cup Card */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="glass-card overflow-hidden hover-lift group"
          >
            <div className="relative aspect-video overflow-hidden">
              <img
                src={worldcupImage}
                alt="World Cup 2026"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
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
              <Button variant="gold" className="w-full">
                Explore Coverage
              </Button>
            </div>
          </motion.div>

          {/* News List */}
          <div className="space-y-4">
            {newsItems.map((item, index) => (
              <motion.article
                key={item.id}
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
                  <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </motion.article>
            ))}

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Button variant="outline" className="w-full mt-4">
                View All News
              </Button>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NewsSection;
