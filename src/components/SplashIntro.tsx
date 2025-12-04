import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface SplashIntroProps {
  onComplete: () => void;
}

const SplashIntro = ({ onComplete }: SplashIntroProps) => {
  const [showIntro, setShowIntro] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowIntro(false);
      setTimeout(onComplete, 200); // Faster transition to content
    }, 5000); // 5 second intro
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
            <motion.div
              initial={{ scale: 1.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="mb-4"
            >
              <motion.span
                initial={{ letterSpacing: "0.5em", opacity: 0 }}
                animate={{ letterSpacing: "0.1em", opacity: 1 }}
                transition={{ duration: 1, delay: 0.5 }}
                className="font-display text-6xl md:text-8xl font-bold text-gradient-gold"
              >
                Menlifoot
              </motion.span>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.2 }}
              className="flex items-center justify-center gap-2"
            >
              <div className="h-px w-6 md:w-12 bg-gradient-to-r from-transparent to-primary" />
              <span className="text-xs md:text-sm uppercase tracking-[0.2em] md:tracking-[0.3em] text-muted-foreground whitespace-nowrap">
                Your Soccer Companion
              </span>
              <div className="h-px w-6 md:w-12 bg-gradient-to-l from-transparent to-primary" />
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SplashIntro;
