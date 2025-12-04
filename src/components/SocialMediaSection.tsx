import { motion } from "framer-motion";
import { Heart, MessageCircle, Share2, MoreHorizontal, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

const socialPosts = [
  {
    id: 1,
    platform: "twitter",
    username: "@MenlifootHQ",
    handle: "@menlifoot",
    time: "2h ago",
    content: "What a match! The energy in the stadium was absolutely electric. Champions League nights hit different ⚽🔥",
    likes: 2456,
    comments: 189,
    avatar: "M",
  },
  {
    id: 2,
    platform: "twitter",
    username: "TheBlues",
    handle: "@theblues",
    time: "4h ago",
    content: "Training session complete. The squad is looking sharp ahead of the weekend clash. Watch Now 👀",
    likes: 1823,
    comments: 94,
    avatar: "TB",
    hasMedia: true,
  },
  {
    id: 3,
    platform: "twitter",
    username: "FootballDaily",
    handle: "@footballdaily",
    time: "5h ago",
    content: "BREAKING: Major transfer announcement expected in the next 24 hours. Stay tuned for exclusive coverage.",
    likes: 5672,
    comments: 412,
    avatar: "FD",
  },
  {
    id: 4,
    platform: "twitter",
    username: "RedDevils",
    handle: "@reddevils",
    time: "6h ago",
    content: "Match day vibes! Who's ready for tonight's clash? Drop your score predictions below 👇",
    likes: 3891,
    comments: 567,
    avatar: "RD",
    hasMedia: true,
  },
  {
    id: 5,
    platform: "twitter",
    username: "Squateb",
    handle: "@squateb",
    time: "8h ago",
    content: "I'm here to answer all of your football questions. Ask me anything about tactics, history, or predictions!",
    likes: 982,
    comments: 234,
    avatar: "SQ",
  },
];

const SocialMediaSection = () => {
  return (
    <section id="social" className="py-20 md:py-32 relative">
      <div className="container mx-auto px-4 md:px-6">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-12"
        >
          <div>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-2">
              Social <span className="text-gradient-gold">Media</span>
            </h2>
            <p className="text-muted-foreground text-lg">
              Join the conversation with football fans worldwide
            </p>
          </div>
          <Button variant="outline" className="self-start md:self-auto">
            <ExternalLink className="h-4 w-4 mr-2" />
            Follow Us
          </Button>
        </motion.div>

        {/* Social Feed Grid */}
        <div className="columns-1 md:columns-2 lg:columns-3 gap-4 space-y-4">
          {socialPosts.map((post, index) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="break-inside-avoid"
            >
              <article className="glass-card p-5 hover-lift group">
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-gold flex items-center justify-center">
                      <span className="text-sm font-bold text-primary-foreground">{post.avatar}</span>
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-medium text-foreground text-sm">{post.username}</span>
                        <svg className="w-4 h-4 text-primary" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                        </svg>
                      </div>
                      <span className="text-xs text-muted-foreground">{post.time}</span>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </div>

                {/* Content */}
                <p className="text-foreground/90 text-sm leading-relaxed mb-4">
                  {post.content}
                </p>

                {/* Media Placeholder */}
                {post.hasMedia && (
                  <div className="rounded-xl overflow-hidden mb-4 bg-surface-elevated aspect-video flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-2">
                        <svg className="w-6 h-6 text-primary" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      </div>
                      <span className="text-xs text-muted-foreground">Watch Video</span>
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex items-center justify-between pt-3 border-t border-border/50">
                  <div className="flex items-center gap-4">
                    <button className="flex items-center gap-1.5 text-muted-foreground hover:text-red-500 transition-colors group/btn">
                      <Heart className="h-4 w-4 group-hover/btn:fill-current" />
                      <span className="text-xs">{post.likes.toLocaleString()}</span>
                    </button>
                    <button className="flex items-center gap-1.5 text-muted-foreground hover:text-primary transition-colors">
                      <MessageCircle className="h-4 w-4" />
                      <span className="text-xs">{post.comments}</span>
                    </button>
                    <button className="text-muted-foreground hover:text-primary transition-colors">
                      <Share2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </article>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SocialMediaSection;
