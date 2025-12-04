import { motion } from "framer-motion";
import { Twitter, Instagram, Youtube, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";

const Footer = () => {
  const { t } = useLanguage();

  const footerLinks = {
    [t('footer.company')]: [
      { key: 'aboutUs', label: t('footer.aboutUs') },
      { key: 'careers', label: t('footer.careers') },
      { key: 'press', label: t('footer.press') },
      { key: 'contact', label: t('footer.contact') },
    ],
    [t('footer.content')]: [
      { key: 'podcast', label: t('footer.podcast') },
      { key: 'news', label: t('footer.news') },
      { key: 'videos', label: t('footer.videos') },
      { key: 'newsletter', label: t('footer.newsletter') },
    ],
    [t('footer.support')]: [
      { key: 'helpCenter', label: t('footer.helpCenter') },
      { key: 'privacyPolicy', label: t('footer.privacyPolicy') },
      { key: 'termsOfService', label: t('footer.termsOfService') },
      { key: 'cookiePolicy', label: t('footer.cookiePolicy') },
    ],
  };

  const socialLinks = [
    { icon: Twitter, href: "#", label: "Twitter" },
    { icon: Instagram, href: "#", label: "Instagram" },
    { icon: Youtube, href: "#", label: "YouTube" },
  ];

  return (
    <footer className="relative pt-20 pb-8 border-t border-border/30">
      <div className="absolute inset-0 bg-gradient-to-t from-primary/5 to-transparent pointer-events-none" />
      
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-16">
          {/* Brand */}
          <div className="lg:col-span-2">
            <motion.a
              href="#home"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="inline-block"
            >
              <span className="font-display text-3xl font-bold text-gradient-gold">
                Menlifoot
              </span>
            </motion.a>
            <p className="text-muted-foreground mt-4 mb-6 max-w-sm">
              {t('footer.tagline')}
            </p>
            
            {/* Newsletter */}
            <div className="flex gap-2">
              <input
                type="email"
                placeholder={t('footer.emailPlaceholder')}
                className="flex-1 bg-surface-elevated rounded-lg px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
              <Button variant="gold" size="icon">
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="font-medium text-foreground mb-4">{title}</h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.key}>
                    <a
                      href="#"
                      className="text-muted-foreground hover:text-primary transition-colors text-sm"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-8 border-t border-border/30">
          <p className="text-sm text-muted-foreground">
            © 2024 Menlifoot. {t('footer.rights')}
          </p>
          <div className="flex items-center gap-4">
            {socialLinks.map((social) => (
              <a
                key={social.label}
                href={social.href}
                aria-label={social.label}
                className="w-10 h-10 rounded-full bg-surface-elevated flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all"
              >
                <social.icon className="h-5 w-5" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;