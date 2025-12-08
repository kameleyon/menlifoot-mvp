import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import menlifootBall from "@/assets/menlifoot-ball.png";

interface SplashIntroProps {
  onComplete: () => void;
}

const SplashIntro = ({ onComplete }: SplashIntroProps) => {
  const [showIntro, setShowIntro] = useState(true);
  const { t } = useLanguage();

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowIntro(false);
      setTimeout(onComplete, 200);
    }, 5000);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {showIntro && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-background"
        >
          <div className="text-center">
            {/* Animated Soccer Ball Logo */}
            <motion.div
              initial={{ scale: 0, rotate: -180, y: -100 }}
              animate={{ scale: 1, rotate: 0, y: 0 }}
              transition={{ 
                duration: 1.2, 
                ease: [0.34, 1.56, 0.64, 1],
                type: "spring",
                stiffness: 100
              }}
              className="mb-6"
            >
              <motion.img
                src={menlifootBall}
                alt="Menlifoot"
                className="h-20 w-20 md:h-28 md:w-28 mx-auto"
                animate={{ 
                  rotate: [0, 10, -10, 5, -5, 0],
                  scale: [1, 1.05, 1]
                }}
                transition={{ 
                  duration: 2,
                  delay: 1.2,
                  ease: "easeInOut"
                }}
              />
              {/* Glow effect */}
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: [0, 0.6, 0.3], scale: [0.5, 1.2, 1] }}
                transition={{ duration: 1.5, delay: 0.5 }}
                className="absolute inset-0 -z-10 blur-3xl bg-primary/30 rounded-full"
              />
            </motion.div>

            {/* MENLIFOOT Text */}
            <motion.div
              initial={{ scale: 1.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1, ease: "easeOut", delay: 0.3 }}
              className="mb-4"
            >
              <motion.span
                initial={{ letterSpacing: "0.5em", opacity: 0 }}
                animate={{ letterSpacing: "0.15em", opacity: 1 }}
                transition={{ duration: 1, delay: 0.8 }}
                className="font-display text-5xl md:text-8xl font-light tracking-wider text-gradient-gold uppercase"
              >
                MENLIFOOT
              </motion.span>
            </motion.div>

            {/* Tagline */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.5 }}
              className="flex items-center justify-center gap-2"
            >
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: "3rem" }}
                transition={{ duration: 0.5, delay: 1.8 }}
                className="h-px bg-gradient-to-r from-transparent to-primary" 
              />
              <span className="text-xs md:text-sm uppercase tracking-[0.2em] md:tracking-[0.3em] text-muted-foreground whitespace-nowrap">
                {t('splash.companion')}
              </span>
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: "3rem" }}
                transition={{ duration: 0.5, delay: 1.8 }}
                className="h-px bg-gradient-to-l from-transparent to-primary" 
              />
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SplashIntro;
