import { motion } from "framer-motion";
import { useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";

declare global {
  interface Window {
    twttr?: {
      widgets: {
        load: () => void;
      };
    };
    instgrm?: {
      Embeds: {
        process: () => void;
      };
    };
  }
}

const SocialMediaSection = () => {
  const { t } = useLanguage();

  useEffect(() => {
    // Load Twitter widget script
    const twitterScript = document.createElement("script");
    twitterScript.src = "https://platform.twitter.com/widgets.js";
    twitterScript.async = true;
    twitterScript.charset = "utf-8";
    document.body.appendChild(twitterScript);

    // Load Instagram embed script
    const instagramScript = document.createElement("script");
    instagramScript.src = "https://www.instagram.com/embed.js";
    instagramScript.async = true;
    document.body.appendChild(instagramScript);

    // Load TikTok embed script
    const tiktokScript = document.createElement("script");
    tiktokScript.src = "https://www.tiktok.com/embed.js";
    tiktokScript.async = true;
    document.body.appendChild(tiktokScript);

    return () => {
      // Cleanup scripts on unmount
      document.body.removeChild(twitterScript);
      document.body.removeChild(instagramScript);
      document.body.removeChild(tiktokScript);
    };
  }, []);

  return (
    <section id="social" className="py-20 md:py-32 relative">
      <div className="container mx-auto px-4 md:px-6">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
            {t('social.title')} <span className="text-gradient-gold">{t('social.titleHighlight')}</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            {t('social.description')}
          </p>
        </motion.div>

        {/* Social Embeds Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Twitter/X Embed */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="glass-card p-4 rounded-2xl overflow-hidden"
          >
            <div className="flex items-center gap-2 mb-4">
              <svg className="w-5 h-5 text-foreground" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
              <span className="font-semibold text-foreground">Twitter / X</span>
            </div>
            <a
              className="twitter-timeline"
              data-height="400"
              data-theme="dark"
              data-chrome="noheader nofooter noborders transparent"
              href="https://twitter.com/menlifoot"
            >
              Loading tweets...
            </a>
          </motion.div>

          {/* Instagram Embed */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="glass-card p-4 rounded-2xl overflow-hidden"
          >
            <div className="flex items-center gap-2 mb-4">
              <svg className="w-5 h-5 text-foreground" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
              </svg>
              <span className="font-semibold text-foreground">Instagram</span>
            </div>
            <div className="flex flex-col items-center justify-center h-[400px] bg-surface-elevated rounded-xl">
              <a
                href="https://www.instagram.com/menlifoot/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center gap-4 text-center p-6 hover:opacity-80 transition-opacity"
              >
                <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-500 p-[3px]">
                  <div className="w-full h-full rounded-full bg-surface-elevated flex items-center justify-center">
                    <span className="text-2xl font-bold text-foreground">M</span>
                  </div>
                </div>
                <div>
                  <p className="font-semibold text-foreground">@menlifoot</p>
                  <p className="text-sm text-muted-foreground mt-1">Follow us on Instagram</p>
                </div>
                <span className="px-6 py-2 bg-gradient-gold text-primary-foreground font-medium rounded-lg">
                  View Profile
                </span>
              </a>
            </div>
          </motion.div>

          {/* TikTok Embed */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="glass-card p-4 rounded-2xl overflow-hidden"
          >
            <div className="flex items-center gap-2 mb-4">
              <svg className="w-5 h-5 text-foreground" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
              </svg>
              <span className="font-semibold text-foreground">TikTok</span>
            </div>
            <div className="flex flex-col items-center justify-center h-[400px] bg-surface-elevated rounded-xl">
              <a
                href="https://www.tiktok.com/@menlifoot"
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center gap-4 text-center p-6 hover:opacity-80 transition-opacity"
              >
                <div className="w-20 h-20 rounded-full bg-gradient-to-r from-[#69C9D0] via-foreground to-[#EE1D52] p-[3px]">
                  <div className="w-full h-full rounded-full bg-surface-elevated flex items-center justify-center">
                    <span className="text-2xl font-bold text-foreground">M</span>
                  </div>
                </div>
                <div>
                  <p className="font-semibold text-foreground">@menlifoot</p>
                  <p className="text-sm text-muted-foreground mt-1">Follow us on TikTok</p>
                </div>
                <span className="px-6 py-2 bg-foreground text-background font-medium rounded-lg">
                  View Profile
                </span>
              </a>
            </div>
          </motion.div>
        </div>

        {/* Follow CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="flex justify-center gap-4 mt-12"
        >
          <a
            href="https://twitter.com/menlifoot"
            target="_blank"
            rel="noopener noreferrer"
            className="p-3 glass-card hover-lift rounded-full"
            aria-label="Follow on Twitter"
          >
            <svg className="w-6 h-6 text-foreground" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
          </a>
          <a
            href="https://www.instagram.com/menlifoot/"
            target="_blank"
            rel="noopener noreferrer"
            className="p-3 glass-card hover-lift rounded-full"
            aria-label="Follow on Instagram"
          >
            <svg className="w-6 h-6 text-foreground" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
            </svg>
          </a>
          <a
            href="https://www.tiktok.com/@menlifoot"
            target="_blank"
            rel="noopener noreferrer"
            className="p-3 glass-card hover-lift rounded-full"
            aria-label="Follow on TikTok"
          >
            <svg className="w-6 h-6 text-foreground" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
            </svg>
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default SocialMediaSection;
